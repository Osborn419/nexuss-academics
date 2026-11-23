"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

const accents = ["emerald", "sky", "violet", "amber", "rose", "teal"];

export function CourseForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [track, setTrack] = useState("core");
  const [level, setLevel] = useState(100);
  const [credits, setCredits] = useState(3);
  const [accent, setAccent] = useState("emerald");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-white/12 bg-canvas/70 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20";

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          title,
          summary,
          description,
          track,
          level,
          credits,
          accent,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Could not save the course.");
      }
      setCode("");
      setTitle("");
      setSummary("");
      setDescription("");
      setMessage("Course saved.");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not save the course.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="font-medium text-slate-300">Course code</span>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="DCIT 104"
            className={inputClass}
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-slate-300">Course title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Programming Fundamentals"
            className={inputClass}
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-slate-300">Summary</span>
        <input
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          placeholder="One line shown on the course card"
          className={inputClass}
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-slate-300">Full description</span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          placeholder="What the course covers, week by week"
          className={inputClass}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-4">
        <label className="block text-sm">
          <span className="font-medium text-slate-300">Track</span>
          <select
            value={track}
            onChange={(event) => setTrack(event.target.value)}
            className={inputClass}
          >
            <option value="core">Core (everyone)</option>
            <option value="elective">Elective (UGRC)</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-300">Level</span>
          <input
            type="number"
            min={100}
            max={900}
            step={100}
            value={level}
            onChange={(event) => setLevel(Number(event.target.value))}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-300">Credits</span>
          <input
            type="number"
            min={1}
            max={12}
            value={credits}
            onChange={(event) => setCredits(Number(event.target.value))}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-300">Accent</span>
          <select
            value={accent}
            onChange={(event) => setAccent(event.target.value)}
            className={inputClass}
          >
            {accents.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-400/25">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 ring-1 ring-emerald-400/25">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-2.5 text-sm font-semibold text-canvas transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        Add course
      </button>
    </form>
  );
}
