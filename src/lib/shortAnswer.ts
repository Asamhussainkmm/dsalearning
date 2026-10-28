import type { ShortAnswerQ } from '../types'

export interface LocalEval {
  score: number
  maxScore: number
  covered: string[]
  missing: string[]
}

const norm = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9஀-௿+\-* ]+/g, ' ').replace(/\s+/g, ' ').trim()

/** Deterministic keyword-concept check. A first pass / fallback only: it cannot judge meaning. */
export function evaluateLocally(q: ShortAnswerQ, answer: string): LocalEval {
  const text = norm(answer)
  const covered: string[] = []
  const missing: string[] = []
  for (const c of q.concepts) {
    const hit = c.keywords.some((k) => text.includes(norm(k)))
    ;(hit ? covered : missing).push(c.name)
  }
  const maxScore = 5
  const score = q.concepts.length === 0 ? 0 : Math.round((covered.length / q.concepts.length) * maxScore)
  return { score, maxScore, covered, missing }
}
