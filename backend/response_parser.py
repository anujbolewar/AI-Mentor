import json
from typing import Dict, Any

def parse_fire_response(raw: str | dict, profile: Any = None) -> dict:
    if isinstance(raw, str):
        data = json.loads(raw)
    else:
        # Some clients auto-parse json if content-type is json, handle dict
        data = raw

    required_keys = [
        "investable_surplus", "goal_sip_allocations", "emergency_fund_target",
        "emergency_fund_gap", "insurance_gap_life", "insurance_gap_health",
        "tax_saving_moves", "monthly_roadmap", "fire_number", "fire_gap",
        "money_health_score"
    ]
    
    for key in required_keys:
        if key not in data:
            if key == "goal_sip_allocations":
                data[key] = []
            else:
                raise ValueError(f"Missing required key in FIRE response: {key}")
            
    if not isinstance(data.get("monthly_roadmap"), list) or len(data["monthly_roadmap"]) != 12:
        raise ValueError("monthly_roadmap must have exactly 12 entries.")
        
    # Validate Health Score fields
    health = data["money_health_score"]
    health_keys = ["overall_score", "score_band", "dimension_scores", "weakest_dimension", "top_3_priority_actions", "comparison_percentile"]
    for hk in health_keys:
        if hk not in health:
            raise ValueError(f"Missing required key in money_health_score: {hk}")
            
    # Standardize Health Score numeric values & inject rules
    health["overall_score"] = int(round(float(health.get("overall_score", 0))))
    if "dimension_scores" in health:
        for dim in health["dimension_scores"]:
            dim["score"] = int(round(float(dim.get("score", 0))))
            
            # Module 2 edge cases override
            if profile:
                d_name_low = dim.get("dimension_name", "").lower()
                
                if profile.existing_investments == 0 and ("retirement" in d_name_low or "diversification" in d_name_low):
                    dim["score"] = 0
                    health["FIRST_TIME_INVESTOR"] = True
                    dim["insight_text"] = "As a first-time investor, your focus should be on building a foundational understanding of the markets and starting your first SIP."
                    dim["top_action"] = "FIRST_TIME_INVESTOR"

                if profile.existing_emi >= profile.monthly_income and ("debt" in d_name_low):
                    dim["score"] = 0
                    health["DEBT_CRISIS"] = True
                    dim["top_action"] = "DEBT_CRISIS"
                    if len(health["top_3_priority_actions"]) > 0:
                        health["top_3_priority_actions"][0] = "Restructure or reduce debt immediately."
                    else:
                        health["top_3_priority_actions"] = ["Restructure or reduce debt immediately."]

    if health["overall_score"] > 95:
        data["warning"] = "VERIFY_INPUTS — Score unusually high. Please confirm investment values are accurate."
        
    return data

# TODO: implement parse_health_response(raw: dict) -> HealthResponse
# TODO: implement parse_portfolio_response(raw: dict) -> PortfolioResponse
