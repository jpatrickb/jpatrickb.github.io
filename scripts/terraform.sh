#!/usr/bin/env bash
# Plan or apply the Cloudflare infrastructure for one environment: dev or prod.
# CI calls this (deploy.yml applies, terraform-plan.yml plans). Credentials and ids come from the
# environment, never from files, because this repo is public:
#   CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_ZONE_ID
#   TF_STATE_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY   (the R2 state bucket's S3 keys)
set -euo pipefail

cmd="${1:?usage: scripts/terraform.sh <plan|apply> <dev|prod>}"
env="${2:?usage: scripts/terraform.sh <plan|apply> <dev|prod>}"
case "$cmd" in plan | apply) ;; *) echo "Unknown command: $cmd (use plan or apply)" >&2; exit 2 ;; esac
case "$env" in dev | prod) ;; *) echo "Unknown environment: $env (use dev or prod)" >&2; exit 2 ;; esac

for v in CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID CLOUDFLARE_ZONE_ID TF_STATE_BUCKET AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY; do
  [ -n "${!v:-}" ] || { echo "::error::$v is not set" >&2; exit 1; }
done

flags=()
if [ -n "${GITHUB_ACTIONS:-}" ]; then
  # Workflow logs are public. Variables are not masked on their own, so mask the identifiers.
  echo "::add-mask::$CLOUDFLARE_ACCOUNT_ID"
  echo "::add-mask::$CLOUDFLARE_ZONE_ID"
  echo "::add-mask::$TF_STATE_BUCKET"
  flags+=(-no-color)
fi

cd "$(dirname "$0")/../infra"

backend="$(mktemp)"
trap 'rm -f "$backend"' EXIT
cat >"$backend" <<HCL
bucket    = "$TF_STATE_BUCKET"
key       = "jpatrickbeal-com/$env.tfstate"
endpoints = { s3 = "https://$CLOUDFLARE_ACCOUNT_ID.r2.cloudflarestorage.com" }
HCL

export TF_VAR_account_id="$CLOUDFLARE_ACCOUNT_ID" TF_VAR_zone_id="$CLOUDFLARE_ZONE_ID" TF_IN_AUTOMATION=1

terraform init -input=false -reconfigure -backend-config="$backend" "${flags[@]}"

case "$cmd" in
  # No state lock: the plan credentials are read-only, and deploys of one environment never overlap
  # (the deploy workflow serializes them).
  plan) terraform plan -input=false -lock=false -var-file="env/$env.tfvars" "${flags[@]}" ;;
  apply) terraform apply -input=false -auto-approve -var-file="env/$env.tfvars" "${flags[@]}" ;;
esac
