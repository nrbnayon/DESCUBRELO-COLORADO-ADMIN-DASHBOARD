"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type {
  SearchFilterState,
  SearchFilterConfig,
  FilterConfig,
} from "@/types/dynamicCardTypes";

interface SearchFilterBarProps {
  state: SearchFilterState;
  config: SearchFilterConfig;
  onStateChange: (newState: SearchFilterState) => void;
  className?: string;
}

export function SearchFilterBar({
  state,
  config,
  onStateChange,
  className,
}: SearchFilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Handle search change
  const handleSearchChange = useCallback(
    (value: string) => {
      onStateChange({
        ...state,
        search: value,
        page: 1, // Reset to first page when searching
      });
    },
    [state, onStateChange]
  );

  // Handle filter change
  const handleFilterChange = useCallback(
    (key: string, value: unknown) => {
      const newFilters = { ...state.filters };
      if (value === null || value === undefined || value === "") {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }

      onStateChange({
        ...state,
        filters: newFilters,
        page: 1, // Reset to first page when filtering
      });
    },
    [state, onStateChange]
  );

  // Handle sort change
  const handleSortChange = useCallback(
    (sortBy: string) => {
      const newSortOrder =
        state.sortBy === sortBy && state.sortOrder === "asc" ? "desc" : "asc";
      onStateChange({
        ...state,
        sortBy,
        sortOrder: newSortOrder,
      });
    },
    [state, onStateChange]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    onStateChange({
      ...state,
      search: "",
      filters: {},
      sortBy: undefined,
      sortOrder: undefined,
      page: 1,
    });
  }, [state, onStateChange]);

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (state.search) count++;
    count += Object.keys(state.filters).length;
    if (state.sortBy) count++;
    return count;
  }, [state.search, state.filters, state.sortBy]);

  // Render filter field
  const renderFilterField = useCallback(
    (filter: FilterConfig) => {
      const value = state.filters[filter.key];

      switch (filter.type) {
        case "select":
          return (
            <div key={filter.key} className="space-y-2">
              <Label className="text-sm font-medium">{filter.label}</Label>
              <Select
                value={(value as string) || ""}
                onValueChange={(val) =>
                  handleFilterChange(filter.key, val || null)
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue
                    placeholder={filter.placeholder || `Select ${filter.label}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All {filter.label}</SelectItem>
                  {filter.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.icon && (
                        <span className="mr-2">{option.icon}</span>
                      )}
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );

        case "date":
          return (
            <div key={filter.key} className="space-y-2">
              <Label className="text-sm font-medium">{filter.label}</Label>
              <Input
                type="date"
                value={(value as string) || ""}
                onChange={(e) =>
                  handleFilterChange(filter.key, e.target.value || null)
                }
                className="h-9"
              />
            </div>
          );

        default:
          return null;
      }
    },
    [state.filters, handleFilterChange]
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={config.searchPlaceholder || "Search..."}
            value={state.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-10"
          />
          {state.search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => handleSearchChange("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          {/* Filter Popover */}
          {config.filters && config.filters.length > 0 && (
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-10 gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 px-1.5 py-0.5 text-xs"
                    >
                      {activeFilterCount}
                    </Badge>
                  )}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filters</h4>
                    {activeFilterCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="h-8 px-2 text-xs"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {config.filters.map(renderFilterField)}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Sort Dropdown */}
          {config.enableSort &&
            config.sortOptions &&
            config.sortOptions.length > 0 && (
              <Select
                value={state.sortBy || ""}
                onValueChange={(val) => val && handleSortChange(val)}
              >
                <SelectTrigger className="w-[140px] h-10">
                  <div className="flex items-center gap-1">
                    {state.sortOrder === "desc" ? (
                      <SortDesc className="h-3 w-3" />
                    ) : (
                      <SortAsc className="h-3 w-3" />
                    )}
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {config.sortOptions.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {/* Search Badge */}
          {state.search && (
            <Badge variant="secondary" className="gap-1">
              Search: "{state.search}"
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleSearchChange("")}
              />
            </Badge>
          )}

          {/* Filter Badges */}
          {Object.entries(state.filters).map(([key, value]) => {
            const filter = config.filters.find((f) => f.key === key);
            const option = filter?.options?.find((o) => o.value === value);
            const displayValue = option?.label || String(value);

            return (
              <Badge key={key} variant="secondary" className="gap-1">
                {filter?.label}: {displayValue}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleFilterChange(key, null)}
                />
              </Badge>
            );
          })}

          {/* Sort Badge */}
          {state.sortBy && (
            <Badge variant="secondary" className="gap-1">
              Sort:{" "}
              {config.sortOptions?.find((o) => o.key === state.sortBy)?.label}(
              {state.sortOrder === "asc" ? "A-Z" : "Z-A"})
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onStateChange({
                    ...state,
                    sortBy: undefined,
                    sortOrder: undefined,
                  })
                }
              />
            </Badge>
          )}

          {/* Clear All Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
