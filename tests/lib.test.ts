import { describe, expect, it } from 'vitest'
import { percent, scoreAnswers, shuffle, shuffleOptions } from '../src/lib/quiz'
import { computeStreak, dayKey, emptyProgress, exportProgress, parseImport, sanitizeProgress } from '../src/lib/storage'
import { completeExercise, completeLesson, moduleProgress, recordAnswer, recordQuiz, recordShortAnswer, uncompleteLesson } from '../src/lib/progressOps'
import { interpret, judge, normalizeOutput } from '../src/lib/judge0'
import { evaluateLocally } from '../src/lib/shortAnswer'
import { validateAiResult } from '../src/lib/ai'
import {
  binarySearchFrames, bstBuild, bstHeight, bubbleSortFrames, circDequeue, circEnqueue, circNew, inorder, insertionSortFrames,
  linearSearchFrames, llRemove, postorder, preorder, queueDequeue, queueEnqueue, queueNew, selectionSortFrames, stackNew, stackPop, stackPush,
} from '../src/lib/algos'
import { answerKey, mcqs, lessons, lessonById, mcqById, modules, shortAnswers, exercises } from '../src/content'
import type { ShortAnswerQ } from '../src/types'

const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64')

describe('quiz scoring', () => {
  it('counts correct, wrong and skipped answers using original option indexes', () => {
    const r = scoreAnswers({ a: 1, b: 0, c: 2 }, { a: 1, b: 3 })
    expect(r).toEqual({ correct: 1, total: 3, wrong: ['b'], skipped: ['c'] })
  })
  it('percent handles zero totals', () => {
    expect(percent(0, 0)).toBe(0)
    expect(percent(1, 3)).toBe(33)
  })
  it('shuffle keeps all items and does not mutate the input', () => {
    const src = [1, 2, 3, 4, 5]
    const out = shuffle(src)
    expect([...out].sort()).toEqual(src)
    expect(src).toEqual([1, 2, 3, 4, 5])
  })
  it('shuffleOptions is a permutation of 0..n-1', () => {
    expect([...shuffleOptions(4)].sort()).toEqual([0, 1, 2, 3])
  })
})

describe('progress persistence', () => {
  it('sanitizes garbage input into a valid empty state', () => {
    expect(sanitizeProgress(null)).toEqual(emptyProgress())
    const s = sanitizeProgress({ completedLessons: 'x', quizHistory: [{ bad: true }], settings: { theme: 'neon' } })
    expect(s.completedLessons).toEqual([])
    expect(s.quizHistory).toEqual([])
    expect(s.settings.theme).toBe('system')
  })
  it('round-trips through export and import', () => {
    const p = completeLesson(emptyProgress(), 'm0-l1', 'Hello')
    const back = parseImport(exportProgress(p))
    expect(back?.completedLessons).toEqual(['m0-l1'])
  })
  it('rejects files that are not exports of this app', () => {
    expect(parseImport('not json')).toBeNull()
    expect(parseImport(JSON.stringify({ app: 'other', progress: {} }))).toBeNull()
  })
  it('computes streaks that survive until the end of the next day', () => {
    const now = new Date(2026, 4, 10)
    const d = (n: number) => dayKey(new Date(2026, 4, 10 - n))
    expect(computeStreak([d(0), d(1), d(2)], now)).toBe(3)
    expect(computeStreak([d(1), d(2)], now)).toBe(2)
    expect(computeStreak([d(2)], now)).toBe(0)
  })
  it('records answers, quizzes, lessons and exercises immutably', () => {
    const p0 = emptyProgress()
    const p1 = recordAnswer(p0, 'q1', false)
    expect(p1.wrongQuestions.q1).toBe(1)
    expect(recordAnswer(p1, 'q1', true).wrongQuestions.q1).toBeUndefined()
    expect(p0.mcqSeen).toEqual({})
    expect(recordQuiz(p0, 'x', 3, 5).quizHistory[0]).toMatchObject({ scope: 'x', correct: 3, total: 5 })
    const l = completeLesson(p0, 'l1', 'L1')
    expect(completeLesson(l, 'l1', 'L1')).toBe(l)
    expect(uncompleteLesson(l, 'l1').completedLessons).toEqual([])
    expect(completeExercise(p0, 'e1', 'E1').completedExercises).toEqual(['e1'])
    expect(recordShortAnswer(recordShortAnswer(p0, 's', 4), 's', 2).shortAnswerBest.s).toBe(4)
    expect(moduleProgress(['a', 'b'], ['a'])).toBe(50)
  })
})

