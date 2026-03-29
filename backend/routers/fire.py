from fastapi import APIRouter, HTTPException
from schemas import FinancialProfile
from prompt_builder import build_fire_prompt
from response_parser import parse_fire_response
from claude_client import call_claude
from fastapi.responses import JSONResponse
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/analyze")
async def analyze_fire_profile(profile: FinancialProfile):
    system_prompt, user_prompt = build_fire_prompt(profile)

    if profile.age > 55 and (profile.fire_target_age - profile.age) < 5:
        user_prompt += "\n\nCRITICAL EDGE CASE: User is in SHORT_HORIZON_MODE. Reduce plan to 3-year horizon. Skip long-horizon equity allocation."

    if profile.monthly_income - profile.monthly_expenses - profile.existing_emi < 500:
        user_prompt += "\n\nCRITICAL EDGE CASE: Surplus under ₹500/month. Skip SIP allocations. Prioritize emergency fund only."

    try:
        raw_response = await call_claude(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=4096
        )
        parsed_data = parse_fire_response(raw_response, profile)
        if profile.age > 55 and (profile.fire_target_age - profile.age) < 5:
            parsed_data["SHORT_HORIZON_MODE"] = True
            
        if profile.monthly_income - profile.monthly_expenses - profile.existing_emi < 500:
            parsed_data["warning"] = "LOW_SURPLUS"
            parsed_data["message"] = "Surplus under ₹500/month. Plan will prioritize emergency fund only."
            
        return parsed_data
        
    except HTTPException as e:
        # If call_claude raises 503, we transform/bubble it up. Actually requirement says:
        # On timeout: return 504 {"error": "AI_TIMEOUT", "fallback_available": false}
        # But wait, anyio timeout? Timeout might throw a different exception.
        # But let's map anthropic / timeout to 504 exactly.
        raise e
    except Exception as e:
        # check if it's a timeout error
        error_str = str(e).lower()
        if "timeout" in error_str or "readTimeout" in error_str:
            return JSONResponse(
                status_code=504,
                content={"error": "AI_TIMEOUT", "fallback_available": False}
            )
        
        # If it's a JSON/parsing error due to bad Claude format that passed claude_client retries:
        logger.error(f"Error during AI analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))
