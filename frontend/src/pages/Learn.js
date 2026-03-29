import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, ChevronRight, PieChart } from 'lucide-react';

const GLOSSARY = [
  { term: "SIP", category: "Investing", short: "Systematic Investment Plan", body: "A method of investing a fixed amount in a mutual fund at regular intervals (monthly). Like a recurring deposit, but into equity or debt funds. SIPs leverage rupee-cost averaging — you buy more units when markets fall and fewer when they rise." },
  { term: "XIRR", category: "Investing", short: "Extended Internal Rate of Return", body: "The true annual return on an investment that had multiple cash flows at different times. More accurate than simple CAGR for SIPs, because SIPs have irregular investments. If your SIP XIRR is 14%, you're compounding at 14% per year." },
  { term: "ELSS", category: "Tax", short: "Equity Linked Savings Scheme", body: "A type of mutual fund that qualifies for tax deduction under Section 80C (up to ₹1.5L per year). Mandatory 3-year lock-in (shortest among 80C instruments). Invests in equity — higher risk, higher return potential than PPF or NSC." },
  { term: "Section 80C", category: "Tax", short: "India's most popular tax deduction", body: "Allows you to deduct up to ₹1,50,000 from your taxable income. Instruments: ELSS, PPF, EPF, life insurance premiums, home loan principal, NSC, Sukanya Samriddhi, ULIP. Available only under the Old Tax Regime." },
  { term: "NPS (80CCD 1B)", category: "Tax", short: "Extra ₹50,000 deduction via NPS", body: "National Pension System contributions up to ₹50,000 extra (beyond the 80C limit) can be deducted under 80CCD(1B). So an Old Regime taxpayer can deduct ₹2L total (₹1.5L via 80C + ₹50K via NPS). Corpus is locked until retirement." },
  { term: "FIRE Number", category: "Retirement", short: "Your financial independence target", body: "The corpus you need at retirement to never work again. Calculated as 25× your annual expenses (based on the 4% Safe Withdrawal Rate). If you spend ₹8L/year, your FIRE number is ₹2 crore. The 4% rule assumes the corpus lasts 30+ years." },
  { term: "Expense Ratio", category: "Mutual Funds", short: "The annual fee a fund charges", body: "Expressed as a % of your invested amount deducted annually. A Direct Plan ELSS with 0.8% expense ratio costs ₹800/year on ₹1L invested. Regular plans charge 0.5–1% more than Direct (this goes to distributors as commission). Over 20 years, 1% extra fee can cost you 20% of your corpus." },
  { term: "Direct vs Regular Plan", category: "Mutual Funds", short: "Same fund, very different costs", body: "Every mutual fund has two variants. Regular plans pay your distributor a trail commission (0.5–1% p.a.) from your returns. Direct plans have no intermediary — you buy from the fund house directly (via CAMS, MFCentral, or the AMC website). Over 10 years on ₹10L, Direct plans can generate ₹3–6L more than Regular." },
  { term: "CAMS CAS", category: "Mutual Funds", short: "Consolidated Account Statement", body: "A single PDF from CAMS (Computer Age Management Services) listing ALL your mutual fund holdings across all fund houses, in one place. Download it free at cams.com by entering your PAN and email. This is exactly what AI Money Mentor's Portfolio Analyzer reads." },
  { term: "Term Insurance", category: "Insurance", short: "Pure life cover, zero investment", body: "Pays a lump sum to your family if you die during the policy term. No maturity benefit — you pay only for the cover, not investment. ₹1 crore term cover for a 30-year-old costs ~₹8,000–12,000/year. The recommended cover is 20× your annual income. Avoid ULIPs and endowment plans — they mix insurance with investment, doing both poorly." },
  { term: "Old vs New Tax Regime", category: "Tax", short: "India's two income tax structures", body: "Old Regime: Higher base rates but allows deductions (80C, 80D, HRA, LTA, home loan interest etc.). New Regime: Lower rates, no deductions. Best for you depends on your deductions. If your 80C + 80D + HRA + home loan interest > ~₹3.75L, Old Regime usually saves more tax. AI Money Mentor shows you which is better based on your inputs." },
  { term: "Asset Allocation", category: "Investing", short: "How you split money across asset types", body: "Dividing your investments between Equity (stocks/equity MFs), Debt (bonds/debt MFs), and Gold. Rule of thumb: subtract your age from 100 to get your equity %. A 28-year-old → 72% equity. Shorter goals → more debt. Longer goals → more equity. AI Money Mentor auto-calculates this per goal." },
  { term: "Herfindahl Index", category: "Investing", short: "A measure of concentration risk", body: "A formula that measures how concentrated your portfolio is. Score of 0 = perfectly diversified across many assets. Score of 1 = 100% in one asset (maximum risk). AI Money Mentor uses this internally to compute your Diversification score in the Money Health Score module." },
  { term: "Emergency Fund", category: "Investing", short: "Your financial airbag", body: "3–6 months of your monthly expenses kept in liquid form (savings account, liquid MF, or short-duration debt fund). Not for investing — for sudden job loss, medical emergency, or urgent repair. AI Money Mentor flags your emergency fund gap and includes it in Month 1 of your FIRE roadmap." },
];

