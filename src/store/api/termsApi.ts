// src/store/api/termsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

interface Terms {
  _id: string;
  id: string;
  title: string;
  description: string;
  category: string;
  status: "active" | "inactive";
  order: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface TermsResponse {
  success: boolean;
  message: string;
  data: Terms[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalTerms: number;
    activeTerms: number;
    inactiveTerms: number;
    totalCategories: number;
  };
}

interface SingleTermsResponse {
  success: boolean;
  message: string;
  data: Terms;
}

interface CreateTermsRequest {
  title: string;
  description: string;
  category: string;
  status?: "active" | "inactive";
  order?: number;
}

export const termsApi = createApi({
  reducerPath: "termsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/terms-conditions`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = Cookies.get("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Terms", "TermsList"],
  endpoints: (builder) => ({
    getAllTerms: builder.query<
      TermsResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        status?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
      }
    >({
      query: (params) => ({
        url: "/",
        params,
      }),
      providesTags: ["TermsList"],
    }),

    getTermsById: builder.query<SingleTermsResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Terms", id }],
    }),

    getActiveTerms: builder.query<{ success: boolean; data: Terms[] }, void>({
      query: () => "/active",
      providesTags: ["TermsList"],
    }),

    createTerms: builder.mutation<SingleTermsResponse, CreateTermsRequest>({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TermsList"],
    }),

    updateTerms: builder.mutation<
      SingleTermsResponse,
      { id: string; data: Partial<CreateTermsRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Terms", "TermsList"],
    }),

    deleteTerms: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TermsList"],
    }),

    reorderTerms: builder.mutation<
      unknown,
      Array<{ id: string; order: number }>
    >({
      query: (reorderData) => ({
        url: "/reorder/bulk",
        method: "PATCH",
        body: { reorderData },
      }),
      invalidatesTags: ["TermsList"],
    }),
  }),
});

export const {
  useGetAllTermsQuery,
  useGetTermsByIdQuery,
  useGetActiveTermsQuery,
  useCreateTermsMutation,
  useUpdateTermsMutation,
  useDeleteTermsMutation,
  useReorderTermsMutation,
} = termsApi;
