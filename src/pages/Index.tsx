import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield,
  MapPin,
  Users,
  Smartphone,
  Mic,
  WifiOff,
  Route,
  Share2,
  Clock,
  ChevronRight,
  Lightbulb,
  Building2,
  AlertTriangle,
  Cctv,
  Timer,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/FeatureCard";
import StatCard from "@/components/StatCard";
import TestimonialCard from "@/components/TestimonialCard";
import { SafetyMapComponent } from "@/components/SafetyMapComponent";
import heroImage from "@/assets/hero-illustration.png";

const features = [
  {
    icon: Route,
    title: "Smart Route Selection",
    description: "Compare routes by safety score, not just distance. Make informed decisions about your journey.",
  },
  {
    icon: Share2,
    title: "Auto Trip Sharing",
    description: "Loved ones track your journey in real-time with automatic updates.",
  },
  {
    icon: Smartphone,
    title: "Shake for Help",
    description: "3 shakes trigger SOS. No screen needed. Works even when your phone is in your pocket.",
  },
  {
    icon: Mic,
    title: "Voice SOS",
    description: "Shout 'Help' - we'll hear you. Voice activation for hands-free emergencies.",
  },
  {
    icon: WifiOff,
    title: "Works Offline",
    description: "SMS-based SOS when internet fails. Your safety doesn't depend on connectivity.",
  },
  {
    icon: Users,
    title: "Crowdsourced Safety",
    description: "Real reports from real women. Community-powered safety intelligence.",
  },
];

const steps = [
  {
    icon: MapPin,
    title: "Enter Destination",
    description: "Tell us where you're going",
  },
  {
    icon: Route,
    title: "Choose Safest Route",
    description: "Compare routes by safety score",
  },
  {
    icon: Shield,
    title: "Travel Protected",
    description: "We watch over your journey",
  },
];

const safetyFactors = [
  { icon: Lightbulb, label: "Street Lighting", percentage: 30 },
  { icon: BadgeCheck, label: "Police Proximity", percentage: 20 },
  { icon: Building2, label: "Active Businesses", percentage: 20 },
  { icon: AlertTriangle, label: "Incident History", percentage: 15 },
  { icon: Cctv, label: "CCTV Coverage", percentage: 10 },
  { icon: Timer, label: "Time Factor", percentage: 5 },
];

const testimonials = [
  {
    quote: "SafeStride helped me find a safer route home. The peace of mind is priceless.",
    name: "Priya",
    city: "Delhi",
    rating: 5,
  },
  {
    quote: "I love that my mom can track my journey. She worries less now.",
    name: "Ananya",
    city: "Mumbai",
    rating: 5,
  },
  {
    quote: "The shake feature is brilliant. I feel protected even when I can't reach my phone.",
    name: "Kavya",
    city: "Bangalore",
    rating: 5,
  },
];

const Index = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 gradient-hero">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
              >
                <Shield className="w-4 h-4" />
                AI-Powered Women's Safety
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-heading mb-6 leading-tight">
                Walk with{" "}
                <span className="gradient-text">Confidence</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                AI-powered safety navigation that protects you before, during, and
                after your journey. Because every woman deserves to feel safe.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/safety-map">
                  <Button size="lg" className="gradient-bg shadow-glow hover:opacity-90 transition-opacity text-lg px-8">
                    Try Safety Map
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/features">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4 mt-12 justify-center lg:justify-start"
              >
                {[
                  "285M+ Women Commuters",
                  "Safety Score Algorithm",
                  "Multi-Method SOS",
                ].map((stat, i) => (
                  <div
                    key={stat}
                    className="glass-card px-4 py-2 rounded-full text-sm font-medium text-foreground"
                  >
                    {stat}
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative animate-float">
                <img
                  src={heroImage}
                  alt="Woman walking confidently"
                  className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-primary/10 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-heading mb-4">
              The Problem We're Solving
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Despite hundreds of safety apps, women still feel unsafe. The gap between
              technology and real protection is what we're bridging.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <StatCard value="87" suffix="%" label="Women feel unsafe commuting" delay={0} />
            <StatCard value="15-30" label="Minute avg emergency response" delay={0.2} />
            <StatCard value="500" suffix="+" label="Safety apps, same problems" delay={0.4} />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-heading mb-4">
              How SafeStride <span className="gradient-text">Protects</span> You
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive suite of safety features designed with real women's needs in mind.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 gradient-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-heading mb-4">
              Safety in <span className="gradient-text">3 Simple Steps</span>
            </h2>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center relative"
              >
                <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center mb-4 shadow-glow">
                  <step.icon className="w-10 h-10 text-primary-foreground" />
                </div>
                <span className="text-xs font-bold text-primary mb-2">STEP {i + 1}</span>
                <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>

                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-16 h-0.5 bg-gradient-to-r from-primary to-primary/20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Map Preview */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-heading mb-4">
              Explore Safety in <span className="gradient-text">Your City</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Interactive map showing safe zones, caution areas, and emergency services near you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <SafetyMapComponent className="h-[500px] w-full" />
            <div className="absolute bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-auto">
              <Link to="/safety-map">
                <Button size="lg" className="w-full md:w-auto gradient-bg shadow-glow">
                  Explore Full Map
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Safety Score Explainer */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-heading mb-4">
              How We Calculate <span className="gradient-text">Safety</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our algorithm analyzes multiple factors in real-time to give you accurate safety scores.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {safetyFactors.map((factor, i) => (
              <motion.div
                key={factor.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <factor.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{factor.label}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${factor.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="h-full gradient-bg"
                      />
                    </div>
                    <span className="text-sm font-display font-bold text-primary">
                      {factor.percentage}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-24 gradient-cta text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              The Impact We're Building
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "285M", suffix: "+", label: "Women Commuters in India" },
              { value: "60", suffix: "%", label: "Reduction in Response Time" },
              { value: "24/7", suffix: "", label: "Protection Available" },
              { value: "100", suffix: "%", label: "Free Core Features" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <p className="text-white/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-heading mb-4">
              Stories from Our <span className="gradient-text">Community</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TestimonialCard {...testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-heading mb-4">
              Ready to Walk with <span className="gradient-text">Confidence</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of women who travel safer every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/safety-map">
                <Button size="lg" className="gradient-bg shadow-glow hover:opacity-90 transition-opacity text-lg px-8">
                  Try Safety Map
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/report">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Report an Incident
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
