# Infrastructure

Terraform for the Cloudflare side of jpatrickbeal.com: the custom domain on the Worker, the
`www` to apex redirect, and the DNS record behind it. The site code is deployed separately with
`npm run deploy` (wrangler).

This repo is public, so **nothing secret is committed**: no API tokens, no state, no real
`terraform.tfvars` or `backend.hcl` (all gitignored). State is stored in a private R2 bucket.

## One-time setup

1. **State bucket.** In the Cloudflare dashboard, create a private R2 bucket (e.g. `patrick-tfstate`)
   and an R2 API token with Object Read & Write on that bucket.
2. **Provider token.** Create an API token with `Workers Scripts: Edit`, `Zone: DNS: Edit`,
   and `Zone: Zone Rulesets: Edit` (Account Rulesets are not needed), scoped to this account and zone.
3. Export credentials in your shell (never write them to a file in the repo):
   ```bash
   export CLOUDFLARE_API_TOKEN=...        # provider token
   export AWS_ACCESS_KEY_ID=...           # R2 token (S3-compatible)
   export AWS_SECRET_ACCESS_KEY=...
   ```
4. `cp backend.hcl.example backend.hcl` and `cp terraform.tfvars.example terraform.tfvars`, and fill them in.

## Usage

```bash
cd infra
terraform init -backend-config=backend.hcl
terraform plan
terraform apply
```

Deploy the Worker first (`npm run deploy` from the repo root); the custom domain needs it to exist.

## Why there is no CI for this

A `plan` in GitHub Actions would need Cloudflare credentials in a public repo, and pull requests from
forks must never get access to them. Run Terraform locally until there is a reason to change that.
