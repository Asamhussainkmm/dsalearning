import type { ProgressState } from '../types'

export const STORAGE_KEY = 'dsa-lab:progress:v1'

export const emptyProgress = (): ProgressState => ({
  version: 1,
  completedLessons: [],
  completedExercises: [],
  bookmarks: [],
  lastLesson: null,
  quizHistory: [],
  wrongQuestions: {},
  mcqSeen: {},
  shortAnswerBest: {},
  activityDays: [],
  recent: [],
  settings: { theme: 'system' },
  savedCode: {},
})

const isStrArr = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string')
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

/** Defensive parse: anything malformed falls back to the default for that field. Never throws. */
export function sanitizeProgress(raw: unknown): ProgressState {
  const base = emptyProgress()
  if (!isObj(raw)) return base
  const numMap = (v: unknown): Record<string, number> => {
    const out: Record<string, number> = {}
    if (isObj(v)) for (const [k, n] of Object.entries(v)) if (typeof n === 'number' && Number.isFinite(n)) out[k] = n
    return out
  }
  const seen: ProgressState['mcqSeen'] = {}
  if (isObj(raw.mcqSeen))
    for (const [k, v] of Object.entries(raw.mcqSeen))
      if (isObj(v) && typeof v.correct === 'number' && typeof v.wrong === 'number') seen[k] = { correct: v.correct, wrong: v.wrong }
  const strMap: Record<string, string> = {}
  if (isObj(raw.savedCode)) for (const [k, v] of Object.entries(raw.savedCode)) if (typeof v === 'string') strMap[k] = v
  const t = isObj(raw.settings) ? raw.settings.theme : undefined
  const theme = t === 'light' || t === 'dark' || t === 'system' ? t : 'system'
  return {
    version: 1,
    completedLessons: isStrArr(raw.completedLessons) ? raw.completedLessons : base.completedLessons,
    completedExercises: isStrArr(raw.completedExercises) ? raw.completedExercises : base.completedExercises,
    bookmarks: isStrArr(raw.bookmarks) ? raw.bookmarks : base.bookmarks,
    lastLesson: typeof raw.lastLesson === 'string' ? raw.lastLesson : null,
    quizHistory: Array.isArray(raw.quizHistory)
      ? raw.quizHistory.filter(
          (h): h is ProgressState['quizHistory'][number] =>
            isObj(h) && typeof h.at === 'number' && typeof h.scope === 'string' && typeof h.correct === 'number' && typeof h.total === 'number',
        )
      : [],
    wrongQuestions: numMap(raw.wrongQuestions),
    mcqSeen: seen,
    shortAnswerBest: numMap(raw.shortAnswerBest),
    activityDays: isStrArr(raw.activityDays) ? raw.activityDays : [],
    recent: Array.isArray(raw.recent)
      ? raw.recent.filter((r): r is ProgressState['recent'][number] => isObj(r) && typeof r.at === 'number' && typeof r.text === 'string').slice(0, 30)
      : [],
    settings: { theme },
    savedCode: strMap,
  }
}

export function loadProgress(): ProgressState {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    return s ? sanitizeProgress(JSON.parse(s)) : emptyProgress()
  } catch {
    return emptyProgress()
  }
}

export function saveProgress(p: ProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
  } catch {
    /* storage unavailable or full: progress just will not persist */
  }
}

export const dayKey = (d = new Date()) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Consecutive days (ending today or yesterday) with recorded activity. */
export function computeStreak(days: string[], now = new Date()): number {
  const set = new Set(days)
  const d = new Date(now)
  if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1)
  let n = 0
  while (set.has(dayKey(d))) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

export function exportProgress(p: ProgressState): string {
  return JSON.stringify({ app: 'dsa-lab', exportedAt: new Date().toISOString(), progress: p }, null, 2)
}

export function parseImport(text: string): ProgressState | null {
  try {
    const j = JSON.parse(text)
    if (!isObj(j) || j.app !== 'dsa-lab' || !isObj(j.progress)) return null
    return sanitizeProgress(j.progress)
  } catch {
    return null
  }
}
