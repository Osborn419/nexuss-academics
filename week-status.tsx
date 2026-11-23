import Link from "next/link";
import { ArrowRight, CalendarDays, ClipboardCheck, Clock } from "lucide-react";
import { site } from "@/config/site";
import { MaterialIcon } from "@/components/icons";
import type { SemesterStatus } from "@/lib/semester";
import { formatShortDate, formatWeekRange } from "@/lib/format";
import { materialHref, type LinkableMaterial } from "@/lib/materials";

export interface WeekItem extends LinkableMaterial {
  title: string;
  courseCode: string;
}

export interface WeekTest {
  id: number;
  title: string;
  courseCode: string;
  questionCount: number;
  timeLimitMinutes: number;
}

export function weekHeadline(status: SemesterStatus): string {
  if (status.phase === "before") return `Semester starts ${formatShortDate(status.focusStart)}`;
  if (status.phase === "after") return "Teaching weeks are over";
  if (status.upcoming) return `Week ${status.focusWeek} starts Monday`;
  return `Week ${status.focusWeek}`;
}

export function weekSubline(status: SemesterStatus): string {
  if (status.phase === "after") return "Revision and exams — keep practising with the tests.";
  const range = formatWeekRange(status.focusStart, status.focusEnd);
  if (status.upcoming) return `${range} · get ahead this weekend`;
  return `${range} · happening now`;
}

export function WeekStatusCard({
  status,
  items,
  tests,
}: {
  status: SemesterStatus;
  items: WeekItem[];
  tests: WeekTest[];
}) {
  const weekShown = status.phase === "after" ? status.totalWeeks : status.focusWeek;
  const progressPct = Math.round(status.progress * 100);
  const currentLabel =
    status.phase === "before"
      ? "Semester not started"
      : status.phase === "after"
        ? "All teaching weeks done"
        : `Today: week ${status.currentWeek} of ${status.totalWeeks}`;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 via-white/[0.02] to-sky-500/10 p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            <CalendarDays className="h-4 w-4" />
            {status.label}
          </p>

          <div className="mt-5 flex items-center gap-4">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 text-canvas shadow-lg shadow-emerald-500/20">
              <span className="text-center leading-none">
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em]">
                  Week
                </span>
                <span className="mt-1 block text-4xl font-black">{weekShown}</span>
              </span>
            </span>
            <div className="min-w-0">
              <h2 className="text-2xl font-semibold leading-tight text-white">
                {weekHeadline(status)}
              </h2>
              <p className="mt-1 text-sm text-slate-300">{weekSubline(status)}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
              <span>{currentLabel}</span>
              <span>{progressPct}% through</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <Link
            href={`/weeks?w=${status.focusWeek}`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
          >
            Open the week {status.focusWeek} plan <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">
            {status.upcoming
              ? `Coming up in week ${status.focusWeek}`
              : `On the plan for week ${status.focusWeek}`}
          </p>

          {items.length === 0 && tests.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-white/15 p-6 text-sm text-slate-400">
              Nothing posted for week {status.focusWeek} yet — {site.ownerFirstName} adds
              slides and notes here as the week goes on.
            </p>
          ) : (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {items.slice(0, 10).map((item) => {
                const { href, external } = materialHref(item);
                const inner = (
                  <>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 text-emerald-300 ring-1 ring-white/10">
                      <MaterialIcon kind={item.kind} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-500">
                        {item.courseCode}
                      </span>
                      <span className="block truncate text-sm font-medium text-slate-100">
                        {item.title}
                      </span>
                    </span>
                  </>
                );
                const className =
                  "flex items-center gap-3 rounded-xl border border-white/10 bg-canvas/50 px-3 py-2.5 transition hover:border-emerald-400/40 hover:bg-emerald-400/5";
                return (
                  <li key={item.id}>
                    {external ? (
                      <a href={href} target="_blank" rel="noreferrer" className={className}>
                        {inner}
                      </a>
                    ) : (
                      <Link href={href} className={className}>
                        {inner}
                      </Link>
                    )}
                  </li>
                );
              })}
              {tests.map((test) => (
                <li key={`test-${test.id}`}>
                  <Link
                    href={`/quizzes/${test.id}`}
                    className="flex items-center gap-3 rounded-xl border border-sky-400/25 bg-sky-400/5 px-3 py-2.5 transition hover:border-sky-400/50"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sky-400/10 text-sky-300 ring-1 ring-sky-400/25">
                      <ClipboardCheck className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-500">
                        {test.courseCode} · test
                      </span>
                      <span className="block truncate text-sm font-medium text-slate-100">
                        {test.title}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock className="h-3 w-3" /> {test.timeLimitMinutes} min ·{" "}
                        {test.questionCount} questions
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
