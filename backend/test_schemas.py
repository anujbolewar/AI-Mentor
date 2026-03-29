#!/usr/bin/env python3
"""
test_schemas.py — Validate Pydantic v2 schema definitions.

Run with:
    python test_schemas.py
"""

import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from pydantic import ValidationError
from schemas import LifeGoal, FinancialProfile, PortfolioRequest

PASS = "✅"
FAIL = "❌"
errors: list[str] = []


def check(label: str, ok: bool, reason: str = "") -> None:
    if ok:
        print(f"  {PASS} {label}")
    else:
        msg = f"  {FAIL} {label}" + (f": {reason}" if reason else "")
        print(msg)
        errors.append(label)


print("\n── LifeGoal ──")
try:
    g = LifeGoal(name="Child Education", target_amount=3_000_000, target_years=12)
    check("valid LifeGoal", True)
except ValidationError as e:
    check("valid LifeGoal", False, str(e))

try:
    LifeGoal(name="Bad", target_amount=100, target_years=0)   # target_years >= 1
    check("target_years=0 rejected", False, "should have failed")
except ValidationError:
    check("target_years=0 rejected", True)


print("\n── FinancialProfile ──")
valid_profile = dict(
    age=30,
    monthly_income=100_000,
    monthly_expenses=50_000,
    existing_investments=500_000,
    existing_emi=15_000,
    dependents=2,
    life_goals=[{"name": "Home", "target_amount": 10_000_000, "target_years": 10}],
    fire_target_age=50,   # > 30 + 5 = 35 ✓
    tax_regime="new",
)

try:
    fp = FinancialProfile(**valid_profile)
    check("valid FinancialProfile", True)
except ValidationError as e:
    check("valid FinancialProfile", False, str(e))

# expenses >= income → reject
try:
    FinancialProfile(**{**valid_profile, "monthly_expenses": 100_000})
    check("expenses == income rejected", False, "should have failed")
except ValidationError:
    check("expenses == income rejected", True)

# fire_target_age <= age + 5 → reject
try:
    FinancialProfile(**{**valid_profile, "fire_target_age": 34})
    check("fire_target_age too small rejected", False, "should have failed")
except ValidationError:
    check("fire_target_age too small rejected", True)

# existing_emi >= income → reject
try:
    FinancialProfile(**{**valid_profile, "existing_emi": 100_000})
    check("emi == income accepted", True)
except ValidationError:
    check("emi == income accepted", False, "should have passed")

# age out of range
try:
    FinancialProfile(**{**valid_profile, "age": 17})
    check("age=17 rejected", False, "should have failed")
except ValidationError:
    check("age=17 rejected", True)

# too many life goals
try:
    goals = [{"name": f"G{i}", "target_amount": 100_000, "target_years": 5} for i in range(6)]
    FinancialProfile(**{**valid_profile, "life_goals": goals})
    check("6 life goals rejected", False, "should have failed")
except ValidationError:
    check("6 life goals rejected", True)


print("\n── PortfolioRequest ──")
try:
    pr = PortfolioRequest(risk_profile="moderate", investment_horizon_years=10, monthly_income=50_000)
    check("valid PortfolioRequest", True)
except ValidationError as e:
    check("valid PortfolioRequest", False, str(e))

try:
    PortfolioRequest(risk_profile="ultra-aggressive", investment_horizon_years=10, monthly_income=50_000)
    check("invalid risk_profile rejected", False, "should have failed")
except ValidationError:
    check("invalid risk_profile rejected", True)

try:
    PortfolioRequest(risk_profile="conservative", investment_horizon_years=10, monthly_income=5_000)
    check("monthly_income < 10000 rejected", False, "should have failed")
except ValidationError:
    check("monthly_income < 10000 rejected", True)


print()
if errors:
    print(f"FAILED: {len(errors)} check(s) did not pass → {errors}")
    sys.exit(1)
else:
    print("All schema checks passed 🎉")
