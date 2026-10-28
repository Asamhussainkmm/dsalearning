import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ProgressState } from '../types'
import { dayKey, emptyProgress, loadProgress, saveProgress } from '../lib/storage'

interface Ctx {
  p: ProgressState
  update: (fn: (p: ProgressState) => ProgressState) => void
  replace: (p: ProgressState) => void
  reset: () => void
  touch: (text?: string) => void
}

const ProgressCtx = createContext<Ctx | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [p, setP] = useState<ProgressState>(() => loadProgress())

  useEffect(() => saveProgress(p), [p])

  // Theme: apply "dark" class according to the stored preference.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = p.settings.theme === 'dark' || (p.settings.theme === 'system' && mq.matches)
      document.documentElement.classList.toggle('dark', dark)
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [p.settings.theme])

  const update = useCallback((fn: (p: ProgressState) => ProgressState) => setP((cur) => fn(cur)), [])
  const replace = useCallback((n: ProgressState) => setP(n), [])
  const reset = useCallback(() => setP(emptyProgress()), [])
  const touch = useCallback((text?: string) => {
    setP((cur) => {
      const today = dayKey()
      const days = cur.activityDays.includes(today) ? cur.activityDays : [...cur.activityDays, today].slice(-400)
      const recent = text ? [{ at: Date.now(), text }, ...cur.recent].slice(0, 20) : cur.recent
      return { ...cur, activityDays: days, recent }
    })
  }, [])

  const value = useMemo(() => ({ p, update, replace, reset, touch }), [p, update, replace, reset, touch])
  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>
}

export function useProgress(): Ctx {
  const c = useContext(ProgressCtx)
  if (!c) throw new Error('useProgress must be used inside ProgressProvider')
  return c
}
