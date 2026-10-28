const WORKER = ((import.meta.env.VITE_AI_WORKER_URL as string | undefined) ?? '').replace(/\/$/, '')

export interface ChatMsg { role: 'user' | 'assistant'; content: string }

export const MAX_CHAT_CHARS = 800
export const MAX_HISTORY = 8 // must match the Worker limit

export const chatConfigured = () => WORKER.length > 0

export type ChatOutcome = { ok: true; reply: string } | { ok: false; message: string }

/** Splits a reply into text and fenced code parts so code can be shown as code and never as HTML. */
export function splitReply(text: string): { code: boolean; body: string }[] {
  const parts: { code: boolean; body: string }[] = []
  const re = /```[a-zA-Z]*\n?([\s\S]*?)```/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push({ code: false, body: text.slice(last, m.index) })
    parts.push({ code: true, body: m[1].replace(/\n$/, '') })
    last = re.lastIndex
  }
  if (last < text.length) parts.push({ code: false, body: text.slice(last) })
  return parts.filter((p) => p.body.trim().length > 0)
}

export async function askChat(history: ChatMsg[], lesson: string, signal?: AbortSignal): Promise<ChatOutcome> {
  if (!WORKER) return { ok: false, message: 'The chatbot is not enabled in this build (no AI Worker URL was configured).' }
  const messages = history.slice(-MAX_HISTORY).map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHAT_CHARS) }))
  try {
    const res = await fetch(`${WORKER}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, lesson: lesson.slice(0, 120) }),
      signal: signal ?? AbortSignal.timeout(30_000),
    })
    if (res.status === 429) return { ok: false, message: 'Too many questions in a short time. Wait a minute and ask again.' }
    if (!res.ok) return { ok: false, message: 'The chatbot is temporarily unavailable. Please try again later.' }
    const data = (await res.json()) as { reply?: unknown }
    if (typeof data.reply !== 'string' || data.reply.length === 0 || data.reply.length > 4000)
      return { ok: false, message: 'The chatbot returned an unreadable answer. Please ask again.' }
    return { ok: true, reply: data.reply }
  } catch (e) {
    if ((e as Error).name === 'AbortError') return { ok: false, message: 'Cancelled.' }
    return { ok: false, message: 'Could not reach the chatbot. Check your internet connection.' }
  }
}
