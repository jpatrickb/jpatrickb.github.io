import { execSync } from 'node:child_process'

function sha() {
  const env = process.env.WORKERS_CI_COMMIT_SHA ?? process.env.GITHUB_SHA ?? process.env.CF_PAGES_COMMIT_SHA
  if (env) return env.slice(0, 7)
  try { return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() } catch { return 'local' }
}

export const build = {
  sha: sha(),
  date: new Date().toISOString().slice(0, 10),
}
