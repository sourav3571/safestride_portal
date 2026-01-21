import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Wifi, WifiOff, MessageSquare, Send, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const OfflineModeDemo = () => {
    const [isOffline, setIsOffline] = useState(false);

    return (
        <div className="w-full max-w-4xl mx-auto bg-card border rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[400px]">
            {/* Control Panel */}
            <div className="md:w-1/3 p-6 border-r flex flex-col justify-between bg-muted/10">
                <div>
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                        {isOffline ? <WifiOff className="text-destructive h-5 w-5" /> : <Wifi className="text-green-500 h-5 w-5" />}
                        {isOffline ? "Offline Mode" : "Online"}
                    </h3>

                    <div className="flex items-center justify-between p-4 bg-background border rounded-xl shadow-sm mb-4">
                        <span className="text-sm font-medium">Simulate Network Loss</span>
                        <Switch checked={isOffline} onCheckedChange={setIsOffline} />
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Toggle to see how SafeStride automatically switches to SMS emergency protocol when data is unavailable.
                    </p>
                </div>

                <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-xs">
                    <span className="font-bold block mb-1">Did you know?</span>
                    SMS location data is compressed to just 140 bytes to ensure delivery even in 2G networks.
                </div>
            </div>

            {/* Simulation Area */}
            <div className="flex-1 relative bg-slate-50 dark:bg-slate-900 p-8 flex items-center justify-center">
                {!isOffline ? (
                    <div className="text-center space-y-4">
                        <div className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                            <Wifi className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold">System Connected</h2>
                        <p className="text-muted-foreground">GPS and Data services functioning normally.</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-[300px] bg-white dark:bg-slate-800 rounded-xl shadow-lg border overflow-hidden"
                    >
                        <div className="bg-slate-900 text-white p-3 text-sm font-medium flex justify-between items-center">
                            <span>Messages</span>
                            <span className="text-xs bg-slate-700 px-2 py-0.5 rounded">Now</span>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex gap-2 justify-end">
                                <div className="bg-blue-500 text-white p-2 text-sm rounded-2xl rounded-tr-sm max-w-[85%]">
                                    <p className="font-mono text-xs opacity-70 mb-1">SOS-AUTO-SMS</p>
                                    HELP! I am at Lat: 28.6139, Long: 77.2090. Battery: 15%.
                                    <div className="flex items-center gap-1 mt-1 text-[10px] opacity-80">
                                        <Send className="w-3 h-3" /> Sent via SMS
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <div className="bg-gray-100 dark:bg-slate-700 p-2 text-sm rounded-2xl rounded-tl-sm max-w-[85%]">
                                    <p className="font-bold text-xs mb-1">Safety Cloud</p>
                                    Location received. Offline maps link generated for guardians.
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default OfflineModeDemo;