describe('code result handling', () => {
  it('maps Judge0 status ids to run statuses', () => {
    expect(interpret({ status: { id: 3, description: 'Accepted' }, stdout: b64('hi\n') })).toMatchObject({ status: 'ok', stdout: 'hi\n' })
    expect(interpret({ status: { id: 6, description: 'Compilation Error' }, compile_output: b64('boom') })).toMatchObject({ status: 'compile_error', compileOutput: 'boom' })
    expect(interpret({ status: { id: 5, description: 'TLE' } }).status).toBe('timeout')
    expect(interpret({ status: { id: 11, description: 'Runtime Error (NZEC)' }, stderr: b64('Exception') }).status).toBe('runtime_error')
    expect(interpret({ status: { id: 13, description: 'Internal Error' } }).status).toBe('service_error')
    expect(interpret({}).status).toBe('service_error')
  })
  it('decodes UTF-8 output', () => {
    expect(interpret({ status: { id: 3, description: 'ok' }, stdout: b64('→ ✓') }).stdout).toBe('→ ✓')
  })
  it('normalizes trailing whitespace and CRLF but nothing else', () => {
    expect(normalizeOutput('a  \r\nb\n\n')).toBe('a\nb')
    expect(normalizeOutput(' a')).toBe(' a')
  })
  it('judges output and never passes a failed run', () => {
    const ok = interpret({ status: { id: 3, description: 'ok' }, stdout: b64('15\n') })
    expect(judge({ input: '5', expected: '15' }, ok).passed).toBe(true)
    expect(judge({ input: '5', expected: '16' }, ok).passed).toBe(false)
    const bad = interpret({ status: { id: 11, description: 'RE' }, stdout: b64('15\n') })
    expect(judge({ input: '5', expected: '15' }, bad).passed).toBe(false)
  })
})

describe('short answer evaluation', () => {
  const q: ShortAnswerQ = {
    id: 't', moduleId: 'm0', question: 'q', reference: 'r', rubric: 'r',
    concepts: [{ name: 'a', keywords: ['alpha'] }, { name: 'b', keywords: ['beta', 'bravo'] }, { name: 'c', keywords: ['gamma'] }, { name: 'd', keywords: ['delta'] }],
  }
  it('scores by the share of covered concepts, out of 5', () => {
    expect(evaluateLocally(q, 'ALPHA and bravo!')).toMatchObject({ score: 3, covered: ['a', 'b'], missing: ['c', 'd'] })
    expect(evaluateLocally(q, 'nothing relevant').score).toBe(0)
    expect(evaluateLocally(q, 'alpha beta gamma delta').score).toBe(5)
  })
  it('every shipped model answer earns full marks from its own keywords', () => {
    for (const s of shortAnswers) {
      const r = evaluateLocally(s, s.reference)
      expect(r.missing, `${s.id} reference misses ${r.missing.join(', ')}`).toEqual([])
    }
  })
})

describe('AI result validation', () => {
  const good = { score: 4, maxScore: 5, verdict: 'partial', strengths: ['a'], missingConcepts: [], misconceptions: [], feedbackTanglish: 'ok', improvedAnswerEnglish: 'better', nextStep: 'read' }
  it('accepts a well-formed result', () => expect(validateAiResult(good)?.score).toBe(4))
  it('rejects malformed output', () => {
    expect(validateAiResult(null)).toBeNull()
    expect(validateAiResult({ ...good, score: 9 })).toBeNull()
    expect(validateAiResult({ ...good, score: 2.5 })).toBeNull()
    expect(validateAiResult({ ...good, verdict: 'great' })).toBeNull()
    expect(validateAiResult({ ...good, strengths: 'x' })).toBeNull()
    expect(validateAiResult({ ...good, nextStep: 3 })).toBeNull()
  })
})

