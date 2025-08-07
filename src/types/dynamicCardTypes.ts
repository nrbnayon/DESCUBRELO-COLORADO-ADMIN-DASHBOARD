// src/types/dynamicCardTypes.ts

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface OfflineTileBounds {
  southwest: Coordinates;
  northeast: Coordinates;
}

interface OfflineZoomRange {
  minZoom: number;
  maxZoom: number;
}

interface OfflineData {
  mapTiles?: boolean; // Are map tiles downloaded?
  detailsAvailable?: boolean; // Are detailed data available offline?
  navigationSupported?: boolean; // Is navigation supported offline?
  downloadedAt?: string; // ISO date string when downloaded
  tileRegionName?: string; // Unique Mapbox offline region name/id
  tileBounds?: OfflineTileBounds; // Bounds of the downloaded tile region
  zoomRange?: OfflineZoomRange; // Min and max zoom for offline tiles
  downloadProgress?: number; // Download progress (0 to 100)
  [key: string]: any; // Extra offline-related fields
}

export interface GenericDataItem {
  id: string;
  title?: string;
  description?: string;
  address?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  totalEvent?: number;
  type?: string;
  rating?: number; // read-only, not editable
  dateRange?: string;
  images?: string[];
  isFeatured?: boolean;
  phone?: string;
  socialLinks?: Record<string, string>; // e.g. { facebook: string, instagram: string }
  openingHours?: string;
  price?: number;
  categories?: string[];
  offlineSupported?: boolean; // Indicates if this item supports offline use
  offlineData?: OfflineData; // Offline map & data info
  [key: string]: any;
}


export type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "date"
  | "datetime-local"
  | "time"
  | "textarea"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "file"
  | "image"
  | "readonly"
  | "currency"
  | "percentage"
  | "url"
  | "tel"
  | "color"
  | "switch"
  | "rating"
  | "richtext"
  | "json"
  | "tags"
  | "daterange"
  | "slider"
  | "autocomplete"
  | "hidden";

export type GridColType = "full" | "half" | "third" | "quarter";
export type AlignType = "left" | "center" | "right";

export interface SelectOption {
  value: string;
  label: string;
  color?: string;
  icon?: string;
  [key: string]: string | unknown;
}

export interface ColumnConfig {
  key: string;
  label: string;
  type?: FieldType;
  sortable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  showAvatar?: boolean;
  align?: AlignType;
  width?: string;
  options?: SelectOption[];
  render?: (value: unknown, item: GenericDataItem) => React.ReactNode;
  [key: string]: string | unknown;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: "select" | "multiselect" | "date" | "daterange" | "search";
  options?: SelectOption[];
  placeholder?: string;
  [key: string]: string | unknown;
}

export interface ActionConfig {
  key: string;
  label: string;
  icon?: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  onClick: (item: GenericDataItem) => void;
  condition?: (item: GenericDataItem) => boolean;
}

export interface TableConfig {
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  itemsPerPage?: number;
  enableSearch?: boolean;
  enableFilters?: boolean;
  enablePagination?: boolean;
  enableSelection?: boolean;
  enableSorting?: boolean;
  striped?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  [key: string]: string | unknown;
}

export interface ValidationRule {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  required?: boolean;
  custom?: (value: unknown) => string | null;
}

// Updated FormField interface to match what DynamicDataCreateModal expects
export interface FormField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: ValidationRule;
  gridCol?: GridColType;
  section?: string;
  helpText?: string;
  disabled?: boolean;
  dependsOn?: string;
  condition?: (formData: Record<string, unknown>) => boolean;
  showWhen?: (data: GenericDataItem) => boolean;
  transform?: (value: unknown) => unknown;
  className?: string;
  [key: string]: string | unknown;
}

// Keep FormFieldConfig as an alias for backward compatibility
export type FormFieldConfig = FormField;

export interface FormSection {
  key: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  [key: string]: string | unknown;
}

export interface CardConfig {
  titleKey: string;
  subtitleKey?: string;
  imageKey?: string;
  descriptionKey?: string;
  statusKey?: string;
  badgeKeys?: string[];
  metaKeys?: string[];
  primaryAction?: ActionConfig;
  secondaryActions?: ActionConfig[];
  showDetailsButton?: boolean;
  customFields?: {
    key: string;
    label: string;
    render: (value: unknown, item: GenericDataItem) => React.ReactNode | string;
  }[];
}

// Search and Filter Types
export interface SearchFilterState {
  search: string;
  filters: Record<string, unknown>;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page: number;
  itemsPerPage: number;
  [key: string]: string | unknown;
}

export interface SearchFilterConfig {
  searchPlaceholder?: string;
  searchKeys?: string[];
  filters: FilterConfig[];
  enableSort?: boolean;
  sortOptions?: { key: string; label: string }[];
  enablePagination?: boolean;
  itemsPerPageOptions?: number[];
  [key: string]: string | unknown;
}
