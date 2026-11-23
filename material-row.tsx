import Link from "next/link";
import { BookOpenText, Download, Eye, ExternalLink, Presentation } from "lucide-react";
import { KindBadge, WeekBadge } from "@/components/icons";
import { formatBytes, formatDate } from "@/lib/format";

export interface MaterialView {
  id: number;
  title: string;
  description: string;
  kind: string;
  week: number | null;
  fileId: number | null;
  url: string | null;
  content: string | null;
  sizeBytes: number;
  durationMinutes: number | null;
  postedBy: string;
  createdAt: Date;
}

export function MaterialRow({
  material,
  courseCode,
  currentWeek,
}: {
  material: MaterialView;
  courseCode?: string;
  currentWeek?: number;
}) {
  const isDeck = material.kind === "slides" && Boolean(material.content);
  const hasText = Boolean(material.content) && !isDeck;
  const hasFile = Boolean(material.fileId);
  const detailHref = isDeck ? `/slides/${material.id}` : `/materials/${material.id}`;
  const linkOnly = !material.content && !hasFile && Boolean(material.url);

  return (
    <li className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20 hover:bg-white/[0.055] sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <KindBadge kind={material.kind} />
            <WeekBadge
              week={material.week}
              current={currentWeek !== undefined && material.week === currentWeek}
            />
            {courseCode ? (
              <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] text-slate-400">
                {courseCode}
              </span>
            ) : null}
          </div>

          <h3 className="mt-2 text-base font-semibold text-slate-100">
            {linkOnly && material.url ? (
              <a
                href={material.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-300"
              >
                {material.title}
              </a>
            ) : (
              <Link href={detailHref} className="hover:text-emerald-300">
                {material.title}
              </Link>
            )}
          </h3>
          {material.description ? (
            <p className="mt-1 text-sm leading-relaxed text-slate-400">
              {material.description}
            </p>
          ) : null}

          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span>Posted by {material.postedBy}</span>
            <span aria-hidden>·</span>
            <span>{formatDate(material.createdAt)}</span>
            {material.sizeBytes && hasFile ? (
              <>
                <span aria-hidden>·</span>
                <span>{formatBytes(material.sizeBytes)}</span>
              </>
            ) : null}
            {material.durationMinutes ? (
              <>
                <span aria-hidden>·</span>
                <span>{material.durationMinutes} min</span>
              </>
            ) : null}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {isDeck ? (
            <Link
              href={`/slides/${material.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400/15 px-3 py-2 text-xs font-semibold text-amber-200 ring-1 ring-amber-400/30 transition hover:bg-amber-400/25"
            >
              <Presentation className="h-4 w-4" />
              Open deck
            </Link>
          ) : null}

          {hasText ? (
            <Link
              href={`/materials/${material.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sky-400/15 px-3 py-2 text-xs font-semibold text-sky-200 ring-1 ring-sky-400/30 transition hover:bg-sky-400/25"
            >
              <BookOpenText className="h-4 w-4" />
              Read
            </Link>
          ) : null}

          {hasFile ? (
            <>
              <Link
                href={`/materials/${material.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-400/15 px-3 py-2 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/30 transition hover:bg-emerald-400/25"
              >
                <Eye className="h-4 w-4" />
                View
              </Link>
              <a
                href={`/api/files/${material.fileId}?download=1`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 ring-1 ring-white/10 transition hover:bg-white/10"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            </>
          ) : null}

          {material.url ? (
            <a
              href={material.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              <ExternalLink className="h-4 w-4" />
              {linkOnly ? "Open link" : "Source"}
            </a>
          ) : null}
        </div>
      </div>
    </li>
  );
}
