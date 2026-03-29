import React, { createContext, useContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Financial Profile (from Onboarding/Settings)
  const [riskProfile, setRiskProfile] = useState(localStorage.getItem("amm_risk_profile") || "moderate");
  const [primaryGoal, setPrimaryGoal] = useState(localStorage.getItem("amm_primary_goal") || "");

  // Preferences (synced to localStorage)
  const [showPercentile, setShowPercentile] = useState(
    localStorage.getItem("amm_show_percentile") !== "false"
  );
  const [showTooltips, setShowTooltips] = useState(
    localStorage.getItem("amm_show_tooltips") !== "false"
  );

  // Global Response Data (shared between modules/tabs)
  const [fireResponse, setFireResponse] = useState(null);
  const [portfolioResponse, setPortfolioResponse] = useState(null);

  // UI States
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Persist preferences on change
  useEffect(() => {
    localStorage.setItem("amm_show_percentile", showPercentile);
  }, [showPercentile]);

  useEffect(() => {
    localStorage.setItem("amm_show_tooltips", showTooltips);
  }, [showTooltips]);

  useEffect(() => {
    if (riskProfile) localStorage.setItem("amm_risk_profile", riskProfile);
  }, [riskProfile]);

  useEffect(() => {
    if (primaryGoal) localStorage.setItem("amm_primary_goal", primaryGoal);
  }, [primaryGoal]);

  return (
    <AppContext.Provider 
      value={{ 
        riskProfile, setRiskProfile,
        primaryGoal, setPrimaryGoal,
        showPercentile, setShowPercentile,
        showTooltips, setShowTooltips,
        fireResponse, setFireResponse,
        portfolioResponse, setPortfolioResponse,
        isDemoMode, setIsDemoMode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
