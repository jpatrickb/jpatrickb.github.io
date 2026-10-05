// Global keyboard layer. Every shortcut also has a visible click target somewhere on the page.
import { nav, site } from '@/data/site'
import { copyEmail, cycleTheme } from '@/lib/theme'

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || !!t.closest('input, textarea, select, [data-own-keys]'))

let pendingG = 0
let current = -1

function items() {
  return [...document.querySelectorAll<HTMLElement>('[data-nav-item]')].filter((el) => el.offsetParent !== null)
}

function move(step: number) {
  const list = items()
  if (!list.length) return
  current = Math.max(0, Math.min(list.length - 1, current + step))
  list.forEach((el, i) => (el.dataset.current = String(i === current)))
  const el = list[current]
  el.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  ;(el.querySelector<HTMLElement>('a[href]') ?? el).focus({ preventScroll: true })
}

window.addEventListener('keydown', (e) => {
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return
  if (document.querySelector('[role="dialog"][data-state="open"], dialog[open]')) return

  if (pendingG && Date.now() - pendingG < 1200) {
    pendingG = 0
    const dest = nav.find((n) => n.key === e.key)
    if (dest) { e.preventDefault(); window.location.href = dest.href }
    return
  }

  switch (e.key) {
    case '/': e.preventDefault(); window.dispatchEvent(new Event('site:palette')); break
    case 't': case 'T': cycleTheme(e.shiftKey ? -1 : 1); break
    case 'g': pendingG = Date.now(); break
    case 'j': move(1); break
    case 'k': move(-1); break
    case 'o': items()[current]?.querySelector<HTMLAnchorElement>('a[href]')?.click(); break
    case 'c': copyEmail(site.email); break
    case '?': window.dispatchEvent(new Event('site:help')); break
  }
})

// help dialog
window.addEventListener('site:help', () => {
  const d = document.getElementById('help-dialog') as HTMLDialogElement | null
  if (d && !d.open) d.showModal()
})
document.getElementById('help-dialog')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) (e.currentTarget as HTMLDialogElement).close()
})
document.querySelectorAll('[data-action]').forEach((el) =>
  el.addEventListener('click', () => {
    const a = (el as HTMLElement).dataset.action
    if (a === 'palette') window.dispatchEvent(new Event('site:palette'))
    if (a === 'theme') cycleTheme()
    if (a === 'help') window.dispatchEvent(new Event('site:help'))
    if (a === 'email') copyEmail(site.email)
  }),
)

// live theme name in the header and footer
const showTheme = () => document.querySelectorAll('[data-theme-name]').forEach((el) => {
  const id = document.documentElement.dataset.theme ?? ''
  el.textContent = id
})
showTheme()
window.addEventListener('site:theme', showTheme)
