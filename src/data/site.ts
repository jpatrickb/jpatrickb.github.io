export const site = {
  name: 'Patrick Beal',
  handle: 'patrick',
  title: 'Patrick Beal · Data Scientist & ML Engineer',
  description:
    'Patrick Beal builds machine learning models and the production systems around them: Bayesian and causal modeling, plus AWS infrastructure, agentic pipelines, and cost-aware LLM systems.',
  role: 'Data scientist & ML engineer',
  email: 'jpatrickbeal@gmail.com',
  github: 'https://github.com/jpatrickb',
  linkedin: 'https://linkedin.com/in/jpatrickbeal',
  resume: '/resume.pdf',
}

export const nav = [
  { href: '/', label: 'Home', key: 'h' },
  { href: '/work/', label: 'Work', key: 'w' },
  { href: '/projects/', label: 'Projects', key: 'p' },
  { href: '/lab/', label: 'Lab', key: 'l' },
] as const

// Short lines the hero "samples" from. Click the line (or press s) to resample.
export const samples = [
  'I build the model, then the system that keeps it honest in production.',
  'Bayesian at heart, Terraform by necessity.',
  'From a regression in a notebook to a pipeline with a cost dashboard.',
  'Applied math and economics, shipped on AWS.',
  'Most of my favorite bugs turn out to be confounders.',
]
