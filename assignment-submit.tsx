"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Loader2, Upload } from "lucide-react";
import { formatBytes } from "@/lib/format";

export function AssignmentSubmitForm({ assignmentId, submitted }: { assignmentId: number; submitted: boolean }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError("Choose a file first.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    const form = new FormData();
    form.set("assignmentId", String(assignmentId));
    form.set("file", file);
    form.set("note", note);
    try {
      const response = await fetch("/api/assignments?action=submit", { method: "POST", body: form });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not submit.");
      setMessage(submitted ? "Submission replaced with the new file." : "Submitted. Good luck!");
      setFile(null);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not submit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-canvas/40 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {submitted ? "Replace your submission" : "Submit your work"}
      </p>
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-emerald-400/30 bg-canvas/50 px-3 py-3 text-xs text-slate-400">
        <FileUp className="h-4 w-4 shrink-0 text-emerald-400" />
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="w-full file:mr-2 file:rounded file:border-0 file:bg-white/10 file:px-2 file:py-1 file:text-[11px] file:text-slate-200" />
      </label>
      {file ? <p className="text-xs text-slate-500">{file.name} · {formatBytes(file.size)}</p> : null}
      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note to the marker (e.g. which questions you attempted)" className="w-full rounded-xl border border-white/12 bg-canvas/70 px-3 py-2 text-xs text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/60" />
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
      {message ? <p className="text-xs text-emerald-300">{message}</p> : null}
      <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-emerald-400/15 px-4 py-2 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/30 hover:bg-emerald-400/25 disabled:opacity-50">
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} {submitted ? "Replace file" : "Submit"}
      </button>
    </form>
  );
}
