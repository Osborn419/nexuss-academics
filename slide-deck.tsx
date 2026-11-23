"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Presentation } from "lucide-react";
import { renderMarkdown } from "@/lib/markdown";

export function SlideDeck({
  slides,
  title,
}: {
  slides: string[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const current = useMemo(() => slides[index] ?? "", [slides, index]);

  const go = useCallback(
    (delta: number) => {
      setIndex((value) => {
        const next = value + delta;
        if (next < 0) return slides.length - 1;
        if (next >= slides.length) return 0;
        return next;
      });
    },
    [slides.length],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  useEffect(() => {
    const onFullChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullChange);
    return () => document.removeEventListener("fullscreenchange", onFullChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      setFullscreen((value) => !value);
    }
  };

  if (slides.length === 0) {
    return (
      <p className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-slate-400">
        This deck is empty.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Presentation className="h-4 w-4 text-amber-300" />
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-white/5 px-2 py-1 font-mono text-xs text-slate-400">
            {index + 1} / {slides.length}
          </span>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
            className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-slate-300 transition hover:bg-white/10"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative min-h-[22rem] px-6 py-8 sm:px-10 sm:py-10">
        <div
          className="note-body animate-fade-up"
          key={index}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(current) }}
        />
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-white/10 bg-white/[0.02] px-4 py-3">
        <button
          type="button"
          onClick={() => go(-1)}
          className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 ring-1 ring-white/10 transition hover:bg-white/10"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>

        <div className="hidden flex-1 items-center justify-center gap-1.5 sm:flex">
          {slides.map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              onClick={() => setIndex(dotIndex)}
              aria-label={`Go to slide ${dotIndex + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                dotIndex === index
                  ? "w-6 bg-emerald-400"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-400/15 px-3 py-2 text-xs font-medium text-emerald-200 ring-1 ring-emerald-400/30 transition hover:bg-emerald-400/25"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
