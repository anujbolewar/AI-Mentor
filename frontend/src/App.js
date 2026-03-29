import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Learn from './pages/Learn';
import Settings from './pages/Settings';
import NavBar from './components/NavBar';
import { AppProvider } from './context/AppContext';

const AppContent = () => {
  const onboarded = localStorage.getItem("amm_onboarded") === "true";
  const location = useLocation();
  
  // Minimal shell for onboarding, standard nav for everything else
  const isOnboarding = location.pathname === "/onboarding" || (!onboarded && location.pathname === "/");

  return (
    <>
      {!isOnboarding && <NavBar />}
      <Routes>
        {/* Conditional Root Route */}
        <Route 
          path="/" 
          element={!onboarded ? <Onboarding /> : <LandingPage />} 
        />
        
        <Route path="/learn" element={<Learn />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* Protected Dashboard Route */}
        <Route 
          path="/app" 
          element={!onboarded ? <Navigate to="/" replace /> : <Dashboard />} 
        />

        {/* Legacy Onboarding Route (redirects to home if already onboarded) */}
        <Route 
          path="/onboarding" 
          element={onboarded ? <Navigate to="/app" replace /> : <Onboarding />} 
        />

        {/* Catch-all redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}