describe('algorithm engines', () => {
  it('linear search finds the first match and reports not found', () => {
    const f = linearSearchFrames([4, 8, 15], 8)
    expect(Object.values(f[f.length - 1].marks)).toContain('found')
    expect(linearSearchFrames([1, 2], 9).at(-1)?.msg).toContain('-1')
  })
  it('binary search sorts first and finds values', () => {
    const f = binarySearchFrames([30, 10, 20], 20)
    expect(f[0].arr).toEqual([10, 20, 30])
    expect(Object.values(f.at(-1)!.marks)).toContain('found')
  })
  it('sort frame generators end with a sorted array', () => {
    const src = [6, 7, 72, 4, 32, 65, 9, 56]
    const sorted = [...src].sort((a, b) => a - b)
    for (const gen of [bubbleSortFrames, selectionSortFrames, insertionSortFrames]) expect(gen(src).at(-1)!.arr).toEqual(sorted)
  })
  it('stack push/pop with overflow and underflow', () => {
    let s = stackNew(2)
    s = stackPush(s, 1).state
    s = stackPush(s, 2).state
    expect(stackPush(s, 3).ok).toBe(false)
    const p = stackPop(s)
    expect(p.value).toBe(2)
    expect(stackPop(stackPop(p.state).state).ok).toBe(false)
  })
  it('linear queue never reuses freed slots (the lecture limitation)', () => {
    let q = queueNew(3)
    for (const v of [1, 2, 3]) q = queueEnqueue(q, v).state
    expect(queueEnqueue(q, 4).ok).toBe(false)
    q = queueDequeue(q).state
    expect(queueEnqueue(q, 4).ok).toBe(false)
  })
  it('circular queue wraps around and reuses slots', () => {
    let q = circNew(3)
    for (const v of [1, 2, 3]) q = circEnqueue(q, v).state
    expect(circEnqueue(q, 4).ok).toBe(false)
    const d = circDequeue(q)
    expect(d.value).toBe(1)
    q = circEnqueue(d.state, 4).state
    expect(q.rear).toBe(1)
    expect(q.size).toBe(3)
  })
  it('linked-list removal removes only the first match', () => {
    expect(llRemove([1, 2, 3, 2], 2)).toEqual({ list: [1, 3, 2], removed: true })
    expect(llRemove([1], 9).removed).toBe(false)
  })
  it('BST traversals for the lecture data set', () => {
    const t = bstBuild([23, 33, 45, 30, 10])
    expect(inorder(t)).toEqual([10, 23, 30, 33, 45])
    expect(preorder(t)).toEqual([23, 10, 33, 30, 45])
    expect(postorder(t)).toEqual([10, 30, 45, 33, 23])
    expect(bstHeight(t)).toBe(2)
    expect(bstHeight(null)).toBe(-1)
  })
})

describe('content integrity', () => {
  it('every lesson check block points to an existing question', () => {
    for (const l of lessons) for (const b of l.blocks) if (b.t === 'check') expect(mcqById.has(b.questionId), `${l.id} → ${b.questionId}`).toBe(true)
  })
  it('every module lists only existing lessons that belong to it', () => {
    for (const m of modules) for (const id of m.lessonIds) expect(lessonById.get(id)?.moduleId, id).toBe(m.id)
  })
  it('every MCQ has four non-empty options, an in-range answer and unique options', () => {
    for (const q of mcqs) {
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options).size, q.id).toBe(4)
      expect(answerKey[q.id]).toBeGreaterThanOrEqual(0)
      expect(answerKey[q.id]).toBeLessThan(4)
      expect(q.tanglish.length, q.id).toBeGreaterThan(5)
    }
  })
  it('each module has at least 5 MCQs and 3 short answers', () => {
    for (const m of modules) {
      expect(mcqs.filter((q) => q.moduleId === m.id).length, `${m.id} mcq`).toBeGreaterThanOrEqual(5)
      expect(shortAnswers.filter((q) => q.moduleId === m.id).length, `${m.id} sa`).toBeGreaterThanOrEqual(3)
    }
  })
  it('exercises have example, tests and a hidden test', () => {
    for (const e of exercises) {
      expect(e.tests.length, e.id).toBeGreaterThanOrEqual(2)
      expect(e.examples.length, e.id).toBeGreaterThan(0)
      expect(e.starter, e.id).toContain('class')
    }
  })
  it('answer distribution is not biased toward a single position', () => {
    const counts = [0, 0, 0, 0]
    for (const q of mcqs) counts[answerKey[q.id]]++
    expect(Math.max(...counts) / mcqs.length).toBeLessThan(0.6)
  })
})
