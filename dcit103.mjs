export default {
  course: {
    code: "DCIT 103",
    title: "Office Productivity Tools",
    summary:
      "Hands-on Microsoft Word, Excel and PowerPoint — from formatting documents to formulas, charts and presentations.",
    description:
      "A practical, lab-based course built on Microsoft Office: creating, editing and formatting documents in Word (styles, tables of contents, references, citations and track changes); building spreadsheets in Excel (formulas, functions, tables and charts); and designing clear slide presentations in PowerPoint.",
    track: "core",
    accent: "emerald",
  },
  materials: [
    {
      week: 1,
      kind: "notes",
      title: "Week 1 — Files, folders & the Office interface",
      description: "File types, the Ribbon, and the keyboard shortcuts that save time in practicals.",
      content: `# Files, folders & the Office interface

## Key terms
- **File** — a named collection of data, e.g. \`week1_notes.docx\`
- **Folder (directory)** — a container for files and other folders
- **Path** — where a file lives: Documents › DCIT 103 › Week 1
- **Extension** — tells Windows which program opens the file

## Extensions you must recognise

| Extension | File type | Opens in |
| --- | --- | --- |
| .docx | Word document | Microsoft Word |
| .xlsx | Workbook | Microsoft Excel |
| .pptx | Presentation | Microsoft PowerPoint |
| .accdb | Database | Microsoft Access |
| .pdf | Portable Document Format | browser / PDF reader |
| .txt | Plain text | Notepad |
| .jpg / .png | Image | Photos |
| .zip | Compressed folder | File Explorer |

## The Office window
Title bar · Quick Access Toolbar · **Ribbon** (tabs → groups → commands) · File tab (Backstage view: Save, Save As, Print, Export) · status bar · zoom slider

## Shortcuts that save time in the practical exam

| Shortcut | Action |
| --- | --- |
| Ctrl + N / Ctrl + O | New / Open |
| Ctrl + S / F12 | Save / Save As |
| Ctrl + C / Ctrl + X / Ctrl + V | Copy / Cut / Paste |
| Ctrl + Z / Ctrl + Y | Undo / Redo |
| Ctrl + A | Select all |
| Ctrl + F / Ctrl + H | Find / Replace |
| Ctrl + P | Print |
| Alt + Tab | Switch between windows |
| Windows + E | Open File Explorer |
| F2 | Rename the selected file |

## Good file habits
1. One folder per course, one sub-folder per week
2. Clear names: \`DCIT103_Week3_Practical_YourName.docx\`
3. Save early and often (Ctrl + S) — and keep a copy on OneDrive or a flash drive`,
    },
    {
      week: 2,
      kind: "slides",
      title: "Week 2 — Word: creating, editing & formatting documents",
      description: "Character, paragraph and page formatting, tables, pictures, headers and PDF export.",
      content: `# Word: creating, editing & formatting documents

## Three levels of formatting
- **Character** — font, size, bold/italic/underline, colour, highlight, superscript (Ctrl + Shift + =), subscript (Ctrl + =)
- **Paragraph** — alignment, line spacing, indents, spacing before/after, bullets & numbering
- **Page** — margins, orientation, paper size (A4), columns, breaks

---

## Alignment shortcuts

| Shortcut | Alignment |
| --- | --- |
| Ctrl + L | Left |
| Ctrl + E | Centre |
| Ctrl + R | Right |
| Ctrl + J | Justify |

---

## Editing tools
- Double-click selects a word, triple-click a paragraph, Ctrl + A everything
- **Find & Replace** (Ctrl + H) fixes a repeated error in one go
- **Format Painter** copies formatting from one place to another
- Ctrl + Space clears character formatting when text looks wrong

---

## Tables & pictures
- Insert → Table; the **Table Design** and **Layout** tabs merge cells, add borders and repeat the header row
- Insert → Pictures; **Wrap Text**: In Line with Text, Square, Tight, Behind Text, In Front of Text

---

## Headers, footers & page numbers
Insert → Header / Footer / Page Number. Tick **Different First Page** to keep the cover page clean.

---

## Save, export & print
File → Save As → **PDF** gives a file that looks the same on every device. File → Print shows a preview before printing.`,
    },
    {
      week: 3,
      kind: "lab",
      title: "Week 3 practical — Styles, table of contents & captions",
      description: "Build a three-page report with automatic headings, contents, captions and page numbers.",
      content: `# Week 3 practical — Styles, table of contents & captions

## Aim
Produce a three-page report with automatic headings, a table of contents and correct page numbers.

## Tasks
1. Set the paper size to **A4** and the margins to **Normal** (Layout → Margins).
2. Page 1: a cover page with the report title, your name, student ID and the date.
3. Apply **Heading 1** to main headings and **Heading 2** to sub-headings (Home → Styles).
4. On page 2, insert an **automatic table of contents** (References → Table of Contents).
5. Insert a **section break** after the cover page (Layout → Breaks → Next Page). In the new section, switch off *Link to Previous* in the footer, then Page Number → Format Page Numbers → **Start at 1**.
6. Insert a table and an image, and give each a **caption** (References → Insert Caption).
7. Add one **footnote** (References → Insert Footnote).
8. Change one heading's wording, then right-click the table of contents → **Update Field** → Update entire table.
9. Save as \`DCIT103_Practical3_YourName.docx\` and export a PDF copy.

## Self-check (20 marks)

| Item | Marks |
| --- | --- |
| Page setup and cover page | 3 |
| Heading styles used consistently | 4 |
| Working, updated table of contents | 4 |
| Section break and correct page numbering | 4 |
| Captions on the table and image | 3 |
| Footnote and PDF export | 2 |`,
    },
    {
      week: 4,
      kind: "notes",
      title: "Week 4 — Word: references, citations & reviewing tools",
      description: "Citations and bibliography, footnotes, captions, comments and Track Changes.",
      content: `# Word: references, citations & reviewing tools

## Citations and bibliography (References tab)
1. Choose the referencing **Style** (APA, Harvard, MLA…) your lecturer asks for
2. **Insert Citation → Add New Source**: author, title, year, publisher or URL
3. Put the cursor where the list should go → **Bibliography** → choose a format
4. Edit sources with **Manage Sources**, then update the list

## Footnotes and endnotes
- **Footnote** — at the bottom of the same page (Alt + Ctrl + F)
- **Endnote** — collected at the end of the document (Alt + Ctrl + D)

## Captions and cross-references
**Insert Caption** numbers figures and tables automatically ("Figure 1", "Table 2"). **Cross-reference** inserts text such as "see Figure 1" that updates if the numbering changes.

## Reviewing tools (Review tab)

| Tool | What it does |
| --- | --- |
| Spelling & Grammar (F7) | checks the whole document |
| Word Count | words, characters, paragraphs |
| Thesaurus (Shift + F7) | suggests synonyms |
| New Comment | adds a note in the margin without changing the text |
| Track Changes (Ctrl + Shift + E) | records every insertion, deletion and formatting change |
| Accept / Reject | keeps or discards each tracked change |
| Compare | shows the differences between two versions |

## Exam tip
Track Changes **records edits**; comments only **add notes**. If a question says "show your edits so the lecturer can approve them", turn Track Changes on *before* you start editing.`,
    },
    {
      week: 5,
      kind: "slides",
      title: "Week 5 — Excel: cells, references & formulas",
      description: "Workbooks, ranges, operators, relative vs absolute references and common errors.",
      content: `# Excel: cells, references & formulas

## The vocabulary
- **Workbook** = the file; **worksheet** = one tab; **cell** = where a column meets a row (B3)
- **Range** = a block of cells, e.g. \`A1:A10\`
- Every formula starts with **=**

---

## Operators and order of operations

Brackets → ^ (power) → × ÷ → + −

- \`=2+3*4\` gives **14**
- \`=(2+3)*4\` gives **20**
- Comparison: = <> > < >= <=
- Join text with &: \`=A2&" "&B2\`

---

## Cell references

| Type | Example | When the formula is copied… |
| --- | --- | --- |
| Relative | A1 | both the column and the row change |
| Absolute | $A$1 | nothing changes |
| Mixed | $A1 or A$1 | only the part without $ changes |

Press **F4** while editing a reference to cycle through the types.

---

## Everyday functions

\`=SUM(B2:B10)\` · \`=AVERAGE(B2:B10)\` · \`=MAX(B2:B10)\` · \`=MIN(B2:B10)\` · \`=COUNT(B2:B10)\` (numbers only) · \`=COUNTA(B2:B10)\` (non-empty cells) · \`=ROUND(B2, 1)\`

---

## Error values

| Error | Meaning |
| --- | --- |
| #DIV/0! | division by zero |
| #NAME? | misspelt function or range name |
| #REF! | reference to a deleted cell |
| #VALUE! | wrong type of data, e.g. text in a sum |
| #N/A | a lookup value was not found |
| ##### | the column is too narrow to show the value |`,
    },
    {
      week: 6,
      kind: "notes",
      title: "Week 6 preview — Excel functions: IF, COUNTIF, VLOOKUP & charts",
      description: "Get ahead: decision functions, conditional counting, lookups and choosing the right chart.",
      content: `# Excel functions & charts

## IF — make a decision
\`=IF(logical_test, value_if_true, value_if_false)\`

\`=IF(C2>=50, "Pass", "Fail")\`

Nested IF for grades:
\`=IF(C2>=70,"A",IF(C2>=60,"B",IF(C2>=50,"C",IF(C2>=40,"D","F"))))\`

## AND / OR inside IF
\`=IF(AND(B2>=40, C2>=40), "Proceed", "Resit")\`

## Counting and summing with conditions
- \`=COUNTIF(D2:D50, "Pass")\` — how many passed
- \`=COUNTIF(C2:C50, ">=70")\` — how many scored 70 or more
- \`=SUMIF(A2:A50, "DCIT 103", C2:C50)\` — total for one course
- \`=AVERAGEIF(B2:B50, "Female", C2:C50)\`

## VLOOKUP — find a value in a table
\`=VLOOKUP(lookup_value, table_array, col_index_num, FALSE)\`

\`=VLOOKUP(F2, $A$2:$C$100, 3, FALSE)\`

- **FALSE** means exact match — always use it for IDs
- The lookup column must be the **first** column of the table
- Newer Excel: \`=XLOOKUP(F2, A2:A100, C2:C100)\` has no such restriction

## Choosing a chart

| Chart | Best for |
| --- | --- |
| Column / bar | comparing categories |
| Line | trends over time |
| Pie | parts of a whole (few categories) |
| Scatter | the relationship between two numeric variables |

Insert → Recommended Charts, then always add a **chart title** and **axis titles**.

## Practice
Build a class score sheet: names, three test scores, Total (\`SUM\`), Average (\`AVERAGE\`), Grade (\`IF\`) and the number of passes (\`COUNTIF\`), then chart the averages.`,
    },
    {
      week: null,
      kind: "link",
      title: "Microsoft 365 training — Word, Excel & PowerPoint",
      description: "Microsoft's free official video tutorials for every Office app we use in DCIT 103.",
      url: "https://support.microsoft.com/en-us/training",
    },
  ],
  quiz: {
    title: "DCIT 103 — Microsoft Word revision test",
    description: "Formatting, styles, tables of contents, references and reviewing (weeks 1–4).",
    week: 4,
    time: 10,
    questions: [
      {
        type: "single",
        prompt: "Which keyboard shortcut centres a paragraph in Microsoft Word?",
        options: ["Ctrl + E", "Ctrl + C", "Ctrl + R", "Ctrl + J"],
        correct: "Ctrl + E",
        explanation: "Ctrl + E centres. Ctrl + R aligns right, Ctrl + J justifies and Ctrl + C copies.",
        points: 1,
      },
      {
        type: "single",
        prompt:
          "Which Word feature records every insertion and deletion so a reviewer can accept or reject them?",
        options: ["Track Changes", "Comments", "Spelling & Grammar", "Format Painter"],
        correct: "Track Changes",
        explanation:
          "Track Changes (Review tab, Ctrl + Shift + E) records edits. Comments only add notes without changing the text.",
        points: 1,
      },
      {
        type: "single",
        prompt: "An automatic table of contents in Word is built from…",
        options: [
          "text formatted with Heading styles",
          "any bold text",
          "the first line of every page",
          "text in a larger font",
        ],
        correct: "text formatted with Heading styles",
        explanation:
          "References → Table of Contents collects text that uses Heading 1, Heading 2… styles. Bold or big text alone is ignored.",
        points: 2,
      },
      {
        type: "multiple",
        prompt: "Which of these commands are on Word's References tab? (Select all that apply)",
        options: ["Table of Contents", "Insert Citation", "Insert Footnote", "Track Changes"],
        correct: ["Table of Contents", "Insert Citation", "Insert Footnote"],
        explanation: "Track Changes is on the Review tab; the other three are on References.",
        points: 2,
      },
      {
        type: "boolean",
        prompt: "Section breaks let you restart page numbering in a different part of the same document.",
        correct: true,
        explanation:
          "True — add a Next Page section break, unlink the footer from the previous section and set Start at 1.",
        points: 1,
      },
      {
        type: "short",
        prompt: "Which keyboard shortcut saves the current document? (for example: Ctrl + ?)",
        correct: ["Ctrl + S", "Control + S", "Ctrl S"],
        explanation: "Ctrl + S saves; F12 opens Save As.",
        points: 1,
      },
    ],
  },
};
