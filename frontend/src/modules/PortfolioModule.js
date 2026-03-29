import React, { useState, useRef } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import { AlertTriangle, UploadCloud, PieChart as PieChartIcon, CheckCircle2, ChevronRight, Info } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { DEMO_PORTFOLIO_RESPONSE } from "../data/demoData";
import { Zap } from "lucide-react";

export default function PortfolioModule() {
  const [riskProfile, setRiskProfile] = useState("moderate");
  const [horizon, setHorizon] = useState(10);
  const [monthlyIncome, setMonthlyIncome] = useState(100000);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const fileInputRef = useRef(null);
  const { 
    riskProfile: globalRisk, 
    setPortfolioResponse, 
    setIsDemoMode: setGlobalDemoMode 
  } = useAppContext();

  React.useEffect(() => {
    if (globalRisk) {
      setRiskProfile(globalRisk);
    }
  }, [globalRisk]);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const loadingTexts = ["Reading your statement...", "Analyzing holdings...", "Mapping asset classes..."];

  React.useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 2000);
    } else {
      setLoadingTextIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const riskOptions = ["conservative", "moderate", "aggressive"];

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (f) => {
    setError("");
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("PDF only supported.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File exceeds 10MB limit. Filter by date range in your broker portal to reduce size.");
      return;
    }
    setFile(f);
  };

  const loadDemoPortfolio = () => {
    setIsDemo(true);
    setRiskProfile("moderate");
    setHorizon(17);
    setMonthlyIncome(233333);
    setLoading(true);
    setError("");
    
    // Simulate multi-step loading text sequence
    setTimeout(() => setLoadingTextIndex(1), 400);
    setTimeout(() => setLoadingTextIndex(2), 800);
    
    setTimeout(() => {
      setLoading(false);
      setResult(DEMO_PORTFOLIO_RESPONSE);
      setPortfolioResponse(DEMO_PORTFOLIO_RESPONSE);
      setGlobalDemoMode(true);
    }, 1200);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!file) {
      setError("Please upload a PDF document.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("portfolio_document", file);
    formData.append("risk_profile", riskProfile);
    formData.append("investment_horizon_years", horizon);
    formData.append("monthly_income", monthlyIncome);

    try {
      const response = await fetch("http://localhost:8000/api/portfolio/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.status === 504 || response.status === 503) {
        setError("Analysis taking longer than expected. Retry?");
        if (data.partial_results) {
          setResult({
            ...data.partial_results,
            overall_health: "unknown_due_to_timeout",
            tax_efficiency_score: "N/A",
            concentration_flags: [],
            rebalancing_actions: [],
            top_3_actions: ["AI analysis timed out. Basic extraction succeeded."],
          });
        }
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze portfolio");
      }

      setResult(data);
      setPortfolioResponse(data);
      setGlobalDemoMode(false);
    } catch (err) {
      console.error(err);
      if (err.message.includes("503") || err.message.toLowerCase().includes("overloaded")) {
        setError("Our AI is currently analyzing a high volume of requests. Please try again in a few moments.");
      } else if (err.message.includes("504") || err.message.toLowerCase().includes("timeout")) {
        setError("This statement is taking longer than expected to process. Please try a smaller file or try again later.");
      } else if (err.message.includes("422") || err.message.toLowerCase().includes("processable")) {
        setError("We couldn't detect portfolio data in this document. Please ensure it's a valid CAMS or NSDL statement.");
      } else if (err.message.includes("400") || err.message.toLowerCase().includes("scanned")) {
        setError("It looks like this is a scanned image or an invalid PDF. We need a text-based, original PDF statement to process your data.");
      } else if (err.message.includes("Failed to fetch") || err.name === "TypeError") {
        setError("Unable to reach the server. Check your connection.");
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
        if (err.message.includes("Analysis taking longer")){
            setError("Analysis taking longer than expected. Retry?");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const Input = ({ label, helper, errorProp, value, onChange, placeholder, type = "number", min, max }) => {
    const isValid = value !== '' && value !== undefined && !errorProp;
    return (
      <div className="flex flex-col text-left relative">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
        <div className="relative">
          <input 
            type={type} 
            className={`w-full px-4 py-2.5 bg-white border rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10 transition-all duration-150 ${errorProp ? 'border-rose-400 ring-2 ring-rose-400/10' : 'border-slate-200'}`}
            value={value} 
            onChange={onChange} 
            placeholder={placeholder} 
            min={min} 
            max={max} 
          />
          {isValid && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <CheckCircle2 size={14} className="text-forest-500" />
            </div>
          )}
        </div>
        {helper && !errorProp && <p className="text-xs text-slate-400 mt-1">{helper}</p>}
        {errorProp && <p className="text-xs text-rose-500 mt-1">{errorProp}</p>}
      </div>
    );
  };

  const COLORS = ['#1e6e56', '#2a55a0', '#4fa58a', '#5c8bcd', '#7fc0ab', '#06b6d4'];

  const FinanceTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="card-sm p-3 text-xs bg-white shadow-lg border border-slate-100">
        <p className="font-semibold text-slate-700 mb-1">{label || payload[0]?.name}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || p.fill || '#1e293b' }} className="font-medium">
            {p.name}: {p.name.includes('%') || p.dataKey === 'Current' || p.dataKey === 'Target' ? p.value + '%' : formatINR(p.value)}
          </p>
        ))}
      </div>
    );
  };


  if (loading) {
    return (
      <div className="card p-8 flex flex-col items-center justify-center text-center min-h-[300px] animate-fade-in shadow-sm max-w-3xl mx-auto">
        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-forest-600 animate-spin mb-6" />
        <h3 className="text-base font-medium text-slate-700 transition-opacity duration-300">
          {loadingTexts[loadingTextIndex]}
        </h3>
        <p className="body-text text-sm text-slate-400 mt-1 font-medium italic">This usually takes 8–12 seconds</p>
        <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden mt-6">
          <div 
            className="h-full bg-forest-500 rounded-full transition-all duration-[8000ms] ease-out" 
            style={{ width: loading ? '90%' : '0%' }} 
          />
        </div>
      </div>
    );
  }

  if (result) {
    const pieData = result.asset_class_breakdown.map((item) => ({
      name: item.asset_class,
      value: item.value_inr,
    }));
    const barData = result.asset_class_breakdown.map((item) => ({
      name: item.asset_class,
      Current: item.current_pct,
      Target: item.target_pct_for_risk_profile,
    }));

    return (
      <div className="w-full space-y-6 animate-fade-in max-w-4xl mx-auto">
        {result.partial_analysis_warning && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-2">
            <AlertTriangle size={18} /> {result.partial_analysis_warning}
          </div>
        )}
        
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <PieChartIcon className="text-forest-600" /> Portfolio Diagnosis
            {isDemo && (
              <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full border border-amber-200 ml-2">DEMO</span>
            )}
          </h2>
          <button onClick={() => { setResult(null); setPortfolioResponse(null); setIsDemo(false); setGlobalDemoMode(false); }} className="btn-secondary text-sm py-1.5 font-semibold transition-all duration-150">
            ← Analyze Another
          </button>
        </div>

        {/* Top Info */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="card p-5">
            <p className="label">Total Value</p>
            <p className="value-large text-forest-700">{formatINR(result.portfolio_total_value)}</p>
          </div>
          <div className="card p-5">
            <p className="label">Holdings Count</p>
            <p className="value-large text-slate-800">{result.holdings_count}</p>
          </div>
          <div className="card p-5">
            <p className="label">Overall Health</p>
            <p className="value-large text-slate-800 capitalize">{result.overall_health?.replace(/_/g, " ")}</p>
          </div>
          <div className="card p-5">
            <p className="label">Tax Efficiency</p>
            <p className="value-large text-slate-800">{result.tax_efficiency_score}/100</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6 min-h-[300px] transition-all duration-200">
            <h3 className="text-base font-semibold text-slate-900 mb-6">Current Asset Allocation</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12 }}>
                <Pie 
                  data={pieData} 
                  cx="50%" cy="50%" 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value" 
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <RechartsTooltip content={<FinanceTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold text-slate-900 mb-2 px-1">Allocation Gaps</h3>
            {result.asset_class_breakdown.map((item, idx) => {
              const gap = item.current_pct - item.target_pct_for_risk_profile;
              let gapColor = "text-amber-600";
              if (Math.abs(gap) > 5) gapColor = "text-rose-600";
              else if (Math.abs(gap) <= 2) gapColor = "text-forest-600";
              
              return (
                <div key={idx} className="card-sm p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-800">{item.asset_class}</span>
                    <span className={`text-xs font-bold ${gapColor}`}>
                      {gap > 0 ? `+${gap.toFixed(1)}%` : `${gap.toFixed(1)}%`}
                    </span>
                  </div>
                  <div className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    {/* Target dashed base (visualized as a background region or separate line) */}
                    <div className="absolute top-0 left-0 h-full border-b border-dashed border-navy-400 opacity-30" style={{ width: `${item.target_pct_for_risk_profile}%` }}></div>
                    {/* Current fill */}
                    <div className="absolute top-0 left-0 h-full bg-forest-600 rounded-full transition-all duration-1000" style={{ width: `${item.current_pct}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    <span>current: {item.current_pct}%</span>
                    <span>target: {item.target_pct_for_risk_profile}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Missing & Concentration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6 border-l-4 border-l-amber-500 transition-all duration-200">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Concentration Flags</h3>
            {result.concentration_flags?.length > 0 ? (
              <ul className="space-y-3">
                {result.concentration_flags.map((flag, idx) => (
                  <li key={idx} className={`p-4 rounded-xl border flex gap-3 items-start transition-all ${flag.severity === "critical" ? "border-rose-500 border-2 bg-rose-50 text-rose-700 font-semibold" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
                    <AlertTriangle className={`shrink-0 mt-0.5 ${flag.severity === "critical" ? "text-rose-600" : "text-amber-500"}`} size={18} />
                    <div className="flex flex-col">
                      <p className="text-sm font-bold uppercase tracking-tight">{flag.category_label}</p>
                      <p className="text-xs mt-1 font-medium leading-relaxed opacity-90">{flag.reason}</p>
                      <span className="mt-2 text-[10px] font-bold opacity-60">CONCENTRATION: {flag.percentage}%</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-forest-600 text-sm font-medium flex items-center gap-1"><CheckCircle2 size={16}/> No concentration risks detected.</p>
            )}
          </div>

          <div className="card p-6 border-l-4 border-l-navy-500 transition-all duration-200">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Rebalancing Actions</h3>
            {result.rebalancing_actions?.length > 0 ? (
              <ul className="space-y-3">
                {result.rebalancing_actions.map((act, idx) => (
                  <li key={idx} className="p-3 rounded-xl border border-navy-200 bg-navy-50 text-navy-800">
                    <p className="font-semibold uppercase text-xs tracking-wider mb-1">{act.action_type} - {act.asset_class}</p>
                    <p className="text-sm">{act.rationale_text}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm">No immediate rebalancing required.</p>
            )}
          </div>
        </div>

        {/* Top 3 Actions */}
        <div className="card p-6 transition-all duration-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top 3 Recommended Actions</h3>
          <ol className="list-decimal pl-5 space-y-2 text-slate-700 text-sm font-medium">
            {result.top_3_actions?.map((action, idx) => (
              <li key={idx} className="pl-1 font-medium">{action}</li>
            ))}
          </ol>
        </div>

        <div className="flex items-start gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl mt-8">
          <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            <strong className="font-semibold text-slate-600">SEBI Disclaimer:</strong> This tool provides educational AI-generated portfolio analysis and does not constitute formal financial advice. Mutual fund investments are subject to market risks, read all scheme related documents carefully. Consult a SEBI-registered RIA before making investment decisions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      <div className="card p-8 flex flex-col min-h-[420px] w-full transition-all duration-200">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex gap-2 items-center">
              <PieChartIcon className="text-forest-600" size={28} /> RAG Portfolio Analyzer
            </h2>
            <p className="text-slate-500 text-sm mt-1 font-medium">Upload your Mutual Fund CAS (CAMS/KFintech) for AI-driven review.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 card p-6 border-rose-200 bg-rose-50 flex items-center gap-4 animate-fade-in shadow-sm">
            <AlertTriangle className="text-rose-500 shrink-0" size={20} />
            <div className="text-left flex-1">
              <h3 className="text-sm font-semibold text-rose-700">
                {error.includes("image-based") || error.includes("scanned") ? "Scanned PDF Detected" :
                 error.includes("detect portfolio") || error.includes("422") ? "Invalid Statement" :
                 error.includes("longer than expected") || error.includes("timeout") ? "Analysis Timed Out" :
                 "Unable to process portfolio"}
              </h3>
              <p className="text-xs text-rose-600 mt-0.5 font-medium leading-relaxed">
                {error.includes("image-based") || error.includes("scanned") ? "Download a text-based statement directly from CAMS Online or NSDL CAS." :
                 error.includes("detect portfolio") || error.includes("422") ? "We couldn't find portfolio holdings. Try a CAMS CAS or NSDL CAS PDF." :
                 error.includes("longer than expected") || error.includes("timeout") ? "This happens with complex profiles. Retry usually works." :
                 "Our AI had a moment. Your financial inputs look good — let's try once more."}
              </p>
            </div>
            {error.includes("Retry") || error.includes("longer than expected") || error.includes("moment") || error.includes("timeout") ? (
              <button onClick={handleSubmit} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl transition-all duration-150 shadow-sm">
                Retry
              </button>
            ) : null}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 flex-1">
          <div>
            <div className="border-l-2 border-forest-500 pl-4 mb-4">
              <div className="text-base font-semibold text-slate-800">Risk Profile</div>
              <div className="text-sm text-slate-500 mt-0.5 font-medium">Determines target asset allocation</div>
            </div>
            <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50 w-full lg:w-auto">
              {riskOptions.map((rp) => {
                const isActive = riskProfile === rp;
                let activeClass = "bg-forest-600 text-white";
                if (rp === "conservative") activeClass = "bg-navy-600 text-white";
                if (rp === "aggressive") activeClass = "bg-amber-500 text-slate-900";
                
                return (
                  <button
                    key={rp}
                    type="button"
                    onClick={() => setRiskProfile(rp)}
                    className={`flex-1 lg:flex-none px-6 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-150 ${isActive ? `${activeClass} shadow-sm` : "text-slate-500 hover:text-slate-700 bg-transparent"}`}
                  >
                    {rp}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="border-l-2 border-forest-500 pl-4 mb-4">
              <div className="text-base font-semibold text-slate-800">Investment Metrics</div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Input label="Horizon (Years)" value={horizon} onChange={(e) => setHorizon(e.target.value)} min="1" max="40" />
              <Input label="Monthly Income (₹)" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} min="10000" />
            </div>
          </div>

          <div>
            <div className="border-l-2 border-forest-500 pl-4 mb-4">
              <div className="text-base font-semibold text-slate-800">Upload CAS Statement</div>
              <div className="text-sm text-slate-500 mt-0.5 font-medium">We analyze your holdings locally</div>
            </div>
            
            <div
              className="relative border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:border-forest-400 hover:bg-forest-50/50 transition-all duration-200 cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? (
                <div className="flex flex-col items-center animate-fade-in">
                  <CheckCircle2 size={24} className="text-forest-600 mb-3" />
                  <div className="text-sm font-semibold text-slate-800 mb-1">{file.name}</div>
                  <div className="text-xs text-slate-500 mb-4 font-medium">{(file.size / (1024 * 1024)).toFixed(1)} MB</div>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="text-xs text-forest-600 underline hover:text-forest-700 transition-colors"
                  >
                    Change file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center group">
                  <UploadCloud size={32} className="text-slate-400 mb-3 group-hover:text-forest-500 transition-colors" />
                  <div className="text-sm font-medium text-slate-600 mb-1">Drop your CAMS or NSDL PDF here</div>
                  <div className="text-xs text-slate-400 font-medium">or click to browse</div>
                  <div className="label mt-4 text-[10px] text-slate-400 uppercase tracking-widest font-bold">PDF only · Max 10MB</div>
                </div>
              )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" className="hidden" />
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs font-medium text-slate-400 font-bold uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            onClick={loadDemoPortfolio}
            className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-navy-300 bg-navy-50 hover:bg-navy-100 rounded-2xl text-sm font-semibold text-navy-700 transition-all duration-150"
          >
            <Zap size={16} className="text-navy-500 fill-navy-500" />
            View sample AI analysis — Priya's portfolio (9 holdings, ₹8.47L)
          </button>
        </div>

          <div className="pt-6 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={loading || !file}
              className="py-3 px-8 bg-forest-600 hover:bg-forest-700 active:bg-forest-800 text-white font-semibold text-sm rounded-xl transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
               Analyze My Portfolio <ChevronRight size={16} />
            </button>
          </div>
        </form>
      </div>

      {!loading && !result && (
        <div className="card p-12 flex flex-col items-center justify-center text-center animate-fade-in shadow-sm hover:shadow-md transition-all duration-200">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#cbd5e1" strokeWidth="1.5" className="mb-4">
            <rect x="10" y="6" width="20" height="28" rx="2"/>
            <path d="M10 14h20M14 20h12M14 26h8"/>
            <circle cx="26" cy="26" r="4" fill="white"/>
            <line x1="29" y1="29" x2="33" y2="33"/>
          </svg>
          <h3 className="display-heading text-xl text-slate-400 italic">Upload to begin</h3>
          <p className="body-text text-sm text-slate-400 max-w-xs mt-2 font-medium">
            Upload your CAMS or NSDL statement to get an instant portfolio analysis.
          </p>
        </div>
      )}
    </div>
  );
}
