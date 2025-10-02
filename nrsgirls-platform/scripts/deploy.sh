#!/usr/bin/env bash
set -e

# Simple deployment helper (placeholder).
# For production use, replace with CI/CD pipeline integration.

echo "Building and deploying with docker-compose..."
docker-compose -f nrsgirls-platform/deployment/docker-compose.yml up -d --build

echo "Deployment started. Monitor logs with 'docker-compose ps' and 'docker-compose logs'."