# LearnAI MCP Server

Model Context Protocol server that exposes the LearnAI tutoring marketplace as tools for AI clients. Designed to work with [MCP Context Forge](https://github.com/ruslanmv/mcp-context-forge).

## Tools

| Tool | Description |
|------|-------------|
| `search_professors` | Search for professors by subject, language, rating |
| `recommend_professors` | AI-powered professor recommendations using GPT-4 |
| `create_booking` | Book a tutoring session with a professor |
| `get_booking_status` | Check current status of a booking |
| `list_subjects` | List available tutoring subjects |

## Quick Start

```bash
# Install
pip install -e .

# Run (stdio transport)
learnai-mcp

# Run (HTTP transport for network access)
learnai-mcp --transport http --port 9100
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LEARNAI_API_URL` | `http://localhost:3000` | LearnAI Next.js app URL |
| `LEARNAI_API_KEY` | (empty) | API key for authentication |

## Register with MCP Context Forge

```bash
# Start the MCP server in HTTP mode
learnai-mcp --transport http --port 9100

# Register as a gateway
make register-gateway

# Or register from the catalog
make register-catalog
```

## Container

```bash
# Build
docker build -f Containerfile -t learnai-mcp-server .

# Run
docker run -p 9100:9100 -e LEARNAI_API_URL=http://host.docker.internal:3000 learnai-mcp-server
```
