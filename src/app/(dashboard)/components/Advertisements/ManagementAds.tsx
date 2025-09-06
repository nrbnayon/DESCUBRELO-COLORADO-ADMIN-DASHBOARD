// src\app\(dashboard)\components\Advertisements\ManagementAds.tsx
"use client";
import { adsData, AdsDataItem } from "@/data/adsData";
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

interface AdsManagementProps {
  itemsPerPage?: number;
  title?: string;
  buttonText?: string;
  pageUrl?: string;
  showAds?: number;
}

export default function ManagementAds({
  itemsPerPage = 12,
  title = "All Ads",
  showAds = 4,
}: AdsManagementProps) {
  const [ads, setAds] = useState(adsData);
  const [isLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<AdsDataItem | null>(null);

  // Check if we should show Add Ads button
  const shouldShowAddButton = ads.length < showAds;

  // Helper function to get image ratio info
  const getImageRatioInfo = (targetSection?: string) => {
    switch (targetSection) {
      case "welcome":
        return { ratio: "9:16", color: "#3b82f6", label: "Welcome (9:16)" };
      case "hero":
        return { ratio: "16:9", color: "#10b981", label: "Hero (16:9)" };
      case "banner":
        return { ratio: "16:9", color: "#f59e0b", label: "Banner (16:9)" };
      default:
        return { ratio: "1:1", color: "#6b7280", label: "Default (1:1)" };
    }
  };

  // Column Configuration for Ads
  const adsColumns: ColumnConfig[] = [
    {
      key: "title",
      label: "Ad Title",
      sortable: true,
      searchable: true,
      align: "left",
      render: (value, item) => {
        const ratioInfo = getImageRatioInfo(item.targetSections);
        return (
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
                    backgroundColor: ratioInfo.color + "20",
                    color: ratioInfo.color,
                  }}
                >
                  {ratioInfo.ratio}
                </Badge>
              </div>
            </div>
            <div className='min-w-0 flex-1'>
              <p className='font-medium text-sm truncate'>{String(value)}</p>
              {typeof item.subtitle === "string" && item.subtitle && (
                <p className='text-xs text-gray-500 truncate'>
                  {item.subtitle}
                </p>
              )}
            </div>
          </div>
        );
      },
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
      key: "targetSections",
      label: "Target Section",
      type: "select",
      sortable: true,
      filterable: true,
      options: [
        {
          value: "welcome",
          label: "Welcome (9:16)",
          color: "#3b82f6",
          icon: "📱",
        },
        // { value: "banner", label: "Hero (16:9)", color: "#10b981", icon: "🏆" },
        {
          value: "banner",
          label: "Banner (16:9)",
          color: "#f59e0b",
          icon: "🏷️",
        },
      ],
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
    badgeKeys: ["targetSections"],
    metaKeys: ["createdAt", "category"],
    showDetailsButton: true,
    primaryAction: {
      key: "edit",
      label: "Edit",
      variant: "outline",
      onClick: (item) => handleEditAd(item as AdsDataItem),
    },
  };

  // Search Filter Configuration
  const searchFilterConfig: SearchFilterConfig = {
    searchPlaceholder: "Search ads by title, subtitle, category...",
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
      {
        key: "targetSections",
        label: "Target Section",
        type: "select",
        options: [
          { value: "welcome", label: "Welcome (9:16)" },
          // { value: "hero", label: "Hero (16:9)" },
          { value: "banner", label: "Banner (16:9)" },
        ],
      },
    ],
  };

  // Actions Configuration
  const adActions: ActionConfig[] = [
    {
      key: "edit",
      label: "Edit Ad",
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
      onClick: (item) => handleEditAd(item as AdsDataItem),
    },
    {
      key: "delete",
      label: "Delete Ad",
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
      onClick: (item) => handleDeleteAd(item.id),
    },
  ];

  // Form Fields Configuration
  const createFormFields: FormField[] = [
    // Basic Information Section
    {
      key: "title",
      label: "Ad Title",
      type: "text",
      required: true,
      placeholder: "Enter ad title",
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
      placeholder: "Enter ad subtitle (optional)",
      validation: {
        maxLength: 150,
      },
      section: "basic",
      gridCol: "full",
    },
    {
      key: "targetSections",
      label: "Target Section & Image Ratio",
      type: "select",
      required: false,
      options: [
        {
          value: "welcome",
          label: "Welcome Screen (9:16 Portrait)",
          description: "Vertical format for welcome/splash screens",
        },
        // {
        //   value: "hero",
        //   label: "Hero Section (16:9 Landscape)",
        //   description: "Wide format for main hero banners",
        // },
        {
          value: "banner",
          label: "Banner Section (16:9 Landscape)",
          description: "Wide format for promotional banners",
        },
      ],
      section: "basic",
      gridCol: "half",
      helpText: "Select target section to determine optimal image ratio",
    },
    {
      key: "image",
      label: "Ad Image",
      type: "image",
      required: true,
      section: "basic",
      gridCol: "half",
      helpText: "Upload image matching the selected section's ratio",
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
      helpText: "Select one or more categories for the ad",
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
      description: "Enter the basic details and image for the ad",
      icon: "📝",
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

  // Handle creating new ad
  const handleCreateAd = (data: Record<string, unknown>) => {
    // Handle image - single image only for ads
    const imageValue =
      Array.isArray(data.image) && data.image.length > 0
        ? data.image[0]
        : typeof data.image === "string"
        ? data.image
        : "";

    const newAdData: AdsDataItem = {
      id: `ad${Date.now()}`,
      title: String(data.title || ""),
      subtitle: data.subtitle ? String(data.subtitle) : undefined,
      image:
        imageValue ||
        `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop`,
      targetSections: String(data.targetSections || "") as
        | "welcome"
        | "hero"
        | "banner"
        | undefined,
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
      category: processCategories(data.category),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedAds = [newAdData, ...ads];
    setAds(updatedAds);
    console.log("New ad created:", newAdData);
  };

  // Handle editing ad
  const handleEditAd = (ad: AdsDataItem) => {
    setEditingAd(ad);
    setEditModalOpen(true);
  };

  // Handle updating ad
  const handleUpdateAd = (data: Record<string, unknown>) => {
    if (!editingAd) return;

    // Handle image
    const imageValue =
      Array.isArray(data.image) && data.image.length > 0
        ? data.image[0]
        : typeof data.image === "string"
        ? data.image
        : editingAd.image;

    const updatedAdData: AdsDataItem = {
      ...editingAd,
      title: String(data.title || ""),
      subtitle: data.subtitle ? String(data.subtitle) : undefined,
      image: imageValue,
      targetSections: String(data.targetSections || "") as
        | "welcome"
        | "hero"
        | "banner"
        | undefined,
      startDate: String(data.startDate || editingAd.startDate),
      endDate: String(data.endDate || editingAd.endDate),
      status: String(data.status || "draft") as
        | "active"
        | "inactive"
        | "draft"
        | "scheduled"
        | "expired",
      category: processCategories(data.category),
      updatedAt: new Date().toISOString(),
    };

    const updatedAds = ads.map((ad) =>
      ad.id === editingAd.id ? updatedAdData : ad
    );
    setAds(updatedAds);
    setEditingAd(null);
    console.log("Ad updated:", updatedAdData);
  };

  // Handle deleting ad
  const handleDeleteAd = (adId: string) => {
    const updatedAds = ads.filter((ad) => ad.id !== adId);
    setAds(updatedAds);
    console.log("Ad deleted:", adId);
  };

  // Handle data change from DynamicCard3D
  const handleDataChange = (newData: GenericDataItem[]) => {
    setAds(newData as AdsDataItem[]);
  };

  // Prepare initial data for edit modal
  const getEditInitialData = () => {
    if (!editingAd) return {};

    return {
      ...editingAd,
      category: editingAd.category || [],
    };
  };

  return (
    <div className='w-full mx-auto'>
      <div className='w-full flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-foreground text-xl font-semibold'>{title}</h2>
          <div className='flex items-center gap-4 mt-2 text-sm text-muted-foreground'>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-blue-500/20 border border-blue-500 rounded'></div>
              <span>Welcome (9:16)</span>
            </div>
            {/* <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-green-500/20 border border-green-500 rounded'></div>
              <span>Hero (16:9)</span>
            </div> */}
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-amber-500/20 border border-amber-500 rounded'></div>
              <span>Banner (16:9)</span>
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
            <span>Add Ads</span>
          </Button>
        )}
      </div>

      {/* Dynamic 3D Card Component */}
      <DynamicCard3D
        data={ads}
        columns={adsColumns}
        cardConfig={cardConfig}
        actions={adActions}
        searchFilterConfig={searchFilterConfig}
        onDataChange={handleDataChange}
        loading={isLoading}
        emptyMessage='No ads found'
        itemsPerPage={itemsPerPage}
      />

      {/* Create Ad Modal */}
      <DynamicDataCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateAd}
        title='Create New Ad'
        description='Create ads with appropriate image ratios for different sections'
        fields={createFormFields}
        sections={createModalSections}
        initialData={{
          status: "draft",
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        }}
        saveButtonText='Create Ad'
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

      {/* Edit Ad Modal */}
      {editingAd && (
        <DynamicDataCreateModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingAd(null);
          }}
          onSave={handleUpdateAd}
          title='Edit Ad'
          description='Update ad information and settings'
          fields={createFormFields}
          sections={createModalSections}
          initialData={getEditInitialData()}
          saveButtonText='Update Ad'
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
