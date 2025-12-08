#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [ -f .env ]; then
  # shellcheck disable=SC1090
  set -a; source .env; set +a
fi
# check DB
if [ -n ""${DATABASE_URL:-}" ]; then
  echo "Checking database connection..."
  if psql "$DATABASE_URL" -c '\l' >/dev/null 2>&1; then
    echo "Database OK"
  else
    echo "Database unreachable"
  fi
else
  echo "DATABASE_URL not set; skipping DB check"
fi
# example HTTP check (customize)
if [ -n ""${HEALTH_URL:-}" ]; then
  echo "Checking HTTP health: $HEALTH_URL"
  if command -v curl >/dev/null 2>&1; then
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || true)
    echo "HTTP status: ${STATUS}"
  else
    echo "curl not found; skipping HTTP check"
  fi
fi
echo "Healthcheck done."