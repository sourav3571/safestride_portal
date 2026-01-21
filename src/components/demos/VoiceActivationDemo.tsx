import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, MessageSquare, Check, User } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DemoProps {
    forceActive?: boolean;
}

const VoiceActivationDemo = ({ forceActive = false }: DemoProps) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [alertStage, setAlertStage] = useState<'idle' | 'listening' | 'detected' | 'sent'>('idle');

    // Simulate speech recognition for demo purposes
    // In a real app, we'd use window.webkitSpeechRecognition
    useEffect(() => {
        if (forceActive && !isListening) {
            setIsListening(true);
            setAlertStage('listening');
            toast("Voice Safety Assistant Activated");
        } else if (!forceActive && isListening) {
            setIsListening(false);
            setAlertStage('idle');
        }
    }, [forceActive]);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (isListening && alertStage === 'listening') {
            // Simulate hearing "Head" or safe word after 2 seconds
            timeout = setTimeout(() => {
                setTranscript("Help! Help me!");
                setAlertStage('detected');
            }, 2000);
        }

        if (alertStage === 'detected') {
            timeout = setTimeout(() => {
                setAlertStage('sent');
                toast.success("Safe word detected! Guards notified.");
            }, 1500);
        }

        return () => clearTimeout(timeout);
    }, [isListening, alertStage]);

    const toggleListening = () => {
        if (isListening) {
            setIsListening(false);
            setAlertStage('idle');
            setTranscript("");
        } else {
            setIsListening(true);
            setAlertStage('listening');
            setTranscript("");
            toast("Listening for safe word 'Help'...");
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-card border rounded-2xl shadow-xl p-6 text-center">
            <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center transition-all duration-500 ${isListening
                ? "bg-red-100 shadow-[0_0_0_20px_rgba(239,68,68,0.2)] animate-pulse"
                : "bg-primary/10"
                }`}>
                <Mic className={`w-8 h-8 ${isListening ? "text-red-500" : "text-primary"}`} />
            </div>

            <h3 className="text-xl font-bold mb-2">Voice Safety Assistant</h3>
            <p className="text-muted-foreground mb-8 min-h-[40px]">
                {alertStage === 'idle' && "Tap microphone to activate background listening"}
                {alertStage === 'listening' && "Listening for 'Help'..."}
                {alertStage === 'detected' && <span className="text-red-500 font-bold">Detected: "{transcript}"</span>}
                {alertStage === 'sent' && <span className="text-green-600 font-bold flex items-center justify-center gap-2"><Check className="w-4 h-4" /> Alert Sent!</span>}
            </p>

            {alertStage === 'sent' && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-8 p-4 bg-muted/40 rounded-xl border text-left"
                >
                    <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Notifying Guardians</p>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Avatar className="w-8 h-8"><AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mom" /></Avatar>
                                <span className="text-sm font-medium">Mom</span>
                            </div>
                            <span className="text-xs text-green-600 font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Sent</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Avatar className="w-8 h-8"><AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Dad" /></Avatar>
                                <span className="text-sm font-medium">Dad</span>
                            </div>
                            <span className="text-xs text-green-600 font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Sent</span>
                        </div>
                    </div>
                </motion.div>
            )}

            <Button
                onClick={toggleListening}
                variant={isListening ? "destructive" : "default"}
                size="lg"
                className="w-full gradient-bg shadow-glow"
            >
                {isListening ? "Stop Listening" : "Start Voice Monitoring"}
            </Button>
        </div>
    );
};

export default VoiceActivationDemo;
