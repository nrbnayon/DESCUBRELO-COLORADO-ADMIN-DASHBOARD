// src/store/api/categoriesApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

interface Category {
  id: string;
  name: string;
  image: string;
  status: 'active' | 'inactive' | 'pending' | 'blocked' | 'expired';
  createdAt: string;
  updatedAt?: string;
}

interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalCategories: number;
    activeCategories: number;
    inactiveCategories: number;
    pendingCategories: number;
    blockedCategories: number;
    expiredCategories: number;
  };
}

interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}


export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/category`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = Cookies.get('accessToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Category', 'Categories'],
  endpoints: (builder) => ({
    getAllCategories: builder.query<CategoriesResponse, {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }>({
      query: (params) => ({
        url: '/',
        params,
      }),
      providesTags: ['Categories'],
    }),

    getCategoryById: builder.query<CategoryResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    getActiveCategories: builder.query<{ success: boolean; data: Category[] }, void>({
      query: () => '/active',
      providesTags: ['Categories'],
    }),

    getCategoriesByStatus: builder.query<{ success: boolean; data: Category[] }, string>({
      query: (status) => `/status/${status}`,
      providesTags: ['Categories'],
    }),

    createCategory: builder.mutation<CategoryResponse, FormData>({
      query: (formData) => ({
        url: '/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Categories'],
    }),

    updateCategory: builder.mutation<CategoryResponse, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Category', 'Categories'],
    }),

    updateCategoryStatus: builder.mutation<CategoryResponse, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Category', 'Categories'],
    }),

    deleteCategory: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetActiveCategoriesQuery,
  useGetCategoriesByStatusQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useUpdateCategoryStatusMutation,
  useDeleteCategoryMutation,
} = categoriesApi;