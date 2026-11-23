export type MaterialKind =
  | "slides"
  | "notes"
  | "pdf"
  | "past"
  | "lab"
  | "code"
  | "link"
  | "video"
  | "reading";

export const materialKindMeta: Record<MaterialKind, { label: string }> = {
  slides: { label: "Slides" },
  notes: { label: "Lecture notes" },
  pdf: { label: "PDF / handout" },
  past: { label: "Past questions" },
  lab: { label: "Practical / tutorial" },
  code: { label: "Code sample" },
  link: { label: "External link" },
  video: { label: "Video" },
  reading: { label: "Reading" },
};

export const materialKinds = Object.keys(materialKindMeta) as MaterialKind[];

export function kindMeta(kind: string) {
  return materialKindMeta[kind as MaterialKind] ?? { label: kind };
}

/** Best guess at a material type from a file name — used for bulk uploads. */
export function detectKind(filename: string): MaterialKind {
  const ext = filename.toLowerCase().split(".").pop() ?? "";
  if (["ppt", "pptx", "key", "odp"].includes(ext)) return "slides";
  if (["pdf"].includes(ext)) return "pdf";
  if (["doc", "docx", "odt", "rtf", "txt", "md"].includes(ext)) return "notes";
  if (["xls", "xlsx", "csv", "ods", "accdb"].includes(ext)) return "lab";
  if (
    ["zip", "rar", "7z", "py", "java", "c", "cpp", "js", "ts", "html", "css", "ipynb"].includes(ext)
  )
    return "code";
  if (["mp4", "mov", "mkv", "webm", "avi"].includes(ext)) return "video";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "notes";
  return "pdf";
}

export interface LinkableMaterial {
  id: number;
  kind: string;
  content: string | null;
  fileId: number | null;
  url: string | null;
}

/** Where clicking a material should take a student. */
export function materialHref(material: LinkableMaterial): {
  href: string;
  external: boolean;
} {
  if (material.kind === "slides" && material.content) {
    return { href: `/slides/${material.id}`, external: false };
  }
  if (material.content || material.fileId) {
    return { href: `/materials/${material.id}`, external: false };
  }
  if (material.url) return { href: material.url, external: true };
  return { href: `/materials/${material.id}`, external: false };
}

export const courseAccents: Record<string, { ring: string; text: string; glow: string }> = {
  emerald: {
    ring: "ring-emerald-400/40",
    text: "text-emerald-300",
    glow: "from-emerald-500/25",
  },
  sky: { ring: "ring-sky-400/40", text: "text-sky-300", glow: "from-sky-500/25" },
  violet: {
    ring: "ring-violet-400/40",
    text: "text-violet-300",
    glow: "from-violet-500/25",
  },
  amber: { ring: "ring-amber-400/40", text: "text-amber-300", glow: "from-amber-500/25" },
  rose: { ring: "ring-rose-400/40", text: "text-rose-300", glow: "from-rose-500/25" },
  teal: { ring: "ring-teal-400/40", text: "text-teal-300", glow: "from-teal-500/25" },
  cyan: { ring: "ring-cyan-400/40", text: "text-cyan-300", glow: "from-cyan-500/25" },
  indigo: {
    ring: "ring-indigo-400/40",
    text: "text-indigo-300",
    glow: "from-indigo-500/25",
  },
};

export function accentMeta(accent: string) {
  return courseAccents[accent] ?? courseAccents.emerald;
}
