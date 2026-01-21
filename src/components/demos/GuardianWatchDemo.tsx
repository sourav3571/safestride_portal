import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Battery, Signal, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const GuardianWatchDemo = () => {
    return (
        <div className="w-full max-w-md mx-auto bg-card border rounded-2xl shadow-xl p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm">Guardian Dashboard</h3>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Live Monitoring</Badge>
            </div>

            <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-muted/40 rounded-xl p-4 border relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-3 flex gap-2">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-background/80 px-2 py-1 rounded-full">
                        <Battery className="w-3 h-3 text-green-500" /> 85%
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-background/80 px-2 py-1 rounded-full">
                        <Signal className="w-3 h-3 text-blue-500" /> 4G
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                        <Avatar className="w-14 h-14 border-2 border-primary">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" />
                        </Avatar>
                        <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-background animate-pulse" />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">Priya (Sister)</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> Near Connaught Place
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button size="sm" className="flex-1 h-8 text-xs gradient-bg shadow-sm">View Live Map</Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 shrink-0"><Phone className="w-3 h-3" /></Button>
                </div>
            </motion.div>
        </div>
    );
};

export default GuardianWatchDemo;
