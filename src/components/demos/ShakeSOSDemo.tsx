import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Smartphone, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface DemoProps {
    forceActive?: boolean;
}

const ShakeSOSDemo = ({ forceActive = false }: DemoProps) => {
    const [shakeCount, setShakeCount] = useState(0);
    const [isTriggered, setIsTriggered] = useState(false);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isTriggered && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (countdown === 0 && isTriggered) {
            toast.error("SOS SENT! Location shared with contacts & emergency services.");
            setIsTriggered(false);
            setShakeCount(0);
        }
        return () => clearInterval(timer);
    }, [isTriggered, countdown]);

    // Handle global activation
    useEffect(() => {
        if (forceActive && !isTriggered) {
            setShakeCount(3);
            setIsTriggered(true);
            setCountdown(5);
        } else if (!forceActive && isTriggered) {
            // Optional reset
            cancelSOS();
        }
    }, [forceActive, isTriggered]);

    const handleShake = () => {
        if (isTriggered) return;

        const newCount = shakeCount + 1;
        setShakeCount(newCount);

        // Simulate vibration
        if (navigator.vibrate) navigator.vibrate(200);

        if (newCount >= 3) {
            setIsTriggered(true);
            setCountdown(5);
        }
    };

    const cancelSOS = () => {
        setIsTriggered(false);
        setShakeCount(0);
        setCountdown(5);
        toast.info("SOS Cancelled");
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl border-4 border-slate-900 bg-background shadow-2xl aspect-[9/16] max-h-[600px] mx-auto">
                {/* Phone Frame Content */}
                <div className="h-full flex flex-col p-6 items-center justify-center relative bg-gradient-to-b from-background to-muted">

                    {!isTriggered ? (
                        <>
                            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-8 animate-pulse">
                                <Smartphone className="w-10 h-10 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-center mb-4">Shake to SOS</h3>
                            <p className="text-muted-foreground text-center mb-12">
                                Shake your phone 3 times vigorously to trigger emergency alert.
                            </p>

                            <div className="flex gap-2 mb-8">
                                {[1, 2, 3].map((step) => (
                                    <div
                                        key={step}
                                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${shakeCount >= step ? "bg-red-600" : "bg-slate-200"
                                            }`}
                                    />
                                ))}
                            </div>

                            <Button
                                size="lg"
                                className="w-full max-w-xs bg-slate-900 text-white hover:bg-slate-800"
                                onClick={handleShake}
                            >
                                Simulate Shake ({shakeCount}/3)
                            </Button>
                            <p className="text-xs text-muted-foreground mt-4">Click button to simulate physical shake</p>
                        </>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full h-full flex flex-col items-center justify-center bg-red-600 text-white absolute inset-0 z-50 p-6"
                        >
                            <AlertTriangle className="w-24 h-24 mb-6 animate-bounce" />
                            <h2 className="text-3xl font-bold mb-2">SOS TRIGGERED</h2>
                            <p className="text-white/80 text-center mb-8">Sending alerts to 5 guardians in...</p>

                            <div className="text-6xl font-black mb-8">{countdown}</div>

                            <Button
                                variant="secondary"
                                size="lg"
                                className="w-full bg-white text-red-600 hover:bg-white/90"
                                onClick={cancelSOS}
                            >
                                <X className="w-5 h-5 mr-2" />
                                Cancel Alert
                            </Button>
                        </motion.div>
                    )}

                </div>

                {/* Notion Island / Dynamic Island */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl" />
            </div>
        </div>
    );
};

export default ShakeSOSDemo;
