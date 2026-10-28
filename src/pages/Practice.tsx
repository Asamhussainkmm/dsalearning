import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CheckCircle2, ChevronLeft } from 'lucide-react'
import { exerciseById, exercises, modules, moduleById } from '../content'
import { useProgress } from '../state/ProgressContext'
import { Badge, Card, PageHeader } from '../components/Ui'
import { ExerciseRunner } from '../components/ExerciseRunner'
import NotFound from './NotFound'

const tone = { Beginner: 'ok', Easy: 'brand', Intermediate: 'warn', Challenge: 'bad' } as const

export function PracticeList() {
  const { p } = useProgress()
  const [sp, setSp] = useSearchParams()
  const mod = sp.get('module') ?? 'all'
  const list = exercises.filter((e) => mod === 'all' || e.moduleId === mod)
  const solved = exercises.filter((e) => p.completedExercises.includes(e.id)).length
  return (
    <>
      <PageHeader title="Coding Practice" subtitle={`Write real Java programs and test them. ${solved} of ${exercises.length} solved.`} />
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="mod" className="text-sm font-medium">Topic</label>
        <select id="mod" value={mod} onChange={(e) => setSp(e.target.value === 'all' ? {} : { module: e.target.value })} className="min-h-10 rounded-lg border border-line bg-surface px-3 text-sm">
          <option value="all">All topics</option>
          {modules.filter((m) => exercises.some((e) => e.moduleId === m.id)).map((m) => <option key={m.id} value={m.id}>{m.number}. {m.title}</option>)}
        </select>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {list.map((e) => {
          const done = p.completedExercises.includes(e.id)
          return (
            <li key={e.id}>
              <Link to={`/practice/${e.id}`} className="block h-full rounded-2xl border border-line bg-surface p-4 transition hover:border-brand">
                <div className="flex items-center justify-between gap-2">
                  <Badge tone={tone[e.difficulty]}>{e.difficulty}</Badge>
                  {done && <span className="flex items-center gap-1 text-xs font-semibold text-ok"><CheckCircle2 size={14} aria-hidden /> Solved</span>}
                </div>
                <p className="mt-2 font-semibold">{e.title}</p>
                <p className="text-xs text-muted">{moduleById(e.moduleId)?.title}</p>
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export function PracticeDetail() {
  const { id = '' } = useParams()
  const ex = exerciseById.get(id)
  if (!ex) return <NotFound />
  return (
    <>
      <Link to={`/practice?module=${ex.moduleId}`} className="mb-3 inline-flex items-center gap-1 text-sm text-muted underline"><ChevronLeft size={14} aria-hidden /> All exercises</Link>
      <h1 className="mb-4 text-2xl font-bold">{ex.title}</h1>
      <ExerciseRunner key={ex.id} ex={ex} />
      <Card className="mt-6 text-sm text-muted">Programs run on a remote Java service. If it is busy or offline you will see a clear message and nothing is graded.</Card>
    </>
  )
}
