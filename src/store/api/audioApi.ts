// src/store/api/audioApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

interface Audio {
  _id: string; 
  id?: string; 
  title?: string;
  audioFile: string;
  duration?: number;
  fileSize?: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface AudiosResponse {
  success: boolean;
  message: string;
  data: Audio[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface AudioResponse {
  success: boolean;
  message: string;
  data: Audio;
}

export const audioApi = createApi({
  reducerPath: "audioApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/audios`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = Cookies.get("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Audio", "Audios"],
  endpoints: (builder) => ({
    getAllAudios: builder.query<
      AudiosResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
      }
    >({
      query: (params) => ({
        url: "/",
        params: Object.fromEntries(
          Object.entries(params).filter(([, value]) => value !== undefined)
        ),
      }),
      providesTags: ["Audios"],
    }),

    getAudioById: builder.query<AudioResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Audio", id }],
    }),

    getActiveAudio: builder.query<AudioResponse, void>({
      query: () => "/active",
      providesTags: ["Audios"],
    }),

    createAudio: builder.mutation<AudioResponse, FormData>({
      query: (formData) => ({
        url: "/",
        method: "POST",
        body: formData,
        // Ensure proper headers for multipart/form-data
        headers: {
          // Don't set Content-Type, let browser set it with boundary
        },
        formData: true,
      }),
      invalidatesTags: ["Audios"],
    }),

    updateAudio: builder.mutation<
      AudioResponse,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Audio", id },
        "Audios",
      ],
    }),

    deleteAudio: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Audios"],
    }),
  }),
});

export const {
  useGetAllAudiosQuery,
  useGetAudioByIdQuery,
  useGetActiveAudioQuery,
  useCreateAudioMutation,
  useUpdateAudioMutation,
  useDeleteAudioMutation,
} = audioApi;
