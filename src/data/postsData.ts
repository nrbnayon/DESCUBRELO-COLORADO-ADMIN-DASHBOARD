// src/data/postsData.ts
import type { GenericDataItem } from "../types/dynamicCardTypes";

export interface PostDataItem extends GenericDataItem {
  id: string;
  title?: string;
  description?: string;
  address?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  totalEvent?: number;
  type?: string;
  rating?: number;
  dateRange?: string;
  images?: string[];
  isFeatured?: boolean;
  phone?: string;
  socialLinks?: Record<string, string>;
  openingHours?: string;
  price?: number;
  categories?: string[];
  offlineSupported?: boolean;
  offlineData?: {
    mapTiles?: boolean;
    detailsAvailable?: boolean;
    navigationSupported?: boolean;
    downloadedAt?: string;
    tileRegionName?: string;
    tileBounds?: {
      southwest: { latitude: number; longitude: number };
      northeast: { latitude: number; longitude: number };
    };
    zoomRange?: {
      minZoom: number;
      maxZoom: number;
    };
    downloadProgress?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

export const postsData: PostDataItem[] = [
  {
    id: "post1",
    title: "New Product Launch Announcement",
    description:
      "We are excited to announce the launch of our latest product with cutting-edge technology and innovative features that will revolutionize the industry.",
    images: [
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
    ],
    type: "Technology",
    rating: 4.8,
    dateRange: "2024-01-15 to 2024-02-15",
    isFeatured: true,
    categories: ["technology", "innovation", "product", "launch"],
    socialLinks: {
      facebook: "https://facebook.com/company/product-launch",
      linkedin: "https://linkedin.com/company/posts/product-launch",
      twitter: "https://twitter.com/company/status/product-launch",
      instagram: "https://instagram.com/company/product-launch",
      website: "https://company.com/product-launch",
    },
    address: "Tech Hub, Innovation District, Building A",
    location: "San Francisco, CA",
    latitude: 37.7749,
    longitude: -122.4194,
    phone: "+1-555-0123",
    openingHours: "9:00 AM - 6:00 PM",
    price: 299.99,
    totalEvent: 15,
    offlineSupported: true,
    offlineData: {
      mapTiles: true,
      detailsAvailable: true,
      navigationSupported: true,
      downloadedAt: "2024-01-14T10:00:00Z",
      tileRegionName: "sf_techhub_region_001",
      tileBounds: {
        southwest: { latitude: 37.7639, longitude: -122.4304 },
        northeast: { latitude: 37.7859, longitude: -122.4084 },
      },
      zoomRange: {
        minZoom: 12,
        maxZoom: 18,
      },
      downloadProgress: 100,
    },
  },
  {
    id: "post2",
    title: "Company Expansion to New Markets",
    description:
      "Our company is expanding operations to three new international markets, bringing our services to millions of new customers worldwide.",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    ],
    type: "Business",
    rating: 4.5,
    dateRange: "2024-01-20 to 2024-03-20",
    isFeatured: false,
    categories: ["business", "expansion", "global", "markets", "growth"],
    socialLinks: {
      linkedin: "https://linkedin.com/company/expansion-post",
      twitter: "https://twitter.com/company/expansion",
      website: "https://company.com/expansion",
    },
    address: "Corporate Headquarters, 123 Business Ave",
    location: "New York, NY",
    latitude: 40.7128,
    longitude: -74.006,
    phone: "+1-555-0456",
    openingHours: "8:00 AM - 7:00 PM",
    price: 1999.99,
    totalEvent: 8,
    offlineSupported: true,
    offlineData: {
      mapTiles: true,
      detailsAvailable: true,
      navigationSupported: false,
      downloadedAt: "2024-01-18T15:00:00Z",
      tileRegionName: "ny_headquarters_region_002",
      tileBounds: {
        southwest: { latitude: 40.7018, longitude: -74.017 },
        northeast: { latitude: 40.7238, longitude: -73.995 },
      },
      zoomRange: {
        minZoom: 10,
        maxZoom: 16,
      },
      downloadProgress: 85,
    },
  },
  {
    id: "post3",
    title: "Annual Technology Conference 2024",
    description:
      "Join us for the biggest technology conference of the year featuring industry leaders, innovative workshops, and networking opportunities.",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=300&fit=crop",
    ],
    type: "Technology",
    rating: 4.9,
    dateRange: "2024-06-15 to 2024-06-17",
    isFeatured: true,
    categories: ["technology", "conference", "networking", "innovation"],
    socialLinks: {
      facebook: "https://facebook.com/techconf2024",
      linkedin: "https://linkedin.com/events/techconf2024",
      twitter: "https://twitter.com/techconf2024",
      instagram: "https://instagram.com/techconf2024",
      website: "https://techconf2024.com",
    },
    address: "Convention Center, 456 Tech Boulevard",
    location: "Austin, TX",
    latitude: 30.2672,
    longitude: -97.7431,
    phone: "+1-555-0789",
    openingHours: "8:00 AM - 8:00 PM (Conference Days)",
    price: 499.99,
    totalEvent: 25,
    offlineSupported: true,
    offlineData: {
      mapTiles: true,
      detailsAvailable: true,
      navigationSupported: true,
      downloadedAt: "2024-05-01T09:00:00Z",
      tileRegionName: "austin_convention_region_003",
      tileBounds: {
        southwest: { latitude: 30.2562, longitude: -97.7541 },
        northeast: { latitude: 30.2782, longitude: -97.7321 },
      },
      zoomRange: {
        minZoom: 14,
        maxZoom: 19,
      },
      downloadProgress: 100,
    },
  },
  {
    id: "post4",
    title: "Sustainability Initiative Launch",
    description:
      "Announcing our comprehensive sustainability program aimed at reducing carbon footprint and promoting environmental responsibility across all operations.",
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    ],
    type: "Announcement",
    rating: 4.3,
    dateRange: "2024-04-01 to 2024-12-31",
    isFeatured: false,
    categories: ["sustainability", "environment", "initiative", "corporate"],
    socialLinks: {
      linkedin: "https://linkedin.com/company/sustainability",
      twitter: "https://twitter.com/company/green",
      website: "https://company.com/sustainability",
    },
    address: "Green Campus, 789 Eco Drive",
    location: "Portland, OR",
    latitude: 45.5152,
    longitude: -122.6784,
    phone: "+1-555-0321",
    openingHours: "24/7 (Online Initiative)",
    price: 0,
    totalEvent: 12,
    offlineSupported: false,
    offlineData: {
      mapTiles: false,
      detailsAvailable: true,
      navigationSupported: false,
      downloadedAt: "2024-03-15T12:00:00Z",
      tileRegionName: "portland_green_region_004",
      tileBounds: {
        southwest: { latitude: 45.5042, longitude: -122.6894 },
        northeast: { latitude: 45.5262, longitude: -122.6674 },
      },
      zoomRange: {
        minZoom: 12,
        maxZoom: 16,
      },
      downloadProgress: 0,
    },
  },
  {
    id: "post5",
    title: "Customer Success Story: Global Retailer",
    description:
      "Discover how we helped a major global retailer transform their digital infrastructure and achieve 300% growth in online sales.",
    images: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    ],
    type: "Business",
    rating: 4.7,
    dateRange: "2024-02-01 to 2024-02-28",
    isFeatured: true,
    categories: ["success-story", "retail", "digital", "transformation"],
    socialLinks: {
      facebook: "https://facebook.com/company/case-study",
      linkedin: "https://linkedin.com/company/success-story",
      website: "https://company.com/case-studies/retail",
    },
    address: "Client Site, Various Locations",
    location: "Multiple Cities",
    latitude: 41.8781,
    longitude: -87.6298,
    phone: "+1-555-0654",
    openingHours: "Business Hours Vary",
    price: 15000,
    totalEvent: 6,
    offlineSupported: true,
    offlineData: {
      mapTiles: true,
      detailsAvailable: true,
      navigationSupported: true,
      downloadedAt: "2024-01-25T14:30:00Z",
      tileRegionName: "chicago_client_region_005",
      tileBounds: {
        southwest: { latitude: 41.8671, longitude: -87.6408 },
        northeast: { latitude: 41.8891, longitude: -87.6188 },
      },
      zoomRange: {
        minZoom: 11,
        maxZoom: 17,
      },
      downloadProgress: 100,
    },
  },
];
