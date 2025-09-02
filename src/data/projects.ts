export type Project = {
  slug: string
  title: string
  description: string
  tech: string[]
  image?: string
  externalUrl?: string
}

export const projects: Project[] = [
  {
    slug: 'project-one',
    title: 'Project One',
    description: 'Short description of what this project does and why it is interesting.',
    tech: ['TypeScript', 'React', 'Vite'],
    externalUrl: 'https://github.com/jpatrick/project-one'
  },
  {
    slug: 'project-two',
    title: 'Project Two',
    description: 'Another concise blurb highlighting the problem and your solution.',
    tech: ['Node', 'Express', 'PostgreSQL'],
    externalUrl: 'https://github.com/jpatrick/project-two'
  },
  {
    slug: 'project-three',
    title: 'Project Three',
    description: 'Focus on outcomes, metrics, or interesting technical challenges.',
    tech: ['Python', 'FastAPI'],
    externalUrl: 'https://github.com/jpatrick/project-three'
  },
  {
    slug: 'project-four',
    title: 'Project Four',
    description: 'A quick summary of the project; you can link out or add detail page content later.',
    tech: ['Go', 'gRPC'],
    externalUrl: 'https://github.com/jpatrick/project-four'
  }
]

