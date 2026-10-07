import { useEffect, useRef, useState } from 'react'
import { kb, fallback, type KBEntry } from '@/data/ask'
import { retrieve, THRESHOLD, type Hit } from '@/lib/retrieval'

type Msg =
  | { role: 'user'; text: string }
  | { role: 'bot'; text: string; hits: Hit[]; done: boolean; link?: KBEntry['link'] }

const SUGGEST = [kb[2].q, kb[4].q, kb[7].q, kb[16].q]
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default function AskPatrick() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'bot', text: "Hi! I can answer some questions about Patrick. Feel free to ask about his work, his projects, school, or music.", hits: [], done: true },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const log = useRef<HTMLDivElement>(null)
  // a ref as well as state, so two quick clicks can't start two answers at once
  const sending = useRef(false)

  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight }) }, [msgs])

  async function ask(q: string) {
    if (sending.current || !q.trim()) return
    sending.current = true
    setBusy(true)
    const hits = retrieve(q)
    const best = hits[0]
    const answer = best && best.score >= THRESHOLD ? best.entry : null
    const full = answer?.a ?? fallback
    setMsgs((m) => [...m, { role: 'user', text: q }, { role: 'bot', text: '', hits, done: false }])
    if (!reduce()) await sleep(350)
    const words = full.match(/\S+\s*/g) ?? [full]
    let text = ''
    for (const w of words) {
      text += w
      const snapshot = text
      setMsgs((m) => m.map((msg, i) => (i === m.length - 1 && msg.role === 'bot' ? { ...msg, text: snapshot } : msg)))
      if (!reduce()) await sleep(18 + Math.random() * 38)
    }
    setMsgs((m) => m.map((msg, i) => (i === m.length - 1 && msg.role === 'bot' ? { ...msg, text: full, done: true, link: answer?.link } : msg)))
    sending.current = false
    setBusy(false)
  }

  return (
    <div className="flex h-full flex-col text-sm">
      <div className="flex flex-col items-center gap-1 border-b border-border bg-card/70 py-2">
        <img src="/profile.jpeg" alt="" className="size-9 rounded-full object-cover" />
        <span className="text-[11px]">Patrick</span>
      </div>
      <div ref={log} className="flex-1 space-y-2 overflow-y-auto p-4" aria-live="polite">
        {msgs.map((m, i) =>
          m.role === 'user' ? (
            <p key={i} className="ml-auto w-fit max-w-[78%] rounded-[18px] bg-[#0a84ff] px-3 py-1.5 text-white">{m.text}</p>
          ) : (
            <div key={i} className="max-w-[82%]">
              <p className="w-fit rounded-[18px] bg-muted px-3 py-1.5 leading-relaxed">
                {m.text || '…'}
                {m.link && m.done && <a href={m.link.href} className="link mt-1 block text-xs">{m.link.label} →</a>}
              </p>
              {m.hits.length > 0 && m.done && (
                <details className="ml-3 mt-1 font-mono text-[10.5px] text-muted-foreground">
                  <summary className="cursor-pointer select-none">closest matches</summary>
                  <ol className="mt-1 space-y-0.5 border-l border-border pl-2.5">
                    {m.hits.map((h, j) => (
                      <li key={j} className={j === 0 && h.score >= THRESHOLD ? 'text-primary' : ''}>
                        {h.score.toFixed(3)} · {h.entry.q}
                      </li>
                    ))}
                  </ol>
                </details>
              )}
            </div>
          ),
        )}
      </div>
      <div className="flex flex-wrap gap-1.5 px-3 pb-2">
        {SUGGEST.map((s) => (
          <button key={s} type="button" disabled={busy} onClick={() => ask(s)} className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:border-muted-foreground hover:text-foreground disabled:opacity-50">{s}</button>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); const v = input; setInput(''); ask(v) }} className="flex items-center gap-2 px-3 pb-3">
        <label htmlFor="ask-input" className="sr-only">Ask a question</label>
        <input id="ask-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Message" autoComplete="off" className="min-w-0 flex-1 rounded-full border border-border bg-transparent px-3.5 py-1.5 outline-none placeholder:text-muted-foreground focus:border-muted-foreground" />
        <button type="submit" disabled={busy || !input.trim()} aria-label="Send" className="flex size-7 items-center justify-center rounded-full bg-[#0a84ff] text-white disabled:opacity-40">↑</button>
      </form>
    </div>
  )
}
