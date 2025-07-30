// src\app\(dashboard)\components\Posts\ManagementPosts.tsx
"use client";
import { postsData } from "@/data/postsData";
import { categoriesData } from "@/data/categoriesData";
import { useState } from "react";
import type {
  GenericDataItem,
  ColumnConfig,
  FilterConfig,
  ActionConfig,
  TableConfig,
  FormFieldConfig,
  EditModalConfig,
  FieldType,
} from "@/types/dynamicTableTypes";
import { DynamicTable } from "@/components/common/DynamicTable";
import Lordicon from "@/components/lordicon/lordicon-wrapper";
import { Button } from "@/components/ui/button";
import { DynamicDataCreateModal } from "@/components/common/DynamicDataCreateModal";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import Image from "next/image";

interface PostManagementProps {
  itemsPerPage?: number;
  title?: string;
  buttonText?: string;
  pageUrl?: string;
}

interface PostDataItem extends GenericDataItem {
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  targetUsers: "new" | "old" | "both";
  startDate: string;
  endDate: string;
  status: "active" | "inactive" | "draft" | "scheduled" | "expired";
  tags?: string[];
  keywords?: string[];
  category: string;
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    tiktok?: string;
    website?: string;
  };
  createdAt: string;
  isActive: boolean;
  author?: string;
  views?: number;
  priority?: "low" | "medium" | "high";
}

