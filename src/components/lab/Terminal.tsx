import { useEffect, useRef, useState, type ReactNode } from 'react'
import { labApps, type LabAppId } from '@/data/lab-apps'
import { themes } from '@/data/themes'
import { site } from '@/data/site'
import { setTheme, copyEmail } from '@/lib/theme'
import { retrieve, THRESHOLD } from '@/lib/retrieval'
import { fallback } from '@/data/ask'

export type TermProject = { id: string; title: string; summary: string; lane: string }

type Line = { id: number; node: ReactNode }

const FILES = ['about.txt', 'contact.txt', 'resume.pdf', 'projects/', 'lab/']
const COMMANDS = ['help', 'whoami', 'ls', 'cat', 'open', 'ask', 'theme', 'neofetch', 'date', 'echo', 'clear', 'history', 'sudo', 'trombone', 'exit', 'cd', 'pwd']

let lineId = 0

export default function Terminal({ onOpen, projects }: { onOpen: (id: LabAppId) => void; projects: TermProject[] }) {
  const [lines, setLines] = useState<Line[]>([])
  const [input, setInput] = useState('')
  const [hist, setHist] = useState<string[]>([])
  const [hIdx, setHIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const scroller = useRef<HTMLDivElement>(null)

  const print = (...nodes: ReactNode[]) => setLines((l) => [...l, ...nodes.map((node) => ({ id: lineId++, node }))])

  useEffect(() => {
    print(
      <span className="text-muted-foreground">patrick-os 1.0 · type <b className="text-foreground">help</b> to see commands, tab to complete</span>,
    )
    inputRef.current?.focus()
  }, [])
  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight }) }, [lines])

  const findProject = (arg: string) => {
    const a = arg.replace(/^projects\//, '').toLowerCase()
    return projects.find((p) => p.id === a) ?? projects.find((p) => p.id.startsWith(a) || p.title.toLowerCase().includes(a))
  }

  function run(raw: string) {
    const cmdline = raw.trim()
    print(<Prompt>{cmdline}</Prompt>)
    if (!cmdline) return
    setHist((h) => [...h, cmdline])
    const [cmd, ...args] = cmdline.split(/\s+/)
    const arg = args.join(' ')

    switch (cmd) {
      case 'help':
        print(
          <Table rows={[
            ['whoami', 'one-line bio'],
            ['ls [projects|lab]', 'list files'],
            ['cat <file|project>', 'print a file or project summary'],
            ['open <project|app|resume|github|linkedin>', 'open something'],
            ['ask <question>', 'query the local Ask Patrick retriever'],
            ['theme [name]', 'list or set the color theme'],
            ['neofetch', 'system info'],
            ['clear · history · date · echo · exit', ''],
          ]} />,
        )
        break
      case 'whoami':
        print(`${site.name}: ${site.role.toLowerCase()}. Builds the model and the system around it.`)
        break
      case 'pwd':
        print('/home/patrick')
        break
      case 'cd':
        print(<span className="text-muted-foreground">cd: this shell is stateless on purpose. Try <b>ls {arg || 'projects'}</b>.</span>)
        break
      case 'ls': {
        const dir = arg.replace(/\/$/, '')
        if (!dir) print(<Cols items={FILES} />)
        else if (dir === 'projects') print(<Cols items={projects.map((p) => p.id)} />)
        else if (dir === 'lab') print(<Cols items={labApps.map((a) => `${a.id}.app`)} />)
        else print(`ls: cannot access '${arg}': No such file or directory`)
        break
      }
      case 'cat': {
        if (!arg) { print('cat: missing operand'); break }
        if (arg === 'about.txt') print(<Pre>{`Data scientist & ML engineer. BS in Applied & Computational Math + Economics (BYU).
Founding engineer at TechForce Advisors: agentic research system, voice-to-CRM iOS app,
Terraform AWS platform, grounded document extraction. Now at Teradata.
Plays trombone and accompanies opera and ballet on piano.`}</Pre>)
        else if (arg === 'contact.txt') print(<Pre>{`email     ${site.email}\ngithub    ${site.github}\nlinkedin  ${site.linkedin}`}</Pre>)
        else if (arg === 'resume.pdf') print(<span className="text-muted-foreground">cat: resume.pdf is binary. Try <b>open resume</b>.</span>)
        else {
          const p = findProject(arg)
          if (p) print(<Pre>{`# ${p.title}  [${p.lane}]\n${p.summary}\n\nopen ${p.id}  → full write-up`}</Pre>)
          else print(`cat: ${arg}: No such file or directory`)
        }
        break
      }
      case 'open': {
        const a = arg.toLowerCase().replace(/\.app$/, '')
        const app = labApps.find((x) => x.id === a || x.name.toLowerCase() === a)
        if (!a) print('open: what should I open? Try open golf, open resume, or open <project>.')
        else if (app) { onOpen(app.id); print(`opening ${app.name}…`) }
        else if (a === 'resume' || a === 'resume.pdf') { window.open(site.resume, '_blank'); print('opening resume.pdf…') }
        else if (a === 'github') { window.open(site.github, '_blank'); print('opening GitHub…') }
        else if (a === 'linkedin') { window.open(site.linkedin, '_blank'); print('opening LinkedIn…') }
        else {
          const p = findProject(a)
          if (p) { window.location.href = `/projects/${p.id}/` } else print(`open: ${arg}: not found`)
        }
        break
      }
      case 'ask': {
        if (!arg) { print('usage: ask <question>'); break }
        const [best] = retrieve(arg)
        print(
          <span className="text-muted-foreground">[retriever] top match {best.score.toFixed(3)}: “{best.entry.q}”</span>,
          best.score >= THRESHOLD ? best.entry.a : fallback,
        )
        break
      }
      case 'theme': {
        if (!arg || arg === 'list') {
          print(<Table rows={themes.map((t) => [t.id, t.name])} />, <span className="text-muted-foreground">usage: theme &lt;id&gt;</span>)
        } else {
          const t = themes.find((x) => x.id === arg || x.name.toLowerCase() === arg.toLowerCase())
          if (t) { setTheme(t.id); print(`theme set to ${t.name}`) } else print(`theme: unknown theme '${arg}'. Run theme list.`)
        }
        break
      }
      case 'neofetch':
        print(<Neofetch projects={projects.length} />)
        break
      case 'date':
        print(new Date().toString())
        break
      case 'echo':
        print(arg)
        break
      case 'history':
        print(<Pre>{[...hist, cmdline].map((h, i) => `${String(i + 1).padStart(4)}  ${h}`).join('\n')}</Pre>)
        break
      case 'clear':
        setLines([])
        break
      case 'sudo':
        if (/^hire\s+patrick/i.test(arg)) {
          copyEmail(site.email)
          print(<span className="text-good">[sudo] permission granted. Email copied to your clipboard: {site.email}</span>)
        } else print(<span className="text-bad">patrick is not in the sudoers file. This incident will be reported. (Try: sudo hire patrick)</span>)
        break
      case 'trombone':
        playTrombone()
        print(<span className="text-muted-foreground">♪ wah wah wah wahhh</span>)
        break
      case 'exit':
        window.location.href = '/'
        break
      case 'rm':
        print(<span className="text-bad">rm: nice try.</span>)
        break
      default:
        if (labApps.some((a) => a.id === cmd)) { onOpen(cmd as LabAppId); print(`opening ${cmd}…`) }
        else print(`${cmd}: command not found. Type help.`)
    }
  }

  function complete() {
    const parts = input.split(' ')
    const pool = parts.length === 1
      ? COMMANDS
      : parts[0] === 'theme' ? themes.map((t) => t.id)
      : parts[0] === 'ls' ? ['projects', 'lab']
      : [...FILES.filter((f) => !f.endsWith('/')), ...projects.map((p) => p.id), ...labApps.map((a) => a.id), 'resume', 'github', 'linkedin']
    const last = parts[parts.length - 1]
    const matches = pool.filter((c) => c.startsWith(last))
    if (matches.length === 1) setInput([...parts.slice(0, -1), matches[0]].join(' ') + ' ')
    else if (matches.length > 1) print(<Prompt>{input}</Prompt>, <Cols items={matches} />)
  }

  return (
    <div
      ref={scroller}
      data-own-keys
      onClick={() => inputRef.current?.focus()}
      className="h-full overflow-y-auto p-3 font-mono text-[12.5px] leading-relaxed"
    >
      {lines.map((l) => <div key={l.id} className="whitespace-pre-wrap break-words">{l.node}</div>)}
      <form onSubmit={(e) => { e.preventDefault(); run(input); setInput(''); setHIdx(-1) }} className="flex items-center">
        <label htmlFor="term-input" className="sr-only">Terminal command</label>
        <span className="mr-2 shrink-0 text-primary">patrick@lab ~ $</span>
        <input
          ref={inputRef}
          id="term-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Tab') { e.preventDefault(); complete() }
            else if (e.key === 'ArrowUp') { e.preventDefault(); const i = hIdx < 0 ? hist.length - 1 : Math.max(0, hIdx - 1); if (hist[i]) { setHIdx(i); setInput(hist[i]) } }
            else if (e.key === 'ArrowDown') { e.preventDefault(); const i = hIdx + 1; if (hIdx >= 0 && i < hist.length) { setHIdx(i); setInput(hist[i]) } else { setHIdx(-1); setInput('') } }
            else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); setLines([]) }
          }}
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent outline-none"
        />
      </form>
    </div>
  )
}

