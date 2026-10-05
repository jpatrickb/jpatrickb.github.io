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
| Projects | `src/content/projects/*.md` (one file each; front matter schema in `src/content.config.ts`) |
| Work history | `src/content/work/*.md` (`teradata.md` is a placeholder to fill in) |
| Name, links, hero lines | `src/data/site.ts` |
| Ask Patrick answers | `src/data/ask.ts` |
| Themes | `src/data/themes.ts` + matching `[data-theme]` block in `src/styles/global.css` |
| Lab apps | `src/data/lab-apps.ts`, components in `src/components/lab/` |
| Model card (About) | `src/components/ModelCard.astro` |

Project front matter: `lane` (`model` or `system`) decides which column a project shows up in, and
`stages` (`data`, `model`, `eval`, `serve`, `monitor`) lights up the pipeline strip.

## Keyboard

`⌘K` or `/` search · `t`/`T` theme · `j`/`k` move · `o` open · `g` then `h`/`w`/`p`/`l` go to a page ·
`c` copy email · `?` help. In the lab: `1`–`7` open apps, `Esc` closes the front window.

## Everything runs in the browser

- Search: MiniSearch over `/search.json`, generated at build time.
- Ask Patrick: TF-IDF retrieval (`src/lib/retrieval.ts`) over hand-written answers, with the real scores shown.
- Gradient Descent Golf: `src/lib/golf.ts` (surfaces, SGD/momentum/Adam, scoring). Pars were tuned by grid search over learning rate and β.

## Deploying

**Cloudflare Workers (target).** `wrangler.jsonc` serves `dist/` as static assets.
- One-off from your machine: `npx wrangler login`, then `npm run deploy`.
- Automatic: Cloudflare dashboard → Workers & Pages → Create → Import a repository → pick this repo.
  Build command `npm run build`, deploy command `npx wrangler deploy`. Every push to `main` then deploys,
  and other branches get preview URLs.
- When a custom domain is ready, add it under the Worker's Settings → Domains, and build with
  `SITE_URL=https://your-domain` so canonical and Open Graph URLs point to it.

**GitHub Pages (current).** `.github/workflows/pages.yml` still builds and deploys `main` to
jpatrickb.github.io, and builds (without deploying) on pull requests.
