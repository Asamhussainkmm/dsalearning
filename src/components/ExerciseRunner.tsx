import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Lightbulb, Loader2, Play, RotateCcw, Send, Square, XCircle } from 'lucide-react'
import type { Exercise } from '../types'
import { runJava, runTests, type RunResult, type TestOutcome } from '../lib/judge0'
import { completeExercise } from '../lib/progressOps'
import { useProgress } from '../state/ProgressContext'
import { Badge, Btn, Markup } from './Ui'
import { CodeEditor } from './CodeEditor'

const RUN_MESSAGES: Record<string, string> = {
  compile_error: 'Compile error. Fix the errors below and run again.',
  runtime_error: 'Runtime error. Your program crashed while running.',
  timeout: 'Time limit exceeded. Check for an infinite loop.',
  service_error: 'The code-running service could not be reached. Nothing was graded. Check your internet connection and try again.',
  rate_limited: 'The free code-running service is busy (rate limited). Wait a few seconds and try again.',
}

export function RunOutput({ run }: { run: RunResult }) {
  return (
    <div className="space-y-2 text-sm" role="status" aria-live="polite">
      {run.status !== 'ok' && <p className="rounded-lg bg-bad-soft p-2 font-medium text-bad">{RUN_MESSAGES[run.status] ?? run.message}</p>}
      {run.compileOutput && <pre className="overflow-x-auto rounded-lg bg-code p-3 text-xs text-rose-200">{run.compileOutput}</pre>}
      {run.stdout && <div><p className="mb-1 font-medium">Output</p><pre className="overflow-x-auto rounded-lg bg-code p-3 text-xs text-slate-100">{run.stdout}</pre></div>}
      {run.stderr && <div><p className="mb-1 font-medium text-bad">Error output</p><pre className="overflow-x-auto rounded-lg bg-code p-3 text-xs text-rose-200">{run.stderr}</pre></div>}
      {run.status === 'ok' && !run.stdout && <p className="text-muted">The program finished without printing anything.</p>}
    </div>
  )
}

