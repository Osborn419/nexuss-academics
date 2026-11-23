"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Save } from "lucide-react";

export function FeedbackForm({ submissionId, initialGrade, initialFeedback, maxPoints }: { submissionId: number; initialGrade: number | null; initialFeedback: string | null; maxPoints: number }) {
  const router = useRouter();
  const [grade, setGrade] = useState(initialGrade !== null ? String(initialGrade) : "");
  const [feedback, setFeedback] = useState(initialFeedback ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/assignments?action=grade", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          grade: grade === "" ? null : Number(grade),
          feedback,
        }),
      });
      // PATCH without action param — tolerated
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not save feedback.");
      setMessage("Saved.");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not save feedback.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="mt-3 flex flex-wrap items-start gap-2">
      <label className="text-[10px] uppercase tracking-wide text-slate-500">
        Grade (/{maxPoints})
        <input type="number" min={0} max={maxPoints} value={grade} onChange={(e) => setGrade(e.target.value)} className="mt-1 block w-24 rounded-lg border border-white/12 bg-canvas/70 px-2 py-1.5 text-sm text-white outline-none focus:border-emerald-400/60" />
      </label>
      <label className="min-w-48 flex-1 text-[10px] uppercase tracking-wide text-slate-500">
        Feedback
        <textarea rows={2} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="What went well, what to fix…" className="mt-1 block w-full rounded-lg border border-white/12 bg-canvas/70 px-2 py-1.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/60" />
      </label>
      <button type="submit" disabled={saving} className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-emerald-400/15 px-3 py-2 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/30 hover:bg-emerald-400/25 disabled:opacity-50">
        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save
      </button>
      {message ? <span className="mt-5 flex items-center gap-1 text-xs text-emerald-300"><Check className="h-3.5 w-3.5" />{message}</span> : null}
      {error ? <span className="mt-5 text-xs text-rose-300">{error}</span> : null}
    </form>
  );
}
