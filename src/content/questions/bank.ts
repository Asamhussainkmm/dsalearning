import type { Mcq } from '../../types'

/**
 * Question text lives in `mcqs`; the answer key lives in a separate map so that rendering code
 * never needs the key until an answer is checked.
 * NOTE: because this is a static website, a determined student can still read the key in the
 * browser dev tools. These quizzes are for practice, not secure exams.
 */
export const mcqs: Mcq[] = []
export const answerKey: Record<string, number> = {}

let counter = 0

/**
 * Authoring order tends to put the right answer in the same slot. To keep the stored order balanced
 * (it is shown as written in quiz review), the correct option is swapped into a rotating position.
 */
export function mcq(id: string, moduleId: string, question: string, options: [string, string, string, string], answer: 0 | 1 | 2 | 3, tanglish: string, why: string): void {
  if (answerKey[id] !== undefined) throw new Error(`Duplicate MCQ id ${id}`)
  const opts = [...options]
  const target = (counter++ * 3 + 1) % 4
  ;[opts[answer], opts[target]] = [opts[target], opts[answer]]
  mcqs.push({ id, moduleId, question, options: opts, tanglish, why })
  answerKey[id] = target
}
