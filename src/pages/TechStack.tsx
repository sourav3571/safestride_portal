import { motion } from "framer-motion";
import { Shield, Code, Sparkles, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const technologies = [
  {
    icon: Sparkles,
    name: "Gemini Model",
    category: "AI",
    description: "Core LLM powering Safety Assistant and intelligent features.",
    features: ["Real-time chat", "Contextual guidance", "Safety tips"],
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Code,
    name: "Gemini AI Studio",
    category: "AI",
    description: "Model management and prompt design for production-ready AI flows.",
    features: ["Prompt tuning", "Model orchestration", "Evaluation tools"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Database,
    name: "Firebase",
    category: "Backend",
    description: "Realtime database and auth for reports and SOS telemetry.",
    features: ["Firestore", "Realtime sync", "Secure auth"],
    color: "from-orange-500 to-red-500",
  },
];

const TechStack = () => {
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
                            <Code className="w-4 h-4" />
                            Technology Stack
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-heading mb-6">
                            Built with <span className="gradient-text">Google Technologies</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            SafeStride leverages the power of Google's AI, Cloud, and Platform services
                            to deliver a comprehensive women's safety solution.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Technologies Grid */}
            <section className="py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {technologies.map((tech, i) => (
                            <motion.div
                                key={tech.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative overflow-hidden rounded-2xl border bg-card p-8 hover:shadow-xl transition-all duration-300"
                            >
                                {/* Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                {/* Content */}
                                <div className="relative">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center shadow-lg`}>
                                            <tech.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                                            {tech.category}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-foreground mb-3">{tech.name}</h3>
                                    <p className="text-muted-foreground mb-6">{tech.description}</p>

                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold text-foreground mb-2">Key Features:</p>
                                        {tech.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${tech.color}`} />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Architecture Overview */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-slate-heading mb-4">
                            How It All Works Together
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Focused stack for seamless, secure, and intelligent safety features.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                title: "Gemini Model",
                                description: "LLM powering chat, safety advice, and intelligent UX.",
                                icon: Sparkles,
                            },
                            {
                                title: "Gemini AI Studio",
                                description: "Manages prompts and model configurations for production flows.",
                                icon: Code,
                            },
                            {
                                title: "Firebase",
                                description: "Persists incident reports and SOS logs securely.",
                                icon: Database,
                            },
                        ].map((layer, i) => (
                            <motion.div
                                key={layer.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center p-6 rounded-2xl bg-card border"
                            >
                                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-glow">
                                    <layer.icon className="w-8 h-8 text-primary-foreground" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">{layer.title}</h3>
                                <p className="text-sm text-muted-foreground">{layer.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Shield className="w-12 h-12 text-primary mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-slate-heading mb-4">
                            Experience the Technology
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                            See how Google's technologies come together to create a safer experience for women everywhere.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/safety-map">
                                <Button size="lg" className="gradient-bg shadow-glow">
                                    Try Safety Map
                                </Button>
                            </Link>
                            <Link to="/about">
                                <Button size="lg" variant="outline">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default TechStack;
