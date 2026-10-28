import { Lightbulb, Sparkles, TriangleAlert, Info } from 'lucide-react'
import type { Block } from '../types'
import { mcqById } from '../content'
import { recordAnswer } from '../lib/progressOps'
import { useProgress } from '../state/ProgressContext'
import { CodeBlock } from './CodeBlock'
import { McqCard } from './McqCard'
import { Markup } from './Ui'
import { Viz } from './viz/Viz'

function CodeWithExplanation({ b }: { b: Extract<Block, { t: 'code' }> }) {
  return (
    <div>
      <CodeBlock code={b.code} caption={b.caption} runnable={!b.snippet} />
      {b.lines && b.lines.length > 0 && (
        <div className="mb-4 rounded-xl border border-line bg-surface p-4">
          <p className="mb-2 text-sm font-semibold">Line by line (vari vari-aa)</p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {b.lines.map((l, i) => <li key={i}><Markup text={l} className="inline" /></li>)}
          </ul>
        </div>
      )}
      {b.output && (
        <div className="mb-4 rounded-xl bg-code p-3 text-sm text-slate-100">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{b.snippet ? 'Result' : 'Expected output'}</p>
          <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[13px]">{b.output}</pre>
        </div>
      )}
    </div>
  )
}

export function BlockView({ b }: { b: Block }) {
  const { update } = useProgress()
  switch (b.t) {
    case 'analogy':
      return (
        <aside className="my-4 rounded-2xl border border-amber-300/50 bg-warn-soft p-4">
          <p className="mb-1 flex items-center gap-2 font-semibold text-warn"><Sparkles size={18} aria-hidden /> {b.title ?? 'Real-life example'}</p>
          <Markup text={b.body} />
        </aside>
      )
    case 'text':
      return <Markup text={b.body} className="my-3" />
    case 'simpler':
      return (
        <aside className="my-4 rounded-2xl bg-brand-soft p-4">
          <p className="mb-1 flex items-center gap-2 font-semibold text-brand"><Lightbulb size={18} aria-hidden /> Innum simple-aa</p>
          <Markup text={b.body} />
        </aside>
      )
    case 'note':
      return (
        <aside className="my-4 flex gap-2 rounded-xl border border-line bg-surface2 p-3 text-sm">
          <Info size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden /><Markup text={b.body} />
        </aside>
      )
    case 'terms':
      return (
        <dl className="my-4 grid gap-2 sm:grid-cols-2">
          {b.items.map((it) => (
            <div key={it.term} className="rounded-xl border border-line bg-surface p-3">
              <dt className="font-semibold text-brand">{it.term}</dt>
              <dd className="text-sm"><Markup text={it.meaning} /></dd>
            </div>
          ))}
        </dl>
      )
    case 'code':
      return <CodeWithExplanation b={b} />
    case 'steps':
      return (
        <div className="my-4 rounded-2xl border border-line bg-surface p-4">
          <p className="mb-2 font-semibold">{b.title}</p>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {b.items.map((s, i) => <li key={i}><Markup text={s} className="inline" /></li>)}
          </ol>
        </div>
      )
    case 'mistakes':
      return (
        <aside className="my-4 rounded-2xl border border-rose-300/40 bg-bad-soft p-4">
          <p className="mb-1 flex items-center gap-2 font-semibold text-bad"><TriangleAlert size={18} aria-hidden /> Common mistakes</p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {b.items.map((s, i) => <li key={i}><Markup text={s} className="inline" /></li>)}
          </ul>
        </aside>
      )
    case 'table':
      return (
        <div className="my-4 overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[28rem] text-left text-sm">
            {b.caption && <caption className="p-2 text-left text-xs text-muted">{b.caption}</caption>}
            <thead className="bg-surface2"><tr>{b.head.map((h) => <th key={h} scope="col" className="px-3 py-2 font-semibold">{h}</th>)}</tr></thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className="border-t border-line">
                  {r.map((c, j) => (j === 0 ? <th key={j} scope="row" className="px-3 py-2 font-medium"><Markup text={c} className="inline" /></th> : <td key={j} className="px-3 py-2"><Markup text={c} className="inline" /></td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'viz':
      return (
        <div className="my-5">
          <Viz id={b.viz} />
          {b.caption && <p className="mt-1 text-xs text-muted">{b.caption}</p>}
        </div>
      )
    case 'check': {
      const q = mcqById.get(b.questionId)
      if (!q) return null
      return (
        <div className="my-5">
          <p className="mb-2 text-sm font-semibold text-brand">Quick check</p>
          <McqCard q={q} onAnswer={(correct) => update((p) => recordAnswer(p, q.id, correct))} />
        </div>
      )
    }
  }
}

export function LessonRenderer({ blocks }: { blocks: Block[] }) {
  return <div>{blocks.map((b, i) => <BlockView key={i} b={b} />)}</div>
}
