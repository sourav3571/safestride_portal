import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Route,
  Share2,
  Smartphone,
  Mic,
  WifiOff,
  Users,
  Shield,
  MapPin,
  Bell,
  Clock,
  Eye,
  Zap,
  Lock,
  Globe,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TripSharingDemo from "@/components/demos/TripSharingDemo";
import ShakeSOSDemo from "@/components/demos/ShakeSOSDemo";
import VoiceActivationDemo from "@/components/demos/VoiceActivationDemo";
import OfflineModeDemo from "@/components/demos/OfflineModeDemo";
import CommunityReportsDemo from "@/components/demos/CommunityReportsDemo";
import SmartAlertsDemo from "@/components/demos/SmartAlertsDemo";
import GuardianWatchDemo from "@/components/demos/GuardianWatchDemo";
import ErrorBoundary from "@/components/ErrorBoundary";

const features = [
  {
    icon: Route,
    title: "Safety-Scored Routes",
    description: "Our AI analyzes thousands of data points to score every route for safety. Compare multiple options and always choose the safest path, not just the shortest one.",
    details: [
      "Real-time safety scoring from 0-100",
      "Multiple route comparison",
      "Time-of-day adjustments",
      "Weather considerations",
    ],
  },
  {
    icon: Share2,
    title: "Auto Trip Sharing",
    description: "Share your journey with trusted contacts automatically. They receive real-time updates without you having to do anything after setup.",
    details: [
      "One-time setup for contacts",
      "Automatic trip detection",
      "Real-time location sharing",
      "ETA notifications to family",
    ],
    demo: (
      <ErrorBoundary>
        <TripSharingDemo />
      </ErrorBoundary>
    ),
  },
  {
    icon: Smartphone,
    title: "Shake-to-SOS",
    description: "In an emergency, just shake your phone vigorously 3 times. Works even when your phone is in your pocket or bag.",
    details: [
      "Works with screen locked",
      "Customizable shake sensitivity",
      "Sends location to contacts",
      "Optional loud alarm trigger",
    ],
    demo: (
      <ErrorBoundary>
        <ShakeSOSDemo />
      </ErrorBoundary>
    ),
  },
  {
    icon: Mic,
    title: "Voice Activation",
    description: "Shout 'Help' or a custom safe word, and SafeStride will hear you. Perfect for hands-free emergencies.",
    details: [
      "Custom safe word option",
      "Works in background",
      "Low battery optimized",
      "Noise cancellation",
    ],
    demo: (
      <ErrorBoundary>
        <VoiceActivationDemo />
      </ErrorBoundary>
    ),
  },
  {
    icon: WifiOff,
    title: "Offline Mode",
    description: "No internet? No problem. Our SMS-based backup ensures your SOS gets through even without data connection.",
    details: [
      "SMS-based alerts",
      "Offline maps cached",
      "Last known location sent",
      "Works in low signal areas",
    ],
    demo: (
      <ErrorBoundary>
        <OfflineModeDemo />
      </ErrorBoundary>
    ),
  },
  {
    icon: Users,
    title: "Community Reports",
    description: "Crowdsourced safety data from real women. Report incidents, mark safe zones, and help others stay safe.",
    details: [
      "Anonymous reporting",
      "Verified reports highlighted",
      "Real-time incident alerts",
      "Community safety score",
    ],
    demo: (
      <ErrorBoundary>
        <CommunityReportsDemo />
      </ErrorBoundary>
    ),
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Receive personalized safety alerts based on your location, time, and travel patterns.",
    details: [
      "Location-based notifications",
      "Time-sensitive warnings",
      "Weather-related alerts",
      "Community incident updates",
    ],
    demo: (
      <ErrorBoundary>
        <SmartAlertsDemo />
      </ErrorBoundary>
    ),
  },
  {
    icon: Eye,
    title: "Guardian Watch",
    description: "Assign trusted guardians who can monitor your trips and receive alerts if something seems wrong.",
    details: [
      "Up to 5 guardians",
      "Custom alert thresholds",
      "Check-in reminders",
      "Two-way communication",
    ],
    demo: (
      <ErrorBoundary>
        <GuardianWatchDemo />
      </ErrorBoundary>
    ),
  },
];

const additionalFeatures = [
  { icon: Clock, title: "24/7 Support", description: "Round-the-clock support team ready to help" },
  { icon: Zap, title: "Fast Response", description: "Average SOS response under 30 seconds" },
  { icon: Lock, title: "Privacy First", description: "Your data is encrypted and never sold" },
  { icon: Globe, title: "Multi-Language", description: "Available in 10+ Indian languages" },
];

const Features = () => {
  const [demoMode, setDemoMode] = useState(false);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Comprehensive Protection
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-heading mb-6">
              Features Built for <span className="gradient-text">Your Safety</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every feature in SafeStride was designed based on real feedback from women.
              Here's how we keep you protected.
            </p>

            <div className="flex justify-center mt-8">
              <Button
                size="lg"
                onClick={() => setDemoMode(!demoMode)}
                className={`h-16 px-8 rounded-full text-xl font-bold shadow-2xl transition-all duration-500 ${demoMode
                  ? "bg-red-600 hover:bg-red-700 shadow-red-500/50 scale-105 animate-pulse"
                  : "bg-primary shadow-glow hover:scale-105"
                  }`}
              >
                <Shield className={`w-6 h-6 mr-3 ${demoMode ? "animate-bounce" : ""}`} />
                {demoMode ? "DEACTIVATE SAFE MODE" : "ACTIVATE SAFE MODE"}
              </Button>
            </div>
            {demoMode && (
              <p className="text-red-500 font-medium mt-4 animate-pulse">
                ⚠️ High Alert Mode Active: Showing all safety features in action
              </p>
            )}
          </motion.div>
        </div>
      </section >

      {/* Main Features */}
      < section className="py-24" >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
              >
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mb-6 shadow-glow">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-heading mb-4">
                    {feature.title}
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${i % 2 === 1 ? "md:order-1" : ""} relative`}>
                  {feature.demo && demoMode ? (
                    <div className="rounded-2xl overflow-hidden shadow-2xl border bg-background transition-all duration-500 ring-4 ring-offset-4 ring-red-500">
                      <div className="bg-red-50 px-4 py-2 border-b flex items-center gap-2">
                        <Play className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-red-600">LIVE PROTECTION ACTIVE</span>
                      </div>
                      <div className="p-1 bg-muted/20">
                        {React.cloneElement(feature.demo as React.ReactElement, { forceActive: true })}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <feature.icon className="w-24 h-24 text-primary/30" />
                      </div>
                      <div className="absolute inset-0 rounded-2xl border-2 border-primary/10" />
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section >

      {/* Additional Features */}
      < section className="py-24 bg-muted/30" >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-heading mb-4">
              And Much More...
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section >
    </div >
  );
};

export default Features;
