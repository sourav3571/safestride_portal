import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, MapPin, AlertTriangle, Shield, Building2, Heart, ChevronLeft, ChevronRight, Maximize2, Navigation, Navigation2, Info, Clock, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SafetyMapComponent } from "@/components/SafetyMapComponent";
import { markerColors } from "@/components/safetyMapData";
import { indiaMarkers } from "@/components/indiaMarkersData";
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
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<"filter" | "route">("filter");

  // Routing State
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [waypoints, setWaypoints] = useState<[number, number][] | undefined>(undefined);
  const [routeData, setRouteData] = useState<{ score: number; distance: number; duration: number; verdict: string } | null>(null);

  const toggleFilter = (type: string) => {
    setActiveFilters(prev =>
      prev.includes(type)
        ? prev.filter(f => f !== type)
        : [...prev, type]
    );
  };

  const [isLoading, setIsLoading] = useState(false);

  const geocode = async (query: string): Promise<[number, number] | null> => {
    try {
      // 1. Check local city coords first
      const cityCoords: { [key: string]: [number, number] } = {
        "mumbai": [19.0760, 72.8777], "delhi": [28.6139, 77.2090], "bangalore": [12.9716, 77.5946],
        "chennai": [13.0827, 80.2707], "kolkata": [22.5726, 88.3639], "hyderabad": [17.3850, 78.4867],
        "pune": [18.5204, 73.8567], "kochi": [9.9312, 76.2673], "ahmedabad": [23.0225, 72.5714]
      };
      if (cityCoords[query.toLowerCase().trim()]) return cityCoords[query.toLowerCase().trim()];

      // 2. Search in markers
      const marker = indiaMarkers.find(m => m.title.toLowerCase().includes(query.toLowerCase()));
      if (marker) return [marker.lat, marker.lng];

      // 3. Nominatim
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ", India")}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      return null;
    } catch (e) {
      return null;
    }
  };

  const handleRouteSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !destination) return;
    setIsLoading(true);
    const start = await geocode(source);
    const end = await geocode(destination);
    if (start && end) {
      setWaypoints([start, end]);
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
    setSource("");
    setDestination("");
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
                            <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                            <Input
                              placeholder="Starting point..."
                              value={source}
                              onChange={(e) => setSource(e.target.value)}
                              className="pl-10 bg-white/50 border-primary/20 rounded-xl"
                            />
                          </div>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
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

                      {/* Route Score Results */}
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
          <SafetyMapComponent
            className="h-full w-full rounded-none"
            activeFilters={activeFilters}
            center={mapCenter}
            zoom={mapZoom}
            waypoints={waypoints}
            onRouteUpdate={setRouteData}
          />
        </div>
      </div>
    </div>
  );
};

export default SafetyMap;
