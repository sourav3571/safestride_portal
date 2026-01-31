import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Share2, MapPin, CheckCircle2, Navigation, User, Battery, BatteryCharging, Gauge, ShieldCheck, AlertOctagon } from "lucide-react";
import { toast } from "sonner";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { logTripShareStart, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

// Fix Leaflet marker icons by using online sources to avoid build issues with image imports
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconShadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";


interface DemoProps {
    forceActive?: boolean;
}

const TripSharingDemo = ({ forceActive = false }: DemoProps) => {
    const contacts = useMemo(() => ([
        { name: "Mom", phone: "+919876543210", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mom", status: "Watching" },
        { name: "Rahul (Brother)", phone: "+919812345678", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul", status: "Notified" },
        { name: "Priya (Friend)", phone: "+919700000000", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", status: "Online" },
    ]), []);

    const [isSharing, setIsSharing] = useState(false);
    const [selected, setSelected] = useState<Set<number>>(new Set());

    // Real geolocation & Device state
    const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);
    const [path, setPath] = useState<[number, number][]>([]);
    const [speed, setSpeed] = useState<number>(0);
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
    const [isCharging, setIsCharging] = useState(false);

    const watchIdRef = useRef<number | null>(null);
    const tripDocIdRef = useRef<string | null>(null);

    // Fix Leaflet icon on mount
    useEffect(() => {
        const DefaultIcon = L.icon({
            iconUrl: iconUrl,
            shadowUrl: iconShadowUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41]
        });
        L.Marker.prototype.options.icon = DefaultIcon;

        // Battery API
        if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((battery: any) => {
                const updateBattery = () => {
                    setBatteryLevel(Math.round(battery.level * 100));
                    setIsCharging(battery.charging);
                };
                updateBattery();
                battery.addEventListener('levelchange', updateBattery);
                battery.addEventListener('chargingchange', updateBattery);
            });
        }
    }, []);

    const stopSharing = useCallback(() => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setIsSharing(false);
        tripDocIdRef.current = null;
        toast.info("Trip sharing stopped.");
    }, []);

    const handleStartTrip = useCallback(async () => {
        if (selected.size === 0) {
            toast.info("Select contacts first, then activate trip sharing.");
            return;
        }

        if (!("geolocation" in navigator)) {
            toast.error("Geolocation is not supported by your browser.");
            return;
        }

        toast.loading("Acquiring GPS & Device Stats...");

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude, speed: currentSpeed } = position.coords;
            const startPos: [number, number] = [latitude, longitude];
            setCurrentPos(startPos);
            setPath([startPos]);
            setIsSharing(true);
            setSpeed(currentSpeed ? Math.round(currentSpeed * 3.6) : 0); // m/s to km/h

            toast.dismiss();
            toast.success(`Trip started! Live stats shared.`);

            // Log to Firebase
            const contactsSelected = Array.from(selected).map((idx) => contacts[idx]?.phone).filter(Boolean) as string[];
            try {
                const docRef = await logTripShareStart({
                    contacts: contactsSelected,
                    startLatitude: latitude,
                    startLongitude: longitude,
                    batteryLevel: batteryLevel ?? undefined
                });
                tripDocIdRef.current = docRef.id;
            } catch (e) {
                console.error("Failed to log start trip", e);
            }

            // Start Watch
            watchIdRef.current = navigator.geolocation.watchPosition(
                async (pos) => {
                    const { latitude, longitude, speed: newSpeed } = pos.coords;
                    const newPos: [number, number] = [latitude, longitude];
                    const speedKmh = newSpeed ? Math.round(newSpeed * 3.6) : 0;

                    setCurrentPos(newPos);
                    setPath(prev => [...prev, newPos]);
                    setSpeed(speedKmh);

                    // Update Firestore
                    if (tripDocIdRef.current) {
                        try {
                            const tripRef = doc(db, "tripShares", tripDocIdRef.current!);
                            await updateDoc(tripRef, {
                                currentLatitude: latitude,
                                currentLongitude: longitude,
                                speed: speedKmh,
                                batteryLevel: batteryLevel, // Update latest battery
                                lastUpdated: new Date()
                            });
                        } catch (err) {
                            console.error("Error updating trip stats", err);
                        }
                    }
                },
                (err) => {
                    console.error(err);
                    toast.error("Lost GPS signal.");
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 5000
                }
            );

        }, (err) => {
            console.error(err);
            toast.dismiss();
            toast.error("Please allow location access to share your trip.");
        });

    }, [selected, contacts, batteryLevel]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        }
    }, []);

    // React to global force active prop
    useEffect(() => {
        if (forceActive && !isSharing) {
            handleStartTrip();
        } else if (!forceActive && isSharing) {
            stopSharing();
        }
    }, [forceActive, isSharing, handleStartTrip, stopSharing]);


    const toggleSelect = (idx: number) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });
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
                        <p className="text-xs text-muted-foreground">Advanced Monitoring</p>
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Trusted Contacts</label>
                        <div className="space-y-2">
                            {contacts.map((contact, i) => (
                                <button
                                    key={i}
                                    onClick={() => toggleSelect(i)}
                                    className={`flex w-full items-center gap-3 p-2 rounded-lg border shadow-sm transition-colors ${selected.has(i) ? "bg-primary/10 border-primary/30" : "bg-background"
                                        }`}
                                >
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={contact.image} />
                                        <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{contact.name}</p>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${isSharing && selected.has(i) ? 'bg-green-500 animate-pulse' : selected.has(i) ? 'bg-primary' : 'bg-gray-300'
                                                }`} />
                                            <p className="text-xs text-muted-foreground">
                                                {isSharing
                                                    ? selected.has(i) ? contact.status : "Not selected"
                                                    : selected.has(i) ? "Selected" : "Not selected"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-md border flex items-center justify-center ${selected.has(i) ? "bg-primary text-primary-foreground border-primary" : "bg-background"
                                        }`}>
                                        {selected.has(i) && <CheckCircle2 className="w-4 h-4" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    {!isSharing ? (
                        <Button
                            className="w-full gradient-bg shadow-glow hover:opacity-90 transition-all font-semibold"
                            onClick={handleStartTrip}
                        >
                            <Navigation className="w-4 h-4 mr-2" />
                            Start Live Trip
                        </Button>
                    ) : (
                        <Button
                            variant="destructive"
                            className="w-full shadow-red-glow animate-pulse-slow"
                            onClick={stopSharing}
                        >
                            <AlertOctagon className="w-4 h-4 mr-2" />
                            Stop Emergency Sharing
                        </Button>
                    )}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative bg-gray-100 dark:bg-gray-800">
                <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {path.length > 0 && <Polyline positions={path} color="#ec4899" weight={5} opacity={0.8} dashArray="1, 10" />}

                    {currentPos && (
                        <>
                            <SetViewOnClick coords={currentPos} />
                            <Marker position={currentPos}>
                                <Popup>
                                    <div className="text-center">
                                        <p className="font-bold text-sm">Active Location</p>
                                        <p className="text-xs text-muted-foreground">Speed: {speed} km/h</p>
                                    </div>
                                </Popup>
                            </Marker>
                        </>
                    )}
                </MapContainer>

                {/* Advanced Info Overlay */}
                <AnimatePresence>
                    {isSharing && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-4 left-4 right-4 z-[1000]"
                        >
                            <div className="bg-background/95 backdrop-blur-xl p-4 rounded-xl border-t-4 border-primary shadow-2xl grid grid-cols-3 gap-4">
                                {/* Status */}
                                <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                                    <ShieldCheck className="w-6 h-6 text-green-600 mb-1" />
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Status</span>
                                    <span className="text-sm font-bold text-green-700">Monitored</span>
                                </div>

                                {/* Speed */}
                                <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/50 border">
                                    <Gauge className="w-6 h-6 text-primary mb-1" />
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Speed</span>
                                    <span className="text-sm font-bold">{speed} <span className="text-[10px] font-normal">km/h</span></span>
                                </div>

                                {/* Battery */}
                                <div className={`flex flex-col items-center justify-center p-2 rounded-lg border ${(batteryLevel !== null && batteryLevel < 20) ? "bg-red-500/10 border-red-500/20" : "bg-muted/50"
                                    }`}>
                                    {isCharging ? (
                                        <BatteryCharging className="w-6 h-6 text-green-600 mb-1" />
                                    ) : (
                                        <Battery className={`w-6 h-6 mb-1 ${(batteryLevel !== null && batteryLevel < 20) ? "text-red-500" : "text-foreground"
                                            }`} />
                                    )}
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Battery</span>
                                    <span className={`text-sm font-bold ${(batteryLevel !== null && batteryLevel < 20) ? "text-red-600" : ""
                                        }`}>
                                        {batteryLevel !== null ? `${batteryLevel}%` : "--"}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// Helper to center map on GPS update
function SetViewOnClick({ coords }: { coords: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(coords, map.getZoom());
    }, [coords, map]);
    return null;
}

export default TripSharingDemo;
