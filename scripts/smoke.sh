#!/usr/bin/env bash
# Check a deployed environment: dev or prod. Exits non-zero on the first failure.
# The key promise: dev is never indexable, prod always is.
set -euo pipefail

env="${1:?usage: scripts/smoke.sh <dev|prod>}"
case "$env" in
  dev) url=https://dev.jpatrickbeal.com ;;
  prod) url=https://jpatrickbeal.com ;;
  *) echo "Unknown environment: $env (use dev or prod)" >&2; exit 2 ;;
esac
url="${SMOKE_URL:-$url}"

fail() { echo "::error::smoke($env): $*"; exit 1; }

# A fresh deploy can take a few seconds to reach every edge location.
fetch() {
  local path="$1" out="$2"
  for _ in 1 2 3 4 5 6 7 8 9 10; do
    if curl -fsS -D "$out.headers" -o "$out" "$url$path" 2>/dev/null; then return 0; fi
    sleep 3
  done
  fail "$url$path never returned 200"
}

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

fetch / "$tmp/index"
fetch /robots.txt "$tmp/robots"
fetch /projects/ "$tmp/projects"

grep -qi '<title>' "$tmp/index" || fail "home page has no <title>"

if [ "$env" = dev ]; then
  grep -qi '^x-robots-tag:.*noindex' "$tmp/index.headers" || fail "dev is missing the X-Robots-Tag noindex header"
  grep -qi '<meta name="robots" content="noindex' "$tmp/index" || fail "dev is missing the noindex meta tag"
  grep -qx 'Disallow: /' "$tmp/robots" || fail "dev robots.txt does not disallow everything"
else
  ! grep -qi '^x-robots-tag:.*noindex' "$tmp/index.headers" || fail "prod sends a noindex header"
  ! grep -qi 'name="robots" content="noindex' "$tmp/index" || fail "prod has a noindex meta tag"
  grep -qx 'Allow: /' "$tmp/robots" || fail "prod robots.txt does not allow crawling"
  ! grep -qx 'Disallow: /' "$tmp/robots" || fail "prod robots.txt disallows everything"
fi

echo "smoke($env): ok ($url)"
