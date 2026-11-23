import { sql } from "drizzle-orm";
import {
  boolean,
  customType,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return "bytea";
  },
});

/* ------------------------------------------------------------------- users */

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  role: text("role").notNull().default("student"), // 'student' | 'admin'
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  token: text("token").primaryKey(),
  profileId: integer("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  token: text("token").primaryKey(),
  profileId: integer("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

/* ----------------------------------------------------------------- courses */

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull().default(""),
  description: text("description").notNull().default(""),
  track: text("track").notNull().default("core"), // 'core' | 'elective'
  level: integer("level").notNull().default(100),
  credits: integer("credits").notNull().default(3),
  accent: text("accent").notNull().default("emerald"),
  icon: text("icon").notNull().default("book-open"),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const enrolments = pgTable(
  "enrolments",
  {
    id: serial("id").primaryKey(),
    profileId: integer("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    uniqueEnrol: uniqueIndex("enrolments_unique").on(table.profileId, table.courseId),
  }),
);

export const courseProgress = pgTable(
  "course_progress",
  {
    id: serial("id").primaryKey(),
    profileId: integer("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    week: integer("week").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    uniqueProgress: uniqueIndex("progress_unique").on(
      table.profileId,
      table.courseId,
      table.week,
    ),
  }),
);

/* --------------------------------------------------------------- materials */

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  storedName: text("stored_name").notNull().default(""),
  mimeType: text("mime_type").notNull().default("application/octet-stream"),
  sizeBytes: integer("size_bytes").notNull().default(0),
  data: bytea("data"),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
});

export const materials = pgTable(
  "materials",
  {
    id: serial("id").primaryKey(),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    kind: text("kind").notNull().default("notes"),
    week: integer("week"),
    fileId: integer("file_id").references(() => files.id, { onDelete: "set null" }),
    url: text("url"),
    content: text("content"),
    sizeBytes: integer("size_bytes").notNull().default(0),
    durationMinutes: integer("duration_minutes"),
    postedBy: text("posted_by").notNull().default("Nexus Academics"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    courseIdx: index("materials_course_idx").on(table.courseId),
    weekIdx: index("materials_week_idx").on(table.week),
  }),
);

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: serial("id").primaryKey(),
    profileId: integer("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    materialId: integer("material_id")
      .notNull()
      .references(() => materials.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    uniqueBookmark: uniqueIndex("bookmarks_unique").on(table.profileId, table.materialId),
  }),
);

/* ------------------------------------------------------------ examinations */

export const quizzes = pgTable(
  "quizzes",
  {
    id: serial("id").primaryKey(),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    week: integer("week"),
    mode: text("mode").notNull().default("practice"), // 'practice' | 'exam'
    timeLimitMinutes: integer("time_limit_minutes").notNull().default(15),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    courseIdx: index("quizzes_course_idx").on(table.courseId),
  }),
);

export const questions = pgTable(
  "questions",
  {
    id: serial("id").primaryKey(),
    quizId: integer("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    prompt: text("prompt").notNull(),
    type: text("type").notNull().default("single"),
    options: jsonb("options").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    correct: jsonb("correct")
      .$type<string | string[] | boolean>()
      .notNull()
      .default(sql`'""'::jsonb`),
    explanation: text("explanation").notNull().default(""),
    points: integer("points").notNull().default(1),
    position: integer("position").notNull().default(0),
  },
  (table) => ({
    quizIdx: index("questions_quiz_idx").on(table.quizId),
  }),
);

export const attempts = pgTable(
  "attempts",
  {
    id: serial("id").primaryKey(),
    quizId: integer("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    profileId: integer("profile_id").references(() => profiles.id, { onDelete: "set null" }),
    studentName: text("student_name").notNull(),
    studentEmail: text("student_email").notNull().default(""),
    track: text("track").notNull().default(""),
    score: integer("score").notNull().default(0),
    maxScore: integer("max_score").notNull().default(0),
    answers: jsonb("answers")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    results: jsonb("results")
      .$type<Record<string, boolean>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    durationSeconds: integer("duration_seconds").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    quizIdx: index("attempts_quiz_idx").on(table.quizId),
    profileIdx: index("attempts_profile_idx").on(table.profileId),
  }),
);

/* ------------------------------------------------------------------ forum */

export const forumThreads = pgTable(
  "forum_threads",
  {
    id: serial("id").primaryKey(),
    courseId: integer("course_id").references(() => courses.id, { onDelete: "set null" }),
    authorId: integer("author_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    body: text("body").notNull(),
    hidden: boolean("hidden").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    courseIdx: index("threads_course_idx").on(table.courseId),
  }),
);

export const forumReplies = pgTable(
  "forum_replies",
  {
    id: serial("id").primaryKey(),
    threadId: integer("thread_id")
      .notNull()
      .references(() => forumThreads.id, { onDelete: "cascade" }),
    authorId: integer("author_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    hidden: boolean("hidden").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    threadIdx: index("replies_thread_idx").on(table.threadId),
  }),
);

export const forumReports = pgTable("forum_reports", {
  id: serial("id").primaryKey(),
  threadId: integer("thread_id").references(() => forumThreads.id, { onDelete: "cascade" }),
  replyId: integer("reply_id").references(() => forumReplies.id, { onDelete: "cascade" }),
  reporterId: integer("reporter_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  reason: text("reason").notNull().default(""),
  status: text("status").notNull().default("open"), // 'open' | 'dismissed'
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------------------------------------- assignments */

export const assignments = pgTable(
  "assignments",
  {
    id: serial("id").primaryKey(),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    dueDate: timestamp("due_date", { withTimezone: true }),
    maxPoints: integer("max_points").notNull().default(100),
    createdBy: integer("created_by").references(() => profiles.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    courseIdx: index("assignments_course_idx").on(table.courseId),
  }),
);

export const assignmentSubmissions = pgTable(
  "assignment_submissions",
  {
    id: serial("id").primaryKey(),
    assignmentId: integer("assignment_id")
      .notNull()
      .references(() => assignments.id, { onDelete: "cascade" }),
    profileId: integer("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    fileName: text("file_name").notNull(),
    mimeType: text("mime_type").notNull().default("application/octet-stream"),
    sizeBytes: integer("size_bytes").notNull().default(0),
    data: bytea("data").notNull(),
    note: text("note").notNull().default(""),
    grade: integer("grade"),
    feedback: text("feedback"),
    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    gradedAt: timestamp("graded_at", { withTimezone: true }),
  },
  (table) => ({
    uniqueSubmission: uniqueIndex("submissions_unique").on(
      table.assignmentId,
      table.profileId,
    ),
  }),
);

/* -------------------------------------------- news and notifications */

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    profileId: integer("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    body: text("body").notNull().default(""),
    link: text("link"),
    read: boolean("read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    profileIdx: index("notif_profile_idx").on(table.profileId, table.read),
  }),
);

/* -------------------------------------------------- study sessions & more */

export const studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  courseId: integer("course_id").references(() => courses.id, { onDelete: "set null" }),
  sessionAt: timestamp("session_at", { withTimezone: true }).notNull(),
  meetingUrl: text("meeting_url").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const presentations = pgTable("presentations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  presenter: text("presenter").notNull().default(""),
  courseId: integer("course_id").references(() => courses.id, { onDelete: "set null" }),
  week: integer("week"),
  sessionDate: timestamp("session_date", { withTimezone: true }),
  notes: text("notes").notNull().default(""),
  materialId: integer("material_id").references(() => materials.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  week: integer("week"),
  front: text("front").notNull(),
  back: text("back").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
