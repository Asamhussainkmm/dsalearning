import { useId, useMemo, useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import type { Mcq } from '../types'
import { answerKey } from '../content'
import { shuffleOptions } from '../lib/quiz'
import { Btn, Markup } from './Ui'

interface Props {
  q: Mcq
  /** Called once, when the student checks an answer. `chosen` is the ORIGINAL option index. */
  onAnswer?: (correct: boolean, chosen: number) => void
  shuffle?: boolean
  initialChosen?: number
  footer?: React.ReactNode
}

const letters = ['A', 'B', 'C', 'D']

export function McqCard({ q, onAnswer, shuffle = true, initialChosen, footer }: Props) {
  const order = useMemo(() => (shuffle ? shuffleOptions(q.options.length) : q.options.map((_, i) => i)), [q.id, shuffle]) // eslint-disable-line react-hooks/exhaustive-deps
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(initialChosen !== undefined)
  const [chosen, setChosen] = useState<number | null>(initialChosen ?? null)
  const gid = useId()
  const correctIdx = answerKey[q.id]

  const check = () => {
    if (picked === null) return
    setChosen(picked)
    setChecked(true)
    onAnswer?.(picked === correctIdx, picked)
  }
  const isCorrect = chosen === correctIdx

  return (
    <fieldset className="rounded-2xl border border-line bg-surface p-5">
      <legend className="sr-only">Multiple choice question</legend>
      <p id={`${gid}-q`} className="mb-4 whitespace-pre-wrap font-medium leading-7">{q.question}</p>
      <div role="radiogroup" aria-labelledby={`${gid}-q`} className="space-y-2">
        {order.map((orig, di) => {
          const sel = (checked ? chosen : picked) === orig
          const showRight = checked && orig === correctIdx
          const showWrong = checked && sel && orig !== correctIdx
          return (
            <label
              key={orig}
              className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border-2 p-3 text-sm transition ${
                showRight ? 'border-ok bg-ok-soft' : showWrong ? 'border-bad bg-bad-soft' : sel ? 'border-brand bg-brand-soft' : 'border-line hover:bg-surface2'
              } ${checked ? 'cursor-default' : ''}`}
            >
              <input
                type="radio" name={gid} className="mt-1 h-4 w-4 accent-[var(--c-brand)]"
                checked={sel} disabled={checked} onChange={() => setPicked(orig)}
              />
              <span className="font-semibold">{letters[di]}.</span>
              <span className="flex-1 whitespace-pre-wrap">{q.options[orig]}</span>
              {showRight && <span className="flex items-center gap-1 font-semibold text-ok"><CheckCircle2 size={16} aria-hidden /> Correct</span>}
              {showWrong && <span className="flex items-center gap-1 font-semibold text-bad"><XCircle size={16} aria-hidden /> Your answer</span>}
            </label>
          )
        })}
      </div>
      {!checked ? (
        <div className="mt-4"><Btn onClick={check} disabled={picked === null}>Check answer</Btn></div>
      ) : (
        <div role="status" aria-live="polite" className={`mt-4 rounded-xl p-4 text-sm ${isCorrect ? 'bg-ok-soft' : 'bg-warn-soft'}`}>
          <p className="mb-1 font-semibold">{isCorrect ? 'Correct! 🎉' : 'Not quite. Let us understand why.'}</p>
          <Markup text={q.tanglish} />
          <p className="mt-1 text-muted"><span className="font-semibold">In English:</span> {q.why}</p>
        </div>
      )}
      {checked && footer && <div className="mt-4">{footer}</div>}
    </fieldset>
  )
}
