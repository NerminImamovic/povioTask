#!/usr/bin/env bash
set -e

cleanup() {
    docker-compose -f docker-compose.test.yml down
}

# trap cleanup SIGINT EXIT

# # Make sure docker-compose is installed
# if ! hash docker-compose 2>/test/null; then
#   echo -e '\033[0;31mPlease install docker-compose\033[0m'
#   exit 1
# fi

# if [ -z "$(docker network ls -qf name=^entropic$)" ]; then
#   echo "Creating network"
#   docker network create entropic >/test/null
# fi

cp ./env.test ./.env

COMPOSE_HTTP_TIMEOUT=120 docker-compose -f docker-compose.test.yml up -d --force-recreate

npm run test

cleanup
