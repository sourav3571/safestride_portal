import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, MapPin, AlertTriangle, Shield, Building2, Heart, ChevronLeft, ChevronRight, Maximize2, Navigation, Navigation2, Info, Clock, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MapboxComponent from "@/components/MapboxComponent";
import { markerColors } from "@/components/safetyMapData";
import { indiaMarkers } from "@/components/indiaMarkersData";
import { getIncidentReports, IncidentReport } from "@/lib/firebase";
import { Link } from "react-router-dom";

const legendItems = [
  { type: "safe" as const, icon: Shield, label: "Safe Zone" },
  { type: "moderate" as const, icon: AlertTriangle, label: "Moderate Caution" },
  { type: "incident" as const, icon: AlertTriangle, label: "Reported Incident" },
  { type: "police" as const, icon: Building2, label: "Police Station" },
  { type: "hospital" as const, icon: Heart, label: "Hospital" },
  { type: "safespace" as const, icon: MapPin, label: "Safe Space" },
];

const SafetyMap = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>(legendItems.map(l => l.type));
  const [mapCenter, setMapCenter] = useState({ lat: 19.314962, lng: 84.794090 });
  const [mapZoom, setMapZoom] = useState(12);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<"filter" | "route">("filter");
  const [firebaseIncidents, setFirebaseIncidents] = useState<IncidentReport[]>([]);
  const [isLoadingIncidents, setIsLoadingIncidents] = useState(false);

  // Routing State
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [waypoints, setWaypoints] = useState<{ lat: number; lng: number }[] | undefined>(undefined);
  const [routeData, setRouteData] = useState<{ score: number; distance: number; duration: number; verdict: string } | null>(null);
  const [routeOptions, setRouteOptions] = useState<{ score: number; distance: number; duration: number; verdict: string }[] | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);
  const [routesRender, setRoutesRender] = useState<Array<{ coordinates: [number, number][], color: string; width?: number; opacity?: number }>>([]);
  const [startCoord, setStartCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [endCoord, setEndCoord] = useState<{ lat: number; lng: number } | null>(null);

  // Combine static markers with firebase incidents
  const [combinedMarkers, setCombinedMarkers] = useState(indiaMarkers);

  useEffect(() => {
    if (firebaseIncidents.length > 0) {
      const incidentMarkers = firebaseIncidents.map(inc => ({
        id: inc.id || `inc-${Math.random()}`,
        lat: inc.latitude,
        lng: inc.longitude,
        title: inc.incidentType,
        type: "incident" as const, // Force type to match MapMarker type
        description: inc.description || "Reported via Commmunity"
      }));
      // Merge unique
      setCombinedMarkers([...indiaMarkers, ...incidentMarkers]);
    } else {
      setCombinedMarkers(indiaMarkers);
    }
  }, [firebaseIncidents]);

  // Load Firebase incidents on mount
  useEffect(() => {
    const loadIncidents = async () => {
      setIsLoadingIncidents(true);
      try {
        const incidents = await getIncidentReports();
        setFirebaseIncidents(incidents);
      } catch (error) {
        console.warn("Could not load Firebase incidents:", error);
      } finally {
        setIsLoadingIncidents(false);
      }
    };
    loadIncidents();
  }, []);

  const toggleFilter = (type: string) => {
    setActiveFilters(prev =>
      prev.includes(type)
        ? prev.filter(f => f !== type)
        : [...prev, type]
    );
  };

  const [isLoading, setIsLoading] = useState(false);

  const geocode = async (query: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const local: { [key: string]: { lat: number; lng: number } } = {
        "berhampur": { lat: 19.314962, lng: 84.794090 },
        "brahmapur": { lat: 19.314962, lng: 84.794090 },
        "nist": { lat: 19.2535, lng: 84.8150 },
        "nist university": { lat: 19.2535, lng: 84.8150 },
        "golanthara": { lat: 19.2500, lng: 84.8200 },
        "golonthara": { lat: 19.2500, lng: 84.8200 },
        "palur hills": { lat: 19.2535, lng: 84.8150 },
        "pallur hills": { lat: 19.2535, lng: 84.8150 },
        "mkcg": { lat: 19.3106, lng: 84.8055 },
        "gopalpur": { lat: 19.2586, lng: 84.9052 }
      };
      const key = query.toLowerCase().trim();
      const token = import.meta.env.VITE_MAPBOX_API_KEY as string | undefined;
      if (token) {
        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query + ", Odisha, India")}.json?limit=1&country=IN&proximity=${mapCenter.lng},${mapCenter.lat}&access_token=${token}`);
        const data = await res.json();
        if (data && data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          return { lat, lng };
        }
      }
      if (local[key]) return local[key];

      const marker = indiaMarkers.find(m => m.title.toLowerCase().includes(key));
      if (marker) return { lat: marker.lat, lng: marker.lng };

      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ", India")}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      return null;
    } catch (e) {
      return null;
    }
  };

  // Safety scoring based on nearby markers
  const calculateSafetyScore = (coords: [number, number][]) => {
    let score = 70;
    const step = Math.max(1, Math.floor(coords.length / 50));
    for (let i = 0; i < coords.length; i += step) {
      const [lng, lat] = coords[i];
      indiaMarkers.forEach((m) => {
        const dist = Math.sqrt(Math.pow(lat - m.lat, 2) + Math.pow(lng - m.lng, 2));
        if (dist < 0.005) {
          if (["safe", "police", "hospital"].includes(m.type)) score += 0.5;
          else if (m.type === "safespace") score += 1.5;
          else if (m.type === "incident") score -= 5;
          else if (m.type === "moderate") score -= 2;
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

  const getColorForScore = (score: number) => (score > 80 ? "#10b981" : score > 50 ? "#f59e0b" : "#ef4444");

  const handleRouteSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !destination) return;
    setIsLoading(true);
    const start = await geocode(source);
    const end = await geocode(destination);
    if (start && end) {
      setStartCoord(start);
      setEndCoord(end);
      const token = import.meta.env.VITE_MAPBOX_API_KEY as string | undefined;
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?alternatives=true&overview=full&geometries=geojson&access_token=${token}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data && data.routes && data.routes.length > 0) {
          const options = data.routes.map((r: any) => {
            const coords = r.geometry.coordinates as [number, number][];
            const s = calculateSafetyScore(coords);
            return {
              ...s,
              distance: r.distance / 1000,
              duration: r.duration / 60,
            };
          });
          setRouteOptions(options);
          let bestIndex = 0;
          for (let i = 1; i < options.length; i++) {
            if (options[i].score > options[bestIndex].score) bestIndex = i;
          }
          setSelectedRouteIndex(bestIndex);
          setRouteData(options[bestIndex]);
          const routesToRender = data.routes.map((r: any, idx: number) => {
            const coords = r.geometry.coordinates as [number, number][];
            const color = getColorForScore(options[idx].score);
            return {
              coordinates: coords,
              color,
              width: idx === bestIndex ? 6 : 4,
              opacity: idx === bestIndex ? 0.9 : 0.7,
            };
          });
          setRoutesRender(routesToRender);
        }
      } catch (err) {
        // ignore for now, UI will remain unchanged
      }
    }
    setIsLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    if (!query) return;
    setIsLoading(true);
    const pos = await geocode(query);
    if (pos) {
      setMapCenter(pos);
      setMapZoom(13);
    }
    setIsLoading(false);
  };

  const clearRoute = () => {
    setWaypoints(undefined);
    setRouteData(null);
    setRouteOptions(null);
    setSelectedRouteIndex(null);
    setRoutesRender([]);
    setSource("");
    setDestination("");
    setStartCoord(null);
    setEndCoord(null);
  };

  return (
    <div className="pt-20 min-h-screen bg-muted/30 overflow-hidden">
      <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)] relative">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {!isSidebarCollapsed && (
            <motion.div
              initial={{ width: 0, opacity: 0, x: -50 }}
              animate={{ width: "auto", opacity: 1, x: 0 }}
              exit={{ width: 0, opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full lg:w-80 glass-card border-r overflow-hidden z-10 flex-shrink-0"
            >
              <div className="w-80 p-6 overflow-y-auto h-full">
                {/* View Mode Tabs */}
                <div className="flex p-1 bg-muted/50 rounded-xl mb-6 border border-primary/10">
                  <button
                    onClick={() => setViewMode("filter")}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${viewMode === "filter" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                  <button
                    onClick={() => setViewMode("route")}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${viewMode === "route" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Route className="w-4 h-4" />
                    Directions
                  </button>
                </div>

                <div className="space-y-6">
                  {viewMode === "filter" ? (
                    <>
                      {/* Search */}
                      <div>
                        <h2 className="text-lg font-bold tracking-tight text-foreground mb-3 font-display">Search Location</h2>
                        <form onSubmit={handleSearch} className="relative">
                          {isLoading ? (
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                          ) : (
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                          )}
                          <Input
                            placeholder="City, town or landmark..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-white/50 border-primary/20 focus:border-primary transition-all rounded-xl"
                            disabled={isLoading}
                          />
                        </form>
                      </div>

                      {/* Filters */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Filter className="w-4 h-4 text-primary" />
                          <h2 className="text-lg font-bold tracking-tight text-foreground font-display">Safety Layers</h2>
                        </div>
                        <div className="space-y-2">
                          {legendItems.map((item) => (
                            <button
                              key={item.type}
                              onClick={() => toggleFilter(item.type)}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${activeFilters.includes(item.type)
                                ? "bg-primary/10 border-primary/20 border shadow-sm"
                                : "bg-muted/30 border border-transparent hover:bg-muted/50"
                                }`}
                            >
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm"
                                style={{ backgroundColor: markerColors[item.type] }}
                              >
                                <item.icon className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors text-left flex-1">
                                {item.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-6">
                      {/* Directions UI */}
                      <div>
                        <h2 className="text-lg font-bold tracking-tight text-foreground mb-3 font-display">Safest Route</h2>
                        <form onSubmit={handleRouteSearch} className="space-y-3">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">📍</span>
                            <Input
                              placeholder="Starting point..."
                              value={source}
                              onChange={(e) => setSource(e.target.value)}
                              className="pl-10 bg-white/50 border-primary/20 rounded-xl"
                            />
                          </div>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">🏁</span>
                            <Input
                              placeholder="Destination..."
                              value={destination}
                              onChange={(e) => setDestination(e.target.value)}
                              className="pl-10 bg-white/50 border-primary/20 rounded-xl"
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full rounded-xl gradient-bg shadow-md"
                            disabled={isLoading || !source || !destination}
                          >
                            {isLoading ? "Calculating..." : "Find Safest Route"}
                          </Button>
                          {waypoints && (
                            <Button variant="ghost" onClick={clearRoute} className="w-full text-xs text-muted-foreground">
                              Clear Route
                            </Button>
                          )}
                        </form>
                      </div>

                      {/* Route Options and Scores */}
                      {routeOptions && routeOptions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-2xl bg-white border border-primary/10 shadow-lg space-y-4"
                        >
                          <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            <span className="font-bold text-foreground">Route Safety Comparison</span>
                          </div>

                          <div className="grid gap-3">
                            {routeOptions.map((opt, idx) => {
                              const tag = String.fromCharCode(65 + idx); // A, B, C...
                              const isSelected = selectedRouteIndex === idx;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setSelectedRouteIndex(idx);
                                    setRouteData(opt);
                                  }}
                                  className={`w-full text-left p-3 rounded-xl border transition-all ${isSelected ? "border-primary bg-primary/5" : "border-muted bg-muted/30 hover:bg-muted/50"}`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-primary/10 text-primary">Route {tag}</span>
                                      <span className="text-sm font-semibold text-foreground">{opt.verdict}</span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${opt.score > 80 ? "bg-emerald-100 text-emerald-700" :
                                      opt.score > 50 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                                      }`}>
                                      {opt.score}%
                                    </div>
                                  </div>
                                  <div className="mt-2 text-xs text-muted-foreground flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                      <Route className="w-3 h-3" /> {opt.distance.toFixed(1)} km
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" /> {Math.round(opt.duration)} min
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                      {/* Selected Route Summary */}
                      {routeData && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-2xl bg-white border border-primary/10 shadow-lg space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Shield className="w-5 h-5 text-primary" />
                              <span className="font-bold text-foreground">Safety Score</span>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${routeData.score > 80 ? "bg-emerald-100 text-emerald-700" :
                              routeData.score > 50 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                              }`}>
                              {routeData.score}%
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-2xl font-black text-foreground font-display">
                              {routeData.verdict}
                            </div>
                            <p className="text-xs text-muted-foreground">Based on local safety hubs & incidents</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="p-3 bg-muted/40 rounded-xl">
                              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                <Route className="w-3 h-3" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Distance</span>
                              </div>
                              <span className="text-lg font-bold text-foreground">{routeData.distance.toFixed(1)} km</span>
                            </div>
                            <div className="p-3 bg-muted/40 rounded-xl">
                              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                <Clock className="w-3 h-3" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Time</span>
                              </div>
                              <span className="text-lg font-bold text-foreground">{Math.round(routeData.duration)} min</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Status Footer */}
                  <div className="pt-4 mt-4 border-t border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Live Safety Engine</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      SafeStride AI is monitoring your selected path for real-time safety updates.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Sidebar Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute left-4 top-4 z-20 bg-white/80 backdrop-blur-sm border-primary/20 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all hidden lg:flex"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4 text-primary" /> : <ChevronLeft className="w-4 h-4 text-primary" />}
        </Button>

        {/* Route Info Badge (when sidebar collapsed) */}
        {isSidebarCollapsed && routeData && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-16 top-4 z-20 hidden lg:flex items-center gap-3 px-4 py-2 bg-emerald-500 backdrop-blur-md rounded-2xl shadow-lg border border-white/20"
          >
            <Shield className="w-4 h-4 text-white" />
            <span className="text-sm font-bold text-white font-display">Safety Score: {routeData.score}%</span>
          </motion.div>
        )}

        {/* Map */}
        <div className="flex-1 relative h-full">
          <MapboxComponent
            className="h-full w-full rounded-none"
            markers={combinedMarkers}
            activeFilters={activeFilters}
            center={mapCenter}
            zoom={mapZoom}
            routes={routesRender}
            startMarker={startCoord}
            endMarker={endCoord}
          />
          {isLoadingIncidents && (
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-white/90 rounded-lg shadow-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600">Loading incidents...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SafetyMap;
