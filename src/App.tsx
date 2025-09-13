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
import { MyComplaints } from "@/pages/MyComplaints";
import { StatusTracking } from "@/pages/StatusTracking";
import { Profile } from "@/pages/Profile";
import { AdminDashboard } from "@/pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import { useAuth } from "@/contexts/AuthContext";
import "@/i18n";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user } = useAuth();

  // Show admin dashboard for admin users instead of regular home page
  const getRouteElement = (path: string, adminElement: JSX.Element, userElement: JSX.Element) => {
    if (path === "/" && user?.role === 'admin') {
      return <AdminDashboard />;
    }
    return user?.role === 'admin' ? adminElement : userElement;
  };

  return (
    <Layout>
      <Routes>
        <Route path="/" element={getRouteElement("/", <AdminDashboard />, <Home />)} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/complaint/new" element={<ComplaintForm />} />
        <Route path="/complaints" element={<MyComplaints />} />
        <Route path="/status" element={<StatusTracking />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* Redirect old index route */}
        <Route path="/index" element={<Navigate to="/" replace />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
