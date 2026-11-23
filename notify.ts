import { db } from "@/db";
import { notifications, profiles } from "@/db/schema";
import { or, eq, isNull, and } from "drizzle-orm";
import { enrolments } from "@/db/schema";

/** Fan-out a notification to every student, or to students enrolled in a course. */
export async function notifyStudents({
  title,
  body = "",
  link,
  courseId,
}: {
  title: string;
  body?: string;
  link?: string;
  courseId?: number | null;
}) {
  let targets: { id: number }[];
  if (courseId) {
    targets = await db
      .selectDistinct({ id: profiles.id })
      .from(profiles)
      .innerJoin(enrolments, eq(enrolments.profileId, profiles.id))
      .where(and(eq(profiles.role, "student"), eq(enrolments.courseId, courseId)));
  } else {
    targets = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.role, "student"));
  }
  if (targets.length === 0) return;
  await db.insert(notifications).values(
    targets.map((target) => ({
      profileId: target.id,
      title: title.slice(0, 200),
      body: body.slice(0, 1000),
      link: link ?? null,
    })),
  );
}
