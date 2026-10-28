import { describe, expect, it } from 'vitest'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { lessons, exercises } from '../src/content'

/**
 * Compiles and runs every runnable Java snippet shipped in the course with the local JDK, so that no lesson
 * output and no exercise test case can be wrong. Opt-in because it needs a JDK: `npm run verify:java`.
 */
const enabled = process.env.VERIFY_JAVA === '1'
const suite = enabled ? describe : describe.skip

const root = enabled ? mkdtempSync(join(tmpdir(), 'dsa-java-')) : ''
const norm = (s: string) => s.replace(/\r/g, '').split('\n').map((l) => l.trimEnd()).join('\n').trim()

function compileAndRun(name: string, source: string, stdin: string[]): string[] {
  const dir = join(root, name)
  mkdirSync(dir, { recursive: true })
  const cls = /public\s+class\s+(\w+)/.exec(source)?.[1] ?? 'Main'
  writeFileSync(join(dir, `${cls}.java`), source)
  execFileSync('javac', ['-encoding', 'UTF-8', `${cls}.java`], { cwd: dir, stdio: 'pipe' })
  return stdin.map((input) =>
    execFileSync('java', ['-cp', dir, cls], { input, timeout: 15000, stdio: ['pipe', 'pipe', 'pipe'] }).toString(),
  )
}

suite('exercise solutions pass every test case', () => {
  for (const ex of exercises) {
    it(`${ex.id} ${ex.title}`, () => {
      const outs = compileAndRun(`ex-${ex.id}`, ex.solution, ex.tests.map((t) => t.input + '\n'))
      ex.tests.forEach((t, i) => expect(norm(outs[i]), `${ex.id} test ${i + 1} input=${JSON.stringify(t.input)}`).toBe(norm(t.expected)))
      for (const e of ex.examples) {
        const [o] = compileAndRun(`ex-${ex.id}-ex`, ex.solution, [e.input + '\n'])
        if (!e.output.includes('...')) expect(norm(o), `${ex.id} example`).toBe(norm(e.output))
      }
    })
  }
})

suite('lesson code blocks compile and print the documented output', () => {
  for (const lesson of lessons) {
    lesson.blocks.forEach((b, idx) => {
      if (b.t !== 'code' || b.snippet) return
      it(`${lesson.id} block ${idx}`, () => {
        let stdin = ''
        let expected = b.output
        const m = b.output ? /^\(Input:\s*([\s\S]*?)\)\s+→\s+([\s\S]*)$/.exec(b.output) : null
        if (m) {
          stdin = m[1].replace(/\\n/g, '\n') + '\n'
          expected = m[2]
        }
        if (expected && /^\(Runtime error\)/.test(expected)) return
        let out: string
        try {
          out = compileAndRun(`l-${lesson.id}-${idx}`, b.code, [stdin])[0]
        } catch (e) {
          const err = e as { stderr?: Buffer; stdout?: Buffer; message: string }
          if (expected && /Exception|Error/.test(expected)) return
          throw new Error(`${lesson.id} block ${idx} failed: ${err.stderr?.toString() ?? err.message}`)
        }
        if (expected !== undefined) expect(norm(out), `${lesson.id} block ${idx}`).toBe(norm(expected))
      })
    })
  }
})

if (enabled) process.on('exit', () => { try { rmSync(root, { recursive: true, force: true }) } catch { /* ignore */ } })
