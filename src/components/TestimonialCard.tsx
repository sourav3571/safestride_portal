import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  city: string;
  rating: number;
}

const TestimonialCard = ({ quote, name, city, rating }: TestimonialCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-card border rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <Quote className="w-10 h-10 text-primary/20 mb-4" />
      
      <p className="text-foreground text-base leading-relaxed mb-6">
        "{quote}"
      </p>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{city}</p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating ? "text-amber fill-amber" : "text-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
