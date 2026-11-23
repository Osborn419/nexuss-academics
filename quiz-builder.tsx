"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Check,
  CircleDot,
  Loader2,
  Plus,
  Send,
  SquareCheckBig,
  Trash2,
  Type,
} from "lucide-react";
import type { CourseOption } from "@/components/admin/material-form";

type QuestionType = "single" | "multiple" | "boolean" | "short";

interface QuestionDraft {
  key: string;
  prompt: string;
  type: QuestionType;
  optionsText: string;
  correct: string;
  correctMulti: string[];
  correctBoolean: boolean;
  explanation: string;
  points: number;
}

const typeMeta: Record<QuestionType, { label: string; icon: typeof CircleDot }> = {
  single: { label: "Single answer", icon: CircleDot },
  multiple: { label: "Multiple answers", icon: SquareCheckBig },
  boolean: { label: "True / False", icon: Check },
  short: { label: "Short answer", icon: Type },
};

function newQuestion(): QuestionDraft {
  return {
    key: Math.random().toString(36).slice(2),
    prompt: "",
    type: "single",
    optionsText: "",
    correct: "",
    correctMulti: [],
    correctBoolean: true,
    explanation: "",
    points: 1,
  };
}

export function QuizBuilder({
  courses,
  defaultWeek,
  totalWeeks,
}: {
  courses: CourseOption[];
  defaultWeek: number;
  totalWeeks: number;
}) {
  const [week, setWeek] = useState(String(defaultWeek));
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const router = useRouter();
  const [courseId, setCourseId] = useState(String(courses[0]?.id ?? ""));
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(15);
  const [questions, setQuestions] = useState<QuestionDraft[]>([newQuestion()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-white/12 bg-canvas/70 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20";

  const update = (key: string, patch: Partial<QuestionDraft>) => {
    setQuestions((current) =>
      current.map((question) =>
        question.key === key ? { ...question, ...patch } : question,
      ),
    );
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const payloadQuestions = questions
      .filter((question) => question.prompt.trim().length > 0)
      .map((question) => {
        const options = question.optionsText
          .split("\n")
          .map((option) => option.trim())
          .filter(Boolean);
        let correct: string | string[] | boolean = question.correct;
        if (question.type === "multiple") correct = question.correctMulti;
        if (question.type === "boolean") correct = question.correctBoolean;
        if (question.type === "short") {
          correct = question.correct
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
        return {
          prompt: question.prompt.trim(),
          type: question.type,
          options,
          correct,
          explanation: question.explanation.trim(),
          points: question.points,
        };
      });

    try {
      const response = await fetch("/api/admin/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: Number(courseId),
          title: title.trim(),
          description: description.trim(),
          timeLimitMinutes: timeLimit,
          week: week ? Number(week) : null,
          mode,
          questions: payloadQuestions,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Could not create the test.");
      }
      setTitle("");
      setDescription("");
      setQuestions([newQuestion()]);
      setMessage("Test published.");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not create the test.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-slate-300">Test title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Mid-semester mock — Normalisation"
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-300">Course</span>
          <select
            value={courseId}
            onChange={(event) => setCourseId(event.target.value)}
            className={inputClass}
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-slate-300">Description</span>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What this paper covers"
            className={inputClass}
          />
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="block text-sm">
            <span className="font-medium text-slate-300">Mode</span>
            <select value={mode} onChange={(event) => setMode(event.target.value as "practice" | "exam")} className={inputClass}>
              <option value="practice">Practice quiz</option>
              <option value="exam">Formal examination</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-300">Minutes</span>
            <input
              type="number"
              min={1}
              max={180}
              value={timeLimit}
              onChange={(event) => setTimeLimit(Number(event.target.value))}
              className={inputClass}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-300">Week</span>
            <select
              value={week}
              onChange={(event) => setWeek(event.target.value)}
              className={inputClass}
            >
              <option value="">None</option>
              {Array.from({ length: totalWeeks + 3 }, (_, index) => index + 1).map((value) => (
                <option key={value} value={value}>
                  Week {value}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => {
          const options = question.optionsText
            .split("\n")
            .map((option) => option.trim())
            .filter(Boolean);

          return (
            <div
              key={question.key}
              className="rounded-2xl border border-white/10 bg-canvas/40 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400/90">
                  Question {index + 1}
                </p>
                <div className="flex items-center gap-2">
                  {questions.length > 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setQuestions((current) =>
                          current.filter((item) => item.key !== question.key),
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 px-2.5 py-1.5 text-xs text-rose-300 ring-1 ring-rose-400/25"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  ) : null}
                </div>
              </div>

              <label className="mt-3 block text-sm">
                <span className="font-medium text-slate-300">Question prompt</span>
                <textarea
                  value={question.prompt}
                  onChange={(event) =>
                    update(question.key, { prompt: event.target.value })
                  }
                  rows={2}
                  placeholder="What do you want to ask?"
                  className={inputClass}
                />
              </label>

              <div className="mt-4">
                <span className="text-sm font-medium text-slate-300">
                  Answer type
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(Object.keys(typeMeta) as QuestionType[]).map((type) => {
                    const Icon = typeMeta[type].icon;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          update(question.key, {
                            type,
                            correct:
                              type === "single"
                                ? ""
                                : type === "short"
                                  ? ""
                                  : question.correct,
                            correctMulti: [],
                          })
                        }
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ring-1 transition ${
                          question.type === type
                            ? "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30"
                            : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {typeMeta[type].label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {question.type === "single" || question.type === "multiple" ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="font-medium text-slate-300">
                      Options{" "}
                      <span className="text-slate-500">(one per line)</span>
                    </span>
                    <textarea
                      value={question.optionsText}
                      onChange={(event) =>
                        update(question.key, { optionsText: event.target.value })
                      }
                      rows={5}
                      placeholder={"First option\nSecond option\nThird option"}
                      className={`${inputClass} font-mono text-xs`}
                    />
                  </label>

                  <div className="text-sm">
                    <span className="font-medium text-slate-300">
                      Correct answer
                    </span>
                    <div className="mt-1.5 space-y-1.5">
                      {options.length === 0 ? (
                        <p className="text-xs text-slate-500">
                          Add options on the left first.
                        </p>
                      ) : (
                        options.map((option) => {
                          const checked =
                            question.type === "single"
                              ? question.correct === option
                              : question.correctMulti.includes(option);
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                question.type === "single"
                                  ? update(question.key, { correct: option })
                                  : update(question.key, {
                                      correctMulti: checked
                                        ? question.correctMulti.filter(
                                            (item) => item !== option,
                                          )
                                        : [...question.correctMulti, option],
                                    })
                              }
                              className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition ${
                                checked
                                  ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-200"
                                  : "border-white/10 bg-canvas/50 text-slate-300 hover:border-white/25"
                              }`}
                            >
                              <span
                                className={`grid h-4 w-4 shrink-0 place-items-center border ${
                                  question.type === "single"
                                    ? "rounded-full"
                                    : "rounded"
                                } ${
                                  checked
                                    ? "border-emerald-400 bg-emerald-400"
                                    : "border-white/25"
                                }`}
                              >
                                {checked ? (
                                  <Check className="h-3 w-3 text-canvas" />
                                ) : null}
                              </span>
                              <span className="truncate">{option}</span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {question.type === "boolean" ? (
                <div className="mt-4 flex gap-2">
                  {[true, false].map((value) => (
                    <button
                      key={String(value)}
                      type="button"
                      onClick={() =>
                        update(question.key, { correctBoolean: value })
                      }
                      className={`rounded-lg px-4 py-2 text-sm font-medium ring-1 transition ${
                        question.correctBoolean === value
                          ? "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30"
                          : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10"
                      }`}
                    >
                      {value ? "True" : "False"}
                    </button>
                  ))}
                </div>
              ) : null}

              {question.type === "short" ? (
                <label className="mt-4 block text-sm">
                  <span className="font-medium text-slate-300">
                    Accepted answers{" "}
                    <span className="text-slate-500">(comma separated)</span>
                  </span>
                  <input
                    value={question.correct}
                    onChange={(event) =>
                      update(question.key, { correct: event.target.value })
                    }
                    placeholder="relational algebra, relational algebra"
                    className={inputClass}
                  />
                </label>
              ) : null}

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <label className="block text-sm sm:col-span-2">
                  <span className="font-medium text-slate-300">
                    Explanation{" "}
                    <span className="text-slate-500">(shown after grading)</span>
                  </span>
                  <input
                    value={question.explanation}
                    onChange={(event) =>
                      update(question.key, { explanation: event.target.value })
                    }
                    placeholder="Why the answer is correct"
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-slate-300">Points</span>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={question.points}
                    onChange={(event) =>
                      update(question.key, { points: Number(event.target.value) })
                    }
                    className={inputClass}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setQuestions((current) => [...current, newQuestion()])}
        className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
      >
        <Plus className="h-4 w-4" /> Add another question
      </button>

      {error ? (
        <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-400/25">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 ring-1 ring-emerald-400/25">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-2.5 text-sm font-semibold text-canvas transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Publish test
      </button>
    </form>
  );
}
