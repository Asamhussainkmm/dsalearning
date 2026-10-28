import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Bookmark, BookmarkCheck, CheckCircle2, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { exercisesOf, lessonById, lessonOrder, mcqsOf, moduleById } from '../content'
import { completeLesson, setLastLesson, toggleBookmark, uncompleteLesson } from '../lib/progressOps'
import { useProgress } from '../state/ProgressContext'
import { LessonRenderer } from '../components/LessonRenderer'
import { Badge, Btn, Card } from '../components/Ui'
import NotFound from './NotFound'

export default function Lesson() {
  const { lessonId = '' } = useParams()
  const { p, update } = useProgress()
  const lesson = lessonById.get(lessonId)

  useEffect(() => {
    if (lesson) update((s) => setLastLesson(s, lesson.id))
  }, [lesson, update])

  if (!lesson) return <NotFound />
  const mod = moduleById(lesson.moduleId)
  const idx = lessonOrder.indexOf(lesson.id)
  const prev = idx > 0 ? lessonById.get(lessonOrder[idx - 1]) : undefined
  const next = idx < lessonOrder.length - 1 ? lessonById.get(lessonOrder[idx + 1]) : undefined
  const done = p.completedLessons.includes(lesson.id)
  const marked = p.bookmarks.includes(lesson.id)
  const lastInModule = mod?.lessonIds[mod.lessonIds.length - 1] === lesson.id

  return (
    <article>
      <nav aria-label="Breadcrumb" className="mb-2 text-sm text-muted">
        <Link to="/learn" className="underline">Learn</Link> / <Link to={`/learn#${lesson.moduleId}`} className="underline">{mod?.title}</Link>
      </nav>
      <header className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{lesson.title}</h1>
          <Btn variant="ghost" onClick={() => update((s) => toggleBookmark(s, lesson.id))} aria-pressed={marked}>
            {marked ? <BookmarkCheck size={16} aria-hidden /> : <Bookmark size={16} aria-hidden />} {marked ? 'Bookmarked' : 'Bookmark'}
          </Btn>
        </div>
        <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
          <Clock size={14} aria-hidden /> {lesson.minutes} min {done && <Badge tone="ok">Completed</Badge>}
        </p>
        <Card className="mt-4">
          <p className="mb-1 text-sm font-semibold">In this lesson you will learn to</p>
          <ul className="list-disc space-y-0.5 pl-5 text-sm">{lesson.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
        </Card>
      </header>

      <LessonRenderer blocks={lesson.blocks} />

      <Card className="mt-8 border-brand">
        <h2 className="text-lg font-semibold">Summary (recap)</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{lesson.summary.map((s) => <li key={s}>{s}</li>)}</ul>
        {lesson.source && <p className="mt-3 text-xs text-muted">Source: {lesson.source}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          {done ? (
            <Btn variant="ghost" onClick={() => update((s) => uncompleteLesson(s, lesson.id))}>Mark as not completed</Btn>
          ) : (
            <Btn onClick={() => update((s) => completeLesson(s, lesson.id, lesson.title))}><CheckCircle2 size={16} aria-hidden /> Mark lesson complete</Btn>
          )}
        </div>
      </Card>

      {lastInModule && mod && (
        <Card className="mt-4 bg-brand-soft">
          <h2 className="text-lg font-semibold">You finished “{mod.title}” 🎉</h2>
          <p className="mt-1 text-sm">Test yourself before moving on.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to={`/quizzes?module=${mod.id}`}><Btn>Take the {mcqsOf(mod.id).length}-question mastery quiz</Btn></Link>
            <Link to="/short-answers" state={{ module: mod.id }}><Btn variant="ghost">Short answers</Btn></Link>
            {exercisesOf(mod.id).length > 0 && <Link to={`/practice?module=${mod.id}`}><Btn variant="ghost">Coding exercises ({exercisesOf(mod.id).length})</Btn></Link>}
          </div>
        </Card>
      )}

      <nav aria-label="Lesson navigation" className="mt-6 flex justify-between gap-3">
        {prev ? <Link to={`/learn/${prev.id}`} className="flex-1"><Btn variant="ghost" className="w-full justify-start"><ChevronLeft size={16} aria-hidden /> <span className="truncate">{prev.title}</span></Btn></Link> : <span className="flex-1" />}
        {next ? <Link to={`/learn/${next.id}`} className="flex-1"><Btn className="w-full justify-end"><span className="truncate">{next.title}</span> <ChevronRight size={16} aria-hidden /></Btn></Link> : <span className="flex-1" />}
      </nav>
    </article>
  )
}
