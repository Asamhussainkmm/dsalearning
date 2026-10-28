export interface RevisionCard {
  moduleId: string
  title: string
  points: string[]
}

/** Quick definitions and reminders for the Revision Centre (all drawn from the lessons). */
export const definitions: { term: string; meaning: string; moduleId: string }[] = [
  { term: 'Data structure', meaning: 'A way of organising and storing data so it can be used efficiently.', moduleId: 'm1' },
  { term: 'Algorithm', meaning: 'A finite, step-by-step set of instructions that solves a problem.', moduleId: 'm1' },
  { term: 'ADT', meaning: 'Abstract Data Type: data plus the operations on it, with the implementation hidden.', moduleId: 'm1' },
  { term: 'Array', meaning: 'Fixed-size collection of same-type elements, accessed by index (0-based).', moduleId: 'm2' },
  { term: 'Generics', meaning: 'Classes and methods that work with a type given later, e.g. ArrayList<String>.', moduleId: 'm3' },
  { term: 'Node', meaning: 'A linked-list element holding data and a reference to the next node.', moduleId: 'm4' },
  { term: 'Head', meaning: 'Reference to the first node of a linked list; null means an empty list.', moduleId: 'm4' },
  { term: 'Stack', meaning: 'LIFO structure: push and pop happen at the top.', moduleId: 'm5' },
  { term: 'Overflow / Underflow', meaning: 'Push on a full stack / pop on an empty stack.', moduleId: 'm5' },
  { term: 'Queue', meaning: 'FIFO structure: enqueue at the rear, dequeue from the front.', moduleId: 'm6' },
  { term: 'Circular queue', meaning: 'Array queue whose indexes wrap around with % so freed slots are reused.', moduleId: 'm6' },
  { term: 'Tree / Root / Leaf', meaning: 'A hierarchy of nodes; the root is the top node, a leaf has no children.', moduleId: 'm7' },
  { term: 'BST', meaning: 'Binary tree where left < node < right for every node.', moduleId: 'm7' },
  { term: 'Big O', meaning: 'Upper bound on how running time (or space) grows with input size n.', moduleId: 'm8' },
  { term: 'Linear search', meaning: 'Check elements one by one: O(n).', moduleId: 'm9' },
  { term: 'Binary search', meaning: 'Halve a sorted range each step: O(log n).', moduleId: 'm9' },
  { term: 'Selection sort', meaning: 'Repeatedly swap the smallest remaining element into place: O(n²).', moduleId: 'm10' },
  { term: 'Insertion sort', meaning: 'Insert each element into the sorted part on its left: O(n²), O(n) if nearly sorted.', moduleId: 'm10' },
  { term: 'Bubble sort', meaning: 'Swap adjacent out-of-order pairs; the largest bubbles to the end: O(n²).', moduleId: 'm10' },
]

export const syntaxReminders: { title: string; code: string }[] = [
  { title: 'Read input', code: 'Scanner sc = new Scanner(System.in);\nint n = sc.nextInt();\nString w = sc.next();' },
  { title: 'Array', code: 'int[] a = new int[5];\nint[][] m = new int[3][4];\nint len = a.length;' },
  { title: 'ArrayList', code: 'ArrayList<Integer> list = new ArrayList<>();\nlist.add(5);\nint x = list.get(0);\nlist.size();' },
  { title: 'Linked-list node', code: 'class Node {\n    int data;\n    Node next;\n    Node(int data) { this.data = data; }\n}' },
  { title: 'Stack & Queue', code: 'Stack<Integer> st = new Stack<>();\nst.push(1); st.pop(); st.peek();\nQueue<Integer> q = new LinkedList<>();\nq.offer(1); q.poll(); q.peek();' },
  { title: 'Swap two array items', code: 'int t = a[i];\na[i] = a[j];\na[j] = t;' },
  { title: 'Binary search loop', code: 'int lo = 0, hi = n - 1;\nwhile (lo <= hi) {\n    int mid = (lo + hi) / 2;\n    if (a[mid] == x) return mid;\n    else if (a[mid] < x) lo = mid + 1;\n    else hi = mid - 1;\n}' },
]

export const commonMistakes: string[] = [
  'Using = instead of == in a condition.',
  'Arrays start at index 0, so the last index is length - 1.',
  'Dividing two ints throws away the decimal part (10 / 3 is 3).',
  'Forgetting to update the loop variable and creating an infinite loop.',
  'Changing head before linking the new node, which loses the rest of the list.',
  'Popping or dequeuing without checking for an empty stack or queue.',
  'Using binary search on an array that is not sorted.',
  'Shifting array elements from the front when inserting; shift from the end.',
  'Comparing Integer objects with == instead of equals() or unboxing them first.',
  'Confusing the BST rule: left is smaller, right is larger.',
]
