#!/usr/bin/env bash
set -euo pipefail

# Create the learnai database and user if they don't exist (for native PostgreSQL).
# Skipped if Docker is being used (docker compose manages the db).

if docker compose ps db 2>/dev/null | grep -q "running"; then
  echo "✓ Using Docker PostgreSQL (already configured)"
  exit 0
fi

if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
  echo "⚠ PostgreSQL not reachable on localhost:5432 - skipping DB user/database creation"
  exit 0
fi

echo "Ensuring learnai database and user exist (native PostgreSQL)..."

# Create user if not exists
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='learnai'" 2>/dev/null | grep -q 1; then
  sudo -u postgres psql -c "CREATE USER learnai WITH PASSWORD 'learnai';" 2>/dev/null || true
  echo "✓ Created PostgreSQL user 'learnai'"
else
  echo "✓ PostgreSQL user 'learnai' already exists"
fi

# Create database if not exists
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='learnai'" 2>/dev/null | grep -q 1; then
  sudo -u postgres psql -c "CREATE DATABASE learnai OWNER learnai;" 2>/dev/null || true
  echo "✓ Created PostgreSQL database 'learnai'"
else
  echo "✓ PostgreSQL database 'learnai' already exists"
fi

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE learnai TO learnai;" 2>/dev/null || true
echo "✓ Database setup complete"
