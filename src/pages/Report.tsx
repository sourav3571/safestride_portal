import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, AlertTriangle, Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { saveIncidentReport } from "@/lib/firebase";

const Report = () => {
  const incidentTypes = [
    { value: "poor_lighting", label: "Poor Lighting" },
    { value: "harassment", label: "Harassment" },
    { value: "unsafe_feeling", label: "Unsafe Feeling" },
    { value: "positive", label: "Positive Report (Safe Area)" },
    { value: "other", label: "Other" },
  ];
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [formData, setFormData] = useState({
    location: "",
    incidentType: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveIncidentReport({
        location: formData.location,
        incidentType: formData.incidentType,
        description: formData.description,
        isAnonymous,
      });
      setIsSubmitted(true);
      toast({
        title: "Report Submitted",
        description: "Thank you for helping keep others safe!",
      });
    } catch {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-slate-heading mb-4">
            Thank You!
          </h1>
          <p className="text-muted-foreground mb-8">
            Your report has been submitted successfully. Your contribution helps
            keep other women safe in your community.
          </p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            Submit Another Report
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning text-sm font-medium mb-6">
              <AlertTriangle className="w-4 h-4" />
              Community Report
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-heading mb-4">
              Report an Incident
            </h1>
            <p className="text-muted-foreground">
              Your report helps other women stay safe. All reports are reviewed
              and added to our safety map.
            </p>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-card border rounded-2xl p-6 sm:p-8 shadow-card"
          >
            <div className="space-y-6">
              {/* Location */}
              <div>
                <Label htmlFor="location" className="text-foreground">
                  Location *
                </Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Enter address or area name"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Be as specific as possible (e.g., "Near XYZ Market, ABC Road")
                </p>
              </div>

              {/* Incident Type */}
              <div>
                <Label htmlFor="incidentType" className="text-foreground">
                  Incident Type *
                </Label>
                <Select
                  value={formData.incidentType}
                  onValueChange={(value) => setFormData({ ...formData, incidentType: value })}
                  required
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select incident type" />
                  </SelectTrigger>
                  <SelectContent>
                    {incidentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-foreground">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide any additional details that might help others..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2"
                  rows={4}
                />
              </div>

              {/* Anonymous Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Report Anonymously</p>
                  <p className="text-sm text-muted-foreground">
                    Your identity will be hidden from the public
                  </p>
                </div>
                <Switch
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full gradient-bg shadow-glow"
                size="lg"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Report
              </Button>
            </div>
          </motion.form>

          {/* Note */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Your report helps keep other women safe. Thank you for being part of
            the SafeStride community. ❤️
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Report;
