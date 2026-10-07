// Shared pieces for making the lab's apps feel like desktop apps: a sidebar with a list of sections
// next to the main content, the way Notes, Photos, and System Settings are laid out.
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function SidebarLayout({ sidebar, children, className }: { sidebar: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex h-full min-h-0 text-[13px]', className)}>
      <nav className="hidden w-[190px] shrink-0 overflow-y-auto border-r border-border bg-card/70 p-2 md:block">{sidebar}</nav>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

export function SidebarHeading({ children }: { children: ReactNode }) {
  return <p className="px-2 pb-1 pt-3 text-[11px] font-semibold text-muted-foreground first:pt-1">{children}</p>
}

export function SidebarItem({ active, onClick, icon, count, children, tone = 'primary' }: {
  active?: boolean; onClick?: () => void; icon?: ReactNode; count?: number; children: ReactNode; tone?: 'primary' | 'notes'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'flex w-full items-center gap-2 rounded-md px-2 py-1 text-left',
        active ? (tone === 'notes' ? 'bg-[#f5c518]/35' : 'bg-primary text-primary-foreground') : 'hover:bg-foreground/5',
      )}
    >
      {icon && <span className={cn('w-4 shrink-0 text-center', !active && (tone === 'notes' ? 'text-[#d9a300]' : 'text-primary'))} aria-hidden>{icon}</span>}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {count !== undefined && <span className={cn('text-xs tabular-nums', active && tone !== 'notes' ? 'opacity-80' : 'text-muted-foreground')}>{count}</span>}
    </button>
  )
}

// Small inline Markdown: **bold** and [links](url), which is all the work entries use.
export function InlineMd({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>
        const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (link) return <a key={i} href={link[2]} className="link">{link[1]}</a>
        return p
      })}
    </>
  )
}
