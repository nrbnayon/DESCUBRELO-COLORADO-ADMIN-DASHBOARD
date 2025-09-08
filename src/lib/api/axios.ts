// src/lib/api/axios.ts
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import Cookies from "js-cookie";

// Constants
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const COOKIE_ACCESS_TOKEN = "accessToken";
const COOKIE_REFRESH_TOKEN = "refreshToken";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}

interface ApiError {
  message: string;
  code?: string | number;
  status?: number;
}

// Track if we're currently refreshing to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

/**
 * Process the failed request queue after token refresh
 */
const processQueue = (error: ApiError | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Refresh the access token using the refresh token
 */
const refreshAccessToken = async (): Promise<string> => {
  try {
    const refreshToken = Cookies.get(COOKIE_REFRESH_TOKEN);

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post<RefreshTokenResponse>(
      `${API_BASE_URL}/auth/refresh-token`,
      { token: refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (response.data.success && response.data.data.accessToken) {
      const newAccessToken = response.data.data.accessToken;

      // Save the new access token
      Cookies.set(COOKIE_ACCESS_TOKEN, newAccessToken, { path: "/" });

      // Dispatch event for cross-tab sync
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth-token-changed"));
      }

      return newAccessToken;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    // If refresh fails, clear all tokens and redirect to login
    clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw error;
  }
};

/**
 * Create a configured axios instance
 */
const createAxiosInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: true,
    ...config,
  });

  // Request interceptor - Add auth token to headers
  instance.interceptors.request.use(
    (config) => {
      const accessToken = Cookies.get(COOKIE_ACCESS_TOKEN);
      if (accessToken && config.headers) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }

      // Handle multipart/form-data
      if (config.data instanceof FormData) {
        if (
          config.headers &&
          config.headers["Content-Type"] === "multipart/form-data"
        ) {
          delete config.headers["Content-Type"];
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - Handle errors and refresh tokens
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      // If error is 401 and we haven't already tried to refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers && token) {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
              }
              return instance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newAccessToken = await refreshAccessToken();
          processQueue(null, newAccessToken);

          // Retry the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
          }

          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(createApiError(refreshError as AxiosError), null);
          return Promise.reject(createApiError(refreshError as AxiosError));
        } finally {
          isRefreshing = false;
        }
      }

      // For other 401 errors or if refresh fails, clear tokens and redirect
      if (error.response?.status === 401) {
        clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      return Promise.reject(createApiError(error));
    }
  );

  return instance;
};

/**
 * Create standardized API error
 */
const createApiError = (error: AxiosError): ApiError => {
  const response = error.response;
  const data = response?.data as Record<string, unknown>;

  return {
    message:
      typeof data?.error === "string"
        ? data.error
        : typeof data?.message === "string"
        ? data.message
        : error.message || "An unexpected error occurred",
    code:
      typeof data?.code === "string" || typeof data?.code === "number"
        ? data.code
        : error.code,
    status: response?.status,
  };
};

/**
 * Save authentication tokens
 */
export const saveTokens = (tokens: AuthTokens): void => {
  try {
    // Set cookies with appropriate options
    const cookieOptions = {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    };

    Cookies.set(COOKIE_ACCESS_TOKEN, tokens.accessToken, cookieOptions);
    Cookies.set(COOKIE_REFRESH_TOKEN, tokens.refreshToken, cookieOptions);

    // Dispatch event for cross-tab sync
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth-token-changed"));
    }
  } catch (error) {
    console.error("Failed to save tokens:", error);
    throw new Error("Failed to save authentication tokens");
  }
};

/**
 * Clear authentication tokens
 */
export const clearTokens = (): void => {
  try {
    Cookies.remove(COOKIE_ACCESS_TOKEN, { path: "/" });
    Cookies.remove(COOKIE_REFRESH_TOKEN, { path: "/" });

    // Clear local storage and session storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("userPreferences");
      sessionStorage.clear();
      window.dispatchEvent(new CustomEvent("auth-token-changed"));
    }
  } catch (error) {
    console.error("Failed to clear tokens:", error);
  }
};

/**
 * Get the current access token
 */
export const getAccessToken = (): string | undefined => {
  return Cookies.get(COOKIE_ACCESS_TOKEN);
};

/**
 * Get the current refresh token
 */
export const getRefreshToken = (): string | undefined => {
  return Cookies.get(COOKIE_REFRESH_TOKEN);
};

/**
 * Check if user has valid tokens
 */
export const hasValidTokens = (): boolean => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  return !!(accessToken && refreshToken);
};

/**
 * Manually refresh token (can be called from components)
 */
export const manualRefreshToken = async (): Promise<string> => {
  try {
    return await refreshAccessToken();
  } catch (error) {
    console.error("token refresh error::", error);
    throw new Error("Failed to refresh token manually");
  }
};

/**
 * Check if the current access token is expired (basic check)
 */
export const isTokenExpired = (): boolean => {
  const token = getAccessToken();
  if (!token) return true;

  try {
    // Decode JWT token (basic check without verification)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    // Check if token expires in the next 5 minutes
    return payload.exp < currentTime + 300;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

/**
 * Logout user and clear all data
 */
export const logout = async (): Promise<void> => {
  try {
    clearTokens();

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Logout error:", error);
    clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
};

// Create and export the configured axios instance
const apiEndpoint = createAxiosInstance();

export default apiEndpoint;
export type { AuthTokens, ApiError, RefreshTokenResponse };
