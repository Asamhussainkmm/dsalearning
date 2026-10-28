export function shuffle<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** order[displayIndex] = original option index */
export const shuffleOptions = (count: number, rand?: () => number): number[] => shuffle([...Array(count).keys()], rand)

/** Score answers. answers[id] = ORIGINAL option index chosen, or undefined when skipped. */
export function scoreAnswers(keys: Record<string, number>, answers: Record<string, number | undefined>) {
  let correct = 0
  const wrong: string[] = []
  const skipped: string[] = []
  for (const id of Object.keys(keys)) {
    const a = answers[id]
    if (a === undefined) skipped.push(id)
    else if (a === keys[id]) correct++
    else wrong.push(id)
  }
  return { correct, total: Object.keys(keys).length, wrong, skipped }
}

export const percent = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 100))
