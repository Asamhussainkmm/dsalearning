import type { ProgressState } from '../types'
import { dayKey } from './storage'

const addDay = (p: ProgressState): string[] => {
  const d = dayKey()
  return p.activityDays.includes(d) ? p.activityDays : [...p.activityDays, d].slice(-400)
}
const pushRecent = (p: ProgressState, text: string) => [{ at: Date.now(), text }, ...p.recent].slice(0, 20)

export function recordAnswer(p: ProgressState, id: string, correct: boolean): ProgressState {
  const seen = p.mcqSeen[id] ?? { correct: 0, wrong: 0 }
  const wrongQuestions = { ...p.wrongQuestions }
  if (correct) delete wrongQuestions[id]
  else wrongQuestions[id] = (wrongQuestions[id] ?? 0) + 1
  return {
    ...p,
    mcqSeen: { ...p.mcqSeen, [id]: { correct: seen.correct + (correct ? 1 : 0), wrong: seen.wrong + (correct ? 0 : 1) } },
    wrongQuestions,
    activityDays: addDay(p),
  }
}

export function recordQuiz(p: ProgressState, scope: string, correct: number, total: number): ProgressState {
  return {
    ...p,
    quizHistory: [{ at: Date.now(), scope, correct, total }, ...p.quizHistory].slice(0, 100),
    activityDays: addDay(p),
    recent: pushRecent(p, `Quiz "${scope}": ${correct}/${total}`),
  }
}

export function completeLesson(p: ProgressState, id: string, title: string): ProgressState {
  if (p.completedLessons.includes(id)) return p
  return { ...p, completedLessons: [...p.completedLessons, id], activityDays: addDay(p), recent: pushRecent(p, `Completed lesson: ${title}`) }
}

export function uncompleteLesson(p: ProgressState, id: string): ProgressState {
  return { ...p, completedLessons: p.completedLessons.filter((x) => x !== id) }
}

export function completeExercise(p: ProgressState, id: string, title: string): ProgressState {
  if (p.completedExercises.includes(id)) return p
  return { ...p, completedExercises: [...p.completedExercises, id], activityDays: addDay(p), recent: pushRecent(p, `Solved exercise: ${title}`) }
}

export function toggleBookmark(p: ProgressState, id: string): ProgressState {
  return { ...p, bookmarks: p.bookmarks.includes(id) ? p.bookmarks.filter((b) => b !== id) : [...p.bookmarks, id] }
}

export function setLastLesson(p: ProgressState, id: string): ProgressState {
  return p.lastLesson === id ? p : { ...p, lastLesson: id, activityDays: addDay(p) }
}

export function recordShortAnswer(p: ProgressState, id: string, score: number): ProgressState {
  const best = Math.max(p.shortAnswerBest[id] ?? 0, score)
  return { ...p, shortAnswerBest: { ...p.shortAnswerBest, [id]: best }, activityDays: addDay(p) }
}

export const moduleProgress = (lessonIds: string[], done: string[]) =>
  lessonIds.length === 0 ? 0 : Math.round((lessonIds.filter((l) => done.includes(l)).length / lessonIds.length) * 100)
