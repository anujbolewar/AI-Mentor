import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Settings as SettingsIcon, Eye, Trash2, 
  ChevronRight, AlertTriangle 
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Settings() {
  const navigate = useNavigate();
  const { 
    riskProfile, setRiskProfile,
    primaryGoal, setPrimaryGoal,
    showPercentile, setShowPercentile,
    showTooltips, setShowTooltips
  } = useAppContext();

  const handleReset = () => {
    if (window.confirm("Are you sure? This will clear your profile and plan data permanentely.")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const riskOptions = [
    { id: 'conservative', label: 'Conservative' },
    { id: 'moderate', label: 'Moderate' },
    { id: 'aggressive', label: 'Aggressive' }
  ];

  return (
    <div className="min-h-screen bg-cream-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="display-heading text-4xl italic text-slate-900 leading-none">Account & Settings</h1>
          <p className="body-text mt-3 text-slate-500 font-medium">Manage your profile, risk preferences, and connected accounts.</p>
        </header>

        {/* SECTION 1: Financial Profile */}
        <section className="card p-8 mb-6 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-navy-50 text-navy-600 rounded-lg">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Your Financial Profile</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Pre-filled from your onboarding. Edit at any time.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Primary Goal (Read Only in this demo) */}
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Life Goal</span>
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-slate-800">{primaryGoal || "Not set"}</span>
                <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">Locked</span>
              </div>
            </div>

            {/* Risk Profile (Editable) */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Investment Risk Appetite</span>
              <div className="flex p-1 bg-slate-100 rounded-xl gap-1">
                {riskOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setRiskProfile(opt.id)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${riskProfile === opt.id ? "bg-white text-forest-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Display Preferences */}
        <section className="card p-8 mb-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-forest-50 text-forest-600 rounded-lg">
              <Eye size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Display Preferences</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Customize how data and insights are presented to you.</p>
            </div>
          </div>

          <div className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
              <div>
                <p className="text-sm font-semibold text-slate-800">Show Health Percentiles</p>
                <p className="text-xs text-slate-500 mt-0.5">Compare your Money Health Score with other users.</p>
              </div>
              <button 
                onClick={() => setShowPercentile(!showPercentile)}
                className={`w-12 h-6 rounded-full transition-all relative ${showPercentile ? "bg-forest-600" : "bg-slate-300"}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${showPercentile ? "left-7" : "left-1"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
              <div>
                <p className="text-sm font-semibold text-slate-800">Show Financial Tooltips</p>
                <p className="text-xs text-slate-500 mt-0.5">Enable jargon-free explanations on hover.</p>
              </div>
              <button 
                onClick={() => setShowTooltips(!showTooltips)}
                className={`w-12 h-6 rounded-full transition-all relative ${showTooltips ? "bg-forest-600" : "bg-slate-300"}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${showTooltips ? "left-7" : "left-1"}`} />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 3: Data Management */}
        <section className="card p-8 border-l-4 border-l-rose-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <Trash2 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Data Management</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Manage your stored financial data and account connectivity.</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="max-w-md">
              <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <AlertTriangle size={14} className="text-rose-500" /> Reset User Workspace
              </p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                This will permanently delete your onboarding responses, tax preferences, and any uploaded portfolio health reports. This action cannot be undone.
              </p>
            </div>
            <button 
              onClick={handleReset}
              className="px-6 py-2.5 bg-white border border-rose-200 text-rose-500 text-sm font-bold rounded-xl hover:bg-rose-50 transition-colors shadow-sm"
            >
              Reset All Data
            </button>
          </div>
        </section>

        <div className="mt-12 text-center">
           <button 
             onClick={() => navigate('/app')}
             className="text-sm font-semibold text-forest-600 hover:text-forest-700 flex items-center justify-center gap-1 mx-auto"
           >
             ← Back to Dashboard
           </button>
        </div>
      </div>
    </div>
  );
}