const CATEGORIES = ["All", "Tax", "Investing", "Insurance", "Retirement", "Mutual Funds"];

const getCategoryColor = (cat) => {
  const map = {
    Tax: "bg-navy-100 text-navy-700",
    Investing: "bg-forest-100 text-forest-700",
    Insurance: "bg-rose-100 text-rose-700",
    Retirement: "bg-amber-100 text-amber-700",
    "Mutual Funds": "bg-slate-100 text-slate-700",
  };
  return map[cat] || "bg-slate-100 text-slate-700";
};

export default function Learn() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedTerm, setExpandedTerm] = useState(null);

  const filteredItems = GLOSSARY.filter((item) => {
    const matchesSearch = item.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleTerm = (term) => {
    setExpandedTerm(expandedTerm === term ? null : term);
  };

  return (
    <div className="min-h-screen bg-cream-50 font-sans selection:bg-forest-100 selection:text-forest-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <PieChart className="text-forest-600" size={24} />
            <span className="font-sans font-semibold text-slate-800 text-xl tracking-tight">AI Money</span>
            <span className="font-serif italic text-forest-600 text-xl leading-none">Mentor</span>
          </div>
          <button onClick={() => navigate("/app")} className="text-sm font-semibold text-forest-600 hover:text-forest-700">Dashboard</button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-32 animate-fade-in">
        <header className="mb-12">
          <h1 className="display-heading text-4xl italic text-slate-900">The Money Mentor</h1>
          <h2 className="display-heading text-4xl italic text-forest-600 mt-1">Glossary</h2>
          <p className="body-text mt-3 max-w-xl text-slate-500 font-medium leading-relaxed">
            Plain-English explanations for every financial term we use. No jargon, no selling.
          </p>
        </header>

        {/* Search Box */}
        <div className="relative mt-8 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-forest-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search terms... e.g. 'ELSS', 'XIRR', 'SIP'"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-forest-500 focus:ring-4 focus:ring-forest-500/10 transition-all duration-200 shadow-sm"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition-all duration-200 ${
                activeCategory === cat 
                  ? "bg-forest-600 text-white border-forest-600 shadow-md shadow-forest-900/10 scale-105" 
                  : "bg-white text-slate-600 border-slate-300 hover:border-forest-400 hover:text-forest-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Glossary Items */}
        <div className="mt-8 divide-y divide-slate-100 border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.term} className="transition-all duration-200">
                <div 
                  className={`flex items-center justify-between px-6 py-5 cursor-pointer transition-colors duration-200 ${expandedTerm === item.term ? 'bg-cream-50' : 'hover:bg-cream-100/50'}`}
                  onClick={() => toggleTerm(item.term)}
                >
                  <div className="flex items-center flex-1">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase whitespace-nowrap ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                    <span className="text-base font-semibold text-slate-900 ml-4">{item.term}</span>
                    <span className="text-xs text-slate-400 ml-3 hidden sm:inline font-medium opacity-80">{item.short}</span>
                  </div>
                  <ChevronDown 
                    className={`text-slate-400 transition-transform duration-300 ${expandedTerm === item.term ? 'rotate-180 text-forest-500' : ''}`} 
                    size={16} 
                  />
                </div>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedTerm === item.term ? 'max-h-[300px] opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-6 pb-6 pt-4 bg-cream-50/50">
                    <p className="body-text text-sm text-slate-600 font-medium leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="text-slate-300 mb-4 flex justify-center">
                <Search size={40} strokeWidth={1.5} />
              </div>
              <h3 className="display-heading text-xl text-slate-400 italic">No terms matched your search</h3>
              <p className="body-text text-sm text-slate-400 mt-1">Try "SIP", "ELSS", or "FIRE" for common terms.</p>
              <button 
                onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                className="mt-6 text-sm font-semibold text-forest-600 hover:text-forest-700 underline underline-offset-4"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2" onClick={() => navigate("/")}>
            <span className="font-sans font-semibold text-slate-800 text-lg tracking-tight">AI Money</span>
            <span className="font-serif italic text-forest-600 text-lg leading-none">Mentor</span>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={() => navigate("/")} className="text-sm font-medium text-slate-500 hover:text-forest-600">Home</button>
            <button onClick={() => navigate("/app")} className="text-sm font-medium text-slate-500 hover:text-forest-600">Dashboard</button>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Learn</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
