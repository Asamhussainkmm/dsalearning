import { useMemo, useState } from 'react'
import { Btn } from '../Ui'
import {
  bstBuild, bstHeight, bstSearchPath, inorder, layoutTree, postorder, preorder,
  circDequeue, circEnqueue, circNew, llAddEnd, llAddFront, llRemove,
  queueDequeue, queueEnqueue, queueNew, stackNew, stackPop, stackPush,
} from '../../lib/algos'
import { parseNumbers } from './SortPlayer'

const input = 'min-h-10 w-24 rounded-lg border border-line bg-bg px-3 py-1.5 text-sm'

function Msg({ text, ok = true }: { text: string; ok?: boolean }) {
  return <p role="status" aria-live="polite" className={`mt-3 min-h-10 rounded-xl p-3 text-sm ${ok ? 'bg-surface2' : 'bg-bad-soft text-bad'}`}>{text || 'Try an operation.'}</p>
}

function useValue(initial = '7') {
  const [raw, setRaw] = useState(initial)
  const n = Number(raw)
  const valid = raw.trim() !== '' && Number.isInteger(n) && Math.abs(n) <= 999
  return { raw, setRaw, n, valid }
}

// ---------------- Array (1D) ----------------
export function ArrayViz() {
  const [arr] = useState([12, 7, 25, 3, 19, 30])
  const [sel, setSel] = useState<number | null>(null)
  return (
    <section aria-label="Array visualization" className="rounded-2xl border border-line bg-surface p-4">
      <h3 className="text-base font-semibold">Array: boxes in a row, each with an index</h3>
      <div className="mt-4 flex flex-wrap gap-2" role="list">
        {arr.map((v, i) => (
          <button key={i} type="button" role="listitem" onClick={() => setSel(i)} aria-pressed={sel === i}
            className={`flex h-16 w-14 flex-col items-center justify-center rounded-lg border-2 text-lg font-bold ${sel === i ? 'border-brand bg-brand-soft text-brand' : 'border-line bg-surface2'}`}>
            {v}<span className="text-[11px] font-normal text-muted">[{i}]</span>
          </button>
        ))}
      </div>
      <Msg text={sel === null ? 'Click a box to read it with its index.' : `a[${sel}] = ${arr[sel]}. Index ${sel} is the ${sel + 1}${['st', 'nd', 'rd'][sel] ?? 'th'} box because counting starts at 0. Last index = length - 1 = ${arr.length - 1}.`} />
    </section>
  )
}

