"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, TriangleAlert } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30">
        <TriangleAlert className="h-7 w-7" />
      </span>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white">
        Something broke on our side
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
        The page could not be loaded. Try again — if it keeps happening, tell
        the creator and we will fix it.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-2.5 text-sm font-semibold text-canvas transition hover:brightness-110"
        >
          <RefreshCw className="h-4 w-4" /> Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
