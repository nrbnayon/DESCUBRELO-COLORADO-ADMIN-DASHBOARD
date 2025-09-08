import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (!text || typeof text !== "string") return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export const getAssetsBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_ASSETS_BASE_URL || "http://10.10.12.58:5000";
};

export const getImageUrl = (
  imagePath: string | null | undefined,
  fallbackImage?: string
): string => {
  if (!imagePath) {
    return fallbackImage || "";
  }

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Handle the image path from API
  let cleanPath = imagePath;
  if (cleanPath.startsWith("/")) {
    cleanPath = cleanPath.slice(1);
  }
  // Construct the full URL
  const baseUrl = getAssetsBaseUrl();
  return `${baseUrl}/${cleanPath}`;
};
