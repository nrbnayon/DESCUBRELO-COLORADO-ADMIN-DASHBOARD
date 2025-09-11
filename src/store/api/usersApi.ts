// src/store/api/usersApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

interface User {
  _id?: string;
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  image?: string;
  phoneNumber?: string;
  phoneCountryCode?: string;
  bio?: string; 
  address?: string; 
  verified: boolean;
  isSubscribed: boolean;
  subscription?: {
    plan: string;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    result: User[];
    totalData: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  phoneCountryCode?: string;
  bio?: string; 
  address?: string; 
}

interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/user`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = Cookies.get("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Users"],
  endpoints: (builder) => ({
    getAllUsers: builder.query<
      UsersResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        status?: string;
        verified?: boolean;
        isSubscribed?: boolean;
      }
    >({
      query: (params) => ({
        url: "/all",
        params,
      }),
      providesTags: ["Users"],
    }),

    getUserById: builder.query<UserResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    getMe: builder.query<UserResponse, void>({
      query: () => "/me",
      providesTags: ["User"],
    }),

    createUser: builder.mutation<unknown, CreateUserRequest>({
      query: (data) => ({
        url: "/sign-up",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    updateProfile: builder.mutation<UserResponse, UpdateProfileRequest>({
      query: (data) => ({
        url: "/profile-update",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User", "Users"],
    }),

    updateProfileImage: builder.mutation<UserResponse, FormData>({
      query: (formData) => ({
        url: "/profile-image",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["User", "Users"],
    }),

    adminUpdateUser: builder.mutation<
      UserResponse,
      { id: string; data: Partial<User> }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User", "Users"],
    }),

    changeUserStatus: builder.mutation<
      UserResponse,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["User", "Users"],
    }),

    deleteUser: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    searchUsers: builder.query<unknown, string>({
      query: (searchTerm) => ({
        url: "/search",
        params: { searchTerm },
      }),
    }),

    registerDeviceToken: builder.mutation<
      unknown,
      { token: string; platform: string }
    >({
      query: (data) => ({
        url: "/register-device-token",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useGetMeQuery,
  useCreateUserMutation,
  useUpdateProfileMutation,
  useUpdateProfileImageMutation,
  useAdminUpdateUserMutation,
  useChangeUserStatusMutation,
  useDeleteUserMutation,
  useSearchUsersQuery,
  useRegisterDeviceTokenMutation,
} = usersApi;
