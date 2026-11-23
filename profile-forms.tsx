"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/12 bg-canvas/70 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20";

export function DisplayNameForm({ name }: { name: string }) {
  const router = useRouter();
  const [value, setValue] = useState(name);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/profile?action=profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: value }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not save.");
      setMessage("Saved.");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-3">
      <label className="block text-sm">
        <span className="font-medium text-slate-300">Display name</span>
        <input value={value} onChange={(e) => setValue(e.target.value)} className={inputClass} />
      </label>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {message ? <p className="flex items-center gap-1.5 text-sm text-emerald-300"><Check className="h-4 w-4" />{message}</p> : null}
      <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/15 hover:bg-white/15">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save name
      </button>
    </form>
  );
}

export function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/profile?action=change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not change the password.");
      setCurrent("");
      setNext("");
      setMessage("Password changed.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not change the password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-3">
      <label className="block text-sm">
        <span className="font-medium text-slate-300">Current password</span>
        <input type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className={inputClass} />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-slate-300">New password</span>
        <input type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className={inputClass} />
      </label>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {message ? <p className="flex items-center gap-1.5 text-sm text-emerald-300"><Check className="h-4 w-4" />{message}</p> : null}
      <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/15 hover:bg-white/15">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Change password
      </button>
    </form>
  );
}

export function MarkAllReadButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch("/api/me?action=notifications-read", { method: "POST" });
        router.refresh();
        setLoading(false);
      }}
      className="text-xs font-medium text-emerald-300 hover:text-emerald-200 disabled:opacity-50"
    >
      {loading ? "Marking…" : "Mark all as read"}
    </button>
  );
}
