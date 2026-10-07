import { useEffect, useMemo, useRef, useState } from 'react'
import MiniSearch from 'minisearch'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from '@/components/ui/command'
import { themes } from '@/data/themes'
import { nav, site } from '@/data/site'
import { labApps, labGames } from '@/data/lab-apps'
import { copyEmail, setTheme, toast } from '@/lib/theme'
import type { SearchDoc } from '@/lib/search'

type Action = { id: string; label: string; hint?: string; group: string; keywords?: string; run: () => void }

const go = (url: string) => { window.location.href = url }

const actions: Action[] = [
  ...nav.map((n) => ({ id: `nav-${n.key}`, label: n.label, hint: `g ${n.key}`, group: 'Go to', run: () => go(n.href) })),
  { id: 'copy-email', label: 'Copy email address', hint: 'c', group: 'Actions', keywords: 'contact mail', run: () => copyEmail(site.email) },
  { id: 'resume', label: 'Open resume (PDF)', group: 'Actions', keywords: 'cv', run: () => go(site.resume) },
  { id: 'github', label: 'Open GitHub', group: 'Actions', keywords: 'code repos', run: () => go(site.github) },
  { id: 'linkedin', label: 'Open LinkedIn', group: 'Actions', run: () => go(site.linkedin) },
  { id: 'keys', label: 'Show keyboard shortcuts', hint: '?', group: 'Actions', keywords: 'help keys', run: () => window.dispatchEvent(new Event('site:help')) },
  ...labApps.map((a) => ({ id: `lab-${a.id}`, label: `Open ${a.name}`, group: 'Lab', keywords: a.blurb, run: () => openLab(a.id) })),
  ...labGames.map((g) => ({ id: `game-${g.id}`, label: `Play ${g.name}`, group: 'Lab', keywords: `game ${g.blurb} ${g.teaches}`, run: () => openLab(`games/${g.id}`) })),
  { id: 'theme-picker', label: 'Choose a theme…', group: 'Actions', keywords: 'appearance color colors dark light', run: () => window.dispatchEvent(new Event('site:themes')) },
  ...themes.map((t) => ({ id: `theme-${t.id}`, label: `Theme: ${t.name}`, group: 'Theme', keywords: t.dark ? 'dark' : 'light', run: () => { setTheme(t.id); toast(`theme → ${t.name}`) } })),
]

function openLab(id: string) {
  if (window.location.pathname.startsWith('/lab')) window.dispatchEvent(new CustomEvent('lab:open', { detail: id }))
  else go(`/lab/#${id}`)
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [docs, setDocs] = useState<SearchDoc[] | null>(null)
  const loading = useRef(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('site:palette', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('site:palette', onOpen)
    }
  }, [])

  useEffect(() => {
    if (!open || docs || loading.current) return
    loading.current = true
    fetch('/search.json').then((r) => r.json()).then(setDocs).catch(() => setDocs([]))
  }, [open, docs])

  useEffect(() => { if (!open) setQuery('') }, [open])

  const index = useMemo(() => {
    if (!docs) return null
    const ms = new MiniSearch<SearchDoc>({ fields: ['title', 'body'], storeFields: ['title', 'url', 'kind'], searchOptions: { boost: { title: 3 }, prefix: true, fuzzy: 0.2 } })
    ms.addAll(docs)
    return ms
  }, [docs])

  const q = query.trim().toLowerCase()
  const matchedActions = q
    ? actions.filter((a) => `${a.label} ${a.keywords ?? ''} ${a.group}`.toLowerCase().includes(q))
    : actions.filter((a) => a.group !== 'Theme')
  const results = q && index ? index.search(q).slice(0, 8) : []
  const groups = [...new Set(matchedActions.map((a) => a.group))]

  const run = (fn: () => void) => { setOpen(false); fn() }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle className="sr-only">Search and commands</DialogTitle>
        <Command shouldFilter={false} loop>
          <CommandInput value={query} onValueChange={setQuery} placeholder="Search projects, work, the lab, or type a command…" />
          <CommandList>
            <CommandEmpty>Nothing matched “{query}”. Try “aws”, “bayesian”, or “theme”.</CommandEmpty>
            {results.length > 0 && (
              <CommandGroup heading="Search">
                {results.map((r) => (
                  <CommandItem key={r.id} value={r.id} onSelect={() => run(() => go(r.url))}>
                    <span className="truncate">{r.title}</span>
                    <CommandShortcut>{r.kind}</CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {groups.map((g) => (
              <CommandGroup key={g} heading={g}>
                {matchedActions.filter((a) => a.group === g).map((a) => (
                  <CommandItem key={a.id} value={a.id} onSelect={() => run(a.run)}>
                    <span className="truncate">{a.label}</span>
                    {a.hint && <CommandShortcut>{a.hint}</CommandShortcut>}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
          <div className="flex flex-wrap gap-4 border-t border-border px-4 py-2 font-mono text-[11px] text-muted-foreground">
            <span><span className="kbd">↑</span> <span className="kbd">↓</span> move</span>
            <span><span className="kbd">↵</span> open</span>
            <span><span className="kbd">esc</span> close</span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
