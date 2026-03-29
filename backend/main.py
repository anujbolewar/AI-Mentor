"""
main.py — FastAPI application entry point for AI Money Mentor backend.
"""

import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI Money Mentor API",
    description="Personal finance AI for Indian salaried professionals",
    version="0.1.0",
)

# ── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health check ─────────────────────────────────────────────────────────────
@app.get("/health", tags=["system"])
async def health_check():
    """Simple liveness probe."""
    return {"status": "ok", "service": "ai-money-mentor"}


# ── Module routers will be registered here in future iterations ──────────────
from routers import fire
from routers import portfolio

app.include_router(fire.router, prefix="/api")
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["portfolio"])
