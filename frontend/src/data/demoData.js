export const DEMO_PROFILE = {
  age: 29,
  monthly_income: 125000,
  monthly_expenses: 58000,
  existing_investments: 340000,
  existing_emi: 12000,
  dependents: 0,
  life_goals: [
    { name: "Buy a home in Pune", target_amount: 2500000, target_years: 5 },
    { name: "FIRE corpus", target_amount: 30000000, target_years: 21 }
  ],
  fire_target_age: 50,
  tax_regime: "old"
};

export const DEMO_FIRE_RESPONSE = {
  "investable_surplus": 55000,
  "goal_sip_allocations": [
    { "goal_name": "Buy a home in Pune", "monthly_sip_inr": 32000, "asset_class": "Debt-oriented Hybrid", "equity_pct": 40, "debt_pct": 50, "gold_pct": 10, "projected_corpus": 2618000 },
    { "goal_name": "FIRE corpus", "monthly_sip_inr": 18000, "asset_class": "Equity", "equity_pct": 80, "debt_pct": 15, "gold_pct": 5, "projected_corpus": 31400000 }
  ],
  "emergency_fund_target": 348000,
  "emergency_fund_gap": 9000,
  "insurance_gap_life": 26500000,
  "insurance_gap_health": true,
  "tax_saving_moves": [
    { "section": "80C", "instrument": "ELSS Mutual Fund", "max_limit_inr": 150000, "recommended_amount_inr": 126000, "estimated_tax_saving_inr": 37800 },
    { "section": "80CCD(1B)", "instrument": "National Pension System", "max_limit_inr": 50000, "recommended_amount_inr": 50000, "estimated_tax_saving_inr": 15000 }
  ],
  "monthly_roadmap": [
    { "month": 1, "action_items": ["Open ELSS SIP of ₹10,500/month", "Buy ₹1Cr term insurance policy", "Close emergency fund gap (₹9,000 lump sum to liquid fund)"], "sip_total_inr": 50000, "cumulative_corpus_inr": 390000 },
    { "month": 2, "action_items": ["Start home-goal SIP in balanced advantage fund", "Activate NPS Tier-1 account for 80CCD(1B)"], "sip_total_inr": 50000, "cumulative_corpus_inr": 445000 },
    { "month": 3, "action_items": ["Review and submit Form 12BB to employer for HRA declaration", "Confirm SIP mandates are active on bank portal"], "sip_total_inr": 50000, "cumulative_corpus_inr": 501000 },
    { "month": 4, "action_items": ["Check Q1 NAV drift — rebalance if equity > 85%"], "sip_total_inr": 50000, "cumulative_corpus_inr": 558000 },
    { "month": 5, "action_items": ["Review home loan pre-qualification requirements", "Increase SIP by 10% if appraisal received"], "sip_total_inr": 50000, "cumulative_corpus_inr": 616000 },
    { "month": 6, "action_items": ["Advance tax payment due (if freelance income > ₹10K)", "Half-year portfolio review"], "sip_total_inr": 50000, "cumulative_corpus_inr": 675000 },
    { "month": 7, "action_items": ["Ensure health insurance floater covers self + parents"], "sip_total_inr": 50000, "cumulative_corpus_inr": 735000 },
    { "month": 8, "action_items": ["Review home corpus vs target — on track at ₹7.35L of ₹25L needed"], "sip_total_inr": 50000, "cumulative_corpus_inr": 796000 },
    { "month": 9, "action_items": ["Collect Form 16A from banks for FD interest TDS credit"], "sip_total_inr": 50000, "cumulative_corpus_inr": 858000 },
    { "month": 10, "action_items": ["Year-end tax planning: maximize 80C before March", "Check ELSS lock-in maturity schedule"], "sip_total_inr": 50000, "cumulative_corpus_inr": 921000 },
    { "month": 11, "action_items": ["File advance tax Q3 installment if applicable"], "sip_total_inr": 50000, "cumulative_corpus_inr": 985000 },
    { "month": 12, "action_items": ["File ITR by July 31", "Annual SIP step-up: increase by 10% for Year 2"], "sip_total_inr": 50000, "cumulative_corpus_inr": 1050000 }
  ],
  "fire_number": 17400000,
  "fire_gap": 17060000,
  "money_health_score": {
    "overall_score": 63,
    "score_band": "on_track",
    "dimension_scores": [
      { "dimension_name": "Emergency Preparedness", "score": 98, "weight": 0.20, "insight_text": "Emergency fund is nearly fully funded. Well done — this is the first building block.", "top_action": "Invest the final ₹9,000 gap into a liquid mutual fund this month." },
      { "dimension_name": "Insurance Coverage", "score": 28, "weight": 0.20, "insight_text": "Critical gap: recommended life cover is ₹2.65Cr but current proxy cover is significantly lower.", "top_action": "Buy a ₹1–1.5Cr term insurance policy immediately. Annual premium is ~₹9,000–12,000." },
      { "dimension_name": "Investment Diversification", "score": 62, "weight": 0.15, "insight_text": "Investments are moderate — concentrated in equity. No gold or debt exposure detected.", "top_action": "Add 10% allocation to a Debt-Short fund for goal < 3 years." },
      { "dimension_name": "Debt Health", "score": 90, "weight": 0.15, "insight_text": "EMI-to-income ratio is 9.6% — well within the safe 30% threshold. Excellent debt position.", "top_action": "Maintain current EMI discipline. Avoid adding new EMIs before home loan." },
      { "dimension_name": "Tax Efficiency", "score": 44, "weight": 0.15, "insight_text": "An estimated ₹52,800 in total tax savings are currently unclaimed across 80C and 80CCD(1B).", "top_action": "Start ELSS SIP of ₹10,500/month to maximize 80C. Open NPS Tier-1 for extra ₹50K deduction." },
      { "dimension_name": "Retirement Readiness", "score": 58, "weight": 0.15, "insight_text": "At current savings rate, FIRE corpus reaches target in approximately 20.8 years — on schedule for age 50.", "top_action": "Maintain ₹18,000/month FIRE SIP. Step up 10% annually to stay on track." }
    ],
    "weakest_dimension": "Insurance Coverage",
    "top_3_priority_actions": [
      "Buy ₹1–1.5Cr term insurance policy this month (~₹9,000/year). Your family has zero coverage today.",
      "Claim ₹52,800 in missed tax deductions by starting ELSS SIP and opening NPS Tier-1.",
      "Add a Debt-Short fund SIP (10% of investable surplus) to reduce equity concentration risk."
    ],
    "comparison_percentile": 71
  }
};

