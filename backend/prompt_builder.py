import json
from schemas import FinancialProfile, PortfolioRequest

FIRE_SYSTEM_PROMPT = "You are a SEBI-compliant financial planning engine. You MUST respond only with valid JSON matching the schema provided. Do not include any explanatory text, markdown, or preamble. All monetary values are in INR. Assume Indian tax law, SEBI regulations, and Indian market return rates. Never recommend specific mutual fund scheme names — recommend categories only."

FIRE_SCHEMA = {
    "investable_surplus": "int",
    "goal_sip_allocations": [{"goal_name": "str", "monthly_sip_inr": "int", "asset_class": "str", "equity_pct": "int", "debt_pct": "int", "gold_pct": "int", "projected_corpus": "int"}],
    "emergency_fund_target": "int",
    "emergency_fund_gap": "int",
    "insurance_gap_life": "int",
    "insurance_gap_health": "bool",
    "tax_saving_moves": [{"section": "str", "instrument": "str", "max_limit_inr": "int", "recommended_amount_inr": "int", "estimated_tax_saving_inr": "int"}],
    "monthly_roadmap": [{"month": "int", "action_items": ["str"], "sip_total_inr": "int", "cumulative_corpus_inr": "int"}],
    "fire_number": "int",
    "fire_gap": "int",
    "money_health_score": {
      "overall_score": "int (0–100)",
      "score_band": "critical | needs_attention | on_track | healthy",
      "dimension_scores": [
        {
          "dimension_name": "str",
          "score": "int (0–100)",
          "weight": "float",
          "insight_text": "str",
          "top_action": "str"
        }
      ],
      "weakest_dimension": "str",
      "top_3_priority_actions": ["str", "str", "str"],
      "comparison_percentile": "int"
    }
}

def build_fire_prompt(profile: FinancialProfile) -> tuple[str, str]:
    life_goals_json = json.dumps([goal.model_dump() for goal in profile.life_goals])
    fire_plan_schema_json = json.dumps(FIRE_SCHEMA)
    
    user_prompt = f"""Generate a FIRE financial plan for the following profile:
 age: {profile.age}, monthly_income: {profile.monthly_income}, monthly_expenses: {profile.monthly_expenses}, existing_investments: {profile.existing_investments}, existing_emi: {profile.existing_emi}, dependents: {profile.dependents}, fire_target_age: {profile.fire_target_age}, tax_regime: {profile.tax_regime}, life_goals: {life_goals_json}
 
 Additionally, generate a Money Health Score within the same JSON response under the `money_health_score` key.
 Use the following 6 dimensions to score:
  1. Emergency Preparedness (weight 0.20): min(100, (existing_investments * 0.10) / (6 * monthly_expenses) * 100)
  2. Insurance Coverage (weight 0.20): life score = (actual_cover / recommended_cover) * 50; health = bool flag * 50; actual_cover = existing_investments (proxy); recommended_cover = 20 * monthly_income * 12
  3. Investment Diversification (weight 0.15): Herfindahl-based; 0 if no investments, 100 if fully diversified. For first-time investors (existing_investments = 0): score = 0, append the exact flag string FIRST_TIME_INVESTOR to the top_action field.
  4. Debt Health (weight 0.15): max(0, 100 - (existing_emi / monthly_income * 300)). If debt causes negative: cap at 0, append the exact flag string DEBT_CRISIS to the top_action field.
  5. Tax Efficiency (weight 0.15): claimed_deductions / 150000 * 100 (proxy: 0 for new regime, estimate for old).
  6. Retirement Readiness (weight 0.15): existing_investments / fire_number * 100 where fire_number = 25 * monthly_expenses * 12.

 Score band mapping: 0–39 = critical, 40–59 = needs_attention, 60–79 = on_track, 80–100 = healthy. 
 The comparison_percentile should be heuristically computed from the score bands.
 
 Return a JSON object matching this exact schema: {fire_plan_schema_json}"""
    
    return FIRE_SYSTEM_PROMPT, user_prompt

# TODO: implement build_health_prompts(profile: FinancialProfile) -> tuple[str, str]
# TODO: implement build_portfolio_prompts(request: PortfolioRequest) -> tuple[str, str]
