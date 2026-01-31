import { useEffect, useRef, useState, useCallback } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import { motion, AnimatePresence } from "framer-motion";
import { MapMarker, markerColors, markerLabels } from "./safetyMapData";
import { indiaMarkers } from "./indiaMarkersData";

interface GoogleMapsComponentProps {
  markers?: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  activeFilters?: string[];
  onMarkerClick?: (marker: MapMarker) => void;
}

const markerIcons: Record<string, string> = {
  safe: "🛡️",
  moderate: "⚠️",
  incident: "❌",
  police: "🚔",
  hospital: "🏥",
  safespace: "🏠",
};

const MapContent = ({
  markers,
  center = { lat: 20.5937, lng: 78.9629 },
  zoom = 5,
  activeFilters = ["safe", "moderate", "incident", "police", "hospital", "safespace"],
  onMarkerClick,
}: Omit<GoogleMapsComponentProps, 'className'>) => {
  const map = useMap();
  const [infoWindowOpen, setInfoWindowOpen] = useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const unfilteredMarkers = markers || indiaMarkers;

  const filteredMarkers = unfilteredMarkers.filter(marker => {
    if (!activeFilters.includes(marker.type)) return false;
    if (marker.id.startsWith('gen-') && currentZoom < 7) return false;
    return true;
  });

  const handleMarkerClick = (marker: MapMarker) => {
    setInfoWindowOpen(marker.id);
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  };

  useEffect(() => {
    if (map) {
      map.setZoom(currentZoom);
    }
  }, [map, currentZoom]);

  return (
    <>
      <AnimatePresence>
        {filteredMarkers.map((marker) => (
          <AdvancedMarker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.title}
            onClick={() => handleMarkerClick(marker)}
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-md cursor-pointer text-lg transition-transform hover:scale-110"
              style={{
                background: markerColors[marker.type as keyof typeof markerColors] || "#0f766e",
              }}
            >
              {markerIcons[marker.type] || "📍"}
            </div>

            {infoWindowOpen === marker.id && (
              <InfoWindow onCloseClick={() => setInfoWindowOpen(null)}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-64 p-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        background:
                          markerColors[marker.type as keyof typeof markerColors] || "#0f766e",
                      }}
                    ></span>
                    <span className="text-xs font-medium text-gray-500">
                      {markerLabels[marker.type as keyof typeof markerLabels] || "Location"}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{marker.title}</h3>
                  {marker.description && (
                    <p className="text-sm text-gray-600 mt-1">{marker.description}</p>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    📍 {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}
                  </div>
                </motion.div>
              </InfoWindow>
            )}
          </AdvancedMarker>
        ))}
      </AnimatePresence>
    </>
  );
};

const GoogleMapsComponent = ({
  markers,
  center = { lat: 20.5937, lng: 78.9629 },
  zoom = 5,
  className = "h-[600px] w-full",
  activeFilters = ["safe", "moderate", "incident", "police", "hospital", "safespace"],
  onMarkerClick,
}: GoogleMapsComponentProps) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!API_KEY) {
    return (
      <div className={`relative rounded-2xl overflow-hidden shadow-xl ${className} flex items-center justify-center bg-red-50`}>
        <div className="text-center">
          <p className="text-sm text-red-600 font-medium">⚠️ Google Maps API key is not configured</p>
          <p className="text-xs text-red-500 mt-1">Add VITE_GOOGLE_MAPS_API_KEY to your .env file</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-xl ${className}`}>
      <APIProvider apiKey={API_KEY}>
        <Map
          center={center}
          zoom={zoom}
          reuseMaps
          mapId="safety-map"
          minZoom={4}
          maxZoom={18}
          restriction={{
            latLngBounds: {
              north: 35.5,
              south: 8.0,
              east: 97.4,
              west: 68.0,
            },
            strictBounds: false,
          }}
        >
          <MapContent
            markers={markers}
            center={center}
            zoom={zoom}
            activeFilters={activeFilters}
            onMarkerClick={onMarkerClick}
          />
        </Map>
      </APIProvider>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 border border-gray-200 z-10"
      >
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Legend</h4>
        <div className="space-y-1">
          {Object.entries(markerLabels).map(([type, label]) => (
            <div key={type} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: markerColors[type as keyof typeof markerColors] || "#0f766e",
                }}
              ></span>
              <span className="text-xs text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export { GoogleMapsComponent };
