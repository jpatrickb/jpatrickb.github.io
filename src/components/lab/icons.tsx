// App and game icons for the lab. The image files live in public/lab-icons (see CREDITS.md there for
// where each one came from), one PNG per app or game id. Add `<id>.png` to give a new one an icon.
import { cn } from '@/lib/utils'

// the two game icons are loose objects that sit on a light tile; the app icons already have their own shape
const ON_TILE = new Set(['golf', 'confounder'])

export function LabIcon({ id, className }: { id: string; className?: string }) {
  const full = !ON_TILE.has(id)
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        !full && 'scale-[.82] overflow-hidden rounded-[24%] bg-gradient-to-b from-white to-[#dfe3ea] ring-1 ring-inset ring-black/10 drop-shadow-[0_2px_3px_rgba(0,0,0,.28)]',
        className,
      )}
    >
      <img src={`/lab-icons/${id}.png`} alt="" draggable={false} className={full ? 'size-full' : 'size-[80%] object-contain'} />
    </span>
  )
}
