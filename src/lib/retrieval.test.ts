import { describe, expect, it } from 'vitest'
import { kb } from '@/data/ask'
import { retrieve, THRESHOLD, tokenize } from './retrieval'

describe('tokenize', () => {
  it('lowercases, drops stop words and stems crude suffixes', () => {
    expect(tokenize('What are the Models?')).toEqual(['model'])
    expect(tokenize('hiring')).toEqual(['hir'])
    expect(tokenize('matches')).toEqual(['match'])
    expect(tokenize('model')).toEqual(['model'])
  })

  it('returns nothing for empty or punctuation-only input', () => {
    expect(tokenize('')).toEqual([])
    expect(tokenize('?!')).toEqual([])
  })
})

describe('retrieve', () => {
  const top = (q: string) => retrieve(q, 1)[0]

  it.each([
    ['tell me about the agentic research system', 'Tell me about the agentic research system.'],
    ['do you do causal inference', 'Do you do causal inference?'],
    ['have you built an iOS app', 'Have you shipped a mobile app?'],
    ['do you play trombone', 'Do you play music?'],
    ['is this a real AI', 'Is this a real AI?'],
  ])('answers "%s" with the matching entry', (query, question) => {
    const hit = top(query)
    expect(hit.entry.q).toBe(question)
    expect(hit.score).toBeGreaterThan(THRESHOLD)
  })

  it('scores gibberish below the threshold so the fallback shows', () => {
    expect(top('zxqv blorp').score).toBeLessThan(THRESHOLD)
  })

  it('returns k hits, best first, with scores in [0, 1]', () => {
    const hits = retrieve('what models have you built', 3)
    expect(hits).toHaveLength(3)
    expect(hits[0].score).toBeGreaterThanOrEqual(hits[1].score)
    expect(hits[1].score).toBeGreaterThanOrEqual(hits[2].score)
    for (const h of hits) {
      expect(h.score).toBeGreaterThanOrEqual(0)
      expect(h.score).toBeLessThanOrEqual(1 + 1e-9)
    }
  })

  it('finds each knowledge-base question by its own text', () => {
    for (const e of kb) expect(top(e.q).entry.q).toBe(e.q)
  })
})
