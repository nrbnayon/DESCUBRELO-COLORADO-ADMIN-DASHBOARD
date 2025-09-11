// src\app\(dashboard)\components\Subscription\UserSubscriptions.tsx
"use client";
import { useState } from "react";
import type {
  GenericDataItem,
  ColumnConfig,
  FilterConfig,
  ActionConfig,
  TableConfig,
} from "@/types/dynamicTableTypes";
import { DynamicTable } from "@/components/common/DynamicTable";
import Lordicon from "@/components/lordicon/lordicon-wrapper";
import { useGetAllUsersQuery } from "@/store/api/usersApi";
import { getImageUrl } from "@/lib/utils";

interface UserManagementProps {
  itemsPerPage?: number;
  title?: string;
  buttonText?: string;
  pageUrl?: string;
}

export default function UserSubscriptions({
  itemsPerPage = 10,
  title = "Subscription user list",
  buttonText = "Show all",
  pageUrl = "/users-subscription",
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
    isSubscribed: true, // Only get subscribed users
    ...filters,
  });

  const users =
    usersResponse?.data?.result?.map((user) => ({
      ...user,
      name: user.fullName,
      avatar: user.image ? getImageUrl(user.image) : undefined,
      accountType: user.subscription?.plan || "free",
    })) || [];

  // Column Configuration for User Table
  const userColumns: ColumnConfig[] = [
    {
      key: "name",
      label: "User Name",
      sortable: true,
      searchable: true,
      showAvatar: true,
      align: "left",
      width: "100px",
    },
    {
      key: "email",
      label: "Email Address",
      type: "email",
      sortable: true,
      searchable: true,
      width: "50px",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      sortable: true,
      filterable: true,
      width: "50px",
      align: "center",
      options: [
        {
          value: "ACTIVE",
          label: "Active",
          color: "#ECFDF3",
          textColor: "#027A48",
        },
        {
          value: "INACTIVE",
          label: "Inactive",
          color: "#FFF9E0",
          textColor: "#C8AA00",
        },
        {
          value: "BLOCKED",
          label: "Blocked",
          color: "#FEF3F2",
          textColor: "#B42318",
        },
        {
          value: "PENDING",
          label: "Pending",
          color: "#F3F4F6",
          textColor: "#374151",
        },
      ],
    },
    {
      key: "accountType",
      label: "Subscription Status",
      type: "select",
      sortable: true,
      filterable: true,
      width: "50px",
      align: "center",
      options: [
        {
          value: "free",
          label: "Free",
          color: "#F3F4F6",
          textColor: "#374151",
        },
        {
          value: "base",
          label: "Basic",
          color: "#ECFDF3",
          textColor: "#027A48",
        },
        {
          value: "premium",
          label: "Premium",
          color: "#FFF9E0",
          textColor: "#C8AA00",
        },
        {
          value: "enterprice",
          label: "Enterprise",
          color: "#DBEAFE",
          textColor: "#1E3A8A",
        },
      ],
    },
  ];

  // Filter Configuration for User Table
  const userFilters: FilterConfig[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        {
          value: "ACTIVE",
          label: "Active",
          color: "#ECFDF3",
          textColor: "#027A48",
        },
        {
          value: "INACTIVE",
          label: "Inactive",
          color: "#FFF9E0",
          textColor: "#C8AA00",
        },
        {
          value: "BLOCKED",
          label: "Blocked",
          color: "#FEF3F2",
          textColor: "#B42318",
        },
        {
          value: "PENDING",
          label: "Pending",
          color: "#F3F4F6",
          textColor: "#374151",
        },
      ],
    },
    {
      key: "accountType",
      label: "Subscriptions",
      type: "select",
      options: [
        {
          value: "free",
          label: "Free",
          color: "#F3F4F6",
          textColor: "#374151",
        },
        {
          value: "base",
          label: "Basic",
          color: "#ECFDF3",
          textColor: "#027A48",
        },
        {
          value: "premium",
          label: "Premium",
          color: "#FFF9E0",
          textColor: "#C8AA00",
        },
        {
          value: "enterprice",
          label: "Enterprise",
          color: "#DBEAFE",
          textColor: "#1E3A8A",
        },
      ],
    },
  ];

  // Action Configuration for User Table
  const userActions: ActionConfig[] = [
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
      onClick: (item) => console.log("View user:", item.name),
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

  const handleDataChange = (newData: GenericDataItem[]) => {
    console.log("Users data changed:", newData);
    refetch();
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
        filters={userFilters}
        actions={userActions}
        tableConfig={userTableConfig}
        onDataChange={handleDataChange}
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
