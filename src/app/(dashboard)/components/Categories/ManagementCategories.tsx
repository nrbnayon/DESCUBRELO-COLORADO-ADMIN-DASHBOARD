// src\app\(dashboard)\components\Categories\ManagementCategories.tsx
"use client";

import { categoriesData } from "@/data/categoriesData";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CategoryManagementProps {
  itemsPerPage?: number;
  title?: string;
  buttonText?: string;
  pageUrl?: string;
}

interface CategoryDataItem extends GenericDataItem {
  name: string;
  avatar: string;
  status: "active" | "inactive" | "blocked" | "pending";
  description: string;
  createdAt: string;
  isActive: boolean;
}

export default function ManagementCategories({
  itemsPerPage = 10,
  title = "All Categories",
  buttonText = "Show all",
  pageUrl = "/manage-categories",
}: CategoryManagementProps) {
  const [categories, setCategories] = useState(categoriesData);
  const [isLoading, setIsLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    avatar: "",
    status: "active" as "active" | "inactive" | "blocked" | "pending",
    description: "",
  });

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
        { value: "active", label: "Active", color: "#16a34a" },
        { value: "inactive", label: "Inactive", color: "#ca8a04" },
        { value: "blocked", label: "Blocked", color: "#dc2626" },
        { value: "pending", label: "Pending", color: "#6b7280" },
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
      gridCol: "half",
      validation: {
        minLength: 2,
        maxLength: 50,
      },
    },
    {
      key: "avatar",
      label: "Category Picture",
      type: "file",
      section: "details",
      gridCol: "half",
      placeholder: "Upload category picture (max 5MB)",
    },
    {
      key: "description",
      label: "Description",
      type: "textarea",
      section: "details",
      gridCol: "full",
      placeholder: "Enter category description",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      required: true,
      section: "account",
      gridCol: "half",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "blocked", label: "Blocked" },
        { value: "pending", label: "Pending" },
      ],
    },
  ];

  // Filter Configuration for Category Table
  const categoryFilters: FilterConfig[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "blocked", label: "Blocked" },
        { value: "pending", label: "Pending" },
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
      onClick: (item) => console.log("Edit category:", item.name),
    },
  ];

  // Table Configuration for Category Management
  const categoryTableConfig: TableConfig = {
    title: "",
    description: "",
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
    description: "Update category information and settings",
    width: "xl",
    sections: [
      {
        key: "details",
        title: "Category Information",
        description: "Basic category details and information",
      },
      {
        key: "account",
        title: "Status & Settings",
        description: "Category status and configuration",
      },
    ],
  };

  // Handle adding new category
  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      alert("Please enter a category name");
      return;
    }

    const newCategoryData = {
      id: `cat${Date.now()}`,
      name: newCategory.name,
      avatar:
        newCategory.avatar ||
        `https://images.unsplash.com/photo-${Math.floor(
          Math.random() * 1000000000
        )}?w=40&h=40&fit=crop&crop=face`,
      status: newCategory.status,
      description: newCategory.description,
      createdAt: new Date().toISOString(),
      isActive: newCategory.status === "active",
    };

    const updatedCategories = [newCategoryData, ...categories];
    setCategories(updatedCategories);

    // Reset form
    setNewCategory({
      name: "",
      avatar: "",
      status: "active",
      description: "",
    });
    setAddModalOpen(false);

    console.log("New category added:", newCategoryData);
  };

  const handleDataChange = (newData: GenericDataItem[]) => {
    // Type assertion since we know the data structure matches CategoryDataItem
    setCategories(newData as CategoryDataItem[]);
    console.log("Categories data changed:", newData);
  };

  const handleCategoryEdit = (category: GenericDataItem) => {
    console.log("Category edited:", category);
    // Here you would typically make an API call to update the category
  };

  const handleCategoryDelete = (categoryId: string) => {
    console.log("Category deleted:", categoryId);
    // Here you would typically make an API call to delete the category
  };

  const handleCategoriesSelect = (selectedIds: string[]) => {
    console.log("Selected categories:", selectedIds);
    // Handle bulk operations
  };

  const handleExport = (exportData: GenericDataItem[]) => {
    console.log("Exporting categories:", exportData);
    // Convert data to CSV format
    const headers = categoryColumns.map((col) => col.label).join(",");
    const csvData = (exportData as CategoryDataItem[])
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
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCategories([...categoriesData]);
      setIsLoading(false);
      console.log("Categories data refreshed");
    }, 1000);
  };

  return (
    <div className="w-full mx-auto">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-foreground text-xl font-semibold">{title}</h2>
        <Button
          className="flex items-center gap-2"
          onClick={() => setAddModalOpen(true)}
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
        onItemEdit={handleCategoryEdit}
        onItemDelete={handleCategoryDelete}
        onItemsSelect={handleCategoriesSelect}
        onExport={handleExport}
        onRefresh={handleRefresh}
        buttonText={buttonText}
        pageUrl={pageUrl}
        isLoading={isLoading}
      />

      {/* Add Category Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category for your content organization.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <Input
                id="name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="col-span-3"
                placeholder="Enter category name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avatar" className="text-right">
                Image URL
              </Label>
              <Input
                id="avatar"
                value={newCategory.avatar}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, avatar: e.target.value })
                }
                className="col-span-3"
                placeholder="Enter image URL (optional)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={newCategory.status}
                onValueChange={(
                  value: "active" | "inactive" | "blocked" | "pending"
                ) => setNewCategory({ ...newCategory, status: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
                placeholder="Enter category description (optional)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
