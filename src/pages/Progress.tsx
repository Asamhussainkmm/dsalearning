import { exercises, lessons, mcqs, mcqsOf, modules, shortAnswers } from '../content'
import { moduleProgress } from '../lib/progressOps'
import { percent } from '../lib/quiz'
import { computeStreak } from '../lib/storage'
import { useProgress } from '../state/ProgressContext'
import { Card, PageHeader, ProgressBar } from '../components/Ui'

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-extrabold">{value}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </Card>
  )
}

export default function Progress() {
  const { p } = useProgress()
  const attempts = Object.values(p.mcqSeen).reduce((a, s) => a + s.correct + s.wrong, 0)
  const right = Object.values(p.mcqSeen).reduce((a, s) => a + s.correct, 0)
  const sa = Object.values(p.shortAnswerBest)
  return (
    <>
      <PageHeader title="Your Progress" subtitle="Everything is stored in this browser only. Export it from Settings to keep a backup." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Lessons" value={`${p.completedLessons.length} / ${lessons.length}`} sub={`${percent(p.completedLessons.length, lessons.length)}% complete`} />
        <Stat label="Exercises solved" value={`${p.completedExercises.length} / ${exercises.length}`} />
        <Stat label="MCQ accuracy" value={attempts ? `${percent(right, attempts)}%` : '–'} sub={`${attempts} answers · ${Object.keys(p.mcqSeen).length}/${mcqs.length} questions seen`} />
        <Stat label="Streak" value={`${computeStreak(p.activityDays)} days`} sub={`${p.activityDays.length} study days in total`} />
      </div>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Progress by module</h2>
      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <caption className="sr-only">Progress by module</caption>
          <thead className="bg-surface2"><tr><th scope="col" className="px-3 py-2">Module</th><th scope="col" className="px-3 py-2">Lessons</th><th scope="col" className="px-3 py-2">MCQ accuracy</th><th scope="col" className="px-3 py-2">Exercises</th></tr></thead>
          <tbody>
            {modules.map((m) => {
              const qs = mcqsOf(m.id)
              let c = 0, w = 0
              qs.forEach((q) => { const s = p.mcqSeen[q.id]; if (s) { c += s.correct; w += s.wrong } })
              const ex = exercises.filter((e) => e.moduleId === m.id)
              const exDone = ex.filter((e) => p.completedExercises.includes(e.id)).length
              const pct = moduleProgress(m.lessonIds, p.completedLessons)
              return (
                <tr key={m.id} className="border-t border-line align-top">
                  <th scope="row" className="px-3 py-2 font-medium">{m.number}. {m.title}</th>
                  <td className="px-3 py-2"><ProgressBar value={pct} label={`${m.title} lessons`} /><span className="text-xs text-muted">{pct}%</span></td>
                  <td className="px-3 py-2">{c + w ? `${percent(c, c + w)}%` : '–'}</td>
                  <td className="px-3 py-2">{ex.length ? `${exDone}/${ex.length}` : '–'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section>
          <h2 className="mb-2 text-lg font-semibold">Quiz history</h2>
          {p.quizHistory.length === 0 ? <p className="text-sm text-muted">No quizzes yet.</p> : (
            <ul className="space-y-1 text-sm">
              {p.quizHistory.slice(0, 10).map((h, i) => (
                <li key={i} className="flex justify-between gap-2 rounded-lg bg-surface px-3 py-2"><span className="truncate">{h.scope}</span><span className="shrink-0 font-semibold">{h.correct}/{h.total} · {new Date(h.at).toLocaleDateString()}</span></li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold">Short answers</h2>
          <p className="text-sm text-muted">{sa.length} of {shortAnswers.length} attempted{sa.length ? ` · average best score ${(sa.reduce((a, b) => a + b, 0) / sa.length).toFixed(1)}/5` : ''}</p>
        </section>
      </div>
    </>
  )
}
