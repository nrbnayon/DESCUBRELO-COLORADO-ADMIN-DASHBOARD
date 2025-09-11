// src/types/statsCardDataSets.ts
import { MetricData } from "@/types/statsCardDataTypes";

// Fallback/default data for StatsCard (used when API is unavailable)
export const defaultMetrics: MetricData[] = [
  {
    title: "Total Users",
    value: "0",
    trend: "up",
    trendValue: "0",
    trendColor: "text-green-600",
    sparklinePoints: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    title: "Active Users",
    value: "0",
    trend: "up",
    trendValue: "0",
    trendColor: "text-green-600",
    sparklinePoints: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    title: "Total Subscribers",
    value: "0",
    trend: "up",
    trendValue: "0",
    trendColor: "text-green-600",
    sparklinePoints: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
];
