# Professor Interview Agent (A2A JSON-RPC)

This is a **single "Professor" agent** that runs a technical interview based on a provided **job description**.

It is designed to be **registered in MCP Context Forge as an A2A agent** (`agent_type: jsonrpc`).

## What it does

- Receives a prompt from the LearnAI portal (e.g., generate an interview plan, run next interview turn).
- Calls **Ollama (OpenAI-compatible)** by default.
- Returns concise **JSON-only** outputs (so the frontend can render cleanly).

## Run locally

Prereqs:
- Ollama running with `llama3:8b` pulled

```bash
cd agents/professor-interview-agent
npm install

export LLM_BASE_URL="http://localhost:11434/v1"
export LLM_MODEL="llama3:8b"
export LLM_API_KEY="ollama"

npm run dev
```

The server listens on `http://localhost:9999/` and accepts JSON-RPC 2.0 POST requests.

## Context Forge registration

Use the provided `contextforge-agent.json` with the sync script in `/scripts/contextforge-sync.sh`.
