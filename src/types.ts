export type VizId =
  | 'array' | 'array2d' | 'linearSearch' | 'binarySearch' | 'bubbleSort' | 'selectionSort'
  | 'insertionSort' | 'stack' | 'queue' | 'circularQueue' | 'linkedList' | 'bst' | 'bigO'

export type Block =
  | { t: 'analogy'; title?: string; body: string }
  | { t: 'text'; body: string }
  | { t: 'simpler'; body: string }
  | { t: 'terms'; items: { term: string; meaning: string }[] }
  | { t: 'code'; code: string; caption?: string; lines?: string[]; output?: string; snippet?: boolean }
  | { t: 'steps'; title: string; items: string[] }
  | { t: 'mistakes'; items: string[] }
  | { t: 'table'; head: string[]; rows: string[][]; caption?: string }
  | { t: 'viz'; viz: VizId; caption?: string }
  | { t: 'check'; questionId: string }
  | { t: 'note'; body: string }

export interface Lesson {
  id: string
  moduleId: string
  title: string
  minutes: number
  objectives: string[]
  blocks: Block[]
  summary: string[]
  source?: string
}

export interface Module {
  id: string
  number: number
  title: string
  tanglish: string
  prerequisites: string[]
  minutes: number
  sources: string[]
  beginnerPrep?: boolean
  lessonIds: string[]
}

export interface Mcq {
  id: string
  moduleId: string
  question: string
  options: string[]
  tanglish: string
  why: string
}

export interface ShortAnswerQ {
  id: string
  moduleId: string
  question: string
  reference: string
  /** A concept is covered when ANY of its keywords appears in the answer. */
  concepts: { name: string; keywords: string[] }[]
  rubric: string
}

export type Difficulty = 'Beginner' | 'Easy' | 'Intermediate' | 'Challenge'

export interface TestCase { input: string; expected: string; hidden?: boolean }

export interface Exercise {
  id: string
  moduleId: string
  title: string
  difficulty: Difficulty
  statement: string
  inputFormat: string
  outputFormat: string
  constraints?: string
  examples: { input: string; output: string }[]
  starter: string
  tests: TestCase[]
  hints: string[]
  approachTanglish: string
  solution: string
}

export interface ProgressState {
  version: 1
  completedLessons: string[]
  completedExercises: string[]
  bookmarks: string[]
  lastLesson: string | null
  quizHistory: { at: number; scope: string; correct: number; total: number }[]
  wrongQuestions: Record<string, number>
  mcqSeen: Record<string, { correct: number; wrong: number }>
  shortAnswerBest: Record<string, number>
  activityDays: string[]
  recent: { at: number; text: string }[]
  settings: { theme: 'light' | 'dark' | 'system' }
  savedCode: Record<string, string>
}
