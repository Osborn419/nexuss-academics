"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";

export function DeleteButton({
  endpoint,
  label = "Delete",
  confirmMessage = "Delete this item permanently?",
}: {
  endpoint: string;
  label?: string;
  confirmMessage?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const remove = async () => {
    if (!window.confirm(confirmMessage)) return;
    setLoading(true);
    try {
      await fetch(endpoint, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void remove()}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-300 ring-1 ring-rose-400/25 transition hover:bg-rose-500/20 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
      {label}
    </button>
  );
}
