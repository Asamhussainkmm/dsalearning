import { mcq } from './bank'

// ---------- M0: Java basics ----------
mcq('m0-q1', 'm0', 'What does System.out.println("Hi"); do?', ['Reads the word Hi from the keyboard', 'Prints Hi on the screen and moves to a new line', 'Stores Hi in a variable named println', 'Deletes the word Hi'], 1,
  '`println` screen-la text-ai print panni adutha line-ku pogum. Keyboard-la irundhu padikka Scanner thaan.', 'println is an output statement: it writes the text and then a newline character.')
mcq('m0-q2', 'm0', 'What is printed by the following code?\n\nint a = 10;\nint b = 3;\nSystem.out.println(a / b);', ['3.33', '3', '1', '10/3'], 1,
  'Rendu `int`-ai divide panna decimal part vittudum. 10 / 3 = 3. Remainder vendum-na `%`.', 'Integer division discards the fractional part, so 10 / 3 evaluates to 3.')
mcq('m0-q3', 'm0', 'Which condition correctly checks whether n is an even number?', ['n / 2 == 0', 'n = 2 % 0', 'n % 2 == 0', 'n % 2 = 0'], 2,
  'Even number-ai 2-aal bhaagicha meedhi 0. So `n % 2 == 0`. `=` assign, `==` compare.', 'The remainder when dividing by 2 is 0 for even numbers; == compares, = assigns.')
mcq('m0-q4', 'm0', 'How many times does the body of this loop run?\n\nfor (int i = 1; i <= 5; i++) { ... }', ['4', '5', '6', 'Infinite'], 1,
  'i = 1, 2, 3, 4, 5 → 5 thadavai. i = 6 aanadhum condition false.', 'The loop runs while i <= 5: for i = 1, 2, 3, 4 and 5, which is five iterations.')
mcq('m0-q5', 'm0', 'What is the purpose of a constructor in a Java class?', ['To delete an object', 'To set up (initialise) a new object when it is created', 'To print the class name', 'To import libraries'], 1,
  'Constructor object create aagum pothu fields-ku initial values kudukkum.', 'A constructor runs when `new` creates an object and initialises its fields.')
mcq('m0-q6', 'm0', 'Which type is best for storing the value 99.5?', ['int', 'boolean', 'double', 'char'], 2,
  'Decimal numbers-ku `double`. `int` whole numbers mattum.', 'double stores floating-point (decimal) numbers; int cannot hold a fractional part.')
mcq('m0-q7', 'm0', 'Which keyword is used to create a new object of the class Student?', ['create', 'new', 'make', 'object'], 1,
  '`Student s = new Student(...)`. `new` thaan object create pannum.', 'The new operator allocates an object and calls the constructor.')
mcq('m0-q8', 'm0', 'Which statement about the following loop is true?\n\nint i = 1;\nwhile (i <= 3) { System.out.println(i); }', ['It prints 1 2 3', 'It prints nothing', 'It never stops because i is never changed', 'It causes a compile error'], 2,
  'Loop-kulla `i++` illa, so i eppavum 1. Condition eppavum true, infinite loop.', 'Without an update such as i++, the condition i <= 3 stays true forever.')

// ---------- M1: DS, algorithms, ADT ----------
mcq('m1-q1', 'm1', 'Which of the following best defines a data structure?', ['A programming language', 'A way of organising and storing data so that it can be used efficiently', 'A set of steps to solve a problem', 'A type of computer hardware'], 1,
  'Data structure = data-ai organise panra murai. "Steps" algorithm-oda definition.', 'A data structure organises data; an algorithm is the set of steps that operates on it.')
mcq('m1-q2', 'm1', 'Which pair contains only linear data structures?', ['Tree and graph', 'Array and stack', 'Tree and queue', 'Graph and linked list'], 1,
  'Array, linked list, stack, queue = linear. Tree, graph = non-linear.', 'Arrays, lists, stacks and queues store elements in a sequence; trees and graphs are hierarchical or networked.')
