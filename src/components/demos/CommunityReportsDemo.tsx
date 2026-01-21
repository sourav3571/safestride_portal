import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, MapPin, AlertTriangle, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CommunityReportsDemo = () => {
    const reports = [
        { type: "Safe Zone", location: "Central Metro Station", time: "2 mins ago", votes: 12, icon: Shield, color: "text-green-500", bg: "bg-green-100" },
        { type: "Street Light Broken", location: "Sector 14 Road", time: "15 mins ago", votes: 5, icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-100" },
        { type: "Police Patrol Area", location: "Main Market", time: "1 hour ago", votes: 24, icon: Shield, color: "text-blue-500", bg: "bg-blue-100" },
    ];
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
                {reports.map((report, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors border shadow-sm"
                    >
                        <div className={`w-10 h-10 rounded-full ${report.bg} flex items-center justify-center shrink-0`}>
                            <report.icon className={`w-5 h-5 ${report.color}`} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm">{report.type}</h4>
                                <span className="text-[10px] text-muted-foreground">{report.time}</span>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" /> {report.location}
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center px-2 border-l">
                            <ThumbsUp className="w-3 h-3 text-muted-foreground mb-1" />
                            <span className="text-xs font-bold">{report.votes}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-4 border-t bg-muted/10">
                <Button className="w-full text-xs h-8" variant="outline">View All Reports</Button>
            </div>
        </div>
    );
};

export default CommunityReportsDemo;
