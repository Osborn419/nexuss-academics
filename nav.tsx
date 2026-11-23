"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/materials", label: "Materials" },
  { href: "/admin/quizzes", label: "Exams" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/assignments", label: "Assignments" },
  { href: "/admin/announcements", label: "Announce" },
  { href: "/admin/sessions", label: "Sessions" },
  { href: "/admin/presentations", label: "Present" },
  { href: "/admin/flashcards", label: "Cards" },
  { href: "/admin/forum", label: "Forum" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    await fetch("/api/auth?action=logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {links.map((link) => {
        const active =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
              active
                ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/30"
                : "bg-white/5 text-slate-300 ring-1 ring-white/10 hover:bg-white/10"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => void logout()}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 ring-1 ring-white/10 transition hover:bg-white/10 disabled:opacity-50"
      >
        <LogOut className="h-3.5 w-3.5" /> Sign out
      </button>
    </nav>
  );
}
