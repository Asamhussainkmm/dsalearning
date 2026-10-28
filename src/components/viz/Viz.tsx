import type { VizId } from '../../types'
import { SortPlayer } from './SortPlayer'
import { Array2dViz, ArrayViz, BigOViz, BstViz, CircularQueueViz, LinkedListViz, QueueViz, StackViz } from './StructViz'

export const VIZ_TITLES: Record<VizId, string> = {
  array: 'Array', array2d: '2D Array', linearSearch: 'Linear Search', binarySearch: 'Binary Search', bubbleSort: 'Bubble Sort',
  selectionSort: 'Selection Sort', insertionSort: 'Insertion Sort', stack: 'Stack', queue: 'Queue', circularQueue: 'Circular Queue',
  linkedList: 'Linked List', bst: 'Binary Search Tree', bigO: 'Big O Growth',
}

export function Viz({ id }: { id: VizId }) {
  switch (id) {
    case 'array': return <ArrayViz />
    case 'array2d': return <Array2dViz />
    case 'stack': return <StackViz />
    case 'queue': return <QueueViz />
    case 'circularQueue': return <CircularQueueViz />
    case 'linkedList': return <LinkedListViz />
    case 'bst': return <BstViz />
    case 'bigO': return <BigOViz />
    default: return <SortPlayer kind={id} />
  }
}
