// Photos for the lab: the Photos app shows all of them, and the ones marked `wallpaper` can be picked as the
// desktop background in Appearance. Files live in src/assets/photos as <id>.jpg, at most 3840px on the long
// edge. To add one: drop the file there and add an entry below.
import type { ImageMetadata } from 'astro'

const files = import.meta.glob<ImageMetadata>('../assets/photos/*.jpg', { eager: true, import: 'default' })

type Entry = {
  // also the file name: src/assets/photos/<id>.jpg
  id: string
  title: string
  album: string
  // who took it, when it wasn't me
  credit?: string
  wallpaper?: boolean
  // CSS object-position when the photo is cropped to fill the desktop
  position?: string
}

export type LabPhotoSource = Entry & { src: ImageMetadata }

// The first photo marked `wallpaper` is the default background. Albums appear in the order they first show up.
const entries: Entry[] = [
  { id: 'timpanogos-fall', title: 'Timpanogos in the fall', album: 'Timpanogos', credit: 'my wife', wallpaper: true, position: '50% 62%' },
  { id: 'summit-ridge', title: 'Along the summit ridge', album: 'Timpanogos', credit: 'my wife', wallpaper: true, position: '50% 50%' },
  { id: 'summit-view', title: 'Looking out from the summit', album: 'Timpanogos', credit: 'my wife', wallpaper: true, position: '50% 40%' },
  { id: 'mountain-goat', title: 'A mountain goat below the peak', album: 'Timpanogos', credit: 'my wife' },

  { id: 'bridal-veil-falls', title: 'Bridal Veil Falls', album: 'Utah' },
  { id: 'utah-capitol-blossoms', title: 'Cherry Blossoms at the Utah State Capitol', album: 'Utah' },
  { id: 'moon-telescope', title: 'Moon via a telescope on the roof of the ESC at BYU (shot on iPhone)', album: 'Utah' },
  { id: 'jordan-river-temple', title: 'Morning at the Jordan River Temple', album: 'Utah' },
  { id: 'mount-timpanogos-temple', title: 'Evening at the Mount Timpanogos Temple', album: 'Utah' },
  { id: 'saratoga-springs-temple', title: 'Morning at the Saratoga Springs Temple', album: 'Utah' },
  { id: 'provo-city-center-temple', title: 'Provo City Center Temple', album: 'Utah' },
  { id: 'payson-temple', title: 'Sunset at the Payson temple', album: 'Utah' },
  { id: 'orem-temple', title: 'Wedding day at the Orem Temple', album: 'Utah' },
  { id: 'wedding-cake', title: 'Wedding Reception cake and decor', album: 'Utah' },
  { id: 'wedding-reception', title: 'Wedding Reception decorations', album: 'Utah' },

  { id: 'manhattan-before-storm', title: 'Calm before the storm, looking over Manhattan, NYC', album: 'New York' },
  { id: 'manhattan-lightning', title: 'Lightning strike in Manhattan, NYC (Shot on iPhone)', album: 'New York' },
  { id: 'manhattan-sunset', title: 'Sunset after the storm, looking over Manhattan, NYC', album: 'New York' },
  { id: 'manhattan-temple', title: 'Manhattan, NYC Temple', album: 'New York' },
  { id: 'montauk-lighthouse', title: 'Montauk Point Lighthouse in the fog, Montauk Point, Long Island, NY', album: 'New York' },
  { id: 'wading-river-rocks', title: 'Sunset and rocks on the beach, Wading River Beach, Long Island, NY', album: 'New York' },
  { id: 'wading-river-afterglow', title: 'Sunset at Wading River Beach, Long Island, NY', album: 'New York' },
  { id: 'wading-river-sunset', title: 'Sunset at Wading River Beach, Long Island, NY', album: 'New York' },
  { id: 'lavender-bee', title: 'Bee in the lavender fields, Calverton, Long Island, NY', album: 'New York' },
  { id: 'turtle', title: 'Gangster turtle, Brookhaven National Lab, Upton, NY', album: 'New York' },
  { id: 'canandaigua-lake', title: 'Sunset at Canandaigua Lake, Canandaigua, NY', album: 'New York' },
  { id: 'sacred-grove', title: 'Sacred Grove', album: 'New York' },
  { id: 'buttermilk-falls', title: 'Buttermilk Falls State Park', album: 'New York' },
  { id: 'sage-chapel', title: 'Sage Chapel, Cornell University', album: 'New York' },
  { id: 'cornell-organ', title: 'Anabel Taylor Hall Organ, Cornell University', album: 'New York' },

  { id: 'keukenhof-tulips', title: 'Tulips at Keukenhof Gardens, Netherlands', album: 'Netherlands' },
  { id: 'keukenhof-fiery-tulips', title: 'Fiery tulips at Keukenhof, Netherlands', album: 'Netherlands' },
  { id: 'tulip-barn', title: 'Tulip fields at The Tulip Barn, Netherlands', album: 'Netherlands' },
  { id: 'amsterdam-tulip-market', title: 'Tulip market, Amsterdam, NL', album: 'Netherlands' },
  { id: 'amsterdam-canal', title: 'Flowers over the canal, Amsterdam, NL', album: 'Netherlands' },
  { id: 'van-gogh-sunflowers', title: "Van Gogh's Sunflowers, Amsterdam, NL", album: 'Netherlands' },
  { id: 'hague-japanese-garden', title: 'Japanese Botanical Gardens, The Hague, Netherlands', album: 'Netherlands' },
  { id: 'scheveningen-sunset', title: 'Sunset on the Beach, Scheveningen Noorderstrand, The Hague, Netherlands', album: 'Netherlands' },
  { id: 'hague-temple', title: 'The Hague Temple, in Zoetermeer, Netherlands', album: 'Netherlands' },

  { id: 'sandy-bay-sailing', title: 'Sailing in Sandy Bay, Tasmania, AU', album: 'Australia' },
  { id: 'wombat', title: 'Wombat at Cradle Mountain National Park, Tasmania, AU', album: 'Australia' },
  { id: 'sydney-opera-house-moon', title: 'Super-moon above the Sydney Opera House', album: 'Australia' },

  { id: 'niagara-falls-brink', title: 'Niagara Falls, CA', album: 'More places' },
  { id: 'niagara-falls-mist', title: 'Niagara Falls, CA', album: 'More places' },
  { id: 'washington-dc-temple', title: 'Washington DC Temple', album: 'More places' },
]

export const labPhotos: LabPhotoSource[] = entries.map((entry) => {
  const src = files[`../assets/photos/${entry.id}.jpg`]
  if (!src) throw new Error(`lab-photos: no file src/assets/photos/${entry.id}.jpg`)
  return { ...entry, src }
})

// What the lab's React components receive: the same photo with its image URLs already built (see pages/lab).
export type LabPhoto = Omit<LabPhotoSource, 'src'> & {
  thumb: string
  // srcset strings at several widths, AVIF first with a JPEG fallback
  full: { avif: string; jpeg: string; src: string }
}
