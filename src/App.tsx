import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingSOS from "./components/FloatingSOS";
import SafetyAssistant from "./components/SafetyAssistant";
import Index from "./pages/Index";
import Features from "./pages/Features";
import SafetyMap from "./pages/SafetyMap";
import SOS from "./pages/SOS";
import About from "./pages/About";
import Report from "./pages/Report";
import Resources from "./pages/Resources";
import TechStack from "./pages/TechStack";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/features" element={<Features />} />
              <Route path="/safety-map" element={<SafetyMap />} />
              <Route path="/sos" element={<SOS />} />
              <Route path="/about" element={<About />} />
              <Route path="/report" element={<Report />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/tech-stack" element={<TechStack />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <FloatingSOS />
          <SafetyAssistant />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
