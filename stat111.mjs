export default {
  course: {
    code: "STAT 111",
    title: "Introduction to Statistics and Probability I",
    summary:
      "Collecting, presenting and summarising data — the first step into statistics and probability.",
    description:
      "Covers the nature of statistics, types of data and scales of measurement, data collection and sampling methods, frequency distributions and graphs, measures of central tendency and dispersion, and leads into the basic ideas of probability.",
    track: "core",
    accent: "rose",
  },
  materials: [
    {
      week: 1,
      kind: "slides",
      title: "Week 1 — What is statistics? Data types & scales of measurement",
      description: "Descriptive vs inferential statistics, populations and samples, variables and scales.",
      content: `# What is statistics?

The science of **collecting, organising, presenting, analysing and interpreting** data to support decisions.

- **Descriptive statistics** — summarise data with tables, graphs and averages
- **Inferential statistics** — use a sample to draw conclusions about a population

---

## Key terms

| Term | Meaning |
| --- | --- |
| Population | every item of interest, e.g. all Level 100 students at UG |
| Sample | a subset of the population |
| Parameter | a numerical summary of a population (μ, σ) |
| Statistic | a numerical summary of a sample (x̄, s) |
| Variable | a characteristic that varies: age, hall, score |

---

## Types of variables

- **Qualitative (categorical):** hall of residence, gender, blood group
- **Quantitative (numerical):**
  - **Discrete** — counted: number of siblings, number of courses
  - **Continuous** — measured: height, weight, time

---

## Scales of measurement

| Scale | Property | Example |
| --- | --- | --- |
| Nominal | categories only — no order | programme of study |
| Ordinal | order matters, gaps not equal | grades A, B, C; rankings |
| Interval | equal gaps but no true zero | temperature in °C |
| Ratio | equal gaps **and** a true zero | height, income, age |`,
    },
    {
      week: 2,
      kind: "notes",
      title: "Week 2 — Collecting data & sampling methods",
      description: "Primary vs secondary data, census vs sample, probability and non-probability sampling.",
      content: `# Collecting data

## Sources of data
- **Primary data** — collected first-hand: questionnaires, interviews, observation, experiments
- **Secondary data** — collected by someone else: Ghana Statistical Service reports, journals, websites

## Census vs sample survey
A **census** covers the whole population; a **sample survey** covers part of it — cheaper and faster, and often more accurate in practice because it can be done more carefully.

## Probability (random) sampling

| Method | How it works |
| --- | --- |
| Simple random | every member has an equal chance (lottery, random numbers) |
| Systematic | every kth member after a random start (k = N ÷ n) |
| Stratified | divide into groups (strata), e.g. by hall, then sample randomly from each |
| Cluster | randomly select whole groups, e.g. tutorial groups, and study everyone in them |
| Multistage | combine methods in stages |

## Non-probability sampling
Convenience · quota · purposive (judgemental) · snowball

## Errors
- **Sampling error** — the natural difference between a sample and the population
- **Non-sampling error** — bias from poor questions, non-response or recording mistakes

## A good questionnaire
Short, clear questions · no leading questions · no double-barrelled questions · a logical order · pilot-tested first`,
    },
    {
      week: 3,
      kind: "slides",
      title: "Week 3 — Frequency distributions & graphs",
      description: "Building grouped tables, class boundaries and marks, and choosing the right graph.",
      content: `# Organising & presenting data

## Building a frequency distribution

1. Find the range = largest value − smallest value
2. Choose the number of classes (usually 5 – 15)
3. Class width ≈ range ÷ number of classes (round up)
4. Tally the observations into the classes

---

## Terms for grouped data

| Term | Meaning |
| --- | --- |
| Class limits | e.g. 10 – 19 |
| Class boundaries | 9.5 – 19.5 (closes the gaps between classes) |
| Class mark (midpoint) | (lower limit + upper limit) ÷ 2 |
| Relative frequency | f ÷ Σf |
| Cumulative frequency | running total of the frequencies |

---

## Choosing a graph

| Data | Graph |
| --- | --- |
| Categorical | bar chart, pie chart |
| Grouped continuous | histogram, frequency polygon |
| Cumulative | ogive (cumulative frequency curve) |
| Trend over time | line graph |
| Small set of raw numbers | stem-and-leaf plot, dot plot |

---

## Histogram vs bar chart

Histogram bars **touch** — the scale is continuous and uses class boundaries. Bar chart bars are **separated** — each bar is a category.

---

## Pie chart angles

Angle of a sector = (frequency ÷ total) × 360°`,
    },
    {
      week: 4,
      kind: "notes",
      title: "Week 4 — Measures of central tendency",
      description: "Mean, median and mode for raw and grouped data, with a fully worked example.",
      content: `# Measures of central tendency

## Ungrouped data
- **Mean** x̄ = Σx ÷ n
- **Median** = the middle value of the ordered data (average the two middle values if n is even)
- **Mode** = the most frequent value

Example: 4, 7, 7, 9, 13 → mean = 40 ÷ 5 = **8**, median = **7**, mode = **7**

## Grouped data
- **Mean:** x̄ = Σfx ÷ Σf, where x is the class mark
- **Median:** L + ((n/2 − F) ÷ f) × c
  - L = lower boundary of the median class, n = Σf
  - F = cumulative frequency before the median class
  - f = frequency of the median class, c = class width
- **Mode:** L + (d₁ ÷ (d₁ + d₂)) × c
  - d₁ = modal frequency − frequency before, d₂ = modal frequency − frequency after

## Worked example

| Score | f | x | fx | cf |
| --- | --- | --- | --- | --- |
| 0 – 9 | 2 | 4.5 | 9 | 2 |
| 10 – 19 | 5 | 14.5 | 72.5 | 7 |
| 20 – 29 | 8 | 24.5 | 196 | 15 |
| 30 – 39 | 4 | 34.5 | 138 | 19 |
| 40 – 49 | 1 | 44.5 | 44.5 | 20 |

Σf = 20 and Σfx = 460 → **mean = 460 ÷ 20 = 23**

Median class: n/2 = 10 → the 20 – 29 class (L = 19.5, F = 7, f = 8, c = 10)

**Median** = 19.5 + ((10 − 7) ÷ 8) × 10 = 19.5 + 3.75 = **23.25**

Modal class 20 – 29: d₁ = 8 − 5 = 3 and d₂ = 8 − 4 = 4

**Mode** = 19.5 + (3 ÷ 7) × 10 ≈ **23.79**

## Which average should you use?
- **Mean** — uses every value but is pulled by outliers
- **Median** — best for skewed data such as incomes
- **Mode** — the only average for nominal data`,
    },
    {
      week: 5,
      kind: "notes",
      title: "Week 5 — Measures of dispersion",
      description: "Range, IQR, variance, standard deviation, coefficient of variation and skewness.",
      content: `# Measures of dispersion

How spread out are the data?

## Range and interquartile range
- **Range** = maximum − minimum
- **Interquartile range (IQR)** = Q₃ − Q₁ — the spread of the middle 50%, not affected by outliers
- **Quartile deviation** = (Q₃ − Q₁) ÷ 2

## Variance and standard deviation
- Population: σ² = Σ(x − μ)² ÷ N
- Sample: s² = Σ(x − x̄)² ÷ (n − 1)
- Standard deviation = √variance (in the same units as the data)
- Shortcut for a sample: s² = (Σx² − (Σx)² ÷ n) ÷ (n − 1)

## Worked example (a sample): 2, 4, 4, 5, 10
x̄ = 25 ÷ 5 = 5

Deviations: −3, −1, −1, 0, 5 → squares: 9, 1, 1, 0, 25 → sum = 36

s² = 36 ÷ 4 = 9 → **s = 3**

Shortcut check: Σx² = 161 and (Σx)² ÷ n = 625 ÷ 5 = 125 → (161 − 125) ÷ 4 = 9 ✓

## Coefficient of variation
CV = (s ÷ x̄) × 100% — compares the spread of data sets with different units or means. Here CV = 3 ÷ 5 × 100% = **60%**

## Skewness
- Symmetric: mean = median = mode
- Positively skewed (long tail to the right): mean > median > mode
- Negatively skewed (long tail to the left): mean < median < mode
- Pearson's coefficient: Sk = 3(mean − median) ÷ s`,
    },
    {
      week: null,
      kind: "link",
      title: "OpenStax — Introductory Statistics 2e (free textbook)",
      description: "A free, complete statistics textbook with worked examples and practice questions.",
      url: "https://openstax.org/details/books/introductory-statistics-2e",
    },
  ],
  quiz: {
    title: "STAT 111 — Data, distributions & averages test",
    description: "Weeks 1–4: types of data, sampling, frequency distributions and averages.",
    week: 4,
    time: 12,
    questions: [
      {
        type: "single",
        prompt: "Temperature measured in °C is on which scale of measurement?",
        options: ["Nominal", "Ordinal", "Interval", "Ratio"],
        correct: "Interval",
        explanation:
          "Gaps are equal but 0 °C is not an absence of temperature, so there is no true zero — interval, not ratio.",
        points: 1,
      },
      {
        type: "single",
        prompt: "What is the mean of 4, 7, 7, 9 and 13?",
        options: ["7", "8", "9", "40"],
        correct: "8",
        explanation: "Σx = 40 and n = 5, so the mean is 40 ÷ 5 = 8. (7 is the median and the mode.)",
        points: 1,
      },
      {
        type: "multiple",
        prompt: "Which of these are probability (random) sampling methods? (Select all that apply)",
        options: [
          "Simple random sampling",
          "Stratified sampling",
          "Systematic sampling",
          "Convenience sampling",
        ],
        correct: ["Simple random sampling", "Stratified sampling", "Systematic sampling"],
        explanation:
          "Convenience sampling picks whoever is easiest to reach, so members do not have a known chance of selection.",
        points: 2,
      },
      {
        type: "boolean",
        prompt: "In a histogram the bars touch because the data are continuous.",
        correct: true,
        explanation: "True — histograms use class boundaries on a continuous scale; bar charts leave gaps.",
        points: 1,
      },
      {
        type: "single",
        prompt: "Which average is the only suitable one for nominal data?",
        options: ["Mean", "Median", "Mode", "Geometric mean"],
        correct: "Mode",
        explanation: "Nominal categories cannot be added or ordered, so only the most frequent category makes sense.",
        points: 1,
      },
      {
        type: "short",
        prompt: "What is the class mark (midpoint) of the class 20 – 29?",
        correct: ["24.5"],
        explanation: "(20 + 29) ÷ 2 = 24.5",
        points: 1,
      },
    ],
  },
};
