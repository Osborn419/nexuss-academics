"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Loader2 } from "lucide-react";

export function BookmarkButton({
  materialId,
  bookmarked: initial,
  compact = false,
}: {
  materialId: number;
  bookmarked?: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(Boolean(initial));
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => setBookmarked(Boolean(initial)), [initial]);

  const toggle = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/me?action=bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materialId }),
      });
      if (response.status === 401) {
        router.push(`/login?next=${encodeURIComponent(`/materials/${materialId}`)}`);
        return;
      }
      const data = (await response.json()) as { bookmarked?: boolean };
      if (response.ok) setBookmarked(Boolean(data.bookmarked));
    } finally {
      setLoading(false);
      setHidden(false);
    }
  };

  if (hidden) return null;

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      disabled={loading}
      aria-pressed={bookmarked}
      title={bookmarked ? "Remove from saved resources" : "Save to your dashboard"}
      className={`inline-flex items-center gap-2 rounded-xl text-sm font-semibold ring-1 transition ${
        compact ? "p-2" : "px-4 py-2.5"
      } ${
        bookmarked
          ? "bg-amber-400/15 text-amber-200 ring-amber-400/40"
          : "bg-white/5 text-slate-200 ring-white/12 hover:bg-white/10"
      }`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-amber-400 text-amber-400" : ""}`} />}
      {compact ? null : bookmarked ? "Saved" : "Save"}
    </button>
  );
}
