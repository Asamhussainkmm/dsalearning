import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react'
import { Btn } from '../Ui'
import {
  binarySearchFrames, bubbleSortFrames, insertionSortFrames, linearSearchFrames, selectionSortFrames,
  type Frame, type Mark,
} from '../../lib/algos'

export type PlayerKind = 'linearSearch' | 'binarySearch' | 'bubbleSort' | 'selectionSort' | 'insertionSort'

const SEARCH = new Set<PlayerKind>(['linearSearch', 'binarySearch'])
const DEFAULTS: Record<PlayerKind, string> = {
  linearSearch: '12, 7, 25, 3, 19, 30',
  binarySearch: '10, 15, 25, 30, 33, 34, 36',
  bubbleSort: '6, 7, 72, 4, 32, 65, 9, 56',
  selectionSort: '65, 20, 40, 6, 15',
  insertionSort: '9, 5, 1, 4, 3',
}
const TITLES: Record<PlayerKind, string> = {
  linearSearch: 'Linear search', binarySearch: 'Binary search', bubbleSort: 'Bubble sort', selectionSort: 'Selection sort', insertionSort: 'Insertion sort',
}

const markStyle: Record<Mark, string> = {
  compare: 'border-amber-500 bg-warn-soft text-warn',
  swap: 'border-rose-500 bg-bad-soft text-bad',
  found: 'border-green-600 bg-ok-soft text-ok',
  sorted: 'border-green-600/60 bg-ok-soft text-ok',
  range: 'border-brand bg-brand-soft text-brand',
  key: 'border-violet-500 bg-brand-soft text-brand',
  min: 'border-sky-500 bg-brand-soft text-brand',
}
const markLabel: Record<Mark, string> = {
  compare: 'comparing', swap: 'swapping', found: 'found', sorted: 'sorted', range: 'in range', key: 'key', min: 'smallest so far',
}

export function parseNumbers(text: string, max = 12): number[] | null {
  const parts = text.split(/[\s,]+/).filter(Boolean)
  if (parts.length === 0 || parts.length > max) return null
  const nums = parts.map((p) => Number(p))
  return nums.every((n) => Number.isInteger(n) && Math.abs(n) <= 999) ? nums : null
}

function build(kind: PlayerKind, arr: number[], target: number): Frame[] {
  switch (kind) {
    case 'linearSearch': return linearSearchFrames(arr, target)
    case 'binarySearch': return binarySearchFrames([...arr].sort((a, b) => a - b), target)
    case 'bubbleSort': return bubbleSortFrames(arr)
    case 'selectionSort': return selectionSortFrames(arr)
    case 'insertionSort': return insertionSortFrames(arr)
  }
}

