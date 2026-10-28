import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { modules, shortAnswersOf } from '../content'
import { PageHeader } from '../components/Ui'
import { ShortAnswerRunner } from '../components/ShortAnswerRunner'

export default function ShortAnswers() {
  const loc = useLocation()
  const initial = (loc.state as { module?: string } | null)?.module ?? 'm1'
  const [mod, setMod] = useState(initial)
  const qs = shortAnswersOf(mod)
  return (
    <>
      <PageHeader title="Short Answers" subtitle="Practise writing exam-style answers in English. Get feedback in Tanglish: AI-assisted when enabled, otherwise a built-in keyword check." />
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="sa-mod" className="text-sm font-medium">Topic</label>
        <select id="sa-mod" value={mod} onChange={(e) => setMod(e.target.value)} className="min-h-10 rounded-lg border border-line bg-surface px-3 text-sm">
          {modules.map((m) => <option key={m.id} value={m.id}>{m.number}. {m.title}</option>)}
        </select>
      </div>
      <div className="space-y-5">
        {qs.map((q) => <ShortAnswerRunner key={q.id} q={q} />)}
      </div>
    </>
  )
}