// ---------------- Array (2D) ----------------
export function Array2dViz() {
  const m = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
  const [sel, setSel] = useState<[number, number] | null>(null)
  return (
    <section aria-label="Two-dimensional array visualization" className="rounded-2xl border border-line bg-surface p-4">
      <h3 className="text-base font-semibold">2D array: rows and columns</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="border-separate border-spacing-1">
          <thead><tr><th /> {m[0].map((_, c) => <th key={c} scope="col" className="text-xs font-normal text-muted">col {c}</th>)}</tr></thead>
          <tbody>
            {m.map((row, r) => (
              <tr key={r}>
                <th scope="row" className="pr-1 text-xs font-normal text-muted">row {r}</th>
                {row.map((v, c) => {
                  const on = sel && (sel[0] === r && sel[1] === c)
                  const line = sel && (sel[0] === r || sel[1] === c)
                  return (
                    <td key={c}>
                      <button type="button" onClick={() => setSel([r, c])} aria-label={`row ${r} column ${c} value ${v}`}
                        className={`h-12 w-12 rounded-lg border-2 font-bold ${on ? 'border-brand bg-brand text-brand-ink' : line ? 'border-brand/50 bg-brand-soft' : 'border-line bg-surface2'}`}>{v}</button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Msg text={sel ? `m[${sel[0]}][${sel[1]}] = ${m[sel[0]][sel[1]]}. First index = row, second index = column.` : 'Click a cell. The first index picks the row, the second picks the column.'} />
    </section>
  )
}

// ---------------- Stack ----------------
export function StackViz() {
  const [s, setS] = useState(() => stackNew(6))
  const [msg, setMsg] = useState({ text: '', ok: true })
  const v = useValue('5')
  return (
    <section aria-label="Stack visualization" className="rounded-2xl border border-line bg-surface p-4">
      <h3 className="text-base font-semibold">Stack (LIFO): capacity {s.size}</h3>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="text-sm"><span className="mb-1 block font-medium">Value</span><input className={input} value={v.raw} onChange={(e) => v.setRaw(e.target.value)} inputMode="numeric" /></label>
        <Btn disabled={!v.valid} onClick={() => { const r = stackPush(s, v.n); setS(r.state); setMsg({ text: r.msg, ok: r.ok }) }}>Push</Btn>
        <Btn variant="ghost" onClick={() => { const r = stackPop(s); setS(r.state); setMsg({ text: r.msg, ok: r.ok }) }}>Pop</Btn>
        <Btn variant="ghost" onClick={() => { setS(stackNew(6)); setMsg({ text: 'Stack reset.', ok: true }) }}>Reset</Btn>
      </div>
      <div className="mt-4 flex justify-center">
        <div className="flex w-40 flex-col-reverse gap-1 rounded-b-xl border-x-4 border-b-4 border-line p-2" style={{ minHeight: 6 * 44 + 16 }} role="list" aria-label="Stack from bottom to top">
          {Array.from({ length: s.size }, (_, i) => {
            const val = s.items[i]
            const isTop = i === s.top
            return (
              <div key={i} role="listitem" className={`flex h-10 items-center justify-between rounded-md border-2 px-3 text-sm font-bold ${val === undefined ? 'border-dashed border-line text-muted' : isTop ? 'pop border-brand bg-brand-soft text-brand' : 'border-line bg-surface2'}`}>
                <span>{val ?? ''}</span><span className="text-[11px] font-normal text-muted">[{i}]{isTop ? ' ← top' : ''}</span>
              </div>
            )
          })}
        </div>
      </div>
      <p className="mt-2 text-center text-sm text-muted">top = {s.top}</p>
      <Msg text={msg.text} ok={msg.ok} />
    </section>
  )
}

// ---------------- Linear queue ----------------
export function QueueViz() {
  const [q, setQ] = useState(() => queueNew(6))
  const [msg, setMsg] = useState({ text: '', ok: true })
  const v = useValue('5')
  return (
    <section aria-label="Queue visualization" className="rounded-2xl border border-line bg-surface p-4">
      <h3 className="text-base font-semibold">Linear queue (FIFO), array of {q.que.length}</h3>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="text-sm"><span className="mb-1 block font-medium">Value</span><input className={input} value={v.raw} onChange={(e) => v.setRaw(e.target.value)} inputMode="numeric" /></label>
        <Btn disabled={!v.valid} onClick={() => { const r = queueEnqueue(q, v.n); setQ(r.state); setMsg({ text: r.msg, ok: r.ok }) }}>Enqueue</Btn>
        <Btn variant="ghost" onClick={() => { const r = queueDequeue(q); setQ(r.state); setMsg({ text: r.msg, ok: r.ok }) }}>Dequeue</Btn>
        <Btn variant="ghost" onClick={() => { setQ(queueNew(6)); setMsg({ text: 'Queue reset.', ok: true }) }}>Reset</Btn>
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-1" role="list" aria-label="Queue array">
        {q.que.map((val, i) => {
          const inside = val !== null && i > q.front && i <= q.rear
          return (
            <div key={i} role="listitem" className="flex flex-col items-center">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 font-bold ${inside ? 'pop border-brand bg-brand-soft text-brand' : 'border-dashed border-line text-muted'}`}>{inside ? val : ''}</div>
              <span className="text-[11px] text-muted">{i}</span>
              <span className="h-4 text-[11px] font-semibold text-brand">{i === q.front + 1 && q.front !== q.rear ? 'front' : ''}{i === q.rear && q.rear >= 0 ? ' rear' : ''}</span>
            </div>
          )
        })}
      </div>
      <p className="mt-2 text-center text-sm text-muted">front = {q.front}, rear = {q.rear}</p>
      <Msg text={msg.text} ok={msg.ok} />
    </section>
  )
}

// ---------------- Circular queue ----------------
export function CircularQueueViz() {
  const [q, setQ] = useState(() => circNew(6))
  const [msg, setMsg] = useState({ text: '', ok: true })
  const v = useValue('5')
  const cap = q.que.length
  const R = 80
  return (
    <section aria-label="Circular queue visualization" className="rounded-2xl border border-line bg-surface p-4">
      <h3 className="text-base font-semibold">Circular queue: capacity {cap}</h3>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="text-sm"><span className="mb-1 block font-medium">Value</span><input className={input} value={v.raw} onChange={(e) => v.setRaw(e.target.value)} inputMode="numeric" /></label>
        <Btn disabled={!v.valid} onClick={() => { const r = circEnqueue(q, v.n); setQ(r.state); setMsg({ text: r.msg, ok: r.ok }) }}>Enqueue</Btn>
        <Btn variant="ghost" onClick={() => { const r = circDequeue(q); setQ(r.state); setMsg({ text: r.msg, ok: r.ok }) }}>Dequeue</Btn>
        <Btn variant="ghost" onClick={() => { setQ(circNew(6)); setMsg({ text: 'Queue reset.', ok: true }) }}>Reset</Btn>
      </div>
      <div className="mt-4 grid items-center gap-4 sm:grid-cols-2">
        <svg viewBox="-120 -120 240 240" className="mx-auto h-56 w-56" role="img" aria-label={`Circular queue: front ${q.front}, rear ${q.rear}, size ${q.size}`}>
          {q.que.map((val, i) => {
            const ang = (i / cap) * 2 * Math.PI - Math.PI / 2
            const x = Math.cos(ang) * R, y = Math.sin(ang) * R
            const live = val !== null
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={22} className={live ? 'fill-[var(--c-brand-soft)] stroke-[var(--c-brand)]' : 'fill-transparent stroke-[var(--c-line)]'} strokeWidth={2} strokeDasharray={live ? undefined : '4 3'} />
                <text x={x} y={y + 4} textAnchor="middle" className="fill-[var(--c-ink)] text-[12px] font-bold">{live ? val : ''}</text>
                <text x={x * 1.42} y={y * 1.42 + 4} textAnchor="middle" className="fill-[var(--c-muted)] text-[10px]">{i}</text>
              </g>
            )
          })}
          <text x={0} y={-4} textAnchor="middle" className="fill-[var(--c-ink)] text-[12px]">front={q.front}</text>
          <text x={0} y={12} textAnchor="middle" className="fill-[var(--c-ink)] text-[12px]">rear={q.rear}</text>
          <text x={0} y={28} textAnchor="middle" className="fill-[var(--c-muted)] text-[11px]">size={q.size}</text>
        </svg>
        <div className="text-sm text-muted">
          <p><strong className="text-ink">front</strong> = index of the next item to leave.</p>
          <p><strong className="text-ink">rear</strong> = index where the next item will be stored.</p>
          <p>Both move with <code className="rounded bg-surface2 px-1">(index + 1) % {cap}</code>, so they wrap round to 0.</p>
        </div>
      </div>
      <Msg text={msg.text} ok={msg.ok} />
    </section>
  )
}

// ---------------- Linked list ----------------
export function LinkedListViz() {
  const [list, setList] = useState([10, 20, 30])
  const [msg, setMsg] = useState({ text: '', ok: true })
  const v = useValue('5')
  return (
    <section aria-label="Linked list visualization" className="rounded-2xl border border-line bg-surface p-4">
      <h3 className="text-base font-semibold">Singly linked list</h3>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="text-sm"><span className="mb-1 block font-medium">Value</span><input className={input} value={v.raw} onChange={(e) => v.setRaw(e.target.value)} inputMode="numeric" /></label>
        <Btn disabled={!v.valid} onClick={() => { setList(llAddFront(list, v.n)); setMsg({ text: `addFront(${v.n}): new.next = head; head = new. O(1).`, ok: true }) }}>Add front</Btn>
        <Btn disabled={!v.valid} variant="soft" onClick={() => { setList(llAddEnd(list, v.n)); setMsg({ text: `addEnd(${v.n}): walk to the last node, last.next = new. O(n).`, ok: true }) }}>Add end</Btn>
        <Btn variant="ghost" disabled={!v.valid} onClick={() => { const r = llRemove(list, v.n); setList(r.list); setMsg({ text: r.removed ? `Removed the first node holding ${v.n}: previous.next = current.next.` : `${v.n} is not in the list.`, ok: r.removed }) }}>Remove</Btn>
        <Btn variant="ghost" onClick={() => { setList([10, 20, 30]); setMsg({ text: 'List reset.', ok: true }) }}>Reset</Btn>
      </div>
      <div className="mt-5 overflow-x-auto pb-2">
        <ol className="flex min-w-max items-center gap-0" aria-label="List nodes from head to tail">
          <li className="mr-1 text-xs font-semibold text-brand">head →</li>
          {list.map((val, i) => (
            <li key={`${i}-${val}`} className="flex items-center">
              <div className="pop flex overflow-hidden rounded-lg border-2 border-brand">
                <span className="flex h-11 w-12 items-center justify-center bg-brand-soft font-bold text-brand">{val}</span>
                <span className="flex h-11 w-8 items-center justify-center border-l-2 border-brand bg-surface2 text-[10px] text-muted">next</span>
              </div>
              <span aria-hidden className="mx-1 text-brand">→</span>
            </li>
          ))}
          <li className="rounded-md border-2 border-dashed border-line px-2 py-2 text-xs text-muted">null</li>
        </ol>
      </div>
      <Msg text={msg.text} ok={msg.ok} />
    </section>
  )
}

// ---------------- BST ----------------
export function BstViz() {
  const [text, setText] = useState('23, 33, 45, 30, 10')
  const [search, setSearch] = useState('30')
  const [error, setError] = useState('')
  const [values, setValues] = useState([23, 33, 45, 30, 10])
  const root = useMemo(() => bstBuild(values), [values])
  const nodes = useMemo(() => layoutTree(root), [root])
  const s = Number(search)
  const path = Number.isInteger(s) ? bstSearchPath(root, s) : { path: [] as number[], found: false }
  const onPath = new Set(path.path)
  const W = Math.max(nodes.length, 1) * 52
  const H = (bstHeight(root) + 1) * 64 + 20
  return (
    <section aria-label="Binary search tree visualization" className="rounded-2xl border border-line bg-surface p-4">
      <h3 className="text-base font-semibold">Binary Search Tree (left &lt; node &lt; right)</h3>
      <form className="mt-3 flex flex-wrap items-end gap-3" onSubmit={(e) => {
        e.preventDefault()
        const arr = parseNumbers(text, 15)
        if (!arr || new Set(arr).size !== arr.length) { setError('Enter 1 to 15 DIFFERENT whole numbers separated by commas.'); return }
        setError(''); setValues(arr)
      }}>
        <label className="text-sm"><span className="mb-1 block font-medium">Insert in this order</span><input className={`${input} w-64 max-w-full`} value={text} onChange={(e) => setText(e.target.value)} /></label>
        <Btn type="submit" variant="soft">Build tree</Btn>
        <label className="text-sm"><span className="mb-1 block font-medium">Search for</span><input className={input} value={search} onChange={(e) => setSearch(e.target.value)} inputMode="numeric" /></label>
      </form>
      {error && <p role="alert" className="mt-2 text-sm font-medium text-bad">{error}</p>}
      <div className="mt-4 overflow-x-auto">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="mx-auto" role="img" aria-label={`Tree with in-order values ${inorder(root).join(', ')}`}>
          {nodes.map((n) => n.px !== undefined && n.py !== undefined && (
            <line key={`l${n.v}`} x1={n.px * 52 + 26} y1={n.py * 64 + 30} x2={n.x * 52 + 26} y2={n.y * 64 + 30} stroke="var(--c-line)" strokeWidth={2} />
          ))}
          {nodes.map((n) => (
            <g key={n.v}>
              <circle cx={n.x * 52 + 26} cy={n.y * 64 + 30} r={20} fill={onPath.has(n.v) ? (path.found && n.v === s ? 'var(--c-ok-soft)' : 'var(--c-warn-soft)') : 'var(--c-brand-soft)'} stroke={onPath.has(n.v) ? 'var(--c-warn)' : 'var(--c-brand)'} strokeWidth={2} />
              <text x={n.x * 52 + 26} y={n.y * 64 + 35} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--c-ink)">{n.v}</text>
            </g>
          ))}
        </svg>
      </div>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div className="rounded-xl bg-surface2 p-3"><dt className="font-semibold">Inorder (L, N, R)</dt><dd className="font-mono">{inorder(root).join(' ')}</dd></div>
        <div className="rounded-xl bg-surface2 p-3"><dt className="font-semibold">Preorder (N, L, R)</dt><dd className="font-mono">{preorder(root).join(' ')}</dd></div>
        <div className="rounded-xl bg-surface2 p-3"><dt className="font-semibold">Postorder (L, R, N)</dt><dd className="font-mono">{postorder(root).join(' ')}</dd></div>
        <div className="rounded-xl bg-surface2 p-3"><dt className="font-semibold">Height (edges)</dt><dd className="font-mono">{bstHeight(root)}</dd></div>
      </dl>
      <Msg text={Number.isInteger(s) ? `Search ${s}: path ${path.path.join(' → ') || '(empty)'} – ${path.found ? 'found' : 'not found'}.` : 'Type a whole number to search.'} />
    </section>
  )
}

// ---------------- Big O ----------------
export function BigOViz() {
  const [n, setN] = useState(8)
  const rows = [
    { name: 'O(1)', f: () => 1, note: 'constant' },
    { name: 'O(log n)', f: (x: number) => Math.max(1, Math.ceil(Math.log2(x))), note: 'binary search' },
    { name: 'O(n)', f: (x: number) => x, note: 'linear search' },
    { name: 'O(n log n)', f: (x: number) => Math.round(x * Math.max(1, Math.log2(x))), note: 'good sorts' },
    { name: 'O(n²)', f: (x: number) => x * x, note: 'bubble / selection / insertion' },
  ]
  const maxV = rows[4].f(n)
  return (
    <section aria-label="Big O growth visualization" className="rounded-2xl border border-line bg-surface p-4">
      <h3 className="text-base font-semibold">How fast do the steps grow when n grows?</h3>
      <label className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <span className="font-medium">n = {n}</span>
        <input type="range" min={2} max={64} value={n} onChange={(e) => setN(Number(e.target.value))} aria-label="Input size n" className="w-64 max-w-full" />
      </label>
      <ul className="mt-4 space-y-2">
        {rows.map((r) => {
          const v = r.f(n)
          return (
            <li key={r.name} className="grid grid-cols-[6.5rem_1fr_4rem] items-center gap-2 text-sm">
              <span className="font-mono font-semibold">{r.name}</span>
              <div className="h-4 overflow-hidden rounded-full bg-surface2"><div className="h-full rounded-full bg-brand transition-all" style={{ width: `${Math.max(1.5, (v / maxV) * 100)}%` }} /></div>
              <span className="text-right font-mono">{v}</span>
            </li>
          )
        })}
      </ul>
      <p className="mt-3 text-xs text-muted">Steps are counted by formula for the chosen n (log n uses the next whole number up). Drag n up and watch O(n²) run away.</p>
    </section>
  )
}
