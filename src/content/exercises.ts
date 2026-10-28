import type { Exercise } from '../types'

/**
 * All exercises are Java programs that read from standard input (Scanner) and print to standard output.
 * Each one has a reference solution; `npm run verify:java` compiles every solution and checks it against
 * every test case, so the expected outputs here are known to be consistent with a real JDK.
 */

const HEAD = `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
`
const TAIL = `    }
}
`
const starter = (body: string) => `${HEAD}${body}${TAIL}`

export const exercises: Exercise[] = [
  // ---------------- M0 ----------------
  {
    id: 'm0-e1', moduleId: 'm0', title: 'Sum of 1 to n', difficulty: 'Beginner',
    statement: 'Read an integer n and print the sum 1 + 2 + ... + n.',
    inputFormat: 'One integer n.', outputFormat: 'One integer: the sum.', constraints: '1 ≤ n ≤ 1000',
    examples: [{ input: '5', output: '15' }],
    starter: starter(`        int n = sc.nextInt();
        // TODO: use a loop to add 1..n, then print the total
`),
    tests: [{ input: '5', expected: '15' }, { input: '1', expected: '1' }, { input: '10', expected: '55' }, { input: '1000', expected: '500500', hidden: true }],
    hints: ['Create int sum = 0 before the loop.', 'for (int i = 1; i <= n; i++) { sum += i; }'],
    approachTanglish: 'Oru `sum` variable 0-la start pannu. Loop-la i = 1 to n varaikkum sum-la i-ai serthukko. Kadaisiyil sum-ai print pannu.',
    solution: starter(`        int n = sc.nextInt();
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += i;
        }
        System.out.println(sum);
`),
  },
  {
    id: 'm0-e2', moduleId: 'm0', title: 'Even or Odd', difficulty: 'Beginner',
    statement: 'Read an integer n. Print Even if n is even, otherwise print Odd.',
    inputFormat: 'One integer n.', outputFormat: 'Even or Odd', constraints: '0 ≤ n ≤ 1000000',
    examples: [{ input: '8', output: 'Even' }, { input: '7', output: 'Odd' }],
    starter: starter(`        int n = sc.nextInt();
        // TODO: use the remainder operator %
`),
    tests: [{ input: '8', expected: 'Even' }, { input: '7', expected: 'Odd' }, { input: '0', expected: 'Even' }, { input: '999999', expected: 'Odd', hidden: true }],
    hints: ['n % 2 gives the remainder when dividing by 2.', 'If the remainder is 0 the number is even.'],
    approachTanglish: '`n % 2 == 0` na Even, illa-na Odd. `if / else` use pannu.',
    solution: starter(`        int n = sc.nextInt();
        if (n % 2 == 0) {
            System.out.println("Even");
        } else {
            System.out.println("Odd");
        }
`),
  },
  {
    id: 'm0-e3', moduleId: 'm0', title: 'Multiplication table', difficulty: 'Easy',
    statement: 'Read an integer n. Print its multiplication table from 1 to 10, one line per row in the format "n x i = result".',
    inputFormat: 'One integer n.', outputFormat: '10 lines such as "3 x 1 = 3".', constraints: '1 ≤ n ≤ 100',
    examples: [{ input: '2', output: '2 x 1 = 2\n2 x 2 = 4\n...\n2 x 10 = 20' }],
    starter: starter(`        int n = sc.nextInt();
        // TODO: loop i from 1 to 10 and print each line
`),
    tests: [
      { input: '2', expected: '2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n2 x 6 = 12\n2 x 7 = 14\n2 x 8 = 16\n2 x 9 = 18\n2 x 10 = 20' },
      { input: '7', expected: '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70', hidden: true },
    ],
    hints: ['Use a for loop from 1 to 10.', 'System.out.println(n + " x " + i + " = " + (n * i));'],
    approachTanglish: 'Loop 1-la irundhu 10 varaikkum. Ovvoru i-kum `n x i = n*i` print pannu. `(n * i)` bracket-la podu, illa-na string concatenation aagividum.',
    solution: starter(`        int n = sc.nextInt();
        for (int i = 1; i <= 10; i++) {
            System.out.println(n + " x " + i + " = " + (n * i));
        }
`),
  },

  // ---------------- M1 ----------------
  {
    id: 'm1-e1', moduleId: 'm1', title: 'Largest of three numbers', difficulty: 'Beginner',
    statement: 'Write an algorithm as a program: read three integers and print the largest one.',
    inputFormat: 'Three integers separated by spaces.', outputFormat: 'The largest integer.',
    examples: [{ input: '4 9 2', output: '9' }],
    starter: starter(`        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        // TODO: find and print the largest
`),
    tests: [{ input: '4 9 2', expected: '9' }, { input: '10 10 3', expected: '10' }, { input: '-5 -2 -9', expected: '-2' }, { input: '1 2 3', expected: '3', hidden: true }],
    hints: ['Assume the first number is the largest, then compare with the others.', 'if (b > max) max = b;'],
    approachTanglish: '`max = a` nu start pannu. Apuram `b > max` na max = b; `c > max` na max = c. Last-la max print.',
    solution: starter(`        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        int max = a;
        if (b > max) max = b;
        if (c > max) max = c;
        System.out.println(max);
`),
  },
  {
    id: 'm1-e2', moduleId: 'm1', title: 'Count the digits', difficulty: 'Easy',
    statement: 'Read a positive integer and print how many digits it has. Do not convert it to a String.',
    inputFormat: 'One positive integer n.', outputFormat: 'The number of digits.', constraints: '1 ≤ n ≤ 1000000000',
    examples: [{ input: '12345', output: '5' }],
    starter: starter(`        int n = sc.nextInt();
        // TODO: repeatedly divide by 10 and count
`),
    tests: [{ input: '12345', expected: '5' }, { input: '7', expected: '1' }, { input: '100', expected: '3' }, { input: '1000000000', expected: '10', hidden: true }],
    hints: ['n / 10 removes the last digit.', 'Count how many times you can divide until n becomes 0.'],
    approachTanglish: 'Oru counter vachuko. `while (n > 0)` loop-la n = n / 10; counter++. Ovvoru thadavaiyum oru digit poidum.',
    solution: starter(`        int n = sc.nextInt();
        int count = 0;
        while (n > 0) {
            n = n / 10;
            count++;
        }
        System.out.println(count);
`),
  },
  {
    id: 'm1-e3', moduleId: 'm1', title: 'Reverse a number', difficulty: 'Intermediate',
    statement: 'Read a non-negative integer and print the number with its digits reversed. Leading zeros of the result are dropped (for example 1200 becomes 21).',
    inputFormat: 'One integer n.', outputFormat: 'The reversed number.', constraints: '0 ≤ n ≤ 1000000000',
    examples: [{ input: '1234', output: '4321' }],
    starter: starter(`        int n = sc.nextInt();
        // TODO: build the reversed number digit by digit
`),
    tests: [{ input: '1234', expected: '4321' }, { input: '1200', expected: '21' }, { input: '5', expected: '5' }, { input: '0', expected: '0', hidden: true }],
    hints: ['n % 10 gives the last digit.', 'rev = rev * 10 + lastDigit'],
    approachTanglish: 'Kadaisi digit-ai `n % 10`-la eduthu, `rev = rev * 10 + digit` nu serthukko. Apuram `n = n / 10`.',
    solution: starter(`        int n = sc.nextInt();
        int rev = 0;
        while (n > 0) {
            rev = rev * 10 + n % 10;
            n = n / 10;
        }
        System.out.println(rev);
`),
  },

  // ---------------- M2 ----------------
  {
    id: 'm2-e1', moduleId: 'm2', title: 'Sum and maximum of an array', difficulty: 'Beginner',
    statement: 'Read n followed by n integers. Print the sum and the maximum on one line separated by a space.',
    inputFormat: 'First line n. Second line n integers.', outputFormat: 'sum max', constraints: '1 ≤ n ≤ 100',
    examples: [{ input: '4\n3 8 1 6', output: '18 8' }],
    starter: starter(`        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        // TODO: compute the sum and maximum
`),
    tests: [{ input: '4\n3 8 1 6', expected: '18 8' }, { input: '1\n-4', expected: '-4 -4' }, { input: '5\n-1 -2 -3 -4 -5', expected: '-15 -1', hidden: true }],
    hints: ['Start max with a[0], not with 0.', 'Update sum and max in the same loop.'],
    approachTanglish: '`max = a[0]` nu start pannu (0 illa, negative numbers irukkalaam). Oru loop-la sum += a[i]; a[i] > max na max update.',
    solution: starter(`        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int sum = 0;
        int max = a[0];
        for (int i = 0; i < n; i++) {
            sum += a[i];
            if (a[i] > max) max = a[i];
        }
        System.out.println(sum + " " + max);
`),
  },
  {
    id: 'm2-e2', moduleId: 'm2', title: 'Insert into an array', difficulty: 'Easy',
    statement: 'Read n, then n integers, then an index k and a value x. Insert x at index k (shifting the later elements right) and print the new array separated by spaces.',
    inputFormat: 'Line 1: n. Line 2: n integers. Line 3: k and x.', outputFormat: 'n+1 integers on one line.', constraints: '0 ≤ k ≤ n ≤ 100',
    examples: [{ input: '4\n10 20 30 40\n1 99', output: '10 99 20 30 40' }],
    starter: starter(`        int n = sc.nextInt();
        int[] a = new int[n + 1];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int k = sc.nextInt();
        int x = sc.nextInt();
        // TODO: shift a[k..n-1] one step to the right, put x at a[k], then print n + 1 numbers
`),
    tests: [{ input: '4\n10 20 30 40\n1 99', expected: '10 99 20 30 40' }, { input: '3\n1 2 3\n0 7', expected: '7 1 2 3' }, { input: '3\n1 2 3\n3 7', expected: '1 2 3 7' }, { input: '1\n5\n0 6', expected: '6 5', hidden: true }],
    hints: ['Shift starting from the LAST element, otherwise you overwrite values.', 'for (int i = n; i > k; i--) a[i] = a[i - 1];'],
    approachTanglish: 'Pinnaadi irundhu (n-la irundhu k varaikkum) ovvoru element-ai valathu pakkam nagarthu: `a[i] = a[i-1]`. Apuram `a[k] = x`.',
    solution: starter(`        int n = sc.nextInt();
        int[] a = new int[n + 1];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int k = sc.nextInt();
        int x = sc.nextInt();
        for (int i = n; i > k; i--) a[i] = a[i - 1];
        a[k] = x;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i <= n; i++) {
            if (i > 0) sb.append(' ');
            sb.append(a[i]);
        }
        System.out.println(sb);
`),
  },
  {
    id: 'm2-e3', moduleId: 'm2', title: 'Row sums of a 2D array', difficulty: 'Intermediate',
    statement: 'Read r and c, then an r × c matrix. Print the sum of each row, one per line.',
    inputFormat: 'Line 1: r c. Then r lines of c integers.', outputFormat: 'r lines, each the sum of one row.', constraints: '1 ≤ r, c ≤ 20',
    examples: [{ input: '2 3\n1 2 3\n4 5 6', output: '6\n15' }],
    starter: starter(`        int r = sc.nextInt();
        int c = sc.nextInt();
        int[][] m = new int[r][c];
        for (int i = 0; i < r; i++)
            for (int j = 0; j < c; j++) m[i][j] = sc.nextInt();
        // TODO: print the sum of each row
`),
    tests: [{ input: '2 3\n1 2 3\n4 5 6', expected: '6\n15' }, { input: '1 1\n9', expected: '9' }, { input: '3 2\n1 1\n-1 -1\n5 0', expected: '2\n-2\n5', hidden: true }],
    hints: ['Use two nested loops.', 'Reset the row sum to 0 at the start of every row.'],
    approachTanglish: 'Velila `i` (row), ullae `j` (column). Ovvoru row start aagum pothu `rowSum = 0`. Row mudinjadhum print pannu.',
    solution: starter(`        int r = sc.nextInt();
        int c = sc.nextInt();
        int[][] m = new int[r][c];
        for (int i = 0; i < r; i++)
            for (int j = 0; j < c; j++) m[i][j] = sc.nextInt();
        for (int i = 0; i < r; i++) {
            int rowSum = 0;
            for (int j = 0; j < c; j++) rowSum += m[i][j];
            System.out.println(rowSum);
        }
`),
  },

  // ---------------- M3 ----------------
  {
    id: 'm3-e1', moduleId: 'm3', title: 'Remove the even numbers', difficulty: 'Easy',
    statement: 'Read n and n integers into an ArrayList<Integer>. Remove all even numbers and print the remaining numbers separated by spaces. If nothing remains, print Empty.',
    inputFormat: 'Line 1: n. Line 2: n integers.', outputFormat: 'Remaining numbers or Empty.', constraints: '1 ≤ n ≤ 100',
    examples: [{ input: '5\n1 2 3 4 5', output: '1 3 5' }],
    starter: starter(`        int n = sc.nextInt();
        ArrayList<Integer> list = new ArrayList<>();
        for (int i = 0; i < n; i++) list.add(sc.nextInt());
        // TODO: build the list of odd numbers and print it
`),
    tests: [{ input: '5\n1 2 3 4 5', expected: '1 3 5' }, { input: '3\n2 4 6', expected: 'Empty' }, { input: '4\n7 9 11 13', expected: '7 9 11 13' }, { input: '6\n-1 -2 -3 0 8 15', expected: '-1 -3 15', hidden: true }],
    hints: ['Easier: create a second list and add only the odd values.', 'Remember that -3 % 2 is -1 in Java, so test n % 2 != 0.'],
    approachTanglish: 'Pudhu list-la odd numbers mattum add pannu. `x % 2 != 0` use pannu (negative-ku `== 1` work aagaadhu).',
    solution: starter(`        int n = sc.nextInt();
        ArrayList<Integer> list = new ArrayList<>();
        for (int i = 0; i < n; i++) list.add(sc.nextInt());
        ArrayList<Integer> odd = new ArrayList<>();
        for (int x : list) {
            if (x % 2 != 0) odd.add(x);
        }
        if (odd.isEmpty()) {
            System.out.println("Empty");
        } else {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < odd.size(); i++) {
                if (i > 0) sb.append(' ');
                sb.append(odd.get(i));
            }
            System.out.println(sb);
        }
`),
  },
  {
    id: 'm3-e2', moduleId: 'm3', title: 'Sort the words', difficulty: 'Easy',
    statement: 'Read n words into an ArrayList<String>. Sort them alphabetically (Collections.sort) and print them one per line.',
    inputFormat: 'Line 1: n. Then n words separated by spaces or new lines.', outputFormat: 'n lines.', constraints: '1 ≤ n ≤ 50',
    examples: [{ input: '3\npear apple mango', output: 'apple\nmango\npear' }],
    starter: starter(`        int n = sc.nextInt();
        ArrayList<String> words = new ArrayList<>();
        for (int i = 0; i < n; i++) words.add(sc.next());
        // TODO: sort and print
`),
    tests: [{ input: '3\npear apple mango', expected: 'apple\nmango\npear' }, { input: '1\nzebra', expected: 'zebra' }, { input: '4\nb a d c', expected: 'a\nb\nc\nd', hidden: true }],
    hints: ['Collections.sort(words); sorts a List<String> in place.', 'Print with a for-each loop.'],
    approachTanglish: '`Collections.sort(words)` oru line-la sort pannidum. Apuram for-each loop-la ovvoru word print.',
    solution: starter(`        int n = sc.nextInt();
        ArrayList<String> words = new ArrayList<>();
        for (int i = 0; i < n; i++) words.add(sc.next());
        Collections.sort(words);
        for (String w : words) System.out.println(w);
`),
  },
  {
    id: 'm3-e3', moduleId: 'm3', title: 'Count occurrences', difficulty: 'Intermediate',
    statement: 'Read n integers into an ArrayList<Integer>, then a query value x. Print how many times x appears.',
    inputFormat: 'Line 1: n. Line 2: n integers. Line 3: x.', outputFormat: 'One integer.', constraints: '1 ≤ n ≤ 100',
    examples: [{ input: '6\n1 2 2 3 2 5\n2', output: '3' }],
    starter: starter(`        int n = sc.nextInt();
        ArrayList<Integer> list = new ArrayList<>();
        for (int i = 0; i < n; i++) list.add(sc.nextInt());
        int x = sc.nextInt();
        // TODO: count how many elements equal x
`),
    tests: [{ input: '6\n1 2 2 3 2 5\n2', expected: '3' }, { input: '3\n4 5 6\n9', expected: '0' }, { input: '5\n7 7 7 7 7\n7', expected: '5', hidden: true }, { input: '4\n1000 1000 5 1000\n1000', expected: '3', hidden: true }],
    hints: ['Loop with list.get(i).', 'Compare Integer objects with equals(), or compare int values after unboxing (int v = list.get(i)).'],
    approachTanglish: '`int v = list.get(i)` nu primitive-aa maathi `v == x` compare pannu. (Integer == Integer 127-ku mela thappa aagum!)',
    solution: starter(`        int n = sc.nextInt();
        ArrayList<Integer> list = new ArrayList<>();
        for (int i = 0; i < n; i++) list.add(sc.nextInt());
        int x = sc.nextInt();
        int count = 0;
        for (int i = 0; i < list.size(); i++) {
            int v = list.get(i);
            if (v == x) count++;
        }
        System.out.println(count);
`),
  },

  // ---------------- M4 ----------------
  {
    id: 'm4-e1', moduleId: 'm4', title: 'Build a list at the front', difficulty: 'Easy',
    statement: 'Read n integers. Insert each at the FRONT of a singly linked list (your own Node class). Then print the list from head to end, separated by spaces.',
    inputFormat: 'Line 1: n. Line 2: n integers.', outputFormat: 'List contents on one line.', constraints: '1 ≤ n ≤ 100',
    examples: [{ input: '4\n1 2 3 4', output: '4 3 2 1' }],
    starter: `import java.util.*;

class Node {
    int data;
    Node next;
    Node(int data) { this.data = data; }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Node head = null;
        for (int i = 0; i < n; i++) {
            int x = sc.nextInt();
            // TODO: create a Node and add it at the front
        }
        // TODO: traverse from head and print every data value
    }
}
`,
    tests: [{ input: '4\n1 2 3 4', expected: '4 3 2 1' }, { input: '1\n9', expected: '9' }, { input: '3\n5 5 5', expected: '5 5 5', hidden: true }],
    hints: ['node.next = head; head = node;', 'Traverse with: Node cur = head; while (cur != null) { ...; cur = cur.next; }'],
    approachTanglish: 'Pudhu node-oda `next`-ai paazhaya `head`-ku point pannu, apuram `head = node`. Order maara koodaadhu! Print panna `cur != null` varaikkum nada.',
    solution: `import java.util.*;

class Node {
    int data;
    Node next;
    Node(int data) { this.data = data; }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Node head = null;
        for (int i = 0; i < n; i++) {
            int x = sc.nextInt();
            Node node = new Node(x);
            node.next = head;
            head = node;
        }
        StringBuilder sb = new StringBuilder();
        Node cur = head;
        while (cur != null) {
            if (sb.length() > 0) sb.append(' ');
            sb.append(cur.data);
            cur = cur.next;
        }
        System.out.println(sb);
    }
}
`,
  },
  {
    id: 'm4-e2', moduleId: 'm4', title: 'Add at the end and search', difficulty: 'Intermediate',
    statement: 'Read n integers and add each at the END of a singly linked list. Then read x and print "Found at position p" (p counted from 0 at the head) for the first match, or "Not found".',
    inputFormat: 'Line 1: n. Line 2: n integers. Line 3: x.', outputFormat: '"Found at position p" or "Not found".', constraints: '1 ≤ n ≤ 100',
    examples: [{ input: '4\n10 20 30 40\n30', output: 'Found at position 2' }],
    starter: `import java.util.*;

class Node {
    int data;
    Node next;
    Node(int data) { this.data = data; }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Node head = null;
        Node tail = null;
        for (int i = 0; i < n; i++) {
            int v = sc.nextInt();
            // TODO: add a new node at the end (remember the empty-list case)
        }
        int x = sc.nextInt();
        // TODO: walk the list, counting the position
    }
}
`,
    tests: [{ input: '4\n10 20 30 40\n30', expected: 'Found at position 2' }, { input: '3\n1 2 3\n7', expected: 'Not found' }, { input: '3\n5 6 5\n5', expected: 'Found at position 0' }, { input: '1\n8\n8', expected: 'Found at position 0', hidden: true }, { input: '5\n1 2 3 4 5\n5', expected: 'Found at position 4', hidden: true }],
    hints: ['If head is null the new node becomes both head and tail.', 'Otherwise tail.next = node; tail = node;'],
    approachTanglish: 'List kaaliyaa irundhaa `head = tail = node`. Illa-na `tail.next = node; tail = node;`. Search-la position counter 0-la start pannu.',
    solution: `import java.util.*;

class Node {
    int data;
    Node next;
    Node(int data) { this.data = data; }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Node head = null;
        Node tail = null;
        for (int i = 0; i < n; i++) {
            Node node = new Node(sc.nextInt());
            if (head == null) {
                head = node;
                tail = node;
            } else {
                tail.next = node;
                tail = node;
            }
        }
        int x = sc.nextInt();
        int pos = 0;
        Node cur = head;
        while (cur != null) {
            if (cur.data == x) {
                System.out.println("Found at position " + pos);
                return;
            }
            cur = cur.next;
            pos++;
        }
        System.out.println("Not found");
    }
}
`,
  },
  {
    id: 'm4-e3', moduleId: 'm4', title: 'Delete the first occurrence', difficulty: 'Challenge',
    statement: 'Read n integers and add them at the end of a linked list. Then read x and delete the FIRST node whose value is x (if any). Print the remaining list separated by spaces, or Empty if the list has no nodes left.',
    inputFormat: 'Line 1: n. Line 2: n integers. Line 3: x.', outputFormat: 'List contents or Empty.', constraints: '1 ≤ n ≤ 100',
    examples: [{ input: '4\n1 2 3 2\n2', output: '1 3 2' }],
    starter: `import java.util.*;

class Node {
    int data;
    Node next;
    Node(int data) { this.data = data; }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Node head = null;
        Node tail = null;
        for (int i = 0; i < n; i++) {
            Node node = new Node(sc.nextInt());
            if (head == null) { head = node; tail = node; }
            else { tail.next = node; tail = node; }
        }
        int x = sc.nextInt();
        // TODO: delete the first node with value x
        // (special case: the node to delete is the head)
        // TODO: print the list, or Empty
    }
}
`,
    tests: [{ input: '4\n1 2 3 2\n2', expected: '1 3 2' }, { input: '3\n5 6 7\n5', expected: '6 7' }, { input: '3\n5 6 7\n7', expected: '5 6' }, { input: '1\n4\n4', expected: 'Empty' }, { input: '3\n1 2 3\n9', expected: '1 2 3', hidden: true }, { input: '2\n3 3\n3', expected: '3', hidden: true }],
    hints: ['If head.data == x then head = head.next.', 'Otherwise keep a "previous" reference and set previous.next = current.next when you find x.'],
    approachTanglish: 'Head-ae x-na `head = head.next`. Illa-na `prev` and `cur` rendu vachuko; match kidaichadhum `prev.next = cur.next`. Oru node delete pannitu `break`.',
    solution: `import java.util.*;

class Node {
    int data;
    Node next;
    Node(int data) { this.data = data; }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Node head = null;
        Node tail = null;
        for (int i = 0; i < n; i++) {
            Node node = new Node(sc.nextInt());
            if (head == null) { head = node; tail = node; }
            else { tail.next = node; tail = node; }
        }
        int x = sc.nextInt();
        if (head != null && head.data == x) {
            head = head.next;
        } else {
            Node prev = head;
            Node cur = head == null ? null : head.next;
            while (cur != null) {
                if (cur.data == x) {
                    prev.next = cur.next;
                    break;
                }
                prev = cur;
                cur = cur.next;
            }
        }
        if (head == null) {
            System.out.println("Empty");
            return;
        }
        StringBuilder sb = new StringBuilder();
        for (Node c = head; c != null; c = c.next) {
            if (sb.length() > 0) sb.append(' ');
            sb.append(c.data);
        }
        System.out.println(sb);
    }
}
`,
  },

  // ---------------- M5 ----------------
  {
    id: 'm5-e1', moduleId: 'm5', title: 'Stack commands', difficulty: 'Easy',
    statement: 'Simulate a stack. Read q commands. "push x" pushes x. "pop" prints the popped value, or "Underflow" if the stack is empty. "peek" prints the top value, or "Empty" if the stack is empty.',
    inputFormat: 'Line 1: q. Then q commands, one per line.', outputFormat: 'One line for every pop and peek command.', constraints: '1 ≤ q ≤ 100',
    examples: [{ input: '5\npush 4\npush 9\npeek\npop\npop', output: '9\n9\n4' }],
    starter: starter(`        int q = sc.nextInt();
        Stack<Integer> st = new Stack<>();
        for (int i = 0; i < q; i++) {
            String cmd = sc.next();
            if (cmd.equals("push")) {
                int x = sc.nextInt();
                // TODO
            } else if (cmd.equals("pop")) {
                // TODO
            } else if (cmd.equals("peek")) {
                // TODO
            }
        }
`),
    tests: [
      { input: '5\npush 4\npush 9\npeek\npop\npop', expected: '9\n9\n4' },
      { input: '2\npop\npeek', expected: 'Underflow\nEmpty' },
      { input: '6\npush 1\npush 2\npush 3\npop\npush 8\npeek', expected: '3\n8', hidden: true },
    ],
    hints: ['Check st.isEmpty() before pop() or peek().', 'java.util.Stack throws an exception if you pop an empty stack.'],
    approachTanglish: '`pop` and `peek`-ku munnaadi `st.isEmpty()` paaru. Kaali-na "Underflow" / "Empty" print pannu, illa-na `st.pop()` / `st.peek()` print.',
    solution: starter(`        int q = sc.nextInt();
        Stack<Integer> st = new Stack<>();
        for (int i = 0; i < q; i++) {
            String cmd = sc.next();
            if (cmd.equals("push")) {
                int x = sc.nextInt();
                st.push(x);
            } else if (cmd.equals("pop")) {
                if (st.isEmpty()) System.out.println("Underflow");
                else System.out.println(st.pop());
            } else if (cmd.equals("peek")) {
                if (st.isEmpty()) System.out.println("Empty");
                else System.out.println(st.peek());
            }
        }
`),
  },
  {
    id: 'm5-e2', moduleId: 'm5', title: 'Reverse a word with a stack', difficulty: 'Easy',
    statement: 'Read one word and print it reversed. You must use a Stack<Character>.',
    inputFormat: 'One word (no spaces).', outputFormat: 'The reversed word.', constraints: '1 ≤ length ≤ 100',
    examples: [{ input: 'stack', output: 'kcats' }],
    starter: starter(`        String w = sc.next();
        Stack<Character> st = new Stack<>();
        // TODO: push every character, then pop them all into the output
`),
    tests: [{ input: 'stack', expected: 'kcats' }, { input: 'a', expected: 'a' }, { input: 'level', expected: 'level' }, { input: 'DataStructure', expected: 'erutcurtSataD', hidden: true }],
    hints: ['w.charAt(i) gives the i-th character.', 'The last character pushed is the first popped.'],
    approachTanglish: 'Ovvoru character-ai push pannu. Apuram stack kaali aagura varaikkum pop panni print pannu. LIFO-naala reverse aagum.',
    solution: starter(`        String w = sc.next();
        Stack<Character> st = new Stack<>();
        for (int i = 0; i < w.length(); i++) st.push(w.charAt(i));
        StringBuilder sb = new StringBuilder();
        while (!st.isEmpty()) sb.append(st.pop());
        System.out.println(sb);
`),
  },
  {
    id: 'm5-e3', moduleId: 'm5', title: 'Balanced brackets', difficulty: 'Intermediate',
    statement: 'Read a string made only of the characters ( ) [ ] { }. Print Balanced if every opening bracket is closed by the correct type in the correct order, otherwise print Not balanced.',
    inputFormat: 'One string without spaces.', outputFormat: 'Balanced or Not balanced', constraints: '1 ≤ length ≤ 200',
    examples: [{ input: '{[()]}', output: 'Balanced' }, { input: '([)]', output: 'Not balanced' }],
    starter: starter(`        String s = sc.next();
        Stack<Character> st = new Stack<>();
        // TODO: push openings; on a closing bracket pop and compare
`),
    tests: [{ input: '{[()]}', expected: 'Balanced' }, { input: '([)]', expected: 'Not balanced' }, { input: '(((', expected: 'Not balanced' }, { input: ')(', expected: 'Not balanced', hidden: true }, { input: '()[]{}', expected: 'Balanced', hidden: true }],
    hints: ['On a closing bracket, if the stack is empty the answer is Not balanced.', 'At the end the stack must be empty.'],
    approachTanglish: 'Opening bracket vandha push. Closing bracket vandha stack kaali-na Not balanced; illa-na pop panni pair match aaguthaanu paaru. Kadaisila stack kaali-a irukkanum.',
    solution: starter(`        String s = sc.next();
        Stack<Character> st = new Stack<>();
        boolean ok = true;
        for (int i = 0; i < s.length() && ok; i++) {
            char c = s.charAt(i);
            if (c == '(' || c == '[' || c == '{') {
                st.push(c);
            } else {
                if (st.isEmpty()) {
                    ok = false;
                } else {
                    char o = st.pop();
                    if ((c == ')' && o != '(') || (c == ']' && o != '[') || (c == '}' && o != '{')) ok = false;
                }
            }
        }
        if (!st.isEmpty()) ok = false;
        System.out.println(ok ? "Balanced" : "Not balanced");
`),
  },

  // ---------------- M6 ----------------
  {
    id: 'm6-e1', moduleId: 'm6', title: 'Queue commands', difficulty: 'Easy',
    statement: 'Simulate a queue. Read q commands. "enqueue x" adds x at the rear. "dequeue" prints the front value and removes it, or prints "Empty" if the queue is empty. "front" prints the front value, or "Empty".',
    inputFormat: 'Line 1: q. Then q commands.', outputFormat: 'One line per dequeue and front command.', constraints: '1 ≤ q ≤ 100',
    examples: [{ input: '5\nenqueue 5\nenqueue 8\nfront\ndequeue\ndequeue', output: '5\n5\n8' }],
    starter: starter(`        int q = sc.nextInt();
        Queue<Integer> qu = new LinkedList<>();
        for (int i = 0; i < q; i++) {
            String cmd = sc.next();
            if (cmd.equals("enqueue")) {
                int x = sc.nextInt();
                // TODO
            } else if (cmd.equals("dequeue")) {
                // TODO
            } else if (cmd.equals("front")) {
                // TODO
            }
        }
`),
    tests: [{ input: '5\nenqueue 5\nenqueue 8\nfront\ndequeue\ndequeue', expected: '5\n5\n8' }, { input: '2\ndequeue\nfront', expected: 'Empty\nEmpty' }, { input: '6\nenqueue 1\nenqueue 2\ndequeue\nenqueue 3\ndequeue\ndequeue', expected: '1\n2\n3', hidden: true }],
    hints: ['offer() adds at the rear; poll() removes from the front.', 'Use isEmpty() before reading the front.'],
    approachTanglish: '`qu.offer(x)` rear-la serkum; `qu.poll()` front-ai eduthu neekkum; `qu.peek()` paarkka mattum. Kaali-na "Empty" print.',
    solution: starter(`        int q = sc.nextInt();
        Queue<Integer> qu = new LinkedList<>();
        for (int i = 0; i < q; i++) {
            String cmd = sc.next();
            if (cmd.equals("enqueue")) {
                int x = sc.nextInt();
                qu.offer(x);
            } else if (cmd.equals("dequeue")) {
                if (qu.isEmpty()) System.out.println("Empty");
                else System.out.println(qu.poll());
            } else if (cmd.equals("front")) {
                if (qu.isEmpty()) System.out.println("Empty");
                else System.out.println(qu.peek());
            }
        }
`),
  },
  {
    id: 'm6-e2', moduleId: 'm6', title: 'Circular queue of fixed size', difficulty: 'Intermediate',
    statement: 'Implement a circular queue with an int array of capacity k (use front, rear and size, wrapping with %). Read k and q, then q commands. "enqueue x" prints "Full" if the queue is full, otherwise adds x. "dequeue" prints the removed value, or "Empty".',
    inputFormat: 'Line 1: k q. Then q commands.', outputFormat: 'A line for every "Full", "Empty" and dequeued value.', constraints: '1 ≤ k ≤ 20',
    examples: [{ input: '2 5\nenqueue 1\nenqueue 2\nenqueue 3\ndequeue\nenqueue 4', output: 'Full\n1' }],
    starter: starter(`        int k = sc.nextInt();
        int q = sc.nextInt();
        int[] data = new int[k];
        int front = 0, rear = 0, size = 0;
        for (int i = 0; i < q; i++) {
            String cmd = sc.next();
            if (cmd.equals("enqueue")) {
                int x = sc.nextInt();
                // TODO: if size == k print Full, otherwise store at data[rear] and move rear with %
            } else {
                // TODO: dequeue
            }
        }
`),
    tests: [
      { input: '2 5\nenqueue 1\nenqueue 2\nenqueue 3\ndequeue\nenqueue 4', expected: 'Full\n1' },
      { input: '3 3\ndequeue\nenqueue 5\ndequeue', expected: 'Empty\n5' },
      { input: '3 8\nenqueue 1\nenqueue 2\nenqueue 3\ndequeue\ndequeue\nenqueue 4\nenqueue 5\ndequeue', expected: '1\n2\n3', hidden: true },
      { input: '1 4\nenqueue 7\nenqueue 8\ndequeue\ndequeue', expected: 'Full\n7\nEmpty', hidden: true },
    ],
    hints: ['rear = (rear + 1) % k after storing.', 'Use size (not front == rear) to tell empty from full.'],
    approachTanglish: 'Enqueue: `size == k` na Full. Illa-na `data[rear] = x; rear = (rear+1) % k; size++`. Dequeue: `size == 0` na Empty. Illa-na `data[front]` print; `front = (front+1) % k; size--`.',
    solution: starter(`        int k = sc.nextInt();
        int q = sc.nextInt();
        int[] data = new int[k];
        int front = 0, rear = 0, size = 0;
        for (int i = 0; i < q; i++) {
            String cmd = sc.next();
            if (cmd.equals("enqueue")) {
                int x = sc.nextInt();
                if (size == k) {
                    System.out.println("Full");
                } else {
                    data[rear] = x;
                    rear = (rear + 1) % k;
                    size++;
                }
            } else {
                if (size == 0) {
                    System.out.println("Empty");
                } else {
                    System.out.println(data[front]);
                    front = (front + 1) % k;
                    size--;
                }
            }
        }
`),
  },
  {
    id: 'm6-e3', moduleId: 'm6', title: 'Rotate a queue', difficulty: 'Intermediate',
    statement: 'Read n integers into a queue (front first). Then read k. Repeat k times: remove the front element and add it to the rear. Finally print the queue from front to rear separated by spaces.',
    inputFormat: 'Line 1: n. Line 2: n integers. Line 3: k.', outputFormat: 'n integers on one line.', constraints: '1 ≤ n ≤ 100, 0 ≤ k ≤ 1000',
    examples: [{ input: '5\n1 2 3 4 5\n2', output: '3 4 5 1 2' }],
    starter: starter(`        int n = sc.nextInt();
        Queue<Integer> qu = new LinkedList<>();
        for (int i = 0; i < n; i++) qu.offer(sc.nextInt());
        int k = sc.nextInt();
        // TODO: rotate k times, then print
`),
    tests: [{ input: '5\n1 2 3 4 5\n2', expected: '3 4 5 1 2' }, { input: '3\n7 8 9\n0', expected: '7 8 9' }, { input: '3\n7 8 9\n3', expected: '7 8 9', hidden: true }, { input: '4\n1 2 3 4\n9', expected: '2 3 4 1', hidden: true }],
    hints: ['qu.offer(qu.poll()) moves the front element to the rear.', 'Print by polling until empty.'],
    approachTanglish: '`qu.offer(qu.poll())` - front-ai eduthu rear-la podum. Idhai k thadavai ceyyu. Last-la poll panni print.',
    solution: starter(`        int n = sc.nextInt();
        Queue<Integer> qu = new LinkedList<>();
        for (int i = 0; i < n; i++) qu.offer(sc.nextInt());
        int k = sc.nextInt();
        for (int i = 0; i < k; i++) qu.offer(qu.poll());
        StringBuilder sb = new StringBuilder();
        while (!qu.isEmpty()) {
            if (sb.length() > 0) sb.append(' ');
            sb.append(qu.poll());
        }
        System.out.println(sb);
`),
  },

  // ---------------- M7 ----------------
  {
    id: 'm7-e1', moduleId: 'm7', title: 'BST insert and inorder', difficulty: 'Intermediate',
    statement: 'Read n distinct integers and insert them one by one into an initially empty Binary Search Tree. Print the inorder traversal separated by spaces.',
    inputFormat: 'Line 1: n. Line 2: n distinct integers.', outputFormat: 'Inorder traversal.', constraints: '1 ≤ n ≤ 100',
    examples: [{ input: '5\n23 33 45 30 10', output: '10 23 30 33 45' }],
    starter: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public class Main {
    static TreeNode insert(TreeNode root, int v) {
        // TODO: return the (possibly new) root after inserting v
        return root;
    }

    static void inorder(TreeNode root, StringBuilder sb) {
        // TODO: left, node, right
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        TreeNode root = null;
        for (int i = 0; i < n; i++) root = insert(root, sc.nextInt());
        StringBuilder sb = new StringBuilder();
        inorder(root, sb);
        System.out.println(sb.toString().trim());
    }
}
`,
    tests: [{ input: '5\n23 33 45 30 10', expected: '10 23 30 33 45' }, { input: '1\n4', expected: '4' }, { input: '4\n1 2 3 4', expected: '1 2 3 4', hidden: true }, { input: '7\n50 30 70 20 40 60 80', expected: '20 30 40 50 60 70 80', hidden: true }],
    hints: ['If root == null return new TreeNode(v).', 'If v < root.val insert into the left subtree, otherwise into the right.'],
    approachTanglish: '`insert`: root null-na pudhu node. `v < root.val` na `root.left = insert(root.left, v)`, illa-na right. `inorder`: left, apuram value, apuram right.',
    solution: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public class Main {
    static TreeNode insert(TreeNode root, int v) {
        if (root == null) return new TreeNode(v);
        if (v < root.val) root.left = insert(root.left, v);
        else root.right = insert(root.right, v);
        return root;
    }

    static void inorder(TreeNode root, StringBuilder sb) {
        if (root == null) return;
        inorder(root.left, sb);
        sb.append(root.val).append(' ');
        inorder(root.right, sb);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        TreeNode root = null;
        for (int i = 0; i < n; i++) root = insert(root, sc.nextInt());
        StringBuilder sb = new StringBuilder();
        inorder(root, sb);
        System.out.println(sb.toString().trim());
    }
}
`,
  },
  {
    id: 'm7-e2', moduleId: 'm7', title: 'All three traversals', difficulty: 'Intermediate',
    statement: 'Insert n distinct integers into a BST. Print three lines: the preorder, the inorder and the postorder traversals, each separated by spaces.',
    inputFormat: 'Line 1: n. Line 2: n distinct integers.', outputFormat: '3 lines.', constraints: '1 ≤ n ≤ 100',
    examples: [{ input: '5\n23 33 45 30 10', output: '23 10 33 30 45\n10 23 30 33 45\n10 30 45 33 23' }],
    starter: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public class Main {
    static TreeNode insert(TreeNode root, int v) {
        if (root == null) return new TreeNode(v);
        if (v < root.val) root.left = insert(root.left, v);
        else root.right = insert(root.right, v);
        return root;
    }

    static void pre(TreeNode t, List<Integer> out) {
        // TODO: node, left, right
    }
    static void in(TreeNode t, List<Integer> out) {
        // TODO: left, node, right
    }
    static void post(TreeNode t, List<Integer> out) {
        // TODO: left, right, node
    }

    static String join(List<Integer> xs) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < xs.size(); i++) {
            if (i > 0) sb.append(' ');
            sb.append(xs.get(i));
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        TreeNode root = null;
        for (int i = 0; i < n; i++) root = insert(root, sc.nextInt());
        List<Integer> a = new ArrayList<>(), b = new ArrayList<>(), c = new ArrayList<>();
        pre(root, a);
        in(root, b);
        post(root, c);
        System.out.println(join(a));
        System.out.println(join(b));
        System.out.println(join(c));
    }
}
`,
    tests: [{ input: '5\n23 33 45 30 10', expected: '23 10 33 30 45\n10 23 30 33 45\n10 30 45 33 23' }, { input: '1\n7', expected: '7\n7\n7' }, { input: '3\n2 1 3', expected: '2 1 3\n1 2 3\n1 3 2', hidden: true }],
    hints: ['The three methods only differ in WHEN you add the node value.', 'Always stop when the node is null.'],
    approachTanglish: 'Moonu methods-ilum structure ore maadhiri; `out.add(t.val)` evvalavu munnaadi/naduvula/pinnaadi nu mattum maarum.',
    solution: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public class Main {
    static TreeNode insert(TreeNode root, int v) {
        if (root == null) return new TreeNode(v);
        if (v < root.val) root.left = insert(root.left, v);
        else root.right = insert(root.right, v);
        return root;
    }

    static void pre(TreeNode t, List<Integer> out) {
        if (t == null) return;
        out.add(t.val);
        pre(t.left, out);
        pre(t.right, out);
    }
    static void in(TreeNode t, List<Integer> out) {
        if (t == null) return;
        in(t.left, out);
        out.add(t.val);
        in(t.right, out);
    }
    static void post(TreeNode t, List<Integer> out) {
        if (t == null) return;
        post(t.left, out);
        post(t.right, out);
        out.add(t.val);
    }

    static String join(List<Integer> xs) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < xs.size(); i++) {
            if (i > 0) sb.append(' ');
            sb.append(xs.get(i));
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        TreeNode root = null;
        for (int i = 0; i < n; i++) root = insert(root, sc.nextInt());
        List<Integer> a = new ArrayList<>(), b = new ArrayList<>(), c = new ArrayList<>();
        pre(root, a);
        in(root, b);
        post(root, c);
        System.out.println(join(a));
        System.out.println(join(b));
        System.out.println(join(c));
    }
}
`,
  },
  {
    id: 'm7-e3', moduleId: 'm7', title: 'Height of a BST', difficulty: 'Challenge',
    statement: 'Insert n distinct integers into a BST and print its height, measured in edges (a tree with one node has height 0).',
    inputFormat: 'Line 1: n. Line 2: n distinct integers.', outputFormat: 'One integer.', constraints: '1 ≤ n ≤ 100',
    examples: [{ input: '5\n23 33 45 30 10', output: '2' }],
    starter: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public class Main {
    static TreeNode insert(TreeNode root, int v) {
        if (root == null) return new TreeNode(v);
        if (v < root.val) root.left = insert(root.left, v);
        else root.right = insert(root.right, v);
        return root;
    }

    static int height(TreeNode t) {
        // TODO: an empty tree has height -1 (so a single node has height 0)
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        TreeNode root = null;
        for (int i = 0; i < n; i++) root = insert(root, sc.nextInt());
        System.out.println(height(root));
    }
}
`,
    tests: [{ input: '5\n23 33 45 30 10', expected: '2' }, { input: '1\n5', expected: '0' }, { input: '4\n1 2 3 4', expected: '3' }, { input: '7\n50 30 70 20 40 60 80', expected: '2', hidden: true }, { input: '5\n5 4 3 2 1', expected: '4', hidden: true }],
    hints: ['height(null) = -1.', 'height(node) = 1 + max(height(left), height(right)).'],
    approachTanglish: '`null` na -1 return. Illa-na `1 + Math.max(height(left), height(right))`. Oru node-ku (-1 and -1) → 1 + (-1) = 0.',
    solution: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public class Main {
    static TreeNode insert(TreeNode root, int v) {
        if (root == null) return new TreeNode(v);
        if (v < root.val) root.left = insert(root.left, v);
        else root.right = insert(root.right, v);
        return root;
    }

    static int height(TreeNode t) {
        if (t == null) return -1;
        return 1 + Math.max(height(t.left), height(t.right));
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        TreeNode root = null;
        for (int i = 0; i < n; i++) root = insert(root, sc.nextInt());
        System.out.println(height(root));
    }
}
`,
  },

  // ---------------- M8 ----------------
  {
    id: 'm8-e1', moduleId: 'm8', title: 'Count the doubling loop', difficulty: 'Easy',
    statement: 'Read n. Count how many times the loop body runs in: for (int i = 1; i < n; i *= 2) { count++; } and print the count. (This is the O(log n) pattern.)',
    inputFormat: 'One integer n.', outputFormat: 'The count.', constraints: '1 ≤ n ≤ 1000000000',
    examples: [{ input: '16', output: '4' }],
    starter: starter(`        int n = sc.nextInt();
        int count = 0;
        // TODO: run the loop from the statement and count
        System.out.println(count);
`),
    tests: [{ input: '16', expected: '4' }, { input: '1', expected: '0' }, { input: '17', expected: '5' }, { input: '1000000000', expected: '30', hidden: true }],
    hints: ['i doubles each time: 1, 2, 4, 8, ...', 'Use a long or be careful: i *= 2 can overflow for big n. Use long i.'],
    approachTanglish: '`long i = 1` use pannu (int overflow aagum). `for (long i = 1; i < n; i *= 2) count++;`. Count thaan log₂ n.',
    solution: starter(`        int n = sc.nextInt();
        int count = 0;
        for (long i = 1; i < n; i *= 2) {
            count++;
        }
        System.out.println(count);
`),
  },
  {
    id: 'm8-e2', moduleId: 'm8', title: 'Count pairs with a given sum', difficulty: 'Intermediate',
    statement: 'Read n integers and a target t. Count the pairs (i, j) with i < j and a[i] + a[j] = t. Use two nested loops (an O(n²) algorithm).',
    inputFormat: 'Line 1: n. Line 2: n integers. Line 3: t.', outputFormat: 'The number of pairs.', constraints: '1 ≤ n ≤ 1000',
    examples: [{ input: '5\n1 2 3 4 5\n6', output: '2' }],
    starter: starter(`        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int t = sc.nextInt();
        // TODO: nested loops, j starts at i + 1
`),
    tests: [{ input: '5\n1 2 3 4 5\n6', expected: '2' }, { input: '3\n1 1 1\n2', expected: '3' }, { input: '4\n1 2 3 4\n100', expected: '0' }, { input: '1\n5\n5', expected: '0', hidden: true }],
    hints: ['Start j at i + 1 so each pair is counted once.', 'The number of inner iterations is n(n-1)/2, which is O(n²).'],
    approachTanglish: 'Velila `i`, ullae `j = i + 1`-la start. `a[i] + a[j] == t` na count++. Rendu loop → O(n²).',
    solution: starter(`        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int t = sc.nextInt();
        int count = 0;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (a[i] + a[j] == t) count++;
            }
        }
        System.out.println(count);
`),
  },
  {
    id: 'm8-e3', moduleId: 'm8', title: 'Contains a duplicate?', difficulty: 'Intermediate',
    statement: 'Read n integers. Print Yes if any value appears more than once, otherwise No. Use two nested loops (O(n²) time, O(1) extra space).',
    inputFormat: 'Line 1: n. Line 2: n integers.', outputFormat: 'Yes or No', constraints: '1 ≤ n ≤ 1000',
    examples: [{ input: '4\n1 2 3 1', output: 'Yes' }],
    starter: starter(`        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        // TODO: compare every pair
`),
    tests: [{ input: '4\n1 2 3 1', expected: 'Yes' }, { input: '3\n4 5 6', expected: 'No' }, { input: '1\n9', expected: 'No' }, { input: '5\n7 8 9 10 8', expected: 'Yes', hidden: true }],
    hints: ['Compare a[i] with every a[j] where j > i.', 'Stop as soon as you find a match.'],
    approachTanglish: 'Ovvoru pair-ai (i, j>i) compare pannu. Match kidaichaa "Yes" print panni `return`. Loop mudinjum kidaikkala-na "No".',
    solution: starter(`        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (a[i] == a[j]) {
                    System.out.println("Yes");
                    return;
                }
            }
        }
        System.out.println("No");
`),
  },

  // ---------------- M9 ----------------
  {
    id: 'm9-e1', moduleId: 'm9', title: 'Linear search', difficulty: 'Beginner',
    statement: 'Read n integers and a target x. Print the index (from 0) of the first occurrence of x, or -1 if it is not present.',
    inputFormat: 'Line 1: n. Line 2: n integers. Line 3: x.', outputFormat: 'An index or -1.', constraints: '1 ≤ n ≤ 1000',
    examples: [{ input: '5\n4 8 15 16 23\n15', output: '2' }],
    starter: starter(`        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int x = sc.nextInt();
        // TODO: scan from the start
`),
    tests: [{ input: '5\n4 8 15 16 23\n15', expected: '2' }, { input: '3\n1 2 3\n9', expected: '-1' }, { input: '4\n5 5 5 5\n5', expected: '0', hidden: true }, { input: '1\n3\n3', expected: '0', hidden: true }],
    hints: ['Return as soon as a[i] == x.', 'Print -1 only after the loop finishes.'],
    approachTanglish: 'Loop-la `a[i] == x` na index print panni `return`. Loop mudinja apuram -1 print.',
    solution: starter(`        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int x = sc.nextInt();
        for (int i = 0; i < n; i++) {
            if (a[i] == x) {
                System.out.println(i);
                return;
            }
        }
        System.out.println(-1);
`),
  },
  {
    id: 'm9-e2', moduleId: 'm9', title: 'Binary search', difficulty: 'Intermediate',
    statement: 'Read n integers that are already sorted in ascending order (all distinct) and a target x. Use binary search and print the index of x, or -1.',
    inputFormat: 'Line 1: n. Line 2: n sorted integers. Line 3: x.', outputFormat: 'An index or -1.', constraints: '1 ≤ n ≤ 100000',
    examples: [{ input: '7\n10 15 25 30 33 34 36\n25', output: '2' }],
    starter: starter(`        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int x = sc.nextInt();
        int lo = 0, hi = n - 1;
        // TODO: while (lo <= hi) ... compute mid and shrink the range
        System.out.println(-1);
`),
    tests: [{ input: '7\n10 15 25 30 33 34 36\n25', expected: '2' }, { input: '7\n10 15 25 30 33 34 36\n36', expected: '6' }, { input: '7\n10 15 25 30 33 34 36\n10', expected: '0', hidden: true }, { input: '7\n10 15 25 30 33 34 36\n26', expected: '-1' }, { input: '1\n5\n5', expected: '0', hidden: true }],
    hints: ['mid = (lo + hi) / 2', 'If a[mid] < x search the right half: lo = mid + 1. Else hi = mid - 1.'],
    approachTanglish: '`while (lo <= hi)`. `mid` eduthu compare: equal-na print; `a[mid] < x` na `lo = mid + 1`; illa-na `hi = mid - 1`.',
    solution: starter(`        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int x = sc.nextInt();
        int lo = 0, hi = n - 1;
        while (lo <= hi) {
            int mid = (lo + hi) / 2;
            if (a[mid] == x) {
                System.out.println(mid);
                return;
            } else if (a[mid] < x) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        System.out.println(-1);
`),
  },
  {
    id: 'm9-e3', moduleId: 'm9', title: 'Count binary search steps', difficulty: 'Challenge',
    statement: 'Same setup as binary search (sorted distinct integers, target x). Print the index (or -1) and the number of times the middle element was examined, separated by a space. Each loop iteration examines the middle element once.',
    inputFormat: 'Line 1: n. Line 2: n sorted integers. Line 3: x.', outputFormat: '"index steps"', constraints: '1 ≤ n ≤ 100000',
    examples: [{ input: '7\n10 15 25 30 33 34 36\n25', output: '2 3' }],
    starter: starter(`        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int x = sc.nextInt();
        int lo = 0, hi = n - 1;
        int steps = 0;
        // TODO: binary search; increase steps every time you look at a[mid]
`),
    tests: [{ input: '7\n10 15 25 30 33 34 36\n25', expected: '2 3' }, { input: '7\n10 15 25 30 33 34 36\n30', expected: '3 1' }, { input: '7\n10 15 25 30 33 34 36\n11', expected: '-1 3' }, { input: '1\n4\n4', expected: '0 1', hidden: true }, { input: '8\n1 2 3 4 5 6 7 8\n8', expected: '7 4', hidden: true }],
    hints: ['steps++ inside the loop, right after computing mid.', 'For 25: mid=3 (30), then mid=1 (15), then mid=2 (25): 3 steps.'],
    approachTanglish: 'Loop-oda ovvoru round-um `steps++`. Result print pannum pothu `index + " " + steps`. 25 search-la mid=3 (30), apuram lo=0 hi=2 → mid=1 (15), apuram lo=2 → mid=2 (25): 3 steps.',
    solution: starter(`        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int x = sc.nextInt();
        int lo = 0, hi = n - 1;
        int steps = 0;
        while (lo <= hi) {
            int mid = (lo + hi) / 2;
            steps++;
            if (a[mid] == x) {
                System.out.println(mid + " " + steps);
                return;
            } else if (a[mid] < x) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        System.out.println(-1 + " " + steps);
`),
  },

  // ---------------- M10 ----------------
  {
    id: 'm10-e1', moduleId: 'm10', title: 'Bubble sort with swap count', difficulty: 'Easy',
    statement: 'Read n integers. Sort them with bubble sort (adjacent comparisons, ascending). Print the sorted array on the first line and the total number of swaps on the second line.',
    inputFormat: 'Line 1: n. Line 2: n integers.', outputFormat: 'Line 1: sorted numbers. Line 2: number of swaps.', constraints: '1 ≤ n ≤ 100',
    examples: [{ input: '4\n4 3 2 1', output: '1 2 3 4\n6' }],
    starter: starter(`        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int swaps = 0;
        // TODO: for each pass, compare a[j] and a[j+1] and swap when a[j] > a[j+1]
`),
    tests: [{ input: '4\n4 3 2 1', expected: '1 2 3 4\n6' }, { input: '5\n1 2 3 4 5', expected: '1 2 3 4 5\n0' }, { input: '5\n3 1 2 5 4', expected: '1 2 3 4 5\n3', hidden: true }, { input: '1\n8', expected: '8\n0', hidden: true }],
    hints: ['Outer loop i from 0 to n - 2; inner loop j from 0 to n - 2 - i.', 'Use a temporary variable to swap.'],
    approachTanglish: 'Rendu loop. Inner-la `a[j] > a[j+1]` na swap (temp variable use pannu) and `swaps++`. Ovvoru pass-um periya value kadaisi-ku poidum.',
    solution: starter(`        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int swaps = 0;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - 1 - i; j++) {
                if (a[j] > a[j + 1]) {
                    int t = a[j];
                    a[j] = a[j + 1];
                    a[j + 1] = t;
                    swaps++;
                }
            }
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (i > 0) sb.append(' ');
            sb.append(a[i]);
        }
        System.out.println(sb);
        System.out.println(swaps);
`),
  },
  {
    id: 'm10-e2', moduleId: 'm10', title: 'Selection sort passes', difficulty: 'Intermediate',
    statement: 'Read n integers. Run selection sort (ascending). After each pass print the whole array on one line. Print exactly n - 1 lines.',
    inputFormat: 'Line 1: n. Line 2: n integers.', outputFormat: 'n - 1 lines (array after each pass).', constraints: '2 ≤ n ≤ 50',
    examples: [{ input: '5\n65 20 40 6 15', output: '6 20 40 65 15\n6 15 40 65 20\n6 15 20 65 40\n6 15 20 40 65' }],
    starter: starter(`        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        // TODO: for i in 0..n-2: find the index of the smallest in a[i..n-1], swap it into a[i], print the array
`),
    tests: [{ input: '5\n65 20 40 6 15', expected: '6 20 40 65 15\n6 15 40 65 20\n6 15 20 65 40\n6 15 20 40 65' }, { input: '2\n2 1', expected: '1 2' }, { input: '3\n1 2 3', expected: '1 2 3\n1 2 3', hidden: true }],
    hints: ['Keep minIndex = i, then scan j from i + 1.', 'Swap a[i] and a[minIndex] after the scan, then print.'],
    approachTanglish: 'Ovvoru pass-lum `minIndex = i`; j loop-la chinna value kidaichaa minIndex update. Scan mudinja apuram swap, apuram array print.',
    solution: starter(`        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        for (int i = 0; i < n - 1; i++) {
            int minIndex = i;
            for (int j = i + 1; j < n; j++) {
                if (a[j] < a[minIndex]) minIndex = j;
            }
            int t = a[i];
            a[i] = a[minIndex];
            a[minIndex] = t;
            StringBuilder sb = new StringBuilder();
            for (int k = 0; k < n; k++) {
                if (k > 0) sb.append(' ');
                sb.append(a[k]);
            }
            System.out.println(sb);
        }
`),
  },
  {
    id: 'm10-e3', moduleId: 'm10', title: 'Insertion sort with shift count', difficulty: 'Challenge',
    statement: 'Read n integers. Sort them with insertion sort (ascending). Print the sorted array, then on the next line the total number of times an element was shifted one place to the right.',
    inputFormat: 'Line 1: n. Line 2: n integers.', outputFormat: 'Line 1: sorted numbers. Line 2: shift count.', constraints: '1 ≤ n ≤ 100',
    examples: [{ input: '5\n5 4 3 2 1', output: '1 2 3 4 5\n10' }],
    starter: starter(`        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int shifts = 0;
        // TODO: for i from 1: key = a[i]; shift larger elements right; place the key
`),
    tests: [{ input: '5\n5 4 3 2 1', expected: '1 2 3 4 5\n10' }, { input: '4\n1 2 3 4', expected: '1 2 3 4\n0' }, { input: '5\n3 1 2 5 4', expected: '1 2 3 4 5\n3', hidden: true }, { input: '3\n2 2 1', expected: '1 2 2\n2', hidden: true }],
    hints: ['int key = a[i]; int j = i - 1;', 'while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; shifts++; } a[j + 1] = key;'],
    approachTanglish: '`key = a[i]`. `j = i-1`-la irundhu pinnaadi poi, `a[j] > key` irukkum varaikkum a[j]-ai valathu nagarthu (`shifts++`). Kadaisila `a[j+1] = key`.',
    solution: starter(`        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int shifts = 0;
        for (int i = 1; i < n; i++) {
            int key = a[i];
            int j = i - 1;
            while (j >= 0 && a[j] > key) {
                a[j + 1] = a[j];
                j--;
                shifts++;
            }
            a[j + 1] = key;
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (i > 0) sb.append(' ');
            sb.append(a[i]);
        }
        System.out.println(sb);
        System.out.println(shifts);
`),
  },
]

export const exerciseById = new Map(exercises.map((e) => [e.id, e]))
