// src/store/api/notificationsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

interface Notification {
  id: string;
  title: string;
  content: string;
  priority: "default" | "normal" | "medium" | "high";
  type: string;
  isRead: boolean;
  isGlobal: boolean;
  recipients: string[];
  sentBy: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  sentAt?: string;
  results?: {
    success: number;
    failed: number;
    details: Array<{
      userId: string;
      token: string;
      status: "ok" | "error";
      error?: string;
      messageId?: string;
    }>;
  };
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

interface NotificationsResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    stats: {
      counts: {
        total: number;
        unread: number;
        read: number;
      };
      typeDistribution: Array<{ _id: string; count: number; unreadCount: number }>;
      priorityDistribution: Array<{ _id: string; count: number; unreadCount: number }>;
      summary: {
        totalNotifications: number;
        readNotifications: number;
        unreadNotifications: number;
        readPercentage: number;
      };
    };
  };
}

interface AdminNotificationsResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    stats: {
      totalNotifications: number;
      globalNotifications: number;
      todayNotifications: number;
      typeStats: Array<{ _id: string; count: number }>;
      userStats: {
        totalUserNotifications: number;
        readNotifications: number;
        unreadNotifications: number;
      };
      recentActivity: unknown;
      pushPerformance: unknown;
      summary: unknown;
    };
  };
}

interface NotificationResponse {
  success: boolean;
  message: string;
  data: Notification;
}

interface CreateNotificationRequest {
  title: string;
  content: string;
  priority?: "default" | "normal" | "medium" | "high";
  type?: string;
  isGlobal?: boolean;
  recipients?: string[];
  metadata?: Record<string, unknown>;
}

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = Cookies.get("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Notification", "Notifications"],
  endpoints: (builder) => ({
    // Admin endpoints
    createNotification: builder.mutation<
      NotificationResponse,
      CreateNotificationRequest
    >({
      query: (data) => ({
        url: "/admin/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notifications"],
    }),

    getAllNotifications: builder.query<
      AdminNotificationsResponse,
      {
        page?: number;
        limit?: number;
        type?: string;
        priority?: string;
        isGlobal?: boolean;
        search?: string;
        startDate?: string;
        endDate?: string;
      }
    >({
      query: (params) => ({
        url: "/admin/all",
        params,
      }),
      providesTags: ["Notifications"],
    }),

    getNotificationStats: builder.query<unknown, void>({
      query: () => "/admin/stats",
    }),

    updateNotification: builder.mutation<
      NotificationResponse,
      { id: string; data: Partial<CreateNotificationRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Notification", "Notifications"],
    }),

    deleteNotification: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // User endpoints
    getUserNotifications: builder.query<
      NotificationsResponse,
      {
        page?: number;
        limit?: number;
        type?: string;
        priority?: string;
        isRead?: boolean;
        search?: string;
        startDate?: string;
        endDate?: string;
      }
    >({
      query: (params) => ({
        url: "/user/my-notifications",
        params,
      }),
      providesTags: ["Notifications"],
    }),

    getUserNotificationCounts: builder.query<
      {
        success: boolean;
        data: { total: number; unread: number; read: number };
      },
      void
    >({
      query: () => "/user/counts",
      providesTags: ["Notifications"],
    }),

    markNotificationAsRead: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

    markAllNotificationsAsRead: builder.mutation<unknown, void>({
      query: () => ({
        url: "/user/mark-all-read",
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

    deleteUserNotification: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),

    deleteAllUserNotifications: builder.mutation<unknown, void>({
      query: () => ({
        url: "/user/delete-all",
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // Shared endpoints
    getNotificationById: builder.query<NotificationResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Notification", id }],
    }),
  }),
});

export const {
  useCreateNotificationMutation,
  useGetAllNotificationsQuery,
  useGetNotificationStatsQuery,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
  useGetUserNotificationsQuery,
  useGetUserNotificationCountsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteUserNotificationMutation,
  useDeleteAllUserNotificationsMutation,
  useGetNotificationByIdQuery,
} = notificationsApi;