import { labApps, type LabAppId } from '@/data/lab-apps'
import { LabIcon } from './icons'

export default function Readme({ onOpen }: { onOpen: (id: LabAppId) => void }) {
  return (
    <div className="space-y-4 p-5 text-sm leading-relaxed">
      <h2 className="text-lg font-semibold">Welcome to the lab</h2>
      <p className="text-muted-foreground">
        This is the more playful half of my site, set up like a little desktop. You can open apps from the dock at the
        bottom, drag the windows around, and resize them from any edge. If you'd like the regular version, you can head
        back to <a href="/" className="link">the main site</a>.
      </p>
      <ul className="divide-y divide-border rounded-lg border border-border">
        {labApps.filter((a) => a.id !== 'readme').map((a) => (
          <li key={a.id}>
            <button type="button" onClick={() => onOpen(a.id)} className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/60">
              <LabIcon id={a.id} className="size-8" />
              <span className="flex-1">
                <span className="font-medium">{a.name}</span>
                <span className="block text-xs text-muted-foreground">{a.blurb}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">
        <span className="kbd">esc</span> leaves a text box, then closes the window ·{' '}
        <span className="kbd">⌘K</span> search
      </p>
    </div>
  )
}
