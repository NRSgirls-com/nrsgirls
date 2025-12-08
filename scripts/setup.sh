#!/usr/bin/env bash
set -euo pipefail
echo "== nrsgirls setup.sh =="
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"
# Load .env.example
if [ -f .env.example ] && [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi
# Optionally check node
if command -v node >/dev/null 2>&1; then
  echo "Node.js found: $(node -v)"
else
  echo "Node.js not found in PATH; install Node (recommended v18+) for frontend/backend installs."
fi
# Helper to install deps
install_if_pkg() {
  local dir=$1
  if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
    echo "Installing dependencies in $dir"
    if command -v yarn >/dev/null 2>&1; then
      (cd "$dir" && yarn install)
    elif command -v npm >/dev/null 2>&1; then
      (cd "$dir" && npm install)
    else
      echo "No npm/yarn found; skipping $dir install"
    fi
  fi
}
# Install frontend/nextjs
install_if_pkg frontend/nextjs
echo "Setup complete. Edit .env and run the services you need.
"