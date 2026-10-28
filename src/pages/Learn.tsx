import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle2, Circle, Clock } from 'lucide-react'
import { lessonsOf, modules, moduleById } from '../content'
import { moduleProgress } from '../lib/progressOps'
import { useProgress } from '../state/ProgressContext'
import { Badge, Card, PageHeader, ProgressBar, Markup } from '../components/Ui'

export default function Learn() {
  const { p } = useProgress()
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])

  return (
    <>
      <PageHeader title="Learn" subtitle="Follow the modules in order. Each lesson takes 10 to 25 minutes. Green ticks show what you have finished." />
      <div className="space-y-6">
        {modules.map((m) => {
          const pct = moduleProgress(m.lessonIds, p.completedLessons)
          const pre = m.prerequisites.map((id) => moduleById(id)?.title).filter(Boolean)
          return (
            <section key={m.id} id={m.id} aria-labelledby={`${m.id}-h`} className="scroll-mt-20">
              <Card>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 id={`${m.id}-h`} className="text-xl font-bold">Module {m.number}: {m.title}</h2>
                  {m.beginnerPrep && <Badge tone="warn">Beginner prep (extra, not from the lecture notes)</Badge>}
                </div>
                <Markup text={m.tanglish} className="mt-2 text-sm" />
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
                  <span className="inline-flex items-center gap-1"><Clock size={14} aria-hidden /> about {m.minutes} min</span>
                  {pre.length > 0 && <span>Before this: {pre.join(', ')}</span>}
                </div>
                <p className="mt-1 text-xs text-muted">Based on: {m.sources.join(' · ')}</p>
                <div className="mt-3"><ProgressBar value={pct} label={`${m.title} progress`} /></div>
                <ul className="mt-4 divide-y divide-line">
                  {lessonsOf(m.id).map((l) => {
                    const done = p.completedLessons.includes(l.id)
                    return (
                      <li key={l.id}>
                        <Link to={`/learn/${l.id}`} className="flex min-h-12 items-center gap-3 py-2 hover:text-brand">
                          {done ? <CheckCircle2 className="text-ok" size={20} aria-label="Completed" /> : <Circle className="text-muted" size={20} aria-label="Not completed" />}
                          <span className="flex-1 font-medium">{l.title}</span>
                          <span className="text-xs text-muted">{l.minutes} min</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </Card>
            </section>
          )
        })}
      </div>
    </>
  )
}
