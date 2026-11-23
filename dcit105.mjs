export default {
  course: {
    code: "DCIT 105",
    title: "Mathematics for IT Professionals",
    summary:
      "The maths behind computing: sets, relations and functions, logic, Boolean algebra and counting.",
    description:
      "Mathematical foundations for information technology: sets and Venn diagrams, relations and functions, propositional logic and truth tables, Boolean algebra and logic gates, and counting techniques such as permutations and combinations — the toolkit used later in programming, databases, networking and security.",
    track: "core",
    accent: "violet",
  },
  materials: [
    {
      week: 1,
      kind: "slides",
      title: "Week 1 — Sets & set operations",
      description: "Notation, special sets, union, intersection, complement and the counting rule.",
      content: `# Sets

A **set** is a well-defined collection of distinct objects called **elements**.

- Listing (roster) form: A = {1, 2, 3, 4}
- Set-builder form: A = {x : x is an integer, 1 ≤ x ≤ 4}
- x ∈ A means "x is an element of A"; x ∉ A means it is not
- n(A) is the number of elements in A (its **cardinality**)

---

## Special sets

∅ empty set · U universal set · ℕ natural numbers · ℤ integers · ℚ rational numbers · ℝ real numbers

A ⊆ B — every element of A is also in B (A is a **subset** of B)

---

## Operations

| Operation | Notation | Elements |
| --- | --- | --- |
| Union | A ∪ B | in A or B (or both) |
| Intersection | A ∩ B | in both A and B |
| Difference | A − B | in A but not in B |
| Complement | A′ | in U but not in A |

---

## Worked example

U = {1, 2, …, 10}, A = {1, 2, 3, 4, 5}, B = {4, 5, 6, 7}

- A ∪ B = {1, 2, 3, 4, 5, 6, 7}
- A ∩ B = {4, 5}
- A − B = {1, 2, 3}
- B′ = {1, 2, 3, 8, 9, 10}

---

## Results to remember

- n(A ∪ B) = n(A) + n(B) − n(A ∩ B) → here 5 + 4 − 2 = **7**
- A set with n elements has **2ⁿ** subsets (its power set)
- De Morgan's laws: (A ∪ B)′ = A′ ∩ B′ and (A ∩ B)′ = A′ ∪ B′`,
    },
    {
      week: 2,
      kind: "notes",
      title: "Week 2 — Relations & functions",
      description: "Cartesian products, properties of relations, types of functions, composition and inverses.",
      content: `# Relations & functions

## Cartesian product
A × B = {(a, b) : a ∈ A, b ∈ B}, and n(A × B) = n(A) × n(B)

## Relations
A **relation** from A to B is any subset of A × B. For a relation R on a set A:

| Property | Meaning |
| --- | --- |
| Reflexive | (a, a) ∈ R for every a in A |
| Symmetric | if (a, b) ∈ R then (b, a) ∈ R |
| Antisymmetric | if (a, b) ∈ R and (b, a) ∈ R then a = b |
| Transitive | if (a, b) ∈ R and (b, c) ∈ R then (a, c) ∈ R |

An **equivalence relation** is reflexive, symmetric **and** transitive.

## Functions
A function f : A → B assigns **exactly one** element of B to each element of A.
- Domain = A · codomain = B · range = the outputs actually produced

| Type | Meaning |
| --- | --- |
| Injective (one-to-one) | different inputs always give different outputs |
| Surjective (onto) | every element of B is an output (range = codomain) |
| Bijective | both — and only bijections have an inverse |

## Composition
(g ∘ f)(x) = g(f(x)). With f(x) = 2x + 1 and g(x) = x²:
- (g ∘ f)(x) = (2x + 1)²
- (f ∘ g)(x) = 2x² + 1 → composition is **not** commutative

## Finding an inverse
f(x) = 2x + 1 → write y = 2x + 1 → solve for x: x = (y − 1)/2 → **f⁻¹(x) = (x − 1)/2**

Check: f(f⁻¹(x)) = 2 · (x − 1)/2 + 1 = x ✓`,
    },
    {
      week: 3,
      kind: "slides",
      title: "Week 3 — Propositional logic & truth tables",
      description: "Propositions, connectives, truth tables, the conditional family and key laws.",
      content: `# Propositional logic

A **proposition** is a statement that is either true or false, but not both.

- "Accra is the capital of Ghana" ✔ proposition
- "Close the door" ✘ not a proposition (a command)

---

## Connectives

| Symbol | Name | Read as |
| --- | --- | --- |
| ¬p | negation | not p |
| p ∧ q | conjunction | p and q |
| p ∨ q | disjunction | p or q |
| p → q | conditional | if p then q |
| p ↔ q | biconditional | p if and only if q |

---

## Truth table

| p | q | p ∧ q | p ∨ q | p → q | p ↔ q |
| --- | --- | --- | --- | --- | --- |
| T | T | T | T | T | T |
| T | F | F | T | F | F |
| F | T | F | T | T | F |
| F | F | F | F | T | T |

> p → q is false **only** when p is true and q is false.

---

## The conditional family (for p → q)

- Converse: q → p
- Inverse: ¬p → ¬q
- **Contrapositive: ¬q → ¬p** — always logically equivalent to p → q

---

## Tautology, contradiction, contingency

- Tautology — always true, e.g. p ∨ ¬p
- Contradiction — always false, e.g. p ∧ ¬p
- Contingency — true in some rows, false in others

---

## Laws worth memorising

- De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q and ¬(p ∨ q) ≡ ¬p ∧ ¬q
- Conditional: p → q ≡ ¬p ∨ q
- Double negation: ¬¬p ≡ p`,
    },
    {
      week: 4,
      kind: "notes",
      title: "Week 4 — Boolean algebra & logic gates",
      description: "The seven gates, Boolean laws and a worked simplification.",
      content: `# Boolean algebra & logic gates

## Logic gates

| Gate | Expression | Output is 1 when… |
| --- | --- | --- |
| AND | A · B | both inputs are 1 |
| OR | A + B | at least one input is 1 |
| NOT | A′ | the input is 0 |
| NAND | (A · B)′ | the inputs are not both 1 |
| NOR | (A + B)′ | both inputs are 0 |
| XOR | A ⊕ B | the inputs are different |
| XNOR | (A ⊕ B)′ | the inputs are the same |

NAND and NOR are **universal gates** — any circuit can be built from either one alone.

## Boolean laws

| Law | AND form | OR form |
| --- | --- | --- |
| Identity | A · 1 = A | A + 0 = A |
| Null | A · 0 = 0 | A + 1 = 1 |
| Idempotent | A · A = A | A + A = A |
| Complement | A · A′ = 0 | A + A′ = 1 |
| Absorption | A(A + B) = A | A + AB = A |
| De Morgan | (AB)′ = A′ + B′ | (A + B)′ = A′B′ |

## Worked simplification

F = AB + AB′
= A(B + B′) — distributive law
= A · 1 — complement law
= **A** — identity law

## Exam tip
If you are unsure, build the truth table: two expressions are equal exactly when their truth tables match row for row.`,
    },
    {
      week: 5,
      kind: "notes",
      title: "Week 5 — Counting: permutations & combinations",
      description: "Product and sum rules, factorials, nPr, nCr, repeated letters and PIN/password examples.",
      content: `# Counting techniques

## Basic principles
- **Product rule** — if one task can be done in m ways and a second in n ways, both together can be done in m × n ways
- **Sum rule** — if a task can be done in m ways **or** in n other (non-overlapping) ways, there are m + n ways

## Factorials
n! = n × (n − 1) × … × 2 × 1, and **0! = 1**

## Permutations — order matters
nPr = n! / (n − r)!

Choosing a president, secretary and treasurer from 10 students: 10P3 = 10 × 9 × 8 = **720**

## Combinations — order does not matter
nCr = n! / (r! (n − r)!)

Choosing a 3-person committee from 10 students: 10C3 = 720 / 3! = **120**

## Arrangements with repeated letters
n! / (n₁! n₂! …)
- LEGON (5 different letters): 5! = **120**
- GHANA (A appears twice): 5! / 2! = **60**

## IT applications
- 4-digit PIN, repetition allowed: 10⁴ = **10,000**
- 4-digit PIN, no repeated digits: 10P4 = **5,040**
- 8-character password of lowercase letters: 26⁸ ≈ **2.09 × 10¹¹**

## Permutation or combination?
Ask: "If I swap two of the chosen items, is it a different outcome?" Yes → permutation. No → combination.`,
    },
    {
      week: null,
      kind: "link",
      title: "Discrete Mathematics: An Open Introduction (free textbook)",
      description: "Free online textbook covering sets, logic, functions and counting with practice problems.",
      url: "https://discrete.openmathbooks.org/",
    },
  ],
  quiz: {
    title: "DCIT 105 — Sets, functions & logic test",
    description: "Weeks 1–4: sets, relations and functions, propositional logic and Boolean algebra.",
    week: 4,
    time: 12,
    questions: [
      {
        type: "single",
        prompt: "If A = {1, 2, 3, 4, 5} and B = {4, 5, 6, 7}, what is A ∩ B?",
        options: ["{4, 5}", "{1, 2, 3}", "{1, 2, 3, 4, 5, 6, 7}", "{6, 7}"],
        correct: "{4, 5}",
        explanation: "The intersection contains only the elements found in both sets: 4 and 5.",
        points: 1,
      },
      {
        type: "single",
        prompt: "Which compound proposition is false only when p is true and q is false?",
        options: ["p → q", "p ∧ q", "p ∨ q", "p ↔ q"],
        correct: "p → q",
        explanation:
          "That is the defining row of the conditional. p ∧ q is false in three rows, p ∨ q only when both are false.",
        points: 2,
      },
      {
        type: "multiple",
        prompt: "Which properties must an equivalence relation have? (Select all that apply)",
        options: ["Reflexive", "Symmetric", "Transitive", "Antisymmetric"],
        correct: ["Reflexive", "Symmetric", "Transitive"],
        explanation:
          "Equivalence = reflexive + symmetric + transitive. Antisymmetry belongs to partial orders instead.",
        points: 2,
      },
      {
        type: "boolean",
        prompt: "p → q is logically equivalent to its contrapositive ¬q → ¬p.",
        correct: true,
        explanation: "True — their truth tables are identical. The converse q → p is NOT equivalent.",
        points: 1,
      },
      {
        type: "single",
        prompt: "For f(x) = 2x + 1, what is f⁻¹(x)?",
        options: ["(x − 1)/2", "(x + 1)/2", "2x − 1", "1/(2x + 1)"],
        correct: "(x − 1)/2",
        explanation: "Swap and solve: y = 2x + 1 → x = (y − 1)/2. Check: f((x − 1)/2) = x.",
        points: 1,
      },
      {
        type: "short",
        prompt: "How many subsets does a set with 5 elements have? (number only)",
        correct: ["32"],
        explanation: "A set with n elements has 2ⁿ subsets: 2⁵ = 32 (including ∅ and the set itself).",
        points: 1,
      },
    ],
  },
};
