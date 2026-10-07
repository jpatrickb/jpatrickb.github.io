# Infrastructure

Terraform for the Cloudflare side of jpatrickbeal.com. It runs in CI, not by hand:

| Environment | Applies when | Manages | State file |
|---|---|---|---|
| `dev` | `develop` deploys (`deploy.yml`) | `dev.jpatrickbeal.com` pointed at the `patrick-beal-dev` Worker | `jpatrickbeal-com/dev.tfstate` |
| `prod` | `main` deploys (`deploy.yml`) | `jpatrickbeal.com` pointed at the `patrick-beal` Worker, the proxied `www` record, and the `www` to apex redirect | `jpatrickbeal-com/prod.tfstate` |

Each deploy publishes the Worker with wrangler first, then applies this, then smoke-tests. A pull request that
touches `infra/` gets the plan for both environments as a comment (`terraform-plan.yml`). Applying only happens
after the merge.

This repo is public, so **nothing secret is committed**: no tokens, no state, no real account or zone ids in
files. State lives in a private R2 bucket. Workflow logs and PR comments are public too, so the account id, zone
id and bucket name are masked in logs and redacted from plan comments.

## One-time setup (Cloudflare dashboard, then GitHub settings)

1. **State bucket.** Create a private R2 bucket (for example `patrick-tfstate`). Set its name as the repo
   **variable** `TF_STATE_BUCKET`, and the zone's id as the repo **variable** `CLOUDFLARE_ZONE_ID`.
   (`CLOUDFLARE_ACCOUNT_ID` is already set.)
2. **Apply credentials.** These can change things, so they are **environment secrets** in both `dev` and `prod`,
   which only the `develop` and `main` branches can read:
   - `CLOUDFLARE_TF_TOKEN`: an API token scoped to this account and zone with Workers Scripts: Edit,
     Zone DNS: Edit, and the zone permission for redirect rules (Single Redirect / Zone Rulesets: Edit).
     If the first apply fails with a 403, this permission is the likely gap.
   - `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`: an R2 API token with Object Read & Write on the state bucket.
3. **Plan credentials.** These are **repo secrets**, so any workflow on a branch of this repo can read them.
   Make them **read-only**:
   - `CLOUDFLARE_PLAN_TOKEN`: the same scopes as above, but Read.
   - `R2_PLAN_ACCESS_KEY_ID` and `R2_PLAN_SECRET_ACCESS_KEY`: an R2 token with Object Read only.
4. The existing `CLOUDFLARE_API_TOKEN` (Workers Scripts: Edit) stays an environment secret. Wrangler uses it. Terraform
   never does, so a Terraform problem can't leak the deploy token and the reverse.

Then merge to `develop`. The deploy applies the dev domain, and the smoke test turns green once it resolves.

## Notes

- **First prod apply.** It happens on the first deploy from `main`, after wrangler creates the `patrick-beal` Worker,
  so `jpatrickbeal.com` only starts serving after your first release.
- **No state lock.** Deploys of one environment are serialized by the workflow's concurrency group, and the plan
  token is read-only, so plans run with `-lock=false`.
- **Running it yourself.** For debugging only: export the same variables and run `scripts/terraform.sh plan dev`
  or `apply dev`. Prefer CI, so state changes have a record.
- **Adding a resource.** Put it in `main.tf`, gate prod-only resources with `count = local.prod ? 1 : 0`, and read
  the plan comment on your PR before merging.
