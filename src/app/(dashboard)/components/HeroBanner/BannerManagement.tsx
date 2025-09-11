"use client";
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
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Lordicon from "@/components/lordicon/lordicon-wrapper";
import {
  useGetAllWelcomeBannersQuery,
  useCreateWelcomeBannerMutation,
  useUpdateWelcomeBannerMutation,
  useDeleteWelcomeBannerMutation,
} from "@/store/api/welcomeBannerApi";
import { useGetActiveCategoriesQuery } from "@/store/api/categoriesApi";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";

// Banner Data Interface
interface BannerDataItem {
  _id?: string;
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  targetSections: "banner";
  startDate: string;
  endDate: string;
  status: "active" | "inactive" | "draft" | "scheduled" | "expired";
  category: string[];
  createdAt: string;
  updatedAt?: string;
}

interface BannerManagementProps {
  itemsPerPage?: number;
  title?: string;
  buttonText?: string;
  pageUrl?: string;
  showBanners?: number;
}

export default function BannerManagement({
  itemsPerPage = 12,
  title = "All Banners",
  showBanners = 4,
}: BannerManagementProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerDataItem | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  const {
    data: bannersResponse,
    isLoading,
    refetch,
  } = useGetAllWelcomeBannersQuery({
    page,
    limit: itemsPerPage,
    targetSections: "banner",
    ...filters,
  });

  const { data: categoriesResponse } = useGetActiveCategoriesQuery();

  const [createBanner] = useCreateWelcomeBannerMutation();
  const [updateBanner] = useUpdateWelcomeBannerMutation();
  const [deleteBanner] = useDeleteWelcomeBannerMutation();

  const banners: GenericDataItem[] =
    bannersResponse?.data?.map(
      (banner): GenericDataItem => ({
        ...banner,
        id: banner._id || banner.id,
        image: banner.image ? getImageUrl(banner.image) : undefined,
        targetSections: "banner",
      })
    ) || [];

  // Check if we should show Add Banner button
  const shouldShowAddButton = banners.length < showBanners;

  // Column Configuration for Banners
  const bannerColumns: ColumnConfig[] = [
    {
      key: "title",
      label: "Banner Title",
      sortable: true,
      searchable: true,
      align: "left",
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={
                typeof item.image === "string" && item.image.trim() !== ""
                  ? item.image
                  : "/placeholder.svg"
              }
              alt={String(value)}
              className="w-full h-full object-cover"
              width={48}
              height={48}
            />
            <div className="absolute -top-1 -right-1">
              <Badge
                variant="secondary"
                className="text-xs px-1 py-0 h-4"
                style={{
                  backgroundColor: "#f59e0b20",
                  color: "#f59e0b",
                }}
              >
                16:9
              </Badge>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate">{String(value)}</p>
            {typeof item.subtitle === "string" && item.subtitle && (
              <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "subtitle",
      label: "Subtitle",
      type: "text",
      sortable: true,
      searchable: true,
    },
    {
      key: "image",
      label: "Image",
      type: "image",
      sortable: false,
    },
    {
      key: "startDate",
      label: "Start Date",
      type: "date",
      sortable: true,
    },
    {
      key: "endDate",
      label: "End Date",
      type: "date",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      sortable: true,
      filterable: true,
      options: [
        { value: "active", label: "Active", color: "#16a34a" },
        { value: "inactive", label: "Inactive", color: "#ca8a04" },
        { value: "draft", label: "Draft", color: "#6b7280" },
        { value: "scheduled", label: "Scheduled", color: "#3b82f6" },
        { value: "expired", label: "Expired", color: "#dc2626" },
      ],
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      sortable: true,
      filterable: true,
      render: (value) => {
        const categories = Array.isArray(value) ? value : [];
        if (categories.length === 0) {
          return <span className="text-gray-400">No category</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {categories.slice(0, 2).map((cat, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {cat}
              </Badge>
            ))}
            {categories.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{categories.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },

    {
      key: "createdAt",
      label: "Created At",
      type: "date",
      sortable: true,
    },
    {
      key: "updatedAt",
      label: "Updated At",
      type: "date",
      sortable: true,
    },
  ];

  // Card Configuration
  const cardConfig: CardConfig = {
    titleKey: "title",
    imageKey: "image",
    descriptionKey: "subtitle",
    statusKey: "status",
    badgeKeys: ["targetSections"],
    metaKeys: ["createdAt", "category"],
    showDetailsButton: true,
    primaryAction: {
      key: "edit",
      label: "Edit",
      variant: "outline",
      onClick: (item) => handleEditBanner(item as unknown as BannerDataItem),
    },
  };

  // Search Filter Configuration
  const searchFilterConfig: SearchFilterConfig = {
    searchPlaceholder: "Search banners by title, subtitle, category...",
    searchKeys: ["title", "subtitle", "category"],
    enableSort: true,
    sortOptions: [
      { key: "title", label: "Title" },
      { key: "createdAt", label: "Created Date" },
      { key: "startDate", label: "Start Date" },
      { key: "updatedAt", label: "Updated Date" },
    ],
    filters: [
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
    ],
  };

  // Actions Configuration
  const bannerActions: ActionConfig[] = [
    {
      key: "edit",
      label: "Edit Banner",
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
      onClick: (item) => handleEditBanner(item as unknown as BannerDataItem),
    },
    {
      key: "delete",
      label: "Delete Banner",
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
      onClick: (item) => handleDeleteBanner(item.id),
    },
  ];

  // Form Fields Configuration
  const createFormFields: FormField[] = [
    // Basic Information Section
    {
      key: "title",
      label: "Banner Title",
      type: "text",
      required: true,
      placeholder: "Enter banner title",
      validation: {
        minLength: 5,
        maxLength: 100,
      },
      section: "basic",
      gridCol: "full",
    },
    {
      key: "subtitle",
      label: "Subtitle",
      type: "text",
      required: false,
      placeholder: "Enter banner subtitle (optional)",
      validation: {
        maxLength: 150,
      },
      section: "basic",
      gridCol: "full",
    },
    {
      key: "image",
      label: "Banner (16:9 Landscape) Image",
      type: "image",
      required: true,
      section: "basic",
      gridCol: "full",
      helpText:
        "Upload banner image in 16:9 landscape ratio for optimal display",
    },
    // Targeting Section
    {
      key: "category",
      label: "Categories",
      type: "multiselect",
      required: false,
      options:
        categoriesResponse?.data?.map((category) => ({
          value: category.name,
          label: category.name,
        })) || [],
      section: "targeting",
      gridCol: "full",
      helpText: "Select one or more categories for the banner",
    },
    {
      key: "startDate",
      label: "Start Date",
      type: "date",
      required: false,
      section: "targeting",
      gridCol: "half",
    },
    {
      key: "endDate",
      label: "End Date",
      type: "date",
      required: false,
      section: "targeting",
      gridCol: "half",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      required: false,
      options: [
        { value: "active", label: "Active" },
        { value: "draft", label: "Draft" },
        { value: "scheduled", label: "Scheduled" },
        { value: "inactive", label: "Inactive" },
      ],
      section: "targeting",
      gridCol: "half",
    },
  ];

  // Form Sections
  const createModalSections = [
    {
      key: "basic",
      title: "Basic Information",
      description: "Enter the basic details and image for the banner",
      icon: "🏷️",
    },
    {
      key: "targeting",
      title: "Targeting & Scheduling",
      description: "Configure categories, schedule, and activation settings",
      icon: "🎯",
    },
  ];

  // Handle creating new banner
  const handleCreateBanner = async (data: Record<string, unknown>) => {
    try {
      const formData = new FormData();

      formData.append("title", String(data.title || ""));
      formData.append("targetSections", "banner");
      formData.append("status", String(data.status || "active"));

      if (data.subtitle) formData.append("subtitle", String(data.subtitle));
      if (data.startDate) formData.append("startDate", String(data.startDate));
      if (data.endDate) formData.append("endDate", String(data.endDate));

      // Add categories
      if (data.category && Array.isArray(data.category)) {
        data.category.forEach((cat) =>
          formData.append("category[]", String(cat))
        );
      }

      // Handle image
      if (data.image && Array.isArray(data.image) && data.image.length > 0) {
        const imageData = data.image[0];
        if (imageData instanceof File) {
          formData.append("image", imageData);
        } else if (
          typeof imageData === "string" &&
          imageData.startsWith("data:")
        ) {
          const response = await fetch(imageData);
          const blob = await response.blob();
          formData.append("image", blob, "banner-image.png");
        }
      } else {
        toast.error("Banner image is required");
        return;
      }

      // DO NOT send order - let backend auto-handle it

      const result = await createBanner(formData).unwrap();
      if (result.success) {
        toast.success("Banner created successfully");
        setCreateModalOpen(false);
        refetch();
      }
    } catch (error: unknown) {
      console.log("Banner create error::", error);
      if (typeof error === "object" && error !== null && "data" in error) {
        const err = error as { data?: { message?: string } };
        toast.error(err.data?.message || "Failed to create banner");
      } else {
        toast.error("Failed to create banner");
      }
    }
  };

  // Handle editing banner
  const handleEditBanner = (banner: BannerDataItem) => {
    const bannerToEdit = {
      ...banner,
      id: banner._id || banner.id,
    };
    setEditingBanner(bannerToEdit);
    setEditModalOpen(true);
  };

  // Handle updating banner
  const handleUpdateBanner = async (data: Record<string, unknown>) => {
    if (!editingBanner || !editingBanner.id) {
      toast.error("Invalid banner data");
      return;
    }

    try {
      const formData = new FormData();

      // Filter out read-only fields AND order (let backend handle it)
      const fieldsToExclude = [
        "_id",
        "id",
        "createdAt",
        "updatedAt",
        "__v",
        "order",
      ];

      // Add updated fields
      Object.keys(data).forEach((key) => {
        if (fieldsToExclude.includes(key)) return;

        const value = data[key];
        if (value !== undefined && value !== null) {
          if (key === "image" && Array.isArray(value)) {
            // Handle images separately
            return;
          } else if (key === "category" && Array.isArray(value)) {
            value.forEach((cat) => formData.append("category[]", String(cat)));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Handle image if provided
      if (data.image && Array.isArray(data.image) && data.image.length > 0) {
        const imageData = data.image[0];
        if (imageData instanceof File) {
          formData.append("image", imageData);
        } else if (
          typeof imageData === "string" &&
          imageData.startsWith("data:")
        ) {
          const response = await fetch(imageData);
          const blob = await response.blob();
          formData.append("image", blob, "banner-image.png");
        }
      }

      // DO NOT send order - let backend auto-handle it

      const result = await updateBanner({
        id: editingBanner.id,
        data: formData,
      }).unwrap();

      if (result.success) {
        toast.success("Banner updated successfully");
        setEditModalOpen(false);
        setEditingBanner(null);
        refetch();
      }
    } catch (error: unknown) {
      console.log("Banner update error::", error);
      if (typeof error === "object" && error !== null && "data" in error) {
        const err = error as { data?: { message?: string } };
        toast.error(err.data?.message || "Failed to update banner");
      } else {
        toast.error("Failed to update banner");
      }
    }
  };

  // Handle deleting banner
  const handleDeleteBanner = async (bannerId: string) => {
    if (!bannerId || bannerId === "undefined") {
      toast.error("Invalid banner ID");
      return;
    }

    try {
      await deleteBanner(bannerId).unwrap();
      toast.success("Banner deleted successfully");
      refetch();
    } catch (error: unknown) {
      console.log("Banner delete error::", error);
      if (typeof error === "object" && error !== null && "data" in error) {
        const err = error as { data?: { message?: string } };
        toast.error(err.data?.message || "Failed to delete banner");
      } else {
        toast.error("Failed to delete banner");
      }
    }
  };

  // Handle data change from DynamicCard3D
  const handleDataChange = (newData: GenericDataItem[]) => {
    console.log("Banners data changed:", newData);
    refetch();
  };

  // Handle filters change
  const handleFiltersChange = (newFilters: Record<string, unknown>) => {
    setFilters(newFilters);
    setPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Prepare initial data for edit modal
  const getEditInitialData = () => {
    if (!editingBanner) return {};

    return {
      ...editingBanner,
      category: editingBanner.category || [],
    };
  };

  return (
    <div className="w-full mx-auto">
      <div className="w-full flex justify-between items-center mb-6">
        <div>
          <h2 className="text-foreground text-xl font-semibold">{title}</h2>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500/20 border border-amber-500 rounded"></div>
              <span>Banner (16:9 Landscape)</span>
            </div>
          </div>
        </div>
        {shouldShowAddButton && (
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
            <span>Add Banner</span>
          </Button>
        )}
      </div>

      {/* Dynamic 3D Card Component */}
      <DynamicCard3D
        data={banners}
        columns={bannerColumns}
        cardConfig={cardConfig}
        actions={bannerActions}
        searchFilterConfig={searchFilterConfig}
        onDataChange={handleDataChange}
        loading={isLoading}
        emptyMessage="No banners found"
        itemsPerPage={itemsPerPage}
        currentPage={page}
        onPageChange={handlePageChange}
        totalItems={bannersResponse?.meta?.total || 0}
        onFiltersChange={handleFiltersChange}
      />

      {/* Create Banner Modal */}
      <DynamicDataCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateBanner}
        title="Create New Banner"
        description="Create banners with 16:9 landscape ratio for optimal display"
        fields={createFormFields}
        sections={createModalSections}
        initialData={{
          status: "active",
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        }}
        saveButtonText="Create Banner"
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

      {/* Edit Banner Modal */}
      {editingBanner && (
        <DynamicDataCreateModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingBanner(null);
          }}
          onSave={handleUpdateBanner}
          title="Edit Banner"
          description="Update banner information and settings"
          fields={createFormFields}
          sections={createModalSections}
          initialData={getEditInitialData()}
          saveButtonText="Update Banner"
          cancelButtonText="Cancel"
          maxImageUpload={1}
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
