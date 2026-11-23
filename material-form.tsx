"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileUp, Loader2, Upload, X } from "lucide-react";
import { detectKind, kindMeta, materialKinds } from "@/lib/materials";
import { formatBytes } from "@/lib/format";

export interface CourseOption {
  id: number;
  code: string;
  title: string;
}

const MAX_FILE_BYTES = 50 * 1024 * 1024;

export function MaterialForm({
  courses,
  defaultWeek,
  totalWeeks,
}: {
  courses: CourseOption[];
  defaultWeek: number;
  totalWeeks: number;
}) {
  const router = useRouter();
  const [courseId, setCourseId] = useState(String(courses[0]?.id ?? ""));
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("auto");
  const [week, setWeek] = useState(String(defaultWeek));
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [inputKey, setInputKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-white/12 bg-canvas/70 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20";

  const buildForm = (file: File | null, fileTitle: string, withExtras: boolean) => {
    const form = new FormData();
    form.set("courseId", courseId);
    form.set("title", fileTitle);
    form.set("kind", kind);
    form.set("week", week);
    form.set("description", description);
    if (withExtras) {
      form.set("url", url);
      form.set("content", content);
    }
    if (file) form.set("file", file);
    return form;
  };

  const post = async (form: FormData) => {
    const response = await fetch("/api/admin/materials", { method: "POST", body: form });
    let data: { error?: string } = {};
    try {
      data = (await response.json()) as { error?: string };
    } catch {
      // non-JSON response (e.g. a proxy error page)
    }
    if (!response.ok) {
      throw new Error(data.error || `Upload failed (HTTP ${response.status}).`);
    }
  };

  const resetFields = () => {
    setTitle("");
    setDescription("");
    setUrl("");
    setContent("");
    setFiles([]);
    setInputKey((value) => value + 1);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (files.length <= 1) {
        const file = files[0] ?? null;
        const fileTitle = title.trim() || (file ? file.name.replace(/\.[^.]+$/, "") : "");
        setProgress(file ? `Uploading ${file.name}…` : "Saving…");
        await post(buildForm(file, fileTitle, true));
        setMessage("Material posted.");
        resetFields();
      } else {
        const failures: string[] = [];
        for (let index = 0; index < files.length; index += 1) {
          const file = files[index];
          const base = file.name.replace(/\.[^.]+$/, "");
          const fileTitle = title.trim() ? `${title.trim()} — ${base}` : base;
          setProgress(`Uploading ${index + 1} of ${files.length}: ${file.name}`);
          try {
            await post(buildForm(file, fileTitle, false));
          } catch (uploadError) {
            failures.push(
              `${file.name}: ${uploadError instanceof Error ? uploadError.message : "failed"}`,
            );
          }
        }
        const posted = files.length - failures.length;
        setMessage(`${posted} of ${files.length} files posted.`);
        if (failures.length > 0) setError(failures.join("\n"));
        if (posted > 0) resetFields();
      }
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save the material.");
    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  const tooBig = files.filter((file) => file.size > MAX_FILE_BYTES);

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="font-medium text-slate-300">Course</span>
          <select value={courseId} onChange={(event) => setCourseId(event.target.value)} className={inputClass}>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} — {course.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-300">Week</span>
          <select value={week} onChange={(event) => setWeek(event.target.value)} className={inputClass}>
            <option value="">No specific week</option>
            {Array.from({ length: totalWeeks + 3 }, (_, index) => index + 1).map((value) => (
              <option key={value} value={value}>
                Week {value}
                {value === defaultWeek ? " (current)" : ""}
                {value > totalWeeks ? " · revision / exams" : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-300">Material type</span>
          <select value={kind} onChange={(event) => setKind(event.target.value)} className={inputClass}>
            <option value="auto">Detect from file type</option>
            {materialKinds.map((item) => (
              <option key={item} value={item}>
                {kindMeta(item).label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-slate-300">
          Files <span className="text-slate-500">(PDF, PowerPoint, Word, Excel, ZIP… up to 50 MB each — select as many as you like)</span>
        </span>
        <span className="mt-1.5 flex items-center gap-3 rounded-xl border border-dashed border-emerald-400/30 bg-canvas/50 px-3.5 py-4 text-sm text-slate-400">
          <FileUp className="h-5 w-5 shrink-0 text-emerald-400" />
          <input
            key={inputKey}
            type="file"
            multiple
            onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
            className="w-full text-xs text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-200"
          />
        </span>
        <span className="mt-1.5 block text-xs text-slate-500">
          Tip: PDFs open right inside the site. PowerPoint and Word files are downloaded —
          export slides to PDF if you want them viewable on phones.
        </span>
      </label>

      {files.length > 0 ? (
        <ul className="max-h-56 space-y-1.5 overflow-y-auto rounded-xl border border-white/10 bg-canvas/40 p-3">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 text-xs">
              <span className="min-w-0 truncate text-slate-200">{file.name}</span>
              <span className="flex shrink-0 items-center gap-2 text-slate-500">
                {kind === "auto" ? <span>{kindMeta(detectKind(file.name)).label}</span> : null}
                <span className={file.size > MAX_FILE_BYTES ? "text-rose-300" : ""}>
                  {formatBytes(file.size)}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}
                  className="rounded p-0.5 text-slate-500 hover:bg-white/10 hover:text-rose-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <label className="block text-sm">
        <span className="font-medium text-slate-300">
          Title{" "}
          <span className="text-slate-500">
            {files.length > 1
              ? "(optional — used as a prefix: “Title — file name”)"
              : "(optional when uploading a file — the file name is used)"}
          </span>
        </span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Lecture 5 — Algorithms & flowcharts"
          className={inputClass}
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-slate-300">Description</span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={2}
          placeholder="One or two lines students will see in the library."
          className={inputClass}
        />
      </label>

      {files.length <= 1 ? (
        <>
          <label className="block text-sm">
            <span className="font-medium text-slate-300">
              Link <span className="text-slate-500">(optional — YouTube, Google Drive, website…)</span>
            </span>
            <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://…" className={inputClass} />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-300">
              Written notes or slides <span className="text-slate-500">(optional, markdown)</span>
            </span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={7}
              placeholder={"# Topic title\n\nKey point one\n\n---\n\n## Next slide\n\nKey point two"}
              className={`${inputClass} font-mono text-xs`}
            />
            <span className="mt-1.5 block text-xs text-slate-500">
              Students read this on the material page. For a slide deck, choose type
              “Slides” and separate slides with a line containing three dashes: ---
            </span>
          </label>
        </>
      ) : null}

      {tooBig.length > 0 ? (
        <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-200 ring-1 ring-amber-400/25">
          {tooBig.length} file{tooBig.length === 1 ? " is" : "s are"} over 50 MB and will be
          rejected — compress or split {tooBig.length === 1 ? "it" : "them"} first.
        </p>
      ) : null}
      {error ? (
        <p className="whitespace-pre-line rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-400/25">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 ring-1 ring-emerald-400/25">
          {message}
        </p>
      ) : null}
      {progress ? (
        <p className="flex items-center gap-2 text-sm text-slate-300">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-300" /> {progress}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-2.5 text-sm font-semibold text-canvas transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {files.length > 1 ? `Upload ${files.length} files` : "Post material"}
      </button>
    </form>
  );
}
