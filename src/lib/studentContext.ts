import type { ProgressState } from '../types'
import { exercises, lessonById, lessonOrder, lessonsOf, mcqById, mcqsOf, modules, moduleById, shortAnswers } from '../content'

/**
 * Builds a short, anonymous description of how the student is doing, from progress stored in their own browser.
 * It contains only course IDs, titles and scores: no name, no email, no saved code. It is sent to the chatbot
 * (when the student leaves "Personalise" on) so answers can target weak and unfinished areas.
 */

export interface StudentProfile {
  /** Compact text for the AI (always under MAX_PROFILE_CHARS). */
  summary: string
  /** True when the student has not done anything measurable yet. */
  empty: boolean
  weakModules: { id: string; title: string; accuracy: number; attempts: number }[]
  gaps: { id: string; title: string; neededFor: string }[]
  unfinished: { id: string; title: string; done: number; total: number }[]
  repeatedMisses: { id: string; module: string; question: string; times: number }[]
  strugglingExercises: string[]
  weakShortAnswers: string[]
  nextLesson: { id: string; title: string } | null
}

export const MAX_PROFILE_CHARS = 1400
const MIN_ATTEMPTS = 3
const WEAK_BELOW = 0.65

const clip = (s: string, n: number) => (s.length <= n ? s : s.slice(0, n - 1).trimEnd() + '…')
const firstLine = (s: string) => s.split('\n')[0].trim()

export function buildProfile(p: ProgressState): StudentProfile {
  const done = new Set(p.completedLessons)

  const stats = modules.map((m) => {
    const lessons = lessonsOf(m.id)
    const doneCount = lessons.filter((l) => done.has(l.id)).length
    let c = 0
    let w = 0
    for (const q of mcqsOf(m.id)) {
      const s = p.mcqSeen[q.id]
      if (s) { c += s.correct; w += s.wrong }
    }
    return { m, total: lessons.length, doneCount, attempts: c + w, accuracy: c + w ? c / (c + w) : 1 }
  })

  const weakModules = stats
    .filter((s) => s.attempts >= MIN_ATTEMPTS && s.accuracy < WEAK_BELOW)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 4)
    .map((s) => ({ id: s.m.id, title: s.m.title, accuracy: Math.round(s.accuracy * 100), attempts: s.attempts }))

  const unfinished = stats
    .filter((s) => s.doneCount > 0 && s.doneCount < s.total)
    .map((s) => ({ id: s.m.id, title: s.m.title, done: s.doneCount, total: s.total }))
    .slice(0, 4)

  // "Uncleared" foundations: the student is working in a module but has barely touched one of its prerequisites.
  const gaps: StudentProfile['gaps'] = []
  for (const s of stats) {
    const active = s.doneCount > 0 || s.attempts > 0
    if (!active) continue
    for (const pre of s.m.prerequisites) {
      const ps = stats.find((x) => x.m.id === pre)
      if (ps && ps.total > 0 && ps.doneCount / ps.total < 0.5 && !gaps.some((g) => g.id === pre))
        gaps.push({ id: pre, title: ps.m.title, neededFor: s.m.title })
    }
  }

  const repeatedMisses = Object.entries(p.wrongQuestions)
    .filter(([id]) => mcqById.has(id))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id, times]) => {
      const q = mcqById.get(id)!
      return { id, module: moduleById(q.moduleId)?.title ?? q.moduleId, question: clip(firstLine(q.question), 90), times }
    })

  const strugglingExercises = exercises
    .filter((e) => !p.completedExercises.includes(e.id) && p.savedCode[e.id] !== undefined && p.savedCode[e.id] !== e.starter)
    .slice(0, 4)
    .map((e) => e.title)

  const weakShortAnswers = shortAnswers
    .filter((q) => p.shortAnswerBest[q.id] !== undefined && p.shortAnswerBest[q.id] < 3)
    .slice(0, 4)
    .map((q) => clip(q.question, 80))

  const nextId = lessonOrder.find((id) => !done.has(id)) ?? null
  const nextLesson = nextId ? { id: nextId, title: lessonById.get(nextId)?.title ?? nextId } : null

  const attempts = Object.values(p.mcqSeen).reduce((a, s) => a + s.correct + s.wrong, 0)
  const empty = p.completedLessons.length === 0 && attempts === 0 && p.completedExercises.length === 0 && Object.keys(p.shortAnswerBest).length === 0

  const lines: string[] = []
  if (empty) {
    lines.push('New student: no lessons completed and no quiz or exercise attempts yet.')
  } else {
    lines.push(`Lessons completed: ${done.size}/${lessonOrder.length}. Exercises solved: ${p.completedExercises.length}/${exercises.length}.`)
    const last = p.quizHistory[0]
    if (last) lines.push(`Last quiz: "${clip(last.scope, 50)}" ${last.correct}/${last.total}.`)
    if (weakModules.length) lines.push('Weak topics (MCQ accuracy): ' + weakModules.map((w) => `${w.title} ${w.accuracy}% of ${w.attempts}`).join('; ') + '.')
    if (repeatedMisses.length) lines.push('Questions missed repeatedly: ' + repeatedMisses.map((r) => `[${r.module}] "${r.question}" x${r.times}`).join('; ') + '.')
    if (gaps.length) lines.push('Weak foundations: ' + gaps.map((g) => `${g.title} (needed for ${g.neededFor})`).join('; ') + '.')
    if (unfinished.length) lines.push('Started but not finished: ' + unfinished.map((u) => `${u.title} ${u.done}/${u.total}`).join('; ') + '.')
    if (strugglingExercises.length) lines.push('Attempted but not solved exercises: ' + strugglingExercises.join('; ') + '.')
    if (weakShortAnswers.length) lines.push('Short answers scored under 3/5: ' + weakShortAnswers.join(' | ') + '.')
  }
  if (nextLesson) lines.push(`Next unfinished lesson: ${nextLesson.title}.`)

  return {
    summary: clip(lines.join('\n'), MAX_PROFILE_CHARS),
    empty, weakModules, gaps, unfinished, repeatedMisses, strugglingExercises, weakShortAnswers, nextLesson,
  }
}

