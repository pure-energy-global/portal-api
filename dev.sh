#!/usr/bin/env bash

# Does these things:
# 1. Ensures the 'portal-api' Supabase Docker Compose stack exists and is running
# 2. Pulls secrets from Doppler into supabase/.env
# 3. Serves Supabase Edge Functions with the pulled .env file and inspector enabled
# 4. Cleans up the .env file on exit, interrupt, or termination

set -Eeuo pipefail

ENV_FILE="supabase/.env"
COMPOSE_PROJECT="portal-api"

cleanup() {
  rm -f "$ENV_FILE" 2>/dev/null || true
}

trap cleanup EXIT INT TERM HUP

# Ensure supabase/ exists
if [[ ! -d "supabase" ]]; then
  echo "ERROR: supabase/ directory not found. Run this from your project root."
  exit 1
fi

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "ERROR: Missing required command: $1"
    exit 1
  }
}

need_cmd docker
need_cmd supabase
need_cmd doppler

compose_exists() {
  docker ps -a --filter "label=com.docker.compose.project=${COMPOSE_PROJECT}" -q \
    | grep -q .
}

compose_running() {
  docker ps --filter "label=com.docker.compose.project=${COMPOSE_PROJECT}" -q \
    | grep -q .
}

ensure_stack_running_or_start() {
  if compose_exists && compose_running; then
    return 0
  fi

  echo "Compose stack '${COMPOSE_PROJECT}' is not running. Starting Supabase..."
  supabase start

  # Re-check after start
  if compose_exists && compose_running; then
    return 0
  fi

  echo "ERROR: Tried 'supabase start' but compose stack '${COMPOSE_PROJECT}' still isn't running."
  echo "Check Docker + Supabase logs."
  exit 1
}

ensure_stack_running_or_start

# Pull secrets from Doppler into supabase/.env
doppler secrets download --no-file --format env > "$ENV_FILE"

# Run functions serve
supabase functions serve --inspect-mode run --env-file "$ENV_FILE"
