#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
if ! command -v node >/dev/null 2>&1; then
  echo "Install Node.js 24 LTS, then run this script again." >&2
  exit 1
fi
node -e 'if (Number(process.versions.node.split(".")[0]) !== 24) { console.error("This app is tested on Node.js 24. Use Node.js 24 LTS."); process.exit(1); }'
export PUBLIC_ORIGIN="${PUBLIC_ORIGIN:-http://localhost:3000}"
export HOST="${HOST:-127.0.0.1}"
if [ ! -f "${DATA_DIR:-data}/platform.sqlite" ]; then
  read -r -p "Administrator email: " ADMIN_EMAIL
  read -r -s -p "Administrator password (at least 12 characters): " ADMIN_PASSWORD
  echo
  export ADMIN_EMAIL ADMIN_PASSWORD
fi
echo "Open $PUBLIC_ORIGIN in your browser. Stop with Control-C."
exec node server.mjs
