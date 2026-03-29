"""
claude_client.py — Thin async wrapper around the Anthropic Messages API.

Usage
-----
    from claude_client import call_claude

    result = await call_claude(
        system_prompt="You are a helpful assistant.",
        user_prompt='Return {"ok": true}',
    )
    # result == {"ok": True}
"""

from __future__ import annotations

import json
import logging

import anthropic
from fastapi import HTTPException

logger = logging.getLogger(__name__)

# Model identifier as per the spec
_MODEL = "claude-sonnet-4-20250514"

# Shared sync client — Anthropic's Python SDK uses httpx under the hood.
# We wrap it in an async-compatible way using anyio.to_thread.run_sync.
_client = anthropic.Anthropic(timeout=15.0)

_RETRY_SUFFIX = (
    "\n\nIMPORTANT: Previous response was invalid JSON. "
    "Return ONLY the JSON object, no other text."
)


def _make_request(system_prompt: str, user_prompt: str, max_tokens: int) -> str:
    """
    Synchronous helper that fires one Anthropic API call and returns
    the raw text from content[0].
    """
    message = _client.messages.create(
        model=_MODEL,
        max_tokens=max_tokens,
        temperature=0,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}],
    )
    return message.content[0].text


async def call_claude(
    system_prompt: str,
    user_prompt: str,
    max_tokens: int = 4096,
) -> dict:
    """
    Call the Anthropic Claude API and return the parsed JSON response.

    Parameters
    ----------
    system_prompt : str
        The system-level instruction for Claude.
    user_prompt : str
        The user-turn message.
    max_tokens : int
        Maximum tokens Claude may generate (default 4096).

    Returns
    -------
    dict
        Parsed JSON object from Claude's response.

    Raises
    ------
    HTTPException(503)
        If Claude returns invalid JSON on both the initial attempt and the
        automatic retry.
    """
    import anyio  # bundled with uvicorn/starlette

    # ── First attempt ───────────────────────────────────────────────────────
    try:
        raw_text = await anyio.to_thread.run_sync(
            lambda: _make_request(system_prompt, user_prompt, max_tokens)
        )
        return json.loads(raw_text)
    except json.JSONDecodeError:
        logger.warning("Claude returned invalid JSON on first attempt — retrying.")

    # ── Retry once with corrective suffix ───────────────────────────────────
    retry_prompt = user_prompt + _RETRY_SUFFIX
    try:
        raw_text = await anyio.to_thread.run_sync(
            lambda: _make_request(system_prompt, retry_prompt, max_tokens)
        )
        return json.loads(raw_text)
    except json.JSONDecodeError:
        logger.error("Claude returned invalid JSON on retry — raising 503.")
        raise HTTPException(
            status_code=503,
            detail=(
                "The AI model failed to return a valid JSON response after two attempts. "
                "Please try again in a moment."
            ),
        )
