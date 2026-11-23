"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react";

export interface FlashcardView {
  id: number;
  front: string;
  back: string;
}

export function FlashcardDeck({ cards: original }: { cards: FlashcardView[] }) {
  const [cards, setCards] = useState(original);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setCards(original);
    setIndex(0);
    setFlipped(false);
  }, [original]);

  const total = cards.length;
  const card = cards[index];

  const go = useCallback((delta: number) => {
    setFlipped(false);
    setIndex((value) => {
      const next = value + delta;
      if (next < 0) return total - 1;
      if (next >= total) return 0;
      return next;
    });
  }, [total]);

  const shuffle = () => {
    setFlipped(false);
    setIndex(0);
    setCards((current) => {
      const copy = [...current];
      for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    });
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === " ") {
        event.preventDefault();
        setFlipped((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (total === 0) {
    return <p className="rounded-2xl border border-dashed border-white/12 p-8 text-center text-sm text-slate-500">No flashcards for this course yet.</p>;
  }

  return (
    <div>
      <button type="button" onClick={() => setFlipped((value) => !value)} aria-pressed={flipped} className="relative block w-full outline-none">
        <div className="grid min-h-56 place-items-center rounded-2xl border border-white/15 bg-gradient-to-br from-emerald-500/10 to-sky-500/10 px-6 py-10 text-center transition hover:border-emerald-400/40 sm:min-h-64">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
            {flipped ? "Answer" : "Question"} · {index + 1} of {total}
          </p>
          <p className="mt-4 max-w-2xl text-xl font-medium leading-snug text-white">
            {flipped ? card.back : card.front}
          </p>
          <p className="mt-6 text-[11px] text-slate-500">Tap the card (or press Space) to flip</p>
        </div>
      </button>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button type="button" onClick={() => go(-1)} className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm text-slate-300 ring-1 ring-white/10 hover:bg-white/10">
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>
        <div className="flex items-center gap-2">
          <button type="button" onClick={shuffle} className="rounded-xl bg-white/5 p-2.5 text-slate-300 ring-1 ring-white/10 hover:bg-white/10" title="Shuffle deck" aria-label="Shuffle deck">
            <Shuffle className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => { setIndex(0); setFlipped(false); }} className="rounded-xl bg-white/5 p-2.5 text-slate-300 ring-1 ring-white/10 hover:bg-white/10" title="Restart" aria-label="Restart">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        <button type="button" onClick={() => go(1)} className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm text-slate-300 ring-1 ring-white/10 hover:bg-white/10">
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
