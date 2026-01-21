import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Share2, MapPin, CheckCircle2, Navigation, User } from "lucide-react";
import { toast } from "sonner";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons by using online sources to avoid build issues with image imports
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconShadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";


interface DemoProps {
    forceActive?: boolean;
}

const TripSharingDemo = ({ forceActive = false }: DemoProps) => {
    const contacts = [
        { name: "Mom", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mom", status: "Watching" },
        { name: "Rahul (Brother)", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul", status: "Notified" },
        { name: "Priya (Friend)", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", status: "Online" },
    ];

    const route = [
        [28.6139, 77.2090], // New Delhi
        [28.6129, 77.2110],
        [28.6119, 77.2130],
        [28.6109, 77.2150],
        [28.6100, 77.2170], // Destination
    ];
    const [isSharing, setIsSharing] = useState(false);
    const [currentPos, setCurrentPos] = useState(0);

    // Fix Leaflet icon on mount
    useEffect(() => {
        const DefaultIcon = L.icon({
            iconUrl: iconUrl,
            shadowUrl: iconShadowUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41]
        });
        L.Marker.prototype.options.icon = DefaultIcon;
    }, []);

    // React to global force active prop
    useEffect(() => {
        if (forceActive && !isSharing) {
            handleStartTrip();
        } else if (!forceActive && isSharing) {
            // Optional: Stop sharing if global switch turns off? 
            // For now let's keep it manual stop or auto trip completion
            setIsSharing(false);
        }
    }, [forceActive]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isSharing) {
            interval = setInterval(() => {
                setCurrentPos(prev => {
                    if (prev >= route.length - 1) {
                        setIsSharing(false);
                        toast.success("Trip completed! Notification sent to contacts.");
                        return 0;
                    }
                    return prev + 1;
                });
            }, 2000);
        } else {
            setCurrentPos(0);
        }
        return () => clearInterval(interval);
    }, [isSharing]);

    const handleStartTrip = () => {
        setIsSharing(true);
        toast("Trip started! Live location shared with 3 contacts.");
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-card border rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[500px]">
            {/* Sidebar Controls */}
            <div className="md:w-1/3 p-6 flex flex-col border-r bg-muted/30">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-glow">
                        <Share2 className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Trip Sharing</h3>
                        <p className="text-xs text-muted-foreground">Real-time monitoring</p>
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Trusted Contacts</label>
                        <div className="space-y-2">
                            {contacts.map((contact, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-background border shadow-sm">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={contact.image} />
                                        <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{contact.name}</p>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${isSharing ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                                            <p className="text-xs text-muted-foreground">{isSharing ? contact.status : "Offline"}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    {!isSharing ? (
                        <Button
                            className="w-full gradient-bg shadow-glow hover:opacity-90"
                            onClick={handleStartTrip}
                        >
                            <Navigation className="w-4 h-4 mr-2" />
                            Start Simulated Trip
                        </Button>
                    ) : (
                        <Button
                            variant="destructive"
                            className="w-full"
                            onClick={() => {
                                setIsSharing(false);
                                toast.info("Trip sharing stopped.");
                            }}
                        >
                            Stop Sharing
                        </Button>
                    )}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative bg-gray-100 dark:bg-gray-800">
                {/* Note: In a real app we'd load the map script properly. For demo simplicity assuming Leaflet works or showing placeholder */}
                <MapContainer center={[28.6120, 77.2130]} zoom={15} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Polyline positions={route as any} color="#ec4899" weight={4} dashArray="10, 10" opacity={0.5} />

                    {isSharing && (
                        <Marker position={route[currentPos] as any}>
                            <Popup>
                                <div className="text-center">
                                    <p className="font-bold text-sm">You are here</p>
                                    <p className="text-xs text-muted-foreground">Updated just now</p>
                                </div>
                            </Popup>
                        </Marker>
                    )}
                    <Marker position={route[route.length - 1] as any}>
                        <Popup>Destination</Popup>
                    </Marker>
                </MapContainer>

                {/* Live Status Overlay */}
                <AnimatePresence>
                    {isSharing && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-md p-4 rounded-xl border shadow-lg z-[1000]"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <div>
                                        <p className="text-sm font-semibold">Live Location Active</p>
                                        <p className="text-xs text-muted-foreground">Updates sent every 30s</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-medium text-primary">ETA</p>
                                    <p className="text-sm font-bold">~5 mins</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TripSharingDemo;
