import { Fragment, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check, Copy, Play } from 'lucide-react'

const KEYWORDS = new Set([
  'public', 'private', 'protected', 'static', 'final', 'class', 'interface', 'extends', 'implements', 'new', 'return', 'if', 'else', 'for', 'while', 'do',
  'break', 'continue', 'void', 'int', 'long', 'double', 'float', 'boolean', 'char', 'byte', 'short', 'null', 'true', 'false', 'this', 'import', 'package',
  'try', 'catch', 'throw', 'throws', 'switch', 'case', 'default', 'instanceof', 'super',
])

/** Tiny Java tokenizer for display only (never executed). Output is React text nodes, never HTML. */
export function highlight(code: string): ReactNode[] {
  const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|([\s\S])/g
  const out: ReactNode[] = []
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(code))) {
    const [t, comment, str, num, word] = m
    const key = i++
    if (comment) out.push(<span key={key} className="text-slate-400 italic">{t}</span>)
    else if (str) out.push(<span key={key} className="text-emerald-300">{t}</span>)
    else if (num) out.push(<span key={key} className="text-amber-300">{t}</span>)
    else if (word) {
      if (KEYWORDS.has(word)) out.push(<span key={key} className="font-semibold text-violet-300">{t}</span>)
      else if (/^[A-Z]/.test(word)) out.push(<span key={key} className="text-sky-300">{t}</span>)
      else out.push(<Fragment key={key}>{t}</Fragment>)
    } else out.push(<Fragment key={key}>{t}</Fragment>)
  }
  return out
}

export function CodeBlock({
  code, caption, runnable = true, onOpen,
}: { code: string; caption?: string; runnable?: boolean; onOpen?: () => void }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }
  const lines = code.split('\n')
  return (
    <figure className="my-4 overflow-hidden rounded-xl border border-line bg-code text-slate-100">
      <figcaption className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2 text-xs text-slate-300">
        <span className="truncate">{caption ?? 'Java'}</span>
        <span className="flex shrink-0 gap-1">
          <button type="button" onClick={copy} className="inline-flex min-h-8 items-center gap-1 rounded-md px-2 hover:bg-white/10" aria-label="Copy code">
            {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          {runnable && (
            <Link
              to="/playground"
              state={{ code }}
              onClick={onOpen}
              className="inline-flex min-h-8 items-center gap-1 rounded-md px-2 hover:bg-white/10"
              aria-label="Open this code in the Java Playground"
            >
              <Play size={14} aria-hidden /> Try it
            </Link>
          )}
        </span>
      </figcaption>
      <pre className="overflow-x-auto p-3 text-[13px] leading-6" tabIndex={0} aria-label="Java source code">
        <code className="font-mono">
          {lines.map((ln, i) => (
            <div key={i} className="flex">
              <span className="mr-3 inline-block w-6 shrink-0 select-none text-right text-slate-500" aria-hidden>{i + 1}</span>
              <span className="whitespace-pre">{highlight(ln)}{ln === '' ? ' ' : ''}</span>
            </div>
          ))}
        </code>
      </pre>
    </figure>
  )
}
