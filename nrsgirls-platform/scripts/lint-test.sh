#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Root-level frontend/nextjs
if [ -d "$ROOT/frontend/nextjs" ] && [ -f "$ROOT/frontend/nextjs/package.json" ]; then
  cd "$ROOT/frontend/nextjs"
  if grep -q ""lint"" package.json; then
    if command -v yarn >/dev/null 2>&1; then yarn lint; else npm run lint; fi || true
  fi
  if grep -q ""test"" package.json; then
    if command -v yarn >/dev/null 2>&1; then yarn test; else npm test; fi || true
  fi
fi

# Platform frontend
if [ -d "$ROOT/nrsgirls-platform/frontend" ] && [ -f "$ROOT/nrsgirls-platform/frontend/package.json" ]; then
  cd "$ROOT/nrsgirls-platform/frontend"
  if grep -q ""lint"" package.json; then
    if command -v yarn >/dev/null 2>&1; then yarn lint; else npm run lint; fi || true
  fi
  if grep -q ""test"" package.json; then
    if command -v yarn >/dev/null 2>&1; then yarn test; else npm test; fi || true
  fi
fi

# Platform backend
if [ -d "$ROOT/nrsgirls-platform/backend" ] && [ -f "$ROOT/nrsgirls-platform/backend/package.json" ]; then
  cd "$ROOT/nrsgirls-platform/backend"
  if grep -q ""lint"" package.json; then
    if command -v yarn >/dev/null 2>&1; then yarn lint; else npm run lint; fi || true
  fi
  if grep -q ""test"" package.json; then
    if command -v yarn >/dev/null 2>&1; then yarn test; else npm test; fi || true
  fi
fi

echo "Lint/test tasks executed (best-effort).
"