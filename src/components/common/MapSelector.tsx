import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, RotateCcw } from "lucide-react";

// Google Maps type definitions using modern ES module approach
interface GoogleMapsLatLng {
  lat(): number;
  lng(): number;
}

interface GoogleMapsLatLngLiteral {
  lat: number;
  lng: number;
}

interface GoogleMapsLatLngBounds {
  getSouthWest(): GoogleMapsLatLng;
  getNorthEast(): GoogleMapsLatLng;
}

interface GoogleMapsLatLngBoundsLiteral {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface GoogleMapsSize {
  width: number;
  height: number;
}

interface GoogleMapsPoint {
  x: number;
  y: number;
}

interface GoogleMapsIcon {
  url: string;
  scaledSize?: GoogleMapsSize;
  anchor?: GoogleMapsPoint;
}

interface GoogleMapsMapOptions {
  center: GoogleMapsLatLng | GoogleMapsLatLngLiteral;
  zoom: number;
  mapTypeId: string;
  streetViewControl?: boolean;
  mapTypeControl?: boolean;
  zoomControl?: boolean;
  fullscreenControl?: boolean;
}

interface GoogleMapsMarkerOptions {
  position: GoogleMapsLatLng | GoogleMapsLatLngLiteral;
  map: GoogleMapsMap | null;
  draggable?: boolean;
  title?: string;
  icon?: string | GoogleMapsIcon;
}

interface GoogleMapsRectangleOptions {
  bounds: GoogleMapsLatLngBoundsLiteral;
  editable?: boolean;
  draggable?: boolean;
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWeight?: number;
}

interface GoogleMapsGeocoderRequest {
  address: string;
}

interface GoogleMapsGeocoderResult {
  geometry: {
    location: GoogleMapsLatLng;
  };
}

interface GoogleMapsMapMouseEvent {
  latLng: GoogleMapsLatLng | null;
}

// Class definitions for Google Maps objects
declare class GoogleMapsMap {
  constructor(element: HTMLElement, options: GoogleMapsMapOptions);
  setCenter(latlng: GoogleMapsLatLng | GoogleMapsLatLngLiteral): void;
  addListener(
    eventName: string,
    handler: (event?: GoogleMapsMapMouseEvent) => void
  ): void;
}

declare class GoogleMapsMarker {
  constructor(options: GoogleMapsMarkerOptions);
  setPosition(latlng: GoogleMapsLatLng | GoogleMapsLatLngLiteral): void;
  setMap(map: GoogleMapsMap | null): void;
  getPosition(): GoogleMapsLatLng | undefined;
  addListener(eventName: string, handler: () => void): void;
}

declare class GoogleMapsRectangle {
  constructor(options: GoogleMapsRectangleOptions);
  setMap(map: GoogleMapsMap | null): void;
  getBounds(): GoogleMapsLatLngBounds | undefined;
  addListener(eventName: string, handler: () => void): void;
}

declare class GoogleMapsGeocoder {
  constructor();
  geocode(
    request: GoogleMapsGeocoderRequest,
    callback: (
      results: GoogleMapsGeocoderResult[] | null,
      status: string
    ) => void
  ): void;
}

// Constructable type definitions
interface GoogleMapsLatLngConstructor {
  new (lat: number, lng: number): GoogleMapsLatLng;
}

interface GoogleMapsSizeConstructor {
  new (width: number, height: number): GoogleMapsSize;
}

interface GoogleMapsPointConstructor {
  new (x: number, y: number): GoogleMapsPoint;
}

// Global window interface
declare global {
  interface Window {
    google: {
      maps: {
        Map: typeof GoogleMapsMap;
        Marker: typeof GoogleMapsMarker;
        Rectangle: typeof GoogleMapsRectangle;
        Geocoder: typeof GoogleMapsGeocoder;
        LatLng: GoogleMapsLatLngConstructor;
        Size: GoogleMapsSizeConstructor;
        Point: GoogleMapsPointConstructor;
        MapTypeId: {
          ROADMAP: string;
          SATELLITE: string;
          HYBRID: string;
          TERRAIN: string;
        };
        GeocoderStatus: {
          OK: string;
          ZERO_RESULTS: string;
          OVER_DAILY_LIMIT: string;
          OVER_QUERY_LIMIT: string;
          REQUEST_DENIED: string;
          INVALID_REQUEST: string;
          UNKNOWN_ERROR: string;
        };
      };
    };
  }
}

// Types for our coordinate data
interface Coordinates {
  lat: number;
  lng: number;
}

interface BoundingBox {
  southwest: Coordinates;
  northeast: Coordinates;
}

interface MapSelectorProps {
  onCoordinatesChange?: (coords: Coordinates) => void;
  onBoundingBoxChange?: (bounds: BoundingBox) => void;
  initialCoordinates?: Coordinates;
  initialBounds?: BoundingBox;
  radiusKm?: number; // Radius for auto-calculating bounds
}

const MapCoordinateSelector: React.FC<MapSelectorProps> = ({
  onCoordinatesChange,
  onBoundingBoxChange,
  initialCoordinates = { lat: 39.7392, lng: -104.9903 }, // Denver, Colorado default
  initialBounds,
  radiusKm = 5, // Default 5km radius
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<GoogleMapsMap | null>(null);
  const [marker, setMarker] = useState<GoogleMapsMarker | null>(null);
  const [rectangle, setRectangle] = useState<GoogleMapsRectangle | null>(null);
  const [selectedCoords, setSelectedCoords] =
    useState<Coordinates>(initialCoordinates);
  const [boundingBox, setBoundingBox] = useState<BoundingBox | null>(
    initialBounds || null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  // Check if Google Maps is already loaded
  useEffect(() => {
    if (typeof window !== "undefined" && window.google?.maps) {
      setIsGoogleMapsLoaded(true);
    }
  }, []);

  // Calculate bounding box from center point and radius
  const calculateBoundingBox = useCallback(
    (center: Coordinates, radius: number): BoundingBox => {
      // Approximate conversion: 1 degree ≈ 111 km
      const latOffset = radius / 111;
      const lngOffset = radius / (111 * Math.cos((center.lat * Math.PI) / 180));

      return {
        southwest: {
          lat: center.lat - latOffset,
          lng: center.lng - lngOffset,
        },
        northeast: {
          lat: center.lat + latOffset,
          lng: center.lng + lngOffset,
        },
      };
    },
    []
  );

  // Update rectangle on map
  const updateRectangle = useCallback(
    (bounds: BoundingBox) => {
      if (!map) return;

      if (rectangle) {
        rectangle.setMap(null);
      }

      const newRectangle = new window.google.maps.Rectangle({
        bounds: {
          north: bounds.northeast.lat,
          south: bounds.southwest.lat,
          east: bounds.northeast.lng,
          west: bounds.southwest.lng,
        },
        editable: true,
        draggable: true,
        fillColor: "#3B82F6",
        fillOpacity: 0.2,
        strokeColor: "#3B82F6",
        strokeOpacity: 0.8,
        strokeWeight: 2,
      });

      newRectangle.setMap(map);
      setRectangle(newRectangle);

      // Add event listener for rectangle changes
      newRectangle.addListener("bounds_changed", () => {
        const newBounds = newRectangle.getBounds();
        if (newBounds) {
          const updatedBounds: BoundingBox = {
            southwest: {
              lat: newBounds.getSouthWest().lat(),
              lng: newBounds.getSouthWest().lng(),
            },
            northeast: {
              lat: newBounds.getNorthEast().lat(),
              lng: newBounds.getNorthEast().lng(),
            },
          };
          setBoundingBox(updatedBounds);
          onBoundingBoxChange?.(updatedBounds);
        }
      });
    },
    [map, rectangle, onBoundingBoxChange]
  );

  // Load Google Maps script
  const loadGoogleMaps = useCallback(() => {
    if (typeof window === "undefined" || isGoogleMapsLoaded) return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => {
      setIsGoogleMapsLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps script");
    };
    document.head.appendChild(script);
  }, [isGoogleMapsLoaded]);

  // Initialize Google Maps
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !isGoogleMapsLoaded) return;

    const mapOptions: GoogleMapsMapOptions = {
      center: selectedCoords,
      zoom: 13,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      streetViewControl: false,
      mapTypeControl: true,
      zoomControl: true,
      fullscreenControl: true,
    };

    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);
    setIsMapLoaded(true);

    // Add click listener to map
    newMap.addListener("click", (event: GoogleMapsMapMouseEvent) => {
      if (event.latLng) {
        const coords: Coordinates = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };
        handleCoordinateSelect(coords);
      }
    });
  }, [mapRef, isGoogleMapsLoaded, selectedCoords]);

  // Handle coordinate selection
  const handleCoordinateSelect = useCallback(
    (coords: Coordinates) => {
      setSelectedCoords(coords);
      onCoordinatesChange?.(coords);

      // Custom marker icon
      const customIcon: GoogleMapsIcon = {
        url: "/icons/pin_regular.png",
        scaledSize: new window.google.maps.Size(32, 32),
        anchor: new window.google.maps.Point(16, 32), // Anchor point (bottom center of icon)
      };

      // Update marker
      if (marker) {
        marker.setPosition(coords);
      } else if (map) {
        const newMarker = new window.google.maps.Marker({
          position: coords,
          map: map,
          draggable: true,
          title: "Selected Location",
          icon: customIcon,
        });

        newMarker.addListener("dragend", () => {
          const position = newMarker.getPosition();
          if (position) {
            const newCoords: Coordinates = {
              lat: position.lat(),
              lng: position.lng(),
            };
            handleCoordinateSelect(newCoords);
          }
        });

        setMarker(newMarker);
      }

      // Calculate and update bounding box
      const newBounds = calculateBoundingBox(coords, radiusKm);
      setBoundingBox(newBounds);
      onBoundingBoxChange?.(newBounds);
      updateRectangle(newBounds);

      // Center map on new coordinates
      if (map) {
        map.setCenter(coords);
      }
    },
    [
      map,
      marker,
      radiusKm,
      onCoordinatesChange,
      onBoundingBoxChange,
      calculateBoundingBox,
      updateRectangle,
    ]
  );

  // Search for location
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() || !map || !isGoogleMapsLoaded) return;

    const geocoder = new window.google.maps.Geocoder();

    try {
      const result = await new Promise<GoogleMapsGeocoderResult[]>(
        (resolve, reject) => {
          geocoder.geocode(
            { address: searchQuery },
            (results: GoogleMapsGeocoderResult[] | null, status: string) => {
              if (status === window.google.maps.GeocoderStatus.OK && results) {
                resolve(results);
              } else {
                reject(new Error(`Geocoding failed: ${status}`));
              }
            }
          );
        }
      );

      if (result[0]?.geometry?.location) {
        const coords: Coordinates = {
          lat: result[0].geometry.location.lat(),
          lng: result[0].geometry.location.lng(),
        };
        handleCoordinateSelect(coords);
      }
    } catch (error) {
      console.error("Search failed:", error);
    }
  }, [searchQuery, map, handleCoordinateSelect, isGoogleMapsLoaded]);

  // Reset to initial coordinates
  const handleReset = useCallback(() => {
    handleCoordinateSelect(initialCoordinates);
  }, [initialCoordinates, handleCoordinateSelect]);

  // Load Google Maps when component mounts
  useEffect(() => {
    loadGoogleMaps();
  }, [loadGoogleMaps]);

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (isGoogleMapsLoaded && !isMapLoaded) {
      initializeMap();
    }
  }, [isGoogleMapsLoaded, isMapLoaded, initializeMap]);

  // Set initial marker when map is loaded
  useEffect(() => {
    if (isMapLoaded && selectedCoords && !marker) {
      handleCoordinateSelect(selectedCoords);
    }
  }, [isMapLoaded, selectedCoords, marker, handleCoordinateSelect]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Select Location on Map
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <Input
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} variant="outline" size="icon">
              <Search className="w-4 h-4" />
            </Button>
            <Button onClick={handleReset} variant="outline" size="icon">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Map Container */}
          <div className="relative">
            <div
              ref={mapRef}
              className="w-full h-96 rounded-lg border border-gray-300"
              style={{ minHeight: "400px" }}
            />
            {(!isGoogleMapsLoaded || !isMapLoaded) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">
                    {!isGoogleMapsLoaded
                      ? "Loading Google Maps..."
                      : "Initializing map..."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Click anywhere on the map to select coordinates</p>
            <p>• Drag the marker to fine-tune the position</p>
            <p>
              • The blue rectangle shows the bounding area (adjustable by
              dragging)
            </p>
            <p>• Use the search bar to quickly find locations</p>
          </div>
        </CardContent>
      </Card>

      {/* Selected Coordinates Display */}
      <Card>
        <CardHeader>
          <CardTitle>Selected Coordinates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Latitude</Label>
              <Input
                value={selectedCoords.lat.toFixed(6)}
                onChange={(e) => {
                  const lat = parseFloat(e.target.value);
                  if (!isNaN(lat)) {
                    handleCoordinateSelect({ ...selectedCoords, lat });
                  }
                }}
                placeholder="Latitude"
              />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input
                value={selectedCoords.lng.toFixed(6)}
                onChange={(e) => {
                  const lng = parseFloat(e.target.value);
                  if (!isNaN(lng)) {
                    handleCoordinateSelect({ ...selectedCoords, lng });
                  }
                }}
                placeholder="Longitude"
              />
            </div>
          </div>

          {/* Bounding Box */}
          {boundingBox && (
            <div className="space-y-2">
              <Label>Bounding Box (Southwest & Northeast corners)</Label>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Southwest</Label>
                  <div className="p-2 bg-gray-50 rounded">
                    <div>Lat: {boundingBox.southwest.lat.toFixed(6)}</div>
                    <div>Lng: {boundingBox.southwest.lng.toFixed(6)}</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Northeast</Label>
                  <div className="p-2 bg-gray-50 rounded">
                    <div>Lat: {boundingBox.northeast.lat.toFixed(6)}</div>
                    <div>Lng: {boundingBox.northeast.lng.toFixed(6)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MapCoordinateSelector;
