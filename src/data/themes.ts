// Palettes live in src/styles/global.css as [data-theme="<id>"] blocks.
// `swatch` (background, text, accent, second accent) draws the preview cards in the theme pickers.
export type Theme = { id: string; name: string; dark: boolean; swatch: [string, string, string, string] }

export const themes: Theme[] = [
  { id: 'tokyo-night', name: 'Tokyo Night', dark: true, swatch: ['#1a1b26', '#c0caf5', '#7aa2f7', '#e0af68'] },
  { id: 'gruvbox', name: 'Gruvbox', dark: true, swatch: ['#282828', '#ebdbb2', '#fabd2f', '#8ec07c'] },
  { id: 'nord', name: 'Nord', dark: true, swatch: ['#2e3440', '#eceff4', '#88c0d0', '#a3be8c'] },
  { id: 'rose-pine', name: 'Rosé Pine', dark: true, swatch: ['#191724', '#e0def4', '#ebbcba', '#9ccfd8'] },
  { id: 'catppuccin-mocha', name: 'Catppuccin Mocha', dark: true, swatch: ['#1e1e2e', '#cdd6f4', '#cba6f7', '#f9e2af'] },
  { id: 'dracula', name: 'Dracula', dark: true, swatch: ['#282a36', '#f8f8f2', '#bd93f9', '#f1fa8c'] },
  { id: 'everforest', name: 'Everforest', dark: true, swatch: ['#2d353b', '#d3c6aa', '#a7c080', '#dbbc7f'] },
  { id: 'kanagawa', name: 'Kanagawa', dark: true, swatch: ['#1f1f28', '#dcd7ba', '#7e9cd8', '#e6c384'] },
  { id: 'solarized-dark', name: 'Solarized Dark', dark: true, swatch: ['#002b36', '#e4dfcc', '#2aa198', '#b58900'] },
  { id: 'flexoki-light', name: 'Flexoki Light', dark: false, swatch: ['#fffcf0', '#100f0f', '#205ea6', '#ad8301'] },
  { id: 'catppuccin-latte', name: 'Catppuccin Latte', dark: false, swatch: ['#eff1f5', '#4c4f69', '#8839ef', '#df8e1d'] },
  { id: 'github-light', name: 'GitHub Light', dark: false, swatch: ['#ffffff', '#1f2328', '#0969da', '#9a6700'] },
  { id: 'solarized-light', name: 'Solarized Light', dark: false, swatch: ['#fdf6e3', '#073642', '#1a6fb0', '#946f00'] },
  { id: 'rose-pine-dawn', name: 'Rosé Pine Dawn', dark: false, swatch: ['#faf4ed', '#575279', '#286983', '#b4637a'] },
]

export const DEFAULT_DARK = 'tokyo-night'
export const DEFAULT_LIGHT = 'rose-pine-dawn'
