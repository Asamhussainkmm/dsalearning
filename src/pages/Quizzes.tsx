import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { mcqById, mcqs, mcqsOf, modules, moduleById } from '../content'
import type { Mcq } from '../types'
import { shuffle } from '../lib/quiz'
import { useProgress } from '../state/ProgressContext'
import { Btn, Card, PageHeader, Badge } from '../components/Ui'
import { QuizSession } from '../components/QuizSession'

interface Active { title: string; questions: Mcq[] }

export default function Quizzes() {
  const [sp, setSp] = useSearchParams()
  const { p } = useProgress()
  const [active, setActive] = useState<Active | null>(null)
  const [runId, setRunId] = useState(0)

  const startModule = (id: string) => {
    const m = moduleById(id)
    if (!m) return
    setActive({ title: `${m.title} – mastery quiz`, questions: shuffle(mcqsOf(id)) })
    setRunId((n) => n + 1)
  }
  const startMixed = (count: number) => {
    setActive({ title: `Mixed quiz (${count} questions)`, questions: shuffle(mcqs).slice(0, count) })
    setRunId((n) => n + 1)
  }

  // Deep link from lesson: /quizzes?module=m4
  const pending = sp.get('module')
  useEffect(() => {
    if (pending && moduleById(pending)) {
      startModule(pending)
      setSp({}, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending])

  if (active)
    return (
      <>
        <PageHeader title="MCQ Quiz" />
        <QuizSession
          key={runId}
          title={active.title}
          questions={active.questions}
          onExit={() => setActive(null)}
          onRetryWrong={(ids) => {
            const qs = ids.map((id) => mcqById.get(id)).filter((q): q is Mcq => !!q)
            setActive({ title: `Retry: ${active.title}`, questions: shuffle(qs) })
            setRunId((n) => n + 1)
          }}
        />
      </>
    )

  return (
    <>
      <PageHeader title="MCQ Quizzes" subtitle="Questions are in English; explanations are in Tanglish. You get feedback after every question, and options are shuffled each time." />
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[10, 20, 30].map((n) => (
          <Card key={n}>
            <p className="font-semibold">Mixed quiz</p>
            <p className="text-sm text-muted">{n} random questions from every module</p>
            <Btn className="mt-3" onClick={() => startMixed(n)}>Start {n}</Btn>
          </Card>
        ))}
      </div>
      <h2 className="mb-2 text-lg font-semibold">Quiz by topic</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {modules.map((m) => {
          const qs = mcqsOf(m.id)
          const seen = qs.filter((q) => p.mcqSeen[q.id]).length
          return (
            <li key={m.id}>
              <Card className="flex h-full flex-col justify-between">
                <div>
                  <p className="font-semibold">{m.number}. {m.title}</p>
                  <div className="mt-1 flex gap-2"><Badge tone="muted">{qs.length} questions</Badge><Badge tone={seen === qs.length ? 'ok' : 'muted'}>{seen} attempted</Badge></div>
                </div>
                <Btn className="mt-3 self-start" onClick={() => startModule(m.id)}>Start quiz</Btn>
              </Card>
            </li>
          )
        })}
      </ul>
    </>
  )
}
