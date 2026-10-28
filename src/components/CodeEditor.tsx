import { lazy, Suspense, useEffect, useState } from 'react'

const Monaco = lazy(() => import('@monaco-editor/react'))

interface Props {
  value: string
  onChange: (v: string) => void
  height?: string
  label?: string
}

/** Plain textarea editor, used while Monaco loads and whenever it cannot load (offline, blocked CDN). */
function TextEditor({ value, onChange, height, label }: Props) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      spellCheck={false}
      aria-label={label ?? 'Java code editor'}
      style={{ height }}
      className="block w-full resize-y rounded-xl border border-line bg-code p-3 font-mono text-[13px] leading-6 text-slate-100"
      onKeyDown={(e) => {
        if (e.key === 'Tab' && !e.shiftKey) {
          e.preventDefault()
          const t = e.currentTarget
          const s = t.selectionStart
          const next = value.slice(0, s) + '    ' + value.slice(t.selectionEnd)
          onChange(next)
          requestAnimationFrame(() => { t.selectionStart = t.selectionEnd = s + 4 })
        }
      }}
    />
  )
}

export function CodeEditor(props: Props) {
  const { value, onChange, height = '360px', label } = props
  const [useFallback, setUseFallback] = useState(false)

  // Monaco loads its worker files from a CDN; if that fails the editor never mounts, so fall back after a timeout.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!document.querySelector('.monaco-editor')) setUseFallback(true)
    }, 8000)
    return () => clearTimeout(t)
  }, [])

  if (useFallback) return <TextEditor {...props} height={height} />
  return (
    <div className="overflow-hidden rounded-xl border border-line" style={{ height }} role="group" aria-label={label ?? 'Java code editor'}>
      <Suspense fallback={<TextEditor {...props} height={height} />}>
        <Monaco
          height={height}
          language="java"
          theme="vs-dark"
          value={value}
          onChange={(v) => onChange(v ?? '')}
          loading={<TextEditor {...props} height={height} />}
          options={{ minimap: { enabled: false }, fontSize: 14, scrollBeyondLastLine: false, automaticLayout: true, tabSize: 4, accessibilitySupport: 'auto' }}
        />
      </Suspense>
    </div>
  )
}
