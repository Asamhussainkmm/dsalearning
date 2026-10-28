import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Fragment } from 'react'

/** Tiny inline markup: **bold** and `code`; blank line = new paragraph. No HTML is ever injected. */
export function Markup({ text, className = '' }: { text: string; className?: string }) {
  const paras = text.split(/\n\s*\n/)
  return (
    <div className={`prose-t ${className}`}>
      {paras.map((para, i) => (
        <p key={i}>
          {para.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={j}>{part.slice(2, -2)}</strong>
            if (part.startsWith('`') && part.endsWith('`') && part.length > 2) return <code key={j}>{part.slice(1, -1)}</code>
            return <Fragment key={j}>{part}</Fragment>
          })}
        </p>
      ))}
    </div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-surface p-5 shadow-sm ${className}`}>{children}</div>
}

type Variant = 'primary' | 'ghost' | 'soft' | 'danger'
const variants: Record<Variant, string> = {
  primary: 'bg-brand text-brand-ink hover:opacity-90',
  ghost: 'border border-line bg-surface text-ink hover:bg-surface2',
  soft: 'bg-brand-soft text-brand hover:opacity-90',
  danger: 'bg-bad text-white hover:opacity-90',
}
export function Btn({ variant = 'primary', className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...rest}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${variants[variant]} ${className}`}
    />
  )
}

export function Badge({ children, tone = 'brand' }: { children: ReactNode; tone?: 'brand' | 'ok' | 'bad' | 'warn' | 'muted' }) {
  const tones = {
    brand: 'bg-brand-soft text-brand',
    ok: 'bg-ok-soft text-ok',
    bad: 'bg-bad-soft text-bad',
    warn: 'bg-warn-soft text-warn',
    muted: 'bg-surface2 text-muted',
  }
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? 'Progress'} className="h-2 w-full overflow-hidden rounded-full bg-surface2">
      <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${v}%` }} />
    </div>
  )
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-muted">{subtitle}</p>}
      </div>
      {children}
    </header>
  )
}
