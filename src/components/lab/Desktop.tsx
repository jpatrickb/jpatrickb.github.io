import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { labApps, type LabAppId } from '@/data/lab-apps'
import { cycleTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'
import Readme from './Readme'
import Terminal, { type TermProject } from './Terminal'
import AskPatrick from './AskPatrick'
import GradientGolf from './GradientGolf'
import Confounder from './Confounder'
import Experiments, { type Run } from './Experiments'
import Photos from './Photos'

type Win = { id: LabAppId; x: number; y: number; w: number; h: number; z: number }

const SIZES: Record<LabAppId, [number, number]> = {
  readme: [520, 460], terminal: [640, 400], ask: [520, 540], golf: [780, 700],
  confounder: [640, 560], experiments: [720, 440], photos: [520, 400],
}
const isLabApp = (s: string): s is LabAppId => labApps.some((a) => a.id === s)

export default function Desktop({ runs, projects }: { runs: Run[]; projects: TermProject[] }) {
  const [wins, setWins] = useState<Win[]>([])
  const [mobile, setMobile] = useState(false)
  const [clock, setClock] = useState('')
  const [theme, setThemeName] = useState('')
  const zTop = useRef(10)
  const area = useRef<HTMLDivElement>(null)

  const focused = wins.reduce<Win | null>((top, w) => (!top || w.z > top.z ? w : top), null)

  const open = useCallback((id: LabAppId) => {
    setWins((ws) => {
      const z = ++zTop.current
      const existing = ws.find((w) => w.id === id)
      if (existing) return ws.map((w) => (w.id === id ? { ...w, z } : w))
      const bounds = area.current?.getBoundingClientRect()
      const [w0, h0] = SIZES[id]
      const W = bounds?.width ?? 1200
      const H = bounds?.height ?? 800
      const w = Math.min(w0, W - 24)
      const h = Math.min(h0, H - 24)
      const n = ws.length
      const x = Math.max(12, Math.min(W - w - 12, (W - w) / 2 + (n % 5) * 28 - 56))
      const y = Math.max(12, Math.min(H - h - 12, (H - h) / 2.6 + (n % 5) * 24 - 24))
      return [...ws, { id, x, y, w, h, z }]
    })
    history.replaceState(null, '', `#${id}`)
  }, [])

  const close = useCallback((id: LabAppId) => {
    setWins((ws) => ws.filter((w) => w.id !== id))
    history.replaceState(null, '', location.pathname)
  }, [])

  useEffect(() => {
    const mq = matchMedia('(max-width: 767px)')
    const upd = () => setMobile(mq.matches)
    upd()
    mq.addEventListener('change', upd)
    const tick = () => setClock(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    tick()
    const t = window.setInterval(tick, 15000)
    const th = () => setThemeName(document.documentElement.dataset.theme ?? '')
    th()
    window.addEventListener('site:theme', th)
    const onOpen = (e: Event) => { const id = (e as CustomEvent<string>).detail; if (isLabApp(id)) open(id) }
    window.addEventListener('lab:open', onOpen)
    const fromHash = () => { const h = location.hash.slice(1); if (isLabApp(h)) open(h) }
    fromHash()
    if (!location.hash && !mq.matches) open('readme')
    window.addEventListener('hashchange', fromHash)
    return () => {
      mq.removeEventListener('change', upd)
      window.clearInterval(t)
      window.removeEventListener('site:theme', th)
      window.removeEventListener('lab:open', onOpen)
      window.removeEventListener('hashchange', fromHash)
    }
  }, [open])

  // lab-only keys: 1–7 open apps, Esc closes the focused window
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.metaKey || e.ctrlKey || e.altKey || t.closest('input, textarea, [data-own-keys]')) return
      if (document.querySelector('[role="dialog"][data-state="open"], dialog[open]')) return
      const n = Number(e.key)
      if (n >= 1 && n <= labApps.length) open(labApps[n - 1].id)
      else if (e.key === 'Escape' && focused) close(focused.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close, focused])

  const startDrag = (id: LabAppId, e: React.PointerEvent) => {
    if (mobile || (e.target as HTMLElement).closest('button')) return
    const win = wins.find((w) => w.id === id)
    const bounds = area.current?.getBoundingClientRect()
    if (!win || !bounds) return
    open(id)
    const sx = e.clientX - win.x
    const sy = e.clientY - win.y
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)
    const move = (ev: PointerEvent) => {
      const x = Math.max(-win.w + 80, Math.min(bounds.width - 80, ev.clientX - sx))
      const y = Math.max(0, Math.min(bounds.height - 36, ev.clientY - sy))
      setWins((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)))
    }
    const up = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up) }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
  }

  const render = (id: LabAppId): ReactNode => {
    switch (id) {
      case 'readme': return <Readme onOpen={open} />
      case 'terminal': return <Terminal onOpen={open} projects={projects} />
      case 'ask': return <AskPatrick />
      case 'golf': return <GradientGolf />
      case 'confounder': return <Confounder />
      case 'experiments': return <Experiments runs={runs} />
      case 'photos': return <Photos />
    }
  }

  const visible = mobile ? (focused ? [focused] : []) : wins

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background text-foreground">
      {/* menu bar */}
      <div className="flex h-8 shrink-0 items-center justify-between gap-3 border-b border-border bg-card/80 px-3 font-mono text-xs backdrop-blur">
        <div className="flex min-w-0 items-center gap-4">
          <a href="/" className="whitespace-nowrap font-medium hover:text-primary" title="Back to the site">◆ patrick-os</a>
          <span className="truncate text-muted-foreground">{focused ? labApps.find((a) => a.id === focused.id)?.name : 'Desktop'}</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <button type="button" onClick={() => cycleTheme()} className="hidden hover:text-foreground sm:inline">{theme} <span className="kbd">t</span></button>
          <button type="button" onClick={() => window.dispatchEvent(new Event('site:palette'))} className="hover:text-foreground"><span className="kbd">⌘K</span></button>
          <span className="hidden whitespace-nowrap tabular-nums sm:inline">{clock}</span>
        </div>
      </div>

      {/* desktop */}
      <div ref={area} className="relative flex-1 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:22px_22px]" />
        <ul className="relative grid w-max grid-flow-row grid-cols-3 gap-1 p-4 md:grid-cols-1" aria-label="Apps">
          {labApps.map((a, i) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => open(a.id)}
                className="flex w-24 flex-col items-center gap-1.5 rounded-lg p-2 text-center text-[11px] leading-tight hover:bg-muted/70 focus-visible:bg-muted"
              >
                <span className="flex size-12 items-center justify-center rounded-xl border border-border bg-card font-mono text-base text-primary shadow-sm">{a.glyph}</span>
                <span>{a.name}</span>
                <span className="font-mono text-[10px] text-muted-foreground max-md:hidden">{i + 1}</span>
              </button>
            </li>
          ))}
        </ul>

        {visible.map((w) => {
          const app = labApps.find((a) => a.id === w.id)!
          const isTop = focused?.id === w.id
          return (
            <section
              key={w.id}
              role="dialog"
              aria-label={app.name}
              onPointerDown={() => !isTop && open(w.id)}
              className={cn(
                'absolute flex flex-col overflow-hidden border border-border bg-background shadow-2xl',
                mobile ? 'inset-0 rounded-none' : 'rounded-xl',
                isTop ? 'ring-1 ring-primary/30' : 'opacity-[0.97]',
              )}
              style={mobile ? { zIndex: w.z } : { left: w.x, top: w.y, width: w.w, height: w.h, zIndex: w.z }}
            >
              <header onPointerDown={(e) => startDrag(w.id, e)} className={cn('flex h-9 shrink-0 select-none items-center gap-3 border-b border-border bg-card px-3', !mobile && 'cursor-grab active:cursor-grabbing')}>
                <button type="button" onClick={() => close(w.id)} aria-label={`Close ${app.name}`} className="size-3 rounded-full bg-bad/80 hover:bg-bad" />
                <span className="flex-1 truncate text-center font-mono text-xs text-muted-foreground">{app.name.toLowerCase().replace(/ /g, '-')}</span>
                <span className="w-3" />
              </header>
              <div className="min-h-0 flex-1 overflow-auto">{render(w.id)}</div>
            </section>
          )
        })}
      </div>

      {/* dock */}
      <nav aria-label="Dock" className="pointer-events-none absolute inset-x-0 bottom-3 z-[999] flex justify-center max-md:hidden">
        <ul className="pointer-events-auto flex gap-1.5 rounded-2xl border border-border bg-card/85 p-1.5 shadow-xl backdrop-blur">
          {labApps.map((a) => (
            <li key={a.id}>
              <button type="button" onClick={() => open(a.id)} title={a.name} aria-label={`Open ${a.name}`} className="relative flex size-10 items-center justify-center rounded-xl font-mono text-sm text-primary transition-transform hover:-translate-y-1 hover:bg-muted">
                {a.glyph}
                {wins.some((w) => w.id === a.id) && <span className="absolute -bottom-0.5 size-1 rounded-full bg-foreground" />}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
