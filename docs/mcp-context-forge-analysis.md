# MCP Context Forge - Analysis & Integration Guide

## Overview

[MCP Context Forge](https://github.com/ruslanmv/mcp-context-forge) is a production-grade gateway and registry that federates Model Context Protocol (MCP) services, REST APIs, and Agent-to-Agent (A2A) servers into a single unified endpoint for AI clients. Originally built by IBM, it provides centralized governance for AI tool ecosystems.

This document analyzes how to create **agents**, **A2A servers**, **MCP servers**, **tools**, and how to add them to the **MCP Context Forge catalog** for use with the LearnAI platform.

---

## Architecture

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   AI CLIENT      │  │   AI CLIENT      │  │   AI CLIENT      │
│  (Claude, GPT)   │  │  (watsonx)       │  │  (Custom Agent)  │
└────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
         │         MCP Protocol (JSON-RPC 2.0)        │
         └────────────────────┬───────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MCP CONTEXT FORGE                          │
│  ┌───────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Registry  │  │ Gateway  │  │ Auth &   │  │ Metrics &    │   │
│  │ (Tools,   │  │ Layer    │  │ RBAC     │  │ Logging      │   │
│  │ Resources)│  │          │  │          │  │              │   │
│  └───────────┘  └──────────┘  └──────────┘  └──────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  MCP Server      │ │  REST API        │ │  A2A Agent       │
│  (Native)        │ │  (Virtualized)   │ │  (External)      │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

---

## 1. How to Create MCP Tools

### What is a Tool?

A **tool** is an executable function that AI clients can discover and invoke through the MCP protocol. Each tool has:
- **name** - Unique identifier (slug format)
- **description** - Human-readable explanation (helps AI reason about usage)
- **inputSchema** - JSON Schema defining required parameters

### Method A: Register via REST API

```bash
curl -X POST "http://localhost:4444/tools" \
  -u admin:changeme \
  -H "Content-Type: application/json" \
  -d '{
    "tool": {
      "name": "recommend_professors",
      "description": "Get AI-powered professor recommendations based on subject and learning preferences",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": {
            "type": "string",
            "description": "Student learning request or subject area"
          },
          "language": {
            "type": "string",
            "description": "Preferred teaching language"
          },
          "max_results": {
            "type": "integer",
            "description": "Maximum number of recommendations",
            "default": 5
          }
        },
        "required": ["query"]
      }
    }
  }'
```

### Method B: Define in an MCP Server (FastMCP)

```python
from fastmcp import FastMCP

mcp = FastMCP(name="learnai-server", version="1.0.0")

@mcp.tool(description="Get AI-powered professor recommendations")
async def recommend_professors(
    query: str,
    language: str = "English",
    max_results: int = 5,
) -> dict:
    """Search for professors matching the student's learning needs."""
    # Business logic here
    return {"professors": [...], "explanation": "..."}
```

### Method C: Define in an MCP Server (Low-level SDK)

```python
from mcp.server import Server
from mcp.types import Tool, TextContent

server = Server("learnai-server")

@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="recommend_professors",
            description="Get AI-powered professor recommendations",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Learning request"},
                    "language": {"type": "string", "default": "English"},
                    "max_results": {"type": "integer", "default": 5},
                },
                "required": ["query"],
            },
        )
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    if name == "recommend_professors":
        result = await find_professors(arguments)
        return [TextContent(type="text", text=json.dumps(result))]
    raise ValueError(f"Unknown tool: {name}")
```

### Tool Governance

Tools can be enabled/disabled instantly via the gateway API:

```bash
# Disable a tool (immediately hidden from all AI clients)
curl -X POST "http://localhost:4444/tools/{tool_id}/state?activate=false" \
  -u admin:changeme

# Re-enable the tool
curl -X POST "http://localhost:4444/tools/{tool_id}/state?activate=true" \
  -u admin:changeme
```

---

## 2. How to Create MCP Servers

### What is an MCP Server?

An MCP Server is a standalone service that exposes one or more tools, resources, and prompts via the Model Context Protocol. When registered with Context Forge, its tools are automatically discovered and federated into the unified catalog.

### Scaffolding a New Server

```bash
# Clone the mcp-context-forge repo
git clone https://github.com/ruslanmv/mcp-context-forge.git
cd mcp-context-forge

# Scaffold a new Python MCP server
./mcp-servers/scaffold-python-server.sh learnai_server
```

This generates:
```
mcp-servers/python/learnai_server/
  src/learnai_server/
    __init__.py
    server.py           # Main server with tool definitions
  tests/
  Containerfile
  Makefile
  pyproject.toml
```

### Server Implementation Pattern

```python
# server.py
import asyncio
import argparse
from fastmcp import FastMCP

mcp = FastMCP(name="learnai-mcp-server", version="1.0.0")
_semaphore = asyncio.Semaphore(10)  # Concurrency control

@mcp.tool(description="Search for professors by subject, language, and expertise")
async def search_professors(
    subject: str,
    language: str = "English",
    min_rating: float = 0.0,
    limit: int = 10,
) -> dict:
    """Find professors matching specific criteria."""
    async with _semaphore:
        # Query your database or API
        return {"professors": [...]}

@mcp.tool(description="Create a booking for a tutoring session")
async def create_booking(
    professor_id: str,
    student_id: str,
    subject: str,
    duration_minutes: int = 60,
    notes: str = "",
) -> dict:
    """Book a tutoring session with a professor."""
    async with _semaphore:
        return {"booking_id": "...", "status": "confirmed"}

@mcp.tool(description="Get AI-powered professor recommendations for a learning goal")
async def recommend_professors(
    query: str,
    max_results: int = 5,
) -> dict:
    """Use AI to match students with the best professors."""
    async with _semaphore:
        return {"recommendations": [...], "explanation": "..."}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--transport", choices=["stdio", "http"], default="stdio")
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=9100)
    args = parser.parse_args()

    if args.transport == "http":
        mcp.run(transport="http", host=args.host, port=args.port)
    else:
        mcp.run()

if __name__ == "__main__":
    main()
```

### Server Dependencies (`pyproject.toml`)

```toml
[project]
name = "learnai-mcp-server"
version = "1.0.0"
requires-python = ">=3.11"
dependencies = [
    "fastmcp>=2.14.4",
    "mcp>=1.26.0",
    "pydantic>=2.5.0",
    "httpx>=0.27.0",
]

[project.scripts]
learnai-mcp = "learnai_mcp.server:main"
```

### Registering with Context Forge

```bash
# Register the MCP server as a gateway
curl -X POST "http://localhost:4444/gateways" \
  -u admin:changeme \
  -H "Content-Type: application/json" \
  -d '{
    "gateway": {
      "name": "learnai-mcp-server",
      "url": "http://learnai-mcp:9100/sse",
      "transport": "sse",
      "description": "LearnAI tutoring marketplace tools"
    }
  }'

# Refresh to discover tools
curl -X POST "http://localhost:4444/gateways/{gateway_id}/refresh" \
  -u admin:changeme
```

### Transport Options

| Transport | URL Pattern | Use Case |
|-----------|------------|----------|
| SSE | `http://host:port/sse` | Unidirectional streaming |
| WebSocket | `ws://host:port/ws` | Full-duplex bidirectional |
| HTTP | `http://host:port` | Standard request/response |
| stdio | Process-based | Local/containerized servers |
| Streamable HTTP | `http://host:port/mcp` | HTTP streaming |

---

## 3. How to Create A2A (Agent-to-Agent) Servers

### What is A2A?

A2A (Agent-to-Agent) enables external AI agents to be registered and invoked through the Context Forge gateway. Each A2A agent becomes a tool that other AI clients can discover and use.

### Registering an A2A Agent

```bash
curl -X POST "http://localhost:4444/a2a" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "learnai-tutor-agent",
    "url": "http://learnai-agent:8080/a2a",
    "description": "AI tutoring agent that helps students find and book professors",
    "auth_type": "bearer",
    "auth_value": "agent-secret-token",
    "visibility": "public",
    "tags": ["education", "tutoring", "ai-matching"]
  }'
```

### A2A Agent Implementation

```python
from fastapi import FastAPI, Request
from pydantic import BaseModel

app = FastAPI()

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

@app.post("/a2a")
async def handle_a2a(request: JSONRPCRequest) -> JSONRPCResponse:
    """Handle A2A JSON-RPC requests from the gateway."""
    if request.method == "invoke":
        result = await process_tutoring_request(request.params)
        return JSONRPCResponse(result=result, id=request.id)

    return JSONRPCResponse(
        error={"code": -32601, "message": f"Method not found: {request.method}"},
        id=request.id,
    )

async def process_tutoring_request(params: dict) -> dict:
    """Process a tutoring request from another agent."""
    query = params.get("query", "")
    # AI-powered matching logic
    return {
        "recommendations": [...],
        "explanation": "Based on your learning goals...",
    }
```

### A2A Visibility Model

| Visibility | Access |
|-----------|--------|
| `public` | All authenticated users |
| `team` | Team members only (scoped by `team_id`) |
| `private` | Owner-only access |

### A2A Settings (Environment Variables)

```bash
MCPGATEWAY_A2A_ENABLED=true           # Master toggle
MCPGATEWAY_A2A_MAX_AGENTS=100         # Max concurrent agents
MCPGATEWAY_A2A_DEFAULT_TIMEOUT=30     # Seconds
MCPGATEWAY_A2A_MAX_RETRIES=3
MCPGATEWAY_A2A_METRICS_ENABLED=true
```

---

## 4. How to Create Agents (LangChain Runtime)

### What is an Agent Runtime?

The agent runtime is a LangChain-based agent that connects to the MCP Gateway, discovers tools, and uses an LLM to orchestrate tool calls in response to user queries.

### Agent Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  User Query  │────▶│  LangChain   │────▶│  MCP Gateway │
│              │     │  Agent       │     │  (Tools)     │
│              │◀────│  + LLM       │◀────│              │
│  Response    │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Agent Implementation

```python
# agent.py
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain_openai import ChatOpenAI
from langchain.tools import BaseTool
import httpx

class MCPTool(BaseTool):
    """Wraps an MCP tool as a LangChain tool."""
    name: str
    description: str
    gateway_url: str
    auth_token: str

    def _run(self, **kwargs) -> str:
        response = httpx.post(
            f"{self.gateway_url}/rpc",
            json={
                "jsonrpc": "2.0",
                "method": "tools/call",
                "params": {"name": self.name, "arguments": kwargs},
                "id": 1,
            },
            headers={"Authorization": f"Bearer {self.auth_token}"},
        )
        return response.json()["result"]

class LearnAIAgent:
    def __init__(self, gateway_url: str, auth_token: str, llm_model: str = "gpt-4"):
        self.gateway_url = gateway_url
        self.auth_token = auth_token
        self.llm = ChatOpenAI(model=llm_model)
        self.tools = self._discover_tools()

    def _discover_tools(self) -> list[MCPTool]:
        """Discover tools from MCP Gateway."""
        response = httpx.get(
            f"{self.gateway_url}/tools",
            headers={"Authorization": f"Bearer {self.auth_token}"},
        )
        return [
            MCPTool(
                name=t["name"],
                description=t["description"],
                gateway_url=self.gateway_url,
                auth_token=self.auth_token,
            )
            for t in response.json()
        ]

    async def run(self, query: str) -> str:
        """Execute agent with discovered tools."""
        agent = create_openai_tools_agent(self.llm, self.tools, prompt=...)
        executor = AgentExecutor(agent=agent, tools=self.tools)
        result = await executor.ainvoke({"input": query})
        return result["output"]
```

### Supported LLM Providers

| Provider | Environment Variable | Model Examples |
|----------|---------------------|----------------|
| OpenAI | `OPENAI_API_KEY` | gpt-4, gpt-4o-mini |
| Anthropic | `ANTHROPIC_API_KEY` | claude-3-opus, claude-3-sonnet |
| Azure OpenAI | `AZURE_OPENAI_*` | deployment-specific |
| AWS Bedrock | `AWS_*` | anthropic.claude-v3, etc. |
| Ollama | `OLLAMA_BASE_URL` | llama3, mistral |

---

## 5. How to Add to the MCP Context Forge Catalog

### Catalog File Format

The catalog is a YAML file (`mcp-catalog.yml`) that lists all available MCP servers that can be registered with the gateway.

```yaml
catalog_servers:
  - id: learnai-tutoring
    name: "LearnAI Tutoring Platform"
    category: "Education"
    url: "https://learnai.example.com/mcp/sse"
    auth_type: "API Key"
    provider: "LearnAI"
    description: "AI-powered tutoring marketplace connecting students with expert professors"
    requires_api_key: true
    tags: ["education", "tutoring", "ai-matching", "booking"]
    secure: true

  - id: learnai-recommendations
    name: "LearnAI Professor Recommendations"
    category: "Education"
    url: "https://learnai.example.com/mcp/recommendations/sse"
    auth_type: "Bearer"
    provider: "LearnAI"
    description: "AI-powered professor recommendation engine using GPT-4"
    requires_api_key: true
    tags: ["education", "ai", "recommendations", "matching"]
```

### Catalog Entry Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique slug identifier |
| `name` | string | Yes | Human-readable display name |
| `category` | string | Yes | Functional classification |
| `url` | string | Yes | MCP endpoint URL |
| `auth_type` | string | Yes | `OAuth2.1`, `OAuth`, `API Key`, `Open`, `Bearer` |
| `provider` | string | Yes | Organization name |
| `description` | string | Yes | ~125 character description |
| `requires_api_key` | boolean | Yes | Whether credentials are needed |
| `tags` | list[string] | Yes | Searchable keywords |
| `secure` | boolean | No | Enhanced security flag |

### Registering Catalog Entries

```bash
# Register a single catalog server
curl -X POST "http://localhost:4444/catalog/learnai-tutoring/register" \
  -u admin:changeme \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "your-learnai-api-key"
  }'

# Bulk register multiple servers
curl -X POST "http://localhost:4444/catalog/bulk-register" \
  -u admin:changeme \
  -H "Content-Type: application/json" \
  -d '{
    "server_ids": ["learnai-tutoring", "learnai-recommendations"],
    "skip_errors": true
  }'
```

### Catalog Settings

```bash
MCPGATEWAY_CATALOG_ENABLED=true
MCPGATEWAY_CATALOG_FILE="mcp-catalog.yml"
MCPGATEWAY_CATALOG_AUTO_HEALTH_CHECK=true
MCPGATEWAY_CATALOG_CACHE_TTL=3600
MCPGATEWAY_CATALOG_PAGE_SIZE=100
```

---

## 6. Plugin System

### Creating a Plugin

Plugins provide pre/post processing hooks around tool invocations, prompts, and resources.

```python
# plugins/learnai_auth/plugin.py
from mcpgateway.plugins.framework.base import Plugin
from mcpgateway.plugins.framework.models import PluginConfig, PluginContext, PluginViolation
from mcpgateway.plugins.framework.hooks.tools import ToolPreInvokePayload, ToolPreInvokeResult

class LearnAIAuthPlugin(Plugin):
    """Validates student authentication before tool invocations."""

    async def tool_pre_invoke(
        self, payload: ToolPreInvokePayload, context: PluginContext
    ) -> ToolPreInvokeResult:
        # Check if student is authenticated
        headers = payload.headers or {}
        if not headers.get("X-Student-Token"):
            return ToolPreInvokeResult(
                continue_processing=False,
                violations=[PluginViolation(
                    reason="Authentication required",
                    description="Student must be authenticated to use tutoring tools",
                    code="STUDENT_AUTH_REQUIRED",
                )],
            )
        return ToolPreInvokeResult(continue_processing=True, modified_payload=payload)
```

### Plugin Configuration

```yaml
# plugins/config.yaml
plugins:
  - name: LearnAIAuth
    kind: plugins.learnai_auth.plugin.LearnAIAuthPlugin
    hooks:
      - tool_pre_invoke
    mode: enforce
    priority: 5
    tags:
      - authentication
      - education
    config:
      require_student_token: true
```

### Plugin Modes

| Mode | Behavior |
|------|----------|
| `enforce` | Violations block processing |
| `enforce_ignore_error` | Violations block; plugin errors are logged but continue |
| `permissive` | Violations logged but processing continues (audit mode) |
| `disabled` | Plugin is skipped |

---

## 7. Virtual Servers

Virtual servers compose custom tool sets from multiple sources for different use cases.

```bash
# Create a virtual server for student-facing tools only
curl -X POST "http://localhost:4444/servers" \
  -u admin:changeme \
  -H "Content-Type: application/json" \
  -d '{
    "server": {
      "name": "learnai-student-tools",
      "description": "Safe tools for student-facing AI interactions",
      "tool_ids": ["search_professors_id", "recommend_professors_id", "create_booking_id"]
    }
  }'
```

Students connect to: `http://localhost:4444/servers/{server_id}/sse`

---

## Quick Reference

| Task | How To |
|------|--------|
| **Add a tool** | POST to `/tools` with name, description, inputSchema |
| **Create MCP server** | Use FastMCP with `@mcp.tool()` decorators |
| **Register A2A agent** | POST to `/a2a` with agent URL, auth, visibility |
| **Add to catalog** | Add entry to `mcp-catalog.yml` with id, name, url, tags |
| **Create plugin** | Extend `Plugin` base class, configure in `plugins/config.yaml` |
| **Create virtual server** | POST to `/servers` with curated tool_ids |
| **Enable/disable tool** | POST to `/tools/{id}/state?activate=true|false` |
| **Discover tools** | GET `/tools` (returns all enabled tools with schemas) |

---

## References

- **GitHub**: https://github.com/ruslanmv/mcp-context-forge
- **Original (IBM)**: https://github.com/IBM/mcp-context-forge
- **PyPI**: `pip install mcp-contextforge-gateway`
- **MCP Specification**: https://modelcontextprotocol.io
