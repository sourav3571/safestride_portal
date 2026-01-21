import { motion } from "framer-motion";

interface SafetyScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

const SafetyScoreGauge = ({ score, size = "md" }: SafetyScoreGaugeProps) => {
  const sizes = {
    sm: { width: 80, stroke: 6, text: "text-lg" },
    md: { width: 120, stroke: 8, text: "text-2xl" },
    lg: { width: 160, stroke: 10, text: "text-4xl" },
  };

  const { width, stroke, text } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 70) return "hsl(160, 84%, 39%)"; // success/emerald
    if (score >= 40) return "hsl(38, 92%, 50%)"; // warning/amber
    return "hsl(0, 72%, 51%)"; // destructive/red
  };

  const getLabel = (score: number) => {
    if (score >= 70) return "Safe";
    if (score >= 40) return "Moderate";
    return "Caution";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={width} height={width} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
        />
        {/* Progress circle */}
        <motion.circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-display font-bold ${text}`} style={{ color: getColor(score) }}>
          {score}
        </span>
        <span className="text-xs text-muted-foreground">{getLabel(score)}</span>
      </div>
    </div>
  );
};

export default SafetyScoreGauge;
