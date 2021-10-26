#!/usr/bin/env bash
set -e

cleanup() {
  docker-compose -f docker-compose.dev.yml down
}

cleanup

cp ./env.dev ./.env

COMPOSE_HTTP_TIMEOUT=120 docker-compose -f docker-compose.dev.yml up -d

npm run serve
