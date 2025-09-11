"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Bell,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  User,
  Settings,
  DollarSign,
  EyeOff,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SearchFilterBar } from "@/components/common/SearchFilterBar";
import { ViewModal } from "@/components/common/ViewModal";
import type {
  SearchFilterState,
  SearchFilterConfig,
} from "@/types/dynamicCardTypes";
import type { GenericDataItem, ColumnConfig } from "@/types/dynamicTableTypes";
import {
  useGetUserNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteUserNotificationMutation,
} from "@/store/api/notificationsApi";
import { toast } from "sonner";
import CircularLoader from "@/components/common/CircularLoader";

// API Response Types - matching the actual API structure
interface ApiNotification {
  _id: string; // This is the actual notification ID we need
  title: string;
  content: string;
  priority: "default" | "normal" | "medium" | "high";
  type: string;
  isRead: boolean;
  isGlobal: boolean;
  recipients: string[];
  sentBy: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  sentAt?: string;
  results?: {
    success: number;
    failed: number;
    details: Array<{
      userId: string;
      token: string;
      status: "ok" | "error";
      error?: string;
      messageId?: string;
    }>;
  };
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

interface UserNotificationItem {
  _id: string; // User notification document ID
  userId: string;
  notificationId: ApiNotification; // Populated notification data
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Component Types - normalized for UI use
interface NotificationData extends GenericDataItem {
  id: string; // This will be the actual notification._id
  userNotificationId: string; // This will be the user notification document _id
  title: string;
  content: string;
  type:
    | "info"
    | "success"
    | "warning"
    | "error"
    | "user"
    | "system"
    | "payment";
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  priority: "default" | "normal" | "medium" | "high";
  category?: string;
  actionUrl?: string;
  sentBy?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  metadata?: {
    userId?: string;
    userName?: string;
    userAvatar?: string;
    amount?: number;
    orderId?: string;
    systemComponent?: string;
    ipAddress?: string;
    attemptCount?: number;
    backupSize?: string;
    backupLocation?: string;
    updateType?: string;
    [key: string]: unknown;
  };
}

// Updated API response interface to match actual structure
interface NotificationsApiResponse {
  success: boolean;
  message: string;
  data: {
    notifications: UserNotificationItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    stats: {
      counts: {
        total: number;
        unread: number;
        read: number;
      };
      typeDistribution: Array<{
        _id: string;
        count: number;
        unreadCount: number;
      }>;
      priorityDistribution: Array<{
        _id: string;
        count: number;
        unreadCount: number;
      }>;
      summary: {
        totalNotifications: number;
        readNotifications: number;
        unreadNotifications: number;
        readPercentage: number;
      };
    };
  };
}

// Column configuration for ViewModal
const notificationColumns: ColumnConfig[] = [
  { key: "id", label: "ID", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "content", label: "Message", type: "text" },
  {
    key: "type",
    label: "Type",
    type: "select",
    options: [
      { value: "info", label: "Info" },
      { value: "success", label: "Success" },
      { value: "warning", label: "Warning" },
      { value: "error", label: "Error" },
      { value: "user", label: "User" },
      { value: "system", label: "System" },
      { value: "payment", label: "Payment" },
    ],
  },
  {
    key: "priority",
    label: "Priority",
    type: "select",
    options: [
      { value: "default", label: "Default" },
      { value: "normal", label: "Normal" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
    ],
  },
  { key: "category", label: "Category", type: "text" },
  { key: "isRead", label: "Read Status", type: "checkbox" },
  { key: "createdAt", label: "Created At", type: "datetime-local" },
  { key: "updatedAt", label: "Updated At", type: "datetime-local" },
  { key: "actionUrl", label: "Action URL", type: "url" },
  // Metadata fields
  { key: "userId", label: "User ID", type: "text" },
  { key: "userName", label: "User Name", type: "text" },
  { key: "amount", label: "Amount", type: "currency" },
  { key: "orderId", label: "Order ID", type: "text" },
  { key: "systemComponent", label: "System Component", type: "text" },
  { key: "ipAddress", label: "IP Address", type: "text" },
  { key: "attemptCount", label: "Attempt Count", type: "number" },
  { key: "backupSize", label: "Backup Size", type: "text" },
  { key: "backupLocation", label: "Backup Location", type: "text" },
  { key: "updateType", label: "Update Type", type: "text" },
];

// Helper function to safely convert value to Date
const safeToDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
};

export default function Notifications() {
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const itemsPerPage = 20;

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsReadMutation] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteUserNotificationMutation();

  // Search and filter state
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

