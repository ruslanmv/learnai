"""
LearnAI MCP Server
==================

Model Context Protocol server that exposes LearnAI tutoring marketplace
capabilities as tools for AI clients. Designed to be registered with
MCP Context Forge for centralized governance.

Tools exposed:
- search_professors: Search for professors by subject, language, rating
- recommend_professors: AI-powered professor recommendations
- create_booking: Book a tutoring session
- get_booking_status: Check booking status
- list_subjects: Get available teaching subjects

Usage:
    # stdio transport (for local/containerized use)
    learnai-mcp

    # HTTP transport (for network access)
    learnai-mcp --transport http --port 9100

Reference:
    https://github.com/ruslanmv/mcp-context-forge
"""

import argparse
import asyncio
import logging
import os
from typing import Any

import httpx
from fastmcp import FastMCP
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

LEARNAI_API_URL = os.environ.get("LEARNAI_API_URL", "http://localhost:3000")
LEARNAI_API_KEY = os.environ.get("LEARNAI_API_KEY", "")

# ---------------------------------------------------------------------------
# Pydantic models for tool responses
# ---------------------------------------------------------------------------


class ProfessorInfo(BaseModel):
    """Professor information returned by search and recommendation tools."""

    id: str
    name: str | None = None
    title: str | None = None
    bio: str | None = None
    subjects: list[str] = Field(default_factory=list)
    languages: list[str] = Field(default_factory=list)
    rating: float = 0.0
    hourly_rate: str = "0"
    image: str | None = None


class SearchResult(BaseModel):
    """Result of a professor search."""

    professors: list[ProfessorInfo] = Field(default_factory=list)
    total: int = 0
    query: str = ""


class RecommendationResult(BaseModel):
    """Result of an AI-powered recommendation."""

    professors: list[ProfessorInfo] = Field(default_factory=list)
    explanation: str = ""
    query: str = ""


class BookingResult(BaseModel):
    """Result of a booking operation."""

    booking_id: str = ""
    status: str = ""
    message: str = ""


class BookingStatus(BaseModel):
    """Current status of a booking."""

    booking_id: str
    status: str
    subject: str = ""
    scheduled_for: str = ""
    duration_minutes: int = 0
    teacher_name: str = ""


class SubjectList(BaseModel):
    """Available subjects for tutoring."""

    subjects: list[str] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# HTTP client for LearnAI API
# ---------------------------------------------------------------------------

_client: httpx.AsyncClient | None = None
_semaphore = asyncio.Semaphore(10)


async def _get_client() -> httpx.AsyncClient:
    """Get or create the shared HTTP client."""
    global _client
    if _client is None or _client.is_closed:
        headers: dict[str, str] = {"Content-Type": "application/json"}
        if LEARNAI_API_KEY:
            headers["Authorization"] = f"Bearer {LEARNAI_API_KEY}"
        _client = httpx.AsyncClient(
            base_url=LEARNAI_API_URL,
            headers=headers,
            timeout=30.0,
        )
    return _client


async def _api_request(method: str, path: str, **kwargs: Any) -> dict[str, Any]:
    """Make an authenticated request to the LearnAI API."""
    client = await _get_client()
    response = await client.request(method, path, **kwargs)
    response.raise_for_status()
    return response.json()


# ---------------------------------------------------------------------------
# MCP Server
# ---------------------------------------------------------------------------

mcp = FastMCP(name="learnai-mcp-server", version="1.0.0")


@mcp.tool(
    description=(
        "Search for professors by subject, language, minimum rating, and hourly rate. "
        "Returns a list of matching professors ordered by rating."
    )
)
async def search_professors(
    subject: str = "",
    language: str = "",
    min_rating: float = 0.0,
    max_hourly_rate: float = 500.0,
    limit: int = 10,
) -> SearchResult:
    """Search the LearnAI database for professors matching specific criteria.

    Args:
        subject: Subject area to search for (e.g., "mathematics", "python", "physics").
        language: Preferred teaching language (e.g., "English", "Spanish").
        min_rating: Minimum professor rating (0.0 to 5.0).
        max_hourly_rate: Maximum hourly rate in USD.
        limit: Maximum number of results to return (1 to 50).
    """
    async with _semaphore:
        try:
            params: dict[str, Any] = {"limit": min(limit, 50)}
            if subject:
                params["subject"] = subject
            if language:
                params["language"] = language
            if min_rating > 0:
                params["min_rating"] = min_rating
            if max_hourly_rate < 500:
                params["max_hourly_rate"] = max_hourly_rate

            data = await _api_request("GET", "/api/explore", params=params)
            professors = [ProfessorInfo(**p) for p in data.get("teachers", [])]
            return SearchResult(
                professors=professors,
                total=len(professors),
                query=subject or language or "all",
            )
        except Exception as e:
            logger.error("search_professors failed: %s", e)
            return SearchResult(query=subject or language or "all")


