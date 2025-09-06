// src/components/common/PermissionModal.tsx
"use client";

import React, { useState } from "react";
import { Check, X, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { GenericDataItem } from "../../types/dynamicTableTypes";

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: GenericDataItem | null;
  onApprove: (item: GenericDataItem, reason?: string) => void;
  onDecline: (item: GenericDataItem, reason: string) => void;
  title?: string;
  description?: string;
  approveText?: string;
  declineText?: string;
  requireReason?: boolean;
  requireReasonForApprove?: boolean;
  isLoading?: boolean;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  isOpen,
  onClose,
  item,
  onApprove,
  onDecline,
  title = "Permission Required",
  description = "Please review and take action on this item.",
  approveText = "Approve",
  declineText = "Decline",
  requireReason = false,
  requireReasonForApprove = false,
  isLoading = false,
}) => {
  const [reason, setReason] = useState("");
  const [action, setAction] = useState<"approve" | "decline" | null>(null);
  const [error, setError] = useState("");

  const handleAction = (actionType: "approve" | "decline") => {
    setAction(actionType);
    setError("");

    // Validate reason requirement
    if (actionType === "decline" && requireReason && !reason.trim()) {
      setError("Reason is required for declining");
      return;
    }

    if (actionType === "approve" && requireReasonForApprove && !reason.trim()) {
      setError("Reason is required for approving");
      return;
    }

    if (!item) return;

    if (actionType === "approve") {
      onApprove(item, reason.trim() || undefined);
    } else {
      onDecline(item, reason.trim());
    }

    handleClose();
  };

  const handleClose = () => {
    setReason("");
    setAction(null);
    setError("");
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {item.avatar && (
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={item.avatar || "/placeholder.svg"}
                  alt={item.name || "User"}
                />
                <AvatarFallback>
                  {item.name?.toString().charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            )}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item Info */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Item:</span>
              <span className="text-sm">{item.name || item.id}</span>
            </div>
            {item.status && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant="secondary">
                  {item.status}
                </Badge>
              </div>
            )}
          </div>

          {/* Reason Input */}
          {(requireReason || requireReasonForApprove || action) && (
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm font-medium">
                Reason
                {((action === "decline" && requireReason) ||
                  (action === "approve" && requireReasonForApprove)) && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for your decision..."
                className="min-h-[80px] resize-y"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleAction("decline")}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            {declineText}
          </Button>
          <Button
            onClick={() => handleAction("approve")}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {approveText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
