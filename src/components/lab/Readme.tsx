import { labApps, type LabAppId } from '@/data/lab-apps'

export default function Readme({ onOpen }: { onOpen: (id: LabAppId) => void }) {
  return (
    <div className="space-y-4 p-5 text-sm leading-relaxed">
      <h2 className="font-mono text-base">patrick-os</h2>
      <p className="text-muted-foreground">
        This is the playful half of the site. Everything runs in your browser: no servers, no API keys, no tracking.
        The serious version is one click away at <a href="/" className="link">the main site</a>.
      </p>
      <ul className="divide-y divide-border rounded-lg border border-border">
        {labApps.filter((a) => a.id !== 'readme').map((a) => (
          <li key={a.id}>
            <button type="button" onClick={() => onOpen(a.id)} className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/60">
              <span className="w-6 text-center font-mono text-primary">{a.glyph}</span>
              <span className="flex-1">
                <span className="font-medium">{a.name}</span>
                <span className="block text-xs text-muted-foreground">{a.blurb}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="font-mono text-xs text-muted-foreground">
        <span className="kbd">1</span>–<span className="kbd">7</span> open apps · <span className="kbd">esc</span> close window ·{' '}
        <span className="kbd">t</span> theme · <span className="kbd">⌘K</span> everything else · <span className="kbd">g</span> <span className="kbd">h</span> back home
      </p>
    </div>
  )
}
