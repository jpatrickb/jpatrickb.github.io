import type { LabPhoto } from '@/data/lab-photos'

// A photo at full size: AVIF where the browser supports it, JPEG otherwise.
export function PhotoImage({ photo, sizes, className, alt = '', position }: { photo: LabPhoto; sizes: string; className?: string; alt?: string; position?: string }) {
  return (
    // display: contents, so the img sizes against the caller's box rather than the picture wrapper
    <picture className="contents">
      <source type="image/avif" srcSet={photo.full.avif} sizes={sizes} />
      <img src={photo.full.src} srcSet={photo.full.jpeg} sizes={sizes} alt={alt} draggable={false} decoding="async" className={className} style={{ objectPosition: position }} />
    </picture>
  )
}

// The desktop background: one of the lab's photos. It keeps its own colors in every theme; dark themes dim
// it so it doesn't glare behind dark windows.
export function Wallpaper({ photo }: { photo: LabPhoto }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <PhotoImage key={photo.id} photo={photo} sizes="100vw" position={photo.position} className="h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: 'light-dark(transparent, rgb(8 10 24 / .42))' }} />
    </div>
  )
}