export default function ManagementPosts({
  itemsPerPage = 10,
  title = "All Posts",
  buttonText = "Show all",
  pageUrl = "/manage-posts",
}: PostManagementProps) {
  const [posts, setPosts] = useState(postsData);
  const [isLoading, setIsLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Column Configuration for Posts Table
  const postColumns: ColumnConfig[] = [
    {
      key: "title",
      label: "Post Name",
      sortable: true,
      searchable: true,
      showAvatar: true,
      align: "left",
      width: "300px",
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={
                typeof item.image === "string" && item.image.trim() !== ""
                  ? item.image
                  : "/placeholder.svg?height=48&width=48&query=post"
              }
              alt={String(value)}
              className="w-full h-full object-cover"
              width={48}
              height={48}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate">{String(value)}</p>
            {item.subtitle && (
              <p className="text-xs text-gray-500 truncate">
                {String(item.subtitle)}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "targetUsers",
      label: "Targeted Users",
      sortable: true,
      filterable: true,
      width: "140px",
      align: "center",
      render: (value) => {
        const targetUser = String(value);
        const config = {
          new: { label: "New Users", color: "#3b82f6", icon: "👋" },
          old: { label: "Old Users", color: "#10b981", icon: "🤝" },
          both: { label: "All Users", color: "#8b5cf6", icon: "👥" },
        };
        const userConfig =
          config[targetUser as keyof typeof config] || config.both;

        return (
          <div className="flex items-center justify-center">
            <Badge
              variant="secondary"
              className="text-xs px-2 py-1"
              style={{
                backgroundColor: userConfig.color + "20",
                color: userConfig.color,
              }}
            >
              <span className="mr-1">{userConfig.icon}</span>
              {userConfig.label}
            </Badge>
          </div>
        );
      },
    },
    {
      key: "startDate",
      label: "Starting Date",
      type: "date",
      sortable: true,
      width: "130px",
      align: "center",
      render: (value) => (
        <div className="flex items-center justify-center gap-1 text-sm">
          <Calendar className="w-3 h-3 text-gray-400" />
          {new Date(String(value)).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "endDate",
      label: "End Date",
      type: "date",
      sortable: true,
      width: "130px",
      align: "center",
      render: (value) => (
        <div className="flex items-center justify-center gap-1 text-sm">
          <Calendar className="w-3 h-3 text-gray-400" />
          {new Date(String(value)).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      sortable: true,
      filterable: true,
      width: "120px",
      align: "center",
      options: [
        { value: "active", label: "Active", color: "#16a34a" },
        { value: "inactive", label: "Inactive", color: "#ca8a04" },
        { value: "draft", label: "Draft", color: "#6b7280" },
        { value: "scheduled", label: "Scheduled", color: "#3b82f6" },
        { value: "expired", label: "Expired", color: "#dc2626" },
      ],
    },
  ];

  // FIXED: Properly organized form fields with correct sections
  const createFormFields = [
    // Basic Information Section Fields
    {
      key: "title",
      label: "Post Title",
      type: "text" as const,
      required: true,
      placeholder: "Enter post title",
      validation: {
        minLength: 5,
        maxLength: 100,
      },
      section: "basic",
      gridCol: "full" as const,
    },
    {
      key: "subtitle",
      label: "Subtitle",
      type: "text" as const,
      required: false,
      placeholder: "Enter subtitle (optional)",
      validation: {
        maxLength: 150,
      },
      section: "basic",
      gridCol: "full" as const,
    },
    {
      key: "image",
      label: "Post Image",
      type: "image" as const,
      required: true,
      section: "basic",
      gridCol: "full" as const,
    },

    // Content Section Fields
    {
      key: "description",
      label: "Description",
      type: "textarea" as const,
      required: true,
      placeholder: "Enter post description with markdown support...",
      section: "content",
      gridCol: "full" as const,
    },

    // Targeting Section Fields
    {
      key: "targetUsers",
      label: "Target Users",
      type: "select" as const,
      required: true,
      options: [
        { value: "new", label: "New Users" },
        { value: "old", label: "Old Users" },
        { value: "both", label: "All Users" },
      ],
      section: "targeting",
      gridCol: "half" as const,
    },
    {
      key: "category",
      label: "Category",
      type: "select" as const,
      required: true,
      options: categoriesData.map((cat) => ({
        value: cat.name,
        label: cat.name,
      })),
      section: "targeting",
      gridCol: "half" as const,
    },
    {
      key: "startDate",
      label: "Start Date",
      type: "date" as const,
      required: true,
      section: "targeting",
      gridCol: "half" as const,
    },
    {
      key: "endDate",
      label: "End Date",
      type: "date" as const,
      required: true,
      section: "targeting",
      gridCol: "half" as const,
    },
    {
      key: "priority",
      label: "Priority",
      type: "select" as const,
      required: true,
      options: [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
      ],
      section: "targeting",
      gridCol: "half" as const,
    },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      required: true,
      options: [
        { value: "draft", label: "Draft" },
        { value: "scheduled", label: "Scheduled" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
      section: "targeting",
      gridCol: "half" as const,
    },

    // SEO Section Fields
    {
      key: "tags",
      label: "Tags",
      type: "text" as const,
      required: false,
      placeholder:
        "Enter tags separated by commas (e.g., technology, innovation, post)",
      section: "seo",
      gridCol: "full" as const,
    },
    {
      key: "keywords",
      label: "Keywords",
      type: "text" as const,
      required: false,
      placeholder: "Enter keywords separated by commas for SEO",
      section: "seo",
      gridCol: "full" as const,
    },

    // Social Links Section Fields
    {
      key: "facebook",
      label: "Facebook",
      type: "text" as const,
      required: false,
      placeholder: "https://facebook.com/company",
      section: "social",
      gridCol: "half" as const,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      type: "text" as const,
      required: false,
      placeholder: "https://linkedin.com/company",
      section: "social",
      gridCol: "half" as const,
    },
    {
      key: "twitter",
      label: "X (Twitter)",
      type: "text" as const,
      required: false,
      placeholder: "https://twitter.com/company",
      section: "social",
      gridCol: "half" as const,
    },
    {
      key: "instagram",
      label: "Instagram",
      type: "text" as const,
      required: false,
      placeholder: "https://instagram.com/company",
      section: "social",
      gridCol: "half" as const,
    },
    {
      key: "tiktok",
      label: "TikTok",
      type: "text" as const,
      required: false,
      placeholder: "https://tiktok.com/@company",
      section: "social",
      gridCol: "half" as const,
    },
    {
      key: "website",
      label: "Website",
      type: "text" as const,
      required: false,
      placeholder: "https://website.com/company",
      section: "social",
      gridCol: "half" as const,
    },
  ];

  // FIXED: Form fields for edit modal (for DynamicTable edit functionality)
  const postFormFields: FormFieldConfig[] = createFormFields.map((field) => ({
    ...field,
    type: field.type as FieldType, // Type assertion for compatibility
  }));

  // Create Modal Sections
  const createModalSections = [
    {
      key: "basic",
      title: "Basic Information",
      description: "Enter the basic details for the post",
    },
    {
      key: "content",
      title: "Content & Media",
      description: "Add description and images for the post",
    },
    {
      key: "targeting",
      title: "Targeting & Scheduling",
      description: "Configure target audience and publication schedule",
    },
    {
      key: "seo",
      title: "SEO & Tags",
      description: "Add tags and keywords for better discoverability",
    },
    {
      key: "social",
      title: "Social & External Links",
      description: "Add social media and external links (optional)",
    },
  ];

  // FIXED: Edit Modal Configuration
  const postEditModalConfig: EditModalConfig = {
    title: "Edit Post",
    description: "Update post information and settings",
    width: "xl",
    sections: [
      {
        key: "basic",
        title: "Basic Information",
        description: "Basic post details and information",
      },
      {
        key: "content",
        title: "Content & Media",
        description: "Post content and media files",
      },
      {
        key: "targeting",
        title: "Targeting & Scheduling",
        description: "Target audience and scheduling settings",
      },
      {
        key: "seo",
        title: "SEO & Tags",
        description: "SEO optimization and tags",
      },
      {
        key: "social",
        title: "Social Links",
        description: "Social media and external links",
      },
    ],
  };

  // Filter Configuration for Posts Table
  const postFilters: FilterConfig[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "draft", label: "Draft" },
        { value: "scheduled", label: "Scheduled" },
        { value: "expired", label: "Expired" },
      ],
    },
    {
      key: "targetUsers",
      label: "Target Users",
      type: "select",
      options: [
        { value: "new", label: "New Users" },
        { value: "old", label: "Old Users" },
        { value: "both", label: "All Users" },
      ],
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: categoriesData.map((cat) => ({
        value: cat.name,
        label: cat.name,
      })),
    },
  ];

  // Action Configuration for Posts Table
  const postActions: ActionConfig[] = [
    {
      key: "view",
      label: "",
      icon: (
        <Lordicon
          src="https://cdn.lordicon.com/knitbwfa.json"
          trigger="hover"
          size={20}
          colors={{
            primary: "#9ca3af",
            secondary: "",
          }}
          stroke={4}
        />
      ),
      variant: "ghost",
      onClick: (item) => console.log("View post:", item.title),
    },
    {
      key: "edit",
      label: "",
      icon: (
        <Lordicon
          src="https://cdn.lordicon.com/cbtlerlm.json"
          trigger="hover"
          size={20}
          colors={{
            primary: "#9ca3af",
            secondary: "",
          }}
          stroke={4}
        />
      ),
      variant: "ghost",
      onClick: (item) => console.log("Edit post:", item.title),
    },
  ];

  // Table Configuration for Posts Management
  const postTableConfig: TableConfig = {
    title: "",
    description: "",
    searchPlaceholder: "Search posts by title, category, or author",
    itemsPerPage: itemsPerPage,
    enableSearch: true,
    enableFilters: true,
    enablePagination: true,
    enableSelection: true,
    enableSorting: true,
    striped: true,
    emptyMessage: "No posts found",
    loadingMessage: "Loading posts...",
  };

  // Handle creating new post
  const handleCreatePost = (data: Record<string, unknown>) => {
    // Process tags and keywords
    const processTags = (value: unknown): string[] => {
      if (typeof value === "string" && value.trim()) {
        return value
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
      }
      return [];
    };

    // Process social links
    const processSocialLinks = (data: Record<string, unknown>) => {
      const socialLinks: Record<string, string> = {};
      const socialKeys = [
        "facebook",
        "linkedin",
        "twitter",
        "instagram",
        "tiktok",
        "website",
      ];

      socialKeys.forEach((key) => {
        const value = data[key];
        if (typeof value === "string" && value.trim()) {
          socialLinks[key] = value.trim();
        }
      });

      return Object.keys(socialLinks).length > 0 ? socialLinks : undefined;
    };

    // Handle image - single image only for posts
    const imageValue =
      Array.isArray(data.image) && data.image.length > 0
        ? data.image[0]
        : typeof data.image === "string"
        ? data.image
        : "";

    const newPostData = {
      id: `post${Date.now()}`,
      title: String(data.title || ""),
      subtitle: data.subtitle ? String(data.subtitle) : undefined,
      description: String(data.description || ""),
      image:
        imageValue ||
        `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop`,
      targetUsers: String(data.targetUsers || "both") as "new" | "old" | "both",
      startDate: String(data.startDate || new Date().toISOString()),
      endDate: String(
        data.endDate ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      ),
      status: String(data.status || "draft") as
        | "active"
        | "inactive"
        | "draft"
        | "scheduled"
        | "expired",
      tags: processTags(data.tags),
      keywords: processTags(data.keywords),
      category: String(data.category || "General"),
      socialLinks: processSocialLinks(data),
      createdAt: new Date().toISOString(),
      isActive: String(data.status || "draft") === "active",
      author: "Current User",
      views: 0,
      priority: String(data.priority || "medium") as "low" | "medium" | "high",
    };

    const updatedPosts = [newPostData, ...posts];
    setPosts(updatedPosts);

    console.log("New post created:", newPostData);
  };

  const handleDataChange = (newData: GenericDataItem[]) => {
    setPosts(newData as PostDataItem[]);
    console.log("Posts data changed:", newData);
  };

  const handlePostEdit = (postItem: GenericDataItem) => {
    console.log("Post edited:", postItem);
    // Here you would typically make an API call to update the post
  };

  const handlePostDelete = (postId: string) => {
    console.log("Post deleted:", postId);
    // Here you would typically make an API call to delete the post
  };

  const handlePostSelect = (selectedIds: string[]) => {
    console.log("Selected posts:", selectedIds);
    // Handle bulk operations
  };

  const handleExport = (exportData: GenericDataItem[]) => {
    console.log("Exporting posts:", exportData);
    // Convert data to CSV format
    const headers = postColumns.map((col) => col.label).join(",");
    const csvData = (exportData as PostDataItem[])
      .map((postItem) =>
        postColumns
          .map((col) => {
            const value = postItem[col.key];
            if (Array.isArray(value)) return `"${value.join("; ")}"`;
            if (typeof value === "string" && value.includes(","))
              return `"${value}"`;
            return value || "";
          })
          .join(",")
      )
      .join("\n");

    const csv = `${headers}\n${csvData}`;

    // Create and download file
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `posts-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPosts([...postsData]);
      setIsLoading(false);
      console.log("Posts data refreshed");
    }, 1000);
  };

  return (
    <div className="w-full mx-auto">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-foreground text-xl font-semibold">{title}</h2>
        <Button
          className="flex items-center gap-2"
          onClick={() => setCreateModalOpen(true)}
        >
          <Lordicon
            src="https://cdn.lordicon.com/ueoydrft.json"
            trigger="hover"
            size={20}
            colors={{
              primary: "#ffffff",
              secondary: "#ffffff",
            }}
            stroke={1}
          />
          <span>Add Post</span>
        </Button>
      </div>

      {/* FIXED: Added formFields and editModalConfig for edit functionality */}
      <DynamicTable
        data={posts}
        columns={postColumns}
        formFields={postFormFields}
        filters={postFilters}
        actions={postActions}
        tableConfig={postTableConfig}
        editModalConfig={postEditModalConfig}
        onDataChange={handleDataChange}
        onItemEdit={handlePostEdit}
        onItemDelete={handlePostDelete}
        onItemsSelect={handlePostSelect}
        onExport={handleExport}
        onRefresh={handleRefresh}
        buttonText={buttonText}
        pageUrl={pageUrl}
        isLoading={isLoading}
      />

      {/* Create Post Modal */}
      <DynamicDataCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreatePost}
        title="Create New Post"
        description="Create and publish posts with rich content and social media integration"
        fields={createFormFields}
        sections={createModalSections}
        initialData={{
          status: "draft",
          targetUsers: "both",
          priority: "medium",
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        }}
        saveButtonText="Create Post"
        cancelButtonText="Cancel"
        maxImageSizeInMB={5}
        maxImageUpload={1}
        acceptedImageFormats={[
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ]}
      />
    </div>
  );
}
