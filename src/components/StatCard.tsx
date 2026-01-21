import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface StatCardProps {
  value: string;
  label: string;
  suffix?: string;
  delay?: number;
}

const StatCard = ({ value, label, suffix = "", delay = 0 }: StatCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (isInView) {
      const numericValue = parseInt(value.replace(/[^0-9]/g, ""));
      const prefix = value.replace(/[0-9]/g, "");
      
      if (isNaN(numericValue)) {
        setDisplayValue(value);
        return;
      }

      const start = 0;
      const duration = 2000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(numericValue * easeOutQuart);
        
        setDisplayValue(prefix + current.toLocaleString());

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(value);
        }
      };

      const timer = setTimeout(() => {
        animate();
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-center p-6"
    >
      <div className="font-display text-4xl md:text-5xl font-bold gradient-text mb-2">
        {displayValue}{suffix}
      </div>
      <p className="text-muted-foreground text-sm md:text-base">{label}</p>
    </motion.div>
  );
};

export default StatCard;
