import type { Exercise, TestCase } from '../types'

const BASE = ((import.meta.env.VITE_JUDGE0_URL as string | undefined) || 'https://ce.judge0.com').replace(/\/$/, '')
export const JAVA_LANGUAGE_ID = 91 // Java (JDK 17.0.6) on Judge0 CE

export type RunStatus = 'ok' | 'compile_error' | 'runtime_error' | 'timeout' | 'service_error' | 'rate_limited'

export interface RunResult {
  status: RunStatus
  stdout: string
  stderr: string
  compileOutput: string
  message: string
  timeSec?: number
  memoryKb?: number
}

const b64enc = (s: string) => {
  const bytes = new TextEncoder().encode(s)
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin)
}
const b64dec = (s: string | null | undefined) => {
  if (!s) return ''
  try {
    return new TextDecoder().decode(Uint8Array.from(atob(s), (c) => c.charCodeAt(0)))
  } catch {
    return ''
  }
}

export interface Judge0Response {
  stdout?: string | null
  stderr?: string | null
  compile_output?: string | null
  message?: string | null
  time?: string | null
  memory?: number | null
  status?: { id: number; description: string }
  token?: string
}

const failure = (status: RunStatus, message: string): RunResult => ({ status, stdout: '', stderr: '', compileOutput: '', message })

export async function runJava(source: string, stdin = '', signal?: AbortSignal): Promise<RunResult> {
  if (!source.trim()) return failure('compile_error', 'The editor is empty. Write some Java code first.')
  try {
    const res = await fetch(`${BASE}/submissions?base64_encoded=true&wait=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language_id: JAVA_LANGUAGE_ID, source_code: b64enc(source), stdin: b64enc(stdin) }),
      signal,
    })
    if (res.status === 429) return failure('rate_limited', 'The free Java runner is receiving too many requests. Wait a few seconds and try again.')
    if (!res.ok) return failure('service_error', `The Java runner returned an error (HTTP ${res.status}). Try again shortly.`)
    let data = (await res.json()) as Judge0Response
    // Some instances ignore wait=true and return only a token: poll for the result.
    if (data.token && (!data.status || data.status.id <= 2)) data = await poll(data.token, signal)
    return interpret(data)
  } catch (e) {
    if ((e as Error).name === 'AbortError') return failure('service_error', 'Run cancelled.')
    return failure('service_error', 'Could not reach the Java runner. Check your internet connection. Live execution is unavailable right now; you can keep reading the lessons.')
  }
}

async function poll(token: string, signal?: AbortSignal): Promise<Judge0Response> {
  for (let i = 0; i < 15; i++) {
    await new Promise((r) => setTimeout(r, 800))
    const res = await fetch(`${BASE}/submissions/${token}?base64_encoded=true`, { signal })
    if (!res.ok) throw new Error('poll failed')
    const d = (await res.json()) as Judge0Response
    if (d.status && d.status.id > 2) return d
  }
  throw new Error('timeout')
}

export function interpret(d: Judge0Response): RunResult {
  const id = d.status?.id ?? 0
  const base: RunResult = {
    status: 'ok',
    stdout: b64dec(d.stdout),
    stderr: b64dec(d.stderr),
    compileOutput: b64dec(d.compile_output),
    message: b64dec(d.message),
    timeSec: d.time ? Number(d.time) : undefined,
    memoryKb: d.memory ?? undefined,
  }
  if (id === 3 || id === 4) return base // 4 = "wrong answer" only when expected_output is sent; we compare ourselves
  if (id === 6) return { ...base, status: 'compile_error' }
  if (id === 5) return { ...base, status: 'timeout', message: 'Time limit exceeded. Check for an infinite loop or very slow code.' }
  if (id >= 7 && id <= 12) return { ...base, status: 'runtime_error' }
  return { ...base, status: 'service_error', message: base.message || d.status?.description || 'Unknown runner state.' }
}

export const normalizeOutput = (s: string) =>
  s.replace(/\r\n/g, '\n').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '')

export interface TestOutcome {
  index: number
  hidden: boolean
  passed: boolean
  expected: string
  actual: string
  input: string
  note?: string
  run: RunResult
}

export function judge(test: TestCase, run: RunResult): { passed: boolean; actual: string } {
  const actual = normalizeOutput(run.stdout)
  return { passed: run.status === 'ok' && actual === normalizeOutput(test.expected), actual }
}

export async function runTests(ex: Exercise, source: string, onProgress?: (done: number) => void, signal?: AbortSignal): Promise<TestOutcome[]> {
  const out: TestOutcome[] = []
  for (let i = 0; i < ex.tests.length; i++) {
    const t = ex.tests[i]
    const run = await runJava(source, t.input, signal)
    const { passed, actual } = judge(t, run)
    out.push({ index: i, hidden: !!t.hidden, passed, expected: t.expected, actual, input: t.input, run })
    onProgress?.(i + 1)
    // A compile error or unavailable service will repeat on every test: stop and mark the rest as not run.
    if (run.status === 'compile_error' || run.status === 'service_error' || run.status === 'rate_limited') {
      for (let j = i + 1; j < ex.tests.length; j++)
        out.push({ index: j, hidden: !!ex.tests[j].hidden, passed: false, expected: ex.tests[j].expected, actual: '', input: ex.tests[j].input, note: 'Not run', run })
      break
    }
  }
  return out
}
