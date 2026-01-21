import { motion } from "framer-motion";
import { Bell, CloudRain, Clock, AlertTriangle } from "lucide-react";

const alerts = [
    { title: "Heavy Rain Expected", desc: "Start trip 10 mins early to avoid congestion.", icon: CloudRain, color: "text-blue-500", time: "Now" },
    { title: "High Crime Zone Ahead", desc: "Rerouting recommended via Main St.", icon: AlertTriangle, color: "text-red-500", time: "2m ago" },
    { title: "Late Night Safety", desc: "Sharing live location with Mom automatically.", icon: Clock, color: "text-purple-500", time: "Automated" },
];

const SmartAlertsDemo = () => {
    return (
        <div className="relative w-full max-w-sm mx-auto">
            {/* Phone Notification Shade Simulation */}
            <div className="space-y-2">
                {alerts.map((alert, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="bg-background/95 backdrop-blur shadow-md rounded-2xl p-3 border flex gap-3"
                    >
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                            <alert.icon className={`w-5 h-5 ${alert.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h4 className="font-semibold text-xs text-foreground truncate">{alert.title}</h4>
                                <span className="text-[10px] text-muted-foreground shrink-0">{alert.time}</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-tight">{alert.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default SmartAlertsDemo;
