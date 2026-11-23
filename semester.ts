/**
 * Semester calendar helpers.
 *
 * Weeks run Monday → Sunday. Ghana keeps GMT all year (no daylight saving),
 * so UTC calendar dates are exactly Accra dates — no timezone maths needed.
 * Everything here is pure, so it works on the server and in the browser.
 */

export interface SemesterConfig {
  /** Monday of teaching week 1, as YYYY-MM-DD. */
  start: string;
  /** Number of teaching weeks in the semester. */
  weeks: number;
  /** Friendly label, e.g. "First Semester · 2026/2027". */
  label: string;
}

/**
 * Monday 23 November 2026 is the first day of week 5,
 * so week 1 began on Monday 26 October 2026.
 */
export const DEFAULT_SEMESTER: SemesterConfig = {
  start: "2026-10-26",
  weeks: 13,
  label: "First Semester · 2026/2027",
};

export const DAY_MS = 86_400_000;
export const WEEK_MS = DAY_MS * 7;

export function parseISODate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(date.getTime()) || date.getUTCDate() !== day) return null;
  return date;
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function startOfDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

export function mondayOf(date: Date): Date {
  const day = startOfDay(date);
  const offset = (day.getUTCDay() + 6) % 7; // Monday = 0 … Sunday = 6
  return new Date(day.getTime() - offset * DAY_MS);
}

/** The Monday strictly after the current week's Monday. */
export function nextMonday(date: Date): Date {
  return new Date(mondayOf(date).getTime() + WEEK_MS);
}

export function semesterStartDate(config: SemesterConfig): Date {
  return (
    parseISODate(config.start) ?? (parseISODate(DEFAULT_SEMESTER.start) as Date)
  );
}

/** Week number that contains `date` (≤ 0 before the semester starts). */
export function weekNumberOn(config: SemesterConfig, date: Date): number {
  const start = semesterStartDate(config);
  const diff = Math.floor((startOfDay(date).getTime() - start.getTime()) / DAY_MS);
  return Math.floor(diff / 7) + 1;
}

export function weekRange(config: SemesterConfig, week: number) {
  const start = new Date(semesterStartDate(config).getTime() + (week - 1) * WEEK_MS);
  const end = new Date(start.getTime() + 6 * DAY_MS);
  return { start, end };
}

export type SemesterPhase = "before" | "teaching" | "after";

export interface SemesterStatus {
  label: string;
  totalWeeks: number;
  phase: SemesterPhase;
  /** Week containing today (can be ≤ 0 or > totalWeeks). */
  currentWeek: number;
  /** The week students should focus on — next week on weekends. */
  focusWeek: number;
  /** True when the focus week has not started yet (weekend preview). */
  upcoming: boolean;
  focusStart: Date;
  focusEnd: Date;
  /** 0 → 1 through the teaching weeks. */
  progress: number;
}

export function getSemesterStatus(
  config: SemesterConfig,
  now: Date = new Date(),
): SemesterStatus {
  const totalWeeks = Math.max(1, Math.round(config.weeks) || DEFAULT_SEMESTER.weeks);
  const start = semesterStartDate(config);
  const today = startOfDay(now);
  const diffDays = Math.floor((today.getTime() - start.getTime()) / DAY_MS);
  const currentWeek = Math.floor(diffDays / 7) + 1;
  const weekday = today.getUTCDay();
  const weekend = weekday === 0 || weekday === 6;

  let phase: SemesterPhase = "teaching";
  if (currentWeek < 1) phase = "before";
  else if (currentWeek > totalWeeks) phase = "after";

  let focusWeek = Math.min(Math.max(currentWeek, 1), totalWeeks);
  let upcoming = false;

  if (phase === "before") {
    focusWeek = 1;
    upcoming = true;
  } else if (phase === "teaching" && weekend && currentWeek < totalWeeks) {
    focusWeek = currentWeek + 1;
    upcoming = true;
  }

  const range = weekRange(config, focusWeek);
  const progress = Math.min(1, Math.max(0, (diffDays + 1) / (totalWeeks * 7)));

  return {
    label: config.label,
    totalWeeks,
    phase,
    currentWeek,
    focusWeek,
    upcoming,
    focusStart: range.start,
    focusEnd: range.end,
    progress,
  };
}
