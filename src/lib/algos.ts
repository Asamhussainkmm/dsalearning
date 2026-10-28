/** Pure, testable algorithm engines. Each returns the list of frames a visualization plays back. */

export type Mark = 'compare' | 'swap' | 'found' | 'sorted' | 'range' | 'key' | 'min'

export interface Frame {
  arr: number[]
  marks: Record<number, Mark>
  msg: string
  pointers?: Record<string, number>
}

const snap = (arr: number[], marks: Record<number, Mark>, msg: string, pointers?: Record<string, number>): Frame => ({
  arr: arr.slice(),
  marks: { ...marks },
  msg,
  pointers: pointers ? { ...pointers } : undefined,
})

export function linearSearchFrames(input: number[], target: number): Frame[] {
  const arr = input.slice()
  const f: Frame[] = [snap(arr, {}, `Target = ${target}. Index 0-la irundhu ovvoru box-aiyum order-la check panrom.`)]
  for (let i = 0; i < arr.length; i++) {
    f.push(snap(arr, { [i]: 'compare' }, `Index ${i}: arr[${i}] = ${arr[i]}. ${arr[i]} == ${target} ah? ${arr[i] === target ? 'Aama!' : 'Illa, adutha box-ku pogalam.'}`, { i }))
    if (arr[i] === target) {
      f.push(snap(arr, { [i]: 'found' }, `Found! ${target} index ${i}-la irukku. Loop stop aagum.`, { i }))
      return f
    }
  }
  f.push(snap(arr, {}, `Ella boxes-um check pannitom. ${target} kidaikala, so result = -1 (not found).`))
  return f
}

export function binarySearchFrames(input: number[], target: number): Frame[] {
  const arr = input.slice().sort((a, b) => a - b)
  const f: Frame[] = [snap(arr, {}, `Binary search-ku array sorted-ah irukkanum. Sorted array: [${arr.join(', ')}]. Target = ${target}.`)]
  let left = 0
  let right = arr.length - 1
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const range: Record<number, Mark> = {}
    for (let i = left; i <= right; i++) range[i] = 'range'
    f.push(snap(arr, { ...range, [mid]: 'compare' }, `left=${left}, right=${right}, mid=(${left}+${right})/2=${mid}. arr[mid]=${arr[mid]}.`, { left, right, mid }))
    if (arr[mid] === target) {
      f.push(snap(arr, { [mid]: 'found' }, `${arr[mid]} == ${target}. Found at index ${mid}!`, { mid }))
      return f
    }
    if (target < arr[mid]) {
      f.push(snap(arr, { ...range, [mid]: 'compare' }, `${target} < ${arr[mid]}, so target left half-la irukkum. right = mid-1 = ${mid - 1}. Right half-ai thookiduvom.`, { left, right, mid }))
      right = mid - 1
    } else {
      f.push(snap(arr, { ...range, [mid]: 'compare' }, `${target} > ${arr[mid]}, so target right half-la irukkum. left = mid+1 = ${mid + 1}. Left half-ai thookiduvom.`, { left, right, mid }))
      left = mid + 1
    }
  }
  f.push(snap(arr, {}, `left > right aayiduchu. Search range empty. ${target} array-la illa, result = -1.`))
  return f
}

export function bubbleSortFrames(input: number[]): Frame[] {
  const a = input.slice()
  const f: Frame[] = [snap(a, {}, 'Bubble sort: pakkathula irukkura rendu items-ai compare panni, thappa irundha swap panrom. Periya value "bubble" maadhiri right-ku pogum.')]
  const sorted: Record<number, Mark> = {}
  for (let pass = 0; pass < a.length - 1; pass++) {
    let swapped = false
    for (let j = 0; j < a.length - 1 - pass; j++) {
      f.push(snap(a, { ...sorted, [j]: 'compare', [j + 1]: 'compare' }, `Pass ${pass + 1}: a[${j}]=${a[j]} and a[${j + 1}]=${a[j + 1]} compare panrom.`, { j }))
      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        swapped = true
        f.push(snap(a, { ...sorted, [j]: 'swap', [j + 1]: 'swap' }, `${a[j + 1]} > ${a[j]}, so swap pannitom.`, { j }))
      }
    }
    sorted[a.length - 1 - pass] = 'sorted'
    f.push(snap(a, sorted, `Pass ${pass + 1} mudinjidhu. ${a[a.length - 1 - pass]} ippo correct position-la irukku.`))
    if (!swapped) {
      for (let i = 0; i < a.length; i++) sorted[i] = 'sorted'
      f.push(snap(a, sorted, 'Intha pass-la swap ethuvum nadakkala, so array already sorted. Mudinjidhu!'))
      return f
    }
  }
  const all: Record<number, Mark> = {}
  for (let i = 0; i < a.length; i++) all[i] = 'sorted'
  f.push(snap(a, all, 'Sorted! Ella items-um correct position-la irukku.'))
  return f
}

