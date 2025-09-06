// src/app/(dashboard)/components/Posts/ManagementPosts.tsx
"use client";
import { PostDataItem, postsData } from "@/data/postsData";
import { useState } from "react";
import type {
  GenericDataItem,
  ColumnConfig,
  ActionConfig,
  CardConfig,
  FormField,
  SearchFilterConfig,
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
  const [posts, setPosts] = useState(postsData);
  const [isLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostDataItem | null>(null);

  const postColumns: ColumnConfig[] = [
    {
      key: "title",
      label: "Post Title",
      sortable: true,
      searchable: true,
      align: "left",
      render: (value, item) => (
        <div className='flex items-center gap-3'>
          <div className='w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0'>
            <Image
              src={
                Array.isArray(item.images) &&
                item.images.length > 0 &&
                typeof item.images[0] === "string"
                  ? item.images[0]
                  : "/placeholder.svg?height=48&width=48"
              }
              alt={String(value)}
              className='w-full h-full object-cover'
              width={48}
              height={48}
            />
          </div>
          <div className='min-w-0 flex-1'>
            <p className='font-medium text-sm truncate'>{String(value)}</p>
            {typeof item.name === "string" && item.name && (
              <p className='text-xs text-gray-500 truncate'>{item.name}</p>
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
    },
    {
      key: "images",
      label: "Images",
      type: "image",
      sortable: false,
      render: (value) => {
        const images = Array.isArray(value) ? value : [];
        return (
          <div className='flex gap-1'>
            {images.slice(0, 3).map((img, idx) => (
              <div key={idx} className='w-8 h-8 rounded overflow-hidden'>
                <Image
                  src={typeof img === "string" ? img : "/placeholder.svg"}
                  alt={`Image ${idx + 1}`}
                  className='w-full h-full object-cover'
                  width={32}
                  height={32}
                />
              </div>
            ))}
            {images.length > 3 && (
              <div className='w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs'>
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
          <div className='flex flex-wrap gap-1'>
            {categories.slice(0, 2).map((cat, idx) => (
              <span
                key={idx}
                className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded'
              >
                {cat}
              </span>
            ))}
            {categories.length > 2 && (
              <span className='px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded'>
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
        const socialLinks = value as PostDataItem["socialLinks"];
        if (!socialLinks || Object.keys(socialLinks).length === 0) {
          return <span className='text-gray-400'>No links</span>;
        }
        return (
          <div className='flex items-center gap-1'>
            <div className='flex space-x-4'>
              {socialLinks.facebook && (
                <Link
                  href={socialLinks.facebook}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-6 h-6 p-1 bg-blue-600 rounded-full text-white'
                >
                  <Facebook className='w-4 h-4' />
                </Link>
              )}
              {socialLinks.linkedin && (
                <Link
                  href={socialLinks.linkedin}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-6 h-6 p-1 bg-blue-700 rounded-full text-white'
                >
                  <Linkedin className='w-4 h-4' />
                </Link>
              )}
              {socialLinks.twitter && (
                <Link
                  href={socialLinks.twitter}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-6 h-6 p-1 bg-black rounded-full text-white'
                >
                  <Twitter className='w-4 h-4' />
                </Link>
              )}
              {socialLinks.instagram && (
                <Link
                  href={socialLinks.instagram}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-6 h-6 p-1 bg-pink-600 rounded-full text-white'
                >
                  <Instagram className='w-4 h-4' />
                </Link>
              )}
              {socialLinks.tiktok && (
                <Link
                  href={socialLinks.tiktok}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-6 h-6 p-1 bg-black rounded-full text-white'
                >
                  <Music2 className='w-4 h-4' />
                </Link>
              )}
              {socialLinks.website && (
                <Link
                  href={socialLinks.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-6 h-6 p-1 bg-gray-600 rounded-full text-white'
                >
                  <Globe className='w-4 h-4' />
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
      onClick: (item) => handleEditPost(item as PostDataItem),
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
    ],
    filters: [
      {
        key: "type",
        label: "Type",
        type: "select",
        options: Array.from(
          new Set(postsData.map((post) => post.type).filter(Boolean))
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
    ],
  };

  const postActions: ActionConfig[] = [
    {
      key: "edit",
      label: "Edit Post",
      icon: (
        <Lordicon
          src='https://cdn.lordicon.com/cbtlerlm.json'
          trigger='hover'
          size={16}
          className='mt-1'
          colors={{
            primary: "#9ca3af",
            secondary: "",
          }}
          stroke={4}
        />
      ),
      variant: "ghost",
      onClick: (item) => handleEditPost(item as PostDataItem),
    },
    {
      key: "delete",
      label: "Delete Post",
      icon: (
        <Lordicon
          src='https://cdn.lordicon.com/jmkrnisz.json'
          trigger='hover'
          size={16}
          className='mt-1'
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
      label: "Type/Category",
      type: "select",
      required: true,
      options: [
        { value: "Technology", label: "Technology" },
        { value: "Business", label: "Business" },
        { value: "Environment", label: "Environment" },
        { value: "Finance", label: "Finance" },
        { value: "Health", label: "Health" },
        { value: "Education", label: "Education" },
        { value: "Entertainment", label: "Entertainment" },
      ],
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
      placeholder: "$$$",
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
      label: "Phone Number",
      type: "tel",
      required: false,
      placeholder: "+1-555-0123",
      section: "location",
      gridCol: "half",
    },
    {
      key: "latitude",
      label: "Latitude",
      type: "text",
      required: false,
      placeholder: "37.7749 (e.g., 37.7749 or -37.7749)",
      section: "location",
      gridCol: "half",
      validation: {
        pattern: "^[-+]?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?)$",
        custom: (value: unknown) => {
          if (!value || value === "") return null;
          const num = parseFloat(String(value));
          if (isNaN(num)) return "Please enter a valid latitude number";
          if (num < -90 || num > 90)
            return "Latitude must be between -90 and 90 degrees";
          return null;
        },
      },
      helpText: "Valid range: -90 to +90 degrees (decimal format)",
    },
    {
      key: "longitude",
      label: "Longitude",
      type: "text",
      required: false,
      placeholder: "-122.4194 (e.g., 122.4194 or -122.4194)",
      section: "location",
      gridCol: "half",
      validation: {
        pattern: "^[-+]?(180(\\.0+)?|((1[0-7]\\d)|([1-9]?\\d))(\\.\\d+)?)$",
        custom: (value: unknown) => {
          if (!value || value === "") return null;
          const num = parseFloat(String(value));
          if (isNaN(num)) return "Please enter a valid longitude number";
          if (num < -180 || num > 180)
            return "Longitude must be between -180 and 180 degrees";
          return null;
        },
      },
      helpText: "Valid range: -180 to +180 degrees (decimal format)",
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
      options: [
        { value: "product", label: "Product" },
        { value: "launch", label: "Launch" },
        { value: "technology", label: "Technology" },
        { value: "innovation", label: "Innovation" },
        { value: "expansion", label: "Expansion" },
        { value: "global", label: "Global" },
        { value: "markets", label: "Markets" },
        { value: "growth", label: "Growth" },
        { value: "sustainability", label: "Sustainability" },
        { value: "environment", label: "Environment" },
        { value: "green", label: "Green" },
        { value: "initiative", label: "Initiative" },
        { value: "financial", label: "Financial" },
        { value: "results", label: "Results" },
        { value: "partnership", label: "Partnership" },
        { value: "collaboration", label: "Collaboration" },
        { value: "strategy", label: "Strategy" },
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
      required: true,
      section: "offline",
      gridCol: "third",
      helpText: "Offline map tiles available",
      condition: (formData) => Boolean(formData.offlineSupported),
    },
    {
      key: "offlineData.detailsAvailable",
      label: "Details Available Offline",
      type: "switch",
      required: true,
      section: "offline",
      gridCol: "third",
      helpText: "Post details accessible offline",
      condition: (formData) => Boolean(formData.offlineSupported),
    },
    {
      key: "offlineData.navigationSupported",
      label: "Navigation Supported",
      type: "switch",
      required: true,
      section: "offline",
      gridCol: "third",
      helpText: "Navigation features work offline",
      condition: (formData) => Boolean(formData.offlineSupported),
    },
    {
      key: "offlineData.tileRegionName",
      label: "Tile Region Name",
      type: "text",
      required: true,
      placeholder: "e.g., region_001_downtown",
      section: "offline",
      gridCol: "full",
      helpText:
        "Unique identifier for the offline map region (auto-generated if empty)",
      condition: (formData) => Boolean(formData.offlineSupported),
    },
    {
      key: "offlineData.tileBounds.southwest.latitude",
      label: "Southwest Latitude",
      type: "text",
      required: true,
      placeholder: "37.7639",
      validation: {
        pattern: "^[-+]?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?)$",
        custom: (value: unknown) => {
          if (!value || value === "") return null;
          const num = parseFloat(String(value));
          if (isNaN(num)) return "Please enter a valid latitude";
          if (num < -90 || num > 90)
            return "Latitude must be between -90 and 90";
          return null;
        },
      },
      section: "offline",
      gridCol: "quarter",
      helpText: "Southwest corner latitude for tile bounds",
      condition: (formData) => Boolean(formData.offlineSupported),
    },
    {
      key: "offlineData.tileBounds.southwest.longitude",
      label: "Southwest Longitude",
      type: "text",
      required: true,
      placeholder: "-122.4304",
      validation: {
        pattern: "^[-+]?(180(\\.0+)?|((1[0-7]\\d)|([1-9]?\\d))(\\.\\d+)?)$",
        custom: (value: unknown) => {
          if (!value || value === "") return null;
          const num = parseFloat(String(value));
          if (isNaN(num)) return "Please enter a valid longitude";
          if (num < -180 || num > 180)
            return "Longitude must be between -180 and 180";
          return null;
        },
      },
      section: "offline",
      gridCol: "quarter",
      helpText: "Southwest corner longitude for tile bounds",
      condition: (formData) => Boolean(formData.offlineSupported),
    },
    {
      key: "offlineData.tileBounds.northeast.latitude",
      label: "Northeast Latitude",
      type: "text",
      required: true,
      placeholder: "37.7859",
      validation: {
        pattern: "^[-+]?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?)$",
        custom: (value: unknown) => {
          if (!value || value === "") return null;
          const num = parseFloat(String(value));
          if (isNaN(num)) return "Please enter a valid latitude";
          if (num < -90 || num > 90)
            return "Latitude must be between -90 and 90";
          return null;
        },
      },
      section: "offline",
      gridCol: "quarter",
      helpText: "Northeast corner latitude for tile bounds",
      condition: (formData) => Boolean(formData.offlineSupported),
    },
    {
      key: "offlineData.tileBounds.northeast.longitude",
      label: "Northeast Longitude",
      type: "text",
      required: true,
      placeholder: "-122.4084",
      validation: {
        pattern: "^[-+]?(180(\\.0+)?|((1[0-7]\\d)|([1-9]?\\d))(\\.\\d+)?)$",
        custom: (value: unknown) => {
          if (!value || value === "") return null;
          const num = parseFloat(String(value));
          if (isNaN(num)) return "Please enter a valid longitude";
          if (num < -180 || num > 180)
            return "Longitude must be between -180 and 180";
          return null;
        },
      },
      section: "offline",
      gridCol: "quarter",
      helpText: "Northeast corner longitude for tile bounds",
      condition: (formData) => Boolean(formData.offlineSupported),
    },
    {
      key: "offlineData.zoomRange.minZoom",
      label: "Minimum Zoom Level",
      type: "number",
      required: true,
      placeholder: "10",
      validation: {
        min: 0,
        max: 22,
      },
      section: "offline",
      gridCol: "half",
      helpText: "Minimum zoom level for offline tiles (0-22)",
      condition: (formData) => Boolean(formData.offlineSupported),
    },
    {
      key: "offlineData.zoomRange.maxZoom",
      label: "Maximum Zoom Level",
      type: "number",
      required: true,
      placeholder: "18",
      validation: {
        min: 0,
        max: 22,
      },
      section: "offline",
      gridCol: "half",
      helpText: "Maximum zoom level for offline tiles (0-22)",
      condition: (formData) => Boolean(formData.offlineSupported),
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

  // Enhanced processFormData to handle nested offline data
  const processFormData = (data: Record<string, unknown>) => {
    const processedData: Record<string, unknown> = {};
    const socialLinks: Record<string, string> = {};
    const offlineData: Record<string, any> = {};

    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith("socialLinks.")) {
        const socialKey = key.replace("socialLinks.", "");
        if (typeof value === "string" && value.trim()) {
          socialLinks[socialKey] = value.trim();
        }
      } else if (key.startsWith("offlineData.")) {
        const offlineKeyPath = key.replace("offlineData.", "");

        // Handle nested structure for tileBounds and zoomRange
        if (offlineKeyPath.includes(".")) {
          const [parent, child] = offlineKeyPath.split(".");

          if (parent === "tileBounds") {
            if (!offlineData.tileBounds) {
              offlineData.tileBounds = { southwest: {}, northeast: {} };
            }

            if (child.startsWith("southwest.")) {
              const coordKey = child.replace("southwest.", "");
              if (typeof value === "number") {
                offlineData.tileBounds.southwest[coordKey] = value;
              }
            } else if (child.startsWith("northeast.")) {
              const coordKey = child.replace("northeast.", "");
              if (typeof value === "number") {
                offlineData.tileBounds.northeast[coordKey] = value;
              }
            }
          } else if (parent === "zoomRange") {
            if (!offlineData.zoomRange) {
              offlineData.zoomRange = {};
            }
            if (typeof value === "number") {
              offlineData.zoomRange[child] = value;
            }
          }
        } else {
          // Handle direct offline data properties
          if (value !== undefined && value !== null && value !== "") {
            offlineData[offlineKeyPath] = value;
          }
        }
      } else {
        processedData[key] = value;
      }
    });

    if (Object.keys(socialLinks).length > 0) {
      processedData.socialLinks = socialLinks;
    }

    if (Object.keys(offlineData).length > 0) {
      // Auto-generate downloadedAt timestamp if offline is supported
      if (processedData.offlineSupported) {
        offlineData.downloadedAt = new Date().toISOString();
      }
      processedData.offlineData = offlineData;
    }

    return processedData;
  };

  const processCategories = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.filter(
        (item) => typeof item === "string" && item.trim().length > 0
      );
    }
    if (typeof value === "string" && value.trim()) {
      return value
        .split(",")
        .map((cat) => cat.trim())
        .filter((cat) => cat.length > 0);
    }
    return [];
  };

  // Generate default offline region name
  const generateOfflineRegionName = (
    title: string,
    location?: string
  ): string => {
    const sanitizedTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .substring(0, 20);
    const sanitizedLocation = location
      ? location
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "_")
          .substring(0, 15)
      : "location";
    const timestamp = Date.now().toString().slice(-6);
    return `${sanitizedTitle}_${sanitizedLocation}_${timestamp}`;
  };

  // Generate default tile bounds based on coordinates
  const generateDefaultTileBounds = (latitude?: number, longitude?: number) => {
    if (!latitude || !longitude) return undefined;

    // Create a bounding box with ~5km radius around the point
    const latDelta = 0.045; // approximately 5km at equator
    const lngDelta = 0.045;

    return {
      southwest: {
        latitude: latitude - latDelta,
        longitude: longitude - lngDelta,
      },
      northeast: {
        latitude: latitude + latDelta,
        longitude: longitude + lngDelta,
      },
    };
  };

  const handleCreatePost = (data: Record<string, unknown>) => {
    const processedData = processFormData(data);
    const imagesValue = Array.isArray(processedData.images)
      ? processedData.images
      : processedData.images
      ? [processedData.images]
      : [
          "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
        ];

    // Enhanced offline data processing
    const enhancedOfflineData =
      processedData.offlineData as PostDataItem["offlineData"];

    if (processedData.offlineSupported && enhancedOfflineData) {
      // Auto-generate region name if not provided
      if (!enhancedOfflineData.tileRegionName) {
        enhancedOfflineData.tileRegionName = generateOfflineRegionName(
          String(processedData.title || "post"),
          String(processedData.location || "")
        );
      }

      // Auto-generate tile bounds if coordinates are available but bounds aren't set
      if (
        !enhancedOfflineData.tileBounds &&
        processedData.latitude &&
        processedData.longitude
      ) {
        enhancedOfflineData.tileBounds = generateDefaultTileBounds(
          Number(processedData.latitude),
          Number(processedData.longitude)
        );
      }

      // Set default zoom range if not provided
      if (!enhancedOfflineData.zoomRange) {
        enhancedOfflineData.zoomRange = {
          minZoom: 10,
          maxZoom: 18,
        };
      }

      // Set default download progress if not provided
      if (enhancedOfflineData.downloadProgress === undefined) {
        enhancedOfflineData.downloadProgress = 0; // Always start at 0, frontend will update this
      }
    }

    const newPostData: PostDataItem = {
      id: `post${Date.now()}`,
      title: String(processedData.title || ""),
      description: String(processedData.description || ""),
      images: imagesValue,
      type: String(processedData.type || "General"),
      dateRange: processedData.dateRange
        ? String(processedData.dateRange)
        : undefined,
      isFeatured: Boolean(processedData.isFeatured),
      categories: processCategories(processedData.categories),
      address: processedData.address
        ? String(processedData.address)
        : undefined,
      location: processedData.location
        ? String(processedData.location)
        : undefined,
      latitude:
        typeof processedData.latitude === "string" &&
        processedData.latitude.trim()
          ? parseFloat(processedData.latitude)
          : undefined,
      longitude:
        typeof processedData.longitude === "string" &&
        processedData.longitude.trim()
          ? parseFloat(processedData.longitude)
          : undefined,
      phone: processedData.phone ? String(processedData.phone) : undefined,
      openingHours: processedData.openingHours
        ? String(processedData.openingHours)
        : undefined,
      price:
        typeof processedData.price === "number"
          ? processedData.price
          : undefined,
      totalEvent:
        typeof processedData.totalEvent === "number"
          ? processedData.totalEvent
          : undefined,
      socialLinks: processedData.socialLinks as PostDataItem["socialLinks"],
      offlineSupported: Boolean(processedData.offlineSupported),
      offlineData: enhancedOfflineData,
    };

    const updatedPosts = [newPostData, ...posts];
    setPosts(updatedPosts);
    console.log("New post created:", newPostData);
  };

  const handleEditPost = (post: PostDataItem) => {
    setEditingPost(post);
    setEditModalOpen(true);
  };

  const handleUpdatePost = (data: Record<string, unknown>) => {
    if (!editingPost) return;

    const processedData = processFormData(data);
    const imagesValue =
      Array.isArray(processedData.images) && processedData.images.length > 0
        ? processedData.images
        : editingPost.images;

    // Enhanced offline data processing for updates
    const enhancedOfflineData =
      processedData.offlineData as PostDataItem["offlineData"];

    if (processedData.offlineSupported && enhancedOfflineData) {
      // Auto-generate region name if not provided
      if (!enhancedOfflineData.tileRegionName) {
        enhancedOfflineData.tileRegionName = generateOfflineRegionName(
          String(processedData.title || editingPost.title || "post"),
          String(processedData.location || editingPost.location || "")
        );
      }

      // Auto-generate tile bounds if coordinates are available but bounds aren't set
      const lat =
        typeof processedData.latitude === "number"
          ? processedData.latitude
          : editingPost.latitude;
      const lng =
        typeof processedData.longitude === "number"
          ? processedData.longitude
          : editingPost.longitude;

      if (!enhancedOfflineData.tileBounds && lat && lng) {
        enhancedOfflineData.tileBounds = generateDefaultTileBounds(lat, lng);
      }

      // Set default zoom range if not provided
      if (!enhancedOfflineData.zoomRange) {
        enhancedOfflineData.zoomRange = editingPost.offlineData?.zoomRange || {
          minZoom: 10,
          maxZoom: 18,
        };
      }

      // Set default download progress if not provided
      if (enhancedOfflineData.downloadProgress === undefined) {
        enhancedOfflineData.downloadProgress = 0; // Always start at 0, frontend will update this
      }

      // Don't auto-update downloadedAt during edit unless specifically changing offline settings
      if (!enhancedOfflineData.downloadedAt) {
        enhancedOfflineData.downloadedAt =
          editingPost.offlineData?.downloadedAt || new Date().toISOString();
      }
    }

    const updatedPostData: PostDataItem = {
      ...editingPost,
      title: String(processedData.title || ""),
      name: processedData.name ? String(processedData.name) : undefined,
      description: String(processedData.description || ""),
      images: imagesValue,
      type: String(processedData.type || "General"),
      dateRange: processedData.dateRange
        ? String(processedData.dateRange)
        : editingPost.dateRange,
      isFeatured: Boolean(processedData.isFeatured),
      categories: processCategories(processedData.categories),
      address: processedData.address
        ? String(processedData.address)
        : editingPost.address,
      location: processedData.location
        ? String(processedData.location)
        : editingPost.location,
      latitude:
        typeof processedData.latitude === "string" &&
        processedData.latitude.trim()
          ? parseFloat(processedData.latitude)
          : editingPost.latitude,
      longitude:
        typeof processedData.longitude === "string" &&
        processedData.longitude.trim()
          ? parseFloat(processedData.longitude)
          : editingPost.longitude,
      phone: processedData.phone
        ? String(processedData.phone)
        : editingPost.phone,
      openingHours: processedData.openingHours
        ? String(processedData.openingHours)
        : editingPost.openingHours,
      price:
        typeof processedData.price === "number"
          ? processedData.price
          : editingPost.price,
      totalEvent:
        typeof processedData.totalEvent === "number"
          ? processedData.totalEvent
          : editingPost.totalEvent,
      socialLinks: enhancedOfflineData
        ? (processedData.socialLinks as PostDataItem["socialLinks"]) ||
          editingPost.socialLinks
        : editingPost.socialLinks,
      offlineSupported: Boolean(processedData.offlineSupported),
      offlineData: enhancedOfflineData || editingPost.offlineData,
    };

    const updatedPosts = posts.map((post) =>
      post.id === editingPost.id ? updatedPostData : post
    );
    setPosts(updatedPosts);
    setEditingPost(null);
    console.log("Post updated:", updatedPostData);
  };

  const handleDeletePost = (postId: string) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
    console.log("Post deleted:", postId);
  };

  const handleDataChange = (newData: GenericDataItem[]) => {
    setPosts(newData as PostDataItem[]);
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
      "offlineData.tileBounds.southwest.latitude":
        offlineDataData.tileBounds?.southwest?.latitude?.toString() || "",
      "offlineData.tileBounds.southwest.longitude":
        offlineDataData.tileBounds?.southwest?.longitude?.toString() || "",
      "offlineData.tileBounds.northeast.latitude":
        offlineDataData.tileBounds?.northeast?.latitude?.toString() || "",
      "offlineData.tileBounds.northeast.longitude":
        offlineDataData.tileBounds?.northeast?.longitude?.toString() || "",
      "offlineData.zoomRange.minZoom": offlineDataData.zoomRange?.minZoom || 10,
      "offlineData.zoomRange.maxZoom": offlineDataData.zoomRange?.maxZoom || 18,
    };
  };

  return (
    <div className='w-full mx-auto'>
      <div className='w-full flex justify-between items-center mb-6'>
        <h2 className='text-foreground text-xl font-semibold'>{title}</h2>
        <Button
          className='flex items-center gap-2 border-primary/30 rounded-md'
          size='lg'
          onClick={() => setCreateModalOpen(true)}
        >
          <span className='mt-1.5'>
            <Lordicon
              src='https://cdn.lordicon.com/ueoydrft.json'
              trigger='hover'
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
        emptyMessage='No posts found'
        itemsPerPage={itemsPerPage}
      />

      <DynamicDataCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreatePost}
        title='Create New Post'
        description='Create and publish posts with comprehensive information and offline map integration'
        fields={createFormFields}
        sections={createModalSections}
        initialData={{
          isFeatured: false,
          type: "Technology",
          totalEvent: 0,
          offlineSupported: false,
          categories: [],
          "offlineData.mapTiles": false,
          "offlineData.detailsAvailable": false,
          "offlineData.navigationSupported": false,
          "offlineData.zoomRange.minZoom": 10,
          "offlineData.zoomRange.maxZoom": 18,
        }}
        saveButtonText='Create Post'
        cancelButtonText='Cancel'
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
          title='Edit Post'
          description='Update post information and offline map settings'
          fields={createFormFields}
          sections={createModalSections}
          initialData={getEditInitialData()}
          saveButtonText='Update Post'
          cancelButtonText='Cancel'
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
