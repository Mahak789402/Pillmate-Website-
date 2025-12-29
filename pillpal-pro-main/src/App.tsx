import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Medicines from "./pages/Medicines";
import Schedule from "./pages/Schedule";
import Insights from "./pages/Insights";
import Welcome from "./pages/Welcome";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import CaregiverDashboard from "./pages/CaregiverDashboard";
import DoseReminder from "@/components/DoseReminder";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DoseReminder />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/caregiver" element={<CaregiverDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