@mcp.tool(
    description=(
        "Get AI-powered professor recommendations based on a student's learning goals. "
        "Uses GPT-4 to match students with the best professors and provides an explanation "
        "of why each professor is a good fit."
    )
)
async def recommend_professors(
    query: str,
    limit: int = 5,
) -> RecommendationResult:
    """Get AI-powered professor recommendations for a learning goal.

    Args:
        query: Description of the student's learning needs
               (e.g., "I need help with calculus for my university exam").
        limit: Maximum number of recommendations (1 to 10).
    """
    async with _semaphore:
        try:
            data = await _api_request(
                "POST",
                "/api/ai/recommend-professors",
                json={"query": query, "limit": min(limit, 10)},
            )
            professors = [ProfessorInfo(**t) for t in data.get("teachers", [])]
            return RecommendationResult(
                professors=professors,
                explanation=data.get("explanation", ""),
                query=query,
            )
        except Exception as e:
            logger.error("recommend_professors failed: %s", e)
            return RecommendationResult(
                explanation=f"Recommendation service unavailable: {e}",
                query=query,
            )


@mcp.tool(
    description=(
        "Book a tutoring session with a professor. Requires the professor ID, subject, "
        "scheduled time, duration, and total price."
    )
)
async def create_booking(
    teacher_id: str,
    subject: str,
    scheduled_for: str,
    duration_minutes: int = 60,
    price_total: float = 0.0,
    topic: str = "",
) -> BookingResult:
    """Create a new booking for a tutoring session.

    Args:
        teacher_id: The professor's user ID.
        subject: Subject for the session (e.g., "Mathematics").
        scheduled_for: ISO 8601 datetime string (e.g., "2026-03-01T14:00:00Z").
        duration_minutes: Session duration in minutes (30 to 180).
        price_total: Total price in USD.
        topic: Specific topic within the subject (optional).
    """
    async with _semaphore:
        try:
            data = await _api_request(
                "POST",
                "/api/bookings",
                json={
                    "teacherId": teacher_id,
                    "subject": subject,
                    "topic": topic,
                    "scheduledFor": scheduled_for,
                    "durationMinutes": duration_minutes,
                    "priceTotal": price_total,
                },
            )
            return BookingResult(
                booking_id=data.get("bookingId", ""),
                status="pending",
                message="Booking created successfully",
            )
        except httpx.HTTPStatusError as e:
            error_body = e.response.json() if e.response.content else {}
            return BookingResult(
                status="error",
                message=error_body.get("error", str(e)),
            )
        except Exception as e:
            logger.error("create_booking failed: %s", e)
            return BookingResult(status="error", message=str(e))


@mcp.tool(
    description="Check the current status of a tutoring session booking by its ID."
)
async def get_booking_status(
    booking_id: str,
) -> BookingStatus:
    """Get the current status of a booking.

    Args:
        booking_id: The booking ID returned from create_booking.
    """
    async with _semaphore:
        try:
            data = await _api_request("GET", f"/api/bookings/{booking_id}")
            return BookingStatus(
                booking_id=booking_id,
                status=data.get("status", "unknown"),
                subject=data.get("subject", ""),
                scheduled_for=data.get("scheduledFor", ""),
                duration_minutes=data.get("durationMinutes", 0),
                teacher_name=data.get("teacher", {}).get("name", ""),
            )
        except Exception as e:
            logger.error("get_booking_status failed: %s", e)
            return BookingStatus(booking_id=booking_id, status="error")


@mcp.tool(
    description=(
        "List all available tutoring subjects offered on the LearnAI platform. "
        "Useful for discovering what subjects students can get help with."
    )
)
async def list_subjects() -> SubjectList:
    """Get the list of all available tutoring subjects."""
    async with _semaphore:
        try:
            data = await _api_request("GET", "/api/explore", params={"subjects_only": "true"})
            subjects = data.get("subjects", [])
            return SubjectList(subjects=subjects)
        except Exception:
            # Return common subjects as fallback
            return SubjectList(
                subjects=[
                    "Mathematics",
                    "Physics",
                    "Chemistry",
                    "Biology",
                    "Computer Science",
                    "Python",
                    "JavaScript",
                    "English",
                    "Spanish",
                    "French",
                    "Data Science",
                    "Machine Learning",
                ]
            )


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------


def main() -> None:
    """Start the LearnAI MCP server."""
    parser = argparse.ArgumentParser(description="LearnAI MCP Server")
    parser.add_argument(
        "--transport",
        choices=["stdio", "http"],
        default="stdio",
        help="Transport protocol (default: stdio)",
    )
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind to (HTTP mode)")
    parser.add_argument("--port", type=int, default=9100, help="Port to bind to (HTTP mode)")
    args = parser.parse_args()

    if args.transport == "http":
        mcp.run(transport="http", host=args.host, port=args.port)
    else:
        mcp.run()


if __name__ == "__main__":
    main()
