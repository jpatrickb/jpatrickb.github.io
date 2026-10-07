export const site = {
  name: 'Patrick Beal',
  handle: 'patrick',
  title: 'Patrick Beal · Data Scientist & ML Engineer',
  description:
    'Patrick Beal is a data scientist and economist who builds production systems. He works across machine learning, Bayesian methods, and econometrics, and spent a year as a founding engineer building AI systems on AWS.',
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
  { href: '/blog/', label: 'Blog', key: 'b' },
  { href: '/about/', label: 'About', key: 'a' },
  { href: '/lab/', label: 'Lab', key: 'l' },
] as const

// Short lines under the hero. Click the line (or press s) to see the next one.
export const samples = [
  "I'm a data scientist and economist who builds production systems.",
  'I work across optimization, machine learning, Bayesian methods, and econometrics.',
  'I spent the past year as a founding engineer, taking products from a first idea to working software.',
  'I try to pair careful analysis with clear explanation, for research teams and executives alike.',
  'I studied applied math and economics at BYU, and I joined Teradata in September 2026.',
  'I also play trombone and piano, and I accompanied ballet and opera classes at BYU.',
]
