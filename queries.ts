import { and, asc, count, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  announcements,
  assignments,
  assignmentSubmissions,
  attempts,
  bookmarks,
  courses,
  courseProgress,
  enrolments,
  files,
  flashcards,
  forumReplies,
  forumReports,
  forumThreads,
  materials,
  notifications,
  profiles,
  questions,
  quizzes,
  settings,
  studySessions,
  presentations,
} from "@/db/schema";
import { DEFAULT_SEMESTER, type SemesterConfig } from "@/lib/semester";

/* ------------------------------------------------------------------ courses */

export async function getCourses() {
  return db.select().from(courses).orderBy(asc(courses.position), asc(courses.id));
}

export function normalizeCourseCode(input: string): string {
  let value = String(input ?? "").trim();
  try {
    value = decodeURIComponent(value);
  } catch {
    // not percent-encoded
  }
  return value.replace(/[-_+]+/g, " ").replace(/\s+/g, " ").trim().toUpperCase();
}

export async function getCourseByCode(code: string) {
  const normalized = normalizeCourseCode(code);
  const exact = await db.select().from(courses).where(eq(courses.code, normalized)).limit(1);
  if (exact[0]) return exact[0];
  const compact = normalized.replace(/\s+/g, "");
  if (!compact) return null;
  const loose = await db
    .select()
    .from(courses)
    .where(sql`upper(replace(${courses.code}, ' ', '')) = ${compact}`)
    .limit(1);
  return loose[0] ?? null;
}

export async function getCourseById(id: number) {
  const rows = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return rows[0] ?? null;
}

/* ---------------------------------------------------------------- materials */

export async function getMaterialsByCourse(courseId: number) {
  return db
    .select()
    .from(materials)
    .where(eq(materials.courseId, courseId))
    .orderBy(sql`${materials.week} desc nulls last`, desc(materials.createdAt), desc(materials.id));
}

export async function getAllMaterials() {
  return db.select().from(materials).orderBy(desc(materials.createdAt), desc(materials.id));
}

