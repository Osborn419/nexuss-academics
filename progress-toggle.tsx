"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Circle, Loader2 } from "lucide-react";

export function ProgressToggle({
  courseId,
  week,
  completed,
  label,
}: {
  courseId: number;
  week: number;
  completed: boolean;
  label?: string;
}) {
  const router = useRouter();
  const [done, setDone] = useState(completed);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/me?action=progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, week }),
      });
      if (response.status === 401) {
        router.push("/login");
        return;
      }
      const data = (await response.json()) as { completed?: boolean };
      if (response.ok) {
        setDone(Boolean(data.completed));
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      disabled={loading}
      aria-pressed={done}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium ring-1 transition ${
        done
          ? "bg-emerald-400/15 text-emerald-200 ring-emerald-400/40"
          : "bg-white/5 text-slate-400 ring-white/10 hover:bg-white/10 hover:text-slate-200"
      }`}
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : done ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
      {label ?? (done ? "Completed" : "Mark done")}
    </button>
  );
}
