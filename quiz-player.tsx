"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Flag,
  Loader2,
  Send,
  XCircle,
} from "lucide-react";

export interface QuizQuestionView {
  id: number;
  prompt: string;
  type: "single" | "multiple" | "boolean" | "short";
  options: string[];
  points: number;
}

export interface QuizPlayerProps {
  quizId: number;
  title: string;
  timeLimitMinutes: number;
  questions: QuizQuestionView[];
  courseCode: string;
  courseTitle: string;
  studentName: string;
  modeLabel?: string;
}

type AnswerValue = string | string[] | boolean | null;

function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(Math.max(totalSeconds, 0) / 60);
  const seconds = Math.max(totalSeconds, 0) % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function QuizPlayer({
  quizId,
  title,
  timeLimitMinutes,
  questions,
  courseCode,
  courseTitle,
  studentName,
  modeLabel = "Test",
}: QuizPlayerProps) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [current, setCurrent] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(timeLimitMinutes * 60);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const startedAt = useRef<number>(Date.now());
  const autoSubmitted = useRef(false);

  const answeredCount = useMemo(
    () =>
      Object.values(answers).filter((value) => {
        if (value === null || value === undefined) return false;
        if (Array.isArray(value)) return value.length > 0;
        return String(value).trim().length > 0;
      }).length,
    [answers],
  );

  const submit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId,
          studentName,
          track: "",
          answers,
          durationSeconds: Math.round((Date.now() - startedAt.current) / 1000),
        }),
      });
      const data = (await response.json()) as { attemptId?: number; error?: string };
      if (!response.ok || !data.attemptId) {
        throw new Error(data.error || "Could not submit your answers.");
      }
      router.push(`/quizzes/${quizId}/result/${data.attemptId}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not submit your answers.",
      );
      setSubmitting(false);
    }
  }, [answers, quizId, router, studentName, submitting]);

  useEffect(() => {
    if (!started) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          if (!autoSubmitted.current) {
            autoSubmitted.current = true;
            void submit();
          }
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [started, submit]);

  if (!started) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-white">Ready to begin the {modeLabel.toLowerCase()}?</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {questions.length} questions · {timeLimitMinutes} minute limit · scored
          automatically. Your answers are saved as soon as you submit.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-canvas/50 px-4 py-3 text-sm text-slate-400">
          Sitting as <span className="font-semibold text-white">{studentName}</span>. Your result is saved to your account and shown on the leaderboard.
        </div>

        {error ? (
          <p className="mt-4 flex items-center gap-2 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-400/25">
            <AlertTriangle className="h-4 w-4" /> {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => {
            startedAt.current = Date.now();
            setSecondsLeft(timeLimitMinutes * 60);
            setStarted(true);
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-3 text-sm font-semibold text-canvas transition hover:brightness-110"
        >
          Start test
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const question = questions[current];
  const answer = answers[String(question.id)];
  const lowTime = secondsLeft <= 60;

  const setAnswer = (value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [String(question.id)]: value }));
  };

  const toggleMulti = (option: string) => {
    const currentValues = Array.isArray(answer) ? answer : [];
    const next = currentValues.includes(option)
      ? currentValues.filter((item) => item !== option)
      : [...currentValues, option];
    setAnswer(next);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{title}</p>
          <p className="text-xs text-slate-400">
            {courseCode} · {courseTitle}
          </p>
        </div>
        <div
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-sm font-semibold ring-1 ${
            lowTime
              ? "bg-rose-500/15 text-rose-300 ring-rose-400/30"
              : "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25"
          }`}
        >
          <Clock className="h-4 w-4" />
          {formatClock(secondsLeft)}
        </div>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all"
          style={{
            width: `${(answeredCount / Math.max(questions.length, 1)) * 100}%`,
          }}
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-400/90">
              Question {current + 1} of {questions.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {question.points} point{question.points === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <h3 className="mt-4 text-lg font-semibold leading-relaxed text-white">
          {question.prompt}
        </h3>

        <div className="mt-5 space-y-2.5">
          {question.type === "short" ? (
            <textarea
              value={typeof answer === "string" ? answer : ""}
              onChange={(event) => setAnswer(event.target.value)}
              rows={4}
              placeholder="Type your answer…"
              className="w-full rounded-xl border border-white/12 bg-canvas/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            />
          ) : question.type === "boolean" ? (
            ["True", "False"].map((option) => {
              const value = option === "True";
              const selected = answer === value;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAnswer(value)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                    selected
                      ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-200"
                      : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:bg-white/[0.06]"
                  }`}
                >
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full border ${
                      selected
                        ? "border-emerald-400 bg-emerald-400"
                        : "border-white/25"
                    }`}
                  >
                    {selected ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-canvas" />
                    ) : null}
                  </span>
                  {option}
                </button>
              );
            })
          ) : (
            question.options.map((option) => {
              const selected =
                question.type === "multiple"
                  ? Array.isArray(answer) && answer.includes(option)
                  : answer === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    question.type === "multiple"
                      ? toggleMulti(option)
                      : setAnswer(option)
                  }
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                    selected
                      ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-200"
                      : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:bg-white/[0.06]"
                  }`}
                >
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center border ${
                      question.type === "multiple" ? "rounded-md" : "rounded-full"
                    } ${
                      selected
                        ? "border-emerald-400 bg-emerald-400"
                        : "border-white/25"
                    }`}
                  >
                    {selected ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-canvas" />
                    ) : null}
                  </span>
                  <span>{option}</span>
                </button>
              );
            })
          )}
        </div>

        {question.type === "multiple" ? (
          <p className="mt-3 text-xs text-slate-500">
            Select every correct option.
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="flex items-center gap-2 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-400/25">
          <AlertTriangle className="h-4 w-4" /> {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setCurrent((value) => Math.max(0, value - 1))}
          disabled={current === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 ring-1 ring-white/10 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </button>

        <p className="flex items-center gap-2 text-xs text-slate-500">
          <Flag className="h-3.5 w-3.5" />
          {answeredCount} of {questions.length} answered
        </p>

        {current < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrent((value) => Math.min(questions.length - 1, value + 1))}
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 ring-1 ring-white/10 transition hover:bg-white/10"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void submit()}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-2.5 text-sm font-semibold text-canvas transition hover:brightness-110 disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Submit answers
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {questions.map((item, itemIndex) => {
          const value = answers[String(item.id)];
          const done =
            Array.isArray(value)
              ? value.length > 0
              : value !== null && value !== undefined && String(value) !== "";
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrent(itemIndex)}
              title={`Question ${itemIndex + 1}`}
              className={`h-8 w-8 rounded-lg text-xs font-semibold transition ${
                itemIndex === current
                  ? "bg-emerald-400 text-canvas"
                  : done
                    ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/30"
                    : "bg-white/5 text-slate-400 ring-1 ring-white/10 hover:bg-white/10"
              }`}
            >
              {itemIndex + 1}
            </button>
          );
        })}
      </div>

      {submitting ? (
        <p className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Grading your paper…
        </p>
      ) : null}

      <p className="flex items-center justify-center gap-2 text-xs text-slate-600">
        <XCircle className="h-3.5 w-3.5" />
        Unanswered questions score zero.
      </p>
    </div>
  );
}
