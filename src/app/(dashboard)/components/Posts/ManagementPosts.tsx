// src/app/(dashboard)/components/Posts/ManagementPosts.tsx
"use client";
import { useState } from "react";
import type {
  GenericDataItem,
  ColumnConfig,
  ActionConfig,
  CardConfig,
  FormField,
  SearchFilterConfig,
  OfflineData,
} from "@/types/dynamicCardTypes";
import { DynamicCard3D } from "@/components/common/DynamicCard3D";
import { DynamicDataCreateModal } from "@/components/common/DynamicDataCreateModal";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Lordicon from "@/components/lordicon/lordicon-wrapper";
import Link from "next/link";
import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Music2,
  Twitter,
} from "lucide-react";
import {
  useGetAllPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from "@/store/api/postsApi";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import { useGetActiveCategoriesQuery } from "@/store/api/categoriesApi";

// Define Post interface based on API response
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
  offlineData?: {
    mapTiles?: boolean;
    detailsAvailable?: boolean;
    navigationSupported?: boolean;
    tileRegionName?: string;
    tileBounds?: {
      southwest: { latitude: number; longitude: number };
      northeast: { latitude: number; longitude: number };
    };
    zoomRange?: {
      minZoom: number;
      maxZoom: number;
    };
    [key: string]: unknown;
  };
  status: "active" | "inactive" | "draft" | "pending" | "archived";
  createdAt: string;
  updatedAt: string;
}
interface PostManagementProps {
  itemsPerPage?: number;
  title?: string;
  buttonText?: string;
  pageUrl?: string;
}

