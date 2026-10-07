# jpatrickb.github.io

Personal site for Patrick Beal, live at https://jpatrickbeal.com. A quiet portfolio up front, and a playful desktop
("patrick-os") at `/lab`. Astro 7, React islands, Tailwind v4, shadcn-style components, content collections.

Agents and contributors: read [`AGENTS.md`](AGENTS.md) first (`CLAUDE.md` is a symlink to it).

## Run it

You need **Node 24** and **pnpm** (the exact version is pinned by `packageManager` in `package.json`; `corepack enable`
installs it). The repo is pnpm only, and CI fails if it finds `package-lock.json` or `yarn.lock`.

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # astro check (types) + static build into dist/
pnpm preview      # serve dist/
pnpm test         # Vitest
```

A local build is **not indexable**: only `SITE_ENV=prod` (set by the prod deploy) removes the `noindex` headers.
There is no `deploy` script on purpose. Deploys go through CI, or `scripts/deploy.sh <dev|prod>`, which sets
`SITE_ENV` and `SITE_URL` correctly. See "Deploying".

## Editing content

| What | Where |
|---|---|
| Name, links, nav, hero lines | `src/data/site.ts` |
| Projects (one file each) | `src/content/projects/*.md`, schema in `src/content.config.ts` |
| Work history (`draft: true` hides an entry) | `src/content/work/*.md` |
| Blog posts (`draft: true` keeps one off the published site) | `src/content/blog/*.md` (copy `example-draft.md`) |
| Home page About section | `src/components/About.astro` |
| About page, Uses page | `src/pages/about.astro`, `src/pages/uses.astro` |
| Ask Patrick answers | `src/data/ask.ts` |
| Themes | `src/data/themes.ts` plus a matching `[data-theme]` block in `src/styles/global.css` |
| Lab apps | `src/data/lab-apps.ts`, components in `src/components/lab/` |

**Project front matter.** The schema in `src/content.config.ts` is the source of truth. The fields you will
touch most: `lane` (`model`, `system` or `tool`, which decides the home page column; tools skip the pipeline strip),
`stages` (any of `data`, `model`, `eval`, `serve`, `monitor`, which lights up the strip), `outcome`, `tech`,
`liveUrl`, `repoUrl`, `featured`, `order`, and for tools `install` and `demo`.

**Themes.** Every theme needs a block in `global.css` with the same set of tokens. A test checks that each theme's
text meets WCAG AA contrast, so a new palette that is too faint fails CI.

## Keyboard

`⌘K` or `/` search · `t` / `T` next or previous theme · `j` / `k` move · `o` open · `c` copy email ·
`s` next hero line (home page) · `?` help.
`g` then a letter goes to a page: `h` home, `w` work, `p` projects, `b` blog, `a` about, `l` lab.
In the lab, `Esc` leaves a text box and then closes the front window.
Shortcuts are off while you type or while a dialog is open.

## Everything runs in the browser

- Search: MiniSearch over `/search.json`, generated at build time.
- Ask Patrick: TF-IDF retrieval (`src/lib/retrieval.ts`) over hand-written answers, with the real scores shown.
- Gradient Descent Golf: `src/lib/golf.ts` (surfaces, SGD, momentum and Adam, scoring). Pars were tuned by grid search
  over learning rate and β.

No analytics, no trackers, and no third-party requests: the fonts are self-hosted.

## Tests

`pnpm test` runs Vitest over `src/**/*.test.ts`. They cover the pure logic: the Ask Patrick retriever, the golf
simulator, and the contrast of every theme. A test is only worth keeping if it can fail, so after writing one, break
the code on purpose and watch it go red.

## Deploying

Branches, environments and release steps are in [`docs/DELIVERY.md`](docs/DELIVERY.md). In short:

| Environment | URL | Deploys when | Indexable |
|---|---|---|---|
| dev | https://dev.jpatrickbeal.com | a PR merges into `develop` | no |
| prod | https://jpatrickbeal.com | a `release/x.y` PR merges into `main` | yes |

Each deploy publishes the Worker with wrangler, applies the Cloudflare Terraform for that environment, and runs
`scripts/smoke.sh`, which checks that dev is not indexable and prod is. The Cloudflare resources (domains, DNS,
redirects) and the credentials CI needs are described in [`infra/README.md`](infra/README.md).

## Demo recordings

The terminal demos on the tool project pages are recorded, not screenshots. `demos/record.sh` renders each
`demos/*.tape` with [vhs](https://github.com/charmbracelet/vhs) and `ffmpeg` into `public/demos/*.mp4`, and a
project's `demo` front matter field points at the file. Run `demos/record.sh timetracker` to redo one.
The hours, amounts and scores in the recordings are example data.

## Stale files

`.CLAUDE/style-guide.md` describes the site before the Astro rebuild (blue palette, Google Fonts). The source of truth
for styling is `src/styles/global.css` and `src/data/themes.ts`.
