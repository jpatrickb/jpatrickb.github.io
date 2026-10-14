// Photos for the lab: the Photos app shows all of them, and the ones marked `wallpaper` can be picked as the
// desktop background in Appearance. Files live in src/assets/photos, resized and with their metadata (GPS
// included) stripped before they are committed. To add one: drop the file there, import it, add an entry.
import type { ImageMetadata } from 'astro'
import timpanogosFall from '@/assets/photos/timpanogos-fall.jpg'
import summitRidge from '@/assets/photos/summit-ridge.jpg'
import summitView from '@/assets/photos/summit-view.jpg'
import mountainGoat from '@/assets/photos/mountain-goat.jpg'

export type LabPhotoSource = {
  id: string
  src: ImageMetadata
  title: string
  album: string
  credit: string
  wallpaper?: boolean
  // CSS object-position when the photo is cropped to fill the desktop
  position?: string
}

// The first photo marked `wallpaper` is the default background.
export const labPhotos: LabPhotoSource[] = [
  { id: 'timpanogos-fall', src: timpanogosFall, title: 'Timpanogos in the fall', album: 'Timpanogos', credit: 'my wife', wallpaper: true, position: '50% 62%' },
  { id: 'summit-ridge', src: summitRidge, title: 'Along the summit ridge', album: 'Timpanogos', credit: 'my wife', wallpaper: true, position: '50% 50%' },
  { id: 'summit-view', src: summitView, title: 'Looking out from the summit', album: 'Timpanogos', credit: 'my wife', wallpaper: true, position: '50% 40%' },
  { id: 'mountain-goat', src: mountainGoat, title: 'A mountain goat below the peak', album: 'Timpanogos', credit: 'my wife' },
]

// What the lab's React components receive: the same photo with its image URLs already built (see pages/lab).
export type LabPhoto = Omit<LabPhotoSource, 'src'> & {
  width: number
  height: number
  thumb: string
  // srcset strings at several widths, AVIF first with a JPEG fallback
  full: { avif: string; jpeg: string; src: string }
}