export function SortPlayer({ kind }: { kind: PlayerKind }) {
  const [text, setText] = useState(DEFAULTS[kind])
  const [targetText, setTargetText] = useState(kind === 'binarySearch' ? '25' : '3')
  const [error, setError] = useState('')
  const [applied, setApplied] = useState<{ arr: number[]; target: number }>({
    arr: parseNumbers(DEFAULTS[kind])!, target: kind === 'binarySearch' ? 25 : 3,
  })
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(900)
  const timer = useRef<number | null>(null)

  const frames = useMemo(() => build(kind, applied.arr, applied.target), [kind, applied])
  const frame = frames[Math.min(step, frames.length - 1)]
  const last = step >= frames.length - 1
  const isSearch = SEARCH.has(kind)

  useEffect(() => {
    if (!playing) return
    if (last) { setPlaying(false); return }
    timer.current = window.setTimeout(() => setStep((s) => s + 1), speed)
    return () => { if (timer.current) window.clearTimeout(timer.current) }
  }, [playing, step, last, speed])

  const apply = () => {
    const arr = parseNumbers(text)
    if (!arr) { setError('Enter 1 to 12 whole numbers (each between -999 and 999), separated by commas or spaces.'); return }
    const t = Number(targetText)
    if (isSearch && !Number.isInteger(t)) { setError('The search target must be a whole number.'); return }
    setError('')
    setApplied({ arr, target: isSearch ? t : 0 })
    setStep(0)
    setPlaying(false)
  }

  const maxV = Math.max(...frame.arr.map((v) => Math.abs(v)), 1)
  const showBars = !isSearch

  return (
    <section aria-label={`${TITLES[kind]} visualization`} className="rounded-2xl border border-line bg-surface p-4">
      <h3 className="text-base font-semibold">{TITLES[kind]} – step by step</h3>
      <form className="mt-3 flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); apply() }}>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Numbers</span>
          <input value={text} onChange={(e) => setText(e.target.value)} className="min-h-10 w-64 max-w-full rounded-lg border border-line bg-bg px-3 py-1.5" />
        </label>
        {isSearch && (
          <label className="text-sm">
            <span className="mb-1 block font-medium">Target</span>
            <input value={targetText} onChange={(e) => setTargetText(e.target.value)} inputMode="numeric" className="min-h-10 w-24 rounded-lg border border-line bg-bg px-3 py-1.5" />
          </label>
        )}
        <Btn type="submit" variant="soft">Apply</Btn>
      </form>
      {kind === 'binarySearch' && <p className="mt-1 text-xs text-muted">Binary search needs sorted data, so your numbers are sorted first.</p>}
      {error && <p role="alert" className="mt-2 text-sm font-medium text-bad">{error}</p>}

      <div className="mt-5 overflow-x-auto pb-2">
        <div className="flex min-w-max items-end justify-center gap-2" role="list" aria-label="Array values">
          {frame.arr.map((v, i) => {
            const mk = frame.marks[i]
            const ptr = Object.entries(frame.pointers ?? {}).filter(([, idx]) => idx === i).map(([n]) => n)
            return (
              <div key={i} role="listitem" className="flex flex-col items-center gap-1" aria-label={`index ${i} value ${v}${mk ? `, ${markLabel[mk]}` : ''}`}>
                {showBars && (
                  <div className={`cell w-10 rounded-t-md border-2 ${mk ? markStyle[mk] : 'border-line bg-surface2'}`} style={{ height: `${24 + (Math.abs(v) / maxV) * 90}px` }} />
                )}
                <div className={`cell flex h-11 w-11 items-center justify-center rounded-lg border-2 text-sm font-bold ${mk ? markStyle[mk] : 'border-line bg-surface2'}`}>{v}</div>
                <span className="text-[11px] text-muted">{i}</span>
                <span className="h-4 text-[11px] font-semibold text-brand">{ptr.join(' ')}</span>
                <span className="h-3 text-[10px] text-muted">{mk ? markLabel[mk] : ''}</span>
              </div>
            )
          })}
        </div>
      </div>

      <p className="mt-3 min-h-12 rounded-xl bg-surface2 p-3 text-sm" role="status" aria-live="polite">{frame.msg}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Btn variant="ghost" onClick={() => { setStep((s) => Math.max(0, s - 1)); setPlaying(false) }} disabled={step === 0} aria-label="Previous step"><ChevronLeft size={16} aria-hidden /> Prev</Btn>
        <Btn onClick={() => { if (last) setStep(0); setPlaying((p) => !p) }} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <><Pause size={16} aria-hidden /> Pause</> : <><Play size={16} aria-hidden /> {last ? 'Replay' : 'Play'}</>}
        </Btn>
        <Btn variant="ghost" onClick={() => { setStep((s) => Math.min(frames.length - 1, s + 1)); setPlaying(false) }} disabled={last} aria-label="Next step">Next <ChevronRight size={16} aria-hidden /></Btn>
        <Btn variant="ghost" onClick={() => { setStep(0); setPlaying(false) }} aria-label="Reset"><RotateCcw size={16} aria-hidden /> Reset</Btn>
        <label className="ml-auto flex items-center gap-2 text-sm">
          Speed
          <input type="range" min={200} max={1600} step={100} value={1800 - speed} onChange={(e) => setSpeed(1800 - Number(e.target.value))} aria-label="Animation speed" />
        </label>
        <span className="text-xs text-muted">Step {Math.min(step + 1, frames.length)} / {frames.length}</span>
      </div>
      <Legend />
    </section>
  )
}

function Legend() {
  const used: Mark[] = ['compare', 'swap', 'range', 'min', 'key', 'sorted', 'found']
  return (
    <ul className="mt-3 flex flex-wrap gap-2 text-[11px]" aria-label="Colour legend (each colour is also written as a label)">
      {used.map((m) => (
        <li key={m} className={`rounded-md border px-2 py-0.5 ${markStyle[m]}`}>{markLabel[m]}</li>
      ))}
    </ul>
  )
}
