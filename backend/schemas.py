from __future__ import annotations

from typing import Literal, List
from pydantic import BaseModel, Field, model_validator


# ─────────────────────────────────────────────────────────────
# Nested models
# ─────────────────────────────────────────────────────────────

class LifeGoal(BaseModel):
    """A single financial life goal (e.g. child's education, home purchase)."""

    name: str = Field(..., description="Short descriptive name of the goal")
    target_amount: int = Field(..., description="Target corpus in INR")
    target_years: int = Field(..., ge=1, le=40, description="Years from now to achieve goal")


# ─────────────────────────────────────────────────────────────
# Core financial profile
# ─────────────────────────────────────────────────────────────

class FinancialProfile(BaseModel):
    """Complete financial picture used by the FIRE and Health Score modules."""

    age: int = Field(..., ge=18, le=60)
    monthly_income: int = Field(..., ge=10_000, le=10_000_000)
    monthly_expenses: int = Field(..., description="Must be less than monthly_income")
    existing_investments: int = Field(..., ge=0, description="Current investment corpus in INR")
    existing_emi: int = Field(default=0, ge=0, description="Total monthly EMI outgo; must be < monthly_income")
    dependents: int = Field(..., ge=0, le=10)
    life_goals: List[LifeGoal] = Field(..., min_length=1, max_length=5)
    fire_target_age: int = Field(..., le=75, description="Target retirement age; must be > age + 5")
    tax_regime: Literal["old", "new"]

    @model_validator(mode="after")
    def cross_field_validations(self) -> "FinancialProfile":
        # monthly_expenses < monthly_income
        if self.monthly_expenses >= self.monthly_income:
            raise ValueError(
                "Your expenses equal or exceed income. Reduce expenses or increase income before planning."
            )

        # fire_target_age > age + 5
        if self.fire_target_age <= self.age + 5:
            raise ValueError(
                "FIRE target must be at least 5 years from current age."
            )

        return self


# ─────────────────────────────────────────────────────────────
# Portfolio request
# ─────────────────────────────────────────────────────────────

class PortfolioRequest(BaseModel):
    """Input for the AI portfolio analyser module."""

    risk_profile: Literal["conservative", "moderate", "aggressive"]
    investment_horizon_years: int = Field(..., ge=1, le=40)
    monthly_income: int = Field(..., ge=10_000)
