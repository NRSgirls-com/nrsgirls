#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
if ! command -v node >/dev/null 2>&1; then
  echo "Install Node.js 24 LTS, then run this script again." >&2
  exit 1
fi
node -e 'if (Number(process.versions.node.split(".")[0]) !== 24) { console.error("This app is tested on Node.js 24. Use Node.js 24 LTS."); process.exit(1); }'
export PUBLIC_ORIGIN="${PUBLIC_ORIGIN:-http://localhost:${PORT:-3000}}"
export HOST="${HOST:-127.0.0.1}"
if [ ! -f "${DATA_DIR:-data}/platform.sqlite" ] || ! node --input-type=module -e '
  import { DatabaseSync } from "node:sqlite";
  let db;
  try {
    db = new DatabaseSync(process.argv[1], { readOnly: true });
    const admin = db.prepare("SELECT id FROM users WHERE role=?").get("admin");
    db.close(); process.exit(admin ? 0 : 1);
  } catch { if (db) db.close(); process.exit(1); }
' "${DATA_DIR:-data}/platform.sqlite"; then
  if [ -z "${ADMIN_EMAIL:-}" ]; then read -r -p "Administrator email: " ADMIN_EMAIL; fi
  if [ -z "${ADMIN_PASSWORD:-}" ]; then
    read -r -s -p "Administrator password (at least 12 characters): " ADMIN_PASSWORD
    echo
  fi
  export ADMIN_EMAIL ADMIN_PASSWORD
fi
echo "Open $PUBLIC_ORIGIN in your browser. Stop with Control-C."
exec node server.mjs
