import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

export const STAGES = ['data', 'model', 'eval', 'serve', 'monitor'] as const

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    // Which half of "model + system" this project proves. Drives the lanes on the home page.
    lane: z.enum(['model', 'system']),
    // Pipeline stages this project covered, highlighted in the strip on each project.
    stages: z.array(z.enum(STAGES)),
    outcome: z.string().optional(),
    tech: z.array(z.string()),
    year: z.number().optional(),
    liveUrl: z.url().optional(),
    repoUrl: z.url().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(100),
  }),
})

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    location: z.string().optional(),
    start: z.string(),
    end: z.string(),
    // "running" shows the live pill in the runs table
    status: z.enum(['running', 'finished']).default('finished'),
    kind: z.enum(['engineering', 'research', 'music', 'other']),
    lane: z.enum(['model', 'system', 'both']).optional(),
    metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    tags: z.array(z.string()).default([]),
    order: z.number(),
    draft: z.boolean().default(false),
  }),
})

export const collections = { projects, work }