export const DEMO_PORTFOLIO_RESPONSE = {
  "portfolio_total_value": 847500,
  "holdings_count": 9,
  "asset_class_breakdown": [
    { "asset_class": "Large Cap", "value_inr": 320000, "current_pct": 37.8, "target_pct_for_risk_profile": 25.0, "gap_pct": 12.8 },
    { "asset_class": "Mid Cap", "value_inr": 185000, "current_pct": 21.8, "target_pct_for_risk_profile": 20.0, "gap_pct": 1.8 },
    { "asset_class": "ELSS", "value_inr": 95000, "current_pct": 11.2, "target_pct_for_risk_profile": 15.0, "gap_pct": -3.8 },
    { "asset_class": "Debt-Short", "value_inr": 147500, "current_pct": 17.4, "target_pct_for_risk_profile": 20.0, "gap_pct": -2.6 },
    { "asset_class": "Gold", "value_inr": 65000, "current_pct": 7.7, "target_pct_for_risk_profile": 10.0, "gap_pct": -2.3 },
    { "asset_class": "International", "value_inr": 35000, "current_pct": 4.1, "target_pct_for_risk_profile": 10.0, "gap_pct": -5.9 }
  ],
  "concentration_flags": [
    { "category_label": "Large Cap overweight", "value_inr": 320000, "percentage": 37.8, "severity": "warning", "reason": "Large Cap allocation is 12.8% above target for a Moderate risk profile. Reduces return potential without improving stability meaningfully." },
    { "category_label": "Regular plan detected in 5 of 9 holdings", "value_inr": 620000, "percentage": 73.2, "severity": "critical", "reason": "5 holdings are Regular plans paying distributor commissions of ~1% annually. On ₹6.2L invested, this is approximately ₹6,200/year in avoidable fees — ₹1.8L over 30 years at current corpus size." }
  ],
  "rebalancing_actions": [
    { "action_type": "reduce", "asset_class": "Large Cap", "current_pct": 37.8, "target_pct": 25.0, "rationale_text": "Reduce Large Cap exposure by ~₹1.08L to align with Moderate benchmark. Redeploy into International equity to fill the 5.9% gap." },
    { "action_type": "add", "asset_class": "International", "current_pct": 4.1, "target_pct": 10.0, "rationale_text": "International (Nasdaq/S&P500 index) is underrepresented. Adding ~₹50,000 brings geographic diversification and USD exposure." },
    { "action_type": "increase", "asset_class": "ELSS", "current_pct": 11.2, "target_pct": 15.0, "rationale_text": "Increase ELSS allocation by ~₹32,000 to claim additional 80C deduction headroom and improve tax efficiency score." }
  ],
  "tax_efficiency_score": 23,
  "missing_asset_classes": ["Small Cap", "Sectoral/Thematic"],
  "overall_health": "moderately_concentrated",
  "top_3_actions": [
    "Switch 5 Regular plan holdings to Direct equivalents immediately — saves ~₹6,200/year in fees with zero change in fund strategy.",
    "Reduce Large Cap from 37.8% to 25% and redeploy into International index funds to improve geographic diversification.",
    "Increase ELSS SIP by ₹2,700/month to maximize 80C and raise tax efficiency score from 23 to 68."
  ],
  "partial_analysis_warning": null
};
