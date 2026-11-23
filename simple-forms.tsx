"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormEvent } from "react";
import { Check, Loader2, Plus, Send, Trash2, Link2, ShieldQuestion } from "lucide-react";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/12 bg-canvas/70 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20";

async function postContent(kind: string, body: Record<string, unknown>) {
  const response = await fetch(`/api/admin/content?kind=${kind}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json()) as { error?: string; id?: number };
  if (!response.ok) throw new Error(data.error || "Could not save.");
  return data;
}

export function DeleteContentButton({ kind, id, confirmMessage = "Delete this item?", endpoint }: { kind: string; id: number; confirmMessage?: string; endpoint?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        if (!window.confirm(confirmMessage)) return;
        setLoading(true);
        await fetch(endpoint ?? `/api/admin/content?kind=${kind}&id=${id}`, { method: "DELETE" });
        router.refresh();
        setLoading(false);
      }}
      className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-300 ring-1 ring-rose-400/25 hover:bg-rose-500/20 disabled:opacity-50"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Delete
    </button>
  );
}

export function AnnouncementForm({ courses }: { courses: { id: number; code: string }[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await postContent("announcement", { title, body, courseId: courseId || null });
      setTitle("");
      setBody("");
      setMessage("Announcement published and students notified.");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not publish.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title" className={`${inputClass} sm:col-span-2`} />
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className={inputClass}>
          <option value="">Everyone</option>
          {courses.map((course) => (<option key={course.id} value={course.id}>{course.code} only</option>))}
        </select>
      </div>
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="What do you want to tell the group?" className={inputClass} />
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {message ? <p className="flex items-center gap-1.5 text-sm text-emerald-300"><Check className="h-4 w-4" />{message}</p> : null}
      <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-4 py-2 text-sm font-semibold text-canvas disabled:opacity-60">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Publish
      </button>
    </form>
  );
}

export function AssignmentCreateForm({ courses }: { courses: { id: number; code: string }[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState(String(courses[0]?.id ?? ""));
  const [dueDate, setDueDate] = useState("");
  const [maxPoints, setMaxPoints] = useState(100);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/assignments?action=create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, courseId: Number(courseId), dueDate: dueDate || undefined, maxPoints }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not create.");
      setTitle("");
      setDescription("");
      setDueDate("");
      setMessage("Assignment created and students notified.");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not create.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="grid gap-3 sm:grid-cols-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Assignment title" className={`${inputClass} sm:col-span-2`} />
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className={inputClass}>
          {courses.map((course) => (<option key={course.id} value={course.id}>{course.code}</option>))}
        </select>
        <input type="number" min={1} max={1000} value={maxPoints} onChange={(e) => setMaxPoints(Number(e.target.value))} className={inputClass} aria-label="Max points" title="Max points" />
      </div>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Instructions, scope, marking scheme…" className={inputClass} />
      <label className="block text-sm">
        <span className="font-medium text-slate-300">Deadline (optional)</span>
        <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
      </label>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {message ? <p className="flex items-center gap-1.5 text-sm text-emerald-300"><Check className="h-4 w-4" />{message}</p> : null}
      <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-4 py-2 text-sm font-semibold text-canvas disabled:opacity-60">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create assignment
      </button>
    </form>
  );
}

export function SessionForm({ courses }: { courses: { id: number; code: string }[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sessionAt, setSessionAt] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await postContent("session", { title, description, sessionAt, meetingUrl, courseId: courseId || null });
      setTitle("");
      setDescription("");
      setSessionAt("");
      setMeetingUrl("");
      setMessage("Session scheduled and students notified.");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not schedule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. DCIT 101 past questions — group session" className={inputClass} />
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className={inputClass}>
          <option value="">General</option>
          {courses.map((course) => (<option key={course.id} value={course.id}>{course.code}</option>))}
        </select>
        <input type="datetime-local" value={sessionAt} onChange={(e) => setSessionAt(e.target.value)} className={inputClass} required />
        <input value={meetingUrl} onChange={(e) => setMeetingUrl(e.target.value)} placeholder="https://meet.google.com/…" className={inputClass} />
      </div>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="What will we cover?" className={inputClass} />
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {message ? <p className="flex items-center gap-1.5 text-sm text-emerald-300"><Check className="h-4 w-4" />{message}</p> : null}
      <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-4 py-2 text-sm font-semibold text-canvas disabled:opacity-60">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Schedule session
      </button>
    </form>
  );
}

export function PresentationForm({ courses }: { courses: { id: number; code: string }[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [presenter, setPresenter] = useState("");
  const [notes, setNotes] = useState("");
  const [courseId, setCourseId] = useState("");
  const [week, setWeek] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await postContent("presentation", {
        title,
        presenter,
        notes,
        courseId: courseId || null,
        week: week || null,
        sessionDate: sessionDate || undefined,
        materialId: materialId ? Number(materialId) : undefined,
      });
      setTitle("");
      setPresenter("");
      setNotes("");
      setMessage("Presentation added.");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not add.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. ECON 101 — Elasticity in 10 slides" className={inputClass} />
        <input value={presenter} onChange={(e) => setPresenter(e.target.value)} placeholder="Presented by…" className={inputClass} />
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className={inputClass}>
          <option value="">Not course-specific</option>
          {courses.map((course) => (<option key={course.id} value={course.id}>{course.code}</option>))}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <input type="number" min={1} max={30} value={week} onChange={(e) => setWeek(e.target.value)} placeholder="Week" className={inputClass} />
          <input type="datetime-local" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} className={inputClass} aria-label="Presentation date" />
        </div>
        <input value={materialId} onChange={(e) => setMaterialId(e.target.value)} placeholder="Optional: material ID for the slide deck" className={`${inputClass} sm:col-span-2`} />
      </div>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Briefing notes for the group" className={inputClass} />
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {message ? <p className="flex items-center gap-1.5 text-sm text-emerald-300"><Check className="h-4 w-4" />{message}</p> : null}
      <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-4 py-2 text-sm font-semibold text-canvas disabled:opacity-60">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add presentation
      </button>
    </form>
  );
}

export function FlashcardForm({ courses }: { courses: { id: number; code: string }[] }) {
  const router = useRouter();
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [courseId, setCourseId] = useState(String(courses[0]?.id ?? ""));
  const [week, setWeek] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await postContent("flashcard", { front, back, courseId: Number(courseId), week: week || null });
      setFront("");
      setBack("");
      setMessage("Card added.");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not add.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className={inputClass}>
          {courses.map((course) => (<option key={course.id} value={course.id}>{course.code}</option>))}
        </select>
        <input type="number" min={1} max={30} value={week} onChange={(e) => setWeek(e.target.value)} placeholder="Week (optional)" className={inputClass} />
      </div>
      <input value={front} onChange={(e) => setFront(e.target.value)} placeholder="Front — the question" className={inputClass} />
      <input value={back} onChange={(e) => setBack(e.target.value)} placeholder="Back — the answer" className={inputClass} />
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {message ? <p className="flex items-center gap-1.5 text-sm text-emerald-300"><Check className="h-4 w-4" />{message}</p> : null}
      <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-4 py-2 text-sm font-semibold text-canvas disabled:opacity-60">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add card
      </button>
    </form>
  );
}

export function StudentActions({ profileId, name }: { profileId: number; name: string }) {
  const router = useRouter();
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const resetLink = async () => {
    setLoading(true);
    setLink("");
    try {
      const response = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
      });
      const data = (await response.json()) as { path?: string; error?: string };
      if (response.ok && data.path) setLink(data.path);
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete ${name}'s account permanently? Their attempts will remain but be orphaned.`)) return;
    await fetch(`/api/admin/students?id=${profileId}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" disabled={loading} onClick={() => void resetLink()} className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400/10 px-2.5 py-1.5 text-xs font-medium text-amber-200 ring-1 ring-amber-400/25 hover:bg-amber-400/20 disabled:opacity-50">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldQuestion className="h-3.5 w-3.5" />} Reset link
        </button>
        <button type="button" onClick={() => void remove()} className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-300 ring-1 ring-rose-400/25 hover:bg-rose-500/20">
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>
      {link ? (
        <div className="flex items-center gap-2">
          <input readOnly value={`${typeof window !== "undefined" ? window.location.origin : ""}${link}`} className="w-full rounded-lg border border-white/12 bg-canvas/70 px-2 py-1.5 font-mono text-[10px] text-amber-200 outline-none" onFocus={(e) => e.currentTarget.select()} />
          <button type="button" aria-label="Copy reset link" onClick={() => { void navigator.clipboard?.writeText(`${window.location.origin}${link}`); setCopied(true); }} className="rounded-lg bg-white/5 p-1.5 text-slate-300 ring-1 ring-white/10 hover:bg-white/10">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Link2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      ) : null}
    </div>
  );
}
