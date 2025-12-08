#!/usr/bin/env bash
set -euo pipefail
REQUIRED=(DATABASE_URL JWT_SECRET S3_ENDPOINT S3_ACCESS_KEY S3_SECRET_KEY)
MISSING=()
# load .env if present
if [ -f .env ]; then
  # shellcheck disable=SC1090
  set -a; source .env; set +a
fi
for v in "${REQUIRED[@]}"; do
  if [ -z ""${!v:-}" ]; then
    MISSING+=("$v")
  fi
done
if [ ${#MISSING[@]} -gt 0 ]; then
  echo "Missing required environment variables: ${MISSING[*]}"
  exit 1
fi
echo "All required environment variables present.
"