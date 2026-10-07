import { getCollection, type CollectionEntry } from 'astro:content'

export type Post = CollectionEntry<'blog'>

// Drafts show up while you are running the dev server, and are left out of the published site.
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', (p) => import.meta.env.DEV || !p.data.draft)
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export const formatDate = (d: Date) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
export const tagSlug = (t: string) => t.toLowerCase().trim().replace(/\s+/g, '-')
