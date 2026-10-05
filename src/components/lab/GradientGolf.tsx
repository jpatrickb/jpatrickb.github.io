import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { holes, prepare, simulate, scoreName, CUP, MAX_STEPS, type Optimizer, type Result, type Vec2 } from '@/lib/golf'
import { cn } from '@/lib/utils'

const OPTS: { id: Optimizer; label: string }[] = [
  { id: 'sgd', label: 'SGD' },
  { id: 'momentum', label: 'Momentum' },
  { id: 'adam', label: 'Adam' },
]
const OUTCOME_TEXT = {
  diverged: 'Out of bounds. The learning rate blew up the updates.',
  stuck: 'Stuck. The ball settled somewhere that isn’t the hole.',
  timeout: `Ran out of steps (${MAX_STEPS}). Too timid.`,
} as const

// lr slider is log-scale: 0 → 1e-3, 100 → 1
const toLr = (s: number) => 10 ** (-3 + (3 * s) / 100)
const fromLr = (lr: number) => ((Math.log10(lr) + 3) / 3) * 100

function rgb(hex: string): [number, number, number] {
  const h = hex.trim().replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
function tokens() {
  const cs = getComputedStyle(document.documentElement)
  const get = (k: string) => cs.getPropertyValue(k).trim() || '#888888'
  return { bg: get('--background'), fg: get('--foreground'), primary: get('--primary'), accent: get('--secondary-accent'), border: get('--border'), muted: get('--muted-foreground'), good: get('--good'), bad: get('--bad') }
}

type Best = Record<number, number>
const loadBest = (): Best => { try { return JSON.parse(localStorage.getItem('golf-best') ?? '{}') } catch { return {} } }

export default function GradientGolf() {
  const prepared = useMemo(() => holes.map(prepare), [])
  const [hi, setHi] = useState(0)
  const [opt, setOpt] = useState<Optimizer>('sgd')
  const [lrS, setLrS] = useState(fromLr(0.02))
  const [beta, setBeta] = useState(0.9)
  const [result, setResult] = useState<Result | null>(null)
  const [shown, setShown] = useState(0)
  const [best, setBest] = useState<Best>({})
  const [themeTick, setThemeTick] = useState(0)
  const canvas = useRef<HTMLCanvasElement>(null)
  const field = useRef<HTMLCanvasElement | null>(null)
  const raf = useRef(0)
  const hole = prepared[hi]
  const lr = toLr(lrS)

  useEffect(() => { setBest(loadBest()) }, [])
  useEffect(() => {
    const on = () => setThemeTick((t) => t + 1)
    window.addEventListener('site:theme', on)
    return () => window.removeEventListener('site:theme', on)
  }, [])

  // contour field: rendered once per hole/theme into an offscreen canvas
  useEffect(() => {
    const R = 220
    const off = document.createElement('canvas')
    off.width = off.height = R
    const ctx = off.getContext('2d')!
    const img = ctx.createImageData(R, R)
    const t = tokens()
    const bg = rgb(t.bg), pr = rgb(t.primary), bd = rgb(t.fg)
    const span = Math.log(hole.fmax - hole.fmin + 1e-3) - Math.log(1e-3)
    for (let j = 0; j < R; j++) for (let i = 0; i < R; i++) {
      const x = -1 + (2 * i) / (R - 1), y = 1 - (2 * j) / (R - 1)
      const v = (Math.log(hole.f(x, y) - hole.fmin + 1e-3) - Math.log(1e-3)) / span // 0 = lowest
      const bands = v * 16
      const line = bands - Math.floor(bands) < 0.09 ? 1 : 0
      const a = 0.05 + 0.32 * (1 - v)
      const k = (j * R + i) * 4
      for (let c = 0; c < 3; c++) {
        let val = bg[c] + (pr[c] - bg[c]) * a
        if (line) val += (bd[c] - val) * 0.12
        img.data[k + c] = val
      }
      img.data[k + 3] = 255
    }
    ctx.putImageData(img, 0, 0)
    field.current = off
    draw(shown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hi, themeTick])

  const draw = useCallback((upto: number) => {
    const c = canvas.current
    if (!c || !field.current) return
    const dpr = window.devicePixelRatio || 1
    const size = c.clientWidth
    if (c.width !== size * dpr) { c.width = c.height = size * dpr }
    const ctx = c.getContext('2d')!
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.imageSmoothingEnabled = true
    ctx.drawImage(field.current, 0, 0, size, size)
    const t = tokens()
    const P = ([x, y]: Vec2): Vec2 => [((x + 1) / 2) * size, ((1 - y) / 2) * size]

    // cup + flag
    const [hx, hy] = P(hole.pin)
    ctx.fillStyle = t.bg
    ctx.strokeStyle = t.fg
    ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.arc(hx, hy, (CUP / 2) * size, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx, hy - 26); ctx.stroke()
    ctx.fillStyle = t.bad
    ctx.beginPath(); ctx.moveTo(hx, hy - 26); ctx.lineTo(hx + 12, hy - 21.5); ctx.lineTo(hx, hy - 17); ctx.fill()

    // tee
    const [tx, ty] = P(hole.tee)
    ctx.strokeStyle = t.muted
    ctx.strokeRect(tx - 5, ty - 5, 10, 10)

    // path
    const path = result?.path.slice(0, upto + 1) ?? []
    if (path.length > 1) {
      ctx.strokeStyle = t.accent
      ctx.lineWidth = 1.5
      ctx.beginPath()
      path.forEach((p, i) => { const [x, y] = P(p); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y) })
      ctx.stroke()
      ctx.fillStyle = t.accent
      path.forEach((p) => { const [x, y] = P(p); ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill() })
    }
    const ball = path.length ? path[path.length - 1] : hole.tee
    const [bx, by] = P([Math.max(-1.2, Math.min(1.2, ball[0])), Math.max(-1.2, Math.min(1.2, ball[1]))])
    ctx.fillStyle = t.fg
    ctx.strokeStyle = t.bg
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.arc(bx, by, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
  }, [hole, result])

  useEffect(() => { draw(shown) }, [draw, shown])
  useEffect(() => {
    const ro = new ResizeObserver(() => draw(shown))
    if (canvas.current) ro.observe(canvas.current)
    return () => ro.disconnect()
  }, [draw, shown])

  const swing = () => {
    cancelAnimationFrame(raf.current)
    setDone(false)
    const r = simulate(hole, opt, lr, opt === 'sgd' ? 0 : beta)
    setResult(r)
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setShown(r.path.length - 1); finish(r); return }
    const perFrame = Math.max(1, Math.ceil(r.path.length / 90))
    let i = 0
    const tick = () => {
      i = Math.min(r.path.length - 1, i + perFrame)
      setShown(i)
      if (i < r.path.length - 1) raf.current = requestAnimationFrame(tick)
      else finish(r)
    }
    setShown(0)
    raf.current = requestAnimationFrame(tick)
  }
  const [done, setDone] = useState(false)
  const finish = (r: Result) => {
    setDone(true)
    if (r.outcome === 'holed') {
      setBest((b) => {
        if (b[hi] && b[hi] <= r.steps) return b
        const nb = { ...b, [hi]: r.steps }
        try { localStorage.setItem('golf-best', JSON.stringify(nb)) } catch { /* ignore */ }
        return nb
      })
    }
  }
  const resetBall = () => { cancelAnimationFrame(raf.current); setResult(null); setShown(0); setDone(false) }
  useEffect(resetBall, [hi])
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const loss = result ? result.losses[Math.min(shown, result.losses.length - 1)] : hole.f(hole.tee[0], hole.tee[1]) - hole.fmin
  const total = Object.values(best).reduce((a, b) => a + b, 0)
  const parTotal = prepared.reduce((a, h, i) => a + (best[i] ? h.par : 0), 0)

  return (
    <div
      onKeyDown={(e) => {
        if ((e.target as HTMLElement).tagName === 'BUTTON') return
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); swing() }
      }}
      className="grid gap-4 p-4 text-sm md:grid-cols-[minmax(0,1fr)_250px]"
    >
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap gap-1" role="tablist" aria-label="Holes">
          {prepared.map((h, i) => (
            <button key={h.name} role="tab" aria-selected={i === hi} type="button" onClick={() => setHi(i)} className={cn('rounded px-2 py-1 font-mono text-xs', i === hi ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground')}>
              {i + 1}. {h.name}
            </button>
          ))}
        </div>
        <canvas ref={canvas} className="aspect-square w-full max-w-[420px] rounded-lg border border-border" role="img" aria-label={`Loss surface for ${hole.name}. Ball at the tee, hole at the global minimum.`} />
        <LossCurve losses={result?.losses.slice(0, shown + 1) ?? []} />
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <div>
          <p className="font-medium">Hole {hi + 1}: {hole.name} <span className="font-mono text-xs text-muted-foreground">par {hole.par}</span></p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{hole.hint}</p>
        </div>

        <fieldset>
          <legend className="mb-1.5 font-mono text-[11px] text-muted-foreground">optimizer</legend>
          <div className="flex rounded-md border border-border p-0.5">
            {OPTS.map((o) => (
              <button key={o.id} type="button" onClick={() => setOpt(o.id)} aria-pressed={opt === o.id} className={cn('flex-1 rounded px-2 py-1 text-xs', opt === o.id ? 'bg-muted text-foreground' : 'text-muted-foreground')}>{o.label}</button>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="mb-1 flex justify-between font-mono text-[11px] text-muted-foreground"><span>learning rate</span><span className="tabular-nums text-foreground">{lr < 0.01 ? lr.toFixed(4) : lr.toFixed(3)}</span></span>
          <input type="range" min={0} max={100} step={0.5} value={lrS} onChange={(e) => setLrS(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
        </label>
        <label className={cn('block', opt === 'sgd' && 'opacity-40')}>
          <span className="mb-1 flex justify-between font-mono text-[11px] text-muted-foreground"><span>{opt === 'adam' ? 'β₁' : 'momentum β'}</span><span className="tabular-nums text-foreground">{beta.toFixed(2)}</span></span>
          <input type="range" min={0} max={0.99} step={0.01} value={beta} disabled={opt === 'sgd'} onChange={(e) => setBeta(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
        </label>

        <div className="flex gap-2">
          <button type="button" onClick={swing} className="flex-1 rounded-md bg-primary px-3 py-2 font-medium text-primary-foreground hover:opacity-90">Swing <span className="font-mono text-xs opacity-70">↵</span></button>
          <button type="button" onClick={resetBall} className="rounded-md border border-border px-3 py-2 text-muted-foreground hover:text-foreground">Reset</button>
        </div>

        <div className="rounded-md border border-border p-3 font-mono text-xs" aria-live="polite">
          <div className="flex justify-between"><span className="text-muted-foreground">step</span><span className="tabular-nums">{result ? shown : 0}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">loss − min</span><span className="tabular-nums">{Number.isFinite(loss) ? loss.toExponential(2) : '∞'}</span></div>
          {done && result && (
            <p className={cn('mt-2 font-sans text-[13px] leading-snug', result.outcome === 'holed' ? 'text-good' : 'text-bad')}>
              {result.outcome === 'holed'
                ? `${scoreName(result.steps, hole.par)}! In the cup in ${result.steps} steps (par ${hole.par}).`
                : OUTCOME_TEXT[result.outcome]}
            </p>
          )}
        </div>

        <table className="w-full font-mono text-xs">
          <caption className="mb-1 text-left text-[11px] text-muted-foreground">scorecard · best steps</caption>
          <tbody>
            {prepared.map((h, i) => (
              <tr key={h.name} className="border-b border-border/60">
                <td className="py-1">{i + 1}</td>
                <td className="py-1 text-muted-foreground">par {h.par}</td>
                <td className={cn('py-1 text-right tabular-nums', best[i] && best[i] <= h.par ? 'text-good' : '')}>{best[i] ?? '—'}</td>
              </tr>
            ))}
            <tr><td className="py-1" colSpan={2}>total</td><td className="py-1 text-right tabular-nums">{total ? `${total} / ${parTotal}` : '—'}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function LossCurve({ losses }: { losses: number[] }) {
  const W = 460, H = 56
  const vals = losses.filter(Number.isFinite).map((l) => Math.log10(Math.max(l, 1e-6)))
  if (vals.length < 2) {
    return <p className="mt-2 font-mono text-[11px] text-muted-foreground">log loss curve appears after your first swing</p>
  }
  const lo = Math.min(...vals), hi = Math.max(...vals)
  const pts = vals.map((v, i) => [(i / Math.max(1, vals.length - 1)) * W, H - 4 - ((v - lo) / (hi - lo || 1)) * (H - 8)])
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join('')
  return (
    <div className="mt-2 max-w-[420px]">
      <p className="mb-1 flex justify-between font-mono text-[11px] text-muted-foreground"><span>log₁₀ loss</span><span>{vals.length - 1} steps</span></p>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-14 w-full" preserveAspectRatio="none" aria-hidden>
        <path d={`${d}L${W},${H}L0,${H}Z`} fill="var(--primary)" opacity="0.12" />
        <path d={d} fill="none" stroke="var(--primary)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  )
}
