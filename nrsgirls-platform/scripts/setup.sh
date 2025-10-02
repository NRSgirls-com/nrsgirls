#!/usr/bin/env bash
set -e

# Setup script (development)
# Installs dependencies for frontend and backend containers and initializes environment examples.

echo "Installing frontend dependencies..."
if [ -d "frontend" ]; then
  cd frontend || exit
  if [ -f package.json ]; then
    npm install || true
  fi
  cd - || true
fi

echo "Installing backend dependencies..."
if [ -d "backend" ]; then
  cd backend || exit
  if [ -f package.json ]; then
    npm install || true
  fi
  cd - || true
fi

echo "Copying .env.example to .env (if not exists)..."
if [ -f .env.example ] && [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

echo "Setup complete."