/** Intent check for the offline bot: is the student asking about their own progress, weakness or what to study? */
export const asksAboutProgress = (q: string) =>
  /\b(weak|weakness|struggl\w*|my progress|my level|where am i|what (should|to) (i )?(study|learn|revise|do)|next|revise|improve|pending|uncleared|gaps?)\b/i.test(q)

/** Plain-language version of the profile, used by the offline bot and as a readable fallback. */
export function describeProfile(pr: StudentProfile): string {
  if (pr.empty) {
    return pr.nextLesson
      ? `Neenga innum start pannala. "${pr.nextLesson.title}" lesson-la irundhu start pannunga, apuram quick-check questions try pannunga.`
      : 'Neenga innum start pannala. Learn page-la irundhu oru lesson edunga.'
  }
  const out: string[] = []
  if (pr.weakModules.length) out.push('Weak topics (quiz-la neraiya thappu): ' + pr.weakModules.map((w) => `${w.title} (${w.accuracy}%)`).join(', ') + '.')
  if (pr.repeatedMisses.length) out.push('Thirumba thirumba thappaana questions: ' + pr.repeatedMisses.map((r) => `"${r.question}"`).join('; ') + '.')
  if (pr.gaps.length) out.push('Foundation gaps: ' + pr.gaps.map((g) => `${g.title} (${g.neededFor}-ku thevai)`).join(', ') + '.')
  if (pr.unfinished.length) out.push('Paadhiyil nirkkum modules: ' + pr.unfinished.map((u) => `${u.title} ${u.done}/${u.total}`).join(', ') + '.')
  if (pr.strugglingExercises.length) out.push('Try panni mudikkaadha exercises: ' + pr.strugglingExercises.join(', ') + '.')
  if (pr.weakShortAnswers.length) out.push('Short answers-la kuraivaana score: ' + pr.weakShortAnswers.join(' | '))
  if (out.length === 0) out.push('Ippodhaikku periya weakness onnum theriyala. Nalla velai! Innum neraiya questions try pannina, ennala sariyaa sollida mudiyum.')
  if (pr.nextLesson) out.push(`Adutha step: "${pr.nextLesson.title}" lesson.`)
  return out.join('\n')
}