export default function ManagementPosts({
  itemsPerPage = 12,
  title = "All Posts",
}: PostManagementProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  const {
    data: postsResponse,
    isLoading,
    refetch,
  } = useGetAllPostsQuery({
    page,
    limit: itemsPerPage,
    ...filters,
  });

  // console.log("Get all post data::", postsResponse);

  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const posts: GenericDataItem[] =
    postsResponse?.data?.map(
      (post): GenericDataItem => ({
        ...post,
        id: post?._id || post?.id,
        images: post.images?.map((img) => getImageUrl(img)) || [],
        offlineData: post.offlineData as OfflineData | undefined,
      })
    ) || [];

  const { data: categoriesResponse } = useGetActiveCategoriesQuery();

  const postColumns: ColumnConfig[] = [
    {
      key: "title",
      label: "Post Title",
      sortable: true,
      searchable: true,
      align: "left",
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={
                Array.isArray(item.images) &&
                item.images.length > 0 &&
                typeof item.images[0] === "string"
                  ? item.images[0]
                  : "/placeholder.svg"
              }
              alt={String(value)}
              className="w-full h-full object-cover"
              width={48}
              height={48}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate">{String(value)}</p>
            {typeof item.name === "string" && item.name && (
              <p className="text-xs text-gray-500 truncate">{item.name}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      type: "textarea",
      sortable: false,
      searchable: true,
      render: (value) => (
        <div className="max-w-xs">
          <p className="text-sm truncate" title={String(value)}>
            {String(value)}
          </p>
        </div>
      ),
    },
    {
      key: "images",
      label: "Images",
      type: "image",
      sortable: false,
      render: (value) => {
        const images = Array.isArray(value) ? value : [];
        return (
          <div className="flex gap-1">
            {images.slice(0, 3).map((img, idx) => (
              <div key={idx} className="w-8 h-8 rounded overflow-hidden">
                <Image
                  src={typeof img === "string" ? img : "/placeholder.svg"}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-full object-cover"
                  width={32}
                  height={32}
                />
              </div>
            ))}
            {images.length > 3 && (
              <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs">
                +{images.length - 3}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "type",
      label: "Type",
      type: "select",
      sortable: true,
      filterable: true,
    },
    {
      key: "dateRange",
      label: "Date Range",
      sortable: true,
    },
    {
      key: "isFeatured",
      label: "Featured",
      type: "checkbox",
      sortable: true,
      filterable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
          }`}
        >
          {value ? "Featured" : "Regular"}
        </span>
      ),
    },
    {
      key: "categories",
      label: "Categories",
      sortable: false,
      searchable: true,
      render: (value) => {
        const categories = Array.isArray(value) ? value : [];
        return (
          <div className="flex flex-wrap gap-1">
            {categories.slice(0, 2).map((cat, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
              >
                {cat}
              </span>
            ))}
            {categories.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{categories.length - 2}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
      searchable: true,
    },
    {
      key: "phone",
      label: "Phone",
      sortable: false,
      searchable: true,
    },
    {
      key: "socialLinks",
      label: "Social Links",
      sortable: false,
      render: (value) => {
        const socialLinks = value as Record<string, string>;
        if (!socialLinks || Object.keys(socialLinks).length === 0) {
          return <span className="text-gray-400">No links</span>;
        }
        return (
          <div className="flex items-center gap-1">
            <div className="flex space-x-1">
              {socialLinks.facebook && (
                <Link
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 p-1 bg-blue-600 rounded-full text-white"
                >
                  <Facebook className="w-4 h-4" />
                </Link>
              )}
              {socialLinks.linkedin && (
                <Link
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 p-1 bg-blue-700 rounded-full text-white"
                >
                  <Linkedin className="w-4 h-4" />
                </Link>
              )}
              {socialLinks.twitter && (
                <Link
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 p-1 bg-black rounded-full text-white"
                >
                  <Twitter className="w-4 h-4" />
                </Link>
              )}
              {socialLinks.instagram && (
                <Link
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 p-1 bg-pink-600 rounded-full text-white"
                >
                  <Instagram className="w-4 h-4" />
                </Link>
              )}
              {socialLinks.tiktok && (
                <Link
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 p-1 bg-black rounded-full text-white"
                >
                  <Music2 className="w-4 h-4" />
                </Link>
              )}
              {socialLinks.website && (
                <Link
                  href={socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 p-1 bg-gray-600 rounded-full text-white"
                >
                  <Globe className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "totalEvent",
      label: "Total Event",
      type: "number",
      sortable: true,
    },
    {
      key: "price",
      label: "Price",
      type: "number",
      sortable: true,
    },
    {
      key: "offlineSupported",
      label: "Offline Support",
      type: "checkbox",
      sortable: true,
      filterable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Supported" : "Not Supported"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      sortable: true,
      filterable: true,
      render: (value) => {
        const statusColors = {
          active: "bg-green-100 text-green-800",
          inactive: "bg-gray-100 text-gray-800",
          draft: "bg-yellow-100 text-yellow-800",
          pending: "bg-blue-100 text-blue-800",
          archived: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded text-xs ${
              statusColors[value as keyof typeof statusColors] ||
              "bg-gray-100 text-gray-600"
            }`}
          >
            {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
          </span>
        );
      },
    },
  ];

  const cardConfig: CardConfig = {
    titleKey: "title",
    subtitleKey: "name",
    imageKey: "images",
    descriptionKey: "description",
    statusKey: "isFeatured",
    metaKeys: ["location", "phone", "totalEvent"],
    showDetailsButton: true,
    primaryAction: {
      key: "edit",
      label: "Edit",
      variant: "outline",
      onClick: (item) => handleEditPost(item as unknown as Post),
    },
    customFields: [
      {
        key: "image",
        label: "Image",
        render: (value, item) => {
          const images = Array.isArray(item.images) ? item.images : [];
          const firstImage =
            images.length > 0 && typeof images[0] === "string"
              ? images[0]
              : null;
          return firstImage || "/placeholder.svg";
        },
      },
    ],
  };

  const searchFilterConfig: SearchFilterConfig = {
    searchPlaceholder: "Search posts by title, description, location...",
    searchKeys: ["title", "description", "type", "location", "categories"],
    enableSort: true,
    sortOptions: [
      { key: "title", label: "Title" },
      { key: "totalEvent", label: "Total Event" },
      { key: "price", label: "Price" },
      { key: "createdAt", label: "Created Date" },
    ],
    filters: [
      {
        key: "type",
        label: "Type",
        type: "select",
        options:
          categoriesResponse?.data?.map((category) => ({
            value: category.name,
            label: category.name,
          })) ||
          Array.from(
            new Set(posts.map((post) => post.type).filter(Boolean))
          ).map((type) => ({
            value: type!,
            label: type!,
          })),
      },
      {
        key: "isFeatured",
        label: "Featured",
        type: "select",
        options: [
          { value: "true", label: "Featured" },
          { value: "false", label: "Regular" },
        ],
      },
      {
        key: "offlineSupported",
        label: "Offline Support",
        type: "select",
        options: [
          { value: "true", label: "Supported" },
          { value: "false", label: "Not Supported" },
        ],
      },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "draft", label: "Draft" },
          { value: "pending", label: "Pending" },
          { value: "archived", label: "Archived" },
        ],
      },
    ],
  };

  const postActions: ActionConfig[] = [
    {
      key: "edit",
      label: "Edit Post",
      icon: (
        <Lordicon
          src="https://cdn.lordicon.com/cbtlerlm.json"
          trigger="hover"
          size={16}
          className="mt-1"
          colors={{
            primary: "#9ca3af",
            secondary: "",
          }}
          stroke={4}
        />
      ),
      variant: "ghost",
      onClick: (item) => handleEditPost(item as unknown as Post),
    },
    {
      key: "delete",
      label: "Delete Post",
      icon: (
        <Lordicon
          src="https://cdn.lordicon.com/jmkrnisz.json"
          trigger="hover"
          size={16}
          className="mt-1"
          colors={{
            primary: "#FF0000",
            secondary: "#FFFFFF",
          }}
          stroke={4}
        />
      ),
      variant: "ghost",
      onClick: (item) => handleDeletePost(item.id),
    },
  ];

  const createFormFields: FormField[] = [
    {
      key: "title",
      label: "Post Title",
      type: "text",
      required: true,
      placeholder: "Enter post title",
      validation: {
        minLength: 5,
        maxLength: 100,
      },
      section: "basic",
      gridCol: "full",
    },
    {
      key: "type",
      label: "Type",
      type: "text",
      required: true,
      // options: categoriesResponse?.data?.map((category) => ({
      //   value: category.name,
      //   label: category.name,
      // })) || [
      //   { value: "Concert", label: "Concert" },
      //   { value: "Food", label: "Food" },
      //   { value: "Hiking", label: "Hiking" },
      // ],
      section: "basic",
      gridCol: "half",
    },
    {
      key: "isFeatured",
      label: "Featured Post",
      type: "switch",
      required: false,
      section: "basic",
      gridCol: "half",
      helpText: "Mark this post as featured to highlight it",
    },
    {
      key: "images",
      label: "Post Images",
      type: "image",
      required: true,
      section: "basic",
      gridCol: "full",
    },
    {
      key: "description",
      label: "Description",
      type: "textarea",
      required: true,
      placeholder: "Enter post description...",
      section: "content",
      gridCol: "full",
    },
    {
      key: "dateRange",
      label: "Date Range",
      type: "text",
      required: false,
      placeholder: "e.g., 2024-01-15 to 2024-02-15",
      section: "content",
      gridCol: "half",
    },
    {
      key: "totalEvent",
      label: "Total Event",
      type: "number",
      required: false,
      placeholder: "Number of events",
      validation: {
        min: 0,
      },
      section: "content",
      gridCol: "half",
    },
    {
      key: "price",
      label: "Price",
      type: "number",
      required: false,
      placeholder: "Enter price",
      validation: {
        min: 0,
      },
      section: "content",
      gridCol: "half",
    },
    {
      key: "address",
      label: "Address",
      type: "text",
      required: false,
      placeholder: "Enter address",
      section: "location",
      gridCol: "full",
    },
    {
      key: "location",
      label: "Location",
      type: "text",
      required: false,
      placeholder: "City, State/Country",
      section: "location",
      gridCol: "half",
    },
    {
      key: "phone",
      label: "Contact Number",
      type: "tel",
      required: false,
      placeholder: "+1234567890",
      section: "location",
      gridCol: "half",
      validation: {
        pattern: "^[\\+]?[0-9]{7,15}$",
        custom: (value: unknown) => {
          if (!value || value === "") return null;
          const cleanPhone = String(value).replace(/[\s\-\(\)]/g, "");
          if (!/^[\+]?[0-9]{7,15}$/.test(cleanPhone)) {
            return "Please enter a valid phone number (7-15 digits)";
          }
          return null;
        },
      },
      helpText: "Enter phone number with country code (e.g., +1234567890)",
    },
    {
      key: "latitude",
      label: "Latitude",
      type: "number",
      required: false,
      placeholder: "37.7749",
      section: "location",
      gridCol: "half",
      validation: {
        min: -90,
        max: 90,
        custom: (value: unknown) => {
          if (!value || value === "") return null;
          const num = parseFloat(String(value));
          if (isNaN(num)) return "Please enter a valid latitude number";
          if (num < -90 || num > 90)
            return "Latitude must be between -90 and 90 degrees";
          return null;
        },
      },
      helpText: "Valid range: -90 to +90 degrees",
    },
    {
      key: "longitude",
      label: "Longitude",
      type: "number",
      required: false,
      placeholder: "-122.4194",
      section: "location",
      gridCol: "half",
      validation: {
        min: -180,
        max: 180,
        custom: (value: unknown) => {
          if (!value || value === "") return null;
          const num = parseFloat(String(value));
          if (isNaN(num)) return "Please enter a valid longitude number";
          if (num < -180 || num > 180)
            return "Longitude must be between -180 and 180 degrees";
          return null;
        },
      },
      helpText: "Valid range: -180 to +180 degrees",
    },
    {
      key: "openingHours",
      label: "Opening Hours",
      type: "text",
      required: false,
      placeholder: "9:00 AM - 6:00 PM",
      section: "location",
      gridCol: "full",
    },
    {
      key: "categories",
      label: "Categories",
      type: "multiselect",
      required: false,
      options: categoriesResponse?.data?.map((category) => ({
        value: category.name.toLowerCase(),
        label: category.name,
      })) || [
        { value: "Concert", label: "Concert" },
        { value: "Food", label: "Food" },
        { value: "Hiking", label: "Hiking" },
      ],
      section: "categories",
      gridCol: "full",
      helpText: "Select multiple categories that apply to this post",
    },

    {
      key: "socialLinks.facebook",
      label: "Facebook",
      type: "url",
      required: false,
      placeholder: "https://facebook.com/company",
      section: "social",
      gridCol: "half",
    },
    {
      key: "socialLinks.instagram",
      label: "Instagram",
      type: "url",
      required: false,
      placeholder: "https://instagram.com/company",
      section: "social",
      gridCol: "half",
    },
    {
      key: "socialLinks.twitter",
      label: "X (Twitter)",
      type: "url",
      required: false,
      placeholder: "https://twitter.com/company",
      section: "social",
      gridCol: "half",
    },
    {
      key: "socialLinks.linkedin",
      label: "LinkedIn",
      type: "url",
      required: false,
      placeholder: "https://linkedin.com/company",
      section: "social",
      gridCol: "half",
    },
    {
      key: "socialLinks.youtube",
      label: "YouTube",
      type: "url",
      required: false,
      placeholder: "https://youtube.com/company",
      section: "social",
      gridCol: "half",
    },
    {
      key: "socialLinks.website",
      label: "Website",
      type: "url",
      required: false,
      placeholder: "https://company.com",
      section: "social",
      gridCol: "half",
    },
    {
      key: "socialLinks.tiktok",
      label: "TikTok",
      type: "url",
      required: false,
      placeholder: "https://tiktok.com/@company",
      section: "social",
      gridCol: "half",
    },
    {
      key: "offlineSupported",
      label: "Offline Supported",
      type: "switch",
      required: false,
      section: "offline",
      gridCol: "full",
      helpText: "Enable offline functionality for this post",
    },
    {
      key: "offlineData.mapTiles",
      label: "Map Tiles Available",
      type: "switch",
      required: false,
      section: "offline",
      gridCol: "third",
      helpText: "Offline map tiles available",
      condition: (formData) => Boolean(formData.offlineSupported),
    },
    {
      key: "offlineData.detailsAvailable",
      label: "Details Available Offline",
      type: "switch",
      required: false,
      section: "offline",
      gridCol: "third",
      helpText: "Post details accessible offline",
      condition: (formData) => Boolean(formData.offlineSupported),
    },
    {
      key: "offlineData.navigationSupported",
      label: "Navigation Supported",
      type: "switch",
      required: false,
      section: "offline",
      gridCol: "third",
      helpText: "Navigation features work offline",
      condition: (formData) => Boolean(formData.offlineSupported),
    },
    {
      key: "offlineData.tileRegionName",
      label: "Tile Region Name",
      type: "text",
      required: false,
      placeholder: "e.g., region_001_downtown",
      section: "offline",
      gridCol: "full",
      helpText: "Unique identifier for the offline map region",
      condition: (formData) => Boolean(formData.offlineSupported),
    },
    {
      key: "offlineData.zoomRange.minZoom",
      label: "Minimum Zoom Level",
      type: "number",
      required: false,
      placeholder: "10",
      validation: {
        min: 0,
        max: 22,
      },
      section: "offline",
      gridCol: "half",
      helpText: "Minimum zoom level for offline maps (0-22)",
      condition: (formData) => Boolean(formData.offlineSupported),
    },
    {
      key: "offlineData.zoomRange.maxZoom",
      label: "Maximum Zoom Level",
      type: "number",
      required: false,
      placeholder: "18",
      validation: {
        min: 0,
        max: 22,
      },
      section: "offline",
      gridCol: "half",
      helpText: "Maximum zoom level for offline maps (0-22)",
      condition: (formData) => Boolean(formData.offlineSupported),
    },
    {
      key: "offlineData.tileBounds.southwest.latitude",
      label: "Southwest Latitude",
      type: "number",
      required: false,
      placeholder: "37.7639",
      validation: {
        min: -90,
        max: 90,
      },
      section: "offline",
      gridCol: "half",
      helpText: "Southwest corner latitude for tile bounds",
      condition: (formData) => Boolean(formData.offlineSupported),
    },
    {
      key: "offlineData.tileBounds.southwest.longitude",
      label: "Southwest Longitude",
      type: "number",
      required: false,
      placeholder: "-122.4304",
      validation: {
        min: -180,
        max: 180,
      },
      section: "offline",
      gridCol: "half",
      helpText: "Southwest corner longitude for tile bounds",
      condition: (formData) => Boolean(formData.offlineSupported),
    },
    {
      key: "offlineData.tileBounds.northeast.latitude",
      label: "Northeast Latitude",
      type: "number",
      required: false,
      placeholder: "37.7859",
      validation: {
        min: -90,
        max: 90,
      },
      section: "offline",
      gridCol: "half",
      helpText: "Northeast corner latitude for tile bounds",
      condition: (formData) => Boolean(formData.offlineSupported),
    },
    {
      key: "offlineData.tileBounds.northeast.longitude",
      label: "Northeast Longitude",
      type: "number",
      required: false,
      placeholder: "-122.4084",
      validation: {
        min: -180,
        max: 180,
      },
      section: "offline",
      gridCol: "half",
      helpText: "Northeast corner longitude for tile bounds",
      condition: (formData) => Boolean(formData.offlineSupported),
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      required: false,
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "draft", label: "Draft" },
        { value: "pending", label: "Pending" },
        { value: "archived", label: "Archived" },
      ],
      section: "content",
      gridCol: "half",
    },
  ];

  const createModalSections = [
    {
      key: "basic",
      title: "Basic Information",
      description: "Enter the basic details for the post",
      icon: "📝",
    },
    {
      key: "content",
      title: "Content & Details",
      description: "Add description, and other content details",
      icon: "🎨",
    },
    {
      key: "location",
      title: "Location & Contact",
      description: "Add location and contact information",
      icon: "📍",
      collapsible: true,
      defaultCollapsed: true,
    },
    {
      key: "categories",
      title: "Categories & Tags",
      description: "Add categories for better organization",
      icon: "🏷️",
      collapsible: true,
      defaultCollapsed: true,
    },
    {
      key: "social",
      title: "Social Media Links",
      description: "Add social media and external links (optional)",
      icon: "🔗",
      collapsible: true,
      defaultCollapsed: true,
    },
    {
      key: "offline",
      title: "Offline Map Support",
      description: "Configure offline accessibility and map download options",
      icon: "📱",
      collapsible: true,
      defaultCollapsed: true,
    },
  ];

  const processFormData = (data: Record<string, unknown>) => {
    const processedData: Record<string, unknown> = {};
    const socialLinks: Record<string, string> = {};
    const offlineData: Record<string, unknown> = {};

    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith("socialLinks.")) {
        const socialKey = key.replace("socialLinks.", "");
        if (typeof value === "string" && value.trim()) {
          socialLinks[socialKey] = value.trim();
        }
      } else if (key.startsWith("offlineData.")) {
        const offlineKeyPath = key.replace("offlineData.", "");
        if (value !== undefined && value !== null && value !== "") {
          offlineData[offlineKeyPath] = value;
        }
      } else {
        processedData[key] = value;
      }
    });

    if (Object.keys(socialLinks).length > 0) {
      processedData.socialLinks = socialLinks;
    }

    if (Object.keys(offlineData).length > 0) {
      processedData.offlineData = offlineData;
    }

    return processedData;
  };

  const handleCreatePost = async (data: Record<string, unknown>) => {
    try {
      const formData = new FormData();

      // Add basic fields
      formData.append("title", String(data.title || ""));
      formData.append("description", String(data.description || ""));
      formData.append("type", String(data.type || ""));
      formData.append("isFeatured", data.isFeatured ? "true" : "false");

      // Add optional fields
      if (data.location) formData.append("location", String(data.location));
      if (data.address) formData.append("address", String(data.address));
      if (data.phone) formData.append("phone", String(data.phone));
      if (data.price !== undefined && data.price !== "")
        formData.append("price", String(data.price));
      if (data.totalEvent !== undefined && data.totalEvent !== "")
        formData.append("totalEvent", String(data.totalEvent));
      if (data.latitude !== undefined && data.latitude !== "")
        formData.append("latitude", String(data.latitude));
      if (data.longitude !== undefined && data.longitude !== "")
        formData.append("longitude", String(data.longitude));
      if (data.openingHours)
        formData.append("openingHours", String(data.openingHours));
      if (data.dateRange) formData.append("dateRange", String(data.dateRange));
      formData.append(
        "offlineSupported",
        data.offlineSupported ? "true" : "false"
      );

      // Add categories
      if (data.categories && Array.isArray(data.categories)) {
        data.categories.forEach((cat) =>
          formData.append("categories[]", String(cat))
        );
      }

      // Add social links
      const processedData = processFormData(data);
      const socialLinks = processedData.socialLinks;
      if (socialLinks) {
        formData.append("socialLinks", JSON.stringify(socialLinks));
      }

      // Add offline data
      const offlineData = processedData.offlineData;
      if (offlineData) {
        formData.append("offlineData", JSON.stringify(offlineData));
      }

      // Handle images
      if (data.images && Array.isArray(data.images)) {
        for (let i = 0; i < data.images.length; i++) {
          const image = data.images[i];
          if (image instanceof File) {
            formData.append("images", image);
          } else if (typeof image === "string" && image.startsWith("data:")) {
            // Convert base64 to blob
            const response = await fetch(image);
            const blob = await response.blob();
            formData.append("images", blob, `image-${i}.png`);
          }
        }
      }

      const result = await createPost(formData).unwrap();
      if (result.success) {
        toast.success("Post created successfully");
        setCreateModalOpen(false);
        refetch();
      }
    } catch (error: unknown) {
      console.log("Post create error::", error);

      if (typeof error === "object" && error !== null && "data" in error) {
        const err = error as { data?: { message?: string } };
        toast.error(err.data?.message || "Failed to create post");
      } else {
        toast.error("Failed to create post");
      }
    }
  };

  const handleEditPost = (post: Post) => {
    const postToEdit = {
      ...post,
      id: post._id || post.id,
    };
    setEditingPost(postToEdit);
    setEditModalOpen(true);
  };

  const handleUpdatePost = async (data: Record<string, unknown>) => {
    if (!editingPost || !editingPost.id) {
      toast.error("Invalid post data");
      return;
    }

    try {
      const formData = new FormData();

      // Filter out automatic backend fields that shouldn't be sent from frontend
      const fieldsToExclude = [
        "_id",
        "id",
        "createdBy",
        "createdAt",
        "updatedAt",
        "__v",
      ];

      // Add fields that have changed, excluding read-only fields and nested object fields
      Object.keys(data).forEach((key) => {
        if (fieldsToExclude.includes(key)) {
          return; // Skip read-only fields
        }

        // Skip nested object fields - they'll be handled separately
        if (key.startsWith("socialLinks.") || key.startsWith("offlineData.")) {
          return;
        }

        const value = data[key];
        if (value !== undefined && value !== null) {
          if (key === "images" && Array.isArray(value)) {
            // Handle images separately
            return;
          } else if (key === "categories" && Array.isArray(value)) {
            value.forEach((cat) =>
              formData.append("categories[]", String(cat))
            );
          } else if (typeof value === "object") {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Handle images
      if (data.images && Array.isArray(data.images)) {
        for (let i = 0; i < data.images.length; i++) {
          const image = data.images[i];
          if (image instanceof File) {
            formData.append("images", image);
          } else if (typeof image === "string" && image.startsWith("data:")) {
            const response = await fetch(image);
            const blob = await response.blob();
            formData.append("images", blob, `image-${i}.png`);
          }
        }
      }

      // Process nested data (excluding read-only fields)
      const processedData = processFormData(
        Object.fromEntries(
          Object.entries(data).filter(([key]) => !fieldsToExclude.includes(key))
        )
      );

      if (processedData.socialLinks) {
        formData.append(
          "socialLinks",
          JSON.stringify(processedData.socialLinks)
        );
      }
      if (processedData.offlineData) {
        formData.append(
          "offlineData",
          JSON.stringify(processedData.offlineData)
        );
      }

      const result = await updatePost({
        id: editingPost.id,
        data: formData,
      }).unwrap();

      if (result.success) {
        toast.success("Post updated successfully");
        setEditModalOpen(false);
        setEditingPost(null);
        refetch();
      }
    } catch (error: unknown) {
      console.log("Post update error::", error);

      if (typeof error === "object" && error !== null && "data" in error) {
        const err = error as { data?: { message?: string } };
        toast.error(err.data?.message || "Failed to Update post");
      } else {
        toast.error("Failed to update post");
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!postId || postId === "undefined") {
      toast.error("Invalid post ID");
      return;
    }

    try {
      await deletePost(postId).unwrap();
      toast.success("Post deleted successfully");
      refetch();
    } catch (error: unknown) {
      console.log("Post delete error::", error);

      if (typeof error === "object" && error !== null && "data" in error) {
        const err = error as { data?: { message?: string } };
        toast.error(err.data?.message || "Failed to delete post");
      } else {
        toast.error("Failed to delete post");
      }
    }
  };

  const handleDataChange = (newData: GenericDataItem[]) => {
    console.log("Posts data changed:", newData);
    refetch();
  };

  const handleFiltersChange = (newFilters: Record<string, unknown>) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getEditInitialData = () => {
    if (!editingPost) return {};

    const socialLinksData = editingPost.socialLinks || {};
    const offlineDataData = editingPost.offlineData || {};

    return {
      ...editingPost,
      categories: editingPost.categories || [],
      "socialLinks.facebook": socialLinksData.facebook || "",
      "socialLinks.instagram": socialLinksData.instagram || "",
      "socialLinks.twitter": socialLinksData.twitter || "",
      "socialLinks.linkedin": socialLinksData.linkedin || "",
      "socialLinks.youtube": socialLinksData.youtube || "",
      "socialLinks.website": socialLinksData.website || "",
      "socialLinks.tiktok": socialLinksData.tiktok || "",
      "offlineData.mapTiles": offlineDataData.mapTiles || false,
      "offlineData.detailsAvailable": offlineDataData.detailsAvailable || false,
      "offlineData.navigationSupported":
        offlineDataData.navigationSupported || false,
      "offlineData.tileRegionName": offlineDataData.tileRegionName || "",
      "offlineData.zoomRange.minZoom": offlineDataData.zoomRange?.minZoom || 10,
      "offlineData.zoomRange.maxZoom": offlineDataData.zoomRange?.maxZoom || 18,
      "offlineData.tileBounds.southwest.latitude":
        offlineDataData.tileBounds?.southwest?.latitude || "",
      "offlineData.tileBounds.southwest.longitude":
        offlineDataData.tileBounds?.southwest?.longitude || "",
      "offlineData.tileBounds.northeast.latitude":
        offlineDataData.tileBounds?.northeast?.latitude || "",
      "offlineData.tileBounds.northeast.longitude":
        offlineDataData.tileBounds?.northeast?.longitude || "",
    };
  };

  return (
    <div className="w-full mx-auto">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-foreground text-xl font-semibold">{title}</h2>
        <Button
          className="flex items-center gap-2 border-primary/30 rounded-md"
          size="lg"
          onClick={() => setCreateModalOpen(true)}
        >
          <span className="mt-1.5">
            <Lordicon
              src="https://cdn.lordicon.com/ueoydrft.json"
              trigger="hover"
              size={20}
              colors={{
                primary: "",
                secondary: "",
              }}
              stroke={1}
            />
          </span>
          <span>Add Post</span>
        </Button>
      </div>

      <DynamicCard3D
        data={posts}
        columns={postColumns}
        cardConfig={cardConfig}
        actions={postActions}
        searchFilterConfig={searchFilterConfig}
        onDataChange={handleDataChange}
        loading={isLoading}
        emptyMessage="No posts found"
        itemsPerPage={itemsPerPage}
        currentPage={page}
        onPageChange={handlePageChange}
        totalItems={postsResponse?.pagination?.total || 0}
        onFiltersChange={handleFiltersChange}
      />

      <DynamicDataCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreatePost}
        title="Create New Post"
        description="Create and publish posts with comprehensive information and offline map integration"
        fields={createFormFields}
        sections={createModalSections}
        initialData={{
          isFeatured: false,
          type: categoriesResponse?.data?.[0]?.name || "Hiking",
          totalEvent: 0,
          price: 0,
          offlineSupported: false,
          categories: [],
          "offlineData.mapTiles": false,
          "offlineData.detailsAvailable": false,
          "offlineData.navigationSupported": false,
          "offlineData.zoomRange.minZoom": 10,
          "offlineData.zoomRange.maxZoom": 18,
          status: "active",
        }}
        saveButtonText="Create Post"
        cancelButtonText="Cancel"
        maxImageSizeInMB={5}
        maxImageUpload={10}
        acceptedImageFormats={[
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ]}
      />

      {editingPost && (
        <DynamicDataCreateModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingPost(null);
          }}
          onSave={handleUpdatePost}
          title="Edit Post"
          description="Update post information and offline map settings"
          fields={createFormFields}
          sections={createModalSections}
          initialData={getEditInitialData()}
          saveButtonText="Update Post"
          cancelButtonText="Cancel"
          maxImageUpload={10}
          maxImageSizeInMB={5}
          acceptedImageFormats={[
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
          ]}
        />
      )}
    </div>
  );
}
