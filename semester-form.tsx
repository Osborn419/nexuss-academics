"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Loader2, Save } from "lucide-react";
import {
  getSemesterStatus,
  nextMonday,
  parseISODate,
  toISODate,
  WEEK_MS,
  weekNumberOn,
  type SemesterConfig,
} from "@/lib/semester";
import { formatShortDate } from "@/lib/format";

export function SemesterForm({
  config,
  nowISO,
}: {
  config: SemesterConfig;
  nowISO: string;
}) {
  const router = useRouter();
  const now = useMemo(() => new Date(nowISO), [nowISO]);
  const upcomingMonday = useMemo(() => nextMonday(now), [now]);

  const [start, setStart] = useState(config.start);
  const [weeks, setWeeks] = useState(config.weeks);
  const [label, setLabel] = useState(config.label);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const valid = parseISODate(start) !== null;
  const draft: SemesterConfig = { start, weeks, label };
  const status = getSemesterStatus(draft, now);
  const mondayWeek = valid ? weekNumberOn(draft, upcomingMonday) : 0;

  const setMondayWeek = (value: number) => {
    if (!Number.isFinite(value) || value < 1 || value > 30) return;
    setStart(toISODate(new Date(upcomingMonday.getTime() - (value - 1) * WEEK_MS)));
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ semesterStart: start, semesterWeeks: weeks, semesterLabel: label }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not save the calendar.");
      setMessage("Semester calendar saved — the whole site now uses it.");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save the calendar.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-white/12 bg-canvas/70 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20";

  return (
    <section className="rounded-2xl border border-emerald-400/25 bg-emerald-400/5 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <CalendarClock className="h-5 w-5 text-emerald-300" /> Semester calendar
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Controls the week number shown across the site and the default week for
            new uploads.
          </p>
        </div>
        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/30">
          {status.phase === "teaching"
            ? `Today: week ${status.currentWeek}`
            : status.phase === "before"
              ? "Not started yet"
              : "Teaching weeks done"}
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block text-sm">
          <span className="font-medium text-slate-300">
            Next Monday ({formatShortDate(upcomingMonday)}) is week
          </span>
          <input
            type="number"
            min={1}
            max={30}
            value={mondayWeek || ""}
            onChange={(event) => setMondayWeek(Number(event.target.value))}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-300">Week 1 began on</span>
          <input
            type="date"
            value={start}
            onChange={(event) => setStart(event.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-300">Teaching weeks</span>
          <input
            type="number"
            min={1}
            max={26}
            value={weeks}
            onChange={(event) => setWeeks(Number(event.target.value) || 1)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-300">Label</span>
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <p className="mt-4 text-sm text-slate-300">
        {valid ? (
          <>
            Today ({formatShortDate(now)}) is in{" "}
            <strong className="text-white">week {status.currentWeek}</strong>, and Monday{" "}
            {formatShortDate(upcomingMonday)} will be{" "}
            <strong className="text-white">week {mondayWeek}</strong>.
          </>
        ) : (
          "Pick a valid start date."
        )}
      </p>

      {error ? (
        <p className="mt-3 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-400/25">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mt-3 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 ring-1 ring-emerald-400/25">
          {message}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => void save()}
        disabled={saving || !valid}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-2.5 text-sm font-semibold text-canvas transition hover:brightness-110 disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save calendar
      </button>
    </section>
  );
}
