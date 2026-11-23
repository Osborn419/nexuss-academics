"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { GraduationCap, Menu, Bell, X, LogOut, UserRound, ShieldCheck } from "lucide-react";
import { site, siteNav } from "@/config/site";
import { initials } from "@/lib/format";

export interface HeaderUser {
  displayName: string;
  role: string;
}

export function SiteHeader({ user, unread }: { user: HeaderUser | null; unread: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const signOut = async () => {
    await fetch("/api/auth?action=logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 via-teal-400 to-sky-500 text-canvas shadow-lg shadow-emerald-500/20">
            <span className="text-[15px] font-black leading-none tracking-tighter">N</span>
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-semibold tracking-wide text-white">
              Nexus <span className="text-emerald-300">Academics</span>
            </span>
            <span className="block truncate text-[10px] uppercase tracking-[0.16em] text-slate-500">
              {site.cohort} · UG
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {siteNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-2.5 py-2 text-[13px] font-medium transition ${
                isActive(item.href) ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/dashboard" className="relative ml-1 rounded-lg px-2.5 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white" aria-label="Notifications and dashboard">
                <Bell className="h-5 w-5" />
                {unread > 0 ? <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-emerald-400 px-1 text-[9px] font-bold text-canvas">{unread > 9 ? "9+" : unread}</span> : null}
              </Link>
              {user.role === "admin" ? (
                <Link href="/admin" className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-200 transition hover:bg-amber-400/20">
                  <ShieldCheck className="h-4 w-4" /> Admin
                </Link>
              ) : null}
              <Link href="/profile" className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-white/8 text-xs font-bold text-emerald-300 ring-1 ring-white/15 hover:bg-white/15" aria-label="Your profile">
                {initials(user.displayName, 2)}
              </Link>
              <button type="button" onClick={() => void signOut()} className="ml-1 rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-slate-200" aria-label="Sign out" title="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="ml-1 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-300 transition hover:bg-white/5 hover:text-white">
                Sign in
              </Link>
              <Link href="/register" className="ml-1 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-400 to-sky-400 px-3 py-2 text-[13px] font-semibold text-canvas transition hover:brightness-110">
                Join free
              </Link>
            </>
          )}
        </nav>

        <button type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 lg:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-white/10 bg-canvas/95 px-4 py-3 lg:hidden">
          <ul className="flex flex-col gap-1">
            {siteNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)} className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive(item.href) ? "bg-white/10 text-white" : "text-slate-300"}`}>
                  <GraduationCap className="h-4 w-4 text-emerald-400/80" />
                  {item.label}
                </Link>
              </li>
            ))}
            {user ? (
              <>
                <li><Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300"><Bell className="h-4 w-4 text-emerald-400/80" /> Dashboard {unread > 0 ? `· ${unread} new` : ""}</Link></li>
                <li><Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300"><UserRound className="h-4 w-4 text-emerald-400/80" /> Profile &amp; settings</Link></li>
                {user.role === "admin" ? <li><Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-amber-200"><ShieldCheck className="h-4 w-4" /> Administrator</Link></li> : null}
                <li><button type="button" onClick={() => void signOut()} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-400"><LogOut className="h-4 w-4" /> Sign out</button></li>
              </>
            ) : (
              <>
                <li><Link href="/login" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300">Sign in</Link></li>
                <li><Link href="/register" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-emerald-300">Join free</Link></li>
              </>
            )}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
