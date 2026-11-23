import Link from "next/link";
import { CalendarDays, ClipboardCheck, Clock, Layers } from "lucide-react";
import { MaterialRow } from "@/components/material-row";
import { weekHeadline } from "@/components/week-status";
import {
  getCourses,
  getMaterialsByWeek,
  getProgressWeeks,
  getQuizzes,
  getSemesterConfig,
  getWeekCounts,
} from "@/lib/queries";
import { getCurrentProfile } from "@/lib/auth";
import { ProgressToggle } from "@/components/progress-toggle";
import { getSemesterStatus, weekRange } from "@/lib/semester";
import { formatWeekRange } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Week-by-week plan",
  description:
    "Every slide deck, note and practice test for the semester, organised by teaching week.",
};

export default async function WeeksPage({
  searchParams,
}: {
  searchParams: Promise<{ w?: string }>;
}) {
  const { w } = await searchParams;
  const semester = await getSemesterConfig();
  const status = getSemesterStatus(semester);
  const maxWeek = status.totalWeeks + 3; // revision + exam weeks

  const requested = Number(w);
  const selected =
    Number.isFinite(requested) && requested >= 1 && requested <= maxWeek
      ? Math.round(requested)
      : status.focusWeek;

  const [courses, rows, quizzes, counts, profile] = await Promise.all([
    getCourses(),
    getMaterialsByWeek(selected),
    getQuizzes(),
    getWeekCounts(),
    getCurrentProfile(),
  ]);
  const progressRows = profile ? await getProgressWeeks(profile.id) : [];
  const doneKeys = new Set(progressRows.map((row) => `${row.courseId}:${row.week}`));

  const courseMap = new Map(courses.map((course) => [course.id, course]));
  const range = weekRange(semester, selected);
  const weekQuizzes = quizzes.filter((quiz) => quiz.published && quiz.week === selected);

  const quizWeekCounts = new Map<number, number>();
  for (const quiz of quizzes) {
    if (quiz.week) quizWeekCounts.set(quiz.week, (quizWeekCounts.get(quiz.week) ?? 0) + 1);
  }

  const groups = courses
    .map((course) => ({
      course,
      items: rows.filter((row) => row.courseId === course.id).map((row) => row.material),
    }))
    .filter((group) => group.items.length > 0);

  const todayWeek = status.phase === "teaching" ? status.currentWeek : null;
  const relation =
    selected === todayWeek
      ? "This week"
      : status.upcoming && selected === status.focusWeek
        ? "Starts Monday"
        : todayWeek !== null && selected < todayWeek
          ? "Past week"
          : selected > status.totalWeeks
            ? "Revision / exams"
            : "Upcoming";

  return (
    <div className="space-y-8 pt-6">
      <header className="max-w-3xl">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/90">
          <CalendarDays className="h-4 w-4" /> {status.label}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Week-by-week plan
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-400">
          {weekHeadline(status)}. Pick any week to see the slides, notes and tests
          for all six courses.
        </p>
      </header>

      <nav aria-label="Weeks" className="flex flex-wrap gap-2">
        {Array.from({ length: maxWeek }, (_, index) => index + 1).map((week) => {
          const total = (counts.get(week) ?? 0) + (quizWeekCounts.get(week) ?? 0);
          const isSelected = week === selected;
          const isToday = week === todayWeek;
          return (
            <Link
              key={week}
              href={`/weeks?w=${week}`}
              className={`relative flex min-w-[3.25rem] flex-col items-center rounded-xl px-3 py-2 text-sm font-semibold ring-1 transition ${
                isSelected
                  ? "bg-gradient-to-br from-emerald-400 to-sky-400 text-canvas ring-transparent"
                  : week > status.totalWeeks
                    ? "bg-white/[0.02] text-slate-500 ring-white/10 hover:bg-white/5"
                    : "bg-white/5 text-slate-200 ring-white/10 hover:bg-white/10"
              }`}
            >
              <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">
                {week > status.totalWeeks ? "Extra" : "Week"}
              </span>
              {week}
              {total > 0 ? (
                <span
                  className={`mt-0.5 text-[10px] font-medium ${
                    isSelected ? "text-canvas/80" : "text-emerald-300/80"
                  }`}
                >
                  {total} item{total === 1 ? "" : "s"}
                </span>
              ) : null}
              {isToday ? (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-canvas" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-white">Week {selected}</h2>
            <p className="mt-1 text-sm text-slate-400">
              {formatWeekRange(range.start, range.end)}
            </p>
          </div>
          <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
            {relation}
          </span>
        </div>

        {groups.length === 0 && weekQuizzes.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-white/12 p-8 text-center text-sm text-slate-500">
            Nothing has been posted for week {selected} yet.
          </p>
        ) : null}

        <div className="mt-6 space-y-8">
          {groups.map(({ course, items }) => (
            <div key={course.id}>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-sky-400" />
                <h3 className="flex flex-1 flex-wrap items-center justify-between gap-2 font-semibold text-white">
                  <Link
                    href={`/courses/${course.code.toLowerCase().replace(/\s+/g, "-")}`}
                    className="hover:text-emerald-300"
                  >
                    {course.code} — {course.title}
                  </Link>
                  {profile ? (
                    <ProgressToggle
                      courseId={course.id}
                      week={selected}
                      completed={doneKeys.has(`${course.id}:${selected}`)}
                      label={`Week ${selected} done`}
                    />
                  ) : null}
                </h3>
              </div>
              <ul className="mt-3 space-y-3">
                {items.map((material) => (
                  <MaterialRow
                    key={material.id}
                    material={material}
                    currentWeek={todayWeek ?? undefined}
                  />
                ))}
              </ul>
            </div>
          ))}

          {weekQuizzes.length > 0 ? (
            <div>
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-sky-400" />
                <h3 className="font-semibold text-white">Practice tests for week {selected}</h3>
              </div>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {weekQuizzes.map((quiz) => (
                  <li key={quiz.id}>
                    <Link
                      href={`/quizzes/${quiz.id}`}
                      className="block rounded-2xl border border-white/10 bg-canvas/40 p-4 transition hover:border-emerald-400/40 hover:bg-emerald-400/5"
                    >
                      <p className="font-mono text-[11px] text-slate-500">
                        {courseMap.get(quiz.courseId)?.code}
                      </p>
                      <p className="mt-1 font-semibold text-slate-100">{quiz.title}</p>
                      <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5" /> {quiz.timeLimitMinutes} min ·{" "}
                        {quiz.questionCount} questions · {quiz.attemptCount} attempts
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
