// src\app\(dashboard)\components\Overview\UserManagement.tsx
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
import { Eye, Edit, Trash } from "lucide-react";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useChangeUserStatusMutation,
} from "@/store/api/usersApi";
import { formatDateTime, getImageUrl } from "@/lib/utils";

interface UserManagementProps {
  itemsPerPage?: number;
  title?: string;
  buttonText?: string;
  pageUrl?: string;
}

export default function UserManagement({
  itemsPerPage = 10,
  title = "Recently Joined Users",
  buttonText = "Show all",
  pageUrl = "/manage-users",
}: UserManagementProps) {
  const [page] = useState(1);
  const [filters] = useState<Record<string, unknown>>({});

  const {
    data: usersResponse,
    isLoading,
    refetch,
  } = useGetAllUsersQuery({
    page,
    limit: itemsPerPage,
    ...filters,
  });

  const [deleteUser] = useDeleteUserMutation();
  const [changeUserStatus] = useChangeUserStatusMutation();

  const users =
    usersResponse?.data?.result?.map((user) => ({
      ...user,
      id: user._id || user.id,
      name: user.fullName,
      avatar: user.image ? getImageUrl(user.image) : undefined,
      status: user.status?.toLowerCase() || "inactive",
      role: user.role?.toLowerCase() || "user",
      lastUpdated: formatDateTime(user.updatedAt),
    })) || [];

  // console.log("Get all user:::", users);

  // Column Configuration for User Table
  const userColumns: ColumnConfig[] = [
    {
      key: "name",
      label: "User Name",
      sortable: true,
      searchable: true,
      showAvatar: true,
      width: "280px",
    },
    {
      key: "email",
      label: "Email Address",
      type: "email",
      sortable: true,
      searchable: true,
      width: "250px",
    },
    {
      key: "role",
      label: "Role",
      type: "select",
      sortable: true,
      filterable: true,
      width: "120px",
      align: "center",
      options: [
        {
          value: "user",
          label: "User",
          color: "#E7F3FF",
          textColor: "#0369A1",
        },
        {
          value: "admin",
          label: "Admin",
          color: "#FEF3C7",
          textColor: "#D97706",
        },
        {
          value: "super_admin",
          label: "Super Admin",
          color: "#F3E8FF",
          textColor: "#7C3AED",
        },
      ],
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
          color: "#FEF3F2",
          textColor: "#B42318",
        },
        {
          value: "canceled",
          label: "Canceled",
          color: "#FEF3F2",
          textColor: "#B42318",
        },
        {
          value: "blocked",
          label: "Blocked",
          color: "#818181",
          textColor: "#0F304E",
        },
        {
          value: "pending",
          label: "Pending",
          color: "#FFF9E0",
          textColor: "#C8AA00",
        },
      ],
    },
    // {
    //   key: "lastUpdated",
    //   label: "Last Updated",
    //   sortable: true,
    //   width: "200px",
    // },
  ];

  // Form Field Configuration for User Status Update Modal (Admin can only update status)
  const userFormFields: FormFieldConfig[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      required: true,
      section: "account",
      gridCol: "full",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "blocked", label: "Blocked" },
        { value: "pending", label: "Pending" },
      ],
    },
  ];

  // Filter Configuration for User Table
  const userFilters: FilterConfig[] = [
    {
      key: "role",
      label: "Role",
      type: "select",
      options: [
        { value: "user", label: "User" },
        { value: "admin", label: "Admin" },
        { value: "super_admin", label: "Super Admin" },
      ],
    },
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

  // Action Configuration for User Table
  const userActions: ActionConfig[] = [
    {
      key: "view",
      label: "",
      icon: <Eye className="w-4 h-4" />,
      variant: "ghost",
      onClick: (item) =>
        console.log("View user:", item.name, "ID:", item.id || item._id),
    },
    {
      key: "edit",
      label: "",
      icon: <Edit className="w-4 h-4" />,
      variant: "ghost",
      onClick: (item) =>
        console.log("Edit user:", item.name, "ID:", item.id || item._id),
    },
    {
      key: "delete",
      label: "",
      icon: <Trash className="w-5 h-5 text-red-500" />,
      variant: "ghost",
      onClick: (item) => handleUserDelete(item.id),
    },
  ];

  // Table Configuration for User Management
  const userTableConfig: TableConfig = {
    title: title,
    description: "",
    searchPlaceholder: "Search users by name, email, or department...",
    itemsPerPage: itemsPerPage,
    enableSearch: true,
    enableFilters: true,
    enablePagination: true,
    enableSelection: true,
    enableSorting: true,
    striped: true,
    emptyMessage: "No users found",
    loadingMessage: "Loading users...",
  };

  // Edit Modal Configuration for User Status Update
  const userEditModalConfig: EditModalConfig = {
    title: "Update User Status",
    description: "Change user account status",
    width: "md",
    sections: [
      {
        key: "account",
        title: "Account Status",
        description: "Update the user's account status",
      },
    ],
  };

  const handleDataChange = (newData: GenericDataItem[]) => {
    console.log("Users data changed:", newData);
    // Refetch data to get latest from server
    refetch();
  };

  const handleUserEdit = async (user: GenericDataItem) => {
    try {
      const userId = user.id || user._id;
      if (!userId) {
        console.error("User ID not found");
        return;
      }

      console.log("Updating user status:", user);

      // Only update status for admin users
      if (user.status) {
        await changeUserStatus({
          id: userId,
          status: user.status.toUpperCase(), // Convert to uppercase to match API expectation
        }).unwrap();

        console.log("User status updated successfully");
        refetch();
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleUserDelete = async (userId: string) => {
    try {
      if (!userId || userId === "undefined") {
        console.error("Invalid user ID for deletion:", userId);
        return;
      }

      console.log("Deleting user with ID:", userId);

      await deleteUser(userId).unwrap();
      console.log("User deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUsersSelect = (selectedIds: string[]) => {
    console.log("Selected users:", selectedIds);
    // Handle bulk operations
  };

  const handleExport = (exportData: GenericDataItem[]) => {
    console.log("Exporting users:", exportData);
    // Convert data to CSV format
    const headers = userColumns.map((col) => col.label).join(",");
    const csvData = exportData
      .map((user) =>
        userColumns
          .map((col) => {
            const value = user[col.key];
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
    a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="mx-auto">
      <DynamicTable
        data={users}
        columns={userColumns}
        formFields={userFormFields}
        filters={userFilters}
        actions={userActions}
        tableConfig={userTableConfig}
        editModalConfig={userEditModalConfig}
        onDataChange={handleDataChange}
        onItemEdit={handleUserEdit}
        onItemDelete={handleUserDelete}
        onItemsSelect={handleUsersSelect}
        onExport={handleExport}
        onRefresh={handleRefresh}
        buttonText={buttonText}
        pageUrl={pageUrl}
        isLoading={isLoading}
      />
    </div>
  );
}