export function ExerciseRunner({ ex }: { ex: Exercise }) {
  const { p, update } = useProgress()
  const stored = p.savedCode[ex.id]
  const [code, setCode] = useState(stored ?? ex.starter)
  const [stdin, setStdin] = useState(ex.examples[0]?.input ?? '')
  const [busy, setBusy] = useState<'run' | 'submit' | null>(null)
  const [run, setRun] = useState<RunResult | null>(null)
  const [results, setResults] = useState<TestOutcome[] | null>(null)
  const [hints, setHints] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const abort = useRef<AbortController | null>(null)
  const done = p.completedExercises.includes(ex.id)

  // Autosave the draft (debounced).
  useEffect(() => {
    const t = setTimeout(() => {
      if (code !== (p.savedCode[ex.id] ?? ex.starter)) update((s) => ({ ...s, savedCode: { ...s.savedCode, [ex.id]: code } }))
    }, 800)
    return () => clearTimeout(t)
  }, [code]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => abort.current?.abort(), [])

  const doRun = async () => {
    abort.current = new AbortController()
    setBusy('run'); setRun(null); setResults(null)
    setRun(await runJava(code, stdin, abort.current.signal))
    setBusy(null)
  }

  const doSubmit = async () => {
    abort.current = new AbortController()
    setBusy('submit'); setRun(null); setResults(null)
    try {
      const out = await runTests(ex, code, undefined, abort.current.signal)
      setResults(out)
      if (out.length > 0 && out.every((o) => o.passed)) update((s) => completeExercise(s, ex.id, ex.title))
    } finally {
      setBusy(null)
    }
  }

  const cancel = () => { abort.current?.abort(); setBusy(null) }
  const reset = () => { if (window.confirm('Reset your code to the starter template? Your current code will be lost.')) setCode(ex.starter) }

  const passed = results?.filter((r) => r.passed).length ?? 0
  const serviceProblem = results?.find((r) => r.run.status === 'service_error' || r.run.status === 'rate_limited')

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{ex.difficulty}</Badge>
          {done && <Badge tone="ok">Solved</Badge>}
        </div>
        <div className="mt-3 text-sm leading-7"><Markup text={ex.statement} /></div>
        <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="font-semibold">Input</dt><dd className="text-muted">{ex.inputFormat}</dd></div>
          <div><dt className="font-semibold">Output</dt><dd className="text-muted">{ex.outputFormat}</dd></div>
          {ex.constraints && <div><dt className="font-semibold">Constraints</dt><dd className="text-muted">{ex.constraints}</dd></div>}
        </dl>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {ex.examples.map((e, i) => (
            <div key={i} className="rounded-xl bg-surface2 p-3 text-xs">
              <p className="mb-1 font-semibold">Example {i + 1}</p>
              <p className="text-muted">Input</p><pre className="mb-1 whitespace-pre-wrap font-mono">{e.input}</pre>
              <p className="text-muted">Output</p><pre className="whitespace-pre-wrap font-mono">{e.output}</pre>
            </div>
          ))}
        </div>
      </div>

      <CodeEditor value={code} onChange={setCode} height="420px" label={`Java editor for ${ex.title}`} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Custom input (stdin) for “Run”</span>
          <textarea value={stdin} onChange={(e) => setStdin(e.target.value)} rows={4} className="w-full rounded-xl border border-line bg-bg p-2 font-mono text-xs" />
        </label>
        <div className="flex flex-wrap content-start items-start gap-2">
          <Btn variant="ghost" onClick={doRun} disabled={busy !== null}>{busy === 'run' ? <Loader2 className="animate-spin" size={16} aria-hidden /> : <Play size={16} aria-hidden />} Run</Btn>
          <Btn onClick={doSubmit} disabled={busy !== null}>{busy === 'submit' ? <Loader2 className="animate-spin" size={16} aria-hidden /> : <Send size={16} aria-hidden />} Submit (run all tests)</Btn>
          {busy && <Btn variant="danger" onClick={cancel}><Square size={14} aria-hidden /> Cancel</Btn>}
          <Btn variant="ghost" onClick={reset}><RotateCcw size={16} aria-hidden /> Reset code</Btn>
        </div>
      </div>

      {run && <div className="rounded-2xl border border-line bg-surface p-4"><RunOutput run={run} /></div>}

      {results && (
        <div className="rounded-2xl border border-line bg-surface p-4" role="status" aria-live="polite">
          {serviceProblem ? (
            <p className="rounded-lg bg-bad-soft p-2 text-sm font-medium text-bad">{RUN_MESSAGES[serviceProblem.run.status]}</p>
          ) : (
            <p className={`text-base font-semibold ${passed === results.length ? 'text-ok' : 'text-bad'}`}>
              {passed === results.length ? `All ${results.length} tests passed. Well done! 🎉` : `${passed} of ${results.length} tests passed`}
            </p>
          )}
          {results[0]?.run.status === 'compile_error' && <RunOutput run={results[0].run} />}
          <ul className="mt-3 space-y-2">
            {results.map((r) => (
              <li key={r.index} className="rounded-xl border border-line p-3 text-sm">
                <p className="flex items-center gap-2 font-medium">
                  {r.passed ? <CheckCircle2 size={16} className="text-ok" aria-hidden /> : <XCircle size={16} className="text-bad" aria-hidden />}
                  Test {r.index + 1} {r.hidden && <Badge tone="muted">hidden</Badge>} – {r.passed ? 'Passed' : r.note ?? 'Failed'}
                </p>
                {!r.passed && !r.note && r.run.status === 'ok' && (
                  r.hidden ? (
                    <p className="mt-1 text-xs text-muted">Your program printed a different result for a hidden test. Check edge cases (smallest, largest, empty, repeated values).</p>
                  ) : (
                    <div className="mt-2 grid gap-2 text-xs sm:grid-cols-3">
                      <div><p className="text-muted">Input</p><pre className="whitespace-pre-wrap font-mono">{r.input}</pre></div>
                      <div><p className="text-muted">Expected</p><pre className="whitespace-pre-wrap font-mono">{r.expected}</pre></div>
                      <div><p className="text-muted">Your output</p><pre className="whitespace-pre-wrap font-mono">{r.actual || '(nothing)'}</pre></div>
                    </div>
                  )
                )}
                {!r.passed && !r.note && r.run.status !== 'ok' && r.run.status !== 'compile_error' && <p className="mt-1 text-xs text-bad">{RUN_MESSAGES[r.run.status] ?? r.run.message}</p>}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">Note: this is a static website, so hidden tests are included in the page code. They are for practice, not for secure grading.</p>
        </div>
      )}

      <div className="rounded-2xl border border-line bg-surface p-4">
        <h3 className="flex items-center gap-2 font-semibold"><Lightbulb size={18} aria-hidden /> Stuck? Take a hint</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
          {ex.hints.slice(0, hints).map((h, i) => <li key={i}>{h}</li>)}
        </ol>
        <div className="mt-3 flex flex-wrap gap-2">
          {hints < ex.hints.length && <Btn variant="soft" onClick={() => setHints(hints + 1)}>Show hint {hints + 1}</Btn>}
          {hints >= ex.hints.length && !showSolution && (
            <Btn variant="ghost" onClick={() => { if (window.confirm('Try a little more first? Show the full solution now?')) setShowSolution(true) }}>Show solution</Btn>
          )}
        </div>
        {hints >= 1 && <div className="mt-3 rounded-xl bg-brand-soft p-3 text-sm"><p className="mb-1 font-semibold text-brand">Approach (Tanglish)</p><Markup text={ex.approachTanglish} /></div>}
        {showSolution && <pre className="mt-3 overflow-x-auto rounded-xl bg-code p-3 text-xs text-slate-100">{ex.solution}</pre>}
      </div>
    </div>
  )
}
