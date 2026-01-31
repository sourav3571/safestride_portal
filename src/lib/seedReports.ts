
import { saveIncidentReport } from "@/lib/firebase";

export const seedCommunityReports = async () => {
    try {
        await saveIncidentReport({
            incidentType: "Suspicious Activity",
            location: "Main Street, Sector 4",
            latitude: 28.6139,
            longitude: 77.2090,
            severity: "medium",
            description: "Group of people loitering late at night.",
            isAnonymous: true
        });
        await saveIncidentReport({
            incidentType: "Street Light Broken",
            location: "Park Avenue",
            latitude: 28.6129,
            longitude: 77.2110,
            severity: "low",
            description: "Dark area due to broken lights.",
            isAnonymous: false
        });
        await saveIncidentReport({
            incidentType: "Harassment",
            location: "Metro Station Exit 2",
            latitude: 28.6119,
            longitude: 77.2130,
            severity: "high",
            description: "Verbal harassment reported.",
            isAnonymous: true
        });
        console.log("Seeded basic reports");
        return true;
    } catch (e) {
        console.error("Seeding failed", e);
        return false;
    }
};
