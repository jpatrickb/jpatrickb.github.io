import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')) as {
  scripts: Record<string, string>
}

describe('package.json scripts', () => {
  // A script that runs wrangler directly builds without SITE_ENV=prod, so it would publish a noindex
  // build to the prod Worker. Deploys go through scripts/deploy.sh, which sets SITE_ENV and SITE_URL.
  it('never deploys with wrangler directly', () => {
    for (const [name, command] of Object.entries(pkg.scripts)) {
      expect(command, `script "${name}"`).not.toMatch(/wrangler\s+(deploy|publish|versions)/)
    }
  })

  it('has no script named deploy (pnpm deploy is also a different built-in command)', () => {
    expect(pkg.scripts).not.toHaveProperty('deploy')
  })
})
