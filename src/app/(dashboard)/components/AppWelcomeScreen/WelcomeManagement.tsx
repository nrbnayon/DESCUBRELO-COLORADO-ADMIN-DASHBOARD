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

// Welcome Screen Data Interface
interface WelcomeDataItem extends GenericDataItem {
  id: string;
  title: string;
  image?: string;
  targetSection: "welcome"; // Always welcome for this component
  status: "active" | "inactive" | "draft" | "expired";
  createdAt: string;
  updatedAt?: string;
}

// Sample welcome screen data
const initialWelcomeData: WelcomeDataItem[] = [
  {
    id: "welcome001",
    title: "Welcome to Our Platform",
    image:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=700&fit=crop&crop=entropy&auto=format&q=80",
    targetSection: "welcome",
    status: "active",
    createdAt: "2025-01-15T08:30:00.000Z",
    updatedAt: "2025-01-20T10:15:00.000Z",
  },
];

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
  const [welcomeScreens, setWelcomeScreens] = useState(initialWelcomeData);
  const [isLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingWelcome, setEditingWelcome] = useState<WelcomeDataItem | null>(
    null
  );

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
        <div className='flex items-center gap-3'>
          <div className='relative w-8 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0'>
            <Image
              src={
                typeof item.image === "string" && item.image.trim() !== ""
                  ? item.image
                  : "/placeholder.svg?height=48&width=32"
              }
              alt={String(value)}
              className='w-full h-full object-cover'
              width={32}
              height={48}
            />
            <div className='absolute -top-1 -right-1'>
              <Badge
                variant='secondary'
                className='text-xs px-1 py-0 h-4'
                style={{
                  backgroundColor: "#3b82f620",
                  color: "#3b82f6",
                }}
              >
                9:16
              </Badge>
            </div>
          </div>
          <div className='min-w-0 flex-1'>
            <p className='font-medium text-sm truncate'>{String(value)}</p>
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
    metaKeys: ["createdAt"],
    showDetailsButton: true,
    primaryAction: {
      key: "edit",
      label: "Edit",
      variant: "outline",
      onClick: (item) => handleEditWelcome(item as WelcomeDataItem),
    },
  };

  // Search Filter Configuration
  const searchFilterConfig: SearchFilterConfig = {
    searchPlaceholder: "Search welcome screens by title",
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
      onClick: (item) => handleEditWelcome(item as WelcomeDataItem),
    },
    {
      key: "delete",
      label: "Delete Welcome Screen",
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
      onClick: (item) => handleDeleteWelcome(item.id),
    },
  ];

  // Form Fields Configuration
  const createFormFields: FormField[] = [
    // Basic Information Section
    {
      key: "title",
      label: "Welcome Screen Title",
      type: "text",
      required: true,
      placeholder: "Enter welcome screen",
      validation: {
        minLength: 5,
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
      section: "targeting",
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
  const handleCreateWelcome = (data: Record<string, unknown>) => {
    // Handle image - single image only for welcome screens
    const imageValue =
      Array.isArray(data.image) && data.image.length > 0
        ? data.image[0]
        : typeof data.image === "string"
        ? data.image
        : "";

    const newWelcomeData: WelcomeDataItem = {
      id: `welcome${Date.now()}`,
      title: String(data.title || ""),
      image:
        imageValue ||
        `https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=700&fit=crop`,
      targetSection: "welcome", 
      status: String(data.status || "active") as  
        | "active"
        | "inactive"
        | "draft"
        | "expired",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedWelcomeScreens = [newWelcomeData, ...welcomeScreens];
    setWelcomeScreens(updatedWelcomeScreens);
    console.log("New welcome screen created:", newWelcomeData);
  };

  // Handle editing welcome screen
  const handleEditWelcome = (welcome: WelcomeDataItem) => {
    setEditingWelcome(welcome);
    setEditModalOpen(true);
  };

  // Handle updating welcome screen
  const handleUpdateWelcome = (data: Record<string, unknown>) => {
    if (!editingWelcome) return;

    // Handle image
    const imageValue =
      Array.isArray(data.image) && data.image.length > 0
        ? data.image[0]
        : typeof data.image === "string"
        ? data.image
        : editingWelcome.image;

    const updatedWelcomeData: WelcomeDataItem = {
      ...editingWelcome,
      title: String(data.title || ""),
      image: imageValue,
      targetSection: "welcome", // Always welcome
      status: String(data.status || "active") as 
        | "active"
        | "inactive"
        | "draft"
        | "expired",
      updatedAt: new Date().toISOString(),
    };

    const updatedWelcomeScreens = welcomeScreens.map((welcome) =>
      welcome.id === editingWelcome.id ? updatedWelcomeData : welcome
    );
    setWelcomeScreens(updatedWelcomeScreens);
    setEditingWelcome(null);
    console.log("Welcome screen updated:", updatedWelcomeData);
  };

  // Handle deleting welcome screen
  const handleDeleteWelcome = (welcomeId: string) => {
    const updatedWelcomeScreens = welcomeScreens.filter(
      (welcome) => welcome.id !== welcomeId
    );
    setWelcomeScreens(updatedWelcomeScreens);
    console.log("Welcome screen deleted:", welcomeId);
  };

  // Handle data change from DynamicCard3D
  const handleDataChange = (newData: GenericDataItem[]) => {
    setWelcomeScreens(newData as WelcomeDataItem[]);
  };

  // Prepare initial data for edit modal
  const getEditInitialData = () => {
    if (!editingWelcome) return {};

    return {
      ...editingWelcome,
      category: editingWelcome.category || [],
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
              <span>Welcome Screen (9:16 Portrait)</span>
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
        emptyMessage='No welcome screens found'
        itemsPerPage={itemsPerPage}
      />

      {/* Create Welcome Screen Modal */}
      <DynamicDataCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateWelcome}
        title='Create New Welcome Screen'
        description='Create welcome screens with 9:16 portrait ratio for mobile devices'
        fields={createFormFields}
        sections={createModalSections}
        initialData={{
          status: "active", // Default to active
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        }}
        saveButtonText='Create Welcome Screen'
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

      {/* Edit Welcome Screen Modal */}
      {editingWelcome && (
        <DynamicDataCreateModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingWelcome(null);
          }}
          onSave={handleUpdateWelcome}
          title='Edit Welcome Screen'
          description='Update welcome screen information and settings'
          fields={createFormFields}
          sections={createModalSections}
          initialData={getEditInitialData()}
          saveButtonText='Update Welcome Screen'
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
