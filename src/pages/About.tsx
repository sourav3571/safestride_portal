import { motion } from "framer-motion";
import { Shield, Target, Heart, Users, Lightbulb, Award } from "lucide-react";

const milestones = [
  { year: "2024", title: "Idea Born", description: "Concept developed based on real women's safety needs" },
  { year: "2024", title: "Research Phase", description: "Interviewed 500+ women about their safety concerns" },
  { year: "2025", title: "Beta Launch", description: "Initial testing with 1,000 users in Delhi" },
  { year: "2025", title: "Public Launch", description: "Full launch across major Indian cities" },
];

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description: "Every decision we make starts with 'Will this make women safer?'",
  },
  {
    icon: Heart,
    title: "Empathy-Driven",
    description: "We listen to real women's experiences to build real solutions.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We leverage cutting-edge AI to solve age-old safety problems.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Safety is a collective effort. Together, we're stronger.",
  },
];

const themes = [
  { name: "Gemini Model", type: "tech" },
  { name: "Gemini AI Studio", type: "tech" },
  { name: "Firebase", type: "tech" },
];

const About = () => {
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
              About SafeStride
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-heading mb-6">
              Empowering Women, <span className="gradient-text">One Step at a Time</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              SafeStride was born from a simple question: Why should women have to compromise
              their freedom for their safety?
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-4">
                <Target className="w-4 h-4" />
                OUR MISSION
              </div>
              <h2 className="text-3xl font-bold text-slate-heading mb-6">
                Creating a World Where Every Woman Feels Safe
              </h2>
              <p className="text-muted-foreground mb-4">
                We believe that safety is a fundamental right, not a privilege. Every woman
                deserves to walk confidently at any hour, in any neighborhood, without fear.
              </p>
              <p className="text-muted-foreground">
                SafeStride combines AI-powered navigation, community intelligence, and
                instant emergency response to create a comprehensive safety ecosystem that
                works for you, not against you.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Shield className="w-32 h-32 text-primary/30" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Themes */}
      <section className="py-12 border-y bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="text-left md:w-1/3">
              <h3 className="text-2xl font-bold text-slate-heading mb-2">Key Themes</h3>
              <p className="text-muted-foreground">The technologies and pillars powering SafeStride.</p>
            </div>

            <div className="flex flex-wrap gap-3 md:w-2/3 justify-start md:justify-end">
              {themes.map((theme, i) => (
                <motion.div
                  key={theme.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`px-4 py-2 rounded-full border text-sm font-medium ${theme.type === 'tech'
                    ? 'bg-background border-primary/20 text-foreground hover:border-primary/50'
                    : 'bg-primary/5 border-primary/20 text-primary hover:bg-primary/10'
                    } transition-colors cursor-default`}
                >
                  {theme.name}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-slate-heading mb-6">
              The Problem We Saw
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Despite hundreds of safety apps in the market, women still don't feel safe.
              We asked thousands of women why, and here's what we learned:
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { stat: "87%", label: "Don't trust current safety apps" },
                { stat: "92%", label: "Want proactive, not reactive safety" },
                { stat: "78%", label: "Need hands-free emergency options" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-card border"
                >
                  <div className="font-display text-3xl font-bold gradient-text mb-2">
                    {item.stat}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-heading mb-4">
              Our Values
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <value.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-heading mb-4">
              Our Journey
            </h2>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {milestones.map((milestone, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 mb-8 last:mb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {milestone.year}
                  </div>
                  {i < milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-primary/20 mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="font-semibold text-foreground mb-1">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto"
          >
            <Award className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-heading mb-4">
              Get in Touch
            </h2>
            <p className="text-muted-foreground mb-6">
              Have questions, feedback, or want to partner with us? We'd love to hear from you.
            </p>
            <a
              href="mailto:sourav.behera.cst.2023@nist.edu"
              className="text-primary font-medium hover:underline"
            >
              sourav.behera.cst.2023@nist.edu
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
