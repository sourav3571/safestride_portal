import React, { useMemo, useState } from "react";
import Map, { Marker, Popup, NavigationControl, Source, Layer } from "react-map-gl";
import { motion, AnimatePresence } from "framer-motion";
import { MapMarker, markerColors, markerLabels } from "./safetyMapData";
import { indiaMarkers } from "./indiaMarkersData";

interface MapboxComponentProps {
  markers?: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  activeFilters?: string[];
  onMarkerClick?: (marker: MapMarker) => void;
  routes?: Array<{ coordinates: [number, number][], color: string; width?: number; opacity?: number }>;
  startMarker?: { lat: number; lng: number } | null;
  endMarker?: { lat: number; lng: number } | null;
}

const markerIcons: Record<string, string> = {
  safe: "🛡️",
  moderate: "⚠️",
  incident: "❌",
  police: "🚔",
  hospital: "🏥",
  safespace: "🏠",
  cctv: "📹",
  lighting: "💡",
  transport: "🚌",
};

export const MapboxComponent: React.FC<MapboxComponentProps> = ({
  markers,
  center = { lat: 20.5937, lng: 78.9629 },
  zoom = 5,
  className = "h-[600px] w-full",
  activeFilters = ["safe", "moderate", "incident", "police", "hospital", "safespace", "cctv", "lighting", "transport"],
  onMarkerClick,
  routes = [],
  startMarker = null,
  endMarker = null,
}) => {
  const token = import.meta.env.VITE_MAPBOX_API_KEY as string | undefined;

  const unfiltered = markers || indiaMarkers;
  console.log("MAPBOX: unfiltered count:", unfiltered.length);
  console.log("MAPBOX: activeFilters:", activeFilters);

  const [popupId, setPopupId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const f = unfiltered.filter(m => {
      if (!activeFilters.includes(m.type)) return false;
      return true;
    });
    console.log("MAPBOX: filtered count:", f.length);
    return f;
  },
    [unfiltered, activeFilters]
  );

  if (!token) {
    return (
      <div className={`relative rounded-2xl overflow-hidden shadow-xl ${className} flex items-center justify-center bg-red-50`}>
        <div className="text-center">
          <p className="text-sm text-red-600 font-medium">⚠️ Mapbox API key is not configured</p>
          <p className="text-xs text-red-500 mt-1">Add VITE_MAPBOX_API_KEY to your .env file</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-xl ${className}`}>
      <Map
        initialViewState={{ latitude: center.lat, longitude: center.lng, zoom }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={token}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-left" />

        {/* Route overlays */}
        {routes.length > 0 && (
          <Source
            id="routes-source"
            type="geojson"
            data={{
              type: "FeatureCollection",
              features: routes.map((r, idx) => ({
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: r.coordinates,
                },
                properties: {
                  color: r.color,
                  width: r.width ?? (idx === 0 ? 6 : 4),
                  opacity: r.opacity ?? (idx === 0 ? 0.9 : 0.7),
                },
              })),
            } as any}
          >
            <Layer
              id="routes-layer"
              type="line"
              paint={{
                "line-color": ["get", "color"],
                "line-width": ["get", "width"],
                "line-opacity": ["get", "opacity"],
              }}
              layout={{
                "line-join": "round",
                "line-cap": "round",
              }}
            />
          </Source>
        )}

        {routes.length > 0 &&
          routes.map((r, idx) => {
            const mid = r.coordinates[Math.floor(r.coordinates.length / 2)] || r.coordinates[0];
            const tag = String.fromCharCode(65 + idx);
            return (
              <Marker key={`route-label-${idx}`} longitude={mid[0]} latitude={mid[1]} anchor="bottom">
                <div className="px-2 py-1 rounded-md bg-white text-[11px] shadow-md border border-gray-200 select-none">
                  🛣️ Route {tag}
                </div>
              </Marker>
            );
          })}

        {startMarker && (
          <Marker longitude={startMarker.lng} latitude={startMarker.lat} anchor="bottom">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-emerald-500 shadow-lg text-lg select-none"
              style={{ transform: "translateY(-4px)" }}
            >
              📍
            </div>
          </Marker>
        )}
        {endMarker && (
          <Marker longitude={endMarker.lng} latitude={endMarker.lat} anchor="bottom">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-rose-500 shadow-lg text-lg select-none"
              style={{ transform: "translateY(-4px)" }}
            >
              🏁
            </div>
          </Marker>
        )}

        {filtered.map((m) => (
          <React.Fragment key={m.id}>
            <Marker
              longitude={m.lng}
              latitude={m.lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setPopupId(m.id);
                onMarkerClick && onMarkerClick(m);
              }}
            >
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-md cursor-pointer text-sm hover:scale-110 transition-transform"
                style={{ background: markerColors[m.type as keyof typeof markerColors] }}
              >
                {markerIcons[m.type] || "📍"}
              </div>
            </Marker>

            {popupId === m.id && (
              <Popup
                longitude={m.lng}
                latitude={m.lat}
                anchor="top"
                onClose={() => setPopupId(null)}
                closeOnClick={false}
              >
                <div className="w-64 p-2 bg-white rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full" style={{ background: markerColors[m.type as keyof typeof markerColors] }} />
                    <span className="text-xs text-gray-500">{markerLabels[m.type as keyof typeof markerLabels]}</span>
                  </div>
                  <h3 className="font-semibold">{m.title}</h3>
                  {m.description && <p className="text-sm text-gray-600">{m.description}</p>}
                  <div className="text-xs text-gray-500 mt-1">{m.lat.toFixed(4)}, {m.lng.toFixed(4)}</div>
                </div>
              </Popup>
            )}
          </React.Fragment>
        ))}
      </Map>

      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 border border-gray-200 z-10">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Legend</h4>
        <div className="space-y-1">
          {Object.entries(markerLabels).map(([type, label]) => (
            <div key={type} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: markerColors[type as keyof typeof markerColors] }} />
              <span className="text-xs">{markerIcons[type as keyof typeof markerIcons]}</span>
              <span className="text-xs text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapboxComponent;
