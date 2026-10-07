import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { labApps, resolveLabTarget, type LabAppId, type LabGameId } from '@/data/lab-apps'
import { cn } from '@/lib/utils'
import Readme from './Readme'
import Terminal, { type TermProject } from './Terminal'
import AskPatrick from './AskPatrick'
import Games from './Games'
import WorkHistory, { type WorkEntry } from './WorkHistory'
import Photos from './Photos'
import Appearance from './Appearance'
import { LabIcon, Wallpaper } from './icons'

type Rect = { x: number; y: number; w: number; h: number }
type Win = Rect & { id: LabAppId; z: number; min?: boolean; restore?: Rect }
type Edge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

const SIZES: Record<LabAppId, [number, number]> = {
  readme: [540, 610], terminal: [700, 500], ask: [480, 600], games: [980, 720],
  experience: [900, 520], photos: [720, 460], appearance: [760, 560],
}
const MIN_W = 320
const MIN_H = 220
const DOCK_SPACE = 84

// each handle is a thin strip on an edge or a small square on a corner
const HANDLES: { edge: Edge; className: string }[] = [
  { edge: 'n', className: 'inset-x-3 -top-1 h-2 cursor-ns-resize' },
  { edge: 's', className: 'inset-x-3 -bottom-1 h-2 cursor-ns-resize' },
  { edge: 'w', className: 'inset-y-3 -left-1 w-2 cursor-ew-resize' },
  { edge: 'e', className: 'inset-y-3 -right-1 w-2 cursor-ew-resize' },
  { edge: 'nw', className: '-left-1 -top-1 size-4 cursor-nwse-resize' },
  { edge: 'se', className: '-bottom-1 -right-1 size-4 cursor-nwse-resize' },
  { edge: 'ne', className: '-right-1 -top-1 size-4 cursor-nesw-resize' },
  { edge: 'sw', className: '-bottom-1 -left-1 size-4 cursor-nesw-resize' },
]

