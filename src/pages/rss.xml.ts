import type { APIRoute } from 'astro'
import { getPosts } from '@/lib/blog'
import { site } from '@/data/site'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const GET: APIRoute = async (ctx) => {
  const base = ctx.site ?? new URL('https://jpatrickb.github.io')
  const posts = (await getPosts()).filter((p) => !p.data.draft)
  const items = posts.map((p) => {
    const url = new URL(`/blog/${p.id}/`, base).toString()
    return `<item><title>${esc(p.data.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${p.data.date.toUTCString()}</pubDate><description>${esc(p.data.description ?? '')}</description></item>`
  })
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(site.name)}</title><link>${new URL('/blog/', base)}</link><description>Posts by ${esc(site.name)}</description>${items.join('')}</channel></rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
