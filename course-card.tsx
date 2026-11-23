import Link from "next/link";
import { ArrowUpRight, BookOpen, CheckCircle2 } from "lucide-react";
import { accentMeta } from "@/lib/materials";
import { slugify } from "@/lib/format";

export interface CourseCardView {
  id: number;
  code: string;
  title: string;
  summary: string;
  track: string;
  level: number;
  credits: number;
  accent: string;
  materialCount?: number;
  quizCount?: number;
}

export function CourseCard({ course }: { course: CourseCardView }) {
  const accent = accentMeta(course.accent);
  const isElective = course.track === "elective";

  return (
    <Link
      href={`/courses/${slugify(course.code)}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-black/40`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 -top-24 h-40 bg-gradient-to-b ${accent.glow} to-transparent opacity-0 blur-2xl transition duration-300 group-hover:opacity-100`}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] font-semibold tracking-wide ring-1 ${accent.ring} ${accent.text}`}
          >
            {isElective ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <BookOpen className="h-3.5 w-3.5" />
            )}
            {course.code}
          </span>
          <h3 className="mt-3 text-lg font-semibold leading-snug text-white">
            {course.title}
          </h3>
        </div>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-300" />
      </div>

      <p className="relative mt-2.5 flex-1 text-sm leading-relaxed text-slate-400">
        {course.summary}
      </p>

      <div className="relative mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
        <span className="rounded-md bg-white/5 px-2 py-1">
          Level {course.level}
        </span>
        <span className="rounded-md bg-white/5 px-2 py-1">
          {course.credits} credits
        </span>
        <span className="rounded-md bg-white/5 px-2 py-1">
          {isElective ? "Elective track" : "Core course"}
        </span>
        {course.materialCount !== undefined ? (
          <span className="rounded-md bg-white/5 px-2 py-1">
            {course.materialCount} materials
          </span>
        ) : null}
        {course.quizCount !== undefined ? (
          <span className="rounded-md bg-white/5 px-2 py-1">
            {course.quizCount} tests
          </span>
        ) : null}
      </div>
    </Link>
  );
}
