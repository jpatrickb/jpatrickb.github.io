import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

export type Run = {
  id: string
  name: string
  role: string
  status: 'running' | 'finished'
  start: string
  end: string
  kind: string
  metrics: { label: string; value: string }[]
  tags: string[]
}

export default function Experiments({ runs }: { runs: Run[] }) {
  const kinds = useMemo(() => ['all', ...new Set(runs.map((r) => r.kind))], [runs])
  const [kind, setKind] = useState('all')
  const [sel, setSel] = useState(runs[0]?.id)
  const shown = runs.filter((r) => kind === 'all' || r.kind === kind)
  const active = runs.find((r) => r.id === sel)

  return (
    <div className="flex h-full flex-col text-sm">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2 font-mono text-xs">
        <span className="text-muted-foreground">project: career ·</span>
        {kinds.map((k) => (
          <button key={k} type="button" onClick={() => setKind(k)} className={cn('rounded px-1.5 py-0.5', kind === k ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground')}>{k}</button>
        ))}
        <span className="ml-auto text-muted-foreground">{shown.length} runs</span>
      </div>
      <div className="grid min-h-0 flex-1 md:grid-cols-[1fr_240px]">
        <div className="min-w-0 overflow-auto">
          <table className="w-full min-w-[440px] text-left">
            <thead className="sticky top-0 bg-background font-mono text-[11px] text-muted-foreground">
              <tr className="border-b border-border"><th className="px-3 py-2 font-normal">run</th><th className="py-2 font-normal">state</th><th className="py-2 font-normal">span</th><th className="px-3 py-2 font-normal">metric</th></tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id} onClick={() => setSel(r.id)} className={cn('cursor-pointer border-b border-border/60 hover:bg-muted/50', sel === r.id && 'bg-muted')}>
                  <td className="px-3 py-2">
                    <button type="button" onClick={() => setSel(r.id)} className="text-left font-medium">{r.name}</button>
                    <div className="text-xs text-muted-foreground">{r.role}</div>
                  </td>
                  <td className="py-2"><span className={cn('font-mono text-[11px]', r.status === 'running' ? 'text-secondary-accent' : 'text-muted-foreground')}>● {r.status}</span></td>
                  <td className="whitespace-nowrap py-2 font-mono text-[11px] text-muted-foreground">{r.start} – {r.end}</td>
                  <td className="px-3 py-2 font-mono text-[11px]">{r.metrics[0]?.value ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {active && (
          <aside className="min-w-0 overflow-auto border-t border-border p-4 md:border-l md:border-t-0">
            <p className="font-mono text-[11px] text-muted-foreground">run/{active.id}</p>
            <h3 className="mt-1 font-medium">{active.name}</h3>
            <p className="text-xs text-muted-foreground">{active.role}</p>
            <dl className="mt-4 space-y-2.5">
              {active.metrics.length ? active.metrics.map((m) => (
                <div key={m.label}><dt className="font-mono text-[10.5px] text-muted-foreground">{m.label}</dt><dd className="font-mono tabular-nums">{m.value}</dd></div>
              )) : <p className="text-xs text-muted-foreground">No metrics logged yet.</p>}
            </dl>
            <p className="mt-4 flex flex-wrap gap-1">{active.tags.map((t) => <span key={t} className="rounded border border-border px-1.5 py-0.5 font-mono text-[10.5px] text-muted-foreground">{t}</span>)}</p>
            <a href={`/work/#${active.id}`} className="link mt-4 inline-block font-mono text-xs">full log →</a>
          </aside>
        )}
      </div>
    </div>
  )
}
