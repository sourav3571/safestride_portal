import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { MapMarker, markerColors, markerLabels } from "./safetyMapData";

interface SafetyMapComponentProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const createCustomIcon = (type: keyof typeof markerColors) => {
  const color = markerColors[type];
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
      "></div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const SafetyMapComponent = ({
  markers,
  center = [28.6139, 77.209],
  zoom = 11,
  className = "h-[600px] w-full",
}: SafetyMapComponentProps) => {
  const defaultMarkers: MapMarker[] = [
    { id: "1", lat: 28.6139, lng: 77.209, type: "safe", title: "Connaught Place", description: "Well-lit area with heavy footfall" },
    { id: "2", lat: 28.6304, lng: 77.2177, type: "police", title: "Delhi Police HQ", description: "24/7 Police Station" },
    { id: "3", lat: 28.5562, lng: 77.1, type: "moderate", title: "Janakpuri Area", description: "Moderate lighting after 9 PM" },
    { id: "4", lat: 28.6692, lng: 77.4538, type: "incident", title: "Reported Incident", description: "Harassment reported - 2 days ago" },
    { id: "5", lat: 28.5244, lng: 77.1855, type: "hospital", title: "AIIMS Hospital", description: "24/7 Emergency Services" },
    { id: "6", lat: 28.6129, lng: 77.2295, type: "safespace", title: "India Gate", description: "Tourist area with high security" },
    { id: "7", lat: 28.6508, lng: 77.2319, type: "safe", title: "Delhi University", description: "Campus area with security" },
    { id: "8", lat: 28.5733, lng: 77.2588, type: "moderate", title: "Nehru Place", description: "Busy during day, less crowded at night" },
    { id: "9", lat: 28.6508, lng: 77.3077, type: "police", title: "Anand Vihar PS", description: "Police Station" },
    { id: "10", lat: 28.5892, lng: 77.2507, type: "safespace", title: "Humayun's Tomb", description: "Heritage site with guards" },
  ];

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Use props markers if provided, otherwise default
  const activeMarkers = markers || defaultMarkers;

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: center,
      zoom: zoom,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    // Add tile layer with light theme
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Add markers
    activeMarkers.forEach((marker) => {
      const icon = createCustomIcon(marker.type);
      const m = L.marker([marker.lat, marker.lng], { icon }).addTo(map);

      m.bindPopup(`
        <div class="p-2">
          <div class="flex items-center gap-2 mb-2">
            <span class="w-3 h-3 rounded-full" style="background: ${markerColors[marker.type]}"></span>
            <span class="text-xs font-medium text-gray-500">${markerLabels[marker.type]}</span>
          </div>
          <h3 class="font-semibold text-gray-900">${marker.title}</h3>
          ${marker.description ? `<p class="text-sm text-gray-600 mt-1">${marker.description}</p>` : ""}
        </div>
      `);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-xl ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export { SafetyMapComponent };
