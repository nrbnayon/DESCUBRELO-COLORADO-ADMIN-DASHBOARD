// src/store/api/welcomeBannerApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

interface WelcomeBanner {
  _id?: string;
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  targetSections: "welcome" | "hero" | "banner";
  startDate: string;
  endDate: string;
  status: "active" | "inactive" | "draft" | "scheduled" | "expired";
  category: string[];
  order: number;
  clickUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface WelcomeBannersResponse {
  success: boolean;
  message: string;
  data: WelcomeBanner[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalAds: number;
    activeAds: number;
    scheduledAds: number;
    draftAds: number;
    expiredAds: number;
    totalCategories: number;
    welcomeAds: number;
    heroAds: number;
    bannerAds: number;
  };
}

interface WelcomeBannerResponse {
  success: boolean;
  message: string;
  data: WelcomeBanner;
}

export const welcomeBannerApi = createApi({
  reducerPath: "welcomeBannerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/manage-ads`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = Cookies.get("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["WelcomeBanner", "WelcomeBanners"],
  endpoints: (builder) => ({
    getAllWelcomeBanners: builder.query<
      WelcomeBannersResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        targetSections?: string;
        status?: string;
        category?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
      }
    >({
      query: (params) => ({
        url: "/",
        params,
      }),
      providesTags: ["WelcomeBanners"],
    }),

    getWelcomeBannerById: builder.query<WelcomeBannerResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "WelcomeBanner", id }],
    }),

    getActiveWelcomeBanners: builder.query<
      { success: boolean; data: WelcomeBanner[] },
      string | undefined
    >({
      query: (targetSection) => ({
        url: "/active",
        params: targetSection ? { targetSection } : {},
      }),
      providesTags: ["WelcomeBanners"],
    }),

    getAdsByTargetSection: builder.query<
      { success: boolean; data: WelcomeBanner[] },
      string
    >({
      query: (targetSection) => `/section/${targetSection}`,
      providesTags: ["WelcomeBanners"],
    }),

    createWelcomeBanner: builder.mutation<WelcomeBannerResponse, FormData>({
      query: (formData) => ({
        url: "/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["WelcomeBanners"],
    }),

    updateWelcomeBanner: builder.mutation<
      WelcomeBannerResponse,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["WelcomeBanner", "WelcomeBanners"],
    }),

    deleteWelcomeBanner: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["WelcomeBanners"],
    }),

    reorderWelcomeBanners: builder.mutation<
      unknown,
      Array<{ id: string; order: number }>
    >({
      query: (reorderData) => ({
        url: "/reorder/bulk",
        method: "PATCH",
        body: { reorderData },
      }),
      invalidatesTags: ["WelcomeBanners"],
    }),
  }),
});

export const {
  useGetAllWelcomeBannersQuery,
  useGetWelcomeBannerByIdQuery,
  useGetActiveWelcomeBannersQuery,
  useGetAdsByTargetSectionQuery,
  useCreateWelcomeBannerMutation,
  useUpdateWelcomeBannerMutation,
  useDeleteWelcomeBannerMutation,
  useReorderWelcomeBannersMutation,
} = welcomeBannerApi;
