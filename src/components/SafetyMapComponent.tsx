import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

import { MapMarker, markerColors, markerLabels } from "./safetyMapData";
import { indiaMarkers } from "./indiaMarkersData";

interface SafetyMapComponentProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  activeFilters?: string[];
  waypoints?: [number, number][]; // [lat, lng][]
  onRoutesUpdate?: (routes: { score: number; distance: number; duration: number; verdict: string }[]) => void;
}

const markerIcons = {
  safe: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  moderate: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  incident: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  police: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L3 7v9c0 5 9 8 9 8s9-3 9-8V7l-9-5z"/><circle cx="12" cy="13" r="3"/></svg>`,
  hospital: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  safespace: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
};

const createCustomIcon = (type: keyof typeof markerColors) => {
  const color = markerColors[type];
  const iconHtml = markerIcons[type] || "";
  const pulsingClass = type === "safe" ? "marker-pulsing-safe" : type === "safespace" ? "marker-pulsing-safespace" : "";

  return L.divIcon({
    className: `custom-marker ${pulsingClass}`,
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      ">
        ${iconHtml}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const SafetyMapComponent = ({
  markers,
  center = [20.5937, 78.9629],
  zoom = 5,
  className = "h-[600px] w-full",
  activeFilters = ["safe", "moderate", "incident", "police", "hospital", "safespace"],
  waypoints,
  onRoutesUpdate
}: SafetyMapComponentProps) => {
  const unfilteredMarkers = markers || indiaMarkers;
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupsRef = useRef<{ markers: any } | null>(null);
  const routingControlRef = useRef<any>(null);
  const [currentZoom, setCurrentZoom] = useState(zoom);

  const calculateSafetyScore = (routeCoords: L.LatLng[]) => {
    let score = 70; // Start at a decent base score
    let positiveHits = 0;
    let negativeHits = 0;

    // Sample coordinates to avoid heavy computation
    const step = Math.max(1, Math.floor(routeCoords.length / 50));

    for (let i = 0; i < routeCoords.length; i += step) {
      const p = routeCoords[i];

      unfilteredMarkers.forEach(m => {
        // Simple distance check (approx 500m)
        const dist = Math.sqrt(Math.pow(p.lat - m.lat, 2) + Math.pow(p.lng - m.lng, 2));
        if (dist < 0.005) {
          if (["safe", "police", "hospital"].includes(m.type)) {
            positiveHits++;
            score += 0.5;
          } else if (m.type === "safespace") {
            positiveHits += 2;
            score += 1.5;
          } else if (m.type === "incident") {
            negativeHits++;
            score -= 5;
          } else if (m.type === "moderate") {
            negativeHits++;
            score -= 2;
          }
        }
      });
    }

    score = Math.min(100, Math.max(10, Math.round(score)));

    let verdict = "Highly Recommended";
    if (score < 40) verdict = "High Risk - Use Major Roads Only";
    else if (score < 60) verdict = "Caution - Avoid Late Night Travel";
    else if (score < 80) verdict = "Safe Route - Well Monitored";

    return { score, verdict };
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: center,
      zoom: zoom,
      scrollWheelZoom: true,
      minZoom: 4,
      maxZoom: 18,
    });

    mapInstanceRef.current = map;

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // @ts-ignore
    const markersGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      zoomToBoundsOnClick: true,
      maxClusterRadius: (zoom: number) => (zoom > 10 ? 10 : 50),
      disableClusteringAtZoom: 16,
    }).addTo(map);

    layerGroupsRef.current = { markers: markersGroup };

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !waypoints || waypoints.length < 2) {
      if (routingControlRef.current) {
        mapInstanceRef.current?.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
      return;
    }

    if (routingControlRef.current) {
      routingControlRef.current.setWaypoints(waypoints.map(w => L.latLng(w[0], w[1])));
    } else {
      // @ts-ignore
      routingControlRef.current = L.Routing.control({
        waypoints: waypoints.map(w => L.latLng(w[0], w[1])),
        lineOptions: {
          styles: [{ color: '#10b981', weight: 6, opacity: 0.8, className: 'route-line-safe' }],
          extendToWaypoints: true,
          missingRouteTolerance: 10
        },
        showAlternatives: true,
        altLineStyles: [
          { color: '#f59e0b', weight: 5, opacity: 0.7 },
          { color: '#ef4444', weight: 5, opacity: 0.6 }
        ],
        createMarker: () => null, // Hide default routing markers
        addWaypoints: false,
        routeWhileDragging: false,
        // @ts-ignore
        show: false // Hide default description panel
      }).on('routesfound', (e: any) => {
        const results = e.routes.map((route: any) => {
          const { score, verdict } = calculateSafetyScore(route.coordinates);
          return {
            score,
            verdict,
            distance: route.summary.totalDistance / 1000,
            duration: route.summary.totalTime / 60
          };
        });

        if (onRoutesUpdate) {
          onRoutesUpdate(results);
        }
      }).addTo(mapInstanceRef.current!);
    }
  }, [waypoints]);

  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupsRef.current) return;
    const { markers: markersGroup } = layerGroupsRef.current;
    markersGroup.clearLayers();

    const newMarkers: L.Marker[] = [];

    unfilteredMarkers.forEach((marker) => {
      if (!activeFilters.includes(marker.type)) return;
      if (marker.id.startsWith('gen-') && currentZoom < 7) return;

      const icon = createCustomIcon(marker.type);
      const m = L.marker([marker.lat, marker.lng], {
        icon,
        title: marker.title
      });

      m.bindTooltip(marker.title, {
        permanent: false,
        direction: "top",
        className: "font-semibold text-xs border-none shadow-sm rounded-md px-2 py-1"
      });

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
      newMarkers.push(m);
    });

    markersGroup.addLayers(newMarkers);
  }, [activeFilters, unfilteredMarkers, currentZoom]);

  useEffect(() => {
    if (mapInstanceRef.current && !waypoints) {
      mapInstanceRef.current.flyTo(center, zoom, {
        duration: 1.5,
      });
    }
  }, [center, zoom, waypoints]);

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-xl ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export { SafetyMapComponent };
