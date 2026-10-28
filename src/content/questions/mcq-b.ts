import { mcq } from './bank'

// ---------- M4: Linked list ----------
mcq('m4-q1', 'm4', 'What does each node of a singly linked list contain?', ['Only data', 'Data and a reference to the next node', 'Data and an index', 'Two arrays'], 1,
  'Node = data + next reference.', 'A singly linked node stores its data and a reference to the following node.')
mcq('m4-q2', 'm4', 'What is the time complexity of addFront on a singly linked list (with a head reference)?', ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], 0,
  'Pudhu node-ai head-oda link panna mattum: oru sila steps. O(1).', 'No traversal is needed: link the new node to the old head and move head.')
mcq('m4-q3', 'm4', 'In addFront, which order of operations is correct?', ['head = node; node.next = head', 'node.next = head; head = node', 'node.next = null; head = null', 'head.next = node; node = head'], 1,
  'Mudhalla pudhu node-ai paazhaya head-oda link; apuram head-ai maathu.', 'If head is changed first, the reference to the old list is lost and the node points to itself.')
mcq('m4-q4', 'm4', 'When deleting a node in the middle of a singly linked list, what must be updated?', ['The previous node\'s next reference', 'The head reference always', 'Every node in the list', 'Nothing'], 0,
  'previous.next = current.next. Current node-ai skip panrom.', 'Linking the previous node to the deleted node\'s successor removes it from the chain.')
mcq('m4-q5', 'm4', 'Which is the correct condition to traverse a whole list starting at head?', ['while (current.next != null)', 'while (current != null)', 'while (head != null)', 'for (i = 0; i < head; i++)'], 1,
  '`current != null`: kadaisi node-oda next null, adhai thaandiyum nillunga. (head-ai maathuna list poidum.)', 'Checking current != null visits every node including the last; moving head would lose the list.')
mcq('m4-q6', 'm4', 'State one advantage of a linked list over an array.', ['Constant-time access by index', 'Dynamic size and no shifting for insertions and deletions', 'Uses less memory per element', 'Better CPU cache usage'], 1,
  'Linked list dynamic; insert/delete-ku shifting illa. Index access slow.', 'Nodes are allocated as needed and re-linking replaces element shifting.')
mcq('m4-q7', 'm4', 'What is the time complexity of getting the element at position i in a singly linked list?', ['O(1)', 'O(n)', 'O(log n)', 'O(i²)'], 1,
  'Head-la irundhu i nodes follow pannanum.', 'There is no direct addressing, so up to n nodes must be traversed.')
mcq('m4-q8', 'm4', 'What is stored in the next reference of the last node of a singly linked list?', ['The head', 'null', 'Its own address', 'The first data value'], 1,
  'Kadaisi node: next = null.', 'null marks the end of the list.')

// ---------- M5: Stack ----------
mcq('m5-q1', 'm5', 'Which principle does a stack follow?', ['FIFO', 'LIFO', 'Random access', 'Sorted order'], 1,
  'Stack = Last In First Out.', 'The most recently pushed element is the first to be popped.')
mcq('m5-q2', 'm5', 'What is stack underflow?', ['Pushing onto a full stack', 'Popping from an empty stack', 'Peeking at a full stack', 'Creating a stack with size 0'], 1,
  'Underflow = kaaliyaana stack-la pop. Overflow = nirambina stack-la push.', 'Underflow occurs when you remove from an empty stack.')
mcq('m5-q3', 'm5', 'An array-based stack of size 4 with top = -1 is:', ['Full', 'Empty', 'Holding one element', 'Invalid'], 1,
  'top = -1 → empty. top = size-1 → full.', 'top is -1 before any push.')
mcq('m5-q4', 'm5', 'Starting with an empty stack, what is the stack (bottom to top) after: push(10), push(12), push(15), pop(), push(90)?', ['[10, 12, 15, 90]', '[10, 12, 90]', '[12, 90]', '[10, 90]'], 1,
  '15-ai pop pannitom; apuram 90 push. Result 10, 12, 90.', 'pop removes the last pushed value (15), then 90 is added on top of 10 and 12.')
