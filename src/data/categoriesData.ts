import type { GenericDataItem } from "../types/dynamicTableTypes";

export interface CategoryDataItem extends GenericDataItem {
  id: string;
  name: string;
  image?: string;
  status: "active" | "inactive" | "blocked" | "pending";
  createdAt: string;
  updatedAt?: string;
  isActive?: boolean;
}

// Sample category data
export const categoriesData: CategoryDataItem[] = [
  {
    id: "cat1",
    name: "Colorado Hiking",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=40&h=40&fit=crop&crop=face",
    status: "active",
    description: "Hiking trails and adventures in Colorado's mountains",
    createdAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "cat2",
    name: "Colorado Travel",
    image:
      "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=40&h=40&fit=crop&crop=face",
    status: "active",
    description: "Travel guides and destinations across Colorado",
    createdAt: "2023-02-20T00:00:00Z",
  },
  {
    id: "cat3",
    name: "Outdoor Gear Stores",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=40&h=40&fit=crop&crop=face",
    status: "inactive",
    description: "Retail for hiking and outdoor gear in Colorado",
    createdAt: "2022-11-10T00:00:00Z",
  },
  {
    id: "cat4",
    name: "Colorado Camping",
    image:
      "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=40&h=40&fit=crop&crop=face",
    status: "active",
    description: "Camping sites and resources in Colorado",
    createdAt: "2023-04-05T00:00:00Z",
  },
  {
    id: "cat5",
    name: "Adventure Tours",
    image:
      "https://images.unsplash.com/photo-1534787019598-6d48f173b418?w=40&h=40&fit=crop&crop=face",
    status: "pending",
    description: "Guided adventure tours in Colorado's wilderness",
    createdAt: "2023-03-22T00:00:00Z",
  },
  {
    id: "cat6",
    name: "Skiing & Snowboarding",
    image:
      "https://images.unsplash.com/photo-1519944246722-4e876a8b0f0d?w=40&h=40&fit=crop&crop=face",
    status: "active",
    description: "Ski resorts and snowboarding activities in Colorado",
    createdAt: "2023-07-01T00:00:00Z",
  },
  {
    id: "cat7",
    name: "Colorado Wildlife",
    image:
      "https://images.unsplash.com/photo-1545486336-5a5b0929f7d7?w=40&h=40&fit=crop&crop=face",
    status: "blocked",
    description: "Wildlife exploration and conservation in Colorado",
    createdAt: "2022-12-08T00:00:00Z",
  },
  {
    id: "cat8",
    name: "Mountain Biking",
    image:
      "https://images.unsplash.com/photo-1598195950283-0a6d6a8a4b2b?w=40&h=40&fit=crop&crop=face",
    status: "active",
    description: "Mountain biking trails and events in Colorado",
    createdAt: "2023-05-12T00:00:00Z",
  },
];
