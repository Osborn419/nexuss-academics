export default {
  course: {
    code: "UGRC 150",
    title: "Critical Thinking and Practical Reasoning",
    summary: "Recognising, analysing and evaluating arguments — and spotting the fallacies.",
    description:
      "A University Required Course on reasoning well: what critical thinking is, how to identify arguments, premises and conclusions, the difference between deductive and inductive reasoning, validity and soundness, common argument forms and informal fallacies.",
    track: "elective",
    accent: "teal",
  },
  materials: [
    {
      week: 1,
      kind: "slides",
      title: "Week 1 — What is critical thinking?",
      description: "Definition, why it matters, traits of a critical thinker and common barriers.",
      content: `# Critical thinking

Critical thinking is the careful, reasoned evaluation of claims and arguments in order to decide what to believe or do.

---

## Why it matters at university

- Separating evidence from opinion
- Resisting manipulation by adverts, propaganda and fake news
- Making better decisions and writing stronger essays

---

## Traits of a critical thinker

Open-mindedness · intellectual humility · fair-mindedness · curiosity · willingness to change your mind when the evidence demands it

---

## Barriers to critical thinking

| Barrier | Example |
| --- | --- |
| Egocentrism | "My view is right because it is mine" |
| Group pressure | believing something because your friends do |
| Stereotyping | judging people by a group label |
| Wishful thinking | believing what you want to be true |
| Appeal to tradition | "We have always done it this way" |
| Emotional reasoning | "I feel it, so it must be true" |

---

## Claims

A **claim** is a statement that is either true or false. Before accepting one, ask:

Is it clear? · Who says so? · What evidence supports it? · Is the source credible and unbiased?`,
    },
    {
      week: 2,
      kind: "notes",
      title: "Week 2 — Arguments: premises, conclusions & indicator words",
      description: "Spotting arguments, indicator words, standard form and passages that are not arguments.",
      content: `# Recognising arguments

An **argument** is a group of statements in which some (the **premises**) are offered as reasons for another (the **conclusion**).

## Indicator words

| Conclusion indicators | Premise indicators |
| --- | --- |
| therefore, thus, hence, so, consequently, it follows that, accordingly | because, since, for, given that, as, assuming that, for the reason that |

## Example in standard form
"Since every lecturer at the seminar is an economist, and Dr Mensah is a lecturer at the seminar, Dr Mensah is an economist."

1. Every lecturer at the seminar is an economist.
2. Dr Mensah is a lecturer at the seminar.
3. ∴ Dr Mensah is an economist.

## Not every passage is an argument

| Non-argument | Why it is not an argument |
| --- | --- |
| Report or description | states facts without trying to prove anything |
| Explanation | tells us **why** something happened — the fact itself is accepted |
| Illustration | gives examples of a claim |
| Conditional statement | "If … then …" on its own asserts no premise or conclusion |
| Warning or advice | tells you what to do without offering reasons as proof |

## Exam tip
Find the conclusion first — ask "What is the writer trying to get me to accept?" — then look for the reasons given for it.`,
    },
    {
      week: 3,
      kind: "slides",
      title: "Week 3 — Deduction, induction, validity & soundness",
      description: "Deductive vs inductive arguments and how each one is evaluated.",
      content: `# Deductive & inductive arguments

---

## Deductive arguments

Claim that the conclusion follows **necessarily** from the premises.

Evaluated as **valid / invalid**, then **sound / unsound**.

- **Valid:** if the premises were true, the conclusion could not be false
- **Sound:** valid **and** every premise actually true

---

## Inductive arguments

Claim that the conclusion is **probably** true if the premises are.

Evaluated as **strong / weak**, then **cogent / uncogent**.

Types: generalisation from a sample · prediction · argument from analogy · causal inference · argument from authority

---

## Validity is about form, not truth

| | Valid | Invalid |
| --- | --- | --- |
| All premises true | Sound | Unsound |
| A premise is false | Unsound | Unsound |

A valid argument can have false premises and a false conclusion:

All fish can fly. All cows are fish. ∴ All cows can fly. — **valid but unsound**

---

## Testing validity: the counterexample method

Keep the same form but substitute terms that make the premises obviously true and the conclusion obviously false. If you can do that, the form is **invalid**.`,
    },
    {
      week: 4,
      kind: "notes",
      title: "Week 4 — Informal fallacies",
      description: "Fallacies of relevance, presumption and ambiguity, with examples and an exam method.",
      content: `# Informal fallacies

A **fallacy** is an error in reasoning that makes an argument look stronger than it is. *Informal* fallacies are mistakes in content or context rather than in logical form.

## Fallacies of relevance — the premises are beside the point

| Fallacy | What happens | Example |
| --- | --- | --- |
| Ad hominem | attacks the person, not the argument | "Ignore his budget plan — he failed maths." |
| Tu quoque | "you do it too" | "Why should I stop skipping lectures? You skipped one last week." |
| Appeal to force | a threat instead of reasons | "Agree with me or you are out of the group." |
| Appeal to pity | sympathy instead of evidence | "I deserve an A — I have been so stressed." |
| Appeal to popularity (bandwagon) | true because many believe it | "Everyone is buying this laptop, so it must be the best." |
| Appeal to unqualified authority | an expert outside their field | "A famous musician says this herb cures malaria." |
| Red herring | changes the subject | asked about fees, the speaker talks about new sports facilities |
| Straw man | distorts the opponent's view, then attacks it | "She wants fewer lectures, so she wants students to stop learning." |

## Fallacies of presumption — an unjustified assumption is smuggled in

| Fallacy | What happens | Example |
| --- | --- | --- |
| Begging the question | the conclusion is assumed in a premise | "He is honest because he never lies." |
| False dilemma | only two options when more exist | "Either we ban phones in class or nobody will learn." |
| Slippery slope | one step supposedly leads inevitably to disaster | "Allow one late submission and soon nobody will submit on time." |
| Hasty generalisation | a conclusion from too small a sample | "Two freshers were rude, so all freshers are rude." |
| False cause | assumes that because B followed A, A caused B | "I wore my blue shirt and passed, so the shirt is lucky." |
| Complex question | a question that assumes something unproven | "Have you stopped copying assignments?" |

## Fallacies of ambiguity
- **Equivocation** — a key word changes meaning part-way through
- **Amphiboly** — ambiguous grammar: "I saw the lecturer with a telescope."

## Answering fallacy questions
1. Identify the conclusion
2. Ask whether each premise is relevant, true and sufficient
3. Name the fallacy **and** explain why the reasoning fails — the explanation earns the marks`,
    },
    {
      week: 5,
      kind: "notes",
      title: "Week 5 — Argument forms: valid and invalid patterns",
      description: "Modus ponens, modus tollens, syllogisms and the formal fallacies to avoid.",
      content: `# Argument forms

## Valid forms

| Form | Pattern |
| --- | --- |
| Modus ponens | If P then Q. P. Therefore Q. |
| Modus tollens | If P then Q. Not Q. Therefore not P. |
| Hypothetical syllogism | If P then Q. If Q then R. Therefore if P then R. |
| Disjunctive syllogism | P or Q. Not P. Therefore Q. |
| Constructive dilemma | If P then Q, and if R then S. P or R. Therefore Q or S. |

## Invalid forms (formal fallacies)

| Fallacy | Pattern | Why it fails |
| --- | --- | --- |
| Affirming the consequent | If P then Q. Q. Therefore P. | Q may be true for another reason |
| Denying the antecedent | If P then Q. Not P. Therefore not Q. | Q may still be true |

## Examples
- "If it rains, the match is cancelled. It rained. So the match is cancelled." → **modus ponens** (valid)
- "If you study, you pass. You passed. So you studied." → **affirming the consequent** (invalid)
- "If the server is down, the site will not load. The site loads. So the server is not down." → **modus tollens** (valid)

## Categorical syllogisms (preview)
- All A are B. All B are C. Therefore all A are C. — **valid**
- All A are B. All C are B. Therefore all A are C. — **invalid** (undistributed middle term)`,
    },
    {
      week: null,
      kind: "link",
      title: "Internet Encyclopedia of Philosophy — Fallacies",
      description: "A reliable reference listing hundreds of fallacies with definitions and examples.",
      url: "https://iep.utm.edu/fallacy/",
    },
  ],
  quiz: {
    title: "UGRC 150 — Arguments & fallacies test",
    description: "Weeks 1–4: critical thinking, arguments, validity and informal fallacies.",
    week: 4,
    time: 12,
    questions: [
      {
        type: "single",
        prompt: "An argument is sound when it is valid and…",
        options: [
          "all its premises are true",
          "its conclusion is surprising",
          "it uses formal symbols",
          "it is inductive",
        ],
        correct: "all its premises are true",
        explanation: "Soundness = validity + true premises. A true conclusion alone does not make an argument sound.",
        points: 1,
      },
      {
        type: "single",
        prompt: "\"Everyone on campus is buying this laptop, so it must be the best.\" Which fallacy is this?",
        options: [
          "Appeal to popularity (bandwagon)",
          "Ad hominem",
          "Straw man",
          "False dilemma",
        ],
        correct: "Appeal to popularity (bandwagon)",
        explanation: "Popularity is not evidence of quality — many people can be wrong.",
        points: 2,
      },
      {
        type: "multiple",
        prompt: "Which of these are conclusion indicator words? (Select all that apply)",
        options: ["therefore", "hence", "consequently", "because"],
        correct: ["therefore", "hence", "consequently"],
        explanation: "\"Because\" introduces a premise (a reason), not a conclusion.",
        points: 2,
      },
      {
        type: "boolean",
        prompt: "A valid argument can have a false conclusion.",
        correct: true,
        explanation:
          "True — if at least one premise is false. Validity only guarantees the conclusion when every premise is true.",
        points: 1,
      },
      {
        type: "single",
        prompt: "Attacking the person instead of their argument is called…",
        options: ["Ad hominem", "Red herring", "Hasty generalisation", "Appeal to pity"],
        correct: "Ad hominem",
        explanation: "Ad hominem means \"against the person\".",
        points: 1,
      },
      {
        type: "short",
        prompt: "Inductive arguments are evaluated as strong or ____.",
        correct: ["weak"],
        explanation: "Inductive arguments are strong or weak (then cogent or uncogent); deductive ones are valid or invalid.",
        points: 1,
      },
    ],
  },
};
