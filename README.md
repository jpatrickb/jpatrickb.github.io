# jpatrickb.github.io

Personal site for Patrick Beal. Astro + React islands + Tailwind v4 + shadcn-style components.
Quiet main site up front, a playful desktop ("patrick-os") at `/lab`.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # astro check + static build into dist/
npm run preview
```

## Editing content

| What | Where |
|---|---|
| Blog posts | `src/content/blog/*.md` (copy `example-draft.md`; `draft: true` keeps a post off the published site) |
| About page | `src/pages/about.astro` |
| Uses page | `src/pages/uses.astro` |
| Projects | `src/content/projects/*.md` (one file each; front matter schema in `src/content.config.ts`) |
| Work history | `src/content/work/*.md` (`teradata.md` is a placeholder to fill in) |
| Name, links, hero lines | `src/data/site.ts` |
| Ask Patrick answers | `src/data/ask.ts` |
| Themes | `src/data/themes.ts` + matching `[data-theme]` block in `src/styles/global.css` |
| Lab apps | `src/data/lab-apps.ts`, components in `src/components/lab/` |
| About section | `src/components/About.astro` |

Project front matter: `lane` (`model` or `system`) decides which column a project shows up in, and
`stages` (`data`, `model`, `eval`, `serve`, `monitor`) lights up the pipeline strip.

## Keyboard

`⌘K` or `/` search · `t`/`T` theme · `j`/`k` move · `o` open · `g` then `h`/`w`/`p`/`l` go to a page ·
`c` copy email · `?` help. In the lab, `Esc` leaves a text box and then closes the front window.

## Everything runs in the browser

- Search: MiniSearch over `/search.json`, generated at build time.
- Ask Patrick: TF-IDF retrieval (`src/lib/retrieval.ts`) over hand-written answers, with the real scores shown.
- Gradient Descent Golf: `src/lib/golf.ts` (surfaces, SGD/momentum/Adam, scoring). Pars were tuned by grid search over learning rate and β.

## Deploying

Branches, environments and release steps are in [`docs/DELIVERY.md`](docs/DELIVERY.md). In short:
`develop` deploys to https://dev.jpatrickbeal.com (never indexed), and a release branch merged into `main`
deploys to https://jpatrickbeal.com. Cloudflare resources (domains, DNS, redirects) are Terraform in
[`infra/`](infra/README.md).

`scripts/deploy.sh <dev|prod>` builds and deploys one environment, and `scripts/smoke.sh <dev|prod>` checks it.
CI normally runs both; run them yourself only with `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` exported.