export async function getMaterialById(id: number) {
  if (!Number.isFinite(id)) return null;
  const rows = await db.select().from(materials).where(eq(materials.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getMaterialsByWeek(week: number) {
  return db
    .select({ material: materials, courseCode: courses.code, courseId: courses.id })
    .from(materials)
    .innerJoin(courses, eq(materials.courseId, courses.id))
    .where(eq(materials.week, week))
    .orderBy(asc(courses.position), desc(materials.createdAt), desc(materials.id));
}

export async function getWeekCounts() {
  const rows = await db.select({ week: materials.week, value: count() }).from(materials).groupBy(materials.week);
  const map = new Map<number, number>();
  for (const row of rows) if (row.week !== null) map.set(row.week, Number(row.value));
  return map;
}

export interface MaterialFilters {
  query?: string;
  courseId?: number;
  kind?: string;
  week?: number;
}

export async function searchMaterials(filters: MaterialFilters) {
  const clauses = [];
  if (filters.query) {
    const term = `%${filters.query}%`;
    clauses.push(
      or(
        ilike(materials.title, term),
        ilike(materials.description, term),
        ilike(courses.title, term),
        ilike(courses.code, term),
      ),
    );
  }
  if (filters.courseId) clauses.push(eq(materials.courseId, filters.courseId));
  if (filters.kind) clauses.push(eq(materials.kind, filters.kind));
  if (filters.week) clauses.push(eq(materials.week, filters.week));

  return db
    .select({
      material: materials,
      courseCode: courses.code,
      courseTitle: courses.title,
      track: courses.track,
    })
    .from(materials)
    .innerJoin(courses, eq(materials.courseId, courses.id))
    .where(clauses.length ? and(...clauses) : undefined)
    .orderBy(
      sql`${materials.week} desc nulls last`,
      asc(courses.position),
      desc(materials.createdAt),
    );
}

export async function getFileMeta(id: number) {
  const rows = await db
    .select({ id: files.id, filename: files.filename, mimeType: files.mimeType, sizeBytes: files.sizeBytes })
    .from(files)
    .where(eq(files.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function getFileWithData(id: number) {
  const rows = await db.select().from(files).where(eq(files.id, id)).limit(1);
  return rows[0] ?? null;
}

/* ------------------------------------------------------------------ quizzes */

export async function getQuizzes(mode?: string) {
  const rows = await db
    .select({
      id: quizzes.id,
      title: quizzes.title,
      description: quizzes.description,
      courseId: quizzes.courseId,
      week: quizzes.week,
      mode: quizzes.mode,
      timeLimitMinutes: quizzes.timeLimitMinutes,
      published: quizzes.published,
      createdAt: quizzes.createdAt,
      questionCount: sql<number>`(
        select count(*)::int from ${questions} q where q.quiz_id = ${quizzes.id}
      )`,
      attemptCount: sql<number>`(
        select count(*)::int from ${attempts} a where a.quiz_id = ${quizzes.id}
      )`,
    })
    .from(quizzes)
    .orderBy(desc(quizzes.createdAt), desc(quizzes.id));
  return mode ? rows.filter((quiz) => quiz.mode === mode) : rows;
}

export async function getQuizById(id: number) {
  if (!Number.isFinite(id)) return null;
  const rows = await db.select().from(quizzes).where(eq(quizzes.id, id)).limit(1);
  if (!rows[0]) return null;
  const quizQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, id))
    .orderBy(asc(questions.position), asc(questions.id));
  return { ...rows[0], questions: quizQuestions };
}

export async function getQuestionsForQuiz(quizId: number) {
  return db
    .select()
    .from(questions)
    .where(eq(questions.quizId, quizId))
    .orderBy(asc(questions.position), asc(questions.id));
}

export async function getAttempts(quizId?: number, profileId?: number) {
  const clauses = [];
  if (typeof quizId === "number") clauses.push(eq(attempts.quizId, quizId));
  if (typeof profileId === "number") clauses.push(eq(attempts.profileId, profileId));
  if (clauses.length) {
    return db.select().from(attempts).where(and(...clauses)).orderBy(desc(attempts.createdAt));
  }
  return db.select().from(attempts).orderBy(desc(attempts.createdAt));
}

export async function getAttemptById(id: number) {
  if (!Number.isFinite(id)) return null;
  const rows = await db.select().from(attempts).where(eq(attempts.id, id)).limit(1);
  return rows[0] ?? null;
}

/* ------------------------------------------------- enrolments and progress */

export async function getEnrolments(profileId: number) {
  return db
    .select({ enrolment: enrolments, course: courses })
    .from(enrolments)
    .innerJoin(courses, eq(enrolments.courseId, courses.id))
    .where(eq(enrolments.profileId, profileId))
    .orderBy(asc(courses.position));
}

export async function getEnrolledCourseIds(profileId: number): Promise<Set<number>> {
  const rows = await db
    .select({ courseId: enrolments.courseId })
    .from(enrolments)
    .where(eq(enrolments.profileId, profileId));
  return new Set(rows.map((row) => row.courseId));
}

export async function getProgressWeeks(profileId: number) {
  return db
    .select()
    .from(courseProgress)
    .where(eq(courseProgress.profileId, profileId));
}

/* ---------------------------------------------------------------- bookmarks */

export async function getBookmarkedMaterials(profileId: number) {
  return db
    .select({ material: materials, courseCode: courses.code, courseId: courses.id })
    .from(bookmarks)
    .innerJoin(materials, eq(bookmarks.materialId, materials.id))
    .innerJoin(courses, eq(materials.courseId, courses.id))
    .where(eq(bookmarks.profileId, profileId))
    .orderBy(desc(bookmarks.createdAt));
}

/* ------------------------------------------------------------------- forum */

export async function getForumThreads(opts: { courseId?: number; query?: string }) {
  const clauses = [eq(forumThreads.hidden, false)];
  if (opts.courseId) clauses.push(eq(forumThreads.courseId, opts.courseId));
  if (opts.query) {
    const term = `%${opts.query}%`;
    clauses.push(or(ilike(forumThreads.title, term), ilike(forumThreads.body, term))!);
  }
  return db
    .select({
      thread: forumThreads,
      authorName: profiles.displayName,
      courseCode: courses.code,
      replyCount: sql<number>`(select count(*)::int from ${forumReplies} r where r.thread_id = ${forumThreads.id} and r.hidden = false)`,
    })
    .from(forumThreads)
    .innerJoin(profiles, eq(forumThreads.authorId, profiles.id))
    .leftJoin(courses, eq(forumThreads.courseId, courses.id))
    .where(and(...(clauses as ReturnType<typeof eq>[])))
    .orderBy(desc(forumThreads.createdAt))
    .limit(100);
}

export async function getForumThread(id: number) {
  const rows = await db
    .select({ thread: forumThreads, authorName: profiles.displayName, courseCode: courses.code })
    .from(forumThreads)
    .innerJoin(profiles, eq(forumThreads.authorId, profiles.id))
    .leftJoin(courses, eq(forumThreads.courseId, courses.id))
    .where(eq(forumThreads.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function getForumReplies(threadId: number, includeHidden = false) {
  const clauses = [eq(forumReplies.threadId, threadId)];
  if (!includeHidden) clauses.push(eq(forumReplies.hidden, false));
  return db
    .select({ reply: forumReplies, authorName: profiles.displayName })
    .from(forumReplies)
    .innerJoin(profiles, eq(forumReplies.authorId, profiles.id))
    .where(and(...clauses))
    .orderBy(asc(forumReplies.createdAt));
}

export async function getForumReports() {
  return db
    .select({ report: forumReports, reporterName: profiles.displayName })
    .from(forumReports)
    .innerJoin(profiles, eq(forumReports.reporterId, profiles.id))
    .where(eq(forumReports.status, "open"))
    .orderBy(desc(forumReports.createdAt));
}

/* ------------------------------------------------------------- assignments */

export async function getAssignments() {
  return db
    .select({ assignment: assignments, courseCode: courses.code, courseTitle: courses.title })
    .from(assignments)
    .innerJoin(courses, eq(assignments.courseId, courses.id))
    .orderBy(asc(assignments.dueDate));
}

export async function getAssignmentById(id: number) {
  const rows = await db
    .select({ assignment: assignments, courseCode: courses.code, courseTitle: courses.title })
    .from(assignments)
    .innerJoin(courses, eq(assignments.courseId, courses.id))
    .where(eq(assignments.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function getSubmissionsForAssignment(assignmentId: number) {
  return db
    .select({ submission: assignmentSubmissions, studentName: profiles.displayName, email: profiles.email })
    .from(assignmentSubmissions)
    .innerJoin(profiles, eq(assignmentSubmissions.profileId, profiles.id))
    .where(eq(assignmentSubmissions.assignmentId, assignmentId))
    .orderBy(desc(assignmentSubmissions.submittedAt));
}

export async function getMySubmissions(profileId: number) {
  return db
    .select({
      submission: assignmentSubmissions,
      assignment: assignments,
      courseCode: courses.code,
    })
    .from(assignmentSubmissions)
    .innerJoin(assignments, eq(assignmentSubmissions.assignmentId, assignments.id))
    .innerJoin(courses, eq(assignments.courseId, courses.id))
    .where(eq(assignmentSubmissions.profileId, profileId))
    .orderBy(desc(assignmentSubmissions.submittedAt));
}

export async function countSubmissions(): Promise<Map<number, number>> {
  const rows = await db
    .select({ assignmentId: assignmentSubmissions.assignmentId, value: count() })
    .from(assignmentSubmissions)
    .groupBy(assignmentSubmissions.assignmentId);
  return new Map(rows.map((row) => [row.assignmentId, Number(row.value)]));
}

/* ------------------------------------- announcements and notifications */

export async function getAnnouncements(limit = 50) {
  return db
    .select({ announcement: announcements, courseCode: courses.code })
    .from(announcements)
    .leftJoin(courses, eq(announcements.courseId, courses.id))
    .orderBy(desc(announcements.createdAt))
    .limit(limit);
}

export async function getNotifications(profileId: number, limit = 30) {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.profileId, profileId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function getUnreadCount(profileId: number): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(notifications)
    .where(and(eq(notifications.profileId, profileId), eq(notifications.read, false)));
  return Number(row?.value ?? 0);
}

/* ---------------------------------------- sessions, presentations, cards */

export async function getStudySessions(includePast = false) {
  const rows = await db
    .select({ session: studySessions, courseCode: courses.code })
    .from(studySessions)
    .leftJoin(courses, eq(studySessions.courseId, courses.id))
    .orderBy(asc(studySessions.sessionAt));
  return includePast
    ? rows
    : rows.filter((row) => row.session.sessionAt.getTime() >= Date.now() - 4 * 3_600_000);
}

export async function getPresentations() {
  return db
    .select({ presentation: presentations, courseCode: courses.code })
    .from(presentations)
    .leftJoin(courses, eq(presentations.courseId, courses.id))
    .orderBy(asc(presentations.sessionDate), asc(presentations.week));
}

export async function getFlashcards(courseId?: number) {
  if (courseId) {
    return db.select().from(flashcards).where(eq(flashcards.courseId, courseId)).orderBy(asc(flashcards.week), asc(flashcards.id));
  }
  return db.select().from(flashcards).orderBy(asc(flashcards.courseId), asc(flashcards.id));
}

/* -------------------------------------------------------------------- stats */

export async function getSemesterConfig(): Promise<SemesterConfig> {
  const rows = await db.select().from(settings);
  const map = new Map(rows.map((row) => [row.key, row.value]));
  const weeks = Number(map.get("semester_weeks"));
  return {
    start: map.get("semester_start") || process.env.SEMESTER_START || DEFAULT_SEMESTER.start,
    weeks: Number.isFinite(weeks) && weeks > 0 ? weeks : DEFAULT_SEMESTER.weeks,
    label: map.get("semester_label") || DEFAULT_SEMESTER.label,
  };
}

export async function getSiteStats() {
  const [courseCount] = await db.select({ value: count() }).from(courses);
  const [materialCount] = await db.select({ value: count() }).from(materials);
  const [quizCount] = await db.select({ value: count() }).from(quizzes);
  const [questionCount] = await db.select({ value: count() }).from(questions);
  const [attemptCount] = await db.select({ value: count() }).from(attempts);
  const [studentCount] = await db
    .select({ value: count() })
    .from(profiles)
    .where(eq(profiles.role, "student"));

  return {
    courses: courseCount?.value ?? 0,
    materials: materialCount?.value ?? 0,
    quizzes: quizCount?.value ?? 0,
    questions: questionCount?.value ?? 0,
    attempts: attemptCount?.value ?? 0,
    members: studentCount?.value ?? 0,
  };
}

export async function getAdminAnalytics() {
  const [students] = await db.select({ value: count() }).from(profiles).where(eq(profiles.role, "student"));
  const [threads] = await db.select({ value: count() }).from(forumThreads);
  const [submissions] = await db.select({ value: count() }).from(assignmentSubmissions);
  const [enrolmentCount] = await db.select({ value: count() }).from(enrolments);
  const quizStats = await db
    .select({
      id: quizzes.id,
      title: quizzes.title,
      courseCode: courses.code,
      attempts: sql<number>`(select count(*)::int from ${attempts} a where a.quiz_id = ${quizzes.id})`,
      average: sql<number>`(select coalesce(avg(round(100.0 * a.score / nullif(a.max_score, 0)))::int, 0) from ${attempts} a where a.quiz_id = ${quizzes.id})`,
    })
    .from(quizzes)
    .innerJoin(courses, eq(quizzes.courseId, courses.id))
    .orderBy(desc(quizzes.createdAt))
    .limit(15);

  return {
    students: students?.value ?? 0,
    threads: threads?.value ?? 0,
    submissions: submissions?.value ?? 0,
    enrolments: enrolmentCount?.value ?? 0,
    quizStats,
  };
}
