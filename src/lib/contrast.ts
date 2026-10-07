// WCAG contrast helpers and a reader for the theme palettes in global.css, so a test can
// check that every theme keeps readable text. Pure functions, no DOM.
export type Tokens = Record<string, string>

function channel(c: number) {
  const v = c / 255
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

function rgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number]
}

export function luminance(hex: string): number {
  const [r, g, b] = rgb(hex)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/** WCAG contrast ratio, from 1 (identical) to 21 (black on white). */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** The colour you see when `fg` is drawn over `bg` at `alpha` opacity (0 to 1). */
export function blend(fg: string, bg: string, alpha: number): string {
  const [f, b] = [rgb(fg), rgb(bg)]
  return '#' + f.map((v, i) => Math.round(v * alpha + b[i] * (1 - alpha)).toString(16).padStart(2, '0')).join('')
}

/** Every `[data-theme="id"] { --token: #hex; ... }` block in a stylesheet that defines a palette. */
export function parseThemes(css: string): Record<string, Tokens> {
  const themes: Record<string, Tokens> = {}
  for (const [, id, body] of css.matchAll(/\[data-theme="([a-z-]+)"\]\s*\{([^}]*)\}/g)) {
    const tokens = Object.fromEntries([...body.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]))
    if (tokens.background) themes[id] = tokens
  }
  return themes
}
