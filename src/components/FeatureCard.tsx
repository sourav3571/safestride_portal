import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8 }}
      className="group relative p-6 rounded-2xl bg-card border shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      {/* Gradient border effect on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 -z-10 blur-xl" />
      
      <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow duration-300">
        <Icon className="w-7 h-7 text-primary-foreground" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
