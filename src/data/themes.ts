// Palettes live in src/styles/global.css as [data-theme="<id>"] blocks.
// `swatch` is only used for the little dots in the palette and terminal.
export type Theme = { id: string; name: string; dark: boolean; swatch: [string, string, string, string] }

export const themes: Theme[] = [
  { id: 'tokyo-night', name: 'Tokyo Night', dark: true, swatch: ['#1a1b26', '#c0caf5', '#7aa2f7', '#e0af68'] },
  { id: 'gruvbox', name: 'Gruvbox', dark: true, swatch: ['#282828', '#ebdbb2', '#fabd2f', '#8ec07c'] },
  { id: 'nord', name: 'Nord', dark: true, swatch: ['#2e3440', '#eceff4', '#88c0d0', '#a3be8c'] },
  { id: 'rose-pine', name: 'Rosé Pine', dark: true, swatch: ['#191724', '#e0def4', '#ebbcba', '#9ccfd8'] },
  { id: 'flexoki-light', name: 'Flexoki Light', dark: false, swatch: ['#fffcf0', '#100f0f', '#205ea6', '#ad8301'] },
  { id: 'catppuccin-latte', name: 'Catppuccin Latte', dark: false, swatch: ['#eff1f5', '#4c4f69', '#8839ef', '#df8e1d'] },
]

export const DEFAULT_DARK = 'tokyo-night'
export const DEFAULT_LIGHT = 'flexoki-light'
