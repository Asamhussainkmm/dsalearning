import { useEffect, useRef, useState } from 'react'
import { Btn, Card, ProgressBar } from './Ui'
import { McqCard } from './McqCard'
import type { Mcq } from '../types'
import { answerKey } from '../content'
import { percent, scoreAnswers } from '../lib/quiz'
import { recordAnswer, recordQuiz } from '../lib/progressOps'
import { useProgress } from '../state/ProgressContext'

interface Props {
  title: string
  questions: Mcq[]
  onExit: () => void
  onRetryWrong?: (ids: string[]) => void
}

/** One question at a time with instant feedback; a score summary and review at the end. */
export function QuizSession({ title, questions, onExit, onRetryWrong }: Props) {
  const { update } = useProgress()
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [done, setDone] = useState(false)
  const saved = useRef(false)

  const q = questions[i]
  const keys = Object.fromEntries(questions.map((x) => [x.id, answerKey[x.id]]))
  const result = scoreAnswers(keys, answers)

  useEffect(() => {
    if (done && !saved.current) {
      saved.current = true
      update((p) => recordQuiz(p, title, result.correct, result.total))
    }
  }, [done, title, result.correct, result.total, update])

  if (questions.length === 0) return <Card>No questions available for this selection.</Card>

  if (done) {
    const pct = percent(result.correct, result.total)
    return (
      <div className="space-y-4">
        <Card>
          <h2 className="text-xl font-bold">Quiz complete: {title}</h2>
          <p className="mt-2 text-3xl font-extrabold text-brand">{result.correct} / {result.total} <span className="text-lg font-semibold text-muted">({pct}%)</span></p>
          <p className="mt-1 text-sm text-muted">
            {pct >= 80 ? 'Excellent! You have mastered this topic.' : pct >= 50 ? 'Good effort. Review the questions you missed below.' : 'Keep going. Read the lesson again and retry. Mistakes are how we learn.'}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.wrong.length + result.skipped.length > 0 && onRetryWrong && (
              <Btn onClick={() => onRetryWrong([...result.wrong, ...result.skipped])}>Retry missed questions</Btn>
            )}
            <Btn variant="ghost" onClick={onExit}>Back to quizzes</Btn>
          </div>
        </Card>
        <h3 className="text-lg font-semibold">Review</h3>
        {questions.map((x, n) => (
          <div key={x.id}>
            <p className="mb-1 text-sm text-muted">Question {n + 1}</p>
            <McqCard q={x} shuffle={false} initialChosen={answers[x.id] ?? -1} />
          </div>
        ))}
      </div>
    )
  }

  const answered = answers[q.id] !== undefined
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 flex justify-between text-sm text-muted"><span>{title}</span><span>Question {i + 1} of {questions.length}</span></div>
        <ProgressBar value={(i / questions.length) * 100} label="Quiz progress" />
      </div>
      <McqCard
        key={q.id}
        q={q}
        onAnswer={(correct, chosen) => {
          setAnswers((a) => ({ ...a, [q.id]: chosen }))
          update((p) => recordAnswer(p, q.id, correct))
        }}
        footer={
          <Btn onClick={() => (i + 1 >= questions.length ? setDone(true) : setI(i + 1))} disabled={!answered}>
            {i + 1 >= questions.length ? 'Finish quiz' : 'Next question'}
          </Btn>
        }
      />
      <Btn variant="ghost" onClick={onExit}>Quit quiz</Btn>
    </div>
  )
}
