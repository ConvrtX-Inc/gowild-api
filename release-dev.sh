#!/usr/bin/env bash
echo '## Pre-Deploy'
export NODE_ENV=development

rm -rf node_modules
yarn --ignore-scripts --frozen-lockfile
echo '' > .env

echo '## Migrate DB'
yarn migration:run
yarn seed:run

echo '## Prepare prod'
export NODE_ENV=production
rm -rf node_modules
yarn --ignore-scripts --frozen-lockfile
