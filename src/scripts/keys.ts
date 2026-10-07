// Global keyboard layer. Every shortcut also has a visible click target somewhere on the page.
import { nav, site } from '@/data/site'
import { copyEmail, cycleTheme, setTheme, themeName } from '@/lib/theme'

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
  const smooth: ScrollBehavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  // k on the first item lets go of the selection and goes back to the top of the page
  if (step < 0 && current <= 0) {
    current = -1
    list.forEach((el) => (el.dataset.current = 'false'))
    ;(document.activeElement as HTMLElement | null)?.blur()
    window.scrollTo({ top: 0, behavior: smooth })
    return
  }
  // j on the last item shows whatever is left below it
  if (step > 0 && current === list.length - 1) {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: smooth })
    return
  }
  current = Math.max(0, Math.min(list.length - 1, current + step))
  list.forEach((el, i) => (el.dataset.current = String(i === current)))
  const el = list[current]
  el.scrollIntoView({ block: 'nearest', behavior: smooth })
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
// theme picker: a dialog on the main site, the Appearance app in the lab
window.addEventListener('site:themes', () => {
  if (window.location.pathname.startsWith('/lab')) {
    window.dispatchEvent(new CustomEvent('lab:open', { detail: 'appearance' }))
    return
  }
  const d = document.getElementById('theme-dialog') as HTMLDialogElement | null
  if (d && !d.open) d.showModal()
})
document.querySelectorAll<HTMLElement>('[data-set-theme]').forEach((el) =>
  el.addEventListener('click', () => setTheme(el.dataset.setTheme ?? '')),
)
for (const id of ['help-dialog', 'theme-dialog']) {
  document.getElementById(id)?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) (e.currentTarget as HTMLDialogElement).close()
  })
}
document.querySelectorAll('[data-action]').forEach((el) =>
  el.addEventListener('click', () => {
    const a = (el as HTMLElement).dataset.action
    if (a === 'palette') window.dispatchEvent(new Event('site:palette'))
    if (a === 'theme') cycleTheme()
    if (a === 'themes') window.dispatchEvent(new Event('site:themes'))
    if (a === 'help') window.dispatchEvent(new Event('site:help'))
    if (a === 'email') copyEmail(site.email)
  }),
)

// live theme name in the header and footer
const showTheme = () => {
  const id = document.documentElement.dataset.theme ?? ''
  document.querySelectorAll('[data-theme-name]').forEach((el) => { el.textContent = themeName(id) })
  document.querySelectorAll<HTMLElement>('[data-set-theme]').forEach((el) => el.setAttribute('aria-pressed', String(el.dataset.setTheme === id)))
}
showTheme()
window.addEventListener('site:theme', showTheme)
