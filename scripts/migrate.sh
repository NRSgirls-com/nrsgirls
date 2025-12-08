#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT/backend" || { echo "backend directory missing"; exit 1; }
if [ -f package.json ] && grep -q ""migrate"" package.json; then
  if command -v yarn >/dev/null 2>&1; then
    yarn migrate
  else
    npm run migrate
  fi
  exit 0
fi
if command -v npx >/dev/null 2>&1 && npx --yes knex >/dev/null 2>&1 2>/dev/null; then
  npx knex migrate:latest
  exit 0
fi
if command -v npx >/dev/null 2>&1 && npx --yes sequelize-cli >/dev/null 2>&1 2>/dev/null; then
  npx sequelize-cli db:migrate
  exit 0
fi
echo "No migration runner found. Add an npm script "migrate" or install a known migration tool."
