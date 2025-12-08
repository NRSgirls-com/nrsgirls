#!/usr/bin/env bash
set -euo pipefail
BACKUP_DIR="backups"
mkdir -p "$BACKUP_DIR"
TS=""$(date -u +"%Y%m%dT%H%M%SZ")""
OUT="$BACKUP_DIR/nrsgirls-db-$TS.sql.gz"
if [ -f .env ]; then
  # shellcheck disable=SC1090
  set -a; source .env; set +a
fi
if [ -z ""${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL not set. Export DATABASE_URL or add to .env"
  exit 1
fi
echo "Backing up DB to $OUT"
pg_dump "$DATABASE_URL" | gzip > "$OUT"
echo "Backup complete: $OUT"
