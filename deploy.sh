#!/usr/bin/env bash
# Build and deploy the matcha guide to the user's explicitly configured Pages project.
# Requires PAGES_PROJECT, CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID.
set -euo pipefail
: "${PAGES_PROJECT:?Set PAGES_PROJECT to your own Cloudflare Pages project}"
cd "$(dirname "$0")/site"
npm run build
npx wrangler pages deploy dist --project-name "$PAGES_PROJECT" --branch "${DEPLOY_BRANCH:-main}" --commit-dirty=true