  const {
    data: notificationsResponse,
    isLoading,
    refetch,
  } = useGetUserNotificationsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchFilterState.search,
    ...searchFilterState.filters,
  }) as {
    data: NotificationsApiResponse | undefined;
    isLoading: boolean;
    refetch: () => void;
  };

  // Transform API response to component format with proper memoization
  const notifications = useMemo(() => {
    if (!notificationsResponse?.data?.notifications) {
      return [];
    }

    return notificationsResponse.data.notifications.map(
      (notif: UserNotificationItem): NotificationData => ({
        // Use the actual notification ID from the populated notificationId
        id: notif.notificationId._id,
        // Keep track of the user notification document ID for operations that need it
        userNotificationId: notif._id,
        title: notif.notificationId.title,
        content: notif.notificationId.content,
        type: notif.notificationId.type as NotificationData["type"],
        isRead: notif.isRead, // Use the user notification's isRead status
        createdAt: notif.notificationId.createdAt,
        updatedAt: notif.notificationId.updatedAt,
        priority: notif.notificationId.priority,
        category: notif.notificationId.type,
        sentBy: notif.notificationId.sentBy,
        metadata: notif.notificationId.metadata as NotificationData["metadata"],
        // Required for GenericDataItem
        name: notif.notificationId.title,
        // Flatten metadata for ViewModal compatibility
        ...notif.notificationId.metadata,
      })
    );
  }, [notificationsResponse?.data?.notifications]);

  const unreadCount = notificationsResponse?.data?.stats?.counts?.unread || 0;

  // Initialize client state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Search and filter configuration
  const searchFilterConfig: SearchFilterConfig = {
    searchPlaceholder: "Search notifications by title or message...",
    enableSort: true,
    filters: [
      {
        key: "type",
        label: "Type",
        type: "select",
        placeholder: "All Types",
        options: [
          { value: "info", label: "Info" },
          { value: "success", label: "Success" },
          { value: "warning", label: "Warning" },
          { value: "error", label: "Error" },
          { value: "user", label: "User" },
          { value: "system", label: "System" },
          { value: "payment", label: "Payment" },
        ],
      },
      {
        key: "priority",
        label: "Priority",
        type: "select",
        placeholder: "All Priorities",
        options: [
          { value: "default", label: "Default" },
          { value: "normal", label: "Normal" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" },
        ],
      },
      {
        key: "isRead",
        label: "Status",
        type: "select",
        placeholder: "All Status",
        options: [
          { value: "true", label: "Read" },
          { value: "false", label: "Unread" },
        ],
      },
      {
        key: "category",
        label: "Category",
        type: "select",
        placeholder: "All Categories",
        options: [
          { value: "User Management", label: "User Management" },
          { value: "Financial", label: "Financial" },
          { value: "System", label: "System" },
          { value: "Security", label: "Security" },
        ],
      },
    ],
    sortOptions: [
      { key: "createdAt", label: "Created Date" },
      { key: "updatedAt", label: "Updated Date" },
      { key: "title", label: "Title" },
      { key: "priority", label: "Priority" },
      { key: "type", label: "Type" },
    ],
  };

  // Get notification icon
  const getNotificationIcon = (type: NotificationData["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "user":
        return <User className="w-5 h-5 text-blue-600" />;
      case "system":
        return <Settings className="w-5 h-5 text-gray-600" />;
      case "payment":
        return <DollarSign className="w-5 h-5 text-green-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority: NotificationData["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "normal":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "default":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    if (!isClient) return "Loading..."; // Prevent hydration mismatch

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  // Handle notification click - opens modal and marks as read
  const handleNotificationClick = useCallback(
    (notification: NotificationData) => {
      setSelectedNotification(notification);
      setIsModalOpen(true);

      // Mark as read if unread and has valid user notification ID
      if (!notification.isRead && notification.userNotificationId) {
        markAsRead(notification.userNotificationId)
          .unwrap()
          .then(() => {
            refetch();
          })
          .catch((error) => {
            console.error("Error marking notification as read:", error);
            toast.error("Failed to mark notification as read");
          });
      }
    },
    [markAsRead, refetch]
  );

  // Toggle read status
  const toggleReadStatus = useCallback(
    (userNotificationId: string, event: React.MouseEvent) => {
      event.stopPropagation();
      if (!userNotificationId) {
        console.error("Invalid user notification ID");
        return;
      }
      markAsRead(userNotificationId)
        .unwrap()
        .then(() => {
          refetch();
          toast.success("Notification status updated");
        })
        .catch((error) => {
          console.error("Error toggling read status:", error);
          toast.error("Failed to update notification status");
        });
    },
    [markAsRead, refetch]
  );

  // Delete notification handler
  const deleteNotificationHandler = useCallback(
    (userNotificationId: string, event: React.MouseEvent) => {
      event.stopPropagation();
      if (!userNotificationId) {
        console.error("Invalid user notification ID");
        return;
      }
      deleteNotification(userNotificationId)
        .unwrap()
        .then(() => {
          toast.success("Notification deleted");
          refetch();
        })
        .catch((error) => {
          toast.error(error?.data?.message || "Failed to delete notification");
        });
    },
    [deleteNotification, refetch]
  );

  // Mark all as read handler
  const markAllAsReadHandler = useCallback(() => {
    markAllAsReadMutation()
      .unwrap()
      .then(() => {
        toast.success("All notifications marked as read");
        refetch();
      })
      .catch((error) => {
        toast.error(error?.data?.message || "Failed to mark all as read");
      });
  }, [markAllAsReadMutation, refetch]);

  // Filter and sort notifications with improved type safety
  const filteredAndSortedNotifications = useMemo(() => {
    const filtered = notifications.filter((notification) => {
      // Search filter
      const searchMatch =
        !searchFilterState.search ||
        notification.title
          .toLowerCase()
          .includes(searchFilterState.search.toLowerCase()) ||
        notification.content
          .toLowerCase()
          .includes(searchFilterState.search.toLowerCase());

      // Other filters
      const filtersMatch = Object.entries(searchFilterState.filters).every(
        ([key, value]) => {
          if (key === "isRead") {
            return notification.isRead === (value === "true");
          }
          const notificationValue = notification[key as keyof NotificationData];
          return notificationValue === value;
        }
      );

      return searchMatch && filtersMatch;
    });

    // Sort with improved type safety
    if (searchFilterState.sortBy) {
      filtered.sort((a, b) => {
        const sortKey = searchFilterState.sortBy as keyof NotificationData;
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        let comparison = 0;

        // Handle date fields specifically
        if (sortKey === "createdAt" || sortKey === "updatedAt") {
          const dateA = safeToDate(aValue);
          const dateB = safeToDate(bValue);

          if (dateA && dateB) {
            comparison = dateA.getTime() - dateB.getTime();
          } else if (dateA) {
            comparison = 1;
          } else if (dateB) {
            comparison = -1;
          }
        }
        // Handle string fields
        else if (typeof aValue === "string" && typeof bValue === "string") {
          comparison = aValue.localeCompare(bValue);
        }
        // Handle boolean fields
        else if (typeof aValue === "boolean" && typeof bValue === "boolean") {
          comparison = aValue === bValue ? 0 : aValue ? 1 : -1;
        }
        // Fallback: convert to string for comparison
        else {
          const aStr = String(aValue || "");
          const bStr = String(bValue || "");
          comparison = aStr.localeCompare(bStr);
        }

        return searchFilterState.sortOrder === "desc"
          ? -comparison
          : comparison;
      });
    }
    return filtered;
  }, [notifications, searchFilterState]);

  // Pagination logic
  const totalItems = filteredAndSortedNotifications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotifications = filteredAndSortedNotifications.slice(
    startIndex,
    endIndex
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFilterState]);

  // Show loading state during hydration
  if (!isClient || isLoading) {
    return (
      <div className="p-3 md:p-6">
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
    );
  }

  return (
    <div className="p-3 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-700" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              Notifications
            </h3>
            <p className="text-muted-foreground">
              {notifications.length} total, {unreadCount} unread
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={markAllAsReadHandler}
            variant="outline"
            size="sm"
            disabled={unreadCount === 0}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <SearchFilterBar
        state={searchFilterState}
        config={searchFilterConfig}
        onStateChange={setSearchFilterState}
        className="mb-6"
      />

      {/* Notifications List */}
      <div className="space-y-2 max-h-[650px] overflow-y-auto scrollbar-custom">
        {currentNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No notifications found
            </h3>
            <p className="text-muted-foreground">
              {searchFilterState.search ||
              Object.keys(searchFilterState.filters).length > 0
                ? "Try adjusting your search or filters"
                : "You're all caught up!"}
            </p>
          </div>
        ) : (
          currentNotifications.map((notification) => (
            <div
              key={notification.userNotificationId}
              onClick={() => handleNotificationClick(notification)}
              className={cn(
                "relative bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md",
                !notification.isRead &&
                  "border-l-4 border-l-blue-500 bg-blue-50/30"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="mt-1 flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4
                          className={cn(
                            "text-sm font-medium text-black truncate",
                            !notification.isRead && "font-semibold"
                          )}
                        >
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {notification.content}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            getPriorityColor(notification.priority)
                          )}
                        >
                          {notification.priority}
                        </Badge>

                        <Badge variant="secondary" className="text-xs">
                          {notification.category || notification.type}
                        </Badge>

                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimeAgo(new Date(notification.createdAt))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) =>
                            toggleReadStatus(notification.userNotificationId, e)
                          }
                        >
                          <EyeOff className="w-4 h-4 mr-2" />
                          Mark as {notification.isRead ? "Unread" : "Read"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) =>
                            deleteNotificationHandler(
                              notification.userNotificationId,
                              e
                            )
                          }
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
            {totalItems} notifications
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  const distance = Math.abs(page - currentPage);
                  return distance <= 2 || page === 1 || page === totalPages;
                })
                .map((page, index, array) => {
                  const prevPage = array[index - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;

                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && (
                        <span className="px-2 py-1 text-sm text-gray-500">
                          ...
                        </span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  );
                })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Reusable ViewModal */}
      <ViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedNotification}
        columns={notificationColumns}
        title="Notification Details"
        description="Complete information about the selected notification"
      />
    </div>
  );
}
