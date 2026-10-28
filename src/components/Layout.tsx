import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  BarChart3, BookOpen, Braces, Code2, FileQuestion, Home, Menu, Moon, PenLine, RefreshCcw, Settings, Sun, Telescope, X,
} from 'lucide-react'
import { useProgress } from '../state/ProgressContext'

const nav = [
  { to: '/', label: 'Dashboard', icon: Home, end: true },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/visual-lab', label: 'Visual Lab', icon: Telescope },
  { to: '/playground', label: 'Java Playground', icon: Braces },
  { to: '/practice', label: 'Coding Practice', icon: Code2 },
  { to: '/quizzes', label: 'MCQ Quizzes', icon: FileQuestion },
  { to: '/short-answers', label: 'Short Answers', icon: PenLine },
  { to: '/revision', label: 'Revision Centre', icon: RefreshCcw },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Main">
      <ul className="space-y-1">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to} end={end} onClick={onNavigate}
              className={({ isActive }) =>
                `flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-brand text-brand-ink' : 'text-ink hover:bg-surface2'}`
              }
            >
              <Icon size={18} aria-hidden /> {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function Layout() {
  const { update } = useProgress()
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    setOpen(false)
    document.getElementById('main')?.focus({ preventScroll: true })
    window.scrollTo({ top: 0 })
  }, [loc.pathname])

  const [dark, setDark] = useState(false)
  // The provider toggles the 'dark' class on <html>; mirror it so the button label is always right.
  useEffect(() => {
    const root = document.documentElement
    const read = () => setDark(root.classList.contains('dark'))
    read()
    const mo = new MutationObserver(read)
    mo.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])
  const toggleTheme = () => update((s) => ({ ...s, settings: { ...s.settings, theme: dark ? 'light' : 'dark' } }))

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <a href="#main" className="skip-link">Skip to main content</a>

      <aside className="hidden border-r border-line bg-surface p-4 lg:block">
        <div className="sticky top-4 flex max-h-[calc(100vh-2rem)] flex-col gap-4 overflow-y-auto">
          <Brand />
          <NavList />
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-line bg-surface/90 px-4 py-2 backdrop-blur lg:px-8">
          <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl hover:bg-surface2 lg:hidden" aria-label="Open menu" aria-expanded={open}>
            <Menu aria-hidden />
          </button>
          <span className="text-sm font-semibold lg:hidden">DSA Learning Lab</span>
          <span className="hidden text-sm text-muted lg:block">HNDIT · Data Structures &amp; Algorithms with Java</span>
          <button type="button" onClick={toggleTheme} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl hover:bg-surface2" aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
            {dark ? <Sun aria-hidden /> : <Moon aria-hidden />}
          </button>
        </header>

        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 outline-none lg:px-8 lg:py-8">
          <Outlet />
        </main>

        <footer className="border-t border-line px-4 py-5 text-center text-sm text-muted">
          Powered by <a href="https://asamhussain.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline underline-offset-2">Asam Hussain</a>
        </footer>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-label="Close menu" />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto bg-surface p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <Brand />
              <button type="button" onClick={() => setOpen(false)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl hover:bg-surface2" aria-label="Close menu"><X aria-hidden /></button>
            </div>
            <NavList onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-2 px-1">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-ink" aria-hidden><Braces size={20} /></span>
      <div className="leading-tight">
        <p className="text-sm font-bold">DSA Learning Lab</p>
        <p className="text-xs text-muted">Java · Tanglish</p>
      </div>
    </div>
  )
}
