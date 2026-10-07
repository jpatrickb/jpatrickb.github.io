import { useState } from 'react'
import { SidebarHeading, SidebarItem, SidebarLayout } from './mac'

const ALBUMS = ['Case competition', 'Performances', 'Things I built']

export default function Photos() {
  const [view, setView] = useState('Library')
  return (
    <SidebarLayout
      sidebar={
        <>
          <SidebarHeading>Photos</SidebarHeading>
          <SidebarItem icon="▦" active={view === 'Library'} onClick={() => setView('Library')}>Library</SidebarItem>
          <SidebarHeading>Albums</SidebarHeading>
          {ALBUMS.map((a) => <SidebarItem key={a} icon="▢" active={view === a} onClick={() => setView(a)}>{a}</SidebarItem>)}
        </>
      }
    >
      <div className="flex h-full flex-col">
        <div className="flex items-baseline justify-between border-b border-border px-4 py-2">
          <h2 className="text-[15px] font-bold">{view}</h2>
          <span className="text-xs text-muted-foreground">0 photos</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <div className="grid grid-cols-4 gap-1" aria-hidden>
            {Array.from({ length: 8 }).map((_, i) => <span key={i} className="size-14 rounded-sm bg-muted" />)}
          </div>
          <p className="text-[15px] font-semibold">Photos are coming soon</p>
          <p className="max-w-[40ch] text-sm text-muted-foreground">
            I'm still picking out photos to share here. I'm planning to add some from the case competition and a few
            performances, along with some of the things I've built.
          </p>
        </div>
      </div>
    </SidebarLayout>
  )
}