mcq('m1-q3', 'm1', 'Which of the following is a required property of an algorithm?', ['It must be written in Java', 'It must have a finite number of steps', 'It must use an array', 'It must produce no output'], 1,
  'Algorithm finite-ah mudiyanum, theliva irukkanum, input/output irukkanum.', 'An algorithm must terminate after a finite number of well-defined steps.')
mcq('m1-q4', 'm1', 'What does an Abstract Data Type (ADT) specify?', ['Exactly how data is stored in memory', 'The data and the operations on it, hiding the implementation', 'Only the programming language to use', 'The running time of the program'], 1,
  'ADT = "enna operations" nu solrathu; "eppadi implement" nu maraikkum.', 'An ADT defines a set of data and operations, independent of how they are implemented.')
mcq('m1-q5', 'm1', 'Pseudocode is best described as:', ['Code that always compiles in Java', 'A plain-language description of the steps of an algorithm', 'Machine code', 'A type of data structure'], 1,
  'Pseudocode = programming language illaama simple English-la algorithm steps.', 'Pseudocode expresses the logic without strict syntax, so it can be translated into any language.')
mcq('m1-q6', 'm1', 'Which of these is an example of an ADT?', ['Integer', 'Stack', 'for loop', 'System.out'], 1,
  'Stack (push, pop...), Queue, List ellaam ADT examples.', 'A stack is defined by operations such as push and pop regardless of implementation.')

// ---------- M2: Arrays ----------
mcq('m2-q1', 'm2', 'What is the index of the first element of a Java array?', ['0', '1', '-1', 'It depends on the array size'], 0,
  'Java arrays 0-la irundhu start aagum. 5 elements-na index 0 to 4.', 'Java arrays are zero-indexed, so the first element is at index 0.')
mcq('m2-q2', 'm2', 'int[] a = {4, 8, 15};\nWhat happens when the code System.out.println(a[3]); runs?', ['It prints 0', 'It prints 15', 'It throws ArrayIndexOutOfBoundsException', 'It fails to compile'], 2,
  'Valid indexes 0, 1, 2. Index 3 illa; runtime-la exception.', 'The array has length 3, so index 3 is outside the valid range 0-2; Java checks bounds at run time.')
mcq('m2-q3', 'm2', 'To insert a new value at index 1 of an array that has free space at the end, what must you do first?', ['Shift the elements from index 1 onward one position to the right', 'Delete the whole array', 'Shift the elements to the left', 'Sort the array'], 0,
  'Idam ready panna right-ku nagarthanum (pinnadi irundhu).', 'Insertion needs a free slot, so later elements are moved right (starting from the last one).')
mcq('m2-q4', 'm2', 'int[][] m = new int[3][4]; How many rows and columns does the array have?', ['4 rows, 3 columns', '3 rows, 4 columns', '12 rows, 1 column', '3 rows, 3 columns'], 1,
  '`new int[rows][cols]`. m.length = 3 (rows), m[0].length = 4 (columns).', 'The first dimension is the number of rows and the second the number of columns.')
mcq('m2-q5', 'm2', 'Which statement copies an array independently (so that changing one does not change the other)?', ['int[] b = a;', 'int[] b = a.clone();', 'int[] b = a[];', 'b == a;'], 1,
  '`b = a` rendum same array-ai point pannum. `clone()` / `Arrays.copyOf` / `arraycopy` thaan real copy.', 'Assignment copies the reference only; clone() creates a new array with the same contents.')
mcq('m2-q6', 'm2', 'What is the time complexity of accessing the element a[i] by index?', ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], 2,
  'Index vachu direct access: oru step. O(1).', 'Array elements are contiguous, so the address of a[i] is computed directly.')
