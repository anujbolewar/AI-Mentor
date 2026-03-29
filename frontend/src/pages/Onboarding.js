import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Target, TrendingUp, GraduationCap, Shield, 
  ChevronRight, CheckCircle2 
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    primary_goal: "",
    risk_profile: ""
  });
  const { setPrimaryGoal, setRiskProfile } = useAppContext();
  const navigate = useNavigate();

  // Step 3 timer
  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        // Save to context
        setPrimaryGoal(answers.primary_goal);
        setRiskProfile(answers.risk_profile);
        // Save to localStorage
        localStorage.setItem("amm_onboarded", "true");
        // Navigate
        navigate("/app");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step, answers, navigate, setPrimaryGoal, setRiskProfile]);

  const primaryGoals = [
    { id: "Home", title: "Buy a Home", subtitle: "Plan for down payment & EMI", icon: <Target size={24} /> },
    { id: "FIRE", title: "Early Retirement", subtitle: "Build your FIRE corpus", icon: <TrendingUp size={24} /> },
    { id: "Education", title: "Child's Education", subtitle: "Secure their future", icon: <GraduationCap size={24} /> },
    { id: "Wealth", title: "Wealth Building", subtitle: "Invest & grow systematically", icon: <Shield size={24} /> },
  ];

  const riskProfiles = [
    { 
      id: "conservative", 
      title: "Conservative", 
      body: "I prefer safety over high returns. FDs, debt funds.",
      visual: (
        <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
          <rect y="16" width="8" height="8" rx="1" fill="currentColor" className="text-navy-300" />
          <rect x="12" y="12" width="12" height="12" rx="1" fill="currentColor" className="text-navy-300 opacity-40" />
          <rect x="28" y="8" width="16" height="16" rx="1" fill="currentColor" className="text-navy-300 opacity-20" />
        </svg>
      )
    },
    { 
      id: "moderate", 
      title: "Moderate", 
      body: "A mix of growth and stability. Balanced funds, hybrid.",
      visual: (
        <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
          <path d="M2 22C10 22 15 12 38 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-forest-400" />
        </svg>
      )
    },
    { 
      id: "aggressive", 
      title: "Aggressive", 
      body: "Growth-first. Equity, small-cap, sectoral.",
      visual: (
        <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
          <path d="M2 22C8 22 12 18 16 12C20 6 24 16 38 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-amber-500" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-6 font-sans">
      <div className="card max-w-lg w-full p-10 animate-fade-in">
        
        {/* Progress Indicator */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-2 rounded-full transition-all duration-300 ${step === s ? "bg-forest-600 w-6" : s < step ? "bg-forest-400 w-2" : "bg-slate-300 w-2"}`} 
            />
          ))}
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <h1 className="font-serif italic text-3xl text-slate-900 leading-tight">
              What's your biggest<br />financial goal right now?
            </h1>
            <p className="body-text mt-2 mb-8">We'll tailor your FIRE plan and health score around this.</p>
            
            <div className="grid grid-cols-2 gap-3">
              {primaryGoals.map((g) => (
                <div 
                  key={g.id}
                  onClick={() => setAnswers({ ...answers, primary_goal: g.title })}
                  className={`card-sm p-4 cursor-pointer border-2 transition-all duration-150 ${answers.primary_goal === g.title ? "border-forest-600 bg-forest-50" : "border-transparent hover:border-forest-300 bg-white"}`}
                >
                  <div className={answers.primary_goal === g.title ? "text-forest-600" : "text-slate-400"}>
                    {g.icon}
                  </div>
                  <div className="text-sm font-semibold text-slate-800 mt-2">{g.title}</div>
                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{g.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h1 className="font-serif italic text-3xl text-slate-900 leading-tight">
              How comfortable are you<br />with investment risk?
            </h1>
            <p className="body-text mt-2 mb-8">This shapes your asset allocation across equity, debt, and gold.</p>
            
            <div className="grid grid-cols-1 gap-3">
              {riskProfiles.map((r) => (
                <div 
                  key={r.id}
                  onClick={() => setAnswers({ ...answers, risk_profile: r.id })}
                  className={`card-sm p-5 cursor-pointer border-2 transition-all duration-150 flex items-center gap-5 ${answers.risk_profile === r.id ? (r.id === "conservative" ? "border-navy-600 bg-navy-50" : r.id === "moderate" ? "border-forest-600 bg-forest-50" : "border-amber-500 bg-amber-50") : "border-transparent hover:border-slate-200 bg-white"}`}
                >
                  <div className="shrink-0">{r.visual}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-800 capitalize">{r.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{r.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-4">
            <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-forest-600 animate-spin mx-auto" />
            <h2 className="display-heading text-2xl text-slate-800 italic mt-8">Setting up your workspace...</h2>
            
            <div className="mt-8 space-y-4 text-left max-w-[240px] mx-auto">
              <div className="flex items-center gap-3 text-sm text-slate-500 animate-fade-in" style={{ animationDelay: '0ms' }}>
                <CheckCircle2 size={16} className="text-forest-600" /> Goal captured: {answers.primary_goal}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 animate-fade-in" style={{ animationDelay: '600ms' }}>
                <CheckCircle2 size={16} className="text-forest-600" /> Risk profile: <span className="capitalize">{answers.risk_profile}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 animate-fade-in" style={{ animationDelay: '1200ms' }}>
                <CheckCircle2 size={16} className="text-forest-600" /> Loading your financial tools...
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {step < 3 && (
          <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-100">
            {step > 1 ? (
              <button 
                onClick={() => setStep(step - 1)}
                className="text-sm text-slate-400 hover:text-slate-600 font-medium transition-colors"
              >
                Back
              </button>
            ) : <div />}
            
            <button
              disabled={step === 1 ? !answers.primary_goal : !answers.risk_profile}
              onClick={() => setStep(step + 1)}
              className="px-10 py-3 bg-forest-600 hover:bg-forest-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              {step === 2 ? "Take me in" : "Continue"} <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
