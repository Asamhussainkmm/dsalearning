import type { ShortAnswerQ } from '../types'

const WORKER = ((import.meta.env.VITE_AI_WORKER_URL as string | undefined) ?? '').replace(/\/$/, '')

export interface AiResult {
  score: number
  maxScore: 5
  verdict: 'correct' | 'partial' | 'incorrect'
  strengths: string[]
  missingConcepts: string[]
  misconceptions: string[]
  feedbackTanglish: string
  improvedAnswerEnglish: string
  nextStep: string
}

export type AiOutcome =
  | { ok: true; result: AiResult }
  | { ok: false; reason: 'not_configured' | 'rate_limited' | 'unavailable' | 'bad_output'; message: string }

export const aiConfigured = () => WORKER.length > 0

const strArr = (x: unknown): x is string[] => Array.isArray(x) && x.every((s) => typeof s === 'string')

/** Validate model output again on the client: never trust the network. */
export function validateAiResult(v: unknown): AiResult | null {
  if (typeof v !== 'object' || v === null) return null
  const o = v as Record<string, unknown>
  if (typeof o.score !== 'number' || !Number.isInteger(o.score) || o.score < 0 || o.score > 5) return null
  if (o.verdict !== 'correct' && o.verdict !== 'partial' && o.verdict !== 'incorrect') return null
  if (!strArr(o.strengths) || !strArr(o.missingConcepts) || !strArr(o.misconceptions)) return null
  if (typeof o.feedbackTanglish !== 'string' || typeof o.improvedAnswerEnglish !== 'string' || typeof o.nextStep !== 'string') return null
  return {
    score: o.score,
    maxScore: 5,
    verdict: o.verdict,
    strengths: o.strengths,
    missingConcepts: o.missingConcepts,
    misconceptions: o.misconceptions,
    feedbackTanglish: o.feedbackTanglish,
    improvedAnswerEnglish: o.improvedAnswerEnglish,
    nextStep: o.nextStep,
  }
}

export async function evaluateWithAi(q: ShortAnswerQ, answer: string): Promise<AiOutcome> {
  if (!WORKER)
    return { ok: false, reason: 'not_configured', message: 'AI evaluation is not configured for this deployment. Showing the built-in keyword check instead.' }
  try {
    const res = await fetch(`${WORKER}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: q.question, reference: q.reference, concepts: q.concepts.map((c) => c.name), rubric: q.rubric, answer: answer.slice(0, 1500) }),
      signal: AbortSignal.timeout(25_000),
    })
    if (res.status === 429) return { ok: false, reason: 'rate_limited', message: 'AI evaluation is busy. Wait a minute and try again. Showing the keyword check for now.' }
    if (!res.ok) return { ok: false, reason: 'unavailable', message: 'AI evaluation is temporarily unavailable. Showing the keyword check instead.' }
    const result = validateAiResult(await res.json())
    if (!result) return { ok: false, reason: 'bad_output', message: 'The AI returned an unreadable answer. Showing the keyword check instead.' }
    return { ok: true, result }
  } catch {
    return { ok: false, reason: 'unavailable', message: 'Could not reach the AI service. Showing the keyword check instead.' }
  }
}