mcq('m2-q7', 'm2', 'Which expression gives the number of elements of an array named data?', ['data.length()', 'data.size()', 'data.length', 'length(data)'], 2,
  'Array-ku `length` (brackets illa). String-ku `length()`. ArrayList-ku `size()`.', 'For arrays, length is a field, not a method.')
mcq('m2-q8', 'm2', 'State one difference between a static array and a dynamic array.', ['A static array has a fixed size; a dynamic array can grow or shrink at run time', 'A static array can store only text', 'A dynamic array cannot be indexed', 'There is no difference'], 0,
  'Static: size fix. Dynamic (ArrayList): size maarum.', 'The size of a static array is fixed at creation; dynamic arrays resize.')

// ---------- M3: Collections & Generics ----------
mcq('m3-q1', 'm3', 'Which is a benefit of Java generics?', ['Programs run without compilation', 'Type errors are caught at compile time', 'Primitive types such as int can be used directly as type arguments', 'They remove the need for classes'], 1,
  'Generics: code reuse + compile-time type safety.', 'Generics let the compiler check types, so a wrong type is reported before the program runs.')
mcq('m3-q2', 'm3', 'How many return types can a single Java method declare, and how can it still give back several values?', ['Exactly one; it can return an array, object, collection or Pair holding several values', 'Any number of return types', 'None; methods cannot return values', 'Two: one primitive and one object'], 0,
  'Oru method-ku oru return type. Aana adhukkulla pala values-ai (array/object/Pair) return pannalaam.', 'A method has one declared return type but that type can aggregate multiple values.')
mcq('m3-q3', 'm3', 'Which line correctly declares an ArrayList that stores Strings?', ['ArrayList<String> list = new ArrayList<>();', 'ArrayList list = new String[];', 'String<ArrayList> list = new ArrayList();', 'ArrayList<string> list = ArrayList();'], 0,
  '`ArrayList<String> x = new ArrayList<>();`. `String` capital S.', 'The element type goes in angle brackets on the declaration and the constructor is called with new.')
mcq('m3-q4', 'm3', 'What is the Java Collections Framework?', ['A GUI toolkit', 'A unified architecture of interfaces and classes for storing and manipulating groups of objects', 'A database engine', 'A compiler option'], 1,
  'JCF = Collection, List, Set, Map ... interfaces + ArrayList, LinkedList... classes.', 'The framework provides ready-made data structures and algorithms behind common interfaces.')
mcq('m3-q5', 'm3', 'Which statement about ArrayList and Vector is correct?', ['Vector is synchronized (thread-safe) while ArrayList is not', 'ArrayList is synchronized while Vector is not', 'Neither can grow dynamically', 'Both are fixed size'], 0,
  'Vector synchronized = slower; ArrayList unsynchronized = faster.', 'Vector methods are synchronized, which makes it thread-safe but slower; ArrayList is not synchronized.')
mcq('m3-q6', 'm3', 'List<Integer> nums = new ArrayList<>(List.of(10, 20, 30, 1));\nnums.remove(1);\nWhat is nums now?', ['[10, 20, 30]', '[10, 30, 1]', '[20, 30, 1]', '[10, 20, 30, 1]'], 1,
  '`remove(1)` int argument → index 1 remove aagum (20).', 'remove(int) removes by index; to remove the value 1 you must call remove(Integer.valueOf(1)).')
mcq('m3-q7', 'm3', 'Which method returns the number of elements in an ArrayList?', ['length()', 'count()', 'size()', 'length'], 2,
  'ArrayList-ku `size()`.', 'Collections expose their element count through size().')
mcq('m3-q8', 'm3', 'Why is `Gn<int>` not allowed in Java?', ['Type arguments must be reference types, so Integer is used instead', 'int is too large', 'Generics only work with Strings', 'It is allowed'], 0,
  'Generics-ku wrapper classes (Integer, Double...) venum.', 'Type parameters can only be reference types; primitives are boxed (int becomes Integer).')
