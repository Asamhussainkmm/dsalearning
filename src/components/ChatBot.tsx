import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Loader2, MessageCircle, Send, Trash2, X } from 'lucide-react'
import { lessonById, lessons, mcqs } from '../content'
import { askChat, chatConfigured, MAX_CHAT_CHARS, splitReply, type ChatMsg } from '../lib/chat'
import { buildIndex, searchIndex, type LocalHit } from '../lib/localChat'
import { CodeBlock } from './CodeBlock'
import { Btn, Markup } from './Ui'

const SUGGESTIONS = ['Stack na enna? Simple-aa sollunga', 'Binary search eppadi velai seiyum?', 'Array index 0-la yen start aagudhu?']

type Msg = ChatMsg & { hits?: LocalHit[] }

function Bubble({ m }: { m: Msg }) {
  const mine = m.role === 'user'
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[92%] rounded-2xl px-3 py-2 text-sm ${mine ? 'bg-brand text-brand-ink' : 'border border-line bg-surface2'}`}>
        <span className="sr-only">{mine ? 'You: ' : 'DSA Buddy: '}</span>
        {mine
          ? <p className="whitespace-pre-wrap">{m.content}</p>
          : splitReply(m.content).map((p, i) => (p.code ? <CodeBlock key={i} code={p.body} runnable={false} caption="Java" /> : <Markup key={i} text={p.body} />))}
        {m.hits && m.hits.length > 0 && (
          <ul className="mt-2 space-y-2">
            {m.hits.map((h, i) => (
              <li key={i} className="rounded-xl bg-surface p-2">
                <p className="text-xs font-semibold text-brand">{h.title}</p>
                <p className="text-sm">{h.text}</p>
                <Link to={h.to} className="text-xs font-semibold underline">Read the full lesson</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export function ChatBot() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const loc = useLocation()
  const endRef = useRef<HTMLDivElement>(null)
  const abort = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const ai = chatConfigured()
  const indexRef = useRef<ReturnType<typeof buildIndex> | null>(null)

  const lessonId = /^\/learn\/([^/]+)/.exec(loc.pathname)?.[1]
  const lessonTitle = lessonId ? lessonById.get(lessonId)?.title ?? '' : ''

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }) }, [msgs, busy, open])
  useEffect(() => { if (open) inputRef.current?.focus() }, [open])
  useEffect(() => () => abort.current?.abort(), [])

  const send = async (q: string) => {
    const content = q.trim()
    if (!content || busy) return
    const history: Msg[] = [...msgs, { role: 'user', content: content.slice(0, MAX_CHAT_CHARS) }]
    setMsgs(history)
    setText('')
    setError('')
    if (!ai) {
      // Offline mode: search the course notes. No network, no AI, nothing invented.
      indexRef.current ??= buildIndex(lessons, mcqs)
      const { hits } = searchIndex(indexRef.current, content)
      const reply = hits.length
        ? 'Course notes-la irundhu ungal question-ku related points idhu thaan:'
        : "Indha question-ku related-aana answer course notes-la kidaikkala. Vera words-la try pannunga (example: 'stack na enna', 'bubble sort eppadi'), illa Learn page-la topic-ai paarunga."
      setMsgs([...history, { role: 'assistant', content: reply, hits }])
      return
    }
    setBusy(true)
    abort.current = new AbortController()
    const r = await askChat(history.map(({ role, content }) => ({ role, content })), lessonTitle, abort.current.signal)
    setBusy(false)
    if (r.ok) setMsgs([...history, { role: 'assistant', content: r.reply }])
    else setError(r.message)
  }

  if (!open)
    return (
      <button
        type="button" onClick={() => setOpen(true)} aria-label="Open DSA Buddy chat"
        className="fixed bottom-4 right-4 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-4 font-semibold text-brand-ink shadow-lg hover:opacity-90"
      >
        <MessageCircle size={20} aria-hidden /> Ask DSA Buddy
      </button>
    )

  return (
    <section
      role="dialog" aria-label="DSA Buddy chat"
      onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}
      className="fixed inset-x-2 bottom-2 z-50 flex max-h-[85vh] flex-col rounded-2xl border border-line bg-surface shadow-2xl sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-[26rem]"
    >
      <header className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
        <div>
          <h2 className="text-sm font-bold">DSA Buddy</h2>
          <p className="text-xs text-muted">{lessonTitle ? `Reading: ${lessonTitle}` : 'Ungal doubts-ai Tanglish-la kelungal'}</p>
        </div>
        <div className="flex gap-1">
          {msgs.length > 0 && (
            <button type="button" aria-label="Clear conversation" className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg hover:bg-surface2"
              onClick={() => { abort.current?.abort(); setMsgs([]); setError(''); setBusy(false) }}><Trash2 size={16} aria-hidden /></button>
          )}
          <button type="button" aria-label="Close chat" className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg hover:bg-surface2" onClick={() => setOpen(false)}><X size={18} aria-hidden /></button>
        </div>
      </header>

      <div className="min-h-40 flex-1 space-y-3 overflow-y-auto p-4" role="log" aria-live="polite" aria-label="Conversation">
        {!ai && (
          <p className="rounded-xl bg-warn-soft p-3 text-xs text-warn">Offline mode: I search this course&apos;s own notes for you. I am not an AI, so I can only answer what the lessons cover.</p>
        )}
        {msgs.length === 0 && (
          <div className="space-y-2">
            <p className="text-sm">Vanakkam! 👋 DSA, Java pathi enna doubt irundhaalum kelunga. Naan Tanglish-la simple-aa explain panren.</p>
            <ul className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <li key={s}><button type="button" onClick={() => send(s)} className="rounded-full border border-line px-3 py-1.5 text-left text-xs hover:border-brand">{s}</button></li>
              ))}
            </ul>
          </div>
        )}
        {msgs.map((m, i) => <Bubble key={i} m={m} />)}
        {busy && <p className="flex items-center gap-2 text-sm text-muted" role="status"><Loader2 size={14} className="animate-spin" aria-hidden /> Yosikkiren…</p>}
        {error && <p role="alert" className="rounded-xl bg-bad-soft p-3 text-sm text-bad">{error}</p>}
        <div ref={endRef} />
      </div>

      <form className="border-t border-line p-3" onSubmit={(e) => { e.preventDefault(); void send(text) }}>
        <label htmlFor="chat-in" className="sr-only">Your question</label>
        <div className="flex items-end gap-2">
          <textarea
            id="chat-in" ref={inputRef} value={text} rows={2} maxLength={MAX_CHAT_CHARS} 
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send(text) } }}
            placeholder="Unga question-ai inga type pannunga…"
            className="min-h-12 flex-1 resize-none rounded-xl border border-line bg-bg p-2 text-sm"
          />
          <Btn type="submit" disabled={busy || text.trim() === ''} aria-label="Send question"><Send size={16} aria-hidden /></Btn>
        </div>
        <p className="mt-1 text-[11px] text-muted">{ai ? 'AI answers can be wrong. Check with your lesson notes. Do not share personal details.' : 'Answers come straight from the course notes.'}</p>
      </form>
    </section>
  )
}
