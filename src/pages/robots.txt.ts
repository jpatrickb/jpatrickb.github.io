import type { APIRoute } from 'astro'
import { indexable } from '@/lib/site-env'

export const GET: APIRoute = () =>
  new Response(indexable ? 'User-agent: *\nAllow: /\n' : 'User-agent: *\nDisallow: /\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
