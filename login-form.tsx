"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { KeyRound, Loader2, LogIn } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Could not sign in.");
      }
      router.push("/admin");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not sign in.",
      );
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
    >
      <label className="block text-sm">
        <span className="font-medium text-slate-300">Creator passcode</span>
        <input
          type="password"
          value={passcode}
          onChange={(event) => setPasscode(event.target.value)}
          placeholder="••••••••"
          className="mt-1.5 w-full rounded-xl border border-white/12 bg-canvas/70 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
        />
      </label>

      {error ? (
        <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-400/25">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-3 text-sm font-semibold text-canvas transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="h-4 w-4" />
        )}
        Unlock dashboard
      </button>

      <p className="flex items-start gap-2 text-xs text-slate-500">
        <KeyRound className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Only the creator and group admins have the passcode.
      </p>
    </form>
  );
}
