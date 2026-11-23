import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { announcements, studySessions, presentations, flashcards, courses } from "@/db/schema";
import { requireApiAdmin } from "@/lib/admin-guard";
import { notifyStudents } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function courseCodeCheck(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function POST(request: Request) {
  const kind = new URL(request.url).searchParams.get("kind") || "";
  const { profile, response } = await requireApiAdmin();
  if (response) return response;

  let payload: Record<string, unknown> = {};
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (kind === "announcement") {
    const title = String(payload.title ?? "").trim().slice(0, 200);
    const body = String(payload.body ?? "").trim().slice(0, 4000);
    const courseId = courseCodeCheck(payload.courseId);
    if (!title || !body) return NextResponse.json({ error: "Announcement needs a title and a body." }, { status: 400 });
    const [created] = await db
      .insert(announcements)
      .values({ title, body, courseId })
      .returning({ id: announcements.id });
    await notifyStudents({
      title: `Announcement: ${title}`,
      body: body.slice(0, 240),
      link: "/announcements",
      courseId,
    });
    return NextResponse.json({ ok: true, id: created.id });
  }

  if (kind === "session") {
    const title = String(payload.title ?? "").trim().slice(0, 200);
    const description = String(payload.description ?? "").trim().slice(0, 2000);
    const sessionAt = new Date(String(payload.sessionAt ?? ""));
    const meetingUrl = String(payload.meetingUrl ?? "").trim().slice(0, 500);
    const courseId = courseCodeCheck(payload.courseId);
    if (!title || Number.isNaN(sessionAt.getTime())) {
      return NextResponse.json({ error: "Give the session a title and a valid date/time." }, { status: 400 });
    }
    if (meetingUrl && !/^https?:\/\//i.test(meetingUrl)) {
      return NextResponse.json({ error: "Meeting links must start with http(s)://" }, { status: 400 });
    }
    const [created] = await db
      .insert(studySessions)
      .values({ title, description, sessionAt, meetingUrl, courseId })
      .returning({ id: studySessions.id });
    await notifyStudents({
      title: `Study session: ${title}`,
      body: `${sessionAt.toUTCString().slice(5, 22)}${meetingUrl ? ` — ${meetingUrl}` : ""}`,
      link: "/calendar",
      courseId,
    });
    return NextResponse.json({ ok: true, id: created.id });
  }

  if (kind === "presentation") {
    const title = String(payload.title ?? "").trim().slice(0, 200);
    const presenter = String(payload.presenter ?? "").trim().slice(0, 120);
    const notes = String(payload.notes ?? "").trim().slice(0, 2000);
    const courseId = courseCodeCheck(payload.courseId);
    const week = payload.week ? Number(payload.week) : null;
    const sessionDate = payload.sessionDate ? new Date(String(payload.sessionDate)) : null;
    const materialId = payload.materialId ? Number(payload.materialId) : null;
    if (!title) return NextResponse.json({ error: "Give the presentation a title." }, { status: 400 });
    const [created] = await db
      .insert(presentations)
      .values({
        title,
        presenter,
        notes,
        courseId,
        week: Number.isFinite(Number(week)) ? Number(week) : null,
        sessionDate: sessionDate && !Number.isNaN(sessionDate.getTime()) ? sessionDate : null,
        materialId: Number.isFinite(Number(materialId)) ? Number(materialId) : null,
      })
      .returning({ id: presentations.id });
    return NextResponse.json({ ok: true, id: created.id });
  }

  if (kind === "flashcard") {
    const courseId = courseCodeCheck(payload.courseId);
    const front = String(payload.front ?? "").trim().slice(0, 1000);
    const back = String(payload.back ?? "").trim().slice(0, 1000);
    const week = payload.week ? Number(payload.week) : null;
    if (!courseId || !front || !back) {
      return NextResponse.json({ error: "Cards need a course, a front and a back." }, { status: 400 });
    }
    const [created] = await db
      .insert(flashcards)
      .values({ courseId, front, back, week: Number.isFinite(Number(week)) ? Number(week) : null })
      .returning({ id: flashcards.id });
    return NextResponse.json({ ok: true, id: created.id });
  }

  if (kind === "course-order") {
    const courseId = courseCodeCheck(payload.courseId);
    const accent = String(payload.accent ?? "");
    if (!courseId) return NextResponse.json({ error: "Missing course." }, { status: 400 });
    if (accent) await db.update(courses).set({ accent: accent.slice(0, 20) }).where(eq(courses.id, courseId));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown kind." }, { status: 400 });
}

export async function DELETE(request: Request) {
  const kind = new URL(request.url).searchParams.get("kind") || "";
  const id = Number(new URL(request.url).searchParams.get("id"));
  const { response } = await requireApiAdmin();
  if (response) return response;
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  if (kind === "announcement") await db.delete(announcements).where(eq(announcements.id, id));
  else if (kind === "session") await db.delete(studySessions).where(eq(studySessions.id, id));
  else if (kind === "presentation") await db.delete(presentations).where(eq(presentations.id, id));
  else if (kind === "flashcard") await db.delete(flashcards).where(eq(flashcards.id, id));
  else return NextResponse.json({ error: "Unknown kind." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
