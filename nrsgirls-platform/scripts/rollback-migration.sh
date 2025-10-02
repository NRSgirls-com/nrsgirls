#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT/backend" || { echo "backend directory missing"; exit 1; }
if [ -f package.json ] && grep -q ""migrate:down"" package.json; then
  if command -v yarn >/dev/null 2>&1; then
    yarn migrate:down
  else
    npm run migrate:down
  fi
  exit 0
fi
if command -v npx >/dev/null 2>&1 && npx --yes knex >/dev/null 2>&1 2>/dev/null; then
  npx knex migrate:down
  exit 0
fi
if command -v npx >/dev/null 2>&1 && npx --yes sequelize-cli >/dev/null 2>&1 2>/dev/null; then
  npx sequelize-cli db:migrate:undo
  exit 0
fi
echo "No recognized rollback command found. Add a migrate:down script."
