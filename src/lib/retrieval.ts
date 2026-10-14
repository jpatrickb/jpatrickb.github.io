// Tiny TF-IDF retriever for "Ask Patrick". Real cosine similarity, just over a hand-written corpus.
import { kb, type KBEntry } from '@/data/ask'

const STOP = new Set('a an the you your do did does is are was were what how can could or and to of in on for me about tell just have has any i it that this with be at as so'.split(' '))

export function tokenize(s: string): string[] {
  return (s.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((w) => !STOP.has(w)).map(stem)
}

// crude suffix stripping so "models" ~ "model", "hiring" ~ "hire"
function stem(w: string) {
  if (w.length > 5 && w.endsWith('ing')) return w.slice(0, -3)
  if (w.length > 4 && w.endsWith('es')) return w.slice(0, -2)
  if (w.length > 3 && w.endsWith('s')) return w.slice(0, -1)
  return w
}

type Vec = Map<string, number>
const docs = kb.map((e) => tokenize(`${e.q} ${e.q} ${e.k} ${e.a}`))
const df = new Map<string, number>()
docs.forEach((d) => new Set(d).forEach((t) => df.set(t, (df.get(t) ?? 0) + 1)))
const idf = (t: string) => Math.log((kb.length + 1) / ((df.get(t) ?? 0) + 1)) + 1

function vectorize(tokens: string[]): Vec {
  const v: Vec = new Map()
  tokens.forEach((t) => v.set(t, (v.get(t) ?? 0) + 1))
  let norm = 0
  v.forEach((tf, t) => { const w = tf * idf(t); v.set(t, w); norm += w * w })
  norm = Math.sqrt(norm) || 1
  v.forEach((w, t) => v.set(t, w / norm))
  return v
}
const docVecs = docs.map(vectorize)

export type Hit = { entry: KBEntry; score: number }

export function retrieve(query: string, k = 3): Hit[] {
  const qv = vectorize(tokenize(query))
  return docVecs
    .map((dv, i) => {
      let s = 0
      qv.forEach((w, t) => { s += w * (dv.get(t) ?? 0) })
      return { entry: kb[i], score: s }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
}

export const THRESHOLD = 0.12
