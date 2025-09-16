// src/store/api/postsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

interface Post {
  _id?: string;
  id: string;
  title: string;
  name?: string;
  description: string;
  images: string[];
  type: string;
  dateRange?: string;
  isFeatured: boolean;
  categories: string[];
  address?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  openingHours?: string;
  price?: number;
  totalEvent?: number;
  socialLinks?: Record<string, string>;
  offlineSupported: boolean;
  offlineData?: unknown;
  status: "active" | "inactive" | "draft" | "pending" | "archived";
  createdAt: string;
  updatedAt: string;
  [key: string]:unknown
}

interface PostsResponse {
  success: boolean;
  message: string;
  data: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalPosts: number;
    activePosts: number;
    featuredPosts: number;
    draftPosts: number;
    inactivePosts: number;
    pendingPosts: number;
    archivedPosts: number;
    offlineSupportedPosts: number;
    typeDistribution: Array<{ _id: string; count: number }>;
    topCategories: Array<{ _id: string; count: number }>;
  };
}

interface PostResponse {
  success: boolean;
  message: string;
  data: Post;
}

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = Cookies.get("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Post", "Posts"],
  endpoints: (builder) => ({
    getAllPosts: builder.query<
      PostsResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        type?: string;
        isFeatured?: boolean;
        categories?: string[];
        location?: string;
        status?: string;
        offlineSupported?: boolean;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
      }
    >({
      query: (params) => ({
        url: "/list/all",
        params,
      }),
      providesTags: ["Posts"],
    }),

    getPostById: builder.query<PostResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Post", id }],
    }),

    getFeaturedPosts: builder.query<{ success: boolean; data: Post[] }, number>(
      {
        query: (limit = 10) => ({
          url: "/featured",
          params: { limit },
        }),
        providesTags: ["Posts"],
      }
    ),

    getPostsByCategory: builder.query<
      { success: boolean; data: Post[] },
      { category: string; limit?: number }
    >({
      query: ({ category, limit = 20 }) => ({
        url: `/category/${category}`,
        params: { limit },
      }),
      providesTags: ["Posts"],
    }),

    getPostsByType: builder.query<
      { success: boolean; data: Post[] },
      { type: string; limit?: number }
    >({
      query: ({ type, limit = 20 }) => ({
        url: `/type/${type}`,
        params: { limit },
      }),
      providesTags: ["Posts"],
    }),

    getNearbyPosts: builder.query<
      { success: boolean; data: Post[] },
      {
        latitude: number;
        longitude: number;
        radius?: number;
        limit?: number;
      }
    >({
      query: (params) => ({
        url: "/nearby",
        params,
      }),
      providesTags: ["Posts"],
    }),

    getUserPosts: builder.query<
      PostsResponse,
      {
        page?: number;
        limit?: number;
        status?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
      }
    >({
      query: (params) => ({
        url: "/my-posts",
        params,
      }),
      providesTags: ["Posts"],
    }),

    searchPosts: builder.query<
      PostsResponse,
      {
        q: string;
        page?: number;
        limit?: number;
        type?: string;
        category?: string;
        location?: string;
      }
    >({
      query: (params) => ({
        url: "/search",
        params,
      }),
      providesTags: ["Posts"],
    }),

    getOfflineSupportedPosts: builder.query<
      { success: boolean; data: Post[] },
      number
    >({
      query: (limit = 50) => ({
        url: "/offline-supported",
        params: { limit },
      }),
      providesTags: ["Posts"],
    }),

    createPost: builder.mutation<PostResponse, FormData>({
      query: (formData) => ({
        url: "/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Posts"],
    }),

    updatePost: builder.mutation<PostResponse, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Post", "Posts"],
    }),

    deletePost: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
    }),

    toggleFeaturedStatus: builder.mutation<PostResponse, string>({
      query: (id) => ({
        url: `/admin/${id}/featured`,
        method: "PATCH",
      }),
      invalidatesTags: ["Post", "Posts"],
    }),

    updatePostStatus: builder.mutation<
      PostResponse,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/admin/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Post", "Posts"],
    }),

    bulkUpdatePosts: builder.mutation<
      unknown,
      {
        postIds: string[];
        updateData: Partial<Post>;
      }
    >({
      query: (data) => ({
        url: "/admin/bulk-update",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Posts"],
    }),

    getPostsAnalytics: builder.query<unknown, string | undefined>({
      query: (userId) => ({
        url: "/admin/analytics",
        params: userId ? { userId } : {},
      }),
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useGetPostByIdQuery,
  useGetFeaturedPostsQuery,
  useGetPostsByCategoryQuery,
  useGetPostsByTypeQuery,
  useGetNearbyPostsQuery,
  useGetUserPostsQuery,
  useSearchPostsQuery,
  useGetOfflineSupportedPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useToggleFeaturedStatusMutation,
  useUpdatePostStatusMutation,
  useBulkUpdatePostsMutation,
  useGetPostsAnalyticsQuery,
} = postsApi;
