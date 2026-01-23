// India regions with safety scores and GeoJSON-style polygon coordinates
// Color-coded: Green (safe: 70-100), Yellow (moderate: 40-69), Red (caution: 0-39)

export interface IndiaRegion {
    id: string;
    name: string;
    safetyScore: number;
    coordinates: [number, number][][]; // [lng, lat] pairs for polygon
    info: string;
}

// Define major regions of India with simplified polygon coordinates
export const indiaRegions: IndiaRegion[] = [
    // Northern States - Mix of safety levels
    {
        id: "delhi",
        name: "Delhi NCR",
        safetyScore: 65,
        coordinates: [[[76.8, 28.4], [77.4, 28.4], [77.4, 28.9], [76.8, 28.9], [76.8, 28.4]]],
        info: "Capital region - Moderate safety with high police presence"
    },
    {
        id: "punjab",
        name: "Punjab",
        safetyScore: 72,
        coordinates: [[[73.8, 29.5], [76.8, 29.5], [76.8, 32.5], [73.8, 32.5], [73.8, 29.5]]],
        info: "Generally safe with active community policing"
    },
    {
        id: "haryana",
        name: "Haryana",
        safetyScore: 55,
        coordinates: [[[74.5, 27.6], [77.3, 27.6], [77.3, 30.3], [74.5, 30.3], [74.5, 27.6]]],
        info: "Moderate caution advised in some areas"
    },
    {
        id: "rajasthan",
        name: "Rajasthan",
        safetyScore: 68,
        coordinates: [[[69.5, 23.0], [76.5, 23.0], [76.5, 30.2], [69.5, 30.2], [69.5, 23.0]]],
        info: "Tourist areas well-patrolled, rural areas need caution"
    },
    {
        id: "uttarpradesh",
        name: "Uttar Pradesh",
        safetyScore: 45,
        coordinates: [[[77.0, 23.5], [84.5, 23.5], [84.5, 30.5], [77.0, 30.5], [77.0, 23.5]]],
        info: "Large state with varying safety levels by district"
    },
    {
        id: "uttarakhand",
        name: "Uttarakhand",
        safetyScore: 78,
        coordinates: [[[77.5, 29.0], [81.0, 29.0], [81.0, 31.5], [77.5, 31.5], [77.5, 29.0]]],
        info: "Hill state with good safety in tourist areas"
    },
    {
        id: "himachalpradesh",
        name: "Himachal Pradesh",
        safetyScore: 82,
        coordinates: [[[75.5, 30.5], [79.0, 30.5], [79.0, 33.2], [75.5, 33.2], [75.5, 30.5]]],
        info: "Very safe hill region with low crime rates"
    },
    {
        id: "jk",
        name: "Jammu & Kashmir",
        safetyScore: 38,
        coordinates: [[[73.5, 32.5], [80.0, 32.5], [80.0, 37.0], [73.5, 37.0], [73.5, 32.5]]],
        info: "Exercise caution, check travel advisories"
    },

    // Western States
    {
        id: "gujarat",
        name: "Gujarat",
        safetyScore: 75,
        coordinates: [[[68.0, 20.0], [74.5, 20.0], [74.5, 24.5], [68.0, 24.5], [68.0, 20.0]]],
        info: "Safe industrial state with good infrastructure"
    },
    {
        id: "maharashtra",
        name: "Maharashtra",
        safetyScore: 62,
        coordinates: [[[72.5, 15.5], [80.5, 15.5], [80.5, 22.0], [72.5, 22.0], [72.5, 15.5]]],
        info: "Major cities generally safe, varied conditions elsewhere"
    },
    {
        id: "goa",
        name: "Goa",
        safetyScore: 80,
        coordinates: [[[73.5, 14.8], [74.5, 14.8], [74.5, 15.8], [73.5, 15.8], [73.5, 14.8]]],
        info: "Tourist-friendly with active police presence"
    },

    // Southern States
    {
        id: "karnataka",
        name: "Karnataka",
        safetyScore: 70,
        coordinates: [[[74.0, 11.5], [78.5, 11.5], [78.5, 18.5], [74.0, 18.5], [74.0, 11.5]]],
        info: "IT hub with generally good safety standards"
    },
    {
        id: "kerala",
        name: "Kerala",
        safetyScore: 85,
        coordinates: [[[74.5, 8.0], [77.5, 8.0], [77.5, 12.8], [74.5, 12.8], [74.5, 8.0]]],
        info: "High literacy state with excellent safety record"
    },
    {
        id: "tamilnadu",
        name: "Tamil Nadu",
        safetyScore: 72,
        coordinates: [[[76.0, 8.0], [80.5, 8.0], [80.5, 13.5], [76.0, 13.5], [76.0, 8.0]]],
        info: "Well-developed state with good safety infrastructure"
    },
    {
        id: "andhra",
        name: "Andhra Pradesh",
        safetyScore: 65,
        coordinates: [[[76.5, 12.5], [84.5, 12.5], [84.5, 19.5], [76.5, 19.5], [76.5, 12.5]]],
        info: "Developing state with improving safety measures"
    },
    {
        id: "telangana",
        name: "Telangana",
        safetyScore: 68,
        coordinates: [[[77.0, 15.5], [81.5, 15.5], [81.5, 19.5], [77.0, 19.5], [77.0, 15.5]]],
        info: "IT corridor with modern safety systems"
    },

    // Eastern States
    {
        id: "westbengal",
        name: "West Bengal",
        safetyScore: 55,
        coordinates: [[[85.5, 21.5], [89.0, 21.5], [89.0, 27.2], [85.5, 27.2], [85.5, 21.5]]],
        info: "Metro areas safe, varying conditions in rural areas"
    },
    {
        id: "odisha",
        name: "Odisha",
        safetyScore: 60,
        coordinates: [[[81.5, 17.5], [87.5, 17.5], [87.5, 22.5], [81.5, 22.5], [81.5, 17.5]]],
        info: "Coastal state with moderate safety levels"
    },
    {
        id: "bihar",
        name: "Bihar",
        safetyScore: 35,
        coordinates: [[[83.0, 24.5], [88.5, 24.5], [88.5, 27.5], [83.0, 27.5], [83.0, 24.5]]],
        info: "Exercise caution, improving safety measures"
    },
    {
        id: "jharkhand",
        name: "Jharkhand",
        safetyScore: 42,
        coordinates: [[[83.5, 21.8], [87.8, 21.8], [87.8, 25.2], [83.5, 25.2], [83.5, 21.8]]],
        info: "Mineral-rich state, caution in remote areas"
    },

    // Central States
    {
        id: "madhyapradesh",
        name: "Madhya Pradesh",
        safetyScore: 58,
        coordinates: [[[74.0, 21.0], [82.5, 21.0], [82.5, 26.8], [74.0, 26.8], [74.0, 21.0]]],
        info: "Large central state with varied safety conditions"
    },
    {
        id: "chhattisgarh",
        name: "Chhattisgarh",
        safetyScore: 40,
        coordinates: [[[80.0, 17.5], [84.5, 17.5], [84.5, 24.0], [80.0, 24.0], [80.0, 17.5]]],
        info: "Caution advised in some regions"
    },

    // Northeast States
    {
        id: "assam",
        name: "Assam",
        safetyScore: 52,
        coordinates: [[[89.5, 24.0], [96.0, 24.0], [96.0, 28.0], [89.5, 28.0], [89.5, 24.0]]],
        info: "Gateway to Northeast, moderate safety"
    },
    {
        id: "sikkim",
        name: "Sikkim",
        safetyScore: 88,
        coordinates: [[[88.0, 27.0], [89.0, 27.0], [89.0, 28.2], [88.0, 28.2], [88.0, 27.0]]],
        info: "Very safe hill state with excellent tourism infrastructure"
    },
    {
        id: "meghalaya",
        name: "Meghalaya",
        safetyScore: 75,
        coordinates: [[[89.8, 25.0], [92.8, 25.0], [92.8, 26.2], [89.8, 26.2], [89.8, 25.0]]],
        info: "Hill state with good safety for tourists"
    },
    {
        id: "arunachal",
        name: "Arunachal Pradesh",
        safetyScore: 70,
        coordinates: [[[91.5, 26.5], [97.5, 26.5], [97.5, 29.5], [91.5, 29.5], [91.5, 26.5]]],
        info: "Frontier state, permits required for entry"
    },
    {
        id: "mizoram",
        name: "Mizoram",
        safetyScore: 85,
        coordinates: [[[92.2, 21.9], [93.5, 21.9], [93.5, 24.5], [92.2, 24.5], [92.2, 21.9]]],
        info: "Peaceful state with very low crime rate"
    },
    {
        id: "manipur",
        name: "Manipur",
        safetyScore: 38,
        coordinates: [[[93.0, 23.8], [94.8, 23.8], [94.8, 25.8], [93.0, 25.8], [93.0, 23.8]]],
        info: "Exercise caution, check current advisories"
    },
    {
        id: "nagaland",
        name: "Nagaland",
        safetyScore: 55,
        coordinates: [[[93.3, 25.2], [95.3, 25.2], [95.3, 27.0], [93.3, 27.0], [93.3, 25.2]]],
        info: "Improving safety, tourist areas generally safe"
    },
    {
        id: "tripura",
        name: "Tripura",
        safetyScore: 65,
        coordinates: [[[91.0, 22.9], [92.3, 22.9], [92.3, 24.5], [91.0, 24.5], [91.0, 22.9]]],
        info: "Small state with moderate safety levels"
    }
];

// Helper function to get color based on safety score
export const getSafetyColor = (score: number): string => {
    if (score >= 70) return "#10B981"; // Green - Safe
    if (score >= 40) return "#F59E0B"; // Yellow/Amber - Moderate
    return "#DC2626"; // Red - Caution
};

// Helper function to get opacity based on safety score
export const getSafetyOpacity = (score: number): number => {
    if (score >= 70) return 0.4;
    if (score >= 40) return 0.5;
    return 0.6;
};

// Convert to GeoJSON format for Leaflet
export const getRegionGeoJSON = (region: IndiaRegion) => {
    return {
        type: "Feature" as const,
        properties: {
            id: region.id,
            name: region.name,
            safetyScore: region.safetyScore,
            info: region.info
        },
        geometry: {
            type: "Polygon" as const,
            coordinates: region.coordinates
        }
    };
};
