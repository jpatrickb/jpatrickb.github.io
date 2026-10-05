import { themes, DEFAULT_DARK, DEFAULT_LIGHT } from '@/data/themes'

const KEY = 'theme'

export function currentTheme(): string {
  return document.documentElement.dataset.theme ?? DEFAULT_DARK
}

export function setTheme(id: string) {
  if (!themes.some((t) => t.id === id)) return
  document.documentElement.dataset.theme = id
  try { localStorage.setItem(KEY, id) } catch { /* private mode */ }
  window.dispatchEvent(new CustomEvent('site:theme', { detail: id }))
}

export function cycleTheme(step = 1) {
  const i = themes.findIndex((t) => t.id === currentTheme())
  const next = themes[(i + step + themes.length) % themes.length]
  setTheme(next.id)
  toast(`theme → ${next.name}`)
}

export function themeName(id = currentTheme()) {
  return themes.find((t) => t.id === id)?.name ?? id
}

// Inlined into <head> so the right palette paints before first render.
export const themeBootScript = `(()=>{try{var t=localStorage.getItem('${KEY}');var ok=${JSON.stringify(themes.map((t) => t.id))};if(!t||ok.indexOf(t)<0){t=matchMedia('(prefers-color-scheme: light)').matches?'${DEFAULT_LIGHT}':'${DEFAULT_DARK}'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='${DEFAULT_DARK}'}})()`

let toastTimer: number | undefined
export function toast(msg: string) {
  let el = document.getElementById('site-toast')
  if (!el) {
    el = document.createElement('div')
    el.id = 'site-toast'
    el.setAttribute('role', 'status')
    el.className =
      'fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-md border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground shadow-lg'
    document.body.appendChild(el)
  }
  el.textContent = msg
  el.hidden = false
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => { if (el) el.hidden = true }, 1500)
}

export async function copyEmail(email: string) {
  try {
    await navigator.clipboard.writeText(email)
    toast(`copied ${email}`)
  } catch {
    toast(email)
  }
}
