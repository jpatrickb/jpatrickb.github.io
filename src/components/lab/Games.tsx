import { useEffect, useState, type ComponentType } from 'react'
import { labGames, type LabGameId } from '@/data/lab-apps'
import { cn } from '@/lib/utils'
import GradientGolf from './GradientGolf'
import Confounder from './Confounder'
import { GolfGuide, ConfounderGuide } from './guides'
import { LabIcon } from './icons'
import { SidebarHeading, SidebarItem, SidebarLayout } from './mac'

// Every game has a Learn tab (a short, plain explanation) and a Play tab.
// To add a game: add it to labGames in src/data/lab-apps.ts, then register its two components here.
type GameParts = {
  Learn: ComponentType<{ onPlay: () => void }>
  Play: ComponentType<{ onLearn: () => void }>
}
const PARTS: Record<LabGameId, GameParts> = {
  golf: { Learn: GolfGuide, Play: GradientGolf },
  confounder: { Learn: ConfounderGuide, Play: Confounder },
}

type Tab = 'learn' | 'play'
const seenKey = (id: LabGameId) => `lab-game-seen-${id}`
const hasSeen = (id: LabGameId) => { try { return localStorage.getItem(seenKey(id)) === '1' } catch { return false } }
const markSeen = (id: LabGameId) => { try { localStorage.setItem(seenKey(id), '1') } catch { /* private mode */ } }

export default function Games({ game, onGame }: { game: LabGameId | null; onGame: (g: LabGameId | null) => void }) {
  const [tab, setTab] = useState<Tab>('learn')

  // first visit to a game starts on the explanation; after that, go straight to playing
  useEffect(() => { if (game) setTab(hasSeen(game) ? 'play' : 'learn') }, [game])

  const sidebar = (
    <>
      <SidebarItem icon="▦" active={!game} onClick={() => onGame(null)}>Library</SidebarItem>
      <SidebarHeading>Games</SidebarHeading>
      {labGames.map((g) => <SidebarItem key={g.id} icon={<LabIcon id={g.id} className="size-4" />} active={game === g.id} onClick={() => onGame(g.id)}>{g.name}</SidebarItem>)}
    </>
  )

  if (!game) {
    return (
      <SidebarLayout sidebar={sidebar}>
      <div className="h-full overflow-auto p-5">
        <h2 className="text-lg font-semibold">Games</h2>
        <p className="mt-1 max-w-[60ch] text-sm text-muted-foreground">
          Each of these is a short game about an idea from machine learning or statistics. You don't need any background
          to play, since every game starts with a quick explanation of the idea behind it.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {labGames.map((g) => (
            <li key={g.id}>
              <button type="button" onClick={() => onGame(g.id)} className="flex h-full w-full flex-col rounded-xl border border-border bg-card/50 p-4 text-left transition-colors hover:border-primary">
                <LabIcon id={g.id} className="size-12" />
                <span className="mt-3 font-medium">{g.name}</span>
                <span className="mt-1 text-sm leading-relaxed text-muted-foreground">{g.blurb}</span>
                <span className="mt-3 text-xs text-muted-foreground"><span className="font-medium text-foreground">You'll learn about</span> {g.teaches.charAt(0).toLowerCase() + g.teaches.slice(1)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      </SidebarLayout>
    )
  }

  const meta = labGames.find((g) => g.id === game)!
  const { Learn, Play } = PARTS[game]
  const play = () => { markSeen(game); setTab('play') }

  return (
    <SidebarLayout sidebar={sidebar}>
    <div className="flex h-full flex-col text-sm">
      <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-3 py-2">
        <button type="button" onClick={() => onGame(null)} className="rounded-md px-2 py-1 text-sm text-primary hover:bg-muted md:hidden">‹ All games</button>
        <span className="min-w-0 flex-1 truncate text-sm font-medium">{meta.name}</span>
        <div className="flex rounded-lg bg-muted p-0.5 text-sm" role="tablist" aria-label={`${meta.name} sections`}>
          {(['learn', 'play'] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => (t === 'play' ? play() : setTab('learn'))}
              className={cn('rounded-md px-3 py-1', tab === t ? 'bg-background font-medium shadow-sm' : 'text-muted-foreground hover:text-foreground')}
            >
              {t === 'learn' ? 'Learn' : 'Play'}
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        {tab === 'learn' ? <Learn onPlay={play} /> : <Play onLearn={() => setTab('learn')} />}
      </div>
    </div>
    </SidebarLayout>
  )
}
