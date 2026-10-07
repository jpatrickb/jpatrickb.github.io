// The Appearance app, laid out like a settings app: sections on the left, the selected pane on the right.
import { useEffect, useState } from 'react'
import { themes, type Theme } from '@/data/themes'
import { setTheme } from '@/lib/theme'
import { SidebarItem, SidebarLayout } from './mac'

export function ThemeCard({ theme, active, onPick }: { theme: Theme; active: boolean; onPick: (id: string) => void }) {
  const [bg, fg, primary, accent] = theme.swatch
  return (
    <button type="button" className="theme-card" aria-pressed={active} onClick={() => onPick(theme.id)}>
      <span className="preview" style={{ background: bg, color: fg }}>
        <i style={{ background: fg, width: '62%' }} />
        <i style={{ background: primary, width: '44%' }} />
        <i style={{ background: accent, width: '28%' }} />
      </span>
      <span className="mt-1.5 block px-0.5 text-xs">{theme.name}</span>
    </button>
  )
}

export default function Appearance() {
  const [current, setCurrent] = useState('')
  const [pane, setPane] = useState<'appearance' | 'about'>('appearance')
  useEffect(() => {
    const read = () => setCurrent(document.documentElement.dataset.theme ?? '')
    read()
    window.addEventListener('site:theme', read)
    return () => window.removeEventListener('site:theme', read)
  }, [])

  return (
    <SidebarLayout
      sidebar={
        <>
          <SidebarItem icon="◐" active={pane === 'appearance'} onClick={() => setPane('appearance')}>Appearance</SidebarItem>
          <SidebarItem icon="ⓘ" active={pane === 'about'} onClick={() => setPane('about')}>About</SidebarItem>
        </>
      }
    >
      <div className="h-full overflow-auto p-5 text-sm">
        {pane === 'appearance' ? (
          <div className="space-y-4">
            <h2 className="text-[15px] font-bold">Appearance</h2>
            {[{ title: 'Dark', dark: true }, { title: 'Light', dark: false }].map((group) => (
              <section key={group.title} className="rounded-xl border border-border bg-card/50 p-3">
                <h3 className="mb-2 text-xs font-semibold text-muted-foreground">{group.title}</h3>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {themes.filter((t) => t.dark === group.dark).map((t) => <ThemeCard key={t.id} theme={t} active={t.id === current} onPick={setTheme} />)}
                </div>
              </section>
            ))}
            <p className="text-xs text-muted-foreground">The theme applies to the whole site, and your choice is remembered for next time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-[15px] font-bold">About</h2>
            <dl className="divide-y divide-border rounded-xl border border-border bg-card/50 px-3">
              {[['Name', 'Patrick\u2019s Lab'], ['Made by', 'Patrick Beal'], ['Built with', 'Astro and React'], ['Theme', themes.find((t) => t.id === current)?.name ?? current]].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2"><dt>{k}</dt><dd className="text-muted-foreground">{v}</dd></div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </SidebarLayout>
  )
}
