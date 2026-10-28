import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProgressProvider } from '../src/state/ProgressContext'
import { Layout } from '../src/components/Layout'
import Dashboard from '../src/pages/Dashboard'
import Learn from '../src/pages/Learn'
import Lesson from '../src/pages/Lesson'
import VisualLab from '../src/pages/VisualLab'
import Playground from '../src/pages/Playground'
import { PracticeDetail, PracticeList } from '../src/pages/Practice'
import Quizzes from '../src/pages/Quizzes'
import ShortAnswers from '../src/pages/ShortAnswers'
import Revision from '../src/pages/Revision'
import Progress from '../src/pages/Progress'
import Settings from '../src/pages/Settings'
import NotFound from '../src/pages/NotFound'
import { Viz } from '../src/components/viz/Viz'
import { exercises, lessons } from '../src/content'
import type { VizId } from '../src/types'

function render(path: string): string {
  return renderToString(
    <ProgressProvider>
      <MemoryRouter initialEntries={[path]}>
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
      </MemoryRouter>
    </ProgressProvider>,
  )
}

describe('every page renders without throwing', () => {
  for (const path of ['/', '/learn', '/visual-lab', '/practice', '/quizzes', '/short-answers', '/revision', '/progress', '/settings', '/nope']) {
    it(path, () => {
      const html = render(path)
      expect(html.length).toBeGreaterThan(500)
      expect(html).toContain('Asam Hussain')
      expect(html).toContain('https://asamhussain.com')
    })
  }
  it('/playground (Monaco is lazy, so the SSR output is only the shell)', () => {
    expect(render('/playground')).toContain('Java Playground')
  })
  it('renders every lesson', () => {
    for (const l of lessons) expect(render(`/learn/${l.id}`), l.id).toContain(l.title.slice(0, 10).replace(/&/g, '&amp;'))
  })
  it('renders every exercise page', () => {
    for (const e of exercises) expect(render(`/practice/${e.id}`), e.id).toContain('Custom input')
  })
  it('shows the not-found page for an unknown lesson', () => {
    expect(render('/learn/does-not-exist')).toContain('Page not found')
  })
  it('renders every visualization', () => {
    const ids: VizId[] = ['array', 'array2d', 'linearSearch', 'binarySearch', 'bubbleSort', 'selectionSort', 'insertionSort', 'stack', 'queue', 'circularQueue', 'linkedList', 'bst', 'bigO']
    for (const id of ids) expect(renderToString(<Viz id={id} />).length, id).toBeGreaterThan(200)
  })
})
