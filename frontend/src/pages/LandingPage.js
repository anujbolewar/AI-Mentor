import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, Activity, PieChart, ChevronRight, 
  Shield, Zap, TrendingUp, Award 
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 font-sans selection:bg-forest-100 selection:text-forest-900">
      {/* SECTION 2: Hero - pt-32 added to account for fixed global nav */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-up">
            <span className="label inline-block bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">ET Gen AI Hackathon 2026 · Problem Statement 9</span>
            <h1 className="mt-4 text-5xl leading-tight display-heading">
              <span className="text-slate-900">Financial clarity</span> <br />
              <span className="text-forest-600">for every Indian.</span>
            </h1>
            <p className="mt-5 max-w-md body-text text-base">
              95% of India's 500M+ working population has no financial plan. AI Money Mentor changes that — three modules, five minutes, zero advisor fees.
            </p>
            
            <div className="mt-8 flex gap-4 flex-wrap">
              <span className="bg-white border border-slate-200 rounded-full px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">₹18,000+ avg tax savings surfaced</span>
              <span className="bg-white border border-slate-200 rounded-full px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">&lt; 8 seconds to first plan</span>
              <span className="bg-white border border-slate-200 rounded-full px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">SEBI category-only outputs</span>
            </div>

            <button 
              onClick={() => navigate('/app')}
              className="mt-8 flex items-center gap-2 bg-forest-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-forest-700 hover:shadow-xl hover:shadow-forest-900/20 transition-all group active:scale-[0.98] shadow-lg shadow-forest-900/10"
            >
              Build My Free Plan
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="relative animate-slide-in" style={{ animationDelay: '300ms' }}>
            <div className="card p-6 max-w-sm ml-auto">
              <div className="label mb-2">Money Health Score</div>
              <div className="flex flex-col">
                <span className="value-large text-forest-600">74</span>
                <span className="label text-forest-600 font-bold">On Track</span>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-600">Emergency Fund</span>
                  <div className="flex items-center gap-3 w-32">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-forest-500 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">61</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-600">Insurance Cover</span>
                  <div className="flex items-center gap-3 w-32">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-400 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">42</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                  <span className="text-xs font-semibold text-slate-600">Retirement Path</span>
                  <div className="flex items-center gap-3 w-32">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-navy-500 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">80</span>
                  </div>
                </div>
              </div>
              
              <div className="text-[10px] text-slate-400 italic mt-3 pt-3 border-t border-slate-50">
                Generated from your financial profile in 6.2 seconds
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: "How It Works" Timeline */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="display-heading text-4xl text-center text-slate-900 mb-20">Three steps to financial clarity</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 max-w-5xl mx-auto relative group">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-slate-200 z-0"></div>
            
            {[
              { num: "1", title: "Enter your profile", body: "Age, income, goals, tax regime. 9 fields. Under 5 minutes." },
              { num: "2", title: "AI builds your roadmap", body: "Claude analyzes your inputs and returns a JSON-structured 12-month FIRE plan." },
              { num: "3", title: "Act on clear numbers", body: "See exact SIP amounts, insurance gaps, and tax moves — down to the rupee." }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-2 border-forest-200 bg-forest-50 flex items-center justify-center shadow-inner group-hover:border-forest-300 transition-colors duration-500">
                  <span className="text-forest-700 font-serif italic text-2xl leading-none">{step.num}</span>
                </div>
                <h3 className="mt-5 text-base font-semibold text-slate-800 text-center">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-500 text-center max-w-[240px] leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Three Module CTAs */}
      <section id="features" className="py-24 bg-cream-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="display-heading text-4xl text-slate-900 text-center mb-16">Everything you need, nothing you don't</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div onClick={() => navigate('/app')} className="card p-8 hover:shadow-md transition-shadow duration-200 cursor-pointer group">
              <Target className="w-6 h-6 text-forest-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900">FIRE Path Planner</h3>
              <p className="body-text mt-2 text-slate-500">
                Month-by-month investment roadmap. Goal-specific SIP amounts. Tax moves. Insurance gap flags. One plan, all your goals.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="label text-[10px]">12-month roadmap · asset allocation · tax moves</span>
                <ChevronRight className="w-4 h-4 text-forest-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div onClick={() => navigate('/app')} className="card p-8 hover:shadow-md transition-shadow duration-200 cursor-pointer group">
              <Activity className="w-6 h-6 text-forest-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900">Money Health Score</h3>
              <p className="body-text mt-2 text-slate-500">
                6-dimension financial wellness scorecard. Emergency fund, insurance, debt, tax, diversification, retirement — all scored.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="label text-[10px]">6 dimensions · 0–100 score · priority actions</span>
                <ChevronRight className="w-4 h-4 text-forest-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div onClick={() => navigate('/app')} className="card p-8 hover:shadow-md transition-shadow duration-200 cursor-pointer group">
              <PieChart className="w-6 h-6 text-forest-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900">Portfolio Analyzer</h3>
              <p className="body-text mt-2 text-slate-500">
                Upload your CAMS or NSDL statement. AI maps your holdings, flags concentration risks, and gives a rebalancing plan.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="label text-[10px]">PDF upload · RAG pipeline · SEBI-safe output</span>
                <ChevronRight className="w-4 h-4 text-forest-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: "Built On" Trust Banner */}
      <section id="built-on" className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="label mb-8">Powered by</div>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <div className="px-6 py-3 border border-slate-200 rounded-xl bg-cream-50 flex items-center gap-2 hover:border-slate-300 transition-colors">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-sm font-semibold text-slate-600">Claude AI by Anthropic</span>
            </div>
            <div className="px-6 py-3 border border-slate-200 rounded-xl bg-cream-50 flex items-center gap-2 hover:border-slate-300 transition-colors">
              <Shield className="w-3.5 h-3.5 text-forest-600" />
              <span className="text-sm font-semibold text-slate-600">SEBI Category-Only Outputs</span>
            </div>
            <div className="px-6 py-3 border border-slate-200 rounded-xl bg-cream-50 flex items-center gap-2 hover:border-slate-300 transition-colors">
              <Award className="w-3.5 h-3.5 text-navy-500" />
              <span className="text-sm font-semibold text-slate-600">ET Gen AI Hackathon 2026</span>
            </div>
            <div className="px-6 py-3 border border-slate-200 rounded-xl bg-cream-50 flex items-center gap-2 hover:border-slate-300 transition-colors">
              <TrendingUp className="w-3.5 h-3.5 text-forest-600" />
              <span className="text-sm font-semibold text-slate-600">FastAPI + React</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-lg tracking-tight leading-none">AI Money</span>
              <span className="font-serif italic text-forest-400 text-lg leading-none">Mentor</span>
            </div>
            <p className="text-xs mt-4 leading-relaxed max-w-xs">
              Financial planning for the 95% of Indians who have none. Built with the belief that everyone deserves a roadmap.
            </p>
            <p className="text-[10px] text-slate-500 mt-6 pt-6 border-t border-slate-800 font-medium">
              &copy; 2026 Team YCCE AI/ML · ET Gen AI Hackathon Submission
            </p>
          </div>

          <div className="flex flex-col gap-6">
             <div className="label text-slate-200 font-bold">Product</div>
             <div className="flex flex-col gap-3">
               {['FIRE Path Planner', 'Money Health Score', 'Portfolio Analyzer', 'Learn', 'How it works'].map((link, i) => (
                 <button 
                  key={i} 
                  onClick={() => {
                    if (i === 4) scrollToSection('how-it-works');
                    else if (i === 3) navigate('/learn');
                    else navigate('/app');
                  }}
                  className={`text-left text-sm hover:text-white transition-colors ${i === 3 ? 'text-forest-400 font-semibold' : ''}`}
                >
                   {link}
                 </button>
               ))}
             </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="label text-slate-200 font-bold">Legal</div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
              This tool is for educational and informational purposes only. It is not investment advice. 
              AI Money Mentor is not a SEBI-registered investment advisor. All outputs use SEBI asset 
              category names only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
