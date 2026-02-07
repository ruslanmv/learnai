#!/usr/bin/env bash
set -euo pipefail

echo "Waiting for PostgreSQL to become ready..."

for i in $(seq 1 60); do
  # Try docker compose first, then fall back to local pg_isready
  if docker compose exec -T db pg_isready -U learnai -d learnai >/dev/null 2>&1; then
    echo "✓ PostgreSQL is ready (Docker)"
    exit 0
  fi
  if pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    echo "✓ PostgreSQL is ready (local)"
    exit 0
  fi
  sleep 1
done

echo "ERROR: PostgreSQL did not become ready in time." >&2
exit 1
