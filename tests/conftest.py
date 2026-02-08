"""
LearnAI Test Configuration
===========================
Shared fixtures for testing MCP servers, A2A agents, tools, and ContextForge integration.
"""

import os
import pytest

# Set test environment
os.environ.setdefault("LEARNAI_API_URL", "http://localhost:3000")
os.environ.setdefault("LEARNAI_API_KEY", "test-key")
os.environ.setdefault("CONTEXTFORGE_URL", "http://localhost:4444")
os.environ.setdefault("CONTEXTFORGE_TOKEN", "test-token")
os.environ.setdefault("LLM_BASE_URL", "http://localhost:11434/v1")
os.environ.setdefault("LLM_API_KEY", "test")
os.environ.setdefault("LLM_MODEL", "llama3:8b")


@pytest.fixture
def learnai_api_url():
    return os.environ["LEARNAI_API_URL"]


@pytest.fixture
def contextforge_url():
    return os.environ["CONTEXTFORGE_URL"]


@pytest.fixture
def mock_professors():
    """Sample professor data for testing."""
    return [
        {
            "id": "prof-1",
            "name": "Dr. Alice Smith",
            "title": "AI Professor",
            "bio": "Expert in machine learning and deep learning",
            "subjects": ["Machine Learning", "Python", "Data Science"],
            "languages": ["English", "Spanish"],
            "rating": 4.9,
            "hourly_rate": "75",
            "image": None,
        },
        {
            "id": "prof-2",
            "name": "Dr. Bob Chen",
            "title": "Mathematics Professor",
            "bio": "Specializes in calculus and linear algebra",
            "subjects": ["Mathematics", "Calculus", "Linear Algebra"],
            "languages": ["English", "Mandarin"],
            "rating": 4.7,
            "hourly_rate": "60",
            "image": None,
        },
    ]


@pytest.fixture
def mock_a2a_agents():
    """Sample A2A agent data for testing."""
    return [
        {
            "id": "agent-1",
            "name": "professor-nova-agentic-ai-leader",
            "description": "Technical interview coach for Agentic AI Leader roles",
            "tags": ["teacher", "interview", "agentic-ai", "leadership"],
            "visibility": "public",
            "enabled": True,
        },
        {
            "id": "agent-2",
            "name": "professor-calculus-tutor",
            "description": "Mathematics tutoring agent for calculus",
            "tags": ["teacher", "mathematics", "calculus"],
            "visibility": "public",
            "enabled": True,
        },
    ]


@pytest.fixture
def mock_interview_turn():
    """Sample interview turn data."""
    return {
        "feedback_bullets": [
            "Good understanding of agent orchestration patterns",
            "Consider mentioning evaluation frameworks like RAGAS",
        ],
        "score_0_10": 7,
        "next_question": "How would you design an evaluation pipeline for a multi-agent system?",
        "tags": ["evaluation", "multi-agent"],
    }


@pytest.fixture
def mock_interview_plan():
    """Sample interview plan data."""
    return {
        "plan_bullets": [
            "Assess multi-agent system design experience",
            "Evaluate tool orchestration and MCP knowledge",
            "Test production LLM deployment skills",
            "Probe leadership and team management",
        ],
        "rubric": {
            "dimensions": [
                "System Design",
                "Agent Orchestration",
                "MLOps",
                "Leadership",
            ],
            "scoring_notes": [
                "0-3: Basic awareness only",
                "4-6: Practical experience",
                "7-10: Expert with production track record",
            ],
        },
        "opening_question": "Tell me about a multi-agent system you designed. What were the key architectural decisions?",
    }
