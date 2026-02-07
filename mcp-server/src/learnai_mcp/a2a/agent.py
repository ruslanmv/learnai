"""
LearnAI A2A Agent Server
========================

Agent-to-Agent server that handles JSON-RPC requests from other agents
through MCP Context Forge. Enables multi-agent workflows where external
agents can request tutoring matches, create bookings, and manage sessions.

Usage:
    python -m learnai_mcp.a2a.agent --port 9200

Registration with MCP Context Forge:
    curl -X POST "http://localhost:4444/a2a" \\
      -u admin:changeme \\
      -H "Content-Type: application/json" \\
      -d '{
        "name": "learnai-tutor-matching",
        "url": "http://localhost:9200/a2a",
        "description": "AI-powered tutor matching agent",
        "auth_type": "bearer",
        "auth_value": "your-token",
        "visibility": "public",
        "tags": ["education", "tutoring", "ai-matching"]
      }'
"""

import argparse
import logging
import os
import uuid

import httpx
import uvicorn
from fastapi import FastAPI, Header, HTTPException, Request
from pydantic import BaseModel

logger = logging.getLogger(__name__)

LEARNAI_API_URL = os.environ.get("LEARNAI_API_URL", "http://localhost:3000")
LEARNAI_A2A_TOKEN = os.environ.get("LEARNAI_A2A_TOKEN", "")

app = FastAPI(title="LearnAI A2A Agent", version="1.0.0")


# ---------------------------------------------------------------------------
# JSON-RPC Models
# ---------------------------------------------------------------------------


class JSONRPCRequest(BaseModel):
    jsonrpc: str = "2.0"
    method: str
    params: dict = {}
    id: str | int | None = None


class JSONRPCResponse(BaseModel):
    jsonrpc: str = "2.0"
    result: dict | None = None
    error: dict | None = None
    id: str | int | None = None


# ---------------------------------------------------------------------------
# A2A Endpoint
# ---------------------------------------------------------------------------


@app.post("/a2a")
async def handle_a2a(
    request: JSONRPCRequest,
    authorization: str | None = Header(default=None),
) -> JSONRPCResponse:
    """Handle A2A JSON-RPC requests from the MCP Context Forge gateway."""
    # Validate bearer token if configured
    if LEARNAI_A2A_TOKEN:
        expected = f"Bearer {LEARNAI_A2A_TOKEN}"
        if authorization != expected:
            raise HTTPException(status_code=401, detail="Invalid A2A token")

    request_id = request.id or str(uuid.uuid4())

    try:
        if request.method == "invoke":
            result = await _handle_invoke(request.params)
            return JSONRPCResponse(result=result, id=request_id)

        if request.method == "match_tutor":
            result = await _match_tutor(request.params)
            return JSONRPCResponse(result=result, id=request_id)

        if request.method == "create_booking":
            result = await _create_booking(request.params)
            return JSONRPCResponse(result=result, id=request_id)

        if request.method == "check_availability":
            result = await _check_availability(request.params)
            return JSONRPCResponse(result=result, id=request_id)

        return JSONRPCResponse(
            error={"code": -32601, "message": f"Method not found: {request.method}"},
            id=request_id,
        )
    except Exception as e:
        logger.error("A2A request failed: %s", e)
        return JSONRPCResponse(
            error={"code": -32000, "message": str(e)},
            id=request_id,
        )


# ---------------------------------------------------------------------------
# Method Handlers
# ---------------------------------------------------------------------------


async def _handle_invoke(params: dict) -> dict:
    """Generic invoke handler - routes to specific methods."""
    action = params.get("action", "match_tutor")
    if action == "match_tutor":
        return await _match_tutor(params)
    if action == "create_booking":
        return await _create_booking(params)
    if action == "check_availability":
        return await _check_availability(params)
    return {"error": f"Unknown action: {action}"}


async def _match_tutor(params: dict) -> dict:
    """Find the best tutor for a student's learning needs."""
    query = params.get("query", "")
    limit = params.get("limit", 5)

    if not query:
        return {"error": "query parameter is required"}

    async with httpx.AsyncClient(base_url=LEARNAI_API_URL, timeout=30.0) as client:
        response = await client.post(
            "/api/ai/recommend-professors",
            json={"query": query, "limit": limit},
        )
        response.raise_for_status()
        data = response.json()

    return {
        "action": "match_tutor",
        "teachers": data.get("teachers", []),
        "explanation": data.get("explanation", ""),
        "query": query,
    }


async def _create_booking(params: dict) -> dict:
    """Create a tutoring session booking."""
    required = ["teacherId", "subject", "scheduledFor", "durationMinutes", "priceTotal"]
    missing = [f for f in required if f not in params]
    if missing:
        return {"error": f"Missing required fields: {', '.join(missing)}"}

    async with httpx.AsyncClient(base_url=LEARNAI_API_URL, timeout=30.0) as client:
        response = await client.post("/api/bookings", json=params)
        response.raise_for_status()
        data = response.json()

    return {
        "action": "create_booking",
        "booking_id": data.get("bookingId", ""),
        "status": "pending",
    }


async def _check_availability(params: dict) -> dict:
    """Check professor availability (placeholder - extend as needed)."""
    teacher_id = params.get("teacherId", "")
    date = params.get("date", "")

    return {
        "action": "check_availability",
        "teacher_id": teacher_id,
        "date": date,
        "available": True,
        "message": "Availability check - extend with actual calendar integration",
    }


# ---------------------------------------------------------------------------
# Health & Discovery
# ---------------------------------------------------------------------------


@app.get("/health")
async def health() -> dict:
    return {"status": "healthy", "service": "learnai-a2a-agent"}


@app.get("/.well-known/agent.json")
async def agent_card() -> dict:
    """A2A agent card for discovery."""
    return {
        "name": "learnai-tutor-matching",
        "version": "1.0.0",
        "description": "AI-powered tutor matching agent for the LearnAI platform",
        "methods": [
            {
                "name": "match_tutor",
                "description": "Find the best tutor for a student's learning needs",
                "params": {
                    "query": {"type": "string", "required": True},
                    "limit": {"type": "integer", "default": 5},
                },
            },
            {
                "name": "create_booking",
                "description": "Book a tutoring session with a professor",
                "params": {
                    "teacherId": {"type": "string", "required": True},
                    "subject": {"type": "string", "required": True},
                    "scheduledFor": {"type": "string", "required": True},
                    "durationMinutes": {"type": "integer", "required": True},
                    "priceTotal": {"type": "number", "required": True},
                },
            },
            {
                "name": "check_availability",
                "description": "Check if a professor is available at a given time",
                "params": {
                    "teacherId": {"type": "string", "required": True},
                    "date": {"type": "string", "required": True},
                },
            },
        ],
        "tags": ["education", "tutoring", "ai-matching", "booking"],
    }


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(description="LearnAI A2A Agent Server")
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=9200)
    args = parser.parse_args()
    uvicorn.run(app, host=args.host, port=args.port)


if __name__ == "__main__":
    main()
