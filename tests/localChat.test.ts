import { describe, expect, it } from 'vitest'
import { buildIndex, searchIndex, tokenize } from '../src/lib/localChat'
import { lessons, mcqs } from '../src/content'

const index = buildIndex(lessons, mcqs)
const top = (q: string) => searchIndex(index, q).hits

describe('offline DSA Buddy search', () => {
  it('tokenizes Tanglish and English questions, dropping filler words', () => {
    expect(tokenize('Stack na enna?')).toEqual(['stack'])
    expect(tokenize('How does binary search work')).toEqual(['binary', 'search'])
  })
  it('finds the right lesson for common questions', () => {
    expect(top('stack na enna').some((h) => h.to.startsWith('/learn/m5'))).toBe(true)
    expect(top('binary search eppadi velai seiyum').some((h) => h.to.startsWith('/learn/m9'))).toBe(true)
    expect(top('what is bubble sort').some((h) => h.to.startsWith('/learn/m10'))).toBe(true)
    expect(top('linked list node').some((h) => h.to.startsWith('/learn/m4'))).toBe(true)
  })
  it('returns nothing for unrelated or empty questions instead of guessing', () => {
    expect(top('')).toEqual([])
    expect(top('who won the cricket world cup')).toEqual([])
  })
  it('never returns more than 3 results or duplicates', () => {
    const h = top('array')
    expect(h.length).toBeLessThanOrEqual(3)
    expect(new Set(h.map((x) => x.text)).size).toBe(h.length)
  })
})
