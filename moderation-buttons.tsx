"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Trash2, Check } from "lucide-react";

export function DeleteModerationButton({ kind, id, label, confirmMessage = "Delete permanently?" }: { kind: string; id: number; label: string; confirmMessage?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        if (!window.confirm(confirmMessage)) return;
        setLoading(true);
        await fetch(`/api/forum?kind=${kind}&id=${id}`, { method: "DELETE" });
        router.refresh();
        setLoading(false);
      }}
      className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-300 ring-1 ring-rose-400/25 transition hover:bg-rose-500/20 disabled:opacity-50"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} {label}
    </button>
  );
}

export function DismissReportButton({ id }: { id: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch(`/api/forum?kind=report&id=${id}`, { method: "DELETE" });
        router.refresh();
        setLoading(false);
      }}
      className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-white/10 transition hover:bg-white/10 disabled:opacity-50"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Dismiss
    </button>
  );
}