export function selectionSortFrames(input: number[]): Frame[] {
  const a = input.slice()
  const f: Frame[] = [snap(a, {}, 'Selection sort: unsorted part-la smallest value-ai kandupidichu, adhai munnadi irukkura position-ku swap panrom.')]
  const sorted: Record<number, Mark> = {}
  for (let i = 0; i < a.length - 1; i++) {
    let min = i
    f.push(snap(a, { ...sorted, [min]: 'min' }, `Position ${i}-ku smallest value thedurom. Ippodhaikku min = index ${min} (${a[min]}).`, { i, min }))
    for (let j = i + 1; j < a.length; j++) {
      f.push(snap(a, { ...sorted, [min]: 'min', [j]: 'compare' }, `a[${j}]=${a[j]} < a[${min}]=${a[min]} ah? ${a[j] < a[min] ? 'Aama, new min!' : 'Illa.'}`, { i, min, j }))
      if (a[j] < a[min]) {
        min = j
        f.push(snap(a, { ...sorted, [min]: 'min' }, `Pudhu minimum = ${a[min]} (index ${min}).`, { i, min }))
      }
    }
    if (min !== i) {
      ;[a[i], a[min]] = [a[min], a[i]]
      f.push(snap(a, { ...sorted, [i]: 'swap', [min]: 'swap' }, `Smallest ${a[i]}-ai index ${i}-ku swap pannitom.`, { i, min }))
    } else {
      f.push(snap(a, { ...sorted }, `${a[i]} already correct position-la irukku, swap thevai illa.`))
    }
    sorted[i] = 'sorted'
  }
  const all: Record<number, Mark> = {}
  for (let i = 0; i < a.length; i++) all[i] = 'sorted'
  f.push(snap(a, all, 'Sorted! Ella items-um correct position-la irukku.'))
  return f
}

export function insertionSortFrames(input: number[]): Frame[] {
  const a = input.slice()
  const f: Frame[] = [snap(a, {}, 'Insertion sort: left side sorted part. Ovvoru pudhu item-aiyum sorted part-la correct idathula insert panrom (cards sort panra maadhiri).')]
  for (let k = 1; k < a.length; k++) {
    const temp = a[k]
    let i = k
    const sortedPart: Record<number, Mark> = {}
    for (let s = 0; s < k; s++) sortedPart[s] = 'sorted'
    f.push(snap(a, { ...sortedPart, [k]: 'key' }, `temp = a[${k}] = ${temp}. Idhai left sorted part-la correct idathula podanum.`, { k }))
    while (i > 0 && a[i - 1] > temp) {
      f.push(snap(a, { [i]: 'key', [i - 1]: 'compare' }, `${a[i - 1]} > ${temp}, so ${a[i - 1]}-ai right-ku shift panrom.`, { k, i }))
      a[i] = a[i - 1]
      i--
      f.push(snap(a, { [i]: 'swap' }, `Shift mudinjidhu. Ippo hole index ${i}-la.`, { k, i }))
    }
    a[i] = temp
    const done: Record<number, Mark> = {}
    for (let s = 0; s <= k; s++) done[s] = 'sorted'
    f.push(snap(a, { ...done, [i]: 'key' }, `${temp}-ai index ${i}-la insert pannitom. Sorted part ippo index 0 to ${k}.`, { k, i }))
  }
  const all: Record<number, Mark> = {}
  for (let i = 0; i < a.length; i++) all[i] = 'sorted'
  f.push(snap(a, all, 'Sorted! Mudinjidhu.'))
  return f
}

// ---------- Stack ----------
export interface StackState { items: number[]; size: number; top: number }
export const stackNew = (size: number): StackState => ({ items: [], size, top: -1 })
export function stackPush(s: StackState, v: number): { state: StackState; msg: string; ok: boolean } {
  if (s.items.length >= s.size) return { state: s, ok: false, msg: 'Stack is Full (overflow). Idhukku mela push panna mudiyadhu.' }
  const items = [...s.items, v]
  return { state: { ...s, items, top: items.length - 1 }, ok: true, msg: `push(${v}): top++ → top=${items.length - 1}, stk[top]=${v}.` }
}
export function stackPop(s: StackState): { state: StackState; msg: string; ok: boolean; value?: number } {
  if (s.items.length === 0) return { state: s, ok: false, msg: 'Stack is Empty (underflow). Remove panna ethuvum illa.' }
  const value = s.items[s.items.length - 1]
  const items = s.items.slice(0, -1)
  return { state: { ...s, items, top: items.length - 1 }, ok: true, value, msg: `pop(): top-la irundha ${value}-ai edukkurom. top-- → top=${items.length - 1}.` }
}

// ---------- Linear queue (array, front/rear as in the lecture) ----------
export interface QueueState { que: (number | null)[]; front: number; rear: number }
export const queueNew = (size: number): QueueState => ({ que: Array(size).fill(null), front: -1, rear: -1 })
export function queueEnqueue(s: QueueState, v: number): { state: QueueState; msg: string; ok: boolean } {
  if (s.rear >= s.que.length - 1) return { state: s, ok: false, msg: 'Queue is Full (rear array-in kadaisi index-ai thottuduchu). Munnadi dequeue pannina idam free aagum, aana linear queue-la adhai reuse panna mudiyadhu. Adhukku thaan circular queue.' }
  const que = s.que.slice()
  const rear = s.rear + 1
  que[rear] = v
  return { state: { que, front: s.front, rear }, ok: true, msg: `enqueue(${v}): rear++ → rear=${rear}, que[rear]=${v}.` }
}
export function queueDequeue(s: QueueState): { state: QueueState; msg: string; ok: boolean; value?: number } {
  if (s.front === s.rear) return { state: s, ok: false, msg: 'Queue is Empty (front == rear).' }
  const que = s.que.slice()
  const front = s.front + 1
  const value = que[front] as number
  que[front] = null
  return { state: { que, front, rear: s.rear }, ok: true, value, msg: `dequeue(): front++ → front=${front}. ${value}-ai remove pannitom.` }
}

