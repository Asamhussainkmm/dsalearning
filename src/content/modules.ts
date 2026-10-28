import type { Module } from '../types'

/**
 * Curriculum inventory (source -> module mapping)
 *  Prep (not in notes)         : absolute-beginner Java basics needed by every later module
 *  Lecture 2, Practical 1/2    : Data abstraction, ADTs, arrays, 2D arrays, loops          -> M1, M2
 *  Lecture 4, Practical 3      : array operations, Java List / ArrayList methods           -> M2, M3
 *  Lecture 5 (generics), Prac 4: Generics, linked list (Node/List classes)                 -> M3, M4
 *  Lecture 7, Practical 5      : Stack (array, java.util.Stack)                            -> M5
 *  Lecture 8, Week 8 sheet     : Queue, circular queue, ArrayQueue                         -> M6
 *  Lecture 9, Lecture 3 (BST)  : Trees, binary trees, traversals, BST, AVL                 -> M7
 *  Lecture 11                  : Algorithm analysis, time/space complexity, Big O          -> M8
 *  Lecture 12/13              : Sequential & binary search                                -> M9
 *  Lecture 14/15              : Selection, insertion, bubble sort                         -> M10
 *  Assignment 1, past papers   : used to shape exercises, MCQs and short answers
 *  Graphs                      : NOT present in any attached note, so intentionally not included.
 */
export const modules: Module[] = [
  {
    id: 'm0',
    number: 0,
    title: 'Java Basics for Absolute Beginners',
    tanglish: 'Programming-ae theriyaadha students-ku. Variables, conditions, loops, methods ellam romba simple-ah start panrom. Idha mudichaa mattume DSA purinjikka mudiyum.',
    prerequisites: [],
    minutes: 120,
    sources: ['Preparation module (supports Practical Sheet 01 – loops)'],
    beginnerPrep: true,
    lessonIds: ['m0-l1', 'm0-l2', 'm0-l3', 'm0-l4', 'm0-l5'],
  },
  {
    id: 'm1',
    number: 1,
    title: 'Data Structures, Algorithms & ADTs',
    tanglish: 'Data structure-na enna? Algorithm-na enna? ADT-na enna? Real-life examples vachu foundation-ai strong-ah podalaam.',
    prerequisites: ['m0'],
    minutes: 60,
    sources: ['Lecture 2 (Data Abstraction, ADT)', 'Lecture 11 (Definition of Algorithm)', 'Assignment 1 Q1', 'Sample Paper 2021 Q1'],
    lessonIds: ['m1-l1', 'm1-l2', 'm1-l3'],
  },
  {
    id: 'm2',
    number: 2,
    title: 'Arrays',
    tanglish: 'Oru row of boxes maadhiri multiple values-ai store panra array. Index, insertion, deletion, 2D arrays, matrix addition ellam step-by-step.',
    prerequisites: ['m0', 'm1'],
    minutes: 120,
    sources: ['Lecture 2 (Arrays)', 'Lecture 4 (Basic operations)', 'Practical Sheets 1 & 2', 'Sample Paper 2021 Q1, Q2'],
    lessonIds: ['m2-l1', 'm2-l2', 'm2-l3', 'm2-l4'],
  },
  {
    id: 'm3',
    number: 3,
    title: 'Java Collections & Generics',
    tanglish: 'Fixed size array-ku alternative: ArrayList, Vector, List methods, Generics. Size automatic-ah valarum arrays.',
    prerequisites: ['m2'],
    minutes: 90,
    sources: ['Lecture 4 (List, ArrayList)', 'Lecture 5 (Generics)', 'Practical Sheet 3 (ArrayList)', 'Sample Paper 2021 Q2, Q3'],
    lessonIds: ['m3-l1', 'm3-l2', 'm3-l3'],
  },
  {
    id: 'm4',
    number: 4,
    title: 'Linked Lists',
    tanglish: 'Nodes-ai arrow (reference) vachu connect panra structure. Insert, delete, display ellam Node class vachu Java-la implement panrom.',
    prerequisites: ['m2', 'm3'],
    minutes: 130,
    sources: ['Lecture 5 (Linked List)', 'Practical Sheet 4', 'Assignment 1 Q2', 'Sample Paper 2021 Q3'],
    lessonIds: ['m4-l1', 'm4-l2', 'm4-l3', 'm4-l4'],
  },
  {
    id: 'm5',
    number: 5,
    title: 'Stacks',
    tanglish: 'Plates stack maadhiri: last-ah vechadhu first-ah edukkanum (LIFO). push, pop, overflow, underflow ellam clear-ah purinjikkalaam.',
    prerequisites: ['m2'],
    minutes: 90,
    sources: ['Lecture 7 (Stack)', 'Practical Sheet 5', 'Assignment 1 Q3', 'Sample Paper 2021 Q4'],
    lessonIds: ['m5-l1', 'm5-l2', 'm5-l3'],
  },
  {
    id: 'm6',
    number: 6,
    title: 'Queues',
    tanglish: 'Ticket counter line maadhiri: first vandhavar first-ah service (FIFO). enqueue, dequeue, front, rear, circular queue.',
    prerequisites: ['m2', 'm5'],
    minutes: 100,
    sources: ['Lecture 8 (Queue)', 'Week 08 Practical Sheet (ArrayQuequ)', 'Assignment 1 Q3c', 'Sample Paper 2021 Q4'],
    lessonIds: ['m6-l1', 'm6-l2', 'm6-l3'],
  },
  {
    id: 'm7',
    number: 7,
    title: 'Trees & Binary Search Trees',
    tanglish: 'Family tree maadhiri hierarchy data. Root, leaf, height, traversals, BST insert/search/delete, AVL basics.',
    prerequisites: ['m4'],
    minutes: 130,
    sources: ['Lecture 9 (Tree)', 'Lecture 3 (BST)', 'Assignment 1 Q4', 'Sample Paper 2021 Q5'],
    lessonIds: ['m7-l1', 'm7-l2', 'm7-l3', 'm7-l4'],
  },
  {
    id: 'm8',
    number: 8,
    title: 'Algorithm Analysis & Big O',
    tanglish: 'Rendu algorithm-ai compare panradhu eppadi? Time complexity, space complexity, Big O rules.',
    prerequisites: ['m2'],
    minutes: 90,
    sources: ['Lecture 11 (Analyze Algorithm)', 'Sample Paper 2021 Q1 (v)'],
    lessonIds: ['m8-l1', 'm8-l2', 'm8-l3'],
  },
  {
    id: 'm9',
    number: 9,
    title: 'Searching Algorithms',
    tanglish: 'Data-ai thedura rendu muraigal: sequential (linear) search and binary search. Efficiency comparison.',
    prerequisites: ['m2', 'm8'],
    minutes: 80,
    sources: ['Lecture 12/13 (Searching)', 'Sample Paper 2021 Q6'],
    lessonIds: ['m9-l1', 'm9-l2', 'm9-l3'],
  },
  {
    id: 'm10',
    number: 10,
    title: 'Sorting Algorithms',
    tanglish: 'Bubble sort, selection sort, insertion sort: step-by-step trace, Java code, efficiency comparison.',
    prerequisites: ['m2', 'm8'],
    minutes: 120,
    sources: ['Lecture 14/15 (Sorting)', 'Sample Paper 2021 Q5 (vi-viii)'],
    lessonIds: ['m10-l1', 'm10-l2', 'm10-l3', 'm10-l4'],
  },
]

export const moduleById = (id: string) => modules.find((m) => m.id === id)
