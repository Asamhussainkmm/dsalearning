import { mcq } from './bank'

// ---------- M8: Analysis ----------
mcq('m8-q1', 'm8', 'Why do we analyse algorithms?', ['To make the code longer', 'To compare alternatives and choose one that uses less time and memory', 'To avoid writing code', 'Because Java requires it'], 1,
  'Ore problem-ku pala algorithms; analysis best-ai theriyum.', 'Analysis predicts how running time and memory grow so the better algorithm can be chosen.')
mcq('m8-q2', 'm8', 'What is the Big O of F(n) = n³ + 4n² + 5?', ['O(n)', 'O(n²)', 'O(n³)', 'O(1)'], 2,
  'Periya power thaan: n³.', 'Drop lower-order terms and constants; n³ dominates for large n.')
mcq('m8-q3', 'm8', 'What is the time complexity of two nested loops that each run n times?', ['O(n)', 'O(2n)', 'O(n²)', 'O(log n)'], 2,
  'Nested = multiply: n × n.', 'The inner body executes n * n times.')
mcq('m8-q4', 'm8', 'What is the space complexity of a recursive factorial with input n (counting the call stack)?', ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], 1,
  'n recursive calls ore time-la stack-la.', 'Each pending call needs a stack frame, giving depth n.')
mcq('m8-q5', 'm8', 'Which ordering of complexities is correct from slowest growth to fastest growth?', ['O(n²) < O(n) < O(log n)', 'O(1) < O(log n) < O(n) < O(n²)', 'O(n) < O(1) < O(n²)', 'O(log n) < O(1) < O(n)'], 1,
  'Constant < log < linear < quadratic.', 'As n grows, 1 stays flat, log n grows slowly, n linearly, n² quickly.')
mcq('m8-q6', 'm8', 'Which notation represents an upper bound on running time?', ['Omega (Ω)', 'Big O (O)', 'Theta (Θ) only', 'Sigma (Σ)'], 1,
  'O = upper bound (worst case). Ω lower; Θ tight.', 'Big O says the algorithm will not take more than that growth rate.')
mcq('m8-q7', 'm8', 'What is the Big O of the loop below?\n\nfor (int i = 1; i < n; i *= 2) { count++; }', ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], 1,
  'i ovvoru thadavaiyum rendu madangu: log₂ n.', 'The loop variable doubles each time, so it runs about log2(n) times.')
mcq('m8-q8', 'm8', 'Why is measuring a program with a stopwatch not a reliable way to compare algorithms?', ['Time depends on the machine and other factors, while Big O describes growth with input size', 'Stopwatches are inaccurate', 'Algorithms have no running time', 'Java cannot be timed'], 0,
  'Machine speed maarum; Big O input size growth-ai solludhu.', 'Wall-clock time varies with hardware and load; asymptotic analysis does not.')

// ---------- M9: Searching ----------
mcq('m9-q1', 'm9', 'What does a linear search return when the target is not in the array?', ['0', '-1', 'The last index', 'It throws an exception'], 1,
  '-1 = not found convention (0 oru valid index).', 'Returning -1 distinguishes "not found" from index 0.')
mcq('m9-q2', 'm9', 'What is the worst-case time complexity of linear search?', ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], 2,
  'Kadaisi element allathu illa-na n comparisons.', 'Every element may be examined once.')
mcq('m9-q3', 'm9', 'What must be true before binary search can be used on an array?', ['The array must contain only positive numbers', 'The array must be sorted', 'The array must have an even length', 'The array must hold Strings'], 1,
  'Binary search-ku sorted array thevai.', 'Discarding half the range is only valid if the data is ordered.')
mcq('m9-q4', 'm9', 'Array: 10, 15, 25, 30, 33, 34, 36. Searching for 25 with binary search, which element is compared first?', ['10', '25', '30', '36'], 2,
  'left = 0, right = 6, mid = 3 → 30.', 'mid = (0 + 6) / 2 = 3 and a[3] = 30.')
mcq('m9-q5', 'm9', 'About how many comparisons does binary search need in the worst case for 1,000,000 sorted elements?', ['About 20', 'About 1,000', 'About 500,000', 'About 1,000,000'], 0,
  'log₂(1,000,000) ≈ 20.', 'Each comparison halves the range: 2^20 is about one million.')
mcq('m9-q6', 'm9', 'What is the best-case complexity of both linear and binary search?', ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'], 0,
  'Target mudhal / naduvula irundhaa oru comparison.', 'If the first (or middle) element is the target, one comparison suffices.')
mcq('m9-q7', 'm9', 'Which is the best method to find an item once in a small, unsorted array?', ['Binary search', 'Linear search', 'Sorting then binary search', 'Hashing is the only option'], 1,
  'Unsorted siriya data: linear search simple and enough.', 'Sorting first costs more than a single linear pass.')

// ---------- M10: Sorting ----------
mcq('m10-q1', 'm10', 'What is sorting?', ['Finding an element in an array', 'Arranging items in ascending or descending order', 'Deleting duplicate items', 'Copying an array'], 1,
  'Sorting = order-la arrange panradhu.', 'Sorting rearranges items according to an ordering.')
mcq('m10-q2', 'm10', 'After the first pass of bubble sort on 6, 7, 72, 4, 32, 65, 9, 56 (ascending), where is 72?', ['At index 0', 'At the last index', 'Unchanged at index 2', 'At index 3'], 1,
  'Pass 1-la periya value 72 kadaisi-ku "bubble" aagum.', 'Bubble sort moves the largest element to the end after the first pass.')
mcq('m10-q3', 'm10', 'What is the best-case time complexity of bubble sort with an early-exit flag on an already sorted array?', ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'], 1,
  'Oru pass-la swap illa → stop: n comparisons.', 'One pass without swaps proves the array is sorted.')
mcq('m10-q4', 'm10', 'What does selection sort do in each pass?', ['Swaps all adjacent out-of-order pairs', 'Finds the smallest remaining element and swaps it to its final position', 'Inserts the next element into a sorted part', 'Splits the array in half'], 1,
  'Selection = smallest-ai select panni munnaadi swap.', 'Selection sort repeatedly selects the minimum of the unsorted part.')
mcq('m10-q5', 'm10', 'What is the array after the first pass of selection sort on 65, 20, 40, 6, 15?', ['6, 20, 40, 65, 15', '20, 40, 6, 15, 65', '6, 15, 20, 40, 65', '15, 20, 40, 6, 65'], 0,
  'Minimum 6 ↔ index 0 (65). Result 6, 20, 40, 65, 15.', 'The minimum 6 is swapped with the element at index 0, which is 65.')
mcq('m10-q6', 'm10', 'Which sorting algorithm works like sorting playing cards in your hand?', ['Bubble sort', 'Selection sort', 'Insertion sort', 'Binary search'], 2,
  'Cards-ai ore ore-aa eduthu sorted part-la insert: insertion sort.', 'Insertion sort inserts each new element into the sorted part.')
mcq('m10-q7', 'm10', 'What is the worst-case time complexity of selection, bubble and insertion sort?', ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], 2,
  'Moonum worst case O(n²).', 'All three use nested loops over the data.')
mcq('m10-q8', 'm10', 'Which statement correctly justifies selection sort over bubble sort?', ['Selection sort makes at most n - 1 swaps while bubble sort can make O(n²) swaps', 'Selection sort has O(n) worst-case time', 'Selection sort is always stable', 'Bubble sort cannot sort negative numbers'], 0,
  'Rendum O(n²) comparisons; selection-ku swaps kuraivu.', 'Both are quadratic in comparisons, but selection sort performs far fewer swaps.')
