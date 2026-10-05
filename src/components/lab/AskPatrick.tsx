import { useEffect, useRef, useState } from 'react'
import { kb, fallback, type KBEntry } from '@/data/ask'
import { retrieve, THRESHOLD, type Hit } from '@/lib/retrieval'

type Msg =
  | { role: 'user'; text: string }
  | { role: 'bot'; text: string; hits: Hit[]; done: boolean; link?: KBEntry['link']; ms: number }

const SUGGEST = [kb[2].q, kb[4].q, kb[7].q, kb[16].q]
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default function AskPatrick() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'bot', text: "Hi, I'm a small retrieval model of Patrick that runs in your browser. Ask about his work, models, infrastructure, or music.", hits: [], done: true, ms: 0 },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const log = useRef<HTMLDivElement>(null)

  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight }) }, [msgs])

  async function ask(q: string) {
    if (busy || !q.trim()) return
    setBusy(true)
    const t0 = performance.now()
    const hits = retrieve(q)
    const ms = performance.now() - t0
    const best = hits[0]
    const answer = best && best.score >= THRESHOLD ? best.entry : null
    const full = answer?.a ?? fallback
    setMsgs((m) => [...m, { role: 'user', text: q }, { role: 'bot', text: '', hits, done: false, ms }])
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
    setBusy(false)
  }

  return (
    <div className="flex h-full flex-col text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
        <span><span className="mr-1.5 inline-block size-1.5 rounded-full bg-good align-middle" />tfidf-retriever · {kb.length} docs · local</span>
        <span>0 API calls</span>
      </div>
      <div ref={log} className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
        {msgs.map((m, i) =>
          m.role === 'user' ? (
            <p key={i} className="ml-auto w-fit max-w-[85%] rounded-lg bg-muted px-3 py-2">{m.text}</p>
          ) : (
            <div key={i} className="max-w-[92%]">
              {m.hits.length > 0 && (
                <details className="mb-1.5 font-mono text-[11px] text-muted-foreground">
                  <summary className="cursor-pointer select-none">retrieved k=3 in {m.ms.toFixed(2)} ms</summary>
                  <ol className="mt-1 space-y-0.5 border-l border-border pl-2.5">
                    {m.hits.map((h, j) => (
                      <li key={j} className={j === 0 && h.score >= THRESHOLD ? 'text-primary' : ''}>
                        {h.score.toFixed(3)} · {h.entry.q}
                      </li>
                    ))}
                  </ol>
                </details>
              )}
              <p className="leading-relaxed">
                {m.text}
                {!m.done && <span className="ml-0.5 inline-block h-[1em] w-[7px] animate-pulse bg-primary align-[-2px]" />}
              </p>
              {m.link && m.done && <a href={m.link.href} className="link mt-1 inline-block font-mono text-xs">→ {m.link.label}</a>}
            </div>
          ),
        )}
      </div>
      <div className="flex flex-wrap gap-1.5 px-3 pb-2">
        {SUGGEST.map((s) => (
          <button key={s} type="button" disabled={busy} onClick={() => ask(s)} className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-muted-foreground hover:border-muted-foreground hover:text-foreground disabled:opacity-50">{s}</button>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); const v = input; setInput(''); ask(v) }} className="flex border-t border-border">
        <label htmlFor="ask-input" className="sr-only">Ask a question</label>
        <input id="ask-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything about Patrick…" autoComplete="off" className="min-w-0 flex-1 bg-transparent px-3 py-3 outline-none placeholder:text-muted-foreground" />
        <button type="submit" disabled={busy} className="px-3 font-mono text-xs text-primary disabled:opacity-50">send ↵</button>
      </form>
    </div>
  )
}
