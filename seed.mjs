/**
 * Seeds the IT Study Group hub: the six courses, week-by-week starter notes,
 * a revision test per course and the semester calendar.
 *
 *   node scripts/seed.mjs           # seeds only if the database is empty
 *   node scripts/seed.mjs --reset   # wipes EVERYTHING and seeds again
 */
import { Client } from "pg";
import dcit101 from "./seed-data/dcit101.mjs";
import dcit103 from "./seed-data/dcit103.mjs";
import dcit105 from "./seed-data/dcit105.mjs";
import econ101 from "./seed-data/econ101.mjs";
import stat111 from "./seed-data/stat111.mjs";
import ugrc150 from "./seed-data/ugrc150.mjs";
import ugrc110 from "./seed-data/ugrc110.mjs";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:5432/app_db";
const RESET = process.argv.includes("--reset");
const POSTED_BY = "Study group";

// Monday 23 November 2026 is the start of week 5 → week 1 began Monday 26 October 2026.
const SEMESTER = {
  semester_start: "2026-10-26",
  semester_weeks: "13",
  semester_label: "First Semester · 2026/2027",
};

const PACKS = [dcit101, dcit103, dcit105, econ101, stat111, ugrc150, ugrc110];

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

/** A realistic "posted" time inside the material's week (never in the future). */
function postedAt(week, offsetHours) {
  const start = Date.parse(`${SEMESTER.semester_start}T00:00:00Z`);
  const when = start + (Math.max(week, 1) - 1) * 7 * DAY + (8 + offsetHours) * HOUR;
  return new Date(Math.min(when, Date.now()));
}

function validateQuestion(question, label) {
  if (question.type === "single" && !question.options.includes(question.correct)) {
    throw new Error(`${label}: correct answer "${question.correct}" is not one of the options`);
  }
  if (question.type === "multiple") {
    const missing = question.correct.filter((item) => !question.options.includes(item));
    if (missing.length) throw new Error(`${label}: ${missing.join(", ")} not in options`);
  }
  if (question.type === "boolean" && typeof question.correct !== "boolean") {
    throw new Error(`${label}: true/false questions need a boolean answer`);
  }
}

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  try {
    if (RESET) {
      await client.query(
        "TRUNCATE attempts, questions, quizzes, materials, files, courses, settings, announcements, flashcards RESTART IDENTITY CASCADE",
      );
      console.log("Database wiped.");
    } else {
      const existing = await client.query("SELECT COUNT(*)::int AS count FROM courses");
      if (existing.rows[0].count > 0) {
        console.log("Already seeded — run with --reset to start over.");
        return;
      }
    }

    for (const [key, value] of Object.entries(SEMESTER)) {
      await client.query(
        `INSERT INTO settings (key, value) VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
        [key, value],
      );
    }

    let materialCount = 0;
    let quizCount = 0;
    let questionCount = 0;

    for (const [index, pack] of PACKS.entries()) {
      const course = pack.course;
      const courseRow = await client.query(
        `INSERT INTO courses (code, title, summary, description, track, level, credits, accent, position)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
        [
          course.code,
          course.title,
          course.summary,
          course.description,
          course.track,
          course.level ?? 100,
          course.credits ?? 3,
          course.accent,
          index + 1,
        ],
      );
      const courseId = courseRow.rows[0].id;

      for (const [materialIndex, material] of pack.materials.entries()) {
        const week = material.week ?? null;
        await client.query(
          `INSERT INTO materials (course_id, title, description, kind, week, url, content, size_bytes, posted_by, created_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [
            courseId,
            material.title,
            material.description,
            material.kind,
            week,
            material.url ?? null,
            material.content ?? null,
            material.content ? Buffer.byteLength(material.content) : 0,
            POSTED_BY,
            postedAt(week ?? 1, index + materialIndex * 0.25),
          ],
        );
        materialCount += 1;
      }

      if (pack.quiz) {
        const quiz = pack.quiz;
        const quizRow = await client.query(
          `INSERT INTO quizzes (course_id, title, description, week, time_limit_minutes, published, created_at, mode)
           VALUES ($1,$2,$3,$4,$5,TRUE,$6,$7) RETURNING id`,
          [
            courseId,
            quiz.title,
            quiz.description,
            quiz.week ?? null,
            quiz.time ?? 15,
            postedAt(quiz.week ?? 1, 30 + index),
            quiz.mode ?? "practice",
          ],
        );
        quizCount += 1;

        for (const [questionIndex, question] of quiz.questions.entries()) {
          validateQuestion(question, `${course.code} Q${questionIndex + 1}`);
          await client.query(
            `INSERT INTO questions (quiz_id, prompt, type, options, correct, explanation, points, position)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [
              quizRow.rows[0].id,
              question.prompt,
              question.type,
              JSON.stringify(question.options ?? []),
              JSON.stringify(question.correct),
              question.explanation ?? "",
              question.points ?? 1,
              questionIndex,
            ],
          );
          questionCount += 1;
        }
      }
    }

    await client.query(
      `INSERT INTO announcements (title, body, course_id) VALUES ($1,$2,NULL)`,
      [
        "Welcome to Nexus Academics",
        "Everything for our seven courses lives here. Create your free student account to sit exams, track your progress and ask questions in the forum. Materials are open to everyone — the forum, exams and assignments are for registered students.",
      ],
    );

    const flashcards = [
      ["DCIT 101", "1011 in decimal?", "11"],
      ["DCIT 101", "What does CPU stand for?", "Central Processing Unit"],
      ["DCIT 101", "Name the three flowchart decision diamond contents", "A condition with yes/no branches"],
      ["DCIT 103", "Ctrl + S does what?", "Save the document"],
      ["DCIT 103", "Where do you set a table of contents in Word?", "References tab"],
      ["DCIT 105", "|A ∪ B| = ?", "|A| + |B| − |A ∩ B|"],
      ["DCIT 105", "p → q is false only when…", "p is true and q is false"],
      ["STAT 111", "Mean of 4, 7, 7, 9, 13?", "8"],
      ["STAT 111", "What does n/2 mean in grouped-data median?", "Half the total frequency"],
      ["ECON 101", "Opportunity cost is…", "The next best alternative forgone"],
      ["ECON 101", "When demand increases, equilibrium price…", "Rises"],
      ["UGRC 150", "Valid + true premises = ?", "A sound argument"],
      ["UGRC 150", "Attacking the person instead of the argument is…", "Ad hominem"],
      ["UGRC 110", "An apostrophe after a plural s' shows…", "Possession by several owners"],
      ["UGRC 110", "The main idea sentence of a paragraph is called…", "The topic sentence"],
    ];
    let cardCount = 0;
    for (const [code, front, back] of flashcards) {
      const courseRow = await client.query("SELECT id FROM courses WHERE code = $1", [code]);
      if (courseRow.rows[0]) {
        await client.query("INSERT INTO flashcards (course_id, front, back) VALUES ($1,$2,$3)", [courseRow.rows[0].id, front, back]);
        cardCount += 1;
      }
    }

    console.log(`Inserted ${PACKS.length} courses and ${materialCount} materials.`);
    console.log(`Inserted ${quizCount} tests with ${questionCount} questions.`);
    console.log(`Inserted ${cardCount} flashcards and 1 announcement.`);
    console.log(`Semester calendar: week 1 began ${SEMESTER.semester_start}.`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
