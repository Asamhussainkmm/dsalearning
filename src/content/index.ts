import type { Lesson } from '../types'
import { modules, moduleById } from './modules'
import { m0 } from './lessons/m0'
import { m1 } from './lessons/m1'
import { m2 } from './lessons/m2'
import { m3 } from './lessons/m3'
import { m4 } from './lessons/m4'
import { m5 } from './lessons/m5'
import { m6 } from './lessons/m6'
import { m7 } from './lessons/m7'
import { m8 } from './lessons/m8'
import { m9 } from './lessons/m9'
import { m10 } from './lessons/m10'
import './questions/mcq-a'
import './questions/mcq-b'
import './questions/mcq-c'
import { mcqs, answerKey } from './questions/bank'
import { shortAnswers } from './shortAnswers'
import { exercises, exerciseById } from './exercises'

export const lessons: Lesson[] = [m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10].flat()
export const lessonById = new Map(lessons.map((l) => [l.id, l]))
export const mcqById = new Map(mcqs.map((q) => [q.id, q]))
export const shortAnswerById = new Map(shortAnswers.map((q) => [q.id, q]))

export { modules, moduleById, mcqs, answerKey, shortAnswers, exercises, exerciseById }

export const lessonsOf = (moduleId: string) => lessons.filter((l) => l.moduleId === moduleId)
export const mcqsOf = (moduleId: string) => mcqs.filter((q) => q.moduleId === moduleId)
export const shortAnswersOf = (moduleId: string) => shortAnswers.filter((q) => q.moduleId === moduleId)
export const exercisesOf = (moduleId: string) => exercises.filter((e) => e.moduleId === moduleId)

/** Linear lesson order across the whole course, used for previous / next navigation. */
export const lessonOrder: string[] = modules.flatMap((m) => m.lessonIds)
