// src/store/api/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      fullName: string;
      email: string;
      role: string;
      image?: string;
      verified: boolean;
      isSubscribed: boolean;
    };
    accessToken: string;
    refreshToken: string;
  };
}

interface ForgotPasswordRequest {
  email: string;
}

interface VerifyEmailRequest {
  email: string;
  oneTimeCode: number;
}

interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = Cookies.get("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/sign-in",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data.accessToken) {
            // Store tokens in cookies
            Cookies.set("accessToken", data.data.accessToken, { expires: 7 });
            Cookies.set("refreshToken", data.data.refreshToken, {
              expires: 30,
            });
          }
        } catch (error) {
          console.error("Login error:", error);
        }
      },
    }),

    forgotPassword: builder.mutation<ApiResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: "/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    verifyEmail: builder.mutation<ApiResponse, VerifyEmailRequest>({
      query: (data) => ({
        url: "/verify-email",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<ApiResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: "/password-reset",
        method: "POST",
        body: data,
      }),
    }),

    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (data) => ({
        url: "/change-password",
        method: "POST",
        body: data,
      }),
    }),

    refreshToken: builder.mutation<ApiResponse, { token: string }>({
      query: (data) => ({
        url: "/refresh-token",
        method: "POST",
        body: data,
      }),
    }),

    resendOtp: builder.mutation<ApiResponse, { email: string }>({
      query: (data) => ({
        url: "/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useRefreshTokenMutation,
  useResendOtpMutation,
} = authApi;
