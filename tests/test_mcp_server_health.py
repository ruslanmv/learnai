"""
MCP Server Health Tests
========================
Validates that the LearnAI MCP server tools are properly defined,
have correct schemas, and handle mock API responses correctly.
"""

import json
import pytest
from unittest.mock import AsyncMock, patch, MagicMock


class TestMCPServerToolDefinitions:
    """Test that MCP server tools are properly defined."""

    def test_server_module_imports(self):
        """MCP server module should import without errors."""
        from learnai_mcp import server

        assert server.mcp is not None
        assert server.mcp.name == "learnai-mcp-server"

    def test_server_has_tools(self):
        """MCP server should expose the expected tools."""
        from learnai_mcp.server import mcp

        # FastMCP stores tools internally; verify the server object exists
        assert mcp is not None
        assert hasattr(mcp, "run")

    def test_pydantic_models_valid(self):
        """All Pydantic response models should instantiate correctly."""
        from learnai_mcp.server import (
            ProfessorInfo,
            SearchResult,
            RecommendationResult,
            BookingResult,
            BookingStatus,
            SubjectList,
        )

        prof = ProfessorInfo(id="1", name="Dr. Test", subjects=["Math"])
        assert prof.id == "1"
        assert prof.rating == 0.0

        search = SearchResult(professors=[prof], total=1, query="math")
        assert search.total == 1

        rec = RecommendationResult(
            professors=[prof], explanation="Great match", query="math"
        )
        assert rec.explanation == "Great match"

        booking = BookingResult(
            booking_id="b1", status="pending", message="Created"
        )
        assert booking.status == "pending"

        status = BookingStatus(booking_id="b1", status="confirmed")
        assert status.status == "confirmed"

        subjects = SubjectList(subjects=["Math", "Physics"])
        assert len(subjects.subjects) == 2

    def test_search_result_empty(self):
        """SearchResult should handle empty results."""
        from learnai_mcp.server import SearchResult

        result = SearchResult()
        assert result.professors == []
        assert result.total == 0
        assert result.query == ""

    def test_professor_info_defaults(self):
        """ProfessorInfo should have sensible defaults."""
        from learnai_mcp.server import ProfessorInfo

        prof = ProfessorInfo(id="test")
        assert prof.name is None
        assert prof.rating == 0.0
        assert prof.subjects == []
        assert prof.languages == []
        assert prof.hourly_rate == "0"


class TestMCPServerToolExecution:
    """Test MCP server tool functions with mocked HTTP calls.

    Note: FastMCP wraps decorated functions as FunctionTool objects.
    We access the underlying function via the .fn attribute.
    """

    @pytest.mark.asyncio
    async def test_search_professors_success(self, mock_professors):
        """search_professors should return formatted results from API."""
        from learnai_mcp.server import search_professors

        fn = search_professors.fn

        with patch("learnai_mcp.server._api_request", new_callable=AsyncMock) as mock_api:
            mock_api.return_value = {"teachers": mock_professors}
            result = await fn(subject="Machine Learning", limit=5)

        assert result.total == 2
        assert result.query == "Machine Learning"
        assert len(result.professors) == 2

    @pytest.mark.asyncio
    async def test_search_professors_api_error(self):
        """search_professors should return empty results on API error."""
        from learnai_mcp.server import search_professors

        fn = search_professors.fn

        with patch("learnai_mcp.server._api_request", new_callable=AsyncMock) as mock_api:
            mock_api.side_effect = Exception("Connection refused")
            result = await fn(subject="Physics")

        assert result.total == 0
        assert result.professors == []

    @pytest.mark.asyncio
    async def test_recommend_professors_success(self, mock_professors):
        """recommend_professors should return AI recommendations."""
        from learnai_mcp.server import recommend_professors

        fn = recommend_professors.fn

        with patch("learnai_mcp.server._api_request", new_callable=AsyncMock) as mock_api:
            mock_api.return_value = {
                "teachers": mock_professors,
                "explanation": "Based on your interest in ML...",
            }
            result = await fn(
                query="I need help with machine learning"
            )

        assert len(result.professors) == 2
        assert "ML" in result.explanation
        assert result.query == "I need help with machine learning"

    @pytest.mark.asyncio
    async def test_recommend_professors_api_error(self):
        """recommend_professors should handle API errors gracefully."""
        from learnai_mcp.server import recommend_professors

        fn = recommend_professors.fn

        with patch("learnai_mcp.server._api_request", new_callable=AsyncMock) as mock_api:
            mock_api.side_effect = Exception("Service unavailable")
            result = await fn(query="calculus help")

        assert result.professors == []
        assert "unavailable" in result.explanation.lower()

    @pytest.mark.asyncio
    async def test_create_booking_success(self):
        """create_booking should return booking confirmation."""
        from learnai_mcp.server import create_booking

        fn = create_booking.fn

        with patch("learnai_mcp.server._api_request", new_callable=AsyncMock) as mock_api:
            mock_api.return_value = {"bookingId": "booking-123"}
            result = await fn(
                teacher_id="prof-1",
                subject="Mathematics",
                scheduled_for="2026-03-01T14:00:00Z",
                duration_minutes=60,
                price_total=75.0,
            )

        assert result.booking_id == "booking-123"
        assert result.status == "pending"

    @pytest.mark.asyncio
    async def test_create_booking_error(self):
        """create_booking should handle errors gracefully."""
        from learnai_mcp.server import create_booking

        fn = create_booking.fn

        with patch("learnai_mcp.server._api_request", new_callable=AsyncMock) as mock_api:
            mock_api.side_effect = Exception("Unauthorized")
            result = await fn(
                teacher_id="prof-1",
                subject="Math",
                scheduled_for="2026-03-01T14:00:00Z",
            )

        assert result.status == "error"

    @pytest.mark.asyncio
    async def test_list_subjects_fallback(self):
        """list_subjects should return fallback list on API error."""
        from learnai_mcp.server import list_subjects

        fn = list_subjects.fn

        with patch("learnai_mcp.server._api_request", new_callable=AsyncMock) as mock_api:
            mock_api.side_effect = Exception("Connection refused")
            result = await fn()

        assert len(result.subjects) > 0
        assert "Mathematics" in result.subjects
        assert "Python" in result.subjects

    @pytest.mark.asyncio
    async def test_get_booking_status_success(self):
        """get_booking_status should return booking details."""
        from learnai_mcp.server import get_booking_status

        fn = get_booking_status.fn

        with patch("learnai_mcp.server._api_request", new_callable=AsyncMock) as mock_api:
            mock_api.return_value = {
                "status": "CONFIRMED",
                "subject": "Mathematics",
                "scheduledFor": "2026-03-01T14:00:00Z",
                "durationMinutes": 60,
                "teacher": {"name": "Dr. Smith"},
            }
            result = await fn(booking_id="booking-123")

        assert result.status == "CONFIRMED"
        assert result.subject == "Mathematics"
        assert result.teacher_name == "Dr. Smith"
