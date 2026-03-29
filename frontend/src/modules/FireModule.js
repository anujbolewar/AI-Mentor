import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, Legend, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip as RadarTooltip
} from 'recharts';
import { CheckCircle2, ChevronRight, PlusCircle, Target, AlertTriangle, Info, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { DEMO_PROFILE, DEMO_FIRE_RESPONSE } from '../data/demoData';
import { Zap } from 'lucide-react';

const initProfile = {
  age: '',
  monthly_income: '',
  monthly_expenses: '',
  existing_investments: '',
  existing_emi: '',
  dependents: '',
  fire_target_age: '',
  tax_regime: 'new',
  life_goals: [{ name: '', target_amount: '', target_years: '' }]
};

export default function FireModule() {
  const [profile, setProfile] = useState(initProfile);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const { 
    primaryGoal, 
    setFireResponse, 
    showPercentile, 
    setIsDemoMode: setGlobalDemoMode 
  } = useAppContext();

  useEffect(() => {
    if (primaryGoal && !profile.life_goals[0].name) {
      const updatedGoals = [...profile.life_goals];
      updatedGoals[0].name = primaryGoal;
      setProfile(prev => ({ ...prev, life_goals: updatedGoals }));
    }
  }, [primaryGoal]); 
  const [loading, setLoading] = useState(false);
  const [waitTooLong, setWaitTooLong] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [result, setResult] = useState(null);
  const [resultTab, setResultTab] = useState('fire'); 
  const [isDemo, setIsDemo] = useState(false);

  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const loadingTexts = ["Reading your numbers...", "Running the calculations...", "Building your roadmap..."];

  useEffect(() => {
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

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        setWaitTooLong(true);
      }, 10000); 
    } else {
      setWaitTooLong(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const validateStep1 = () => {
    let temp = {};
    const mi = Number(profile.monthly_income);
    const me = Number(profile.monthly_expenses);
    if (!profile.age || !profile.monthly_income || !profile.monthly_expenses) {
      temp.basic = 'All fields are required';
    } else if (me >= mi) {
      temp.basic = 'Your expenses equal or exceed income. Reduce expenses or increase income before planning.';
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const validateStep2 = () => {
    let temp = {};
    if (profile.life_goals.length === 0) {
      temp.goals = 'Add at least one goal';
    }
    profile.life_goals.forEach((g, i) => {
      if (!g.name || !g.target_amount || !g.target_years) {
        temp[`goal_${i}`] = 'Please fill all goal fields';
      }
    });
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const validateStep3 = () => {
    let temp = {};
    if (!profile.fire_target_age || !profile.existing_investments || !profile.dependents) {
      temp.fire = 'All fields are required';
    } else if (Number(profile.fire_target_age) <= Number(profile.age) + 5) {
      temp.fire = 'FIRE target must be at least 5 years from current age.';
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
  };
  const prevStep = () => setStep(step - 1);

  const addGoal = () => {
    if (profile.life_goals.length < 5) {
      setProfile({ ...profile, life_goals: [...profile.life_goals, { name: '', target_amount: '', target_years: '' }] });
    }
  };

  const removeGoal = (index) => {
    if (profile.life_goals.length > 1) {
      let gls = [...profile.life_goals];
      gls.splice(index, 1);
      setProfile({ ...profile, life_goals: gls });
    }
  };

  const handleDemoLoad = () => {
    setIsDemo(true);
    setProfile(DEMO_PROFILE);
    setLoading(true);
    setErrorMsg(null);
    
    setTimeout(() => {
      setLoading(false);
      setResult(DEMO_FIRE_RESPONSE);
      setFireResponse(DEMO_FIRE_RESPONSE);
      setGlobalDemoMode(true);
      setStep(3); // Result view
    }, 400);
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setLoading(true);
    setErrorMsg(null);
    setResult(null);
    setResultTab('fire');

    const payload = {
      age: Number(profile.age),
      monthly_income: Number(profile.monthly_income),
      monthly_expenses: Number(profile.monthly_expenses),
      existing_investments: Number(profile.existing_investments),
      existing_emi: profile.existing_emi ? Number(profile.existing_emi) : 0,
      dependents: Number(profile.dependents),
      fire_target_age: Number(profile.fire_target_age),
      tax_regime: profile.tax_regime,
      life_goals: profile.life_goals.map(g => ({
        name: g.name,
        target_amount: Number(g.target_amount),
        target_years: Number(g.target_years)
      }))
    };

    try {
      const resp = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (resp.status === 504 || resp.status === 503) {
         setErrorMsg("Analysis taking longer than expected. Retry?");
         setLoading(false);
         return;
      }
      const data = await resp.json();
      if (!resp.ok) {
        setErrorMsg(data.detail || data.error || 'Unknown error occurred');
      } else if (data.warning && !data.money_health_score) {
        setErrorMsg(`${data.warning}: ${data.message}`);
      } else {
        setResult(data);
        setFireResponse(data);
        setGlobalDemoMode(false);
      }
    } catch (err) {
      setErrorMsg("Unable to reach the server. Check your connection.");
    }
    setLoading(false);
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

  let chartData = [];
  let colors = ['#1e6e56', '#2a55a0', '#4fa58a', '#5c8bcd', '#7fc0ab'];

  const FinanceTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="card-sm p-3 text-xs bg-white shadow-lg border border-slate-100">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }} className="font-medium">
            {p.name}: {formatINR(p.value)}
          </p>
        ))}
      </div>
    );
  };

  if (result && result.monthly_roadmap && result.goal_sip_allocations) {
    chartData = result.monthly_roadmap.map((rm) => {
      let row = { name: `M${rm.month}` };
      result.goal_sip_allocations.forEach(g => {
        row[g.goal_name] = g.monthly_sip_inr;
      });
      return row;
    });
  }

  const formatPercentile = (p) => `${p}th percentile (estimated)`;
  const getBandMap = (band) => {
    const map = {
      critical: { color: 'text-rose-600', border: '#e11d48', hex: '#e11d48', sentence: "Action needed now." },
      needs_attention: { color: 'text-amber-600', border: '#d97706', hex: '#d97706', sentence: "A few gaps to close." },
      on_track: { color: 'text-navy-600', border: '#2a55a0', hex: '#2a55a0', sentence: "You're on the right track." },
      healthy: { color: 'text-forest-600', border: '#1e6e56', hex: '#1e6e56', sentence: "You're in great shape." }
    };
    return map[band] || map.on_track;
  };

        {/* EMPTY STATE */}
        {!loading && !result && !errorMsg && (
          <div className="card p-12 flex flex-col items-center justify-center text-center animate-fade-in shadow-sm hover:shadow-md transition-all duration-200">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#cbd5e1" strokeWidth="1.5" className="mb-4">
              <circle cx="20" cy="20" r="16"/>
              <circle cx="20" cy="20" r="8"/>
              <circle cx="20" cy="20" r="2" fill="#cbd5e1"/>
              <line x1="20" y1="4" x2="20" y2="10"/>
              <line x1="20" y1="30" x2="20" y2="36"/>
              <line x1="4" y1="20" x2="10" y2="20"/>
              <line x1="30" y1="20" x2="36" y2="20"/>
            </svg>
            <h2 className="display-heading text-xl text-slate-400 italic">Your roadmap starts here</h2>
            <p className="body-text text-sm text-slate-400 max-w-xs mt-2 font-medium">
              Fill in the form to see your personalized month-by-month FIRE plan.
            </p>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && !waitTooLong && (
          <div className="card p-8 flex flex-col items-center justify-center text-center min-h-[300px] animate-fade-in shadow-sm">
             <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-forest-600 animate-spin mb-6" />
             <h3 className="text-base font-medium text-slate-700 transition-opacity duration-300">
               {loadingTexts[loadingTextIndex]}
             </h3>
             <p className="body-text text-sm text-slate-400 mt-1 font-medium italic">This usually takes 5–8 seconds</p>
             <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden mt-6">
               <div 
                 className="h-full bg-forest-500 rounded-full transition-all duration-[8000ms] ease-out" 
                 style={{ width: loading ? '90%' : '0%' }} 
               />
             </div>
          </div>
        )}

        {/* TIMEOUT STATE */}
        {loading && waitTooLong && (
          <div className="card p-8 text-center animate-fade-in shadow-sm">
            <h3 className="display-heading text-xl text-slate-700 italic">Taking a bit longer than usual</h3>
            <p className="body-text text-sm text-slate-500 mt-2 font-medium">
              Our AI is working through your financial profile. Complex inputs can take up to 15 seconds.
            </p>
            <button 
              onClick={handleSubmit} 
              className="mt-6 px-6 py-2.5 bg-forest-600 hover:bg-forest-700 text-white font-semibold text-sm rounded-xl transition-all duration-150 shadow-sm hover:shadow-md"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ERROR STATE */}
        {errorMsg && (
          <div className="card p-6 border-rose-200 bg-rose-50 flex items-center gap-4 animate-fade-in shadow-sm">
            <AlertTriangle className="text-rose-500 shrink-0" size={20} />
            <div className="text-left">
              <h3 className="text-sm font-semibold text-rose-700">
                {errorMsg.includes("503") ? "Our AI had a moment" : "The analysis timed out"}
              </h3>
              <p className="text-xs text-rose-600 mt-0.5 font-medium leading-relaxed">
                {errorMsg.includes("503") ? "Your financial inputs look good — let's try once more." : "This happens with complex profiles. Retry usually works."}
              </p>
            </div>
          </div>
        )}

  if (result) {
    const hs = result.money_health_score;
    const bandData = hs ? getBandMap(hs.score_band) : getBandMap('on_track');
    let radarData = [];
    if (hs && hs.dimension_scores) {
       radarData = hs.dimension_scores.map(d => ({
          subject: d.dimension_name,
          A: d.score,
          fullMark: 100,
       }));
    }

    return (
      <div className="animate-fade-in flex flex-col gap-6">
        {result.warning && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-2">
            <AlertTriangle size={18} />
            {result.message ? result.message : result.warning}
          </div>
        )}
        
        {/* Toggle Result View */}
        <div className="flex gap-2 p-1 card-sm w-full max-w-sm mx-auto">
           <button onClick={() => setResultTab('fire')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${resultTab === 'fire' ? 'bg-forest-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
             FIRE Plan
           </button>
           <button onClick={() => setResultTab('health')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${resultTab === 'health' ? 'bg-forest-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
             Health Score
           </button>
        </div>

        {resultTab === 'fire' && (
          <div className="animate-fade-in flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-1/3">
               <div className="card p-6 sticky top-6">
                 <div className="label mb-6 flex items-center gap-2">
                   Your financial snapshot
                   {isDemo && (
                     <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full border border-amber-200 font-bold uppercase tracking-wider">DEMO</span>
                   )}
                 </div>
                 
                 <div className="pb-4 border-b border-slate-100 flex flex-col gap-1">
                   <span className="label">INVESTABLE SURPLUS</span>
                   <span className="value-large text-forest-700">{formatINR(result.investable_surplus)}</span>
                   <span className="body-text text-xs">per month, after EMI</span>
                 </div>
                 
                 <div className="py-4 border-b border-slate-100 flex flex-col gap-1">
                   <span className="label">FIRE NUMBER</span>
                   <span className="value-large text-slate-900">{formatINR(result.fire_number)}</span>
                   <span className="body-text text-xs">Target corpus</span>
                 </div>
                 
                 <div className="pt-4 flex flex-col gap-1">
                   <span className="label">FIRE GAP</span>
                   <span className="value-large text-slate-900">{formatINR(result.fire_gap)}</span>
                   <span className="body-text text-xs">Remaining to target</span>
                 </div>

                 {result.investable_surplus > 0 && (
                   <div className="body-text text-sm italic text-slate-600 border-l-2 border-forest-400 pl-3 mt-6">
                     At your current savings rate, you'll reach your FIRE number in approximately {(result.fire_gap / (result.investable_surplus * 12)).toFixed(1)} years.
                   </div>
                 )}
               </div>
            </div>
            
            <div className="w-full lg:w-2/3 flex flex-col gap-6">

             {/* ALERTS */}
             <div className="flex flex-col gap-3">
               {result.insurance_gap_life > 0 && (
                 <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 items-center">
                   <AlertTriangle className="text-amber-500 shrink-0" size={24} />
                   <div>
                     <p className="font-semibold text-sm text-slate-800">Life Insurance Gap Detected</p>
                     <p className="text-xs text-slate-600">You are underinsured by {formatINR(result.insurance_gap_life)}. Consider term insurance.</p>
                   </div>
                 </div>
               )}
               {result.insurance_gap_health === true && (
                 <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex gap-3 items-center">
                   <AlertTriangle className="text-rose-500 shrink-0" size={24} />
                   <div>
                     <p className="font-semibold text-sm text-slate-800">Health Insurance Missing</p>
                     <p className="text-xs text-slate-600">Adequate medical coverage is critical to protect your corpus.</p>
                   </div>
                 </div>
               )}
               {result.tax_saving_moves && result.tax_saving_moves.map((t, idx) => (
                 <div key={idx} className="bg-forest-50 border border-forest-200 p-4 rounded-xl flex gap-3 items-center">
                   <TrendingUp className="text-forest-600 shrink-0" size={24} />
                   <div>
                     <p className="font-semibold text-sm text-slate-800">Tax Optimizer: {t.section} - {t.instrument}</p>
                     <p className="text-xs text-slate-600">Invest {formatINR(t.recommended_amount_inr)} to save est. {formatINR(t.estimated_tax_saving_inr)} in taxes.</p>
                   </div>
                 </div>
               ))}
             </div>

             {/* CHART */}
             {result.warning !== 'LOW_SURPLUS' && chartData.length > 0 && (
             <div className="card p-6 pb-2">
               <h3 className="text-lg font-bold mb-6 text-slate-900 text-center">Monthly Goal SIP Allocations</h3>
               <div className="w-full h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData} margin={{ top: 20, right: 0, left: 10, bottom: 5 }} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                     <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} />
                     <YAxis stroke="#64748b" tick={{fontSize: 12}} tickFormatter={(v) => `₹${v/1000}k`} />
                     <BarTooltip cursor={{fill: '#f1f5f9'}} content={<FinanceTooltip />} />
                     <Legend iconType="circle" wrapperStyle={{fontSize: '13px', paddingTop: '10px'}} />
                     {result.goal_sip_allocations.map((g, i) => (
                       <Bar key={g.goal_name} dataKey={g.goal_name} stackId="a" fill={colors[i % colors.length]} radius={i === result.goal_sip_allocations.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
                     ))}
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             </div>
             )}

             {/* ROADMAP LIST */}
             <div className="flex flex-col gap-3">
               <h3 className="text-lg font-bold mb-2 text-slate-900">Monthly Roadmap</h3>
               {result.monthly_roadmap.map((rm, idx) => (
                 <div 
                   key={rm.month} 
                   className="card-sm p-4 flex items-center gap-4 animate-fade-up opacity-0"
                   style={{ animation: `fadeUp 0.4s ease-out ${idx * 40}ms forwards` }}
                 >
                   <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-semibold text-sm flex items-center justify-center shrink-0">
                     M{rm.month}
                   </div>
                   <div className="flex-1">
                     <ul className="space-y-1.5">
                       {rm.action_items.map((act, i) => (
                         <li key={i} className="text-sm text-slate-700 font-medium flex items-start gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-forest-500 mt-1.5 shrink-0"></span>
                           <span>{act}</span>
                         </li>
                       ))}
                     </ul>
                   </div>
                   <div className="flex flex-col items-end text-right shrink-0">
                     <span className="value-medium text-slate-900">{formatINR(rm.sip_total_inr)}</span>
                     <span className="body-text text-xs text-slate-500 font-medium">{formatINR(rm.cumulative_corpus_inr)} sum</span>
                   </div>
                 </div>
               ))}
             </div>
            </div>
          </div>
        )}

        {resultTab === 'health' && hs && (
           <div className="animate-fade-in flex flex-col gap-6">
              {hs.DEBT_CRISIS && (
                 <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-center text-sm font-semibold">
                    Debt crisis detected. Please prioritize reducing your debt burden immediately.
                 </div>
              )}

              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="w-full lg:w-1/3">
                  <div className="card sticky top-6">
                    <div className="flex flex-col items-center justify-center text-center p-8 border-b border-slate-100">
                      <div className="w-[120px] h-[120px] rounded-full flex flex-col items-center justify-center bg-white shadow-sm" style={{ border: `3px solid ${bandData.border}` }}>
                        <span className="value-large text-slate-900">{hs.overall_score}</span>
                        <span className="label mt-1">{hs.score_band.replace('_', ' ')}</span>
                      </div>
                      <div className="display-heading text-lg italic mt-6 text-slate-700 px-4 leading-snug">
                         "{bandData.sentence}"
                      </div>
                      {hs.FIRST_TIME_INVESTOR && <div className="mt-4 text-[10px] uppercase font-bold tracking-wider bg-navy-600 text-white px-3 py-1 rounded-full">First-time investor</div>}
                    </div>
                    
                    {showPercentile && (
                      <div className="p-6">
                        <div className="card-sm p-4 bg-navy-50 border-navy-200 text-center">
                          <p className="font-medium text-navy-800 text-sm">
                            You're currently saving more than {hs.comparison_percentile}% of people in your income bracket.
                          </p>
                          <p className="text-[10px] text-navy-400 mt-1 uppercase font-bold tracking-tight">(Estimated Snapshot)</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full lg:w-2/3 flex flex-col gap-5">
                  <div className="card flex items-center justify-center p-4 h-[250px] relative overflow-hidden">
                     <ResponsiveContainer width="100%" height={250}>
                       <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12 }}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 10}} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar name="Score" dataKey="A" stroke="#1e6e56" strokeWidth={1.5} fill="#1e6e56" fillOpacity={0.12} />
                          <RadarTooltip content={<FinanceTooltip />} />
                       </RadarChart>
                     </ResponsiveContainer>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mt-2">Dimension Breakdown</h3>
                  <div className="flex flex-col gap-3">
                     {hs.dimension_scores.map((dim, idx) => {
                        const isWeakest = dim.dimension_name === hs.weakest_dimension;
                        const score = dim.score;
                        let scoreColor = "border-forest-600";
                        if (score < 40) scoreColor = "border-rose-500";
                        else if (score < 60) scoreColor = "border-amber-500";
                        else if (score < 80) scoreColor = "border-navy-500";

                        return (
                           <div key={idx} className={`card-sm p-4 flex items-start gap-4 transition-all hover:bg-white ${isWeakest ? 'border-l-4 border-rose-400' : ''}`}>
                              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 ${scoreColor}`}>
                                <span className="text-sm font-bold text-slate-800">{score}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-800">{dim.dimension_name}</span>
                                <span className="text-xs text-slate-500 mt-0.5 leading-relaxed">{dim.insight_text}</span>
                                <span className="text-xs font-medium text-forest-600 mt-1.5 flex items-center gap-1">
                                  {dim.top_action} <ChevronRight size={12} className="shrink-0" />
                                </span>
                              </div>
                           </div>
                        );
                     })}
                  </div>
                </div>
              </div>

              {/* PRIORITY ACTIONS */}
              <div className="card p-6 border-l-4 border-l-forest-500">
                 <h3 className="text-lg font-bold mb-4 text-slate-900">Top 3 Priority Actions</h3>
                 <ul className="list-decimal pl-5 text-slate-700 space-y-2 text-sm font-medium">
                    {hs.top_3_priority_actions.map((act, idx) => (
                      <li key={idx} className="pl-2">{act.replace('FIRST_TIME_INVESTOR', '').replace('DEBT_CRISIS', '').trim()}</li>
                    ))}
                 </ul>
              </div>

           </div>
        )}

        <div className="flex justify-center mt-6 pt-6 border-t border-slate-200">
           <button className="btn-secondary" onClick={() => { 
             setResult(null); 
             setFireResponse(null);
             setStep(1); 
             setIsDemo(false); 
             setGlobalDemoMode(false);
           }}>Start Over</button>
        </div>
      </div>
    );
  }

  // FORM WIZARD UI
  return (
    <div className="card p-8 flex flex-col min-h-[420px] max-w-2xl mx-auto w-full">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 flex gap-2 items-center">
          <Target className="text-forest-600" size={28} /> Target FIRE Plan
        </h2>
        {/* Simple Steps - no progress bar */}
      </div>

      {errorMsg && (
        <div className="card p-6 border-rose-200 bg-rose-50 mb-6 flex flex-col items-center justify-center text-center gap-3">
          <AlertTriangle size={20} className="text-rose-500" />
          <div>
            <h3 className="text-sm font-semibold text-rose-700">Analysis Error</h3>
            <p className="text-xs text-rose-600 mt-1 max-w-sm mx-auto">{errorMsg.includes('503') || errorMsg.includes('server') ? "Our AI had a moment. Your financial inputs look good — let's try once more." : errorMsg.includes('504') || errorMsg.includes('timeout') ? "The analysis timed out. This happens with complex profiles. Retry usually works." : errorMsg}</p>
          </div>
          {errorMsg.toLowerCase().includes('retry') || errorMsg.includes('server') || errorMsg.includes('timeout') ? (
            <button onClick={handleSubmit} className="mt-2 py-2 px-6 bg-slate-800 hover:bg-slate-900 text-white font-medium text-sm rounded-xl transition-all duration-150">
              Try again
            </button>
          ) : null}
        </div>
      )}

      <div className="flex-1">
        {step === 1 && (
          <div className="animate-fade-in">
            <button
              onClick={handleDemoLoad}
              className="flex items-center gap-2 text-xs font-semibold text-forest-600 hover:text-forest-700 border border-forest-200 bg-forest-50 hover:bg-forest-100 px-4 py-2.5 rounded-xl transition-all duration-150 mb-8 w-full justify-center shadow-sm"
            >
              <Zap size={14} className="fill-forest-500 text-forest-500" />
              Load sample profile — Arjun, 29yo Tech Worker, Pune
            </button>
            <div className="border-l-2 border-forest-500 pl-4 mb-6">
              <div className="text-base font-semibold text-slate-800">Basic Financials</div>
              <div className="text-sm text-slate-500 mt-0.5">We need this to establish your baseline</div>
            </div>
            {errors.basic && <div className="text-rose-500 text-sm mb-4 font-medium">{errors.basic}</div>}
            
            <div className="grid grid-cols-2 gap-5">
              <Input label="Age" errorProp={errors.basic ? " " : undefined} value={profile.age} onChange={e => setProfile({...profile, age: e.target.value})} />
              <Input label="Monthly Income (₹)" errorProp={errors.basic ? " " : undefined} value={profile.monthly_income} onChange={e => setProfile({...profile, monthly_income: e.target.value})} />
              <Input label="Monthly Expenses (₹)" errorProp={errors.basic ? " " : undefined} value={profile.monthly_expenses} onChange={e => setProfile({...profile, monthly_expenses: e.target.value})} />
              <Input label="Ongoing EMI (₹)" value={profile.existing_emi} onChange={e => setProfile({...profile, existing_emi: e.target.value})} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <div className="border-l-2 border-forest-500 pl-4 mb-6">
              <div className="text-base font-semibold text-slate-800">Life Goals</div>
              <div className="text-sm text-slate-500 mt-0.5">Big purchases require SIP planning before FIRE</div>
            </div>
            {errors.goals && <div className="text-rose-500 text-sm mb-4 font-medium">{errors.goals}</div>}

            <div className="flex flex-col gap-4">
              {profile.life_goals.map((g, index) => (
                 <div key={index} className="flex flex-col gap-4 p-5 card-sm relative">
                   {profile.life_goals.length > 1 && (
                     <button onClick={() => removeGoal(index)} className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 transition-colors text-sm font-medium">Remove</button>
                   )}
                   <Input label={`Goal ${index + 1} Name`} type="text" errorProp={errors[`goal_${index}`]} value={g.name} placeholder="e.g. Home Downpayment" onChange={e => {
                      let gls = [...profile.life_goals]; gls[index].name = e.target.value; setProfile({...profile, life_goals: gls});
                   }} />
                   <div className="grid grid-cols-2 gap-4">
                      <Input label="Target Amount (₹)" errorProp={errors[`goal_${index}`]} value={g.target_amount} onChange={e => {
                         let gls = [...profile.life_goals]; gls[index].target_amount = e.target.value; setProfile({...profile, life_goals: gls});
                      }} />
                      <Input label="Years Away" errorProp={errors[`goal_${index}`]} value={g.target_years} onChange={e => {
                         let gls = [...profile.life_goals]; gls[index].target_years = e.target.value; setProfile({...profile, life_goals: gls});
                      }} />
                   </div>
                 </div>
              ))}
              
              {profile.life_goals.length < 5 && (
                <button onClick={addGoal} className="flex items-center justify-center gap-2 px-4 py-3 mt-2 rounded-xl border border-dashed border-forest-400 text-forest-600 text-sm font-medium hover:bg-forest-50 transition-colors duration-150">
                  <PlusCircle size={16} /> Add Another Goal (Max 5)
                </button>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
             <div className="border-l-2 border-forest-500 pl-4 mb-6">
                <div className="text-base font-semibold text-slate-800">Assessment Variables</div>
                <div className="text-sm text-slate-500 mt-0.5">Final details needed for your personalized projection</div>
             </div>
             {errors.fire && <div className="text-rose-500 text-sm mb-4 font-medium">{errors.fire}</div>}

             <div className="grid grid-cols-2 gap-5 mb-5">
                <Input label="Existing Inv. Corpus (₹)" errorProp={errors.fire ? " " : undefined} value={profile.existing_investments} onChange={e => setProfile({...profile, existing_investments: e.target.value})} />
                <Input label="Target FIRE Age" errorProp={errors.fire ? " " : undefined} value={profile.fire_target_age} onChange={e => setProfile({...profile, fire_target_age: e.target.value})} />
                <Input label="Dependents" errorProp={errors.fire ? " " : undefined} value={profile.dependents} onChange={e => setProfile({...profile, dependents: e.target.value})} />
             </div>
             
             <div className="mt-6 text-left">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tax Regime</label>
                <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50">
                  <button 
                    type="button"
                    onClick={() => setProfile({...profile, tax_regime: 'old'})} 
                    className={`px-5 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 ${profile.tax_regime === 'old' ? 'text-white bg-forest-600 shadow-sm' : 'text-slate-500 bg-transparent hover:text-slate-700'}`}
                  >
                    Old Regime
                  </button>
                  <button 
                    type="button"
                    onClick={() => setProfile({...profile, tax_regime: 'new'})} 
                    className={`px-5 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 ${profile.tax_regime === 'new' ? 'text-white bg-forest-600 shadow-sm' : 'text-slate-500 bg-transparent hover:text-slate-700'}`}
                  >
                    New Regime
                  </button>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* NAV BUTTONS */}
      <div className="mt-10 pt-6 border-t border-slate-200 flex justify-between items-center">
         {step > 1 ? (
           <button onClick={prevStep} className="text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors">← Back</button>
         ) : <div className="text-xs text-slate-400 max-w-[150px] leading-tight flex-1">Your data isn't saved out of this browser tab securely.</div>}
         
         {step < 3 ? (
           <button onClick={nextStep} className="py-2.5 px-6 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm rounded-xl transition-all duration-150 flex items-center gap-2">Next Step <ChevronRight size={16}/></button>
         ) : (
           <button onClick={handleSubmit} id="btn-generate-plan" className="w-full py-3 px-6 bg-forest-600 hover:bg-forest-700 active:bg-forest-800 text-white font-semibold text-sm rounded-xl transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
             Generate My Plan <ChevronRight size={16} />
           </button>
         )}
      </div>
    </div>
  );
}
