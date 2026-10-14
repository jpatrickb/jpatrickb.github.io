import { useState } from 'react'
import type { LabPhoto } from '@/data/lab-photos'
import { SidebarHeading, SidebarItem, SidebarLayout } from './mac'
import { PhotoImage } from './Wallpaper'

// albums that don't have photos yet still show in the sidebar, with a note that they're on the way
const PLANNED = ['Case competition', 'Performances', 'Things I built']

export default function Photos({ photos, wallpaper, onSetWallpaper }: { photos: LabPhoto[]; wallpaper: string; onSetWallpaper: (id: string) => void }) {
  const [view, setView] = useState('Library')
  const [openId, setOpenId] = useState<string | null>(null)
  const albums = [...new Set([...photos.map((p) => p.album), ...PLANNED])]
  const shown = view === 'Library' ? photos : photos.filter((p) => p.album === view)
  const open = shown.find((p) => p.id === openId)
  const pick = (v: string) => { setView(v); setOpenId(null) }

  return (
    <SidebarLayout
      sidebar={
        <>
          <SidebarHeading>Photos</SidebarHeading>
          <SidebarItem icon="▦" active={view === 'Library'} onClick={() => pick('Library')}>Library</SidebarItem>
          <SidebarHeading>Albums</SidebarHeading>
          {albums.map((a) => <SidebarItem key={a} icon="▢" active={view === a} onClick={() => pick(a)}>{a}</SidebarItem>)}
        </>
      }
    >
      <div className="flex h-full flex-col">
        <div className="flex items-baseline justify-between gap-3 border-b border-border px-4 py-2">
          {open ? (
            <button type="button" onClick={() => setOpenId(null)} className="text-[13px] text-primary hover:underline">‹ {view}</button>
          ) : (
            <h2 className="text-[15px] font-bold">{view}</h2>
          )}
          <span className="text-xs text-muted-foreground">{open ? `${shown.indexOf(open) + 1} of ${shown.length}` : `${shown.length} ${shown.length === 1 ? 'photo' : 'photos'}`}</span>
        </div>

        {open ? (
          <figure className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 bg-muted/40 p-3">
              <PhotoImage photo={open} alt={open.title} sizes="(min-width: 900px) 800px, 100vw" className="h-full w-full object-contain" />
            </div>
            <figcaption className="flex items-center justify-between gap-3 border-t border-border px-4 py-2 text-sm">
              <span>
                <span className="font-semibold">{open.title}</span>
                {open.credit && <span className="text-muted-foreground"> · Photo by {open.credit}</span>}
              </span>
              {open.wallpaper && (
                <button type="button" disabled={wallpaper === open.id} onClick={() => onSetWallpaper(open.id)} className="shrink-0 rounded-md border border-border px-2.5 py-1 text-xs hover:border-muted-foreground disabled:opacity-60">
                  {wallpaper === open.id ? 'Current wallpaper' : 'Use as wallpaper'}
                </button>
              )}
            </figcaption>
          </figure>
        ) : shown.length ? (
          <div className="overflow-auto p-3">
            <div className="grid grid-cols-2 items-start gap-2 sm:grid-cols-3">
              {shown.map((p) => (
                <button key={p.id} type="button" onClick={() => setOpenId(p.id)} className="group text-left">
                  <img src={p.thumb} alt={p.title} loading="lazy" draggable={false} className="aspect-[4/3] w-full rounded-md object-cover ring-1 ring-border group-hover:ring-muted-foreground" />
                  <span className="mt-1 block truncate text-xs">{p.title}</span>
                  {p.credit && <span className="block truncate text-[11px] text-muted-foreground">Photo by {p.credit}</span>}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="grid grid-cols-4 gap-1" aria-hidden>
              {Array.from({ length: 8 }).map((_, i) => <span key={i} className="size-14 rounded-sm bg-muted" />)}
            </div>
            <p className="text-[15px] font-semibold">Photos are coming soon</p>
            <p className="max-w-[40ch] text-sm text-muted-foreground">I'm still picking out photos for this album.</p>
          </div>
        )}
      </div>
    </SidebarLayout>
  )
}
