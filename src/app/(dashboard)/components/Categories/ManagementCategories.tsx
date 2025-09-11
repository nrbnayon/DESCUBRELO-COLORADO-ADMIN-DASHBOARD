// src/app/(dashboard)/components/Categories/ManagementCategories.tsx
"use client";

import { useState } from "react";
import type {
  GenericDataItem,
  ColumnConfig,
  FormFieldConfig,
  FilterConfig,
  ActionConfig,
  TableConfig,
  EditModalConfig,
} from "@/types/dynamicTableTypes";
import { DynamicTable } from "@/components/common/DynamicTable";
import Lordicon from "@/components/lordicon/lordicon-wrapper";
import { Button } from "@/components/ui/button";
import { DynamicDataCreateModal } from "@/components/common/DynamicDataCreateModal";
import type { FormField } from "@/types/dynamicCardTypes";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/store/api/categoriesApi";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";

interface Category {
  _id?: string;
  id: string;
  name: string;
  image?: string;
  status: "active" | "inactive" | "pending" | "blocked" | "expired";
  createdAt: string;
  updatedAt?: string;
}

interface CategoryManagementProps {
  itemsPerPage?: number;
  title?: string;
  buttonText?: string;
  pageUrl?: string;
}

export default function ManagementCategories({
  itemsPerPage = 10,
  title = "All Categories",
  buttonText = "Show all",
  pageUrl = "/manage-categories",
}: CategoryManagementProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [page, setPage] = useState(1);

  // Remove unused setFilters since filters are handled by the table component
  const [currentFilters] = useState<Record<string, unknown>>({});

  const {
    data: categoriesResponse,
    isLoading,
    refetch,
  } = useGetAllCategoriesQuery({
    page,
    limit: itemsPerPage,
    ...currentFilters,
  });

  console.log("All categories::", categoriesResponse);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const categories: GenericDataItem[] =
    categoriesResponse?.data?.map((category: Category) => ({
      ...category,
      id: category._id || category.id,
      avatar: category.image ? getImageUrl(category.image) : undefined,
    })) || [];

  const handleDeleteCategory = async (catId: string) => {
    if (!catId || catId === "undefined") {
      toast.error("Invalid category ID");
      return;
    }

    try {
      await deleteCategory(catId).unwrap();
      toast.success("Category deleted successfully");
      refetch();
    } catch (error: unknown) {
      console.log("Category delete error::", error);

      if (typeof error === "object" && error !== null && "data" in error) {
        const err = error as { data?: { message?: string } };
        toast.error(err.data?.message || "Failed to delete category");
      } else {
        toast.error("Failed to delete category");
      }
    }
  };

  const handleEditCategory = (category: GenericDataItem) => {
    const categoryToEdit = {
      ...category,
      id: category._id || category.id,
    } as Category;
    setEditingCategory(categoryToEdit);
    setEditModalOpen(true);
  };

  const handleUpdateCategory = async (data: Record<string, unknown>) => {
    if (!editingCategory || !editingCategory.id) {
      toast.error("Invalid category data");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", String(data.name || ""));
      formData.append("status", String(data.status || "active"));

      // Handle image update
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
          formData.append("image", blob, "category-image.png");
        }
      }

      const result = await updateCategory({
        id: editingCategory.id,
        data: formData,
      }).unwrap();

      if (result.success) {
        toast.success("Category updated successfully");
        setEditModalOpen(false);
        setEditingCategory(null);
        refetch();
      }
    } catch (error: unknown) {
      console.log("Category update error::", error);

      if (typeof error === "object" && error !== null && "data" in error) {
        const err = error as { data?: { message?: string } };
        toast.error(err.data?.message || "Failed to update category");
      } else {
        toast.error("Failed to update category");
      }
    }
  };

  // Column Configuration for Category Table
  const categoryColumns: ColumnConfig[] = [
    {
      key: "name",
      label: "Category Name",
      sortable: true,
      searchable: true,
      showAvatar: true,
      align: "left",
      width: "300px",
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
        {
          value: "active",
          label: "Active",
          color: "#ECFDF3",
          textColor: "#027A48",
        },
        {
          value: "inactive",
          label: "Inactive",
          color: "#FFF9E0",
          textColor: "#C8AA00",
        },
        {
          value: "blocked",
          label: "Blocked",
          color: "#FEF3F2",
          textColor: "#B42318",
        },
        {
          value: "pending",
          label: "Pending",
          color: "#F3F4F6",
          textColor: "#374151",
        },
      ],
    },
  ];

  // Form Field Configuration for Category Edit Modal
  const categoryFormFields: FormFieldConfig[] = [
    {
      key: "name",
      label: "Category Name",
      type: "text",
      required: true,
      section: "details",
      gridCol: "full",
      validation: {
        minLength: 2,
        maxLength: 50,
      },
    },
    {
      key: "image",
      label: "Category Picture",
      type: "file",
      section: "details",
      gridCol: "full",
      placeholder: "Upload category picture (max 5MB)",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      required: true,
      section: "account",
      gridCol: "half",
      options: [
        {
          value: "active",
          label: "Active",
          color: "#ECFDF3",
          textColor: "#027A48",
        },
        {
          value: "inactive",
          label: "Inactive",
          color: "#FFF9E0",
          textColor: "#C8AA00",
        },
        {
          value: "blocked",
          label: "Blocked",
          color: "#FEF3F2",
          textColor: "#B42318",
        },
        {
          value: "pending",
          label: "Pending",
          color: "#F3F4F6",
          textColor: "#374151",
        },
      ],
    },
  ];

  // Create Modal Form Fields
  const createFormFields: FormField[] = [
    {
      key: "name",
      label: "Category Name",
      type: "text",
      required: true,
      placeholder: "Enter category name",
      validation: {
        minLength: 2,
        maxLength: 50,
      },
      section: "basic",
      gridCol: "full",
    },
    {
      key: "image",
      label: "Category Picture",
      type: "image",
      required: true,
      placeholder: "Upload category picture (max 5MB)",
      section: "basic",
      gridCol: "full",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        {
          value: "active",
          label: "Active",
        },
        {
          value: "inactive",
          label: "Inactive",
        },
        {
          value: "blocked",
          label: "Blocked",
        },
        {
          value: "pending",
          label: "Pending",
        },
      ],
      section: "basic",
      gridCol: "half",
    },
  ];

  // Edit Modal Form Fields
  const editFormFields: FormField[] = [
    {
      key: "name",
      label: "Category Name",
      type: "text",
      required: true,
      placeholder: "Enter category name",
      validation: {
        minLength: 2,
        maxLength: 50,
      },
      section: "basic",
      gridCol: "full",
    },
    {
      key: "image",
      label: "Category Picture",
      type: "image",
      required: true,
      placeholder: "Upload category picture (max 5MB)",
      section: "basic",
      gridCol: "full",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        {
          value: "active",
          label: "Active",
        },
        {
          value: "inactive",
          label: "Inactive",
        },
        {
          value: "blocked",
          label: "Blocked",
        },
        {
          value: "pending",
          label: "Pending",
        },
      ],
      section: "basic",
      gridCol: "half",
    },
  ];

  // Create Modal Sections
  const createModalSections = [
    {
      key: "basic",
      title: "Basic Information",
    },
  ];

  // Filter Configuration for Category Table
  const categoryFilters: FilterConfig[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        {
          value: "active",
          label: "Active",
          color: "#ECFDF3",
          textColor: "#027A48",
        },
        {
          value: "inactive",
          label: "Inactive",
          color: "#FFF9E0",
          textColor: "#C8AA00",
        },
        {
          value: "blocked",
          label: "Blocked",
          color: "#FEF3F2",
          textColor: "#B42318",
        },
        {
          value: "pending",
          label: "Pending",
          color: "#F3F4F6",
          textColor: "#374151",
        },
      ],
    },
  ];

  // Action Configuration for Category Table
  const categoryActions: ActionConfig[] = [
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
      onClick: (item) => console.log("View category:", item.name),
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
      onClick: (item) => handleEditCategory(item),
    },
    {
      key: "delete",
      label: "",
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
      onClick: (item) => handleDeleteCategory(item.id),
    },
  ];

  // Table Configuration for Category Management
  const categoryTableConfig: TableConfig = {
    title: "",
    searchPlaceholder: "Search category by name",
    itemsPerPage: itemsPerPage,
    enableSearch: true,
    enableFilters: true,
    enablePagination: true,
    enableSelection: true,
    enableSorting: true,
    striped: true,
    emptyMessage: "No category found",
    loadingMessage: "Loading categories...",
  };

  // Edit Modal Configuration for Category Form
  const categoryEditModalConfig: EditModalConfig = {
    title: "Edit Category",
    width: "xl",
    sections: [
      {
        key: "details",
        title: "Category Information",
      },
      {
        key: "account",
        title: "Status & Settings",
      },
    ],
  };

  // Handle creating new category
  const handleCreateCategory = async (data: Record<string, unknown>) => {
    try {
      const formData = new FormData();

      formData.append("name", String(data.name || ""));
      formData.append("status", String(data.status || "active"));

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
          formData.append("image", blob, "category-image.png");
        }
      } else {
        toast.error("Category image is required");
        return;
      }

      const result = await createCategory(formData).unwrap();
      if (result.success) {
        toast.success("Category created successfully");
        setCreateModalOpen(false);
        refetch();
      }
    } catch (error: unknown) {
      console.log("Category create error::", error);

      if (typeof error === "object" && error !== null && "data" in error) {
        const err = error as { data?: { message?: string } };
        toast.error(err.data?.message || "Failed to create category");
      } else {
        toast.error("Failed to create category");
      }
    }
  };

  const handleDataChange = (newData: GenericDataItem[]) => {
    console.log("Categories data changed:", newData);
    refetch();
  };

  const handleCategoryDelete = (categoryId: string) => {
    handleDeleteCategory(categoryId);
  };

  const handleCategoriesSelect = (selectedIds: string[]) => {
    console.log("Selected categories:", selectedIds);
    // Handle bulk operations
  };

  const handleExport = (exportData: GenericDataItem[]) => {
    console.log("Exporting categories:", exportData);
    // Convert data to CSV format
    const headers = categoryColumns.map((col) => col.label).join(",");
    const csvData = exportData
      .map((category) =>
        categoryColumns
          .map((col) => {
            const value = category[col.key];
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
    a.download = `categories-export-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Fixed getEditInitialData function to handle image properly
  const getEditInitialData = () => {
    if (!editingCategory) return {};

    // Create a clean initial data object
    const initialData: Record<string, unknown> = {
      name: editingCategory.name || "",
      status: editingCategory.status || "active",
    };

    // Handle image - only include if it exists and is a valid string
    if (editingCategory.image && typeof editingCategory.image === "string") {
      const imageUrl = getImageUrl(editingCategory.image);
      if (imageUrl) {
        initialData.image = [imageUrl];
      } else {
        initialData.image = [];
      }
    } else {
      initialData.image = [];
    }

    return initialData;
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
          <span>Add Category</span>
        </Button>
      </div>

      <DynamicTable
        data={categories}
        columns={categoryColumns}
        formFields={categoryFormFields}
        filters={categoryFilters}
        actions={categoryActions}
        tableConfig={categoryTableConfig}
        editModalConfig={categoryEditModalConfig}
        onDataChange={handleDataChange}
        onItemEdit={handleEditCategory}
        onItemDelete={handleCategoryDelete}
        onItemsSelect={handleCategoriesSelect}
        onExport={handleExport}
        onRefresh={handleRefresh}
        onPageChange={handlePageChange}
        buttonText={buttonText}
        pageUrl={pageUrl}
        isLoading={isLoading}
        currentPage={page}
        totalItems={categoriesResponse?.meta?.total || 0}
      />

      {/* Create Category Modal */}
      <DynamicDataCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateCategory}
        title="Create New Category"
        description="Add a new category to organize your content"
        fields={createFormFields}
        sections={createModalSections}
        initialData={{ status: "active" }}
        saveButtonText="Create Category"
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

      {/* Edit Category Modal */}
      {editingCategory && (
        <DynamicDataCreateModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingCategory(null);
          }}
          onSave={handleUpdateCategory}
          title="Edit Category"
          description="Update category information"
          fields={editFormFields}
          sections={createModalSections}
          initialData={getEditInitialData()}
          saveButtonText="Update Category"
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
      )}
    </div>
  );
}
