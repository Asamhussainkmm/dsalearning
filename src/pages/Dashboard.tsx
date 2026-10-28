import { Link } from 'react-router-dom'
import { ArrowRight, Flame, Target, Trophy } from 'lucide-react'
import { lessonById, lessonOrder, lessons, modules, mcqsOf } from '../content'
import { moduleProgress } from '../lib/progressOps'
import { computeStreak } from '../lib/storage'
import { percent } from '../lib/quiz'
import { useProgress } from '../state/ProgressContext'
import { Badge, Btn, Card, ProgressBar, PageHeader } from '../components/Ui'

export default function Dashboard() {
  const { p } = useProgress()
  const done = p.completedLessons.length
  const overall = percent(done, lessons.length)
  const streak = computeStreak(p.activityDays)
  const nextId = lessonOrder.find((id) => !p.completedLessons.includes(id)) ?? null
  const resumeId = p.lastLesson && lessonById.has(p.lastLesson) && !p.completedLessons.includes(p.lastLesson) ? p.lastLesson : nextId
  const resume = resumeId ? lessonById.get(resumeId) : undefined

  // Weak topics: modules where wrong answers outnumber right ones (at least 3 attempts).
  const weak = modules
    .map((m) => {
      const qs = mcqsOf(m.id)
      let c = 0, w = 0
      for (const q of qs) { const s = p.mcqSeen[q.id]; if (s) { c += s.correct; w += s.wrong } }
      return { m, c, w, total: c + w }
    })
    .filter((x) => x.total >= 3 && x.w / x.total > 0.35)
    .sort((a, b) => b.w / b.total - a.w / a.total)
    .slice(0, 3)

  const lastQuiz = p.quizHistory[0]
  const first = done === 0 && p.recent.length === 0

  return (
    <>
      <PageHeader title="Welcome back! 👋" subtitle="Data Structures & Algorithms in Java, explained in simple Tanglish, one small step at a time." />

      {first && (
        <Card className="mb-6 border-brand bg-brand-soft">
          <h2 className="text-lg font-bold text-brand">New here? Start in 3 steps</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
            <li>Open <strong>Java Basics (Module 0)</strong> if you have never programmed. Skip it if you already know loops and methods.</li>
            <li>Read each lesson, then click <strong>Try it</strong> on any code to run it yourself.</li>
            <li>Finish with the quick-check questions, then practise in <strong>Coding Practice</strong>.</li>
          </ol>
          <Link to="/learn/m0-l1" className="mt-3 inline-flex"><Btn>Start with Lesson 1 <ArrowRight size={16} aria-hidden /></Btn></Link>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="flex items-center gap-2 text-sm text-muted"><Target size={16} aria-hidden /> Course progress</p>
          <p className="mt-1 text-3xl font-extrabold">{overall}%</p>
          <ProgressBar value={overall} label="Overall course progress" />
          <p className="mt-1 text-xs text-muted">{done} of {lessons.length} lessons completed</p>
        </Card>
        <Card>
          <p className="flex items-center gap-2 text-sm text-muted"><Flame size={16} aria-hidden /> Study streak</p>
          <p className="mt-1 text-3xl font-extrabold">{streak} <span className="text-base font-semibold text-muted">day{streak === 1 ? '' : 's'}</span></p>
          <p className="mt-1 text-xs text-muted">{streak > 0 ? 'Nice! Study a little every day.' : 'Study today to start your streak.'}</p>
        </Card>
        <Card>
          <p className="flex items-center gap-2 text-sm text-muted"><Trophy size={16} aria-hidden /> Last quiz</p>
          {lastQuiz ? (
            <>
              <p className="mt-1 text-3xl font-extrabold">{lastQuiz.correct}/{lastQuiz.total}</p>
              <p className="mt-1 truncate text-xs text-muted">{lastQuiz.scope}</p>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted">No quiz taken yet.</p>
          )}
        </Card>
      </div>

      {resume && (
        <Card className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted">{done === 0 ? 'Start here' : 'Continue where you left off'}</p>
            <p className="text-lg font-semibold">{resume.title}</p>
            <p className="text-xs text-muted">{resume.minutes} min · {modules.find((m) => m.id === resume.moduleId)?.title}</p>
          </div>
          <Link to={`/learn/${resume.id}`}><Btn>{done === 0 ? 'Start' : 'Continue'} <ArrowRight size={16} aria-hidden /></Btn></Link>
        </Card>
      )}

      {weak.length > 0 && (
        <section className="mt-6" aria-labelledby="weak">
          <h2 id="weak" className="mb-2 text-lg font-semibold">Topics to revisit</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {weak.map(({ m, c, w }) => (
              <Card key={m.id}>
                <Badge tone="warn">{percent(c, c + w)}% correct</Badge>
                <p className="mt-2 font-semibold">{m.title}</p>
                <Link to={`/quizzes?module=${m.id}`} className="mt-2 inline-block text-sm font-semibold text-brand underline">Practice this topic</Link>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="mt-6" aria-labelledby="mods">
        <h2 id="mods" className="mb-2 text-lg font-semibold">Your modules</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {modules.map((m) => {
            const pct = moduleProgress(m.lessonIds, p.completedLessons)
            return (
              <Link key={m.id} to={`/learn#${m.id}`} className="block rounded-2xl border border-line bg-surface p-4 transition hover:border-brand">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{m.number}. {m.title}</p>
                  {m.beginnerPrep && <Badge tone="muted">Prep</Badge>}
                </div>
                <div className="mt-2"><ProgressBar value={pct} label={`${m.title} progress`} /></div>
                <p className="mt-1 text-xs text-muted">{pct}% · {m.lessonIds.length} lessons</p>
              </Link>
            )
          })}
        </div>
      </section>

      {p.recent.length > 0 && (
        <section className="mt-6" aria-labelledby="recent">
          <h2 id="recent" className="mb-2 text-lg font-semibold">Recent activity</h2>
          <ul className="space-y-1 text-sm">
            {p.recent.slice(0, 5).map((r, i) => <li key={i} className="rounded-lg bg-surface px-3 py-2">{r.text} <span className="text-xs text-muted">· {new Date(r.at).toLocaleDateString()}</span></li>)}
          </ul>
        </section>
      )}
    </>
  )
}