// ---------- Circular queue (size counter) ----------
export interface CircState { que: (number | null)[]; front: number; rear: number; size: number }
export const circNew = (cap: number): CircState => ({ que: Array(cap).fill(null), front: 0, rear: 0, size: 0 })
export function circEnqueue(s: CircState, v: number): { state: CircState; msg: string; ok: boolean } {
  const cap = s.que.length
  if (s.size === cap) return { state: s, ok: false, msg: 'Queue is Full (size == capacity).' }
  const que = s.que.slice()
  que[s.rear] = v
  const rear = (s.rear + 1) % cap
  return { state: { que, front: s.front, rear, size: s.size + 1 }, ok: true, msg: `enqueue(${v}): que[${s.rear}]=${v}. rear = (${s.rear}+1) % ${cap} = ${rear}${rear === 0 ? ' (wrap-around!)' : ''}. size=${s.size + 1}.` }
}
export function circDequeue(s: CircState): { state: CircState; msg: string; ok: boolean; value?: number } {
  const cap = s.que.length
  if (s.size === 0) return { state: s, ok: false, msg: 'Queue is Empty (size == 0).' }
  const que = s.que.slice()
  const value = que[s.front] as number
  que[s.front] = null
  const front = (s.front + 1) % cap
  return { state: { que, front, rear: s.rear, size: s.size - 1 }, ok: true, value, msg: `dequeue(): ${value}-ai remove pannitom. front = (${s.front}+1) % ${cap} = ${front}. size=${s.size - 1}.` }
}

// ---------- Singly linked list ----------
export const llAddFront = (l: number[], v: number) => [v, ...l]
export const llAddEnd = (l: number[], v: number) => [...l, v]
export function llRemove(l: number[], v: number): { list: number[]; removed: boolean } {
  const i = l.indexOf(v)
  if (i < 0) return { list: l, removed: false }
  return { list: [...l.slice(0, i), ...l.slice(i + 1)], removed: true }
}

// ---------- Binary Search Tree ----------
export interface BNode { v: number; l: BNode | null; r: BNode | null }
export const bstInsert = (n: BNode | null, v: number): BNode => {
  if (!n) return { v, l: null, r: null }
  if (v < n.v) return { ...n, l: bstInsert(n.l, v) }
  if (v > n.v) return { ...n, r: bstInsert(n.r, v) }
  return n // duplicates ignored (lecture assumes no duplicates)
}
export const bstBuild = (vals: number[]): BNode | null => vals.reduce<BNode | null>((t, v) => bstInsert(t, v), null)
export const inorder = (n: BNode | null): number[] => (n ? [...inorder(n.l), n.v, ...inorder(n.r)] : [])
export const preorder = (n: BNode | null): number[] => (n ? [n.v, ...preorder(n.l), ...preorder(n.r)] : [])
export const postorder = (n: BNode | null): number[] => (n ? [...postorder(n.l), ...postorder(n.r), n.v] : [])
export const bstHeight = (n: BNode | null): number => (n ? 1 + Math.max(bstHeight(n.l), bstHeight(n.r)) : -1)
export const bstSize = (n: BNode | null): number => (n ? 1 + bstSize(n.l) + bstSize(n.r) : 0)
export function bstSearchPath(n: BNode | null, v: number): { path: number[]; found: boolean } {
  const path: number[] = []
  let cur = n
  while (cur) {
    path.push(cur.v)
    if (v === cur.v) return { path, found: true }
    cur = v < cur.v ? cur.l : cur.r
  }
  return { path, found: false }
}

export interface Laid { v: number; x: number; y: number; px?: number; py?: number }
/** In-order x positions give a tidy non-overlapping layout. */
export function layoutTree(root: BNode | null): Laid[] {
  const out: Laid[] = []
  let x = 0
  const walk = (n: BNode | null, depth: number, parent?: { x: number; y: number }) => {
    if (!n) return
    walk(n.l, depth + 1, undefined)
    const me = { v: n.v, x: x++, y: depth }
    out.push(me)
    walk(n.r, depth + 1, undefined)
    void parent
  }
  walk(root, 0)
  // attach parent coordinates
  const pos = new Map(out.map((o) => [o.v, o]))
  const link = (n: BNode | null, p?: Laid) => {
    if (!n) return
    const me = pos.get(n.v)!
    if (p) {
      me.px = p.x
      me.py = p.y
    }
    link(n.l, me)
    link(n.r, me)
  }
  link(root)
  return out
}