export default function Desktop({ work, projects }: { work: WorkEntry[]; projects: TermProject[] }) {
  const [wins, setWins] = useState<Win[]>([])
  const [game, setGame] = useState<LabGameId | null>(null)
  const [mobile, setMobile] = useState(false)
  const [clock, setClock] = useState('')
  const [menu, setMenu] = useState<'lab' | 'window' | null>(null)
  const zTop = useRef(10)
  const area = useRef<HTMLDivElement>(null)

  const focused = wins.reduce<Win | null>((top, w) => (w.min || (top && w.z <= top.z) ? top : w), null)
  const bounds = () => {
    const b = area.current?.getBoundingClientRect()
    return { W: b?.width ?? 1200, H: b?.height ?? 800 }
  }

  const open = useCallback((id: LabAppId, g?: LabGameId) => {
    if (id === 'games' && g) setGame(g)
    setWins((ws) => {
      const z = ++zTop.current
      if (ws.some((w) => w.id === id)) return ws.map((w) => (w.id === id ? { ...w, z, min: false } : w))
      const { W, H } = bounds()
      const [w0, h0] = SIZES[id]
      const w = Math.min(w0, W - 24)
      const h = Math.min(h0, H - DOCK_SPACE - 12)
      const n = ws.length
      const x = Math.max(12, Math.min(W - w - 12, (W - w) / 2 + (n % 5) * 28 - 56))
      const y = Math.max(12, Math.min(H - DOCK_SPACE - h, (H - DOCK_SPACE - h) / 2.6 + (n % 5) * 24))
      return [...ws, { id, x, y, w, h, z }]
    })
    history.replaceState(null, '', `#${id === 'games' && g ? `games/${g}` : id}`)
  }, [])

  const close = useCallback((id: LabAppId) => {
    setWins((ws) => ws.filter((w) => w.id !== id))
    if (id === 'games') setGame(null)
    history.replaceState(null, '', location.pathname)
  }, [])

  const minimize = useCallback((id: LabAppId) => {
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, min: true } : w)))
  }, [])

  // the green button: fill the space between the menu bar and the dock, or go back to the old size
  const zoom = useCallback((id: LabAppId) => {
    setWins((ws) => ws.map((w) => {
      if (w.id !== id) return w
      if (w.restore) return { ...w, ...w.restore, restore: undefined }
      const { W, H } = bounds()
      return { ...w, restore: { x: w.x, y: w.y, w: w.w, h: w.h }, x: 0, y: 0, w: W, h: H - DOCK_SPACE }
    }))
  }, [])

  const pickGame = useCallback((g: LabGameId | null) => {
    setGame(g)
    history.replaceState(null, '', g ? `#games/${g}` : '#games')
  }, [])

  useEffect(() => {
    const mq = matchMedia('(max-width: 767px)')
    const upd = () => setMobile(mq.matches)
    upd()
    mq.addEventListener('change', upd)
    const tick = () => {
      const d = new Date()
      setClock(`${d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}  ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`)
    }
    tick()
    const t = window.setInterval(tick, 15000)
    const go = (raw: string) => { const target = resolveLabTarget(raw); if (target) open(target.app, target.game) }
    const onOpen = (e: Event) => go((e as CustomEvent<string>).detail)
    window.addEventListener('lab:open', onOpen)
    const fromHash = () => go(location.hash)
    fromHash()
    if (!location.hash && !mq.matches) open('readme')
    window.addEventListener('hashchange', fromHash)
    return () => {
      mq.removeEventListener('change', upd)
      window.clearInterval(t)
      window.removeEventListener('lab:open', onOpen)
      window.removeEventListener('hashchange', fromHash)
    }
  }, [open])

  // Esc first leaves a text field, and then closes the front window.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (document.querySelector('[role="dialog"][data-state="open"], dialog[open]')) return
      const t = e.target as HTMLElement
      const typing = !!t.closest('input, textarea')
      if (e.key === 'Escape') {
        if (menu) setMenu(null)
        else if (typing) t.blur()
        else if (focused) close(focused.id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close, focused, menu])

  useEffect(() => {
    if (!menu) return
    const away = () => setMenu(null)
    window.addEventListener('pointerdown', away)
    return () => window.removeEventListener('pointerdown', away)
  }, [menu])

  // shared pointer-drag plumbing for moving and resizing
  const track = (e: React.PointerEvent, onMove: (dx: number, dy: number) => void) => {
    const el = e.currentTarget as HTMLElement
    const sx = e.clientX
    const sy = e.clientY
    el.setPointerCapture(e.pointerId)
    const move = (ev: PointerEvent) => onMove(ev.clientX - sx, ev.clientY - sy)
    const up = () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
  }
  const patch = (id: LabAppId, r: Partial<Win>) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, ...r } : w)))

  const startDrag = (win: Win, e: React.PointerEvent) => {
    if (mobile || (e.target as HTMLElement).closest('button')) return
    open(win.id)
    const { W, H } = bounds()
    track(e, (dx, dy) => patch(win.id, {
      x: Math.max(-win.w + 80, Math.min(W - 80, win.x + dx)),
      y: Math.max(0, Math.min(H - 36, win.y + dy)),
      restore: undefined,
    }))
  }

  const startResize = (win: Win, edge: Edge, e: React.PointerEvent) => {
    e.stopPropagation()
    e.preventDefault()
    open(win.id)
    const { W, H } = bounds()
    track(e, (dx, dy) => {
      let { x, y, w, h } = win
      if (edge.includes('e')) w = Math.max(MIN_W, Math.min(W - win.x, win.w + dx))
      if (edge.includes('s')) h = Math.max(MIN_H, Math.min(H - win.y, win.h + dy))
      if (edge.includes('w')) {
        const nx = Math.max(0, Math.min(win.x + win.w - MIN_W, win.x + dx))
        w = win.w + (win.x - nx)
        x = nx
      }
      if (edge.includes('n')) {
        const ny = Math.max(0, Math.min(win.y + win.h - MIN_H, win.y + dy))
        h = win.h + (win.y - ny)
        y = ny
      }
      patch(win.id, { x, y, w, h, restore: undefined })
    })
  }

  const render = (id: LabAppId): ReactNode => {
    switch (id) {
      case 'readme': return <Readme onOpen={open} />
      case 'terminal': return <Terminal onOpen={open} projects={projects} />
      case 'ask': return <AskPatrick />
      case 'games': return <Games game={game} onGame={pickGame} />
      case 'experience': return <WorkHistory work={work} />
      case 'photos': return <Photos />
      case 'appearance': return <Appearance />
    }
  }

  const appOf = (id: LabAppId) => labApps.find((a) => a.id === id)!
  const visible = mobile ? (focused ? [focused] : []) : wins.filter((w) => !w.min)
  const menuItem = 'block w-full rounded px-2.5 py-1 text-left hover:bg-primary hover:text-primary-foreground disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-foreground'

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background text-foreground">
      <Wallpaper />

      {/* menu bar */}
      <div className="relative z-[1000] flex h-7 shrink-0 items-center justify-between gap-3 bg-card/60 px-2 text-[13px] backdrop-blur-xl">
        <div className="flex min-w-0 items-center">
          <div className="relative" onPointerDown={(e) => e.stopPropagation()}>
            <button type="button" aria-haspopup="menu" aria-expanded={menu === 'lab'} onClick={() => setMenu(menu === 'lab' ? null : 'lab')} className={cn('rounded px-2 py-0.5 font-semibold', menu === 'lab' && 'bg-foreground/15')}>◆</button>
            {menu === 'lab' && (
              <div role="menu" className="absolute left-0 top-full mt-1 w-52 rounded-lg border border-border bg-popover/95 p-1 shadow-2xl backdrop-blur-xl">
                <button type="button" role="menuitem" className={menuItem} onClick={() => { setMenu(null); open('readme') }}>About This Lab</button>
                <button type="button" role="menuitem" className={menuItem} onClick={() => { setMenu(null); open('appearance') }}>Appearance…</button>
                <button type="button" role="menuitem" className={menuItem} onClick={() => { setMenu(null); window.dispatchEvent(new Event('site:palette')) }}>Search…</button>
                <hr className="my-1 border-border" />
                <a role="menuitem" href="/" className={menuItem}>Back to the main site</a>
              </div>
            )}
          </div>
          <span className="truncate px-2 font-semibold">{focused ? appOf(focused.id).name : 'Lab'}</span>
          <div className="relative max-md:hidden" onPointerDown={(e) => e.stopPropagation()}>
            <button type="button" aria-haspopup="menu" aria-expanded={menu === 'window'} onClick={() => setMenu(menu === 'window' ? null : 'window')} className={cn('rounded px-2 py-0.5', menu === 'window' && 'bg-foreground/15')}>Window</button>
            {menu === 'window' && (
              <div role="menu" className="absolute left-0 top-full mt-1 w-52 rounded-lg border border-border bg-popover/95 p-1 shadow-2xl backdrop-blur-xl">
                <button type="button" role="menuitem" disabled={!focused} className={menuItem} onClick={() => { setMenu(null); if (focused) minimize(focused.id) }}>Minimize</button>
                <button type="button" role="menuitem" disabled={!focused} className={menuItem} onClick={() => { setMenu(null); if (focused) zoom(focused.id) }}>Zoom</button>
                <button type="button" role="menuitem" disabled={!focused} className={menuItem} onClick={() => { setMenu(null); if (focused) close(focused.id) }}>Close</button>
                {wins.length > 0 && <hr className="my-1 border-border" />}
                {wins.map((w) => (
                  <button key={w.id} type="button" role="menuitem" className={menuItem} onClick={() => { setMenu(null); open(w.id) }}>
                    <span className="mr-1.5 inline-block w-3">{focused?.id === w.id ? '✓' : ''}</span>{appOf(w.id).name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => open('appearance')} aria-label="Appearance" title="Appearance" className="rounded px-1.5 py-0.5 hover:bg-foreground/15">◐</button>
          <button type="button" onClick={() => window.dispatchEvent(new Event('site:palette'))} aria-label="Search" title="Search (⌘K)" className="rounded px-1.5 py-0.5 hover:bg-foreground/15">⌕</button>
          <span className="hidden whitespace-pre px-1.5 tabular-nums sm:inline">{clock}</span>
        </div>
      </div>

      {/* desktop */}
      <div ref={area} className="relative flex-1 overflow-hidden">
        {/* on a phone there is no dock, so the apps sit on the desktop like a home screen */}
        <ul className="relative grid grid-cols-4 gap-x-2 gap-y-4 p-5 md:hidden" aria-label="Apps">
          {labApps.map((a) => (
            <li key={a.id} className="flex justify-center">
              <button type="button" onClick={() => open(a.id)} className="flex w-[4.5rem] flex-col items-center gap-1.5 text-center text-[11px] leading-tight">
                <LabIcon id={a.id} className="size-14" />
                <span>{a.name}</span>
              </button>
            </li>
          ))}
        </ul>

        {visible.map((w) => {
          const app = appOf(w.id)
          const isTop = focused?.id === w.id
          return (
            <section
              key={w.id}
              role="dialog"
              aria-label={app.name}
              onPointerDown={() => !isTop && open(w.id)}
              className={cn(
                'absolute flex flex-col border border-border bg-background',
                mobile ? 'inset-0' : 'rounded-xl',
                isTop ? 'shadow-[0_22px_70px_rgba(0,0,0,.45)]' : 'shadow-[0_10px_30px_rgba(0,0,0,.25)]',
              )}
              style={mobile ? { zIndex: w.z } : { left: w.x, top: w.y, width: w.w, height: w.h, zIndex: w.z }}
            >
              <header
                onPointerDown={(e) => startDrag(w, e)}
                onDoubleClick={(e) => { if (!mobile && !(e.target as HTMLElement).closest('button')) zoom(w.id) }}
                className={cn('group/bar relative flex h-9 shrink-0 select-none items-center border-b border-border bg-card px-3', !mobile && 'rounded-t-xl')}
              >
                <div className="flex items-center gap-2">
                  <TrafficLight label={`Close ${app.name}`} color="#ff5f57" glyph="×" active={isTop} onClick={() => close(w.id)} />
                  {!mobile && <TrafficLight label={`Minimize ${app.name}`} color="#febc2e" glyph="−" active={isTop} onClick={() => minimize(w.id)} />}
                  {!mobile && <TrafficLight label={`Zoom ${app.name}`} color="#28c840" glyph="+" active={isTop} onClick={() => zoom(w.id)} />}
                </div>
                <span className={cn('pointer-events-none absolute inset-x-20 truncate text-center text-[13px] font-medium', !isTop && 'text-muted-foreground')}>{app.name}</span>
              </header>
              <div className={cn('min-h-0 flex-1 overflow-auto', !mobile && 'rounded-b-xl')}>{render(w.id)}</div>
              {!mobile && HANDLES.map((h) => (
                <div key={h.edge} aria-hidden onPointerDown={(e) => startResize(w, h.edge, e)} className={cn('absolute touch-none', h.className)} />
              ))}
            </section>
          )
        })}
      </div>

      {/* dock */}
      <nav aria-label="Dock" className="pointer-events-none absolute inset-x-0 bottom-2 z-[999] flex justify-center max-md:hidden">
        <ul className="pointer-events-auto flex items-end gap-2 rounded-[22px] border border-foreground/10 bg-card/55 px-2.5 pb-2 pt-2 shadow-2xl backdrop-blur-xl">
          {labApps.map((a) => {
            const win = wins.find((w) => w.id === a.id)
            return (
              <li key={a.id} className="group relative flex flex-col items-center">
                <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">{a.name}</span>
                <button type="button" onClick={() => open(a.id)} aria-label={`Open ${a.name}`} className="origin-bottom transition-transform duration-150 hover:scale-[1.22] focus-visible:scale-[1.22]">
                  <LabIcon id={a.id} className="size-[52px]" />
                </button>
                <span className={cn('mt-1 size-1 rounded-full', win ? 'bg-foreground/70' : 'bg-transparent')} />
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

function TrafficLight({ label, color, glyph, active, onClick }: { label: string; color: string; glyph: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-3 items-center justify-center rounded-full text-[9px] font-bold leading-none text-black/60 ring-1 ring-inset ring-black/10"
      style={{ background: active ? color : 'var(--border)' }}
    >
      <span className="opacity-0 group-hover/bar:opacity-100">{glyph}</span>
    </button>
  )
}
