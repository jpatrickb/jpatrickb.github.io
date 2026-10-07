// Only the prod deploy sets SITE_ENV=prod. Every other build (dev deploys, local builds,
// previews) is told not to be indexed, so a forgotten variable fails safe.
export const indexable = process.env.SITE_ENV === 'prod'
