// src\data\adsData.ts
import type { GenericDataItem } from "../types/dynamicTableTypes";

export interface AdsDataItem extends GenericDataItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  targetSections?: "welcome" | "hero" | "banner";
  startDate: string;
  endDate: string;
  status: "active" | "inactive" | "draft" | "scheduled" | "expired";
  category: string[];
  createdAt: string;
  updatedAt?: string;
}

// Final Answer (Best Ratios):
// Welcome screen → 9:16
// Hero/Banner slider → 16:9

// Sample ads data
export const adsData: AdsDataItem[] = [
  {
    id: "ad001",
    title: "Premium Tech Solutions for Your Business",
    subtitle: "Transform your business operations with cutting-edge technology",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    targetSections: "hero",
    startDate: "2025-01-01T00:00:00.000Z",
    endDate: "2025-03-31T23:59:59.000Z",
    status: "active",
    category: ["Technology", "Business"],
    createdAt: "2025-01-15T08:30:00.000Z",
    updatedAt: "2025-01-20T10:15:00.000Z",
  },
  {
    id: "ad002",
    title: "Exclusive Fashion Collection - Limited Time Offer",
    subtitle: "Step into style with our exclusive fashion collection",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    targetSections: "banner",
    startDate: "2025-01-10T00:00:00.000Z",
    endDate: "2025-02-28T23:59:59.000Z",
    status: "active",
    category: ["Fashion", "Retail"],
    createdAt: "2025-01-10T12:00:00.000Z",
    updatedAt: "2025-01-25T14:30:00.000Z",
  },
  {
    id: "ad003",
    title: "Healthy Living Made Simple - Wellness Program",
    subtitle:
      "Transform your lifestyle with our comprehensive wellness program",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    targetSections: "welcome",
    startDate: "2025-01-05T00:00:00.000Z",
    endDate: "2025-04-30T23:59:59.000Z",
    status: "active",
    category: ["Health", "Wellness"],
    createdAt: "2025-01-05T09:15:00.000Z",
    updatedAt: "2025-01-18T16:45:00.000Z",
  },
  {
    id: "ad004",
    title: "Smart Home Revolution - IoT Devices Sale",
    subtitle: "Experience the future of living with smart home devices",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    targetSections: "hero",
    startDate: "2025-01-12T00:00:00.000Z",
    endDate: "2025-03-15T23:59:59.000Z",
    status: "scheduled",
    category: ["Technology", "Smart Home"],
    createdAt: "2025-01-08T11:20:00.000Z",
    updatedAt: "2025-01-22T13:10:00.000Z",
  },
  {
    id: "ad005",
    title: "Educational Course Platform",
    subtitle: "Learn new skills with our comprehensive online courses",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    targetSections: "banner",
    startDate: "2025-02-01T00:00:00.000Z",
    endDate: "2025-05-31T23:59:59.000Z",
    status: "draft",
    category: ["Education", "Online Learning"],
    createdAt: "2025-01-28T14:20:00.000Z",
  },
  {
    id: "ad006",
    title: "Travel Adventure Package",
    subtitle: "Discover amazing destinations with our curated travel packages",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    targetSections: "welcome",
    startDate: "2024-12-01T00:00:00.000Z",
    endDate: "2025-01-31T23:59:59.000Z",
    status: "expired",
    category: ["Travel", "Tourism"],
    createdAt: "2024-11-25T10:00:00.000Z",
    updatedAt: "2024-12-15T12:30:00.000Z",
  },
];
