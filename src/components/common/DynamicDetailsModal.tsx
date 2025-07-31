// src\components\common\DynamicDetailsModal.tsx
"use client";
import React from "react";
import Image from "next/image";
import { Calendar, ExternalLink, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import type {
  GenericDataItem,
  ColumnConfig,
  ActionConfig,
} from "@/types/dynamicCardTypes";

interface DynamicDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: GenericDataItem;
  columns: ColumnConfig[];
  title?: string;
  actions?: ActionConfig[];
  className?: string;
}

export function DynamicDetailsModal({
  isOpen,
  onClose,
  item,
  columns,
  title,
  actions = [],
  className,
}: DynamicDetailsModalProps) {
  // Helper function to format values
  const formatValue = (
    value: unknown,
    column: ColumnConfig
  ): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground italic">Not provided</span>;
    }

    // Use custom render function if available
    if (column.render) {
      return column.render(value, item);
    }

    // Handle different data types
    switch (column.type) {
      case "date":
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(String(value)).toLocaleDateString()}</span>
          </div>
        );

      case "url":
        return (
          <a
            href={String(value)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            {String(value)}
            <ExternalLink className="h-3 w-3" />
          </a>
        );

      case "select":
        if (column.options) {
          const option = column.options.find(
            (opt) => opt.value === String(value)
          );
          if (option) {
            return (
              <Badge
                variant="secondary"
                style={
                  option.color
                    ? {
                        backgroundColor: option.color + "20",
                        color: option.color,
                      }
                    : undefined
                }
              >
                {option.icon && <span className="mr-1">{option.icon}</span>}
                {option.label}
              </Badge>
            );
          }
        }
        return <Badge variant="outline">{String(value)}</Badge>;

      case "image":
        if (typeof value === "string" && value.trim()) {
          return (
            <div className="space-y-2">
              <div className="relative w-full max-w-md mx-auto">
                <Image
                  src={value}
                  alt="Detail image"
                  width={400}
                  height={300}
                  className="rounded-lg border object-cover w-full"
                  unoptimized={
                    value.startsWith("data:") || value.startsWith("blob:")
                  }
                />
              </div>
            </div>
          );
        } else if (Array.isArray(value) && value.length > 0) {
          return (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {value.map((img, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={String(img)}
                      alt={`Image ${index + 1}`}
                      width={150}
                      height={150}
                      className="rounded-lg border object-cover w-full h-full"
                      unoptimized={
                        String(img).startsWith("data:") ||
                        String(img).startsWith("blob:")
                      }
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {value.length} image{value.length > 1 ? "s" : ""}
              </p>
            </div>
          );
        }
        return <span className="text-muted-foreground italic">No image</span>;

      case "textarea":
        return (
          <div className="prose prose-sm max-w-none">
            <div
              className="whitespace-pre-wrap text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: String(value).replace(/\n/g, "<br>"),
              }}
            />
          </div>
        );

      default:
        // Handle arrays (like tags, keywords)
        if (Array.isArray(value)) {
          if (value.length === 0) {
            return <span className="text-muted-foreground italic">None</span>;
          }
          return (
            <div className="flex flex-wrap gap-1">
              {value.map((item, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {String(item)}
                </Badge>
              ))}
            </div>
          );
        }

        // Handle objects (like social links)
        if (typeof value === "object" && value !== null) {
          const obj = value as Record<string, unknown>;
          const entries = Object.entries(obj).filter(([, v]) => v);

          if (entries.length === 0) {
            return (
              <span className="text-muted-foreground italic">
                None provided
              </span>
            );
          }

          return (
            <div className="space-y-2">
              {entries.map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                >
                  <span className="font-medium capitalize text-sm">{key}:</span>
                  {typeof val === "string" && val.startsWith("http") ? (
                    <a
                      href={val}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm flex items-center gap-1"
                    >
                      {val}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-sm">{String(val)}</span>
                  )}
                </div>
              ))}
            </div>
          );
        }

        // Handle boolean values
        if (typeof value === "boolean") {
          return (
            <Badge variant={value ? "default" : "secondary"}>
              {value ? "Yes" : "No"}
            </Badge>
          );
        }

        // Handle numbers
        if (typeof value === "number") {
          return <span className="font-mono">{value.toLocaleString()}</span>;
        }

        // Default string handling
        return <span>{String(value)}</span>;
    }
  };

  // Group columns into sections for better organization
  const basicFields = columns.filter((col) =>
    ["title", "subtitle", "name", "email", "phone"].includes(col.key)
  );

  const mediaFields = columns.filter(
    (col) => col.type === "image" || col.key.includes("image")
  );

  const metaFields = columns.filter((col) =>
    [
      "createdAt",
      "updatedAt",
      "author",
      "views",
      "priority",
      "status",
    ].includes(col.key)
  );

  const otherFields = columns.filter(
    (col) =>
      !basicFields.includes(col) &&
      !mediaFields.includes(col) &&
      !metaFields.includes(col)
  );

  const renderFieldSection = (sectionTitle: string, fields: ColumnConfig[]) => {
    if (fields.length === 0) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {sectionTitle}
        </h3>
        <div className="grid gap-4">
          {fields.map((column) => (
            <div key={column.key} className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                {column.label}
              </Label>
              <div className="min-h-6">
                {formatValue(item[column.key], column)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className,
  }) => <div className={cn("text-sm font-medium", className)}>{children}</div>;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "mx-4 min-w-full md:min-w-3xl max-h-[90vh] overflow-y-auto scrollbar-custom",
          className
        )}
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl">
            {title ||
              formatValue(item[columns[0]?.key], columns[0]) ||
              "Details"}
          </DialogTitle>
          {(typeof item.subtitle === "string" ||
            typeof item.subtitle === "number") && (
            <DialogDescription className="text-base">
              {item.subtitle}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          {renderFieldSection("Basic Information", basicFields)}

          {basicFields.length > 0 &&
            (mediaFields.length > 0 ||
              otherFields.length > 0 ||
              metaFields.length > 0) && <Separator />}

          {/* Media */}
          {renderFieldSection("Media", mediaFields)}

          {mediaFields.length > 0 &&
            (otherFields.length > 0 || metaFields.length > 0) && <Separator />}

          {/* Other Fields */}
          {renderFieldSection("Additional Information", otherFields)}

          {otherFields.length > 0 && metaFields.length > 0 && <Separator />}

          {/* Meta Information */}
          {renderFieldSection("Meta Information", metaFields)}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t justify-end">
            {actions
              .filter((action) => !action.condition || action.condition(item))
              .map((action) => (
                <Button
                  key={action.key}
                  variant={action.variant || "outline"}
                  size="sm"
                  className="flex items-center gap-2 border border-primary/50 rounded-md"
                  onClick={() => {
                    action.onClick(item);
                    onClose();
                  }}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
