import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { labApps } from '@/data/lab-apps'

import type { SearchDoc } from '@/lib/search'

// Built once at compile time; the palette fetches it the first time it opens.
export const GET: APIRoute = async () => {
  const projects = await getCollection('projects')
  const work = await getCollection('work', (w) => !w.data.draft)
  const docs: SearchDoc[] = [
    ...projects.map((p) => ({
      id: `project:${p.id}`,
      title: p.data.title,
      body: [p.data.summary, p.data.outcome, p.data.tech.join(' '), p.body].filter(Boolean).join(' '),
      url: `/projects/${p.id}/`,
      kind: 'project' as const,
    })),
    ...work.map((w) => ({
      id: `work:${w.id}`,
      title: `${w.data.role} · ${w.data.company}`,
      body: [w.data.tags.join(' '), w.body].join(' '),
      url: `/work/#${w.id}`,
      kind: 'work' as const,
    })),
    ...labApps.map((a) => ({ id: `lab:${a.id}`, title: a.name, body: a.blurb, url: `/lab/#${a.id}`, kind: 'lab' as const })),
  ]
  return new Response(JSON.stringify(docs), { headers: { 'Content-Type': 'application/json' } })
}
