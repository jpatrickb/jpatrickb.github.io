// @ts-check
import { writeFile } from 'node:fs/promises'
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

// SITE_ENV=prod is set only by the prod deploy (scripts/deploy.sh). Anything else is not indexable.
const prod = process.env.SITE_ENV === 'prod'

// Non-prod builds also send X-Robots-Tag on every response (Workers static assets read _headers).
/** @type {import('astro').AstroIntegration} */
const noindexHeaders = {
  name: 'noindex-headers',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      if (!prod) await writeFile(new URL('_headers', dir), '/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n')
    },
  },
}

export default defineConfig({
  site: process.env.SITE_URL ?? (prod ? 'https://jpatrickbeal.com' : 'https://dev.jpatrickbeal.com'),
  integrations: [react(), noindexHeaders],
  vite: { plugins: [tailwindcss()] },
})
