"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2, Plus } from "lucide-react";

export function EnrolButton({ courseId, enrolled }: { courseId: number; enrolled: boolean }) {
  const router = useRouter();
  const [isEnrolled, setIsEnrolled] = useState(enrolled);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/me?action=enrol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = (await response.json()) as { enrolled?: boolean; error?: string };
      if (!response.ok) throw new Error(data.error || "Could not update enrolment.");
      setIsEnrolled(Boolean(data.enrolled));
      router.refresh();
    } catch {
      // leave state unchanged; the UI stays honest
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
        isEnrolled
          ? "bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-400/40 hover:bg-emerald-400/25"
          : "bg-gradient-to-r from-emerald-400 to-sky-400 text-canvas hover:brightness-110"
      } disabled:opacity-60`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isEnrolled ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      {isEnrolled ? "Enrolled" : "Enrol in this course"}
    </button>
  );
}
