#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Try root-level frontend/nextjs first
FRONTEND_DIR="$ROOT/frontend/nextjs"
if [ ! -d "$FRONTEND_DIR" ]; then
  # Fall back to platform frontend
  FRONTEND_DIR="$ROOT/nrsgirls-platform/frontend"
fi

if [ ! -d "$FRONTEND_DIR" ]; then
  echo "Frontend directory not found"
  exit 1
fi

cd "$FRONTEND_DIR"
if [ -f package.json ] && grep -q ""build"" package.json; then
  if command -v yarn >/dev/null 2>&1; then
    yarn build
  else
    npm run build
  fi
  echo "Frontend build finished."
else
  echo "No build script found in frontend/package.json"
fi
