import { useRef, useState } from 'react'
import { Download, Trash2, Upload } from 'lucide-react'
import { exportProgress, parseImport } from '../lib/storage'
import { useProgress } from '../state/ProgressContext'
import { Btn, Card, PageHeader } from '../components/Ui'

export default function Settings() {
  const { p, update, replace, reset } = useProgress()
  const file = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)

  const doExport = () => {
    const blob = new Blob([exportProgress(p)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dsa-lab-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMsg({ text: 'Progress exported. Keep the file safe.', ok: true })
  }

  const doImport = async (f: File | undefined) => {
    if (!f) return
    if (f.size > 2_000_000) { setMsg({ text: 'That file is too large to be a progress export.', ok: false }); return }
    const parsed = parseImport(await f.text())
    if (!parsed) { setMsg({ text: 'This file is not a valid progress export. Nothing was changed.', ok: false }); return }
    if (!window.confirm('Importing replaces your current progress in this browser. Continue?')) return
    replace(parsed)
    setMsg({ text: 'Progress imported.', ok: true })
    if (file.current) file.current.value = ''
  }

  return (
    <>
      <PageHeader title="Settings" />
      <div className="space-y-4">
        <Card>
          <h2 className="font-semibold">Theme</h2>
          <div role="radiogroup" aria-label="Theme" className="mt-2 flex flex-wrap gap-2">
            {(['system', 'light', 'dark'] as const).map((t) => (
              <label key={t} className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border-2 px-4 text-sm font-medium ${p.settings.theme === t ? 'border-brand bg-brand-soft' : 'border-line'}`}>
                <input type="radio" name="theme" className="accent-[var(--c-brand)]" checked={p.settings.theme === t} onChange={() => update((s) => ({ ...s, settings: { ...s.settings, theme: t } }))} />
                {t[0].toUpperCase() + t.slice(1)}
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold">Back up your progress</h2>
          <p className="mt-1 text-sm text-muted">There are no accounts. Your progress lives only in this browser. Export a file to move it to another device or keep a backup.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Btn onClick={doExport}><Download size={16} aria-hidden /> Export JSON</Btn>
            <Btn variant="ghost" onClick={() => file.current?.click()}><Upload size={16} aria-hidden /> Import JSON</Btn>
            <input ref={file} type="file" accept="application/json,.json" className="sr-only" aria-label="Choose progress file to import" onChange={(e) => doImport(e.target.files?.[0])} />
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold">Reset</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Btn variant="ghost" onClick={() => { if (window.confirm('Clear quiz history and the list of missed questions?')) { update((s) => ({ ...s, quizHistory: [], wrongQuestions: {}, mcqSeen: {} })); setMsg({ text: 'Quiz history cleared.', ok: true }) } }}><Trash2 size={16} aria-hidden /> Clear quiz history</Btn>
            <Btn variant="danger" onClick={() => { if (window.confirm('Reset ALL progress, bookmarks and saved code? This cannot be undone.')) { reset(); setMsg({ text: 'All progress was reset.', ok: true }) } }}><Trash2 size={16} aria-hidden /> Reset everything</Btn>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold">About this site</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
            <li>Java code runs on a remote Java service (Judge0). It needs internet and the free service can be busy.</li>
            <li>Answer keys and hidden tests are part of this static website, so they are for practice and not secure exams.</li>
            <li>AI feedback on short answers is optional and can make mistakes.</li>
          </ul>
        </Card>

        {msg && <p role="status" className={`rounded-xl p-3 text-sm font-medium ${msg.ok ? 'bg-ok-soft text-ok' : 'bg-bad-soft text-bad'}`}>{msg.text}</p>}
      </div>
    </>
  )
}
