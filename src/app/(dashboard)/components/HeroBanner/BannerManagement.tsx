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

// Banner Data Interface
interface BannerDataItem extends GenericDataItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  targetSection: "banner"; // Always banner for this component
  startDate: string;
  endDate: string;
  status: "active" | "inactive" | "draft" | "scheduled" | "expired";
  category: string[];
  createdAt: string;
  updatedAt?: string;
}

// Sample banner data
const initialBannerData: BannerDataItem[] = [
  {
    id: "banner001",
    title: "Premium Tech Solutions for Your Business",
    subtitle: "Transform your business operations with cutting-edge technology",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    targetSection: "banner",
    startDate: "2025-01-01T00:00:00.000Z",
    endDate: "2025-03-31T23:59:59.000Z",
    status: "active",
    category: ["Technology", "Business"],
    createdAt: "2025-01-15T08:30:00.000Z",
    updatedAt: "2025-01-20T10:15:00.000Z",
  },
  {
    id: "banner002",
    title: "Digital Marketing Revolution",
    subtitle: "Boost your online presence with innovative marketing strategies",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    targetSection: "banner",
    startDate: "2025-02-01T00:00:00.000Z",
    endDate: "2025-04-30T23:59:59.000Z",
    status: "active",
    category: ["Marketing", "Business"],
    createdAt: "2025-01-16T09:45:00.000Z",
    updatedAt: "2025-01-21T14:20:00.000Z",
  },
  {
    id: "banner003",
    title: "Health & Wellness Journey",
    subtitle: "Start your wellness transformation today with expert guidance",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    targetSection: "banner",
    startDate: "2025-01-15T00:00:00.000Z",
    endDate: "2025-05-15T23:59:59.000Z",
    status: "active",
    category: ["Health", "Wellness"],
    createdAt: "2025-01-17T11:30:00.000Z",
    updatedAt: "2025-01-22T16:45:00.000Z",
  },
  {
    id: "banner004",
    title: "Educational Excellence Program",
    subtitle: "Unlock your potential with our comprehensive learning platform",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    targetSection: "banner",
    startDate: "2025-03-01T00:00:00.000Z",
    endDate: "2025-06-30T23:59:59.000Z",
    status: "scheduled",
    category: ["Education", "Online Learning"],
    createdAt: "2025-01-18T13:15:00.000Z",
    updatedAt: "2025-01-23T09:30:00.000Z",
  },
];

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
  const [banners, setBanners] = useState(initialBannerData);
  const [isLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerDataItem | null>(
    null
  );

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
        <div className='flex items-center gap-3'>
          <div className='relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0'>
            <Image
              src={
                typeof item.image === "string" && item.image.trim() !== ""
                  ? item.image
                  : "/placeholder.svg?height=48&width=48"
              }
              alt={String(value)}
              className='w-full h-full object-cover'
              width={48}
              height={48}
            />
            <div className='absolute -top-1 -right-1'>
              <Badge
                variant='secondary'
                className='text-xs px-1 py-0 h-4'
                style={{
                  backgroundColor: "#f59e0b20",
                  color: "#f59e0b",
                }}
              >
                16:9
              </Badge>
            </div>
          </div>
          <div className='min-w-0 flex-1'>
            <p className='font-medium text-sm truncate'>{String(value)}</p>
            {typeof item.subtitle === "string" && item.subtitle && (
              <p className='text-xs text-gray-500 truncate'>{item.subtitle}</p>
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
        const categories = value as string[];
        if (!Array.isArray(categories) || categories.length === 0) {
          return <span className='text-gray-400'>No category</span>;
        }
        return (
          <div className='flex flex-wrap gap-1'>
            {categories.slice(0, 2).map((cat, index) => (
              <Badge key={index} variant='outline' className='text-xs'>
                {cat}
              </Badge>
            ))}
            {categories.length > 2 && (
              <Badge variant='secondary' className='text-xs'>
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
    badgeKeys: ["targetSection"],
    metaKeys: ["createdAt", "category"],
    showDetailsButton: true,
    primaryAction: {
      key: "edit",
      label: "Edit",
      variant: "outline",
      onClick: (item) => handleEditBanner(item as BannerDataItem),
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
      onClick: (item) => handleEditBanner(item as BannerDataItem),
    },
    {
      key: "delete",
      label: "Delete Banner",
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
      options: [
        { value: "Technology", label: "Technology" },
        { value: "Business", label: "Business" },
        { value: "Marketing", label: "Marketing" },
        { value: "Fashion", label: "Fashion" },
        { value: "Health", label: "Health & Wellness" },
        { value: "Wellness", label: "Wellness" },
        { value: "Education", label: "Education" },
        { value: "Travel", label: "Travel & Tourism" },
        { value: "Food", label: "Food & Beverage" },
        { value: "Entertainment", label: "Entertainment" },
        { value: "Sports", label: "Sports & Fitness" },
        { value: "Automotive", label: "Automotive" },
        { value: "Real Estate", label: "Real Estate" },
        { value: "Finance", label: "Finance & Banking" },
        { value: "Retail", label: "Retail & E-commerce" },
        { value: "Smart Home", label: "Smart Home & IoT" },
        { value: "Online Learning", label: "Online Learning" },
      ],
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

  // Utility function to process categories
  const processCategories = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.map((v) => String(v)).filter((cat) => cat.length > 0);
    }
    if (typeof value === "string" && value.trim()) {
      return value
        .split(",")
        .map((cat) => cat.trim())
        .filter((cat) => cat.length > 0);
    }
    return [];
  };

  // Handle creating new banner
  const handleCreateBanner = (data: Record<string, unknown>) => {
    // Handle image - single image only for banners
    const imageValue =
      Array.isArray(data.image) && data.image.length > 0
        ? data.image[0]
        : typeof data.image === "string"
        ? data.image
        : "";

    const newBannerData: BannerDataItem = {
      id: `banner${Date.now()}`,
      title: String(data.title || ""),
      subtitle: data.subtitle ? String(data.subtitle) : undefined,
      image:
        imageValue ||
        `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop`,
      targetSection: "banner", // Always banner
      startDate: String(data.startDate || new Date().toISOString()),
      endDate: String(
        data.endDate ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      ),
      status: String(data.status || "active") as  // Default to active
        | "active"
        | "inactive"
        | "draft"
        | "scheduled"
        | "expired",
      category: processCategories(data.category),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedBanners = [newBannerData, ...banners];
    setBanners(updatedBanners);
    console.log("New banner created:", newBannerData);
  };

  // Handle editing banner
  const handleEditBanner = (banner: BannerDataItem) => {
    setEditingBanner(banner);
    setEditModalOpen(true);
  };

  // Handle updating banner
  const handleUpdateBanner = (data: Record<string, unknown>) => {
    if (!editingBanner) return;

    // Handle image
    const imageValue =
      Array.isArray(data.image) && data.image.length > 0
        ? data.image[0]
        : typeof data.image === "string"
        ? data.image
        : editingBanner.image;

    const updatedBannerData: BannerDataItem = {
      ...editingBanner,
      title: String(data.title || ""),
      subtitle: data.subtitle ? String(data.subtitle) : undefined,
      image: imageValue,
      targetSection: "banner", // Always banner
      startDate: String(data.startDate || editingBanner.startDate),
      endDate: String(data.endDate || editingBanner.endDate),
      status: String(data.status || "active") as  // Keep current or default to active
        | "active"
        | "inactive"
        | "draft"
        | "scheduled"
        | "expired",
      category: processCategories(data.category),
      updatedAt: new Date().toISOString(),
    };

    const updatedBanners = banners.map((banner) =>
      banner.id === editingBanner.id ? updatedBannerData : banner
    );
    setBanners(updatedBanners);
    setEditingBanner(null);
    console.log("Banner updated:", updatedBannerData);
  };

  // Handle deleting banner
  const handleDeleteBanner = (bannerId: string) => {
    const updatedBanners = banners.filter((banner) => banner.id !== bannerId);
    setBanners(updatedBanners);
    console.log("Banner deleted:", bannerId);
  };

  // Handle data change from DynamicCard3D
  const handleDataChange = (newData: GenericDataItem[]) => {
    setBanners(newData as BannerDataItem[]);
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
    <div className='w-full mx-auto'>
      <div className='w-full flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-foreground text-xl font-semibold'>{title}</h2>
          <div className='flex items-center gap-4 mt-2 text-sm text-muted-foreground'>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-amber-500/20 border border-amber-500 rounded'></div>
              <span>Banner (16:9 Landscape)</span>
            </div>
          </div>
        </div>
        {shouldShowAddButton && (
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
        emptyMessage='No banners found'
        itemsPerPage={itemsPerPage}
      />

      {/* Create Banner Modal */}
      <DynamicDataCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateBanner}
        title='Create New Banner'
        description='Create banners with 16:9 landscape ratio for optimal display'
        fields={createFormFields}
        sections={createModalSections}
        initialData={{
          status: "active", 
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        }}
        saveButtonText='Create Banner'
        cancelButtonText='Cancel'
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
          title='Edit Banner'
          description='Update banner information and settings'
          fields={createFormFields}
          sections={createModalSections}
          initialData={getEditInitialData()}
          saveButtonText='Update Banner'
          cancelButtonText='Cancel'
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
