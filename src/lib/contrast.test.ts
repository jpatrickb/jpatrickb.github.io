import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { themes as themeList } from '@/data/themes'
import { blend, contrast, parseThemes } from './contrast'

const css = readFileSync(new URL('../styles/global.css', import.meta.url), 'utf8')
const palettes = parseThemes(css)

// Text pairs the components use: [text token, surface token]. WCAG AA needs 4.5:1 for normal text.
const AA = 4.5
const pairs: [string, string][] = [
  ['foreground', 'background'], ['foreground', 'card'], ['foreground', 'muted'],
  ['muted-foreground', 'background'], ['muted-foreground', 'card'], ['muted-foreground', 'muted'],
  ['primary', 'background'], ['primary', 'card'],
  ['secondary-accent', 'background'], ['secondary-accent', 'card'],
  ['good', 'background'], ['bad', 'background'],
  ['primary-foreground', 'primary'],
]

// Dimmed "not covered" pipeline chips (PipelineStrip.astro uses text-muted-foreground/80). They are
// de-emphasised on purpose and also described in text, so the bar is 3:1, not 4.5:1.
const DIMMED_OPACITY = 0.8
const DIMMED_MIN = 3

describe('contrast helpers', () => {
  it('gives 21 for black on white and 1 for identical colours', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 5)
    expect(contrast('#777777', '#777777')).toBeCloseTo(1, 5)
  })

  it('is symmetric', () => {
    expect(contrast('#797593', '#faf4ed')).toBeCloseTo(contrast('#faf4ed', '#797593'), 10)
  })

  it('blends a colour over a background by opacity', () => {
    expect(blend('#ffffff', '#000000', 0.5)).toBe('#808080')
    expect(blend('#123456', '#abcdef', 1)).toBe('#123456')
    expect(blend('#123456', '#abcdef', 0)).toBe('#abcdef')
  })

  it('flags a known failing pair (the old Rosé Pine Dawn muted text on its card)', () => {
    expect(contrast('#797593', '#fffaf3')).toBeLessThan(AA)
  })
})

describe('theme palettes in global.css', () => {
  it('parses every theme listed in themes.ts, and nothing else', () => {
    expect(Object.keys(palettes).sort()).toEqual(themeList.map((t) => t.id).sort())
  })

  for (const t of themeList) {
    describe(t.id, () => {
      const p = palettes[t.id]

      it.each(pairs)('%s on %s is at least 4.5:1', (fg, bg) => {
        expect(contrast(p[fg], p[bg])).toBeGreaterThanOrEqual(AA)
      })

      it('keeps primary text readable on the tinted chip (primary at 15% over the background)', () => {
        expect(contrast(p.primary, blend(p.primary, p.background, 0.15))).toBeGreaterThanOrEqual(AA)
      })

      it('keeps dimmed chip text at 3:1 or better on the background and cards', () => {
        const dimmed = blend(p['muted-foreground'], p.background, DIMMED_OPACITY)
        expect(contrast(dimmed, p.background)).toBeGreaterThanOrEqual(DIMMED_MIN)
        expect(contrast(blend(p['muted-foreground'], p.card, DIMMED_OPACITY), p.card)).toBeGreaterThanOrEqual(DIMMED_MIN)
      })
    })
  }
})
