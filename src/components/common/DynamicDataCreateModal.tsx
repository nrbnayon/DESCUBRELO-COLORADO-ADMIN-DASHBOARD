// src\components\common\DynamicDataCreateModal.tsx
"use client";
import React from "react";
import type { ReactElement } from "react";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { FormField } from "@/types/dynamicCardTypes";
import { Textarea } from "../ui/textarea";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface Section {
  key: string;
  title: string;
  description?: string;
  [key: string]: string | unknown;
}

interface DynamicDataCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => void;
  title: string;
  description?: string;
  fields: FormField[];
  sections?: Section[];
  initialData?: Record<string, unknown>;
  saveButtonText?: string;
  cancelButtonText?: string;
  maxImageSizeInMB?: number;
  maxImageUpload?: number;
  acceptedImageFormats?: string[];
  [key: string]: string | unknown;
}

export function DynamicDataCreateModal({
  isOpen,
  onClose,
  onSave,
  title,
  description,
  fields,
  sections = [],
  initialData = {},
  saveButtonText = "Save",
  cancelButtonText = "Cancel",
  maxImageSizeInMB = 5,
  maxImageUpload = 5,
  acceptedImageFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
}: DynamicDataCreateModalProps): ReactElement {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState<Record<string, boolean>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Handle input change
  const handleInputChange = useCallback(
    (key: string, value: unknown) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      // Clear error when user starts typing
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: "" }));
      }
    },
    [errors]
  );

  // Handle drag events for image upload
  const handleDrag = useCallback((e: React.DragEvent, fieldKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive((prev) => ({ ...prev, [fieldKey]: true }));
    } else if (e.type === "dragleave") {
      setDragActive((prev) => ({ ...prev, [fieldKey]: false }));
    }
  }, []);

  // Handle drop event for image upload
  const handleDrop = useCallback((e: React.DragEvent, fieldKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [fieldKey]: false }));
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      handleMultipleImageFiles(files, fieldKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle file input change for image upload
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) => {
      e.preventDefault();
      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files);
        handleMultipleImageFiles(files, fieldKey);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Handle multiple image files
  const handleMultipleImageFiles = useCallback(
    (files: File[], fieldKey: string) => {
      const currentImages = Array.isArray(formData[fieldKey])
        ? (formData[fieldKey] as string[])
        : formData[fieldKey]
        ? [formData[fieldKey] as string]
        : [];

      const remainingSlots = maxImageUpload - currentImages.length;
      if (remainingSlots <= 0) {
        setErrors((prev) => ({
          ...prev,
          [fieldKey]: `Maximum ${maxImageUpload} images allowed`,
        }));
        return;
      }

      const filesToProcess = files.slice(0, remainingSlots);
      if (files.length > remainingSlots) {
        setErrors((prev) => ({
          ...prev,
          [fieldKey]: `Only ${remainingSlots} more image(s) can be uploaded`,
        }));
      } else {
        // Clear previous error
        setErrors((prev) => ({ ...prev, [fieldKey]: "" }));
      }

      filesToProcess.forEach((file) => {
        handleImageFile(file, fieldKey);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formData, maxImageUpload]
  );

  // Validate and process image file
  const handleImageFile = useCallback(
    (file: File, fieldKey: string) => {
      // Validate file type
      if (!acceptedImageFormats.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [fieldKey]: `Please upload a valid image file (${acceptedImageFormats.join(
            ", "
          )})`,
        }));
        return;
      }

      // Validate file size
      if (file.size > maxImageSizeInMB * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [fieldKey]: `File size must be less than ${maxImageSizeInMB}MB`,
        }));
        return;
      }

      setUploading((prev) => ({ ...prev, [fieldKey]: true }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData((prev) => {
          const currentImages = Array.isArray(prev[fieldKey])
            ? (prev[fieldKey] as string[])
            : prev[fieldKey]
            ? [prev[fieldKey] as string]
            : [];
          const newImages = [...currentImages, result];
          return { ...prev, [fieldKey]: newImages };
        });
        setUploading((prev) => ({ ...prev, [fieldKey]: false }));
      };
      reader.onerror = () => {
        setErrors((prev) => ({ ...prev, [fieldKey]: "Error reading file" }));
        setUploading((prev) => ({ ...prev, [fieldKey]: false }));
      };
      reader.readAsDataURL(file);
    },
    [acceptedImageFormats, maxImageSizeInMB]
  );

  // Remove specific image
  const handleRemoveImage = useCallback(
    (fieldKey: string, imageIndex?: number) => {
      setFormData((prev) => {
        if (typeof imageIndex === "number") {
          // Remove specific image from array
          const currentImages = Array.isArray(prev[fieldKey])
            ? (prev[fieldKey] as string[])
            : prev[fieldKey]
            ? [prev[fieldKey] as string]
            : [];
          const newImages = currentImages.filter(
            (_, index) => index !== imageIndex
          );
          return { ...prev, [fieldKey]: newImages.length > 0 ? newImages : [] };
        } else {
          // Remove all images
          return { ...prev, [fieldKey]: [] };
        }
      });
      setErrors((prev) => ({ ...prev, [fieldKey]: "" }));
      if (fileInputRefs.current[fieldKey]) {
        fileInputRefs.current[fieldKey]!.value = "";
      }
    },
    []
  );

  // Open file dialog
  const openFileDialog = useCallback((fieldKey: string) => {
    fileInputRefs.current[fieldKey]?.click();
  }, []);

  // pdf upload handler

  const handlePdfFile = useCallback(
    (file: File, fieldKey: string) => {
      // Validate file type for PDF
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({
          ...prev,
          [fieldKey]: "Please upload a valid PDF file",
        }));
        return;
      }

      // Validate file size (using same size limit as images)
      if (file.size > maxImageSizeInMB * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [fieldKey]: `PDF file size must be less than ${maxImageSizeInMB}MB`,
        }));
        return;
      }

      setUploading((prev) => ({ ...prev, [fieldKey]: true }));

      // Create data URL for PDF
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData((prev) => ({ ...prev, [fieldKey]: result }));
        setUploading((prev) => ({ ...prev, [fieldKey]: false }));
      };
      reader.onerror = () => {
        setErrors((prev) => ({
          ...prev,
          [fieldKey]: "Error reading PDF file",
        }));
        setUploading((prev) => ({ ...prev, [fieldKey]: false }));
      };
      reader.readAsDataURL(file);
    },
    [maxImageSizeInMB]
  );

  // Handle PDF file input change
  const handlePdfFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) => {
      e.preventDefault();
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        handlePdfFile(file, fieldKey);
      }
    },
    [handlePdfFile]
  );

  // Handle PDF drag and drop
  const handlePdfDrop = useCallback(
    (e: React.DragEvent, fieldKey: string) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive((prev) => ({ ...prev, [fieldKey]: false }));
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        handlePdfFile(file, fieldKey);
      }
    },
    [handlePdfFile]
  );

  // Remove PDF file
  const handleRemovePdf = useCallback((fieldKey: string) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: "" }));
    setErrors((prev) => ({ ...prev, [fieldKey]: "" }));
    if (fileInputRefs.current[fieldKey]) {
      fileInputRefs.current[fieldKey]!.value = "";
    }
  }, []);

  // Handle multiselect toggle
  const handleMultiselectToggle = useCallback(
    (fieldKey: string, optionValue: string) => {
      setFormData((prev) => {
        const currentValues = Array.isArray(prev[fieldKey])
          ? (prev[fieldKey] as string[])
          : [];

        const isSelected = currentValues.includes(optionValue);

        const newValues = isSelected
          ? currentValues.filter((value) => value !== optionValue)
          : [...currentValues, optionValue];

        return { ...prev, [fieldKey]: newValues };
      });

      // Clear error when user makes selection
      if (errors[fieldKey]) {
        setErrors((prev) => ({ ...prev, [fieldKey]: "" }));
      }
    },
    [errors]
  );

  // Remove category/tag
  const handleRemoveMultiselectItem = useCallback(
    (fieldKey: string, itemValue: string) => {
      setFormData((prev) => {
        const currentValues = Array.isArray(prev[fieldKey])
          ? (prev[fieldKey] as string[])
          : [];

        return {
          ...prev,
          [fieldKey]: currentValues.filter((value) => value !== itemValue),
        };
      });
    },
    []
  );

  // Validate latitude/longitude
  const validateLatLng = (value: string, type: "lat" | "lng"): boolean => {
    const num = parseFloat(value);
    if (isNaN(num)) return false;

    if (type === "lat") {
      return num >= -90 && num <= 90;
    } else {
      return num >= -180 && num <= 180;
    }
  };

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = formData[field.key];

      // Required field validation
      if (field.required) {
        if (field.type === "image") {
          const images = Array.isArray(value) ? value : value ? [value] : [];
          if (images.length === 0) {
            newErrors[field.key] = `${field.label} is required`;
            return;
          }
        } else if (field.type === "multiselect") {
          const selectedItems = Array.isArray(value) ? value : [];
          if (selectedItems.length === 0) {
            newErrors[field.key] = `${field.label} is required`;
            return;
          }
        } else if (!value || (typeof value === "string" && !value.trim())) {
          newErrors[field.key] = `${field.label} is required`;
          return;
        }
      }

      // Skip validation if field is empty and not required
      if (!value) return;

      // Type-specific validation
      if (field.validation) {
        const { minLength, maxLength, pattern, min, max } = field.validation;

        if (typeof value === "string") {
          if (minLength && value.length < minLength) {
            newErrors[
              field.key
            ] = `${field.label} must be at least ${minLength} characters`;
          }
          if (maxLength && value.length > maxLength) {
            newErrors[
              field.key
            ] = `${field.label} must be no more than ${maxLength} characters`;
          }
          if (pattern && !new RegExp(pattern).test(value)) {
            newErrors[field.key] = `${field.label} format is invalid`;
          }
        }

        if (typeof value === "number") {
          if (min !== undefined && value < min) {
            newErrors[field.key] = `${field.label} must be at least ${min}`;
          }
          if (max !== undefined && value > max) {
            newErrors[field.key] = `${field.label} must be no more than ${max}`;
          }
        }
      }

      // Special validation for latitude/longitude
      if (
        field.key === "latitude" &&
        typeof value === "string" &&
        value.trim()
      ) {
        if (!validateLatLng(value, "lat")) {
          newErrors[field.key] = "Latitude must be between -90 and 90";
        }
      }
      if (
        field.key === "longitude" &&
        typeof value === "string" &&
        value.trim()
      ) {
        if (!validateLatLng(value, "lng")) {
          newErrors[field.key] = "Longitude must be between -180 and 180";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fields, formData]);

  // Handle save
  const handleSave = useCallback(() => {
    if (validateForm()) {
      onSave(formData);
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, validateForm, onSave]);

  // Handle close
  const handleClose = useCallback(() => {
    setFormData({});
    setErrors({});
    setDragActive({});
    setUploading({});
    // Clear file inputs
    Object.values(fileInputRefs.current).forEach((input) => {
      if (input) input.value = "";
    });
    onClose();
  }, [onClose]);

  // Helper function to safely convert value to string
  const getStringValue = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    return String(value);
  };

  // Helper function to get boolean value
  const getBooleanValue = (value: unknown): boolean => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.toLowerCase() === "true";
    return Boolean(value);
  };

  // Render field based on type
  const renderField = useCallback(
    (field: FormField) => {
      const value = formData[field.key];
      const error = errors[field.key];
      const isUploading = uploading[field.key];
      const isDragActive = dragActive[field.key];

      switch (field.type) {
        case "text":
        case "email":
        case "tel":
        case "date":
        case "password":
        case "url":
          return (
            <Input
              type={field.type === "url" ? "text" : field.type}
              value={getStringValue(value)}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className={
                error
                  ? "border-red-500"
                  : "border-primary/30 focus-visible:border-primary rounded-md"
              }
            />
          );

        case "number":
          return (
            <Input
              type="number"
              value={getStringValue(value)}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue === "" || inputValue === "-") {
                  handleInputChange(field.key, inputValue);
                } else {
                  const numValue = parseFloat(inputValue);
                  if (!isNaN(numValue)) {
                    handleInputChange(field.key, numValue);
                  }
                }
              }}
              placeholder={field.placeholder}
              className={
                error
                  ? "border-red-500"
                  : "border-primary/30 focus-visible:border-primary rounded-md"
              }
              min={field.validation?.min}
              max={field.validation?.max}
              step={
                field.key === "latitude" || field.key === "longitude"
                  ? "0.000001"
                  : "0.1"
              }
            />
          );

        case "textarea":
          return (
            <Textarea
              value={getStringValue(value)}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              placeholder={field.placeholder || "Enter text..."}
              className={cn(
                "w-full px-3 py-2 border rounded-md resize-vertical min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/20",
                error
                  ? "border-red-500"
                  : "border-primary/30 focus-visible:border-primary"
              )}
              rows={4}
            />
          );

        case "markdown":
          return (
            <MDEditor
              value={getStringValue(value)}
              onChange={(val) => handleInputChange(field.key, val || "")}
              preview="edit"
              hideToolbar={false}
              visibleDragbar={false}
              data-color-mode="light"
              textareaProps={{
                placeholder:
                  field.placeholder ||
                  "Enter description with markdown support...",
                style: {
                  fontSize: 14,
                  lineHeight: 1.5,
                  fontFamily:
                    'ui-monospace,SFMono-Regular,"SF Mono",Consolas,"Liberation Mono",Menlo,monospace',
                },
              }}
              className={
                error
                  ? "border-red-500"
                  : "border border-primary/30 focus-visible:border-primary rounded-md"
              }
              height={200}
            />
          );
        case "select":
          return (
            <Select
              value={getStringValue(value)}
              onValueChange={(val) => handleInputChange(field.key, val)}
            >
              <SelectTrigger
                className={
                  error ? "border-red-500" : "border-primary/30 rounded-md"
                }
              >
                <SelectValue
                  placeholder={field.placeholder || `Select ${field.label}`}
                />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );

        case "multiselect":
          const selectedValues = Array.isArray(value)
            ? (value as string[])
            : [];
          const availableOptions = field.options || [];

          return (
            <div className="space-y-3">
              {/* Selected items display */}
              {selectedValues.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border text-black">
                  {selectedValues.map((selectedValue) => {
                    const option = availableOptions.find(
                      (opt) => opt.value === selectedValue
                    );
                    return (
                      <div
                        key={selectedValue}
                        className="flex items-center gap-1 px-2 py-1 text-foreground   bg-primary/30 text-sm rounded-md border"
                      >
                        <span>{option?.label || selectedValue}</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveMultiselectItem(
                              field.key,
                              selectedValue
                            )
                          }
                          className="ml-1 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Options selection */}
              <div
                className={cn(
                  "border rounded-lg p-3 max-h-48 overflow-y-auto",
                  error ? "border-red-500" : "border-primary/30"
                )}
              >
                <div className="space-y-2">
                  {availableOptions.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    return (
                      <label
                        key={option.value}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() =>
                            handleMultiselectToggle(field.key, option.value)
                          }
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {selectedValues.length === 0 && (
                <p className="text-sm text-gray-500">
                  {field.placeholder || `Select ${field.label.toLowerCase()}`}
                </p>
              )}
            </div>
          );

        case "checkbox":
          return (
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={getBooleanValue(value)}
                onCheckedChange={(checked) =>
                  handleInputChange(field.key, checked)
                }
              />
              <span className="text-sm">
                {field.placeholder || field.label}
              </span>
            </div>
          );

        case "switch":
          return (
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-sm font-medium">{field.label}</span>
                {field.helpText && (
                  <p className="text-xs text-gray-500">{field.helpText}</p>
                )}
              </div>
              <Switch
                checked={getBooleanValue(value)}
                onCheckedChange={(checked) =>
                  handleInputChange(field.key, checked)
                }
              />
            </div>
          );

        case "image":
          const existingImages: string[] = Array.isArray(value)
            ? value.filter(
                (v): v is string => typeof v === "string" && v.trim() !== ""
              )
            : typeof value === "string" && value.trim() !== ""
            ? [value]
            : [];

          const canUploadMore = existingImages.length < maxImageUpload;
          return (
            <div className="space-y-4">
              {/* Image Previews */}
              {existingImages.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">
                      {existingImages.length === 1
                        ? "Current Image"
                        : `Images (${existingImages.length}/${maxImageUpload})`}
                    </p>
                    {existingImages.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveImage(field.key)}
                        className="text-xs h-7"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {existingImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-white shadow-sm bg-white hover:shadow-md transition-shadow">
                          <Image
                            src={imageUrl || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            width={120}
                            height={120}
                            priority
                            className="w-full h-full object-cover"
                            unoptimized={
                              imageUrl.startsWith("data:") ||
                              imageUrl.startsWith("blob:")
                            }
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-1 -right-1 h-5 w-5 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(field.key, index);
                          }}
                        >
                          <X className="h-2.5 w-2.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Area */}
              {canUploadMore && (
                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-lg transition-all duration-200",
                    isDragActive
                      ? "border-primary bg-primary/5 scale-[1.02]"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50/50",
                    isUploading && "pointer-events-none opacity-50",
                    error && "border-red-500 bg-red-50/30",
                    "cursor-pointer"
                  )}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    handleDrag(e, field.key);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    handleDrag(e, field.key);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    handleDrag(e, field.key);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDrop(e, field.key);
                  }}
                  onClick={() => openFileDialog(field.key)}
                >
                  <input
                    ref={(el) => {
                      fileInputRefs.current[field.key] = el;
                    }}
                    type="file"
                    accept={acceptedImageFormats.join(",")}
                    multiple={maxImageUpload > 1}
                    onChange={(e) => handleFileChange(e, field.key)}
                    className="hidden"
                  />
                  <div className="p-8 text-center">
                    <div className="space-y-3">
                      <div className="mx-auto w-12 h-12 text-gray-400">
                        {isUploading ? (
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        ) : (
                          <Upload className="w-12 h-12" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-medium text-gray-900">
                          {isUploading
                            ? "Processing images..."
                            : existingImages.length > 0
                            ? "Replace or add more images"
                            : "Upload images"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Drop files here or{" "}
                          <span className="text-primary font-medium">
                            browse
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {acceptedImageFormats
                            .map((format) => format.split("/")[1].toUpperCase())
                            .join(", ")}{" "}
                          • Max {maxImageSizeInMB}MB each
                          {existingImages.length > 0 &&
                            ` • ${
                              maxImageUpload - existingImages.length
                            } remaining`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Max Upload Limit Message */}
              {!canUploadMore && existingImages.length >= maxImageUpload && (
                <div className="text-center p-4 bg-gray-50 rounded-lg border">
                  <p className="text-sm text-gray-600">
                    Maximum {maxImageUpload} image
                    {maxImageUpload > 1 ? "s" : ""} uploaded. Remove an image to
                    add a new one.
                  </p>
                </div>
              )}
            </div>
          );

        case "pdf":
          const currentPdf =
            typeof value === "string" && value.trim() !== ""
              ? (value as string)
              : null;
          const isPdfUploading = uploading[field.key];
          const isPdfDragActive = dragActive[field.key];

          return (
            <div className="space-y-4">
              {/* PDF Preview */}
              {currentPdf && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">
                      Current PDF
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemovePdf(field.key)}
                      className="text-xs h-7 text-red-600 hover:text-red-700"
                    >
                      Remove PDF
                    </Button>
                  </div>
                  <div className="p-4 bg-gray-50/50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          PDF Document
                        </p>
                        <p className="text-xs text-gray-500">
                          Click to view or download
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (currentPdf.startsWith("data:")) {
                            // For data URLs, create a download link
                            const link = document.createElement("a");
                            link.href = currentPdf;
                            link.download = "document.pdf";
                            link.click();
                          } else {
                            // For regular URLs, open in new tab
                            window.open(currentPdf, "_blank");
                          }
                        }}
                        className="text-xs h-7"
                      >
                        View PDF
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <div
                className={cn(
                  "relative border-2 border-dashed rounded-lg transition-all duration-200",
                  isPdfDragActive
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50/50",
                  isPdfUploading && "pointer-events-none opacity-50",
                  error && "border-red-500 bg-red-50/30",
                  "cursor-pointer"
                )}
                onDragEnter={(e) => handleDrag(e, field.key)}
                onDragLeave={(e) => handleDrag(e, field.key)}
                onDragOver={(e) => handleDrag(e, field.key)}
                onDrop={(e) => handlePdfDrop(e, field.key)}
                onClick={() => openFileDialog(field.key)}
              >
                <input
                  ref={(el) => {
                    fileInputRefs.current[field.key] = el;
                  }}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => handlePdfFileChange(e, field.key)}
                  className="hidden"
                />
                <div className="p-8 text-center">
                  <div className="space-y-3">
                    <div className="mx-auto w-12 h-12 text-gray-400">
                      {isPdfUploading ? (
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      ) : (
                        <svg
                          className="w-12 h-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 3v6a1 1 0 001 1h6"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-medium text-gray-900">
                        {isPdfUploading
                          ? "Uploading PDF..."
                          : currentPdf
                          ? "Replace PDF"
                          : "Upload PDF"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Drop PDF file here or{" "}
                        <span className="text-primary font-medium">browse</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        PDF files only • Max {maxImageSizeInMB}MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );

        case "custom":
          if (field.render) {
            return field.render(
              value,
              (key: string, val: unknown) => handleInputChange(key, val),
              formData
            );
          }
          return null;
        default:
          return null;
      }
    },
    [
      formData,
      errors,
      uploading,
      dragActive,
      acceptedImageFormats,
      maxImageSizeInMB,
      maxImageUpload,
      handleInputChange,
      handleDrag,
      handleDrop,
      handleFileChange,
      handleRemoveImage,
      handleMultiselectToggle,
      handleRemoveMultiselectItem,
      openFileDialog,
      handlePdfDrop,
      handlePdfFileChange,
      handleRemovePdf,
    ]
  );

  // Group fields by section
  const fieldsBySection = useMemo(() => {
    if (sections.length > 0) {
      return sections.map((section) => ({
        ...section,
        fields: fields.filter((field) => field.section === section.key),
      }));
    }
    return [{ key: "default", title: "", description: "", fields }];
  }, [sections, fields]);

  // Initialize form data properly to prevent infinite re-renders
  useEffect(() => {
    if (isOpen) {
      const hasInitialData = initialData && Object.keys(initialData).length > 0;
      setFormData(hasInitialData ? { ...initialData } : {});
      setErrors({});
      setDragActive({});
      setUploading({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Reset formData when modal closes completely
  useEffect(() => {
    if (!isOpen) {
      setFormData({});
      setErrors({});
      setDragActive({});
      setUploading({});
      Object.values(fileInputRefs.current).forEach((input) => {
        if (input) input.value = "";
      });
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-full md:min-w-3xl max-h-[90vh] overflow-y-auto scrollbar-custom">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-6 py-4">
          {fieldsBySection.map((section) => (
            <div key={section.key} className="space-y-4">
              {section.title && (
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">{section.title}</h3>
                  {section.description && (
                    <p className="text-sm text-gray-600">
                      {section.description}
                    </p>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <div
                    key={field.key}
                    className={cn(
                      field.gridCol === "full"
                        ? "md:col-span-2"
                        : "md:col-span-1"
                    )}
                  >
                    <div className="space-y-2">
                      {field.type !== "switch" && (
                        <Label htmlFor={field.key}>
                          {field.label}
                          {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </Label>
                      )}
                      {renderField(field)}
                      {errors[field.key] && (
                        <p className="text-sm text-red-600">
                          {errors[field.key]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {cancelButtonText}
          </Button>
          <Button onClick={handleSave}>{saveButtonText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
