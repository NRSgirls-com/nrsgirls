#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# frontend
if [ -d "$ROOT/frontend" ] && [ -f "$ROOT/frontend/package.json" ]; then
  cd "$ROOT/frontend"
  if grep -q ""lint"" package.json; then
    if command -v yarn >/dev/null 2>&1; then yarn lint; else npm run lint; fi || true
  fi
  if grep -q ""test"" package.json; then
    if command -v yarn >/dev/null 2>&1; then yarn test; else npm test; fi || true
  fi
fi
# backend
if [ -d "$ROOT/backend" ] && [ -f "$ROOT/backend/package.json" ]; then
  cd "$ROOT/backend"
  if grep -q ""lint"" package.json; then
    if command -v yarn >/dev/null 2>&1; then yarn lint; else npm run lint; fi || true
  fi
  if grep -q ""test"" package.json; then
    if command -v yarn >/dev/null 2>&1; then yarn test; else npm test; fi || true
  fi
fi
echo "Lint/test tasks executed (best-effort).
"