function Prompt({ children }: { children: ReactNode }) {
  return <span><span className="text-primary">patrick@lab ~ $</span> {children}</span>
}
function Pre({ children }: { children: ReactNode }) {
  return <span className="block">{children}</span>
}
function Cols({ items }: { items: string[] }) {
  return <span className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-x-4">{items.map((i) => <span key={i} className={i.endsWith('/') ? 'text-primary' : ''}>{i}</span>)}</span>
}
function Table({ rows }: { rows: string[][] }) {
  return <span className="grid grid-cols-[auto_1fr] gap-x-6">{rows.flatMap(([a, b]) => [<span key={a} className="text-foreground">{a}</span>, <span key={a + 'd'} className="text-muted-foreground">{b}</span>])}</span>
}
function Neofetch({ projects }: { projects: number }) {
  const theme = typeof document !== 'undefined' ? document.documentElement.dataset.theme : ''
  const art = ['   ◆◆◆   ', '  ◆   ◆  ', ' ◆  ∇  ◆ ', '  ◆   ◆  ', '   ◆◆◆   ']
  const info = [
    ['', 'patrick@lab'],
    ['OS', 'patrick-os 1.0 (Astro + React)'],
    ['Host', 'your browser'],
    ['Kernel', 'applied-math 3.92'],
    ['Shell', 'tsh (tiny shell)'],
    ['Theme', theme ?? ''],
    ['Packages', `${projects} projects`],
    ['Uptime', 'since 2018 (first automation script)'],
  ]
  return (
    <span className="flex gap-6">
      <span className="text-primary">{art.join('\n')}</span>
      <span>{info.map(([k, v]) => <span key={k + v} className="block">{k ? <><span className="text-primary">{k}</span>: {v}</> : <b>{v}</b>}</span>)}</span>
    </span>
  )
}

