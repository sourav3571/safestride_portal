import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneCall, AlertTriangle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const emergencyNumbers = [
  { name: "Women Helpline", number: "1091", color: "bg-primary" },
  { name: "Police Emergency", number: "100", color: "bg-blue-600" },
  { name: "Ambulance", number: "102", color: "bg-red-600" },
  { name: "Child Helpline", number: "1098", color: "bg-amber-600" },
  { name: "National Emergency", number: "112", color: "bg-destructive" },
];

const SOS = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [showNumbers, setShowNumbers] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPressed) {
      interval = setInterval(() => {
        setHoldProgress((prev) => {
          if (prev >= 100) {
            setShowNumbers(true);
            return 100;
          }
          return prev + 3.33; // 3 seconds total
        });
      }, 100);
    } else {
      setHoldProgress(0);
    }

    return () => clearInterval(interval);
  }, [isPressed]);

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            Emergency Access
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-heading mb-4">
            Need Help <span className="text-destructive">Right Now</span>?
          </h1>
          
          <p className="text-muted-foreground mb-12">
            Press and hold the SOS button for 3 seconds, or tap any emergency number below to call directly.
          </p>

          {/* SOS Button */}
          <div className="relative mb-12">
            <motion.button
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              onMouseLeave={() => setIsPressed(false)}
              onTouchStart={() => setIsPressed(true)}
              onTouchEnd={() => setIsPressed(false)}
              whileTap={{ scale: 0.95 }}
              className="relative w-48 h-48 mx-auto rounded-full bg-destructive text-destructive-foreground font-bold text-2xl shadow-xl flex items-center justify-center overflow-hidden"
            >
              {/* Progress ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="92"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="92"
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={578}
                  strokeDashoffset={578 - (578 * holdProgress) / 100}
                  transition={{ duration: 0.1 }}
                />
              </svg>
              
              {/* Pulse animation */}
              <motion.div
                className="absolute inset-0 rounded-full bg-destructive"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <div className="relative z-10 flex flex-col items-center">
                <Phone className="w-12 h-12 mb-2" />
                <span>SOS</span>
              </div>
            </motion.button>
            
            <p className="text-sm text-muted-foreground mt-4">
              Hold for 3 seconds
            </p>
          </div>

          {/* Emergency Numbers */}
          <AnimatePresence>
            {(showNumbers || true) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Emergency Numbers
                </h2>
                
                {emergencyNumbers.map((item, i) => (
                  <motion.a
                    key={item.number}
                    href={`tel:${item.number}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-card border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center`}>
                        <PhoneCall className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-foreground">{item.name}</span>
                    </div>
                    <span className="font-display font-bold text-lg text-foreground">
                      {item.number}
                    </span>
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* App Download Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/10"
          >
            <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">
              Get Full SOS Features
            </h3>
            <p className="text-sm text-muted-foreground">
              Download the SafeStride app for shake-to-SOS, voice activation, 
              automatic location sharing, and more.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SOS;
