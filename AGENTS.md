# Working in this repo

Personal site for Patrick Beal: a quiet portfolio up front, and a playful desktop ("patrick-os") at `/lab`.
Astro 7 with React islands, Tailwind v4, and content collections. It deploys to Cloudflare Workers
(static assets). `CLAUDE.md` is a symlink to this file, so every agent tool reads the same text.

## Commands

```bash
pnpm install
pnpm dev            # http://localhost:4321
pnpm test           # Vitest, unit tests in src/**/*.test.ts
pnpm build          # astro check (types) + static build into dist/
```

pnpm only. CI fails if `package-lock.json`, `yarn.lock` or `npm-shrinkwrap.json` exists. Node 24.

## Where things live

| What | Where |
|---|---|
| Name, links, nav, hero lines | `src/data/site.ts` |
| Projects (one file each; schema in `src/content.config.ts`) | `src/content/projects/*.md` |
| Work history (`draft: true` hides an entry) | `src/content/work/*.md` |
| Blog posts (`draft: true` keeps one off the published site) | `src/content/blog/*.md` |
| Ask Patrick answers | `src/data/ask.ts` (retrieval in `src/lib/retrieval.ts`) |
| Themes | `src/data/themes.ts` plus a matching `[data-theme]` block in `src/styles/global.css` |
| Keyboard shortcuts | `src/scripts/keys.ts` |
| Lab apps | `src/data/lab-apps.ts`, components in `src/components/lab/` |
| Gradient Descent Golf logic | `src/lib/golf.ts` (pure functions, tested) |
| Cloudflare domains, DNS, redirects | `infra/` (Terraform) |

A project's `lane` (`model`, `system` or `tool`) decides where it appears on the home page. `stages` lights up the
pipeline strip.

## Delivery

Read `docs/DELIVERY.md` before changing anything about branches, deploys or environments. The short version:

- Branch `feature/<issue>-<slug>` from `develop`, PR into `develop`. A merge deploys to
  https://dev.jpatrickbeal.com, which is never indexed.
- Cut `release/x.y` from `develop` and PR it into `main` with a **merge commit**. A merge to `main` deploys to
  https://jpatrickbeal.com and tags `vX.Y.Z`.
- Squash feature PRs into `develop`. Never push to `main` or `develop`. Never use `develop` as a PR's head branch.
- Conventional commits: `type(scope): subject`, with type one of feat, fix, docs, chore, refactor, test, ci, build,
  perf, revert.

## Rules that are easy to break

- **Only `SITE_ENV=prod` makes a build indexable.** Do not default it to prod. Dev builds send an
  `X-Robots-Tag: noindex` header, a robots meta tag and `Disallow: /`. `scripts/smoke.sh` checks all three.
- **Nothing secret goes in this repo.** It is public. No API tokens, no Terraform state, no real `terraform.tfvars` or
  `backend.hcl`. Deploy tokens are GitHub environment secrets limited to one branch each.
- **Workflows in `.github/` are vendored from the private `patea-devops` repo.** Third-party actions are pinned to
  commit SHAs. Pass untrusted values (branch names, tag inputs) through `env:`, never inside `${{ }}` in a `run:` block.
  Do not use `pull_request_target`.
- **Terraform runs locally**, not in CI, because a plan needs credentials. See `infra/README.md`.
- **No new third-party requests.** The footer says "static, no trackers". Self-host fonts and assets.
- Tests are for pure logic (`src/lib`). Check a test can fail: break the code on purpose and watch it go red.

## Stale files

`.CLAUDE/style-guide.md` describes the site before the Astro rebuild (blue palette, Google Fonts). The source of
truth for styling is `src/styles/global.css` and `src/data/themes.ts`.
