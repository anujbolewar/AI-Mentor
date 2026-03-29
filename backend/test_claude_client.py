#!/usr/bin/env python3
"""
test_claude_client.py — Smoke test for claude_client.call_claude().

Run with:
    ANTHROPIC_API_KEY=sk-ant-... python test_claude_client.py

Expected output:
    ✅ call_claude returned: {'ok': True}
"""

import asyncio
import os
import sys

# Ensure the backend package is importable
sys.path.insert(0, os.path.dirname(__file__))

from claude_client import call_claude


async def main() -> None:
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        print("⚠️  ANTHROPIC_API_KEY not set — skipping live API test.")
        print("   Set the env var and re-run to perform a live call.")
        return

    print("🔄 Calling Claude with dummy prompt …")
    result = await call_claude(
        system_prompt="You are a JSON-only responder. Always return valid JSON.",
        user_prompt='Return exactly: {"ok": true}',
        max_tokens=64,
    )
    print(f"✅ call_claude returned: {result}")
    assert result == {"ok": True}, f"Unexpected response: {result}"
    print("✅ Assertion passed.")


if __name__ == "__main__":
    asyncio.run(main())
