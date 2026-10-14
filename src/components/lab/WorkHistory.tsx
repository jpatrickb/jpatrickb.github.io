// The Experience app, laid out like a notes app: folders on the left, a list of entries in the
// middle, and the selected entry on the right.
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { InlineMd, SidebarHeading, SidebarItem, SidebarLayout } from './mac'

export type WorkEntry = {
  id: string
  name: string
  role: string
  status: 'running' | 'finished'
  start: string
  end: string
  kind: string
  metrics: { label: string; value: string }[]
  tags: string[]
  body: string
}

const FOLDERS: Record<string, string> = { engineering: 'Engineering', research: 'Research', music: 'Music', other: 'Earlier roles' }
const bullets = (body: string) => body.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('- ')).map((l) => l.slice(2))

export default function WorkHistory({ work }: { work: WorkEntry[] }) {
  const kinds = useMemo(() => [...new Set(work.map((r) => r.kind))], [work])
  const [kind, setKind] = useState('all')
  const [sel, setSel] = useState(work[0]?.id)
  const shown = work.filter((r) => kind === 'all' || r.kind === kind)
  const active = shown.find((r) => r.id === sel) ?? shown[0]
  const points = active ? bullets(active.body) : []

  return (
    <SidebarLayout
      sidebar={
        <>
          <SidebarHeading>Experience</SidebarHeading>
          <SidebarItem tone="notes" icon="▤" active={kind === 'all'} count={work.length} onClick={() => setKind('all')}>All</SidebarItem>
          {kinds.map((k) => (
            <SidebarItem key={k} tone="notes" icon="▢" active={kind === k} count={work.filter((r) => r.kind === k).length} onClick={() => setKind(k)}>{FOLDERS[k] ?? k}</SidebarItem>
          ))}
        </>
      }
    >
      <div className="grid h-full min-h-0 grid-rows-[auto_1fr] md:grid-cols-[230px_1fr] md:grid-rows-1">
        <ul className="max-h-44 min-w-0 overflow-auto border-b border-border p-1.5 md:max-h-none md:border-b-0 md:border-r">
          {shown.map((r) => (
            <li key={r.id}>
              <button type="button" onClick={() => setSel(r.id)} className={cn('block w-full rounded-lg px-3 py-2 text-left', active?.id === r.id ? 'bg-[#f5c518]/35' : 'hover:bg-foreground/5')}>
                <span className="block truncate font-semibold">{r.name}</span>
                <span className="block truncate text-xs"><span className="tabular-nums">{r.end === 'Present' ? 'Now' : r.end}</span> <span className="text-muted-foreground">{r.role}</span></span>
              </button>
            </li>
          ))}
        </ul>
        {active && (
          <article className="min-w-0 overflow-auto px-6 py-4">
            <p className="text-center text-xs text-muted-foreground">{active.start} – {active.end}</p>
            <h2 className="mt-3 text-xl font-bold">{active.name}</h2>
            <p className="mt-0.5 text-[15px] font-semibold">{active.role}</p>
            {active.metrics.length > 0 && (
              <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                {active.metrics.map((m) => <span key={m.label}><span className="font-semibold tabular-nums">{m.value}</span> <span className="text-muted-foreground">{m.label}</span></span>)}
              </p>
            )}
            {points.length > 0 ? (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed marker:text-muted-foreground">
                {points.map((p, i) => <li key={i}><InlineMd text={p} /></li>)}
              </ul>
            ) : <p className="mt-4 text-sm text-muted-foreground">More details are coming soon.</p>}
            {active.tags.length > 0 && <p className="mt-4 text-sm text-muted-foreground">{active.tags.map((t) => `#${t.replace(/\s+/g, '')}`).join(' ')}</p>}
          </article>
        )}
      </div>
    </SidebarLayout>
  )
}
