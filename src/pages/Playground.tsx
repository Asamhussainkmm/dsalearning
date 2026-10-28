import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Copy, Loader2, Maximize2, Minimize2, Play, RotateCcw, Square } from 'lucide-react'
import { runJava, type RunResult } from '../lib/judge0'
import { useProgress } from '../state/ProgressContext'
import { Btn, PageHeader } from '../components/Ui'
import { CodeEditor } from '../components/CodeEditor'
import { RunOutput } from '../components/ExerciseRunner'

const EXAMPLES: { name: string; code: string; stdin: string }[] = [
  {
    name: 'Hello, world',
    code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, DSA!");\n    }\n}\n',
    stdin: '',
  },
  {
    name: 'Read two numbers',
    code: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println("Sum = " + (a + b));\n    }\n}\n',
    stdin: '4 5',
  },
  {
    name: 'Array loop',
    code: 'public class Main {\n    public static void main(String[] args) {\n        int[] marks = {70, 85, 90, 65};\n        int total = 0;\n        for (int i = 0; i < marks.length; i++) {\n            total += marks[i];\n        }\n        System.out.println("Total = " + total);\n        System.out.println("Average = " + (double) total / marks.length);\n    }\n}\n',
    stdin: '',
  },
  {
    name: 'Stack with java.util',
    code: 'import java.util.Stack;\n\npublic class Main {\n    public static void main(String[] args) {\n        Stack<Integer> st = new Stack<>();\n        st.push(10);\n        st.push(20);\n        st.push(30);\n        System.out.println("pop: " + st.pop());\n        System.out.println("peek: " + st.peek());\n    }\n}\n',
    stdin: '',
  },
]

const KEY = 'playground'

export default function Playground() {
  const loc = useLocation()
  const { p, update } = useProgress()
  const fromLesson = (loc.state as { code?: string } | null)?.code
  const [code, setCode] = useState(fromLesson ?? p.savedCode[KEY] ?? EXAMPLES[0].code)
  const [stdin, setStdin] = useState('')
  const [run, setRun] = useState<RunResult | null>(null)
  const [busy, setBusy] = useState(false)
  const [full, setFull] = useState(false)
  const [copied, setCopied] = useState(false)
  const abort = useRef<AbortController | null>(null)

  useEffect(() => {
    const t = setTimeout(() => update((s) => (s.savedCode[KEY] === code ? s : { ...s, savedCode: { ...s.savedCode, [KEY]: code } })), 800)
    return () => clearTimeout(t)
  }, [code, update])
  useEffect(() => () => abort.current?.abort(), [])

  const doRun = async () => {
    abort.current = new AbortController()
    setBusy(true); setRun(null)
    setRun(await runJava(code, stdin, abort.current.signal))
    setBusy(false)
  }
  const cancel = () => { abort.current?.abort(); setBusy(false) }
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch { setCopied(false) }
  }

  return (
    <div className={full ? 'fixed inset-0 z-50 overflow-auto bg-bg p-4' : ''}>
      <PageHeader title="Java Playground" subtitle="Write and run Java. The program runs on a remote Java 17 service, never in your browser, so you need an internet connection.">
        <Btn variant="ghost" onClick={() => setFull((f) => !f)} aria-pressed={full}>{full ? <Minimize2 size={16} aria-hidden /> : <Maximize2 size={16} aria-hidden />} {full ? 'Exit full screen' : 'Full screen'}</Btn>
      </PageHeader>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="text-sm font-medium" htmlFor="ex">Starter examples</label>
        <select
          id="ex" className="min-h-10 rounded-lg border border-line bg-surface px-3 text-sm" defaultValue=""
          onChange={(e) => {
            const ex = EXAMPLES[Number(e.target.value)]
            if (!ex) return
            if (code.trim() === '' || window.confirm('Replace the current code with this example?')) { setCode(ex.code); setStdin(ex.stdin); setRun(null) }
            e.target.value = ''
          }}
        >
          <option value="" disabled>Choose…</option>
          {EXAMPLES.map((e, i) => <option key={e.name} value={i}>{e.name}</option>)}
        </select>
      </div>

      <CodeEditor value={code} onChange={setCode} height={full ? '55vh' : '380px'} label="Java playground editor" />

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Input (stdin)</span>
          <textarea value={stdin} onChange={(e) => setStdin(e.target.value)} rows={4} className="w-full rounded-xl border border-line bg-bg p-2 font-mono text-xs" placeholder="Type what Scanner should read, e.g. 4 5" />
        </label>
        <div className="flex flex-wrap content-start gap-2">
          <Btn onClick={doRun} disabled={busy || code.trim() === ''}>{busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Play size={16} aria-hidden />} Run</Btn>
          {busy && <Btn variant="danger" onClick={cancel}><Square size={14} aria-hidden /> Cancel</Btn>}
          <Btn variant="ghost" onClick={copy}><Copy size={16} aria-hidden /> {copied ? 'Copied' : 'Copy code'}</Btn>
          <Btn variant="ghost" onClick={() => { if (window.confirm('Reset to the Hello, world example? Your code will be lost.')) { setCode(EXAMPLES[0].code); setStdin(''); setRun(null) } }}><RotateCcw size={16} aria-hidden /> Reset</Btn>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-2 text-sm font-semibold">Output</h2>
        {busy ? <p className="text-sm text-muted" role="status">Running… the first run can take a few seconds.</p> : run ? <RunOutput run={run} /> : <p className="text-sm text-muted">Press Run to see the output here.</p>}
      </div>
      <p className="mt-3 text-xs text-muted">Tip: the class that has <code>main</code> should be called <code>Main</code>. Programs are limited to a few seconds of run time.</p>
    </div>
  )
}
