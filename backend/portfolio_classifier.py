import re
import anyio
import json
from claude_client import _make_request

def clean_fund_name(raw_name: str) -> str:
    """Strip common MF statement noise before matching."""
    import re
    noise_patterns = [
        r'\s*-\s*(direct|regular)\s*(plan)?',
        r'\s*-\s*(growth|idcw|dividend|payout|reinvestment)',
        r'\s*-\s*(option|plan)',
        r'\s*(growth|idcw|dividend)\s*$',
        r'\s*\(.*?\)',          # anything in parentheses
        r'\s+-\s+$',           # trailing dash
    ]
    name = raw_name.strip().lower()
    for pat in noise_patterns:
        name = re.sub(pat, '', name, flags=re.IGNORECASE)
    return name.strip()

FUND_LOOKUP = {
    # Large Cap
    "nifty 50 index": "Index", "nifty next 50": "Index", "sensex index": "Index",
    "large cap": "Large Cap", "bluechip": "Large Cap", "top 100": "Large Cap",
    "frontline equity": "Large Cap",
    # Mid Cap
    "mid cap": "Mid Cap", "midcap": "Mid Cap",
    # Small Cap
    "small cap": "Small Cap", "smallcap": "Small Cap",
    # Flexi / Multi
    "flexi cap": "Flexi Cap", "flexicap": "Flexi Cap", "multi cap": "Flexi Cap",
    # ELSS
    "elss": "ELSS", "tax saver": "ELSS", "taxsaver": "ELSS", "long term equity": "ELSS",
    # Hybrid
    "hybrid": "Hybrid", "balanced advantage": "Hybrid", "aggressive hybrid": "Hybrid",
    "equity savings": "Hybrid",
    # Debt
    "liquid": "Debt-Short", "overnight": "Debt-Short", "ultra short": "Debt-Short",
    "low duration": "Debt-Short", "money market": "Debt-Short",
    "short duration": "Debt-Short", "banking and psu": "Debt-Short",
    "corporate bond": "Debt-Long", "gilt": "Debt-Long", "long duration": "Debt-Long",
    "dynamic bond": "Debt-Long", "credit risk": "Debt-Long",
    # Gold & Commodities
    "gold": "Gold", "silver": "Commodities",
    # International
    "nasdaq": "International", "s&p 500": "International", "sp500": "International",
    "us equity": "International", "global": "International", "overseas": "International",
    "international": "International", "world": "International",
    # Sectoral / Thematic
    "pharma": "Sectoral/Thematic", "healthcare": "Sectoral/Thematic",
    "technology": "Sectoral/Thematic", "tech": "Sectoral/Thematic",
    "banking": "Sectoral/Thematic", "bank": "Sectoral/Thematic",
    "psu": "Sectoral/Thematic", "infrastructure": "Sectoral/Thematic",
    "consumption": "Sectoral/Thematic", "mnc": "Sectoral/Thematic",
    "energy": "Sectoral/Thematic", "auto": "Sectoral/Thematic",
    # Index (non-Nifty-50)
    "index": "Index", "etf": "Index",
}

VALID_CATEGORIES = [
    "ELSS", "Large Cap", "Mid Cap", "Small Cap", "Flexi Cap", 
    "Debt-Short", "Debt-Long", "Hybrid", "Gold", "Index", 
    "International", "Sectoral/Thematic", "Commodities", "Other"
]

_classification_cache: dict[str, str] = {}

async def classify_fund(fund_name: str) -> str:
    """Classifies a single fund name (for backwards compatibility)."""
    # 1. Clean
    cleaned = clean_fund_name(fund_name)
    
    # 2. Check cache
    if cleaned in _classification_cache:
        return _classification_cache[cleaned]
    
    # 3. Try FUND_LOOKUP keyword match
    for key, cat in FUND_LOOKUP.items():
        if key in cleaned:
            _classification_cache[cleaned] = cat
            return cat
            
    # 4. Fallback to Claude (via batch with single element)
    res = await classify_funds_batch([fund_name])
    return res.get(fund_name, "Other")

async def classify_funds_batch(fund_names: list[str]) -> dict[str, str]:
    """Classifies multiple fund names efficiently."""
    results = {}
    unknown_list = []
    
    for original_name in fund_names:
        cleaned = clean_fund_name(original_name)
        
        # Check cache
        if cleaned in _classification_cache:
            results[original_name] = _classification_cache[cleaned]
            continue
            
        # Check FUND_LOOKUP
        found_category = None
        for key, cat in FUND_LOOKUP.items():
            if key in cleaned:
                found_category = cat
                break
        
        if found_category:
            results[original_name] = found_category
            _classification_cache[cleaned] = found_category
        else:
            unknown_list.append(original_name)
            
    # If no unknowns, return results
    if not unknown_list:
        return results
        
    # Make ONE Claude call
    try:
        system_prompt = "You are an Indian mutual fund classifier. Respond ONLY with a valid JSON object. No preamble, no markdown."
        user_prompt = f"Classify each of these Indian MF scheme names into exactly one category from this list: {json.dumps(VALID_CATEGORIES)}. Return a JSON object where each key is the fund name and value is the category string. Fund names: {json.dumps(unknown_list)}"
        
        raw_text = await anyio.to_thread.run_sync(
            lambda: _make_request(system_prompt, user_prompt, 500)
        )
        
        # Clean possible markdown block
        raw_text = raw_text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
            
        ai_classifications = json.loads(raw_text.strip())
        
        for name, cat in ai_classifications.items():
            final_cat = cat if cat in VALID_CATEGORIES else "Other"
            results[name] = final_cat
            # Cache using the cleaned name for future lookups
            cleaned = clean_fund_name(name)
            _classification_cache[cleaned] = final_cat
            
    except Exception as e:
        print(f"Batch Classifier Error: {e}")
        for name in unknown_list:
            results[name] = "Other"
            
    return results

