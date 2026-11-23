"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, LogIn, KeyRound, UserPlus, ShieldCheck, ArrowRight } from "lucide-react";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/12 bg-canvas/70 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20";

async function postAuth(action: string, body: Record<string, string>) {
  const response = await fetch(`/api/auth?action=${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json()) as { ok?: boolean; error?: string; redirect?: string };
  if (!response.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await postAuth("login", { email, password });
      router.push(data.redirect === "/admin" && next !== "/dashboard" ? next : (data.redirect ?? next));
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not sign in.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm">
        <span className="font-medium text-slate-300">Email</span>
        <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@st.ug.edu.gh" className={inputClass} />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-slate-300">Password</span>
        <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
      </label>
      {error ? <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-400/25">{error}</p> : null}
      <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-3 text-sm font-semibold text-canvas transition hover:brightness-110 disabled:opacity-60">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />} Sign in
      </button>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <Link href="/forgot-password" className="hover:text-emerald-300">Forgot password?</Link>
        <Link href="/register" className="hover:text-emerald-300">Need an account? Register</Link>
      </div>
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await postAuth("register", { name, email, password });
      router.push(data.redirect || "/dashboard");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not create your account.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm">
        <span className="font-medium text-slate-300">Full name</span>
        <input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Osborn Frimpong" className={inputClass} />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-slate-300">UG email or personal email</span>
        <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@st.ug.edu.gh" className={inputClass} />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-slate-300">Password</span>
        <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters, with letters and numbers" className={inputClass} />
      </label>
      <p className="text-xs text-slate-500">
        Your account only stores what you put here. Names are used for exams and the leaderboard; emails are never public.
      </p>
      {error ? <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-400/25">{error}</p> : null}
      <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-3 text-sm font-semibold text-canvas transition hover:brightness-110 disabled:opacity-60">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />} Create your account
      </button>
      <p className="text-center text-xs text-slate-500">
        Already registered? <Link href="/login" className="text-emerald-300 hover:text-emerald-200">Sign in</Link>
      </p>
    </form>
  );
}

export function SetupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await postAuth("setup", { name, email, password });
      router.push(data.redirect || "/admin");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not set up the administrator.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm">
        <span className="font-medium text-slate-300">Your full name</span>
        <input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Osborn Kobi Frimpong" className={inputClass} />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-slate-300">Administrator email</span>
        <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@st.ug.edu.gh" className={inputClass} />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-slate-300">Administrator password</span>
        <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters, with letters and numbers" className={inputClass} />
      </label>
      <p className="text-xs text-amber-200/80">
        This page works exactly once — after your administrator account is created it closes for good. Keep the password private.
      </p>
      {error ? <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-400/25">{error}</p> : null}
      <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-3 text-sm font-semibold text-canvas transition hover:brightness-110 disabled:opacity-60">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Create administrator account
      </button>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Both passwords must match.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/profile?action=reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not reset the password.");
      setDone(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not reset the password.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="space-y-4">
        <p className="rounded-lg bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 ring-1 ring-emerald-400/30">
          Your password has been changed. You can sign in now.
        </p>
        <button onClick={() => router.push("/login")} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-3 text-sm font-semibold text-canvas">
          Go to sign in <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm">
        <span className="font-medium text-slate-300">New password</span>
        <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters, with letters and numbers" className={inputClass} />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-slate-300">Confirm new password</span>
        <input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat it" className={inputClass} />
      </label>
      {error ? <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-400/25">{error}</p> : null}
      <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-3 text-sm font-semibold text-canvas transition hover:brightness-110 disabled:opacity-60">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Set new password
      </button>
    </form>
  );
}
