import {
  BookOpen,
  Code2,
  FileText,
  FlaskConical,
  Link2,
  NotebookPen,
  Presentation,
  ScrollText,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { MaterialKind } from "@/lib/materials";

const iconMap: Record<MaterialKind, LucideIcon> = {
  slides: Presentation,
  notes: NotebookPen,
  pdf: FileText,
  past: ScrollText,
  lab: FlaskConical,
  code: Code2,
  link: Link2,
  video: Video,
  reading: BookOpen,
};

const labels: Record<string, string> = {
  slides: "Slides",
  notes: "Notes",
  pdf: "PDF",
  past: "Past questions",
  lab: "Practical",
  code: "Code",
  link: "Link",
  video: "Video",
  reading: "Reading",
};

const tones: Record<string, string> = {
  slides: "bg-amber-400/10 text-amber-300 ring-amber-400/25",
  notes: "bg-sky-400/10 text-sky-300 ring-sky-400/25",
  pdf: "bg-rose-400/10 text-rose-300 ring-rose-400/25",
  past: "bg-lime-400/10 text-lime-300 ring-lime-400/25",
  lab: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25",
  code: "bg-violet-400/10 text-violet-300 ring-violet-400/25",
  link: "bg-teal-400/10 text-teal-300 ring-teal-400/25",
  video: "bg-fuchsia-400/10 text-fuchsia-300 ring-fuchsia-400/25",
  reading: "bg-orange-400/10 text-orange-300 ring-orange-400/25",
};

export function MaterialIcon({
  kind,
  className,
}: {
  kind: string;
  className?: string;
}) {
  const Icon = iconMap[kind as MaterialKind] ?? FileText;
  return <Icon className={className ?? "h-4 w-4"} />;
}

export function KindBadge({ kind }: { kind: string }) {
  const Icon = iconMap[kind as MaterialKind] ?? FileText;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${
        tones[kind] ?? "bg-slate-400/10 text-slate-300 ring-slate-400/25"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {labels[kind] ?? kind}
    </span>
  );
}

export function WeekBadge({ week, current }: { week: number | null; current?: boolean }) {
  if (!week) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${
        current
          ? "bg-emerald-400/15 text-emerald-200 ring-emerald-400/40"
          : "bg-white/5 text-slate-300 ring-white/15"
      }`}
    >
      Week {week}
    </span>
  );
}
