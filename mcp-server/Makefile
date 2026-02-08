# LearnAI MCP Server - Makefile
# ============================================================================

.PHONY: help install dev test lint format run-stdio run-http clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	pip install -e .

install-dev: ## Install with dev dependencies
	pip install -e ".[dev]"

dev: ## Run server in stdio mode for development
	python -m learnai_mcp.server --transport stdio

run-stdio: ## Run server in stdio transport mode
	learnai-mcp --transport stdio

run-http: ## Run server in HTTP transport mode on port 9100
	learnai-mcp --transport http --port 9100

test: ## Run tests
	pytest tests/ -v --cov=src/learnai_mcp

lint: ## Run linter
	ruff check src/ tests/

format: ## Format code
	ruff format src/ tests/

typecheck: ## Run type checker
	mypy src/

clean: ## Clean build artifacts
	rm -rf build/ dist/ *.egg-info src/*.egg-info .pytest_cache .mypy_cache .ruff_cache
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true

# ============================================================================
# MCP Context Forge Integration
# ============================================================================

register-gateway: ## Register this server as a gateway in MCP Context Forge
	@echo "Registering LearnAI MCP Server with Context Forge..."
	curl -s -X POST "$${MCPGATEWAY_URL:-http://localhost:4444}/gateways" \
		-u "$${BASIC_AUTH_USER:-admin}:$${BASIC_AUTH_PASSWORD:-changeme}" \
		-H "Content-Type: application/json" \
		-d '{"gateway": {"name": "learnai-mcp-server", "url": "http://localhost:9100/sse", "transport": "sse", "description": "LearnAI tutoring marketplace tools"}}' \
		| python -m json.tool

register-catalog: ## Register catalog entries with MCP Context Forge
	@echo "Registering LearnAI catalog entries..."
	curl -s -X POST "$${MCPGATEWAY_URL:-http://localhost:4444}/catalog/learnai-tutoring/register" \
		-u "$${BASIC_AUTH_USER:-admin}:$${BASIC_AUTH_PASSWORD:-changeme}" \
		-H "Content-Type: application/json" \
		-d '{}' \
		| python -m json.tool
