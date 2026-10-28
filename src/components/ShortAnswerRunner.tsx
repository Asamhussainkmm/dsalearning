import { useState } from 'react'
import { Bot, ListChecks } from 'lucide-react'
import type { ShortAnswerQ } from '../types'
import { aiConfigured, evaluateWithAi, type AiResult } from '../lib/ai'
import { evaluateLocally, type LocalEval } from '../lib/shortAnswer'
import { recordShortAnswer } from '../lib/progressOps'
import { useProgress } from '../state/ProgressContext'
import { Badge, Btn, Markup } from './Ui'

const MAX = 1500

export function ShortAnswerRunner({ q }: { q: ShortAnswerQ }) {
  const { p, update } = useProgress()
  const [answer, setAnswer] = useState('')
  const [busy, setBusy] = useState(false)
  const [local, setLocal] = useState<LocalEval | null>(null)
  const [ai, setAi] = useState<AiResult | null>(null)
  const [notice, setNotice] = useState('')
  const [showRef, setShowRef] = useState(false)
  const best = p.shortAnswerBest[q.id]
  const tooShort = answer.trim().length < 15

  const keywordCheck = () => {
    const r = evaluateLocally(q, answer)
    setLocal(r)
    setAi(null)
    setNotice('')
    update((s) => recordShortAnswer(s, q.id, r.score))
  }

  const aiCheck = async () => {
    setBusy(true)
    setNotice('')
    setAi(null)
    const r = await evaluateWithAi(q, answer)
    setBusy(false)
    if (r.ok) {
      setAi(r.result)
      setLocal(null)
      update((s) => recordShortAnswer(s, q.id, r.result.score))
    } else {
      setNotice(r.message)
      const l = evaluateLocally(q, answer)
      setLocal(l)
      update((s) => recordShortAnswer(s, q.id, l.score))
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-medium leading-7">{q.question}</p>
        {best !== undefined && <Badge tone={best >= 4 ? 'ok' : best >= 2 ? 'warn' : 'muted'}>Best: {best}/5</Badge>}
      </div>
      <label className="mt-3 block text-sm font-medium" htmlFor={`sa-${q.id}`}>Your answer (write in English)</label>
      <textarea
        id={`sa-${q.id}`} value={answer} maxLength={MAX} rows={5}
        onChange={(e) => setAnswer(e.target.value)}
        className="mt-1 w-full rounded-xl border border-line bg-bg p-3 text-sm"
        placeholder="Explain in your own words. 2 to 4 sentences is enough."
      />
      <div className="mt-1 flex justify-between text-xs text-muted"><span>{tooShort ? 'Write at least a short sentence first.' : ''}</span><span>{answer.length}/{MAX}</span></div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Btn variant="ghost" onClick={keywordCheck} disabled={tooShort || busy}><ListChecks size={16} aria-hidden /> Keyword check</Btn>
        {aiConfigured() && (
          <Btn onClick={aiCheck} disabled={tooShort || busy}><Bot size={16} aria-hidden /> {busy ? 'Evaluating…' : 'Evaluate with AI'}</Btn>
        )}
        <Btn variant="ghost" onClick={() => setShowRef((s) => !s)} aria-expanded={showRef}>{showRef ? 'Hide' : 'Show'} model answer</Btn>
      </div>
      {!aiConfigured() && (
        <p className="mt-2 text-xs text-muted">AI feedback is not enabled in this build, so answers are checked with the built-in keyword check. It looks for key ideas, not for meaning, so compare with the model answer too.</p>
      )}

      {notice && <p role="status" className="mt-3 rounded-xl bg-warn-soft p-3 text-sm text-warn">{notice}</p>}

      {local && (
        <div role="status" aria-live="polite" className="mt-3 rounded-xl bg-surface2 p-4 text-sm">
          <p className="font-semibold">Keyword check: {local.score} / {local.maxScore}</p>
          {local.covered.length > 0 && <p className="mt-1"><span className="font-medium text-ok">Covered:</span> {local.covered.join(', ')}</p>}
          {local.missing.length > 0 && <p className="mt-1"><span className="font-medium text-bad">Missing ideas:</span> {local.missing.join(', ')}</p>}
          <p className="mt-2 text-xs text-muted">This is an automatic keyword match. A low score can also mean you used different words. Read the model answer to be sure.</p>
        </div>
      )}

      {ai && (
        <div role="status" aria-live="polite" className="mt-3 space-y-2 rounded-xl bg-surface2 p-4 text-sm">
          <p className="font-semibold">AI feedback: {ai.score} / 5 <Badge tone={ai.verdict === 'correct' ? 'ok' : ai.verdict === 'partial' ? 'warn' : 'bad'}>{ai.verdict}</Badge></p>
          <Markup text={ai.feedbackTanglish} />
          {ai.strengths.length > 0 && <div><p className="font-medium text-ok">Good points</p><ul className="list-disc pl-5">{ai.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></div>}
          {ai.missingConcepts.length > 0 && <div><p className="font-medium text-bad">Missing</p><ul className="list-disc pl-5">{ai.missingConcepts.map((s, i) => <li key={i}>{s}</li>)}</ul></div>}
          {ai.misconceptions.length > 0 && <div><p className="font-medium text-warn">Misconceptions</p><ul className="list-disc pl-5">{ai.misconceptions.map((s, i) => <li key={i}>{s}</li>)}</ul></div>}
          <p><span className="font-medium">Improved answer:</span> {ai.improvedAnswerEnglish}</p>
          <p><span className="font-medium">Next step:</span> {ai.nextStep}</p>
          <p className="text-xs text-muted">AI feedback can make mistakes. Compare with the model answer.</p>
        </div>
      )}

      {showRef && (
        <div className="mt-3 rounded-xl bg-brand-soft p-4 text-sm">
          <p className="font-semibold text-brand">Model answer</p>
          <p className="mt-1">{q.reference}</p>
          <p className="mt-2 text-xs text-muted">Marking idea: {q.rubric}</p>
        </div>
      )}
    </div>
  )
}
