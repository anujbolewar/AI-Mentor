import React from "react";
import { useSearchParams } from "react-router-dom";
import FireModule from "../modules/FireModule";
import HealthModule from "../modules/HealthModule";
import PortfolioModule from "../modules/PortfolioModule";

const TABS = [
  {
    id: "fire",
    component: <FireModule />,
  },
  {
    id: "health",
    component: <HealthModule />,
  },
  {
    id: "portfolio",
    component: <PortfolioModule />,
  },
];

const VALID_TABS = TABS.map((t) => t.id);

export default function Dashboard() {
  const [searchParams] = useSearchParams();

  // Read active tab from URL — default to first tab
  const rawTab = searchParams.get("tab");
  const activeTab = VALID_TABS.includes(rawTab) ? rawTab : TABS[0].id;

  const activeModule = TABS.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen flex flex-col pt-20 bg-cream-50">
      {/* ── TAB PANEL ── */}
      <main className="flex-1 px-6 py-6 max-w-6xl mx-auto w-full">
        <div
          id={`tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="animate-fade-in"
        >
          {activeModule?.component}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="text-center py-10 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
        AI Money Mentor · Licensed for ET Gen AI Hackathon 2026 · Not SEBI Registered
      </footer>
    </div>
  );
}
