// Admin Dashboard\src\app\(dashboard)\components\AppWelcomeScreen\WelcomeManagement.tsx
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
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";

// Welcome Screen Data Interface
interface WelcomeDataItem {
  _id?: string;
  id: string;
  title: string;
  image?: string;
  targetSections: "welcome";
  status: "active" | "inactive" | "draft" | "scheduled" | "expired";
  createdAt: string;
  updatedAt?: string;
}

interface WelcomeManagementProps {
  itemsPerPage?: number;
  title?: string;
  buttonText?: string;
  pageUrl?: string;
  showWelcomeScreens?: number;
}

export default function WelcomeManagement({
  itemsPerPage = 12,
  title = "All Welcome Screens",
  showWelcomeScreens = 4,
}: WelcomeManagementProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingWelcome, setEditingWelcome] = useState<WelcomeDataItem | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  const {
    data: welcomeResponse,
    isLoading,
    refetch,
  } = useGetAllWelcomeBannersQuery({
    page,
    limit: itemsPerPage,
    targetSections: "welcome",
    ...filters,
  });

  const [createWelcome] = useCreateWelcomeBannerMutation();
  const [updateWelcome] = useUpdateWelcomeBannerMutation();
  const [deleteWelcome] = useDeleteWelcomeBannerMutation();

  const welcomeScreens: GenericDataItem[] =
    welcomeResponse?.data?.map(
      (welcome): GenericDataItem => ({
        ...welcome,
        id: welcome._id || welcome.id,
        image: welcome.image ? getImageUrl(welcome.image) : undefined,
        targetSections: "welcome",
      })
    ) || [];

  // Check if we should show Add Welcome Screen button
  const shouldShowAddButton = welcomeScreens.length < showWelcomeScreens;

  // Column Configuration for Welcome Screens
  const welcomeColumns: ColumnConfig[] = [
    {
      key: "title",
      label: "Welcome Screen Title",
      sortable: true,
      searchable: true,
      align: "left",
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={
                typeof item.image === "string" && item.image.trim() !== ""
                  ? item.image
                  : "/placeholder.svg"
              }
              alt={String(value)}
              className="w-full h-full object-cover"
              width={32}
              height={48}
            />
            <div className="absolute -top-1 -right-1">
              <Badge
                variant="secondary"
                className="text-xs px-1 py-0 h-4"
                style={{
                  backgroundColor: "#3b82f620",
                  color: "#3b82f6",
                }}
              >
                9:16
              </Badge>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate">{String(value)}</p>
          </div>
        </div>
      ),
    },
    {
      key: "image",
      label: "Image",
      type: "image",
      sortable: false,
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
    statusKey: "status",
    badgeKeys: ["targetSections"],
    metaKeys: ["createdAt"],
    showDetailsButton: true,
    primaryAction: {
      key: "edit",
      label: "Edit",
      variant: "outline",
      onClick: (item) => handleEditWelcome(item as unknown as WelcomeDataItem),
    },
  };

  // Search Filter Configuration
  const searchFilterConfig: SearchFilterConfig = {
    searchPlaceholder: "Search welcome screens by title...",
    searchKeys: ["title"],
    enableSort: true,
    sortOptions: [
      { key: "title", label: "Title" },
      { key: "createdAt", label: "Created Date" },
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
  const welcomeActions: ActionConfig[] = [
    {
      key: "edit",
      label: "Edit Welcome Screen",
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
      onClick: (item) => handleEditWelcome(item as unknown as WelcomeDataItem),
    },
    {
      key: "delete",
      label: "Delete Welcome Screen",
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
      onClick: (item) => handleDeleteWelcome(item.id),
    },
  ];

  // Form Fields Configuration
  const createFormFields: FormField[] = [
    {
      key: "title",
      label: "Welcome Screen Title",
      type: "text",
      required: true,
      placeholder: "Enter welcome screen title",
      validation: {
        minLength: 3,
        maxLength: 100,
      },
      section: "basic",
      gridCol: "full",
    },
    {
      key: "image",
      label: "Welcome Screen Image (9:16 Portrait)",
      type: "image",
      required: true,
      section: "basic",
      gridCol: "full",
      helpText:
        "Upload welcome screen image in 9:16 portrait ratio for optimal display",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      required: false,
      options: [
        { value: "active", label: "Active" },
        { value: "draft", label: "Draft" },
        { value: "inactive", label: "Inactive" },
      ],
      section: "basic",
      gridCol: "half",
    },
  ];

  // Form Sections
  const createModalSections = [
    {
      key: "basic",
      title: "Basic Information",
      description: "Enter the basic details and image for the welcome screen",
      icon: "📱",
    },
  ];

  // Handle creating new welcome screen
  const handleCreateWelcome = async (data: Record<string, unknown>) => {
    try {
      const formData = new FormData();

      formData.append("title", String(data.title || ""));
      formData.append("targetSections", "welcome");
      formData.append("status", String(data.status || "active"));

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
          formData.append("image", blob, "welcome-image.png");
        }
      } else {
        toast.error("Welcome screen image is required");
        return;
      }

      const result = await createWelcome(formData).unwrap();
      if (result.success) {
        toast.success("Welcome screen created successfully");
        setCreateModalOpen(false);
        refetch();
      }
    } catch (error: unknown) {
      console.log("Welcome create error::", error);
      if (typeof error === "object" && error !== null && "data" in error) {
        const err = error as { data?: { message?: string } };
        toast.error(err.data?.message || "Failed to create welcome screen");
      } else {
        toast.error("Failed to create welcome screen");
      }
    }
  };

  // Handle editing welcome screen
  const handleEditWelcome = (welcome: WelcomeDataItem) => {
    const welcomeToEdit = {
      ...welcome,
      id: welcome._id || welcome.id,
    };
    setEditingWelcome(welcomeToEdit);
    setEditModalOpen(true);
  };

  // Handle updating welcome screen
  const handleUpdateWelcome = async (data: Record<string, unknown>) => {
    if (!editingWelcome || !editingWelcome.id) {
      toast.error("Invalid welcome screen data");
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
        "category",
      ];

      // Add updated fields
      Object.keys(data).forEach((key) => {
        if (fieldsToExclude.includes(key)) return;

        const value = data[key];
        if (value !== undefined && value !== null) {
          if (key === "image" && Array.isArray(value)) {
            // Handle images separately
            return;
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
          formData.append("image", blob, "welcome-image.png");
        }
      }

      const result = await updateWelcome({
        id: editingWelcome.id,
        data: formData,
      }).unwrap();

      if (result.success) {
        toast.success("Welcome screen updated successfully");
        setEditModalOpen(false);
        setEditingWelcome(null);
        refetch();
      }
    } catch (error: unknown) {
      console.log("Welcome update error::", error);
      if (typeof error === "object" && error !== null && "data" in error) {
        const err = error as { data?: { message?: string } };
        toast.error(err.data?.message || "Failed to update welcome screen");
      } else {
        toast.error("Failed to update welcome screen");
      }
    }
  };

  // Handle deleting welcome screen
  const handleDeleteWelcome = async (welcomeId: string) => {
    if (!welcomeId || welcomeId === "undefined") {
      toast.error("Invalid welcome screen ID");
      return;
    }

    try {
      await deleteWelcome(welcomeId).unwrap();
      toast.success("Welcome screen deleted successfully");
      refetch();
    } catch (error: unknown) {
      console.log("Welcome delete error::", error);
      if (typeof error === "object" && error !== null && "data" in error) {
        const err = error as { data?: { message?: string } };
        toast.error(err.data?.message || "Failed to delete welcome screen");
      } else {
        toast.error("Failed to delete welcome screen");
      }
    }
  };

  // Handle data change from DynamicCard3D
  const handleDataChange = (newData: GenericDataItem[]) => {
    console.log("Welcome screens data changed:", newData);
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
    if (!editingWelcome) return {};

    return {
      ...editingWelcome,
    };
  };

  return (
    <div className="w-full mx-auto">
      <div className="w-full flex justify-between items-center mb-6">
        <div>
          <h2 className="text-foreground text-xl font-semibold">{title}</h2>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500/20 border border-blue-500 rounded"></div>
              <span>Welcome Screen (9:16 Portrait)</span>
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
            <span>Add Welcome Screen</span>
          </Button>
        )}
      </div>

      {/* Dynamic 3D Card Component */}
      <DynamicCard3D
        data={welcomeScreens}
        columns={welcomeColumns}
        cardConfig={cardConfig}
        actions={welcomeActions}
        searchFilterConfig={searchFilterConfig}
        onDataChange={handleDataChange}
        loading={isLoading}
        emptyMessage="No welcome screens found"
        itemsPerPage={itemsPerPage}
        currentPage={page}
        onPageChange={handlePageChange}
        totalItems={welcomeResponse?.meta?.total || 0}
        onFiltersChange={handleFiltersChange}
      />

      {/* Create Welcome Screen Modal */}
      <DynamicDataCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateWelcome}
        title="Create New Welcome Screen"
        description="Create welcome screens with 9:16 portrait ratio for mobile devices"
        fields={createFormFields}
        sections={createModalSections}
        initialData={{
          status: "active",
        }}
        saveButtonText="Create Welcome Screen"
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

      {/* Edit Welcome Screen Modal */}
      {editingWelcome && (
        <DynamicDataCreateModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingWelcome(null);
          }}
          onSave={handleUpdateWelcome}
          title="Edit Welcome Screen"
          description="Update welcome screen information and settings"
          fields={createFormFields}
          sections={createModalSections}
          initialData={getEditInitialData()}
          saveButtonText="Update Welcome Screen"
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
