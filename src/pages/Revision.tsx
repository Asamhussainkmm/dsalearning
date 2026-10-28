import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Timer } from 'lucide-react'
import { definitions, syntaxReminders, commonMistakes } from '../content/revision'
import { mcqById, mcqs, moduleById } from '../content'
import type { Mcq } from '../types'
import { shuffle } from '../lib/quiz'
import { useProgress } from '../state/ProgressContext'
import { Btn, Card, PageHeader, Badge } from '../components/Ui'
import { CodeBlock } from '../components/CodeBlock'
import { QuizSession } from '../components/QuizSession'

function TimedQuiz({ onExit }: { onExit: () => void }) {
  const [qs] = useState<Mcq[]>(() => shuffle(mcqs).slice(0, 10))
  const [left, setLeft] = useState(600)
  const [over, setOver] = useState(false)
  const t = useRef<number | null>(null)
  useEffect(() => {
    t.current = window.setInterval(() => setLeft((s) => s - 1), 1000)
    return () => { if (t.current) clearInterval(t.current) }
  }, [])
  useEffect(() => { if (left <= 0) { setOver(true); if (t.current) clearInterval(t.current) } }, [left])
  if (over) return <Card><p className="font-semibold">Time is up!</p><p className="text-sm text-muted">Your answers so far were saved. Try again to beat the clock.</p><Btn className="mt-3" onClick={onExit}>Back</Btn></Card>
  return (
    <div>
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold" role="timer" aria-live="off"><Timer size={16} aria-hidden /> {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')} left</p>
      <QuizSession title="Timed practice (10 questions, 10 minutes)" questions={qs} onExit={onExit} />
    </div>
  )
}

export default function Revision() {
  const { p } = useProgress()
  const [mode, setMode] = useState<'home' | 'wrong' | 'timed'>('home')
  const wrongIds = Object.keys(p.wrongQuestions).filter((id) => mcqById.has(id))
  const wrong = wrongIds.map((id) => mcqById.get(id)!).filter(Boolean)
  const bookmarked = p.bookmarks

  if (mode === 'wrong') return (<><PageHeader title="Revise your mistakes" /><QuizSession title="Revision: previously missed questions" questions={shuffle(wrong)} onExit={() => setMode('home')} /></>)
  if (mode === 'timed') return (<><PageHeader title="Timed practice" /><TimedQuiz onExit={() => setMode('home')} /></>)

  return (
    <>
      <PageHeader title="Revision Centre" subtitle="Quick reminders, your weak questions and timed practice, all in one place." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Questions you missed</h2>
          <p className="mt-1 text-sm text-muted">{wrong.length === 0 ? 'Nothing here yet. Take a quiz and any wrong answers will appear for revision.' : `${wrong.length} question${wrong.length === 1 ? '' : 's'} to revisit. Answer correctly to remove them from this list.`}</p>
          <Btn className="mt-3" disabled={wrong.length === 0} onClick={() => setMode('wrong')}>Revise now</Btn>
        </Card>
        <Card>
          <h2 className="font-semibold">Timed practice</h2>
          <p className="mt-1 text-sm text-muted">10 random questions, 10 minutes. Good practice for the exam.</p>
          <Btn className="mt-3" onClick={() => setMode('timed')}>Start timer</Btn>
        </Card>
      </div>

      {bookmarked.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-semibold">Bookmarked lessons</h2>
          <ul className="flex flex-wrap gap-2">{bookmarked.map((id) => <li key={id}><Link className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm hover:border-brand" to={`/learn/${id}`}>{id}</Link></li>)}</ul>
        </section>
      )}

      <section className="mt-8" aria-labelledby="defs">
        <h2 id="defs" className="mb-2 text-lg font-semibold">Key definitions</h2>
        <dl className="grid gap-2 sm:grid-cols-2">
          {definitions.map((d) => (
            <div key={d.term} className="rounded-xl border border-line bg-surface p-3">
              <dt className="flex items-center justify-between gap-2 font-semibold text-brand">{d.term} <Badge tone="muted">M{d.moduleId.slice(1)}</Badge></dt>
              <dd className="text-sm">{d.meaning}</dd>
              <dd className="sr-only">{moduleById(d.moduleId)?.title}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-8" aria-labelledby="syn">
        <h2 id="syn" className="mb-2 text-lg font-semibold">Java syntax reminders</h2>
        <div className="grid gap-x-4 md:grid-cols-2">
          {syntaxReminders.map((s) => <CodeBlock key={s.title} code={s.code} caption={s.title} runnable={false} />)}
        </div>
      </section>

      <section className="mt-6" aria-labelledby="mis">
        <h2 id="mis" className="mb-2 text-lg font-semibold">Common mistakes</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">{commonMistakes.map((m) => <li key={m}>{m}</li>)}</ul>
      </section>
    </>
  )
}
