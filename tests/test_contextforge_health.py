"""
ContextForge Integration Health Tests
=======================================
Validates the ContextForge client wrapper and catalog integration.
Uses mocked HTTP responses to test without a running ContextForge instance.
"""

import json
import pytest
from unittest.mock import AsyncMock, patch, MagicMock


class TestContextForgeClient:
    """Test the lib/contextforge equivalent Python client logic."""

    def test_catalog_yaml_valid(self):
        """mcp-catalog.yml should be valid YAML with required fields."""
        import yaml

        with open("mcp-catalog.yml", "r") as f:
            catalog = yaml.safe_load(f)

        assert "catalog_servers" in catalog
        servers = catalog["catalog_servers"]
        assert len(servers) >= 1

        required_fields = ["id", "name", "category", "url", "auth_type", "provider", "description", "tags"]
        for server in servers:
            for field in required_fields:
                assert field in server, f"Missing field '{field}' in catalog server '{server.get('id', 'unknown')}'"
            assert isinstance(server["tags"], list)
            assert len(server["tags"]) > 0

    def test_catalog_has_learnai_entries(self):
        """Catalog should contain LearnAI-specific entries."""
        import yaml

        with open("mcp-catalog.yml", "r") as f:
            catalog = yaml.safe_load(f)

        server_ids = [s["id"] for s in catalog["catalog_servers"]]
        assert "learnai-tutoring" in server_ids
        assert "learnai-recommendations" in server_ids

    def test_catalog_urls_valid(self):
        """All catalog URLs should be properly formatted."""
        import yaml

        with open("mcp-catalog.yml", "r") as f:
            catalog = yaml.safe_load(f)

        for server in catalog["catalog_servers"]:
            url = server["url"]
            assert url.startswith("http://") or url.startswith("https://"), \
                f"Invalid URL for {server['id']}: {url}"

    def test_a2a_config_valid(self):
        """a2a-agent-config.yaml should be valid YAML with required fields."""
        import yaml

        with open("a2a-agent-config.yaml", "r") as f:
            config = yaml.safe_load(f)

        assert "agents" in config
        agents = config["agents"]
        assert len(agents) >= 1

        for agent in agents:
            assert "name" in agent
            assert "url" in agent
            assert "description" in agent
            assert "tags" in agent
            assert isinstance(agent["tags"], list)

    def test_a2a_agents_have_teacher_tags(self):
        """At least some A2A agents should be tagged for teacher catalog."""
        import yaml

        with open("a2a-agent-config.yaml", "r") as f:
            config = yaml.safe_load(f)

        teacher_agents = [
            a for a in config["agents"]
            if "education" in a.get("tags", []) or "tutoring" in a.get("tags", [])
        ]
        assert len(teacher_agents) >= 1


class TestContextForgeClientModule:
    """Test the Python MCP server's interaction patterns with ContextForge."""

    def test_professor_info_serialization(self, mock_professors):
        """ProfessorInfo should serialize from API response data."""
        from learnai_mcp.server import ProfessorInfo

        for prof_data in mock_professors:
            prof = ProfessorInfo(**prof_data)
            assert prof.id is not None
            assert isinstance(prof.subjects, list)

    def test_search_result_from_api_response(self, mock_professors):
        """SearchResult should build correctly from API response shape."""
        from learnai_mcp.server import SearchResult, ProfessorInfo

        professors = [ProfessorInfo(**p) for p in mock_professors]
        result = SearchResult(
            professors=professors,
            total=len(professors),
            query="test",
        )
        assert result.total == 2
        assert result.professors[0].name == "Dr. Alice Smith"

    def test_recommendation_result_with_explanation(self, mock_professors):
        """RecommendationResult should include AI explanation."""
        from learnai_mcp.server import RecommendationResult, ProfessorInfo

        professors = [ProfessorInfo(**p) for p in mock_professors]
        result = RecommendationResult(
            professors=professors,
            explanation="Based on your interest in ML, Dr. Alice Smith is the best match.",
            query="machine learning help",
        )
        assert "Alice Smith" in result.explanation
        assert result.query == "machine learning help"


class TestContextForgeGatewayRegistration:
    """Test that the MCP catalog entries would register correctly."""

    def test_catalog_auth_types_valid(self):
        """All auth_type values should be recognized by ContextForge."""
        import yaml

        valid_auth_types = {"OAuth2.1", "OAuth", "API Key", "Open", "Bearer"}

        with open("mcp-catalog.yml", "r") as f:
            catalog = yaml.safe_load(f)

        for server in catalog["catalog_servers"]:
            auth_type = server["auth_type"]
            assert auth_type in valid_auth_types, \
                f"Invalid auth_type '{auth_type}' for {server['id']}. Must be one of {valid_auth_types}"

    def test_catalog_categories_present(self):
        """All catalog entries should have a category."""
        import yaml

        with open("mcp-catalog.yml", "r") as f:
            catalog = yaml.safe_load(f)

        for server in catalog["catalog_servers"]:
            assert "category" in server
            assert len(server["category"]) > 0

    def test_catalog_descriptions_reasonable_length(self):
        """Catalog descriptions should be concise (~125 chars)."""
        import yaml

        with open("mcp-catalog.yml", "r") as f:
            catalog = yaml.safe_load(f)

        for server in catalog["catalog_servers"]:
            desc = server["description"]
            assert len(desc) <= 200, \
                f"Description too long for {server['id']}: {len(desc)} chars (max 200)"
            assert len(desc) >= 10, \
                f"Description too short for {server['id']}: {len(desc)} chars"
