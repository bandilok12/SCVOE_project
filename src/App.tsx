import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useTranslation } from "react-i18next";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import '@/i18n';
import Navbar from "@/components/Navbar";
import VoiceAssistant from "@/components/VoiceAssistant";
import Chatbot from "@/components/Chatbot";
import VoiceCommandsHelp from "@/components/VoiceCommandsHelp";
import WeatherAlerts from "@/components/WeatherAlerts";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import GoogleTranslateBar from "./components/GoogleTranslateBar";
import CropPrediction from "./pages/CropPrediction";
import Analytics from "./pages/Analytics";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import AdminPage from "./pages/AdminPage";
import Contact from "./pages/Contact";
import PredictionHistory from "./pages/PredictionHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// RTL support hook
const useRTLSupport = () => {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    const isRTL = rtlLanguages.includes(i18n.language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    
    // Store language preference
    localStorage.setItem('i18nextLng', i18n.language);
  }, [i18n.language]);
};

// Language persistence hook
const useLanguagePersistence = () => {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    // Listen for storage events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'i18nextLng' && e.newValue && e.newValue !== i18n.language) {
        i18n.changeLanguage(e.newValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [i18n]);
};

const AppContent = () => {
  const { user, signOut, isAdmin } = useAuth();
  
  useRTLSupport();
  useLanguagePersistence();

  return (
    <>
      {/* Google Translate Bar - Fixed at top */}
     
      <GoogleTranslateBar />
      {/* Add padding to account for translate bar */}
      <div className="pt-[4px]">
        <Navbar isAuthenticated={!!user} onLogout={signOut} isAdmin={isAdmin} />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route 
            path="/auth" 
            element={user ? <Navigate to="/" replace /> : <AuthPage />} 
          />
          <Route path="/predict" element={<CropPrediction />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <PredictionHistory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <VoiceAssistant />
        <Chatbot />
        <VoiceCommandsHelp />
        <WeatherAlerts />
      </div>
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <CartProvider>
                <Toaster />
                <Sonner />
                <AppContent />
              </CartProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
