import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout/Layout";
import { Home } from "@/pages/Home";
import { Auth } from "@/pages/Auth";
import { ComplaintForm } from "@/pages/ComplaintForm";
import NotFound from "./pages/NotFound";
import "@/i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/complaint/new" element={<ComplaintForm />} />
              <Route path="/complaints" element={<div className="p-8 text-center">My Complaints - Coming Soon</div>} />
              <Route path="/status" element={<div className="p-8 text-center">Status Tracking - Coming Soon</div>} />
              <Route path="/profile" element={<div className="p-8 text-center">Profile - Coming Soon</div>} />
              <Route path="/admin" element={<div className="p-8 text-center">Admin Dashboard - Coming Soon</div>} />
              {/* Redirect old index route */}
              <Route path="/index" element={<Navigate to="/" replace />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
