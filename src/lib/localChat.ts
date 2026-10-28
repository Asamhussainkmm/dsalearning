import type { Lesson, Mcq } from '../types'
import { definitions } from '../content/revision'

/**
 * Offline "DSA Buddy": searches the course's own notes (lesson text, key terms, summaries, quiz
 * explanations, definitions). It does NOT generate new text, so it cannot invent facts, and it needs no server.
 */

export interface LocalHit { title: string; text: string; to: string }
export interface LocalAnswer { hits: LocalHit[] }

interface Entry extends LocalHit { tokens: Set<string> }

const STOP = new Set(['a', 'an', 'the', 'is', 'are', 'what', 'how', 'why', 'does', 'do', 'of', 'in', 'to', 'and', 'or', 'for', 'me', 'about', 'explain', 'tell', 'na', 'enna', 'eppadi', 'yen', 'sollunga', 'solluga', 'pathi', 'oru', 'idhu', 'adhu', 'epdi', 'ean', 'simple', 'simply', 'aa', 'ah', 'la', 'ku', 'ai', 'can', 'you', 'i', 'my', 'with', 'use', 'work', 'works', 'meaning', 'velai', 'seiyum', 'seiyudhu', 'seiyudhu', 'panradhu', 'panra', 'pannum', 'panna', 'pannunga', 'irukku', 'irukkum', 'irukkaa', 'varum', 'vendum', 'thevai', 'sollu', 'purila', 'puriyala', 'purinjukka', 'theriyala', 'thaan', 'dhaan', 'than', 'ennanu', 'enna', 'example', 'please', 'help', 'doubt'])

/** Course topic words: matching one of these matters far more than matching filler words. */
const TOPIC = new Set(['stack', 'queue', 'array', 'list', 'tree', 'sort', 'search', 'binary', 'linear', 'bubble', 'selection', 'insertion', 'node', 'big', 'loop', 'generic', 'arraylist', 'circular', 'algorithm', 'abstract', 'adt', 'recursion', 'java', 'class', 'object', 'method', 'variable', 'bst', 'avl', 'traversal', 'inorder', 'preorder', 'postorder', 'leaf', 'root', 'height', 'swap', 'index'])

const ALIASES: Record<string, string> = {
  lifo: 'stack', fifo: 'queue', push: 'stack', pop: 'stack', peek: 'stack', enqueue: 'queue', dequeue: 'queue',
  bst: 'tree', binary: 'binary', node: 'node', head: 'node', nodes: 'node', bigo: 'big', complexity: 'big', arrays: 'array',
  lists: 'list', sorting: 'sort', sorted: 'sort', searching: 'search', loops: 'loop', recursion: 'recursion', generics: 'generic',
}

/** Light plural stripping (lists → list, queues → queue); keeps short words intact. */
const stem = (w: string) => (w.length > 4 && w.endsWith('es') ? w.slice(0, -2) : w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w)

export const tokenize = (s: string): string[] =>
  s.toLowerCase().replace(/\*\*|`/g, ' ').replace(/[^a-z0-9+#]+/g, ' ').split(' ')
    .filter((w) => !STOP.has(w))
    .map((w) => ALIASES[w] ?? stem(w))
    .filter((w) => w.length > 1 && !STOP.has(w))

const clip = (s: string, n = 320) => {
  const t = s.replace(/\*\*|`/g, '').replace(/\s+/g, ' ').trim()
  return t.length <= n ? t : t.slice(0, n).replace(/\s+\S*$/, '') + '…'
}

export function buildIndex(lessons: Lesson[], mcqs: Mcq[]): Entry[] {
  const out: Entry[] = []
  const add = (title: string, text: string, to: string, extra = '') => out.push({ title, text: clip(text), to, tokens: new Set(tokenize(`${title} ${text} ${extra}`)) })
  for (const l of lessons) {
    const to = `/learn/${l.id}`
    add(l.title, l.summary.join(' '), to, l.objectives.join(' '))
    for (const b of l.blocks) {
      if (b.t === 'analogy') add(`${l.title}: ${b.title ?? 'Real-life example'}`, b.body, to)
      else if (b.t === 'simpler') add(`${l.title}: simple-aa`, b.body, to)
      else if (b.t === 'text') add(l.title, b.body, to)
      else if (b.t === 'terms') b.items.forEach((it) => add(it.term, it.meaning, to, l.title))
    }
  }
  for (const d of definitions) add(d.term, d.meaning, '/revision')
  for (const q of mcqs) add(`Quiz: ${q.question.split('\n')[0]}`, `${q.tanglish} ${q.why}`, `/quizzes?module=${q.moduleId}`)
  return out
}

export function searchIndex(index: Entry[], question: string, max = 3): LocalAnswer {
  const q = [...new Set(tokenize(question))]
  if (q.length === 0) return { hits: [] }
  const df = new Map<string, number>()
  for (const e of index) for (const t of q) if (e.tokens.has(t)) df.set(t, (df.get(t) ?? 0) + 1)
  const scored = index
    .map((e) => {
      let score = 0
      let matched = 0
      for (const t of q) {
        if (!e.tokens.has(t)) continue
        matched++
        score += Math.log(1 + index.length / (df.get(t) ?? 1)) * (TOPIC.has(t) ? 3 : 1)
      }
      if (matched === 0) return { e, score: 0 }
      const titleTokens = tokenize(e.title)
      const titleBonus = q.some((t) => titleTokens.includes(t)) ? 1.5 : 0
      // A title about extra topics the student did not mention ("Binary Search Tree" for "binary search") is a weaker match.
      const extraTopics = titleTokens.filter((t) => TOPIC.has(t) && !q.includes(t)).length
      const title = e.title.toLowerCase()
      const phrase = q.slice(0, -1).some((t, i) => title.includes(`${t} ${q[i + 1]}`)) ? 3 : 0
      return { e, score: score * (matched / q.length + 0.5) + titleBonus + phrase - 1.2 * extraTopics }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
  const hits: LocalHit[] = []
  const seen = new Set<string>()
  for (const { e } of scored) {
    const key = e.text.slice(0, 60)
    if (seen.has(key)) continue
    seen.add(key)
    hits.push({ title: e.title, text: e.text, to: e.to })
    if (hits.length >= max) break
  }
  return { hits }
}
