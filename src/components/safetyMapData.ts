export interface MapMarker {
    id: string;
    lat: number;
    lng: number;
    type: "safe" | "moderate" | "incident" | "police" | "hospital" | "safespace" | "cctv" | "lighting" | "transport";
    title: string;
    description?: string;
}

export const markerColors = {
    safe: "#10B981",
    moderate: "#F59E0B",
    incident: "#DC2626",
    police: "#3B82F6",
    hospital: "#EF4444",
    safespace: "#8B5CF6",
    cctv: "#64748b",
    lighting: "#facc15",
    transport: "#0ea5e9",
};

export const markerLabels = {
    safe: "Safe Zone",
    moderate: "Moderate Caution",
    incident: "Reported Incident",
    police: "Police Station",
    hospital: "Hospital",
    safespace: "Safe Space",
    cctv: "CCTV Zone",
    lighting: "Well Lit Path",
    transport: "Public Transport",
};
