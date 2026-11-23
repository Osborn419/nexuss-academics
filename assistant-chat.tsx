"use client";

import { useState } from "react";
import { AlertTriangle, Bot, Loader2, SendHorizonal } from "lucide-react";

interface Message {
  role: "you" | "assistant";
  text: string;
  note?: string;
}

const suggestions = [
  "Explain the difference between a rule and a fallacy in UGRC 150",
  "Summarise normalisation to 3NF for DCIT 101 revision",
  "Give me 5 practice questions on demand and supply",
  "Explain Big-O notation with simple examples",
];

export function AssistantChat({ configured }: { configured: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;
    setMessages((current) => [...current, { role: "you", text: trimmed }]);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = (await response.json()) as { answer?: string; message?: string; grounded?: boolean; error?: string };
      if (response.ok && data.answer) {
        setMessages((current) => [
          ...current,
          { role: "assistant", text: data.answer!, note: data.grounded ? "Based on the course materials" : "General knowledge" },
        ]);
      } else {
        setMessages((current) => [
          ...current,
          { role: "assistant", text: data.message || data.error || "Something went wrong.", note: "error" },
        ]);
      }
    } catch {
      setMessages((current) => [...current, { role: "assistant", text: "Could not reach the assistant. Try again.", note: "error" }]);
    } finally {
      setLoading(false);
    }
  };

  if (!configured) {
    return (
      <div className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-6 text-center sm:p-10">
        <AlertTriangle className="mx-auto h-8 w-8 text-amber-300" />
        <h2 className="mt-4 text-lg font-semibold text-white">The assistant is not switched on yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
          The administrator needs to set <code>OPENAI_API_KEY</code> (or <code>AI_API_KEY</code>) in the server
          environment and restart. Until then this page is deliberately inert — nothing is simulated or faked.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[70vh] min-h-96 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        {messages.length === 0 ? (
          <div className="mx-auto max-w-lg pt-8 text-center">
            <span className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 text-canvas">
              <Bot className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-white">Ask a question about any course</h2>
            <p className="mt-1 text-sm text-slate-400">Answers are grounded in the materials the administrator uploads where possible.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {suggestions.map((suggestion) => (
                <button key={suggestion} type="button" onClick={() => void ask(suggestion)} className="rounded-full bg-white/5 px-3.5 py-2 text-xs text-slate-300 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white">
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "you" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
                message.role === "you"
                  ? "bg-gradient-to-br from-emerald-500/90 to-sky-500/90 text-canvas"
                  : message.note === "error"
                    ? "bg-rose-500/10 text-rose-200 ring-1 ring-rose-400/25"
                    : "bg-white/[0.05] text-slate-200 ring-1 ring-white/10"
              }`}>
                <p className="whitespace-pre-wrap">{message.text}</p>
                {message.role === "assistant" && message.note && message.note !== "error" ? (
                  <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-500">{message.note}</p>
                ) : null}
              </div>
            </div>
          ))
        )}
        {loading ? <p className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Thinking…</p> : null}
      </div>

      <form onSubmit={(event) => { event.preventDefault(); void ask(input); }} className="flex items-center gap-2 border-t border-white/10 p-3 sm:p-4">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about any of the seven courses…"
          className="w-full rounded-xl border border-white/12 bg-canvas/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/60"
        />
        <button type="submit" disabled={loading || input.trim().length < 3} aria-label="Send" className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-sky-400 text-canvas transition hover:brightness-110 disabled:opacity-40">
          <SendHorizonal className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
