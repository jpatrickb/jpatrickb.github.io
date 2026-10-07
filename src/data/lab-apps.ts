// Apps on the /lab desktop. Open one directly with /lab/#<id>, or a game with /lab/#games/<game id>.
// Each app's icon is drawn in src/components/lab/icons.tsx under the same id.
export const labApps = [
  { id: 'readme', name: 'About This Lab', blurb: 'What this is and how to get around' },
  { id: 'terminal', name: 'Terminal', blurb: 'A small shell with ls, cat, open, and a few surprises' },
  { id: 'ask', name: 'Ask Patrick', blurb: 'A small chat that answers questions about me' },
  { id: 'games', name: 'Games', blurb: 'Short games that each teach an idea from ML or statistics' },
  { id: 'experience', name: 'Experience', blurb: 'My work, research, and music experience' },
  { id: 'photos', name: 'Photos', blurb: 'Some highlights (coming soon)' },
  { id: 'appearance', name: 'Appearance', blurb: 'Pick a color theme' },
] as const

export type LabAppId = (typeof labApps)[number]['id']

// Games inside the Games app. To add one, add an entry here and register its Learn and Play
// components in src/components/lab/Games.tsx.
export const labGames = [
  {
    id: 'golf',
    name: 'Gradient Descent Golf',
   
    blurb: 'Choose an optimizer and a learning rate, and try to sink the ball in as few steps as you can.',
    teaches: 'How models learn, and what SGD, momentum, and Adam do differently',
  },
  {
    id: 'confounder',
    name: 'Spot the Confounder',
   
    blurb: 'Look at a small cause-and-effect diagram and click the variable that answers the question.',
    teaches: 'Confounders, mediators, and colliders, and why correlation is not causation',
  },
] as const

export type LabGameId = (typeof labGames)[number]['id']

export const isLabApp = (s: string): s is LabAppId => labApps.some((a) => a.id === s)
export const isLabGame = (s: string): s is LabGameId => labGames.some((g) => g.id === s)

// Old links and terminal habits: #golf, #confounder, #work, and #experiments still work.
export function resolveLabTarget(raw: string): { app: LabAppId; game?: LabGameId } | null {
  const [head, sub] = raw.replace(/^#/, '').replace(/\.app$/, '').toLowerCase().split('/')
  if (head === 'games') return { app: 'games', game: sub && isLabGame(sub) ? sub : undefined }
  if (isLabGame(head)) return { app: 'games', game: head }
  if (head === 'experiments' || head === 'work') return { app: 'experience' }
  if (head === 'settings' || head === 'themes' || head === 'theme') return { app: 'appearance' }
  return isLabApp(head) ? { app: head } : null
}
