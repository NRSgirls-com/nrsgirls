#!/usr/bin/env bash
set -euo pipefail
MODE=""${1:-dev}"" # dev or prod
COMPOSE_FILE="deployment/docker-compose.yml"
echo "== deploy.sh (mode=$MODE) =="
if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required. Install Docker and retry."
  exit 1
fi
DOCKER_COMPOSE_CMD=""
if command -v docker-compose >/dev/null 2>&1; then
  DOCKER_COMPOSE_CMD="docker-compose"
elif docker compose version >/dev/null 2>&1; then
  DOCKER_COMPOSE_CMD="docker compose"
else
  echo "No docker-compose or docker compose available."
  exit 1
fi
if [ ! -f "$COMPOSE_FILE" ]; then
  echo "Compose file not found: $COMPOSE_FILE"
  exit 1
fi
# Load .env if present
if [ -f .env ]; then
  echo "Loading .env"
  # shellcheck disable=SC1090
  set -a; source .env; set +a
fi
if [ "$MODE" = "prod" ]; then
  $DOCKER_COMPOSE_CMD -f "$COMPOSE_FILE" up -d --build
else
  $DOCKER_COMPOSE_CMD -f "$COMPOSE_FILE" up --build
fi
echo "Deployment executed. Use "$DOCKER_COMPOSE_CMD -f $COMPOSE_FILE ps" and logs to inspect."
