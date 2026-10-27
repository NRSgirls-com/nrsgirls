#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
FRONTEND="$ROOT/nrsgirls-platform/frontend"

if [ ! -f "$FRONTEND/package.json" ]; then
  echo "Frontend package.json not found: $FRONTEND" >&2
  exit 1
fi

run_checks() {
  local dir="$1"
  local task
  [ -f "$dir/package.json" ] || return 0
  for task in lint test; do
    if (cd "$dir" && node -e 'const p = require("./package.json"); process.exit(p.scripts && p.scripts[process.argv[1]] ? 0 : 1)' "$task"); then
      echo "Running $task in $dir"
      if command -v yarn >/dev/null 2>&1; then
        (cd "$dir" && yarn run "$task")
      else
        (cd "$dir" && npm run "$task")
      fi
    fi
  done
}

run_checks "$FRONTEND"
run_checks "$ROOT/nrsgirls-platform/backend"
echo "Configured lint/test tasks passed."
