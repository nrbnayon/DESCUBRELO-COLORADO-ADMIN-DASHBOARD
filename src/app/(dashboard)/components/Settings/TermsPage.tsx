import React, { useState, useCallback, useMemo } from "react";
import {
  FileText,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DynamicDataCreateModal } from "@/components/common/DynamicDataCreateModal";
import { SearchFilterBar } from "@/components/common/SearchFilterBar";
import { ViewModal } from "@/components/common/ViewModal";
import {
  FormField,
  SearchFilterConfig,
  SearchFilterState,
} from "@/types/dynamicCardTypes";
import { ColumnConfig, GenericDataItem } from "@/types/dynamicTableTypes";
import {
  useGetAllTermsQuery,
  useCreateTermsMutation,
  useUpdateTermsMutation,
  useDeleteTermsMutation,
  useReorderTermsMutation,
} from "@/store/api/termsApi";
import { toast } from "sonner";
import CircularLoader from "@/components/common/CircularLoader";

// Types
interface TermsItem extends GenericDataItem {
  _id: string;
  id: string;
  title: string;
  description: string;
  category: string;
  status: "active" | "inactive";
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Response types
interface TermsResponse {
  _id?: string;
  data: TermsItem[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
  summary?: {
    activeTerms: number;
    inactiveTerms: number;
    totalCategories: number;
  };
}

// Form fields configuration
const formFields: FormField[] = [
  {
    key: "title",
    label: "Title",
    type: "text",
    required: true,
    placeholder: "Enter terms title",
    gridCol: "full",
    validation: {
      minLength: 3,
      maxLength: 100,
    },
  },
  {
    key: "description",
    label: "Description",
    type: "markdown",
    required: true,
    placeholder: "Enter the full terms content with markdown support...",
    gridCol: "full",
    validation: {
      minLength: 50,
    },
  },
  {
    key: "category",
    label: "Category",
    type: "select",
    required: true,
    gridCol: "half",
    options: [
      { label: "Legal", value: "legal" },
      { label: "Privacy & Policy", value: "privacy&policy" },
      { label: "Terms & Condition", value: "terms&condition" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    required: true,
    gridCol: "half",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
  {
    key: "order",
    label: "Display Order",
    type: "number",
    required: true,
    gridCol: "half",
    placeholder: "1",
    validation: {
      min: 1,
      max: 999,
    },
  },
];

// Search and filter configuration
const searchFilterConfig: SearchFilterConfig = {
  searchPlaceholder: "Search terms and policies...",
  enableSort: true,
  filters: [
    {
      key: "status",
      label: "Status",
      type: "select",
      placeholder: "All",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      placeholder: "All Category",
      options: [
        { label: "Legal", value: "legal" },
        { label: "Privacy & Policy", value: "privacy&policy" },
        { label: "Terms & Condition", value: "terms&condition" },
      ],
    },
  ],
  sortOptions: [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
    { key: "order", label: "Order" },
  ],
};

// Column configuration for ViewModal
const columnConfig: ColumnConfig[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  {
    key: "category",
    label: "Category",
    type: "select",
    options: [
      { label: "Legal", value: "legal" },
      { label: "Privacy & Policy", value: "privacy&policy" },
      { label: "Terms & Condition", value: "terms&condition" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
  { key: "order", label: "Display Order", type: "number" },
];

export default function TermsAdminPage() {
  const [searchFilterState, setSearchFilterState] = useState<SearchFilterState>(
    {
      search: "",
      filters: {},
      sortBy: undefined,
      sortOrder: undefined,
      page: 1,
      itemsPerPage: 10,
    }
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TermsItem | null>(null);
  const [viewingItem, setViewingItem] = useState<TermsItem | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    item: TermsItem | null;
  }>({ isOpen: false, item: null });

  const {
    data: termsResponse,
    isLoading,
    refetch,
  } = useGetAllTermsQuery({
    page: searchFilterState.page,
    limit: searchFilterState.itemsPerPage,
    search: searchFilterState.search,
    ...searchFilterState.filters,
  });

  const [createTerms] = useCreateTermsMutation();
  const [updateTerms] = useUpdateTermsMutation();
  const [deleteTerms] = useDeleteTermsMutation();
  const [reorderTerms] = useReorderTermsMutation();

  // Transform and memoize termsData to normalize _id to id
  const termsData = useMemo(() => {
    const rawData = (termsResponse as TermsResponse)?.data || [];
    return rawData.map((item) => ({
      ...item,
      id: item._id, // Map _id to id for consistency
    }));
  }, [termsResponse]);

  // Filter, search, and sort terms
  const filteredTerms = useMemo(() => {
    const filtered = termsData.filter((item: TermsItem) => {
      // Search filter
      const matchesSearch =
        searchFilterState.search === "" ||
        item.title
          .toLowerCase()
          .includes(searchFilterState.search.toLowerCase()) ||
        item.description
          .toLowerCase()
          .includes(searchFilterState.search.toLowerCase());

      // Status filter
      const statusFilter = searchFilterState.filters.status;
      const matchesStatus = !statusFilter || item.status === statusFilter;

      // Category filter
      const categoryFilter = searchFilterState.filters.category;
      const matchesCategory =
        !categoryFilter || item.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort
    if (searchFilterState.sortBy) {
      filtered.sort((a: TermsItem, b: TermsItem) => {
        const sortKey = searchFilterState.sortBy as keyof TermsItem;
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        let comparison = 0;

        // Handle different types properly
        if (typeof aValue === "string" && typeof bValue === "string") {
          comparison = aValue.localeCompare(bValue);
        } else if (typeof aValue === "number" && typeof bValue === "number") {
          comparison = aValue - bValue;
        } else if (aValue instanceof Date && bValue instanceof Date) {
          comparison = aValue.getTime() - bValue.getTime();
        } else {
          // Convert to string for comparison as fallback
          const aStr = String(aValue || "");
          const bStr = String(bValue || "");
          comparison = aStr.localeCompare(bStr);
        }

        return searchFilterState.sortOrder === "desc"
          ? -comparison
          : comparison;
      });
    } else {
      // Default sort by order
      filtered.sort((a: TermsItem, b: TermsItem) => a.order - b.order);
    }

    return filtered;
  }, [termsData, searchFilterState]);

  // Handle create
  const handleCreate = useCallback(
    (data: Record<string, unknown>) => {
      createTerms({
        title: data.title as string,
        description: data.description as string,
        category: data.category as string,
        status: data.status as "active" | "inactive",
        order: data.order as number,
      })
        .unwrap()
        .then((result) => {
          if (result.success) {
            toast.success("Terms created successfully");
            setIsCreateModalOpen(false);
            refetch();
          }
        })
        .catch((error) => {
          toast.error(error?.data?.message || "Failed to create terms");
        });
    },
    [createTerms, refetch]
  );

  // Handle edit
  const handleEdit = useCallback(
    (data: Record<string, unknown>) => {
      if (!editingItem) return;

      // Use the original _id for the API call
      updateTerms({
        id: editingItem._id,
        data: {
          title: data.title as string,
          description: data.description as string,
          category: data.category as string,
          status: data.status as "active" | "inactive",
          order: data.order as number,
        },
      })
        .unwrap()
        .then((result) => {
          if (result.success) {
            toast.success("Terms updated successfully");
            setIsEditModalOpen(false);
            setEditingItem(null);
            refetch();
          }
        })
        .catch((error) => {
          toast.error(error?.data?.message || "Failed to update terms");
        });
    },
    [editingItem, updateTerms, refetch]
  );

  // Handle delete
  const handleDelete = useCallback(
    (item: TermsItem) => {
      // Use the original _id for the API call
      deleteTerms(item._id)
        .unwrap()
        .then(() => {
          toast.success("Terms deleted successfully");
          setDeleteDialog({ isOpen: false, item: null });
          refetch();
        })
        .catch((error) => {
          toast.error(error?.data?.message || "Failed to delete terms");
        });
    },
    [deleteTerms, refetch]
  );

  // Handle order change
  const handleOrderChange = useCallback(
    (item: TermsItem, direction: "up" | "down") => {
      const currentIndex = filteredTerms.findIndex((t) => t.id === item.id);
      if (
        (direction === "up" && currentIndex === 0) ||
        (direction === "down" && currentIndex === filteredTerms.length - 1)
      ) {
        return;
      }

      const targetIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;
      const targetItem = filteredTerms[targetIndex];

      const reorderData = [
        { id: item._id, order: targetItem.order }, // Use _id for API
        { id: targetItem._id, order: item.order }, // Use _id for API
      ];

      reorderTerms(reorderData)
        .unwrap()
        .then(() => {
          refetch();
        })
        .catch((error) => {
          toast.error(error?.data?.message || "Failed to reorder terms");
        });
    },
    [filteredTerms, reorderTerms, refetch]
  );

  // Get status color
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }, []);

  // Get category color
  const getCategoryColor = useCallback((category: string) => {
    switch (category) {
      case "legal":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "privacy&policy":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "terms&condition":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }, []);

  const openEditModal = useCallback((item: TermsItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  }, []);

  const openViewModal = useCallback((item: TermsItem) => {
    setViewingItem(item);
    setIsViewModalOpen(true);
  }, []);

  const getEditInitialData = useCallback(() => {
    if (!editingItem) return {};
    return { ...editingItem };
  }, [editingItem]);

  // Memoize response data for consistent referencing
  const responseData = useMemo(() => {
    if (!termsResponse) {
      return {
        total: 0,
        activeTerms: 0,
        inactiveTerms: 0,
        totalCategories: 0,
      };
    }

    return {
      total: termsResponse.meta?.total || 0,
      activeTerms: termsResponse.summary?.activeTerms || 0,
      inactiveTerms: termsResponse.summary?.inactiveTerms || 0,
      totalCategories: termsResponse.summary?.totalCategories || 0,
    };
  }, [termsResponse]);

  return (
    <div className="p-3 md:p-6 space-y-3 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-base md:text-2xl font-semibold text-gray-900">
              Terms & Conditions
            </h1>
            <p className="text-sm md:text-lg text-gray-600">
              Manage legal documents and policies
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Terms</span>
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <SearchFilterBar
        state={searchFilterState}
        config={searchFilterConfig}
        onStateChange={setSearchFilterState}
        className="bg-white rounded-lg border border-gray-200 p-4"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Terms</p>
              <p className="text-2xl font-semibold text-gray-900">
                {responseData.total}
              </p>
            </div>
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-semibold text-green-600">
                {responseData.activeTerms}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactive</p>
              <p className="text-2xl font-semibold text-red-600">
                {responseData.inactiveTerms}
              </p>
            </div>
            <Edit className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-semibold text-blue-600">
                {responseData.totalCategories}
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Terms List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <CircularLoader
              size={60}
              thickness={5}
              gap={4}
              message=""
              outerColor="border-primary"
              innerColor="border-red-500"
              textColor="text-blue-600"
              className="py-12"
              showMessage={false}
            />
          </div>
        ) : filteredTerms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No terms found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchFilterState.search ||
              Object.keys(searchFilterState.filters).length > 0
                ? "No terms match your current filters."
                : "Get started by creating your first terms document."}
            </p>
            {!searchFilterState.search &&
              Object.keys(searchFilterState.filters).length === 0 && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Terms
                </Button>
              )}
          </div>
        ) : (
          filteredTerms.map((item: TermsItem, index: number) => (
            <div
              key={item._id} // Use _id as the key
              className="bg-white rounded-lg border border-gray-200 p-3 md:p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                {/* Content */}
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-md md:text-lg font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <Badge
                          className={`px-2 py-1 text-xs font-medium border ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </Badge>
                        <Badge
                          className={`px-2 py-1 text-xs font-medium border ${getCategoryColor(
                            item.category
                          )}`}
                        >
                          {item.category === "privacy&policy"
                            ? "Privacy & Policy"
                            : item.category === "terms&condition"
                            ? "Terms & Condition"
                            : item.category.charAt(0).toUpperCase() +
                              item.category.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Order: #{item.order}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  {/* Order Controls */}
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOrderChange(item, "up")}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOrderChange(item, "down")}
                      disabled={index === filteredTerms.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* More Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openViewModal(item)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditModal(item)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeleteDialog({ isOpen: true, item })}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      <DynamicDataCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreate}
        title="Create New Terms & Conditions"
        description="Add a new legal document or policy to your platform"
        fields={formFields}
        saveButtonText="Create Terms"
        cancelButtonText="Cancel"
      />

      {/* Edit Modal */}
      <DynamicDataCreateModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleEdit}
        title="Edit Terms & Conditions"
        description="Update the selected legal document or policy"
        fields={formFields}
        initialData={getEditInitialData()}
        saveButtonText="Update Terms"
        cancelButtonText="Cancel"
      />

      {/* View Modal */}
      <ViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingItem(null);
        }}
        item={viewingItem}
        columns={columnConfig}
        title="Terms & Conditions Details"
        description="Detailed view of the selected terms and conditions"
      />

      {/* Delete Dialog */}
      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => setDeleteDialog({ isOpen: open, item: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Terms & Conditions</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deleteDialog.item?.title}
              &ldquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteDialog.item && handleDelete(deleteDialog.item)
              }
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
