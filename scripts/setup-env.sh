#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -f .env.example ]; then
  echo "ERROR: .env.example not found" >&2
  exit 1
fi

# Create .env.local if missing
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "✓ Created .env.local from .env.example"
else
  echo "⚠ .env.local already exists; will only patch missing safe defaults"
fi

# Helper: set KEY=VALUE if key is missing or still set to an obvious placeholder
set_kv() {
  local key="$1"; shift
  local value="$1"; shift
  local file=".env.local"

  if ! grep -qE "^${key}=" "$file"; then
    echo "${key}=${value}" >> "$file"
    return
  fi

  # Replace placeholder-ish values
  if grep -qE "^${key}=(your-|REPLACE_ME|changeme|change-me|sk-your-|your-google-|your-paypal-|your-very-strong-|\"\"|postgresql://user:password@).*$" "$file"; then
    if sed --version >/dev/null 2>&1; then
      sed -i "s|^${key}=.*|${key}=${value}|" "$file"
    else
      sed -i '' "s|^${key}=.*|${key}=${value}|" "$file"
    fi
  fi
}

set_kv NEXT_PUBLIC_APP_URL "http://localhost:3000"
set_kv NEXTAUTH_URL "http://localhost:3000"
set_kv DATABASE_URL "postgresql://learnai:learnai@localhost:5432/learnai"

# Set optional service vars to empty so build doesn't crash on missing refs
set_kv GOOGLE_CLIENT_ID ""
set_kv GOOGLE_CLIENT_SECRET ""
set_kv OPENAI_API_KEY ""
set_kv PAYPAL_CLIENT_ID ""
set_kv PAYPAL_CLIENT_SECRET ""
set_kv PAYPAL_ENVIRONMENT "sandbox"

# Ensure NEXTAUTH_SECRET is set to a strong random value
if ! grep -qE '^NEXTAUTH_SECRET=' .env.local || grep -qE '^NEXTAUTH_SECRET=(your-|REPLACE_ME|changeme|change-me|)$' .env.local; then
  secret="$(openssl rand -base64 48 | tr -d '\n')"
  if grep -qE '^NEXTAUTH_SECRET=' .env.local; then
    if sed --version >/dev/null 2>&1; then
      sed -i "s|^NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=${secret}|" .env.local
    else
      sed -i '' "s|^NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=${secret}|" .env.local
    fi
  else
    echo "NEXTAUTH_SECRET=${secret}" >> .env.local
  fi
  echo "✓ Generated NEXTAUTH_SECRET"
fi

# Prisma CLI reads .env (not .env.local). Create/update .env with DATABASE_URL
# so that prisma migrate/generate works outside of Next.js context.
DB_URL=$(grep '^DATABASE_URL=' .env.local | head -1)
if [ -n "$DB_URL" ]; then
  echo "$DB_URL" > .env
  echo "✓ Created .env for Prisma CLI"
fi

echo "✓ Environment ready (.env.local)"
echo "  - Local DB: postgresql://learnai:learnai@localhost:5432/learnai"
echo "  - For Google/PayPal/OpenAI, fill in the corresponding variables when needed."
