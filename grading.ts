export type QuestionType = "single" | "multiple" | "boolean" | "short";

export type AnswerValue = string | string[] | boolean | null;

export interface GradableQuestion {
  id: number;
  type: string;
  options: string[];
  correct: string | string[] | boolean;
  points: number;
}

/**
 * Loose normalisation for typed short answers: case, punctuation and extra
 * spaces are ignored ("Ctrl+S" == "ctrl s").
 */
export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Strict normalisation for multiple-choice options. Symbols matter here —
 * "$A$1" and "A1", or "p → q" and "p ∧ q", are different answers — so only
 * whitespace and letter case are ignored.
 */
export function normalizeChoice(value: string): string {
  return value.normalize("NFC").replace(/\s+/g, " ").trim().toLowerCase();
}

export function answersMatch(
  question: GradableQuestion,
  answer: AnswerValue,
): boolean {
  if (answer === null || answer === undefined) return false;

  if (question.type === "boolean") {
    const expected = Boolean(question.correct);
    const given =
      typeof answer === "boolean"
        ? answer
        : normalizeText(String(answer)) === "true";
    return expected === given;
  }

  if (question.type === "multiple") {
    const expected = (
      Array.isArray(question.correct) ? question.correct : [question.correct]
    ).map((item) => normalizeChoice(String(item)));
    const given = (Array.isArray(answer) ? answer : [answer]).map((item) =>
      normalizeChoice(String(item)),
    );
    const expectedSet = new Set(expected);
    const givenSet = new Set(given);
    if (expectedSet.size !== givenSet.size) return false;
    for (const item of givenSet) {
      if (!expectedSet.has(item)) return false;
    }
    return true;
  }

  if (question.type === "short") {
    const accepted = Array.isArray(question.correct)
      ? question.correct
      : [String(question.correct)];
    const normalizedGiven = normalizeText(String(answer));
    if (!normalizedGiven) return false;
    return accepted.some((option) => {
      const normalizedAccepted = normalizeText(String(option));
      return normalizedAccepted.length > 0 && normalizedGiven === normalizedAccepted;
    });
  }

  // single choice
  return normalizeChoice(String(answer)) === normalizeChoice(String(question.correct));
}

export interface GradeResult {
  score: number;
  maxScore: number;
  results: Record<string, boolean>;
}

export function gradeQuiz(
  questions: GradableQuestion[],
  answers: Record<string, AnswerValue>,
): GradeResult {
  const results: Record<string, boolean> = {};
  let score = 0;
  let maxScore = 0;

  for (const question of questions) {
    const points = question.points || 1;
    maxScore += points;
    const answer = answers[String(question.id)];
    const correct = answersMatch(question, answer ?? null);
    results[String(question.id)] = correct;
    if (correct) score += points;
  }

  return { score, maxScore, results };
}
