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

## Credentials: the whole list

This is the single source of truth. You create **five** things in Cloudflare (two API tokens, two R2 tokens and
one bucket), look up one id, and set **ten names** in GitHub (the wrangler token and the account id already exist).
The "Cloudflare name" is what you type in the Cloudflare dashboard (it only labels the token, and any name works if you keep the
table in sync). The "GitHub name" must be **exact**, because the workflows read these names.

| # | Create in Cloudflare | Cloudflare name | Goes into GitHub as | Where in GitHub |
|---|---|---|---|---|
| 1 | API token, to deploy with wrangler (**already exists and works**) | `jpatrickbeal-wrangler-deploy` | `CLOUDFLARE_API_TOKEN` | Environment secret, in **`dev` and `prod`** |
| 2 | API token, for Terraform apply | `jpatrickbeal-terraform-apply` | `CLOUDFLARE_TF_TOKEN` | Environment secret, in **`dev` and `prod`** |
| 3 | R2 token with read and write, for the state bucket | `jpatrickbeal-tfstate-readwrite` | its Access Key ID: `R2_ACCESS_KEY_ID`<br>its Secret Access Key: `R2_SECRET_ACCESS_KEY` | Environment secrets, in **`dev` and `prod`** |
| 4 | API token, read-only, for plans on PRs | `jpatrickbeal-terraform-plan-readonly` | `CLOUDFLARE_PLAN_TOKEN` | **Repository** secret |
| 5 | R2 token, read only, for plans on PRs | `jpatrickbeal-tfstate-readonly` | its Access Key ID: `R2_PLAN_ACCESS_KEY_ID`<br>its Secret Access Key: `R2_PLAN_SECRET_ACCESS_KEY` | **Repository** secrets |
| 6 | R2 bucket (private) | `jpatrickbeal-tfstate` (any name works; yours is whatever you created) | `TF_STATE_BUCKET` | **Repository** secret |
| 7 | (nothing to create) your zone's id | n/a | `CLOUDFLARE_ZONE_ID` | **Repository** secret |
| 8 | (nothing to create) your account id | n/a | `CLOUDFLARE_ACCOUNT_ID` (**already set, as a variable: move it**) | **Repository** secret |

Why two places for secrets:

- **Environment secrets** can change things (deploy, apply). GitHub only gives them to a job running on the
  environment's branch: `develop` for `dev`, `main` for `prod`. A workflow on any other branch can't read them.
