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

// The desktop background: soft layered hills, drawn from the current theme's colors.
export function Wallpaper() {
  const mix = (a: string, pct: number, b = 'var(--background)') => `color-mix(in srgb, ${a} ${pct}%, ${b})`
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="wp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: mix('var(--primary)', 46) }} />
          <stop offset=".55" style={{ stopColor: mix('var(--secondary-accent)', 30) }} />
          <stop offset="1" style={{ stopColor: mix('var(--secondary-accent)', 46) }} />
        </linearGradient>
        <radialGradient id="wp-glow" cx=".72" cy=".42" r=".5">
          <stop offset="0" style={{ stopColor: mix('var(--secondary-accent)', 70, '#ffffff'), stopOpacity: 0.75 }} />
          <stop offset="1" style={{ stopColor: mix('var(--secondary-accent)', 40), stopOpacity: 0 }} />
        </radialGradient>
        {[
          ['wp-h1', mix('var(--primary)', 52), mix('var(--primary)', 30)],
          ['wp-h2', mix('var(--primary)', 66), mix('var(--primary)', 40)],
          ['wp-h3', mix('var(--primary)', 78, 'var(--foreground)'), mix('var(--primary)', 46)],
          ['wp-h4', mix('var(--primary)', 38), mix('var(--primary)', 14)],
        ].map(([id, top, bottom]) => (
          <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: top }} />
            <stop offset="1" style={{ stopColor: bottom }} />
          </linearGradient>
        ))}
        <filter id="wp-soft" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="1.200" /></filter>
      </defs>
      <rect width="1440" height="900" fill="url(#wp-sky)" />
      <rect width="1440" height="900" fill="url(#wp-glow)" />
      <g filter="url(#wp-soft)">
        <path d="M0 520C180 440 330 430 520 490S860 600 1060 520s270-130 380-110v490H0z" fill="url(#wp-h1)" opacity=".7" />
        <path d="M0 640c150-90 330-120 520-60s330 120 520 70 290-150 400-150v400H0z" fill="url(#wp-h2)" opacity=".8" />
        <path d="M0 740c220-100 400-90 620-30s420 70 620-10 150-70 200-80v280H0z" fill="url(#wp-h3)" opacity=".85" />
        <path d="M0 830c260-70 520-60 760-20s470 20 680-50v140H0z" fill="url(#wp-h4)" />
      </g>
    </svg>
  )
}
