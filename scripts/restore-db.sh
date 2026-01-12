#!/usr/bin/env bash
set -euo pipefail
if [ $# -lt 1 ]; then
  echo "Usage: $0 <path-to-dump.sql.gz>"
  exit 1
fi
DUMP="$1"
if [ ! -f "$DUMP" ]; then
  echo "Dump file not found: $DUMP"
  exit 1
fi
if [ -f .env ]; then
  # shellcheck disable=SC1090
  set -a; source .env; set +a
fi
if [ -z ""${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL not set."
  exit 1
fi
read -p "Restoring will overwrite the target database. Type 'yes' to continue: " confirm
if [ ""${confirm}" != "yes" ]; then
  echo "Aborted."
  exit 1
fi
gzip -d -c "$DUMP" | psql "$DATABASE_URL"
echo "Restore complete."
