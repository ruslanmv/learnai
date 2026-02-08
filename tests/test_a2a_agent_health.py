"""
A2A Agent Health Tests
=======================
Validates that the LearnAI A2A agent server handles JSON-RPC requests
correctly and returns proper responses for all methods.
"""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock

from learnai_mcp.a2a.agent import app, JSONRPCRequest, JSONRPCResponse


class TestA2AAgentEndpoints:
    """Test A2A agent JSON-RPC endpoints."""

    @pytest.fixture
    def client(self):
        """Create a test client for the A2A FastAPI app."""
        from fastapi.testclient import TestClient

        return TestClient(app)

    def test_health_endpoint(self, client):
        """Health endpoint should return healthy status."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "learnai-a2a-agent"

    def test_agent_card_endpoint(self, client):
        """Agent card should return proper A2A discovery metadata."""
        response = client.get("/.well-known/agent.json")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "learnai-tutor-matching"
        assert data["version"] == "1.0.0"
        assert "methods" in data
        assert len(data["methods"]) == 3

        method_names = [m["name"] for m in data["methods"]]
        assert "match_tutor" in method_names
        assert "create_booking" in method_names
        assert "check_availability" in method_names

    def test_agent_card_has_tags(self, client):
        """Agent card should include tags for discovery."""
        response = client.get("/.well-known/agent.json")
        data = response.json()
        assert "education" in data["tags"]
        assert "tutoring" in data["tags"]


class TestA2AMatchTutor:
    """Test the match_tutor A2A method."""

    @pytest.fixture
    def client(self):
        from fastapi.testclient import TestClient

        return TestClient(app)

    def test_match_tutor_success(self, client, mock_professors):
        """match_tutor should return professor recommendations."""
        with patch("learnai_mcp.a2a.agent.httpx.AsyncClient") as MockClient:
            mock_response = MagicMock()
            mock_response.json.return_value = {
                "teachers": mock_professors,
                "explanation": "Here are the best matches",
            }
            mock_response.raise_for_status = MagicMock()

            mock_instance = AsyncMock()
            mock_instance.post = AsyncMock(return_value=mock_response)
            mock_instance.__aenter__ = AsyncMock(return_value=mock_instance)
            mock_instance.__aexit__ = AsyncMock(return_value=False)
            MockClient.return_value = mock_instance

            response = client.post(
                "/a2a",
                json={
                    "jsonrpc": "2.0",
                    "method": "match_tutor",
                    "params": {"query": "machine learning", "limit": 5},
                    "id": "test-1",
                },
            )

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == "test-1"
        assert data["result"] is not None
        assert data["result"]["action"] == "match_tutor"

    def test_match_tutor_missing_query(self, client):
        """match_tutor should error when query is missing."""
        response = client.post(
            "/a2a",
            json={
                "jsonrpc": "2.0",
                "method": "match_tutor",
                "params": {},
                "id": "test-2",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["result"]["error"] == "query parameter is required"


class TestA2ACreateBooking:
    """Test the create_booking A2A method."""

    @pytest.fixture
    def client(self):
        from fastapi.testclient import TestClient

        return TestClient(app)

    def test_create_booking_missing_fields(self, client):
        """create_booking should list missing required fields."""
        response = client.post(
            "/a2a",
            json={
                "jsonrpc": "2.0",
                "method": "create_booking",
                "params": {"teacherId": "prof-1"},
                "id": "test-3",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert "Missing required fields" in data["result"]["error"]

    def test_create_booking_success(self, client):
        """create_booking should return booking confirmation."""
        with patch("learnai_mcp.a2a.agent.httpx.AsyncClient") as MockClient:
            mock_response = MagicMock()
            mock_response.json.return_value = {"bookingId": "booking-456"}
            mock_response.raise_for_status = MagicMock()

            mock_instance = AsyncMock()
            mock_instance.post = AsyncMock(return_value=mock_response)
            mock_instance.__aenter__ = AsyncMock(return_value=mock_instance)
            mock_instance.__aexit__ = AsyncMock(return_value=False)
            MockClient.return_value = mock_instance

            response = client.post(
                "/a2a",
                json={
                    "jsonrpc": "2.0",
                    "method": "create_booking",
                    "params": {
                        "teacherId": "prof-1",
                        "subject": "Mathematics",
                        "scheduledFor": "2026-03-01T14:00:00Z",
                        "durationMinutes": 60,
                        "priceTotal": 75.0,
                    },
                    "id": "test-4",
                },
            )

        assert response.status_code == 200
        data = response.json()
        assert data["result"]["booking_id"] == "booking-456"


class TestA2ACheckAvailability:
    """Test the check_availability A2A method."""

    @pytest.fixture
    def client(self):
        from fastapi.testclient import TestClient

        return TestClient(app)

    def test_check_availability(self, client):
        """check_availability should return availability info."""
        response = client.post(
            "/a2a",
            json={
                "jsonrpc": "2.0",
                "method": "check_availability",
                "params": {
                    "teacherId": "prof-1",
                    "date": "2026-03-01",
                },
                "id": "test-5",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["result"]["action"] == "check_availability"
        assert data["result"]["teacher_id"] == "prof-1"


class TestA2AUnknownMethod:
    """Test error handling for unknown methods."""

    @pytest.fixture
    def client(self):
        from fastapi.testclient import TestClient

        return TestClient(app)

    def test_unknown_method(self, client):
        """Unknown method should return JSON-RPC error."""
        response = client.post(
            "/a2a",
            json={
                "jsonrpc": "2.0",
                "method": "unknown_method",
                "params": {},
                "id": "test-6",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["error"] is not None
        assert data["error"]["code"] == -32601
        assert "Method not found" in data["error"]["message"]


class TestA2AInvokeRouter:
    """Test the generic invoke method routing."""

    @pytest.fixture
    def client(self):
        from fastapi.testclient import TestClient

        return TestClient(app)

    def test_invoke_routes_to_match_tutor(self, client):
        """invoke with action=match_tutor should route correctly."""
        response = client.post(
            "/a2a",
            json={
                "jsonrpc": "2.0",
                "method": "invoke",
                "params": {"action": "match_tutor", "query": ""},
                "id": "test-7",
            },
        )

        assert response.status_code == 200
        data = response.json()
        # Empty query returns error
        assert "error" in data["result"]

    def test_invoke_unknown_action(self, client):
        """invoke with unknown action should return error."""
        response = client.post(
            "/a2a",
            json={
                "jsonrpc": "2.0",
                "method": "invoke",
                "params": {"action": "fly_to_moon"},
                "id": "test-8",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert "Unknown action" in data["result"]["error"]
