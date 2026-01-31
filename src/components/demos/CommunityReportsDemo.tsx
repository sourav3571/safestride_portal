import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, MapPin, AlertTriangle, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, type DocumentData, type Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CommunityReportsDemo = () => {
    const [reports, setReports] = useState<Array<{
        id: string;
        incidentType: string;
        location: string;
        severity: "low" | "medium" | "high" | "critical";
        createdAt?: { seconds: number; nanoseconds: number } | null;
    }>>([]);

    useEffect(() => {
        const q = query(collection(db, "incidentReports"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map((doc) => {
                const data: DocumentData = doc.data();
                const incidentType = typeof data.incidentType === "string" ? data.incidentType : "Report";
                const location = typeof data.location === "string" ? data.location : "Unknown";
                const sevRaw = typeof data.severity === "string" ? data.severity : "low";
                const severity = ["low","medium","high","critical"].includes(sevRaw) ? (sevRaw as "low"|"medium"|"high"|"critical") : "low";
                const createdAt = (data.createdAt ?? null) as Timestamp | null;
                return {
                    id: doc.id,
                    incidentType,
                    location,
                    severity,
                    createdAt,
                };
            });
            setReports(items);
        }, (_err) => {
            setReports([]);
        });
        return () => unsub();
    }, []);

    const getIconForType = (type: string) => {
        const t = type.toLowerCase();
        if (t.includes("safe")) return Shield;
        if (t.includes("light") || t.includes("hazard")) return AlertTriangle;
        return Shield;
    };

    const getColorsForSeverity = (severity: string) => {
        switch (severity) {
            case "critical":
                return { color: "text-red-600", bg: "bg-red-100" };
            case "high":
                return { color: "text-orange-600", bg: "bg-orange-100" };
            case "medium":
                return { color: "text-yellow-600", bg: "bg-yellow-100" };
            default:
                return { color: "text-green-600", bg: "bg-green-100" };
        }
    };

    const timeAgo = (createdAt?: Timestamp | null) => {
        if (!createdAt?.seconds) return "just now";
        const diffMs = Date.now() - createdAt.seconds * 1000;
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) return "just now";
        if (diffMin < 60) return `${diffMin} mins ago`;
        const diffHr = Math.floor(diffMin / 60);
        if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
        const diffDay = Math.floor(diffHr / 24);
        return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
    };
    return (
        <div className="w-full max-w-md mx-auto bg-card border rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 bg-muted/30 border-b flex justify-between items-center">
                <h3 className="font-semibold text-sm">Live Community Feed</h3>
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <Avatar key={i} className="w-6 h-6 border-2 border-background">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} />
                        </Avatar>
                    ))}
                    <div className="w-6 h-6 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center border-2 border-background font-bold">+42</div>
                </div>
            </div>

            <div className="p-4 space-y-3">
                {reports.map((report, i) => {
                    const icon = getIconForType(report.incidentType);
                    const { color, bg } = getColorsForSeverity(report.severity);
                    return (
                    <motion.div
                        key={report.id ?? i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors border shadow-sm"
                    >
                        <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                            <icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm">{report.incidentType}</h4>
                                <span className="text-[10px] text-muted-foreground">{timeAgo(report.createdAt ?? null)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" /> {report.location}
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center px-2 border-l">
                            <ThumbsUp className="w-3 h-3 text-muted-foreground mb-1" />
                            <span className="text-xs font-bold">0</span>
                        </div>
                    </motion.div>
                )})}
            </div>

            <div className="p-4 border-t bg-muted/10">
                <Button className="w-full text-xs h-8" variant="outline">View All Reports</Button>
            </div>
        </div>
    );
};

export default CommunityReportsDemo;
