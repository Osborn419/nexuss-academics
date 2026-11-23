"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flag, Loader2, Send, TriangleAlert } from "lucide-react";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/12 bg-canvas/70 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20";

export function NewThreadForm({ courses }: { courses: { id: number; code: string }[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/forum?kind=thread", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: courseId ? Number(courseId) : null, title, body }),
      });
      const data = (await response.json()) as { id?: number; error?: string };
      if (!response.ok) throw new Error(data.error || "Could not post.");
      router.push(`/forum/${data.id}`);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not post.");
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-4 py-2.5 text-sm font-semibold text-canvas hover:brightness-110">
        Start a discussion
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className={`${inputClass} sm:col-span-1`}>
          <option value="">General discussion</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>{course.code}</option>
          ))}
        </select>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. How do you balance ECON 101 diagrams?" className={`${inputClass} sm:col-span-2`} />
      </div>
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="Explain what you need help with…" className={inputClass} />
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-emerald-400/15 px-4 py-2 text-sm font-semibold text-emerald-200 ring-1 ring-emerald-400/30 hover:bg-emerald-400/25 disabled:opacity-50">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Post
        </button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-xl px-4 py-2 text-sm text-slate-400 hover:text-slate-200">Cancel</button>
      </div>
    </form>
  );
}

export function ReplyForm({ threadId }: { threadId: number }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/forum?kind=reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId, body }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not reply.");
      setBody("");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not reply.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="Write a helpful reply…" className={inputClass} />
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-emerald-400/15 px-4 py-2 text-sm font-semibold text-emerald-200 ring-1 ring-emerald-400/30 hover:bg-emerald-400/25 disabled:opacity-50">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Reply
      </button>
    </form>
  );
}

export function ReportButton({ threadId, replyId }: { threadId?: number; replyId?: number }) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const report = async () => {
    const reason = window.prompt("Why are you reporting this? (optional)") ?? "";
    setLoading(true);
    await fetch("/api/forum?kind=report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId, replyId, reason }),
    });
    setLoading(false);
    setDone(true);
  };

  if (done) return <span className="text-xs text-slate-500">Reported — the administrator will review it.</span>;
  return (
    <button type="button" disabled={loading} onClick={() => void report()} className="inline-flex items-center gap-1 text-xs text-slate-500 transition hover:text-rose-300" title="Report this to the administrator">
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Flag className="h-3.5 w-3.5" />} Report
    </button>
  );
}
