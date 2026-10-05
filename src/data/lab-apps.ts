// Apps on the /lab desktop. Open one directly with /lab/#<id>.
export const labApps = [
  { id: 'readme', name: 'README', glyph: '¶', blurb: 'What this is and how to drive it' },
  { id: 'terminal', name: 'Terminal', glyph: '>_', blurb: 'A small shell: ls, cat, open, theme, sudo hire patrick' },
  { id: 'ask', name: 'Ask Patrick', glyph: '✦', blurb: 'Local retrieval chat, zero API calls' },
  { id: 'golf', name: 'Gradient Descent Golf', glyph: '◎', blurb: 'Tune the learning rate, sink the ball in the global minimum' },
  { id: 'confounder', name: 'Spot the Confounder', glyph: '⊸', blurb: 'Click the node that breaks the estimate' },
  { id: 'experiments', name: 'Experiments', glyph: '≋', blurb: 'Career as tracked runs' },
  { id: 'photos', name: 'Photos', glyph: '▣', blurb: 'Highlights (coming soon)' },
] as const

export type LabAppId = (typeof labApps)[number]['id']
