#!/usr/bin/env bash
set -euo pipefail
COMPOSE_FILE="nrsgirls-platform/deployment/docker-compose.yml"
echo "Stopping containers and cleaning up..."
if command -v docker-compose >/dev/null 2>&1; then
  docker-compose -f "$COMPOSE_FILE" down --volumes --remove-orphans
elif docker compose version >/dev/null 2>&1; then
  docker compose -f "$COMPOSE_FILE" down --volumes --remove-orphans
else
  echo "docker-compose not available."
  exit 1
fi
echo "Docker cleanup complete."
