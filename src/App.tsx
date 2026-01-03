import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import Index from "./pages/Index";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import Catalog from "./pages/Catalog";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import CashierLogin from "./pages/CashierLogin";
import CashierDashboard from "./pages/CashierDashboard";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";
import QRModal from "./components/QRModal";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const PasswordChangeCheck = ({ children }: { children: React.ReactNode }) => {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (profile?.must_change_password) {
    return <Navigate to="/change-password" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const { user, loading } = useAuth();

  // Don't show bottom nav on login/change-password pages
  const showBottomNav = user && !loading;

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background relative">
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/cashier-login" element={<CashierLogin />} />
        <Route path="/change-password" element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        } />
        <Route path="/cashier" element={
          <ProtectedRoute>
            <CashierDashboard />
          </ProtectedRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <PasswordChangeCheck>
              <Index />
            </PasswordChangeCheck>
          </ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute>
            <PasswordChangeCheck>
              <Transactions />
            </PasswordChangeCheck>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <PasswordChangeCheck>
              <Profile />
            </PasswordChangeCheck>
          </ProtectedRoute>
        } />
        <Route path="/catalog" element={
          <ProtectedRoute>
            <PasswordChangeCheck>
              <Catalog />
            </PasswordChangeCheck>
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showBottomNav && window.location.pathname !== '/cashier' && window.location.pathname !== '/change-password' && (
        <>
          <BottomNav onQrClick={() => setQrModalOpen(true)} />
          <QRModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />
        </>
      )}
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