mcq('m5-q5', 'm5', 'Which task is naturally solved with a stack?', ['Serving print jobs in arrival order', 'Checking whether brackets are balanced', 'Finding the largest array element', 'Binary searching a sorted array'], 1,
  'Brackets match: last opened = first closed → stack. Print jobs = queue.', 'Matching nested brackets requires the most recent unmatched opening bracket, a LIFO behaviour.')
mcq('m5-q6', 'm5', 'What is the main advantage of implementing a stack with a linked list instead of an array?', ['Faster indexing', 'No fixed capacity, so no overflow from a preset size', 'Uses less memory per element', 'It makes the stack FIFO'], 1,
  'Linked list stack-la size limit illa.', 'Nodes are allocated on demand, so the stack can grow as long as memory is available.')
mcq('m5-q7', 'm5', 'In Java\'s java.util.Stack, which method returns the top element without removing it?', ['pop()', 'peek()', 'push()', 'search()'], 1,
  '`peek()` paarkka mattum; `pop()` neekkum.', 'peek reads the top element; pop removes it.')
mcq('m5-q8', 'm5', 'What is the time complexity of push and pop in an array-based stack?', ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'], 0,
  'Top-la mattum velai: O(1).', 'Both operations only change the top index and one array slot.')

// ---------- M6: Queue ----------
mcq('m6-q1', 'm6', 'Which principle does a queue follow?', ['LIFO', 'FIFO', 'Sorted', 'Random'], 1,
  'Queue = First In First Out.', 'The element that has waited longest is removed first.')
mcq('m6-q2', 'm6', 'Why does an array-based queue need two variables, front and rear?', ['Because elements are inserted at one end and removed from the other end', 'Because arrays have two dimensions', 'Because Java requires two variables', 'To store the size'], 0,
  'Rendu munai-la velai: serkka rear, neekka front.', 'Insertions happen at the rear and deletions at the front, so both positions must be tracked.')
mcq('m6-q3', 'm6', 'In the lecture\'s linear array queue (front = rear = -1 initially), the queue is empty when:', ['rear == size - 1', 'front == rear', 'front == 0', 'rear == 0'], 1,
  'front == rear → empty. rear == size-1 → full.', 'When no elements lie between front and rear the queue is empty.')
mcq('m6-q4', 'm6', 'A linear array queue of size 5 had 10, 20, 30 enqueued, 10 dequeued, and then 40 and 50 enqueued. What happens on enqueue(60)?', ['It succeeds because there are only 4 elements', 'It reports Full because rear reached the last index', 'It overwrites 20', 'It throws a compile error'], 1,
  'rear = 4 (last index) so "Full", index 0 free-aa irundhaalum. Idhu thaan linear queue-oda kuraai.', 'Freed slots before front cannot be reused in a linear queue; a circular queue fixes this.')
mcq('m6-q5', 'm6', 'In a circular queue of capacity 6, rear is 5 and one more element is enqueued. What is the new rear?', ['6', '0', '5', '-1'], 1,
  '(5 + 1) % 6 = 0. Wrap-around.', 'The modulo operation wraps the index back to the start of the array.')
mcq('m6-q6', 'm6', 'A circular queue (capacity 6) starts with front = rear = size = 0. After enQueue(10), enQueue(17), deQueue(), enQueue(3), what are front, rear and size?', ['front = 1, rear = 3, size = 2', 'front = 0, rear = 3, size = 3', 'front = 1, rear = 2, size = 1', 'front = 2, rear = 3, size = 1'], 0,
  'rear 3 times enqueue → 3; front 1 dequeue → 1; size = 3 - 1 = 2.', 'Three enqueues move rear to 3, one dequeue moves front to 1, and size is 3 - 1 = 2.')
