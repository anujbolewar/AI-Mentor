import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  PieChart, Target, Activity, 
  Settings, BookOpen, ChevronRight 
} from 'lucide-react';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = location.pathname === '/';
  const isApp = location.pathname === '/app';
  const activeTab = searchParams.get('tab') || 'fire';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const TABS = [
    { id: 'fire', label: 'FIRE Plan', icon: <Target size={18} /> },
    { id: 'health', label: 'Health Score', icon: <Activity size={18} /> },
    { id: 'portfolio', label: 'Portfolio', icon: <PieChart size={18} /> },
  ];

  const setActiveTab = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-cream-50/90 backdrop-blur-sm border-b border-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        
        {/* LEFT: Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => navigate('/')}
        >
          <PieChart className="text-forest-600 group-hover:rotate-12 transition-transform" size={24} />
          <span className="font-sans font-semibold text-slate-800 text-xl tracking-tight leading-none">AI Money</span>
          <span className="font-serif italic text-forest-600 text-xl leading-none">Mentor</span>
        </div>

        {/* MIDDLE: Module Tabs (only on /app) */}
        {isApp && (
          <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  activeTab === tab.id 
                    ? "bg-white text-forest-700 shadow-sm" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* RIGHT: Global Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/learn')}
            title="Financial Glossary"
            className={`p-2 rounded-lg transition-colors ${location.pathname === '/learn' ? 'bg-forest-50 text-forest-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
          >
            <BookOpen size={18} />
          </button>
          
          <button 
            onClick={() => navigate('/settings')}
            title="Settings"
            className={`p-2 rounded-lg transition-colors ${location.pathname === '/settings' ? 'bg-forest-50 text-forest-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
          >
            <Settings size={18} />
          </button>

          {isHome && (
            <button 
              onClick={() => navigate('/app')}
              className="ml-2 hidden sm:flex items-center gap-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
            >
              Get Started <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