- **Repository secrets** go to every workflow in the repo, including a PR from a branch you push. So the two
  repository secret groups (#4 and #5) must be **read-only**, so reading them can't change anything.
- **No GitHub variables are used.** The account id, zone id and bucket name are identifiers, not credentials, but
  they are stored as **secrets** anyway. This repo's workflow logs are public, GitHub masks secrets everywhere in
  them (including a step's `env:` header), and it never masks variables. With a variable, the value would print
  in the log. The workflows also redact them from the plan comments on PRs.

Wrangler (#1) and Terraform (#2) use **different** tokens on purpose, so a problem with one can't leak the other.

## Part A: create things in Cloudflare

### A1. Find your zone id (for #7)

Dashboard, click `jpatrickbeal.com`, **Overview**. On the right sidebar under **API**, copy **Zone ID**. Your
account id is on the same sidebar, and is already in GitHub.

### A2. Create the state bucket (#6)

1. Dashboard, **Storage & databases**, **R2 object storage**, **Overview**, **Create bucket**.
   (If R2 isn't enabled yet, Cloudflare asks you to add a payment method first. The free tier covers this.)
2. **Bucket name:** `jpatrickbeal-tfstate`. Leave the location on Automatic and the default storage class.
    - I already created it and named it `jpatrickb-github-io-tfstate`
3. Keep it **private**. Do not turn on the public `r2.dev` URL or add a custom domain.

### A3. Create the two R2 tokens (#3 and #5)

1. In R2 **Overview**, find **API Tokens** (labelled **Manage** next to "API Tokens" in the Account Details panel),
   then **Create Account API token** (an account token isn't tied to your user; a user token also works).
2. For #3: **Token name** `jpatrickbeal-tfstate-readwrite`. **Permissions:** `Object Read & Write`.
   **Specify bucket(s):** apply to specific bucket, `jpatrickbeal-tfstate`. TTL: Forever. No IP filtering.
3. **Create API Token.** The next page shows an **Access Key ID** and a **Secret Access Key**. The secret is
   shown **once**. Copy both into a password manager right now. (Ignore the "Token value" and the endpoint URL.)
4. Repeat for #5: **Token name** `jpatrickbeal-tfstate-readonly`. **Permissions:** `Object Read only`.
   Same bucket.

### A4. Create the Terraform API tokens (#2 and #4)

Dashboard, **Manage Account**, **Account API Tokens** (or **My Profile**, **API Tokens**), **Create Token**,
**Create Custom Token**.

**#2, apply.** **Token name:** `jpatrickbeal-terraform-apply`.

| Permission group | Resource | Level |
|---|---|---|
| **Account**, **Workers Scripts** | n/a | **Edit** |
| **Zone**, **DNS** | n/a | **Edit** |
| **Zone**, **Single Redirect** | n/a | **Edit** |

**Account Resources:** Include, your account. **Zone Resources:** Include, **Specific zone**, `jpatrickbeal.com`.
No IP filtering. TTL: no end date. Click **Continue to summary**, **Create Token**, and copy the token
(shown once).

**#4, plan (read-only).** **Token name:** `jpatrickbeal-terraform-plan-readonly`. Same three permission groups,
but set every level to **Read**:

| Permission group | Level |
|---|---|
| **Account**, **Workers Scripts** | **Read** |
| **Zone**, **DNS** | **Read** |
| **Zone**, **Single Redirect** | **Read** |

Same account and zone resources.

Why each permission: Workers Scripts **Edit** is what Cloudflare requires to attach a custom domain to a Worker
(and it also creates the DNS record and certificate for you). DNS **Edit** manages the `www` placeholder record.
Single Redirect **Edit** manages the `www` to apex redirect. You do **not** need Account Rulesets, Workers Routes,
or any R2 permission on these tokens.

### A5. The existing wrangler token (#1)

It already works, so leave it alone. For the record, it needs **Account, Workers Scripts, Edit**. If you ever
recreate it, name it `jpatrickbeal-wrangler-deploy`.

## Part B: add them in GitHub

Repository: `jpatrickb/jpatrickb.github.io`. The repo's **Settings**, **Secrets and variables**, **Actions** page
has a **Secrets** tab (the **Variables** tab stays empty). The environment ones are under **Settings**, **Environments**, then
**`dev`** or **`prod`**, then **Environment secrets**.

You can click through, or use `gh`. For secrets, `gh` **prompts for the value**, which keeps it out of your shell
history. Never paste a secret onto the command line.

```bash
cd ~/Documents/personal/jpatrickb.github.io

# Environment secrets, one prompt per environment (paste the value each time).
for env in dev prod; do
  gh secret set CLOUDFLARE_TF_TOKEN --env "$env"        # token #2 (jpatrickbeal-terraform-apply)
  gh secret set R2_ACCESS_KEY_ID --env "$env"           # #3 Access Key ID
  gh secret set R2_SECRET_ACCESS_KEY --env "$env"       # #3 Secret Access Key
done
# CLOUDFLARE_API_TOKEN (#1) is already an environment secret in both. Nothing to do.

# Repository secrets: the read-only credentials...
gh secret set CLOUDFLARE_PLAN_TOKEN                      # token #4 (jpatrickbeal-terraform-plan-readonly)
gh secret set R2_PLAN_ACCESS_KEY_ID                      # #5 Access Key ID
gh secret set R2_PLAN_SECRET_ACCESS_KEY                  # #5 Secret Access Key

# ...and the three identifiers (account id, zone id, bucket name). Paste each when prompted.
gh secret set CLOUDFLARE_ACCOUNT_ID
gh secret set CLOUDFLARE_ZONE_ID                         # from A1
gh secret set TF_STATE_BUCKET                            # the bucket name from A2
```

**If you first set the three identifiers as repository variables**, copy them to secrets without retyping or
printing them. The pipe feeds the value straight from the variable into the secret:

```bash
for name in CLOUDFLARE_ACCOUNT_ID CLOUDFLARE_ZONE_ID TF_STATE_BUCKET; do
  gh variable get "$name" | gh secret set "$name"
done
```

Then **merge the change that switches the workflows to read secrets**, and only after that delete the variables, or
the pipeline loses its values in between:

```bash
for name in CLOUDFLARE_ACCOUNT_ID CLOUDFLARE_ZONE_ID TF_STATE_BUCKET; do gh variable delete "$name"; done
```

Check the result. You should see exactly these names, and no repository-level `CLOUDFLARE_API_TOKEN`:

```bash
gh secret list --env dev     # CLOUDFLARE_API_TOKEN, CLOUDFLARE_TF_TOKEN, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY
gh secret list --env prod    # the same four
gh secret list               # CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_PLAN_TOKEN, CLOUDFLARE_ZONE_ID,
                             # R2_PLAN_ACCESS_KEY_ID, R2_PLAN_SECRET_ACCESS_KEY, TF_STATE_BUCKET
gh variable list             # nothing
```

## Part C: what happens next

Merge a change to `develop`. The deploy publishes the `patrick-beal-dev` Worker, applies the dev domain
(`terraform.sh apply dev`) and runs the smoke test, which goes green once `dev.jpatrickbeal.com` resolves
(allow a minute for its certificate). `jpatrickbeal.com` only starts serving after your first release, when
`main` deploys.

## If something fails

| You see | Likely cause |
|---|---|
| `CLOUDFLARE_API_TOKEN is not set` (or any `... is not set`) in a plan comment or deploy log | That GitHub name is missing or misspelled, or it was added to the wrong place (an environment secret that the job's environment doesn't match). Compare against the table above. |
| `403` or `Authentication error` creating the redirect | The apply token is missing **Zone, Single Redirect, Edit**, or its zone resource isn't `jpatrickbeal.com`. |
| `403` creating the custom domain | The apply token is missing **Account, Workers Scripts, Edit**, or its account resource is wrong. |
| `403` creating the `www` DNS record | The apply token is missing **Zone, DNS, Edit**. |
| `NoSuchBucket`, `AccessDenied`, or `SignatureDoesNotMatch` at `terraform init` | `TF_STATE_BUCKET` isn't your bucket's exact name, the R2 token wasn't scoped to that bucket, or the key and secret were swapped or copied wrongly. |
| Plan works but apply fails with a state write error | `R2_ACCESS_KEY_ID` is the read-only token. The environment ones must be the **read and write** token. |
| Plan comment shows `<account-id>` or `<zone-id>` | Working as intended: the real ids are redacted because PR comments are public. |

## Notes

- **No state lock.** Deploys of one environment are serialized by the workflow's concurrency group, and the plan
  token is read-only, so plans run with `-lock=false`.
- **Running it yourself.** For debugging only: export the same variable names (use the plan or apply values,
  your choice) and run `scripts/terraform.sh plan dev` or `apply dev`. Prefer CI, so state changes have a record.
- **Adding a resource.** Put it in `main.tf`, gate prod-only resources with `count = local.prod ? 1 : 0`, and read
  the plan comment on your PR before merging.
