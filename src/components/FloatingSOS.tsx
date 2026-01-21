import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X, PhoneCall } from "lucide-react";
import { useState } from "react";

const FloatingSOS = () => {
  const emergencyNumbers = [
    { name: "Women Helpline", number: "1091" },
    { name: "Police", number: "100" },
    { name: "Ambulance", number: "102" },
  ];
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  // Don't show on SOS page
  if (location.pathname === "/sos") return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-64 bg-background rounded-2xl shadow-xl border p-4 mb-2"
          >
            <h4 className="font-semibold text-foreground mb-3">Emergency Numbers</h4>
            <div className="space-y-2">
              {emergencyNumbers.map((item) => (
                <a
                  key={item.number}
                  href={`tel:${item.number}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                  <span className="flex items-center gap-2 text-primary font-bold">
                    <PhoneCall className="w-4 h-4" />
                    {item.number}
                  </span>
                </a>
              ))}
            </div>
            <Link
              to="/sos"
              className="block mt-3 text-center text-sm text-primary hover:underline"
            >
              Go to full SOS page →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-colors ${isExpanded
            ? "bg-muted text-muted-foreground"
            : "bg-destructive text-destructive-foreground"
          }`}
      >
        {!isExpanded && (
          <motion.div
            className="absolute inset-0 rounded-full bg-destructive"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ opacity: 0.3 }}
          />
        )}
        {isExpanded ? (
          <X className="w-6 h-6" />
        ) : (
          <Phone className="w-6 h-6" />
        )}
      </motion.button>
    </div>
  );
};

export default FloatingSOS;
