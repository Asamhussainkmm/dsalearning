import { lazy, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProgressProvider } from './state/ProgressContext'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'

const Learn = lazy(() => import('./pages/Learn'))
const Lesson = lazy(() => import('./pages/Lesson'))
const VisualLab = lazy(() => import('./pages/VisualLab'))
const Playground = lazy(() => import('./pages/Playground'))
const PracticeList = lazy(() => import('./pages/Practice').then((m) => ({ default: m.PracticeList })))
const PracticeDetail = lazy(() => import('./pages/Practice').then((m) => ({ default: m.PracticeDetail })))
const Quizzes = lazy(() => import('./pages/Quizzes'))
const ShortAnswers = lazy(() => import('./pages/ShortAnswers'))
const Revision = lazy(() => import('./pages/Revision'))
const Progress = lazy(() => import('./pages/Progress'))
const Settings = lazy(() => import('./pages/Settings'))

const Loading = () => <p className="p-6 text-muted" role="status">Loading…</p>

/** HashRouter keeps every URL working on GitHub Pages (no server-side rewrites needed). */
export default function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="learn" element={<Learn />} />
              <Route path="learn/:lessonId" element={<Lesson />} />
              <Route path="visual-lab" element={<VisualLab />} />
              <Route path="playground" element={<Playground />} />
              <Route path="practice" element={<PracticeList />} />
              <Route path="practice/:id" element={<PracticeDetail />} />
              <Route path="quizzes" element={<Quizzes />} />
              <Route path="short-answers" element={<ShortAnswers />} />
              <Route path="revision" element={<Revision />} />
              <Route path="progress" element={<Progress />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </ProgressProvider>
  )
}
