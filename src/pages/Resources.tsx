import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Phone,
  BookOpen,
  Shield,
  Scale,
  Heart,
  Download,
  ExternalLink,
  AlertTriangle,
  Users,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const emergencyNumbers = [
  { name: "Women Helpline (All India)", number: "1091" },
  { name: "Police", number: "100" },
  { name: "Ambulance", number: "102" },
  { name: "National Emergency Number", number: "112" },
  { name: "Child Helpline", number: "1098" },
  { name: "Women Helpline (Domestic Abuse)", number: "181" },
  { name: "Anti-Stalking Helpline", number: "1096" },
  { name: "Cyber Crime Helpline", number: "155620" },
];

const safetyTips = [
  {
    title: "Trust Your Instincts",
    description: "If something feels wrong, it probably is. Trust your gut and take action.",
  },
  {
    title: "Stay Alert in Public",
    description: "Keep your phone charged, stay aware of your surroundings, and avoid isolated areas.",
  },
  {
    title: "Share Your Location",
    description: "Always let someone know where you're going and when you expect to arrive.",
  },
  {
    title: "Know Your Exits",
    description: "In any new place, identify the exits and safe spots you can go to if needed.",
  },
  {
    title: "Keep Emergency Numbers Handy",
    description: "Save important numbers in your phone and memorize at least two.",
  },
  {
    title: "Document Incidents",
    description: "If something happens, document details like time, place, and descriptions.",
  },
];

const supportOrganizations = [
  {
    name: "National Commission for Women",
    description: "Government body for women's rights",
    link: "http://ncw.nic.in/",
  },
  {
    name: "Majlis Legal Centre",
    description: "Free legal aid for women",
    link: "https://majlislaw.com/",
  },
  {
    name: "Snehi",
    description: "Emotional support helpline",
    link: "https://snehi.org/",
  },
  {
    name: "Jagori",
    description: "Women's rights organization",
    link: "http://www.jagori.org/",
  },
];

const Resources = () => {
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
              <BookOpen className="w-4 h-4" />
              Safety Resources
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-heading mb-6">
              Knowledge is <span className="gradient-text">Power</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Essential resources, emergency contacts, and safety guides to help 
              you stay safe and informed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Emergency Numbers */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Phone className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-heading mb-4">
              Emergency Numbers
            </h2>
            <p className="text-muted-foreground">
              Save these numbers. They could save your life.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {emergencyNumbers.map((item, i) => (
              <motion.a
                key={item.number}
                href={`tel:${item.number}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 rounded-xl bg-card border hover:border-primary/50 hover:shadow-md transition-all"
              >
                <span className="text-sm font-medium text-foreground">{item.name}</span>
                <span className="font-display font-bold text-primary">{item.number}</span>
              </motion.a>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/sos">
              <Button variant="destructive" size="lg">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Go to Emergency SOS Page
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-heading mb-4">
              Safety Tips
            </h2>
            <p className="text-muted-foreground">
              Practical advice to help you stay safe every day.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {safetyTips.map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card border"
              >
                <h3 className="font-semibold text-foreground mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Rights */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <Scale className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-slate-heading mb-4">
                Know Your Rights
              </h2>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-card border">
                <h3 className="font-semibold text-foreground mb-2">
                  Protection of Women from Domestic Violence Act, 2005
                </h3>
                <p className="text-sm text-muted-foreground">
                  Provides protection against domestic violence and allows women to seek 
                  protection orders, residence orders, and monetary relief.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card border">
                <h3 className="font-semibold text-foreground mb-2">
                  Sexual Harassment of Women at Workplace Act, 2013
                </h3>
                <p className="text-sm text-muted-foreground">
                  Mandates all workplaces to have an Internal Complaints Committee and 
                  provides a mechanism for redressal of complaints.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card border">
                <h3 className="font-semibold text-foreground mb-2">
                  Section 354A-D IPC (Criminal Law Amendment Act, 2013)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Covers sexual harassment, assault, stalking, and voyeurism with 
                  stricter punishments and clearer definitions.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Organizations */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-heading mb-4">
              Support Organizations
            </h2>
            <p className="text-muted-foreground">
              Organizations that can help you in times of need.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {supportOrganizations.map((org, i) => (
              <motion.a
                key={org.name}
                href={org.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-md transition-all group"
              >
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {org.name}
                  <ExternalLink className="w-4 h-4 inline-block ml-2 opacity-50" />
                </h3>
                <p className="text-sm text-muted-foreground">{org.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-heading mb-4">
              Downloadable Resources
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Print these and keep them handy for quick reference.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Safety Checklist PDF
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Emergency Contacts Card
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Know Your Rights Guide
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Resources;
