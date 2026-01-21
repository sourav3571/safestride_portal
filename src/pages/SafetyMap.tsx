import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MapPin, AlertTriangle, Shield, Building2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SafetyMapComponent } from "@/components/SafetyMapComponent";
import { markerColors, markerLabels, MapMarker } from "@/components/safetyMapData";
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

  const toggleFilter = (type: string) => {
    setActiveFilters(prev =>
      prev.includes(type)
        ? prev.filter(f => f !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="pt-20 min-h-screen bg-muted/30">
      <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)]">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-80 bg-card border-r p-6 overflow-y-auto"
        >
          <div className="space-y-6">
            {/* Search */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Search Location</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Enter a location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">Filters</h2>
              </div>
              <div className="space-y-2">
                {legendItems.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => toggleFilter(item.type)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeFilters.includes(item.type)
                      ? "bg-primary/10 border-primary/20 border"
                      : "bg-muted/50 border border-transparent"
                      }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: markerColors[item.type] }}
                    />
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="pt-6 border-t">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">LEGEND</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-muted-foreground">Score 70-100: Safe</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-muted-foreground">Score 40-69: Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">Score 0-39: Caution</span>
                </div>
              </div>
            </div>

            {/* Report Button */}
            <Link to="/report" className="block">
              <Button className="w-full gradient-bg">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report an Issue
              </Button>
            </Link>

            {/* Note */}
            <p className="text-xs text-muted-foreground">
              This is a demo map with sample data. Download the app for full features and real-time data.
            </p>
          </div>
        </motion.div>

        {/* Map */}
        <div className="flex-1 relative">
          <SafetyMapComponent className="h-full w-full rounded-none" />

          {/* Mobile legend overlay */}
          <div className="lg:hidden absolute bottom-4 left-4 right-4">
            <div className="glass-card rounded-xl p-4">
              <div className="flex flex-wrap gap-3">
                {legendItems.slice(0, 3).map((item) => (
                  <div key={item.type} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: markerColors[item.type] }}
                    />
                    <span className="text-xs text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyMap;
