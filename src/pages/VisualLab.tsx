import { useState } from 'react'
import type { VizId } from '../types'
import { PageHeader } from '../components/Ui'
import { Viz, VIZ_TITLES } from '../components/viz/Viz'

const ORDER: VizId[] = ['array', 'array2d', 'linearSearch', 'binarySearch', 'bubbleSort', 'selectionSort', 'insertionSort', 'stack', 'queue', 'circularQueue', 'linkedList', 'bst', 'bigO']

export default function VisualLab() {
  const [id, setId] = useState<VizId>('linearSearch')
  return (
    <>
      <PageHeader title="Visual Lab" subtitle="Play with the data structures and algorithms. Change the numbers, step forward and backward, and read what happens at each step." />
      <div role="tablist" aria-label="Choose a visualization" className="mb-5 flex flex-wrap gap-2">
        {ORDER.map((v) => (
          <button
            key={v} role="tab" aria-selected={id === v} type="button" onClick={() => setId(v)}
            className={`min-h-10 rounded-full border px-4 text-sm font-medium ${id === v ? 'border-brand bg-brand text-brand-ink' : 'border-line bg-surface hover:bg-surface2'}`}
          >
            {VIZ_TITLES[v]}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-label={VIZ_TITLES[id]}><Viz key={id} id={id} /></div>
    </>
  )
}
