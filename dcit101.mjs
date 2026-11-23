export default {
  course: {
    code: "DCIT 101",
    title: "Introduction to Computer Science",
    summary:
      "How computers work: history, data representation, hardware, software and problem solving with algorithms.",
    description:
      "A broad survey of computer science and information technology: what computers are and how they developed, how data is represented inside a computer, the hardware that processes and stores it, system and application software, and how we solve problems with algorithms, flowcharts and pseudocode before writing code in Python.",
    track: "core",
    accent: "sky",
  },
  materials: [
    {
      week: 1,
      kind: "slides",
      title: "Week 1 — Computer science & its applications",
      description: "What a computer is, generations, classification and where computers are used.",
      content: `# Computer science & its applications

A **computer** is an electronic device that accepts **data** (input), **processes** it under the control of stored instructions, **stores** the results and produces **information** (output).

- Data → raw, unprocessed facts (marks, names, prices)
- Information → processed data that is meaningful and useful
- The IPOS cycle: Input → Process → Output → Storage

---

## What is computer science?

The study of **computation**: how information is represented, how algorithms solve problems, and how hardware and software are designed to carry them out.

Areas you will meet: algorithms & data structures · programming languages · computer architecture · operating systems · networks & data communication · databases · artificial intelligence · security · human–computer interaction

---

## Generations of computers

| Generation | Period (approx.) | Main technology | Examples |
| --- | --- | --- | --- |
| First | 1940s – late 1950s | Vacuum tubes | ENIAC, UNIVAC I |
| Second | late 1950s – mid 1960s | Transistors | IBM 1401 |
| Third | mid 1960s – early 1970s | Integrated circuits | IBM System/360 |
| Fourth | 1970s – today | Microprocessors (VLSI) | PCs, laptops, smartphones |
| Fifth | today and beyond | AI, parallel & quantum computing | — |

---

## Classifying computers

**By size and power:** supercomputer · mainframe · minicomputer (mid-range server) · microcomputer (desktop, laptop, tablet, smartphone) · embedded computer

**By type of data:** analog (continuous signals) · digital (discrete 0s and 1s) · hybrid

**By purpose:** general-purpose vs special-purpose (an ATM, a traffic-light controller)

---

## Applications of computers

Education (e-learning platforms) · banking & mobile money · health (patient records, diagnosis) · business (accounting, stock control) · communication (email, social media) · government (national ID, e-services) · entertainment · science & engineering

---

## Characteristics — and limits

Speed · accuracy · diligence (no fatigue) · storage capacity · versatility

But a computer has **no IQ**: it only does what it is told. *Garbage in, garbage out* (GIGO).`,
    },
    {
      week: 2,
      kind: "notes",
      title: "Week 2 — Information representation: number systems",
      description: "Binary, octal, decimal and hex conversions, binary addition, two's complement and ASCII.",
      content: `# Information representation: number systems

Computers store everything — numbers, text, images, sound — as **binary digits (bits)**: 0 and 1.

## The four number systems

| System | Base | Digits used | Example |
| --- | --- | --- | --- |
| Binary | 2 | 0, 1 | 101101₂ |
| Octal | 8 | 0 – 7 | 55₈ |
| Decimal | 10 | 0 – 9 | 45₁₀ |
| Hexadecimal | 16 | 0 – 9, A – F | 2D₁₆ |

## Any base → decimal: multiply by place values

101101₂ = 1×32 + 0×16 + 1×8 + 1×4 + 0×2 + 1×1 = **45**

2D₁₆ = 2×16 + 13×1 = **45** (D = 13)

## Decimal → binary: divide by 2 and read the remainders upwards

| Division | Quotient | Remainder |
| --- | --- | --- |
| 45 ÷ 2 | 22 | 1 |
| 22 ÷ 2 | 11 | 0 |
| 11 ÷ 2 | 5 | 1 |
| 5 ÷ 2 | 2 | 1 |
| 2 ÷ 2 | 1 | 0 |
| 1 ÷ 2 | 0 | 1 |

Reading the remainders from the bottom up: 45 = **101101₂**

## Shortcuts between binary, octal and hex

- Octal: group bits in **threes** from the right → 101 101 = **55₈**
- Hex: group bits in **fours** from the right → 0010 1101 = **2D₁₆**

## Binary addition

| Sum | Result | Carry |
| --- | --- | --- |
| 0 + 0 | 0 | 0 |
| 0 + 1 | 1 | 0 |
| 1 + 1 | 0 | 1 |
| 1 + 1 + 1 | 1 | 1 |

Example: 1011 + 0110 = **10001** (11 + 6 = 17)

## Negative numbers: two's complement (8 bits)

To write −5: start with +5 = 00000101 → invert every bit → 11111010 → add 1 → **11111011**

## Representing text

- **ASCII** — 7 bits, 128 characters: 'A' = 65, 'a' = 97, '0' = 48
- **Unicode (UTF-8)** — covers every writing system and emoji; its first 128 characters are ASCII

## Units of storage

bit → nibble (4 bits) → **byte (8 bits)** → kilobyte (1,024 bytes) → megabyte → gigabyte → terabyte`,
    },
    {
      week: 3,
      kind: "notes",
      title: "Week 3 — Inside the computer: CPU, memory & peripherals",
      description: "The von Neumann model, fetch–decode–execute, memory hierarchy, buses and I/O devices.",
      content: `# Inside the computer: CPU, memory & peripherals

## The von Neumann (stored-program) model
Program instructions and data are held in the **same memory**. The main parts are the CPU, main memory, input/output devices and the **buses** that connect them.

## The central processing unit (CPU)

| Part | Job |
| --- | --- |
| Control unit (CU) | fetches and decodes instructions and directs the other parts |
| Arithmetic logic unit (ALU) | arithmetic (+ − × ÷) and logic (AND, OR, NOT, comparisons) |
| Registers | tiny, very fast stores inside the CPU — PC, IR, MAR, MDR, accumulator |

## The fetch–decode–execute cycle
1. The **program counter (PC)** holds the address of the next instruction; it is copied to the MAR
2. The instruction is fetched from memory into the MDR, then the IR, and the PC is incremented
3. The control unit **decodes** the instruction
4. The instruction is **executed** (using the ALU if needed) and the result is stored

## Memory hierarchy — fastest and most expensive first
Registers → cache → main memory (RAM) → secondary storage (SSD / hard disk) → removable & cloud storage

| | RAM | ROM |
| --- | --- | --- |
| Volatile? | Yes — contents lost when power goes off | No |
| Read / write? | Read and write | Read-only in normal use |
| Holds | programs and data in use | firmware such as the BIOS/UEFI boot program |

## Buses
- **Data bus** — carries data (two-way)
- **Address bus** — carries memory addresses (one-way, from the CPU)
- **Control bus** — carries control signals: read/write, clock, interrupts

## Peripherals

| Input | Output | Storage |
| --- | --- | --- |
| keyboard, mouse, scanner, microphone, webcam, barcode reader | monitor, printer, speakers, projector | hard disk, SSD, flash drive, memory card, optical disc |

> A touchscreen is both an input and an output device.`,
    },
    {
      week: 4,
      kind: "slides",
      title: "Week 4 — Software, operating systems & files",
      description: "System vs application software, OS functions, translators and software licences.",
      content: `# Software, operating systems & files

**Software** = the programs (and data) that tell the hardware what to do.

---

## System vs application software

| System software | Application software |
| --- | --- |
| runs and manages the computer | helps users do specific tasks |
| operating systems, utilities, device drivers, language translators | word processors, spreadsheets, browsers, games |
| Windows, Linux, macOS, Android | Microsoft Word, Excel, Chrome, WhatsApp |

---

## Functions of an operating system

- **Process management** — scheduling programs, multitasking
- **Memory management** — allocating RAM to programs
- **File management** — creating, naming, organising and protecting files
- **Device management** — controlling hardware through drivers
- **Security** — user accounts, passwords, permissions
- **User interface** — command line (CLI) or graphical (GUI)

---

## Language translators

| Translator | Converts | How it works |
| --- | --- | --- |
| Assembler | assembly language → machine code | one instruction at a time |
| Compiler | a whole high-level program → machine code | before running; produces an executable |
| Interpreter | high-level code → actions | line by line while running; stops at the first error |

Python is usually **interpreted**; C is usually **compiled**.

---

## Files and file organisation

- A **file** is a named collection of related data on secondary storage
- Files live in **folders (directories)** arranged as a tree
- **Extensions** identify the type: .docx, .xlsx, .pdf, .py, .jpg

---

## Software licences

Proprietary (closed source, e.g. Microsoft Office) · open source (e.g. Linux, LibreOffice) · freeware · shareware · public domain`,
    },
    {
      week: 5,
      kind: "slides",
      title: "Week 5 — Problem solving: algorithms, flowcharts & pseudocode",
      description: "Properties of algorithms, flowchart symbols, pseudocode and your first Python program.",
      content: `# Problem solving: algorithms, flowcharts & pseudocode

An **algorithm** is a finite, ordered set of clear steps that solves a problem.

Properties: **finite** · **definite** (unambiguous) · has **input** · produces **output** · **effective** (every step can be carried out)

---

## Steps in problem solving

1. Understand and define the problem
2. Analyse it — inputs, processing, outputs (an **IPO chart**)
3. Design the algorithm (pseudocode or flowchart)
4. Code it in a programming language
5. Test and debug
6. Document and maintain

---

## Flowchart symbols

| Symbol | Meaning |
| --- | --- |
| Oval (terminator) | Start / Stop |
| Parallelogram | Input / Output |
| Rectangle | Process (calculation, assignment) |
| Diamond | Decision (yes / no) |
| Arrow | Direction of flow |
| Small circle | Connector |

---

## Pseudocode — average of three scores

\`\`\`
START
  INPUT a, b, c
  average ← (a + b + c) / 3
  IF average >= 50 THEN
      PRINT "Pass"
  ELSE
      PRINT "Fail"
  ENDIF
STOP
\`\`\`

---

## The same algorithm in Python

\`\`\`python
a = float(input("Score 1: "))
b = float(input("Score 2: "))
c = float(input("Score 3: "))
average = (a + b + c) / 3
print("Pass" if average >= 50 else "Fail", round(average, 1))
\`\`\`

---

## The three control structures

- **Sequence** — steps run one after another
- **Selection** — IF … THEN … ELSE, CASE
- **Iteration (loops)** — WHILE, REPEAT … UNTIL, FOR

> Exam tip: dry-run your algorithm with sample values in a **trace table** to prove it works.`,
    },
    {
      week: null,
      kind: "link",
      title: "Khan Academy — Computers and the Internet",
      description: "Short, clear lessons on bits, binary, hardware and networks to back up the lectures.",
      url: "https://www.khanacademy.org/computing/computers-and-internet",
    },
  ],
  quiz: {
    title: "DCIT 101 — Weeks 1–4 examination",
    mode: "exam",
    description: "History of computing, number systems, hardware and software.",
    week: 4,
    time: 12,
    questions: [
      {
        type: "single",
        prompt: "Which generation of computers was built with vacuum tubes?",
        options: ["First generation", "Second generation", "Third generation", "Fourth generation"],
        correct: "First generation",
        explanation:
          "First-generation machines such as ENIAC used vacuum tubes. Transistors came with the second generation, integrated circuits with the third and microprocessors with the fourth.",
        points: 1,
      },
      {
        type: "single",
        prompt: "What is decimal 45 in binary?",
        options: ["101101", "110101", "101011", "100111"],
        correct: "101101",
        explanation:
          "45 = 32 + 8 + 4 + 1, so the bits for 32, 8, 4 and 1 are set: 101101. (110101 = 53, 101011 = 43, 100111 = 39.)",
        points: 2,
      },
      {
        type: "single",
        prompt: "What is binary 0010 1101 in hexadecimal?",
        options: ["2D", "D2", "45", "2B"],
        correct: "2D",
        explanation: "Group the bits in fours: 0010 = 2 and 1101 = 13 = D, giving 2D.",
        points: 1,
      },
      {
        type: "multiple",
        prompt: "Which of these are functions of an operating system? (Select all that apply)",
        options: ["Memory management", "File management", "Process scheduling", "Typing a letter"],
        correct: ["Memory management", "File management", "Process scheduling"],
        explanation:
          "Typing a letter is done in application software such as a word processor. The OS manages memory, files, processes and devices.",
        points: 2,
      },
      {
        type: "boolean",
        prompt: "RAM is volatile: its contents are lost when the power is switched off.",
        correct: true,
        explanation: "True. ROM and secondary storage keep their contents without power; RAM does not.",
        points: 1,
      },
      {
        type: "short",
        prompt: "Which CPU register holds the address of the next instruction to be fetched?",
        correct: ["program counter", "PC", "the program counter"],
        explanation:
          "The program counter (PC) points to the next instruction and is incremented during each fetch.",
        points: 1,
      },
    ],
  },
};
