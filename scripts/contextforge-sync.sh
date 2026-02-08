#!/usr/bin/env bash
set -euo pipefail

# Sync all local agents into MCP Context Forge (A2A catalog).
#
# Usage:
#   MCPGATEWAY_URL=http://localhost:4444 BASIC_AUTH_USER=admin BASIC_AUTH_PASSWORD=changeme \
#   bash scripts/contextforge-sync.sh
#
# Requirements: curl, jq

BASE_URL="${MCPGATEWAY_URL:-http://localhost:4444}"
USER="${BASIC_AUTH_USER:-admin}"
PASS="${BASIC_AUTH_PASSWORD:-changeme}"
AUTH=(-u "${USER}:${PASS}")
H=( -H "Content-Type: application/json" )

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required" >&2
  exit 1
fi

echo "== ContextForge: syncing A2A teacher agents =="
echo "Base URL: ${BASE_URL}"

shopt -s nullglob
FILES=(agents/*/contextforge-agent.json)

if [[ ${#FILES[@]} -eq 0 ]]; then
  echo "No agent manifests found at agents/*/contextforge-agent.json" >&2
  exit 1
fi

existing_json=$(curl -s "${AUTH[@]}" "${BASE_URL}/a2a?include_inactive=true&limit=0&include_pagination=false" || echo "[]")

for f in "${FILES[@]}"; do
  name=$(jq -r '.agent.name' "$f")
  payload=$(jq -c '.' "$f")

  existing_id=$(echo "$existing_json" | jq -r --arg n "$name" '.[] | select(.name==$n) | .id' | head -n 1)

  if [[ -n "${existing_id}" && "${existing_id}" != "null" ]]; then
    echo "Updating agent: ${name} (${existing_id})"
    curl -s "${AUTH[@]}" -X PUT "${BASE_URL}/a2a/${existing_id}" "${H[@]}" -d "$payload" >/dev/null
  else
    echo "Creating agent: ${name}"
    curl -s "${AUTH[@]}" -X POST "${BASE_URL}/a2a" "${H[@]}" -d "$payload" >/dev/null
  fi
done

echo "Done. Your portal will show these AI teachers on /explore (live from ContextForge)."
