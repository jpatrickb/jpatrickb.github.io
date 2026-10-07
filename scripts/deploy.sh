#!/usr/bin/env bash
# Build and deploy the site to one environment: dev or prod.
# CI calls this with CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID in the environment.
set -euo pipefail

env="${1:?usage: scripts/deploy.sh <dev|prod>}"

case "$env" in
  dev)
    export SITE_ENV=dev SITE_URL=https://dev.jpatrickbeal.com
    wrangler_args=(--env dev)
    ;;
  prod)
    export SITE_ENV=prod SITE_URL=https://jpatrickbeal.com
    wrangler_args=()
    ;;
  *) echo "Unknown environment: $env (use dev or prod)" >&2; exit 2 ;;
esac

cd "$(dirname "$0")/.."
pnpm run build
pnpm exec wrangler deploy "${wrangler_args[@]}"
