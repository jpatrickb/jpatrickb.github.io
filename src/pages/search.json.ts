import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { labApps, labGames } from '@/data/lab-apps'

import type { SearchDoc } from '@/lib/search'
import { getPosts } from '@/lib/blog'

// Built once at compile time; the palette fetches it the first time it opens.
export const GET: APIRoute = async () => {
  const projects = await getCollection('projects')
  const work = await getCollection('work', (w) => !w.data.draft)
  const posts = (await getPosts()).filter((p) => !p.data.draft)
  const docs: SearchDoc[] = [
    { id: 'page:about', title: 'About', body: 'about me music trombone piano mission faith ASL hobbies pickleball hiking climbing mountain biking cooking family', url: '/about/', kind: 'page' },
    { id: 'page:uses', title: 'Uses', body: 'uses setup neovim nvim starship terminal wezterm tmux zsh dotfiles config tools', url: '/uses/', kind: 'page' },
    ...posts.map((p) => ({ id: `post:${p.id}`, title: p.data.title, body: [p.data.description, p.data.tags.join(' '), p.body].filter(Boolean).join(' '), url: `/blog/${p.id}/`, kind: 'post' as const })),
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
    ...labGames.map((g) => ({ id: `game:${g.id}`, title: g.name, body: `${g.blurb} ${g.teaches}`, url: `/lab/#games/${g.id}`, kind: 'lab' as const })),
  ]
  return new Response(JSON.stringify(docs), { headers: { 'Content-Type': 'application/json' } })
}
