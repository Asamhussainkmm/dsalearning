import type { Lesson } from '../../types'

const NODE_AND_LIST = `class Node<T> {
    private T data;
    private Node<T> next;

    Node(T data) {
        this.data = data;
        this.next = null;
    }

    T getData() { return data; }
    void setData(T data) { this.data = data; }
    Node<T> getNext() { return next; }
    void setNext(Node<T> next) { this.next = next; }
}`

export const m4: Lesson[] = [
  {
    id: 'm4-l1',
    moduleId: 'm4',
    title: 'Linked List: Nodes Connected by Arrows',
    minutes: 30,
    objectives: ['Explain a node (data + next) and head', 'Explain why linked lists were invented', 'Create three connected nodes in Java'],
    source: 'Lecture 5 (Linked List), Practical Sheet 4',
    blocks: [
      { t: 'analogy', title: 'Treasure hunt', body: 'Treasure hunt vilaiyaatu-la oru **clue paper**-la "adutha clue ingae irukku" nu irukkum. Mudhal clue-ai mattum thaan therium; ovvoru clue-um adutha clue-ai kaattum. **Linked list** idhe thaan: ovvoru **node**-um data-oda **adutha node-in address (reference)**-ai vachirukkum. Mudhal node-ku peru **head**. Kadaisi node-oda next = **null** ("adutha clue illa").' },
      { t: 'text', body: 'Array-ku oru kuraai irundhadhu: **size munnaadiye theriyanum**, aprom maathamudiyaadhu; naduvula insert/delete-na elements-ai shift pannanum. Linked list **thevai-ku eththaiyaa pudhu node create** pannum, shifting thevai illa.' },
      { t: 'viz', viz: 'linkedList', caption: 'Node-gal arrows-vaal connect aagiradhai paarunga. Add / remove try pannunga.' },
      { t: 'terms', items: [
        { term: 'Node', meaning: 'Linked list-oda oru item: `data` + `next` (adutha node-ai point panra reference).' },
        { term: 'Head', meaning: 'Mudhal node-ai point panra reference. List-ai thodanga idhu thaan vazhi.' },
        { term: 'null', meaning: '"Ethuvum illa". Kadaisi node-oda next null.' },
        { term: 'Dynamic memory allocation', meaning: 'Program run aagura pothu thevai-ku thaan memory ottrukkuradhu (`new Node(...)`).' },
      ] },
      { t: 'code', caption: 'Node class + 3 nodes-ai manual-ah connect panrom', code: `${NODE_AND_LIST}\n\npublic class Main {\n    public static void main(String[] args) {\n        Node<Integer> head = new Node<>(10);\n        head.setNext(new Node<>(20));\n        head.getNext().setNext(new Node<>(30));\n\n        Node<Integer> current = head;\n        while (current != null) {\n            System.out.println(current.getData());\n            current = current.getNext();\n        }\n    }\n}`, lines: [
        '`Node<T>` generic: data enna type-aanaalum (Integer, String...) velai seiyum.',
        '`head = new Node<>(10)` – mudhal node (10). Ippodhaikku next = null.',
        '`head.setNext(new Node<>(20))` – mudhal node-oda next-ai rendavadhu node-ku point pannidhom.',
        '`current` oru pointer maadhiri: head-la start panni `getNext()`-vaal oru oru node-aa nagarum.',
        '`while (current != null)` – null varra varaikkum. Idhu thaan **traversal**.',
      ], output: '10\n20\n30' },
      { t: 'simpler', body: 'Node = oru petti. Petti-kulla oru value irukku, adhodu "adutha petti engae" nu oru chit irukku. Mudhal petti-ai head sollrom. Chit-ai follow panni ellaa petti-ai poi paakkalaam.' },
      { t: 'mistakes', items: ['Head-ai nagarthuradhu (`head = head.getNext()`): mudhal node-ai ilandhuduveenga. Pointer-ku thaniyaa `current` variable use pannunga.', 'Next = null check pannaama `getNext().getNext()` poradhu → NullPointerException.', 'Linked list-ai index vachu direct access panna mudiyum nu ninaikkuradhu: mudhalla irundhu nagaranum (O(n)).'] },
      { t: 'check', questionId: 'm4-q1' },
    ],
    summary: ['Node = data + next. Head = first node. Last next = null.', 'Pudhu node-ai thevai-ku create panra "dynamic" structure.', 'Traversal: `current = head; while (current != null) { ...; current = current.getNext(); }`', 'Index access O(n).'],
  },
  {
    id: 'm4-l2',
    moduleId: 'm4',
    title: 'Building the List: addFront, addEnd, print',
    minutes: 35,
    objectives: ['Write addFront and addEnd', 'Print a list with a traversal', 'Keep count correct'],
    source: 'Lecture 5, Practical Sheet 4',
    blocks: [
      { t: 'text', body: 'Ippo nammuku oru **list class** thevai. Idhu head-ai and `count`-ai vechukkum.' },
      { t: 'steps', title: 'addFront(data) – 3 steps', items: ['Pudhu node create pannunga.', 'Pudhu node-oda `next` = ippo irukkura `head`.', '`head` = pudhu node. (Order mukkiyam! Rendavadhai mudhal seithaa, list-ai ilandhuduveenga.)'] },
      { t: 'steps', title: 'addEnd(data) – lecture-oda "Appending a node" pseudocode', items: ['Pudhu node create pannu, data podu.', 'List kaaliya iruntha: pudhu node thaan head.', 'Illa-na: head-la irundhu **last node** varaikkum nagaru (`next == null`).', 'Last node-oda next = pudhu node.'] },
      { t: 'code', caption: 'MyList<T>: addFront, addEnd, printData, size', code: `${NODE_AND_LIST}\n\nclass MyList<T> {\n    private Node<T> head;\n    private int count;\n\n    public boolean isEmpty() {\n        return head == null;\n    }\n\n    public int size() {\n        return count;\n    }\n\n    public void addFront(T data) {\n        Node<T> node = new Node<>(data);\n        node.setNext(head);\n        head = node;\n        count++;\n    }\n\n    public void addEnd(T data) {\n        if (isEmpty()) {\n            addFront(data);\n            return;\n        }\n        Node<T> node = new Node<>(data);\n        Node<T> current = head;\n        while (current.getNext() != null) {\n            current = current.getNext();\n        }\n        current.setNext(node);\n        count++;\n    }\n\n    public void printData() {\n        if (isEmpty()) {\n            System.out.println("List is Empty:..");\n            return;\n        }\n        StringBuilder sb = new StringBuilder("[");\n        Node<T> current = head;\n        while (current != null) {\n            sb.append(current.getData());\n            if (current.getNext() != null) sb.append(", ");\n            current = current.getNext();\n        }\n        System.out.println(sb.append("]"));\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        MyList<Integer> list = new MyList<>();\n        list.printData();\n        list.addFront(5);\n        list.addFront(10);\n        list.addEnd(80);\n        list.addEnd(66);\n        list.printData();\n        System.out.println("size = " + list.size());\n    }\n}`, lines: [
        '`isEmpty()` – head null-na list kaali.',
        '`addFront`: `node.setNext(head)` **mudhal**, apram `head = node`.',
        '`addEnd`: while loop `getNext() != null` varaikkum. Last node-la nikkum.',
        '`count++` – ovvoru add-kum size-ai update panrom (O(1) size).',
        'Gavanam: `addEnd` O(n) (last node-ai thedanum); `addFront` O(1).',
      ], output: 'List is Empty:..\n[10, 5, 80, 66]\nsize = 4' },
      { t: 'viz', viz: 'linkedList', caption: 'addFront vs addEnd-ai try pannunga.' },
      { t: 'mistakes', items: ['addFront-la `head = node` mudhal, `node.setNext(head)` aprom: node thannaiye point pannidum.', 'Kaaliya list-ku `current.getNext()`: NullPointerException. Empty check pannunga.', 'count update marandhudradhu.'] },
      { t: 'check', questionId: 'm4-q2' },
      { t: 'check', questionId: 'm4-q3' },
    ],
    summary: ['addFront O(1): link new node, then move head.', 'addEnd O(n): travel to last node.', 'Traversal-la `current != null`.', 'Always handle the empty list.'],
  },
  {
    id: 'm4-l3',
    moduleId: 'm4',
    title: 'Remove, Ordered Insert and Reverse Display',
    minutes: 40,
    objectives: ['Remove a node by value', 'Insert into a sorted list', 'Display a list in reverse'],
    source: 'Lecture 5 (Deleting a node, Inserting a node, Exercise), Assignment 1 Q2',
    blocks: [
      { t: 'analogy', title: 'Chain-la oru link-ai nikkuradhu', body: 'Chain-la naduvula oru link-ai neekkanum-na, **munnadi irukkura link-ai pinnadi irukkura link-oda** connect pannanum. Linked list remove-um idhe: **previous node-oda next = deleted node-oda next**.' },
      { t: 'steps', title: 'remove(data)', items: ['List kaaliya-na `false`.', 'Head-oda data match-na: `head = head.next` (head-ai nagarthidu).', 'Illa-na `previous` and `current` rendu pointers-oda nagaru.', 'Match kidaichaa: `previous.next = current.next` (current-ai skip).', 'Count-ai kuraichu `true` return pannu.'] },
      { t: 'code', caption: 'remove, insertSorted, printReverse', code: `${NODE_AND_LIST}\n\nclass MyList<T extends Comparable<T>> {\n    private Node<T> head;\n    private int count;\n\n    public void addEnd(T data) {\n        Node<T> node = new Node<>(data);\n        if (head == null) {\n            head = node;\n        } else {\n            Node<T> cur = head;\n            while (cur.getNext() != null) cur = cur.getNext();\n            cur.setNext(node);\n        }\n        count++;\n    }\n\n    public boolean remove(T data) {\n        if (head == null) return false;\n        if (head.getData().equals(data)) {\n            head = head.getNext();\n            count--;\n            return true;\n        }\n        Node<T> previous = head;\n        Node<T> current = head.getNext();\n        while (current != null) {\n            if (current.getData().equals(data)) {\n                previous.setNext(current.getNext());\n                count--;\n                return true;\n            }\n            previous = current;\n            current = current.getNext();\n        }\n        return false;\n    }\n\n    public void insertSorted(T data) {\n        Node<T> node = new Node<>(data);\n        if (head == null || data.compareTo(head.getData()) <= 0) {\n            node.setNext(head);\n            head = node;\n        } else {\n            Node<T> cur = head;\n            while (cur.getNext() != null && cur.getNext().getData().compareTo(data) < 0) {\n                cur = cur.getNext();\n            }\n            node.setNext(cur.getNext());\n            cur.setNext(node);\n        }\n        count++;\n    }\n\n    public void print() {\n        StringBuilder sb = new StringBuilder("[");\n        for (Node<T> c = head; c != null; c = c.getNext()) {\n            sb.append(c.getData());\n            if (c.getNext() != null) sb.append(", ");\n        }\n        System.out.println(sb.append("]"));\n    }\n\n    public void printReverse() {\n        printReverse(head);\n        System.out.println();\n    }\n\n    private void printReverse(Node<T> n) {\n        if (n == null) return;\n        printReverse(n.getNext());\n        System.out.print(n.getData() + " ");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        MyList<Integer> list = new MyList<>();\n        list.insertSorted(30);\n        list.insertSorted(10);\n        list.insertSorted(20);\n        list.insertSorted(25);\n        list.print();\n        System.out.println(list.remove(10));\n        System.out.println(list.remove(99));\n        list.print();\n        list.printReverse();\n    }\n}`, lines: [
        '`remove`: head special case mudhal. Appuram `previous`/`current` rendu pointers.',
        '`previous.setNext(current.getNext())` – current-ai list-la irundhu "skip" panrom. Java garbage collector antha node-ai alichidum.',
        '`insertSorted`: sorted order maintain. Pudhu value-ai vida **periya** value varra idam vara nagaru, munnaadi irukkura node-oda insert.',
        '`<T extends Comparable<T>>` – `compareTo`-vaal rendu values-ai compare panna thevai.',
        '`printReverse` **recursion**: kadaisi node varaikkum poi, thirumbi varra pothu print. Stack maadhiri velai seiyum.',
      ], output: '[10, 20, 25, 30]\ntrue\nfalse\n[20, 25, 30]\n30 25 20 ' },
      { t: 'text', body: '**Lecture exercise: reverse order display**. Idhai rendu vazhila pannalaam: (1) recursion, mela irukkura maadhiri; (2) list-ai thalai keezhaa maathidhu (iterative reverse) apram print. Rendum O(n).' },
      { t: 'mistakes', items: ['Head-ai remove panradha special case-aa handle pannaama `previous.setNext` call panradhu: `previous` null.', 'Remove-la `previous = current` update marandhudradhu: infinite loop / wrong node.', 'Sorted insert-la `compareTo` badhila `<` use panradhu (generic objects-ku work aagaadhu).'] },
      { t: 'check', questionId: 'm4-q4' },
      { t: 'check', questionId: 'm4-q5' },
    ],
    summary: ['Remove: previous.next = current.next. Head = special case.', 'Sorted insert: correct place-ai kandupidi, apram link.', 'Reverse display: recursion (or reverse the list).', 'Ellaam O(n) (search part).'],
  },
  {
    id: 'm4-l4',
    moduleId: 'm4',
    title: 'Linked List vs Array, ADT Interface, java.util.LinkedList',
    minutes: 25,
    objectives: ['Compare array and linked list', 'List four linked list operations', 'Use java.util.LinkedList'],
    source: 'Assignment 1 Q1c & Q2a, Sample Paper 2021 Q3 (iii, iv), Lecture 5 exercise',
    blocks: [
      { t: 'table', caption: 'Array vs Linked List (exam favourite)', head: ['', 'Array', 'Linked list'], rows: [['Memory', 'Continuous block, size fixed', 'Pala idangal-la, nodes pointer-aal connect'], ['Size', 'Fixed (static)', 'Dynamic (thevai-ku valarum)'], ['Access by index', 'O(1)', 'O(n)'], ['Insert/delete in middle', 'O(n) (shifting)', 'O(1) once node found (no shifting)'], ['Extra memory', 'Illa', 'Ovvoru node-kum reference'], ['Cache-friendly', 'Aama', 'Illa']] },
      { t: 'terms', items: [
        { term: 'Four basic linked list operations', meaning: '**Appending** a node, **Traversing** the list, **Inserting** a node, **Deleting** a node (lecture).' },
        { term: 'Interface', meaning: 'Operations-ai mattum solra Java contract (ADT). Implementation illa.' },
      ] },
      { t: 'code', caption: 'Assignment Q2(a): operations-ai interface-aa solrom', code: 'interface LinkedListADT<T> {\n    void insertFront(T data);\n    void insertEnd(T data);\n    void insertSorted(T data);\n    boolean delete(T data);\n    void display();\n    boolean isEmpty();\n    int size();\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("LinkedListADT defined");\n    }\n}', lines: ['Interface = **what**. MyList class = **how**.', 'Appadi seidhaa, use panravanga implementation maarinaalum code maara vendaam.'], output: 'LinkedListADT defined' },
      { t: 'code', caption: 'Java-la ready-made: java.util.LinkedList', code: 'import java.util.LinkedList;\n\npublic class Main {\n    public static void main(String[] args) {\n        LinkedList<String> names = new LinkedList<>();\n        names.add("Kamal");\n        names.addFirst("Priya");\n        names.addLast("Gamini");\n        System.out.println(names);\n        names.removeFirst();\n        names.remove("Gamini");\n        System.out.println(names);\n        System.out.println(names.getFirst());\n    }\n}', lines: ['Idhu **doubly** linked list: ovvoru node-um next-um previous-um vaichirukkum.', '`addFirst`, `addLast`, `removeFirst` – O(1).'], output: '[Priya, Kamal, Gamini]\n[Kamal]\nKamal' },
      { t: 'text', body: 'Lecture-la **memory question** irukku: "Average N integers store panna vendum, worst case 2N. Array-aa, linked list-aa?" Array-na 2N ints munnadiye reserve pannanum. Linked list-na thevaiyaana ellaarkum mattum; aana 32-bit address-um ovvoru node-kum (data 4 bytes + pointer 4 bytes = 2x). Size romba maaruna **linked list**; size theriyum and index access athigam-na **array**.' },
      { t: 'mistakes', items: ['"Linked list ellathukkum array vida nalladhu" nu solradhu: access slow, extra memory.', 'Singly and doubly list-ai kuzhambuvadhu: `java.util.LinkedList` doubly.'] },
      { t: 'check', questionId: 'm4-q6' },
    ],
    summary: ['Linked list: dynamic, insert/delete fast (no shifting), index access slow.', 'Four ops: append, traverse, insert, delete.', 'Interface = ADT; class = implementation.', 'java.util.LinkedList is doubly linked.'],
  },
]