mcq('m6-q7', 'm6', 'Which Java collection method adds an element to the rear of a Queue?', ['poll()', 'offer()', 'peek()', 'pop()'], 1,
  '`offer` = enqueue; `poll` = dequeue; `peek` = front paarkka.', 'offer inserts at the tail; poll removes from the head.')
mcq('m6-q8', 'm6', 'Which real-life situation is best modelled by a queue?', ['Undo history in an editor', 'Print jobs waiting for a printer', 'Browser back button', 'Evaluating nested function calls'], 1,
  'Printer jobs = first come first served = queue.', 'Print spooling serves jobs in arrival order.')

// ---------- M7: Trees ----------
mcq('m7-q1', 'm7', 'In a tree, a node with no children is called a:', ['Root', 'Leaf', 'Parent', 'Sibling'], 1,
  'Children illaadha node = leaf.', 'Leaf nodes (terminal nodes) have degree 0.')
mcq('m7-q2', 'm7', 'The height of a tree is:', ['The total number of nodes', 'The maximum depth of any node (edges from the root)', 'The number of leaves', 'The degree of the root'], 1,
  'Height = root-la irundhu kadaisi leaf varaikkum longest path (edges).', 'Height is the largest depth among all nodes, measured in edges.')
mcq('m7-q3', 'm7', 'What is the inorder traversal of a binary tree?', ['Root, Left, Right', 'Left, Root, Right', 'Left, Right, Root', 'Right, Root, Left'], 1,
  'In-order: Left → Root → Right.', 'Inorder visits the left subtree, then the node, then the right subtree.')
mcq('m7-q4', 'm7', 'In the array representation of a binary tree with the root at index 0, where is the left child of the node at index i?', ['i + 1', '2i + 1', '2i + 2', 'i / 2'], 1,
  'Left = 2i+1, right = 2i+2.', 'The array layout places children at 2i + 1 and 2i + 2.')
mcq('m7-q5', 'm7', 'Which rule defines a Binary Search Tree?', ['Every node has exactly two children', 'Left subtree values are smaller and right subtree values are larger than the node', 'The tree is always perfectly balanced', 'Values are stored in an array'], 1,
  'BST: left < node < right.', 'This ordering property makes search fast on a balanced tree.')
mcq('m7-q6', 'm7', 'Insert 23, 33, 45, 30, 10 into an empty BST in that order. Which node is the left child of 33?', ['10', '30', '45', '23'], 1,
  '30 > 23 and 30 < 33 → 33-oda left.', '30 is greater than the root 23, so it goes right, and smaller than 33, so it becomes 33\'s left child.')
mcq('m7-q7', 'm7', 'When deleting a BST node that has two children, which value commonly replaces it?', ['The smallest value in its right subtree (inorder successor)', 'The root', 'The largest value in the whole tree', 'Zero'], 0,
  'Right subtree-la smallest (inorder successor) allathu left-la largest.', 'The inorder successor keeps the BST ordering intact.')
mcq('m7-q8', 'm7', 'What is the worst-case time complexity of searching in an unbalanced BST with n nodes?', ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], 2,
  'Skewed tree = linked list maadhiri: O(n).', 'If all nodes are on one side the height is n - 1, so search may visit every node.')
mcq('m7-q9', 'm7', 'How many nodes does a perfect binary tree of height 3 have?', ['7', '8', '15', '16'], 2,
  '2^(h+1) - 1 = 2^4 - 1 = 15.', 'Levels 0 to 3 hold 1 + 2 + 4 + 8 = 15 nodes.')
mcq('m7-q10', 'm7', 'What is an AVL tree?', ['A tree stored in an array', 'A self-balancing BST in which heights of left and right subtrees differ by at most one', 'A tree with only left children', 'A heap'], 1,
  'AVL = self-balancing BST; balance factor -1, 0, +1.', 'AVL trees use rotations to keep the balance factor of every node within -1..1.')