function playTrombone() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    osc.type = 'sawtooth'
    filter.type = 'lowpass'
    filter.frequency.value = 900
    lfo.frequency.value = 5.5
    lfoGain.gain.value = 0
    lfo.connect(lfoGain).connect(osc.frequency)
    osc.connect(filter).connect(gain).connect(ctx.destination)
    const t = ctx.currentTime
    // Bb, A, Ab, then a long G with vibrato: the classic sad trombone
    const notes = [233.08, 220, 207.65, 196]
    notes.forEach((f, i) => {
      const at = t + i * 0.45
      osc.frequency.setValueAtTime(f * 1.03, at)
      osc.frequency.exponentialRampToValueAtTime(f, at + 0.12)
      gain.gain.setValueAtTime(0.0001, at)
      gain.gain.exponentialRampToValueAtTime(0.18, at + 0.05)
      if (i < notes.length - 1) gain.gain.exponentialRampToValueAtTime(0.02, at + 0.42)
    })
    const last = t + 3 * 0.45
    lfoGain.gain.setValueAtTime(0, last + 0.2)
    lfoGain.gain.linearRampToValueAtTime(6, last + 0.6)
    gain.gain.setValueAtTime(0.18, last + 1.1)
    gain.gain.exponentialRampToValueAtTime(0.0001, last + 1.6)
    osc.start(t)
    lfo.start(t)
    osc.stop(last + 1.7)
    lfo.stop(last + 1.7)
    osc.onended = () => ctx.close()
  } catch {
    /* no audio available */
  }
}
