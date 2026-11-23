import { getFileWithData, getAssignmentById } from "@/lib/queries";
import { db } from "@/db";
import { assignmentSubmissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentProfile } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FORCE_DOWNLOAD = /^(text\/html|application\/xhtml|image\/svg|text\/xml|application\/xml|text\/javascript|application\/javascript)/i;

/** Download a submission — only the owning student or the administrator. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const profile = await getCurrentProfile();
  if (!profile) return new Response("Please sign in.", { status: 401 });

  const { id } = await params;
  const submissionId = Number(id);
  if (!Number.isFinite(submissionId)) return new Response("Bad request", { status: 400 });

  const rows = await db.select().from(assignmentSubmissions).where(eq(assignmentSubmissions.id, submissionId)).limit(1);
  const submission = rows[0];
  if (!submission) return new Response("Not found", { status: 404 });

  const isOwner = submission.profileId === profile.id;
  const isAdmin = profile.role === "admin";
  if (!isOwner && !isAdmin) return new Response("Not authorised.", { status: 403 });

  let assignmentTitle = "";
  const parent = await getAssignmentById(submission.assignmentId);
  if (parent) assignmentTitle = parent.assignment.title;

  const mimeType = submission.mimeType || "application/octet-stream";
  const disposition = FORCE_DOWNLOAD.test(mimeType) ? "attachment" : "inline";
  const asciiName = submission.fileName.replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "");
  const body = new Uint8Array(submission.data);

  return new Response(body, {
    headers: {
      "Content-Type": mimeType,
      "Content-Length": String(body.byteLength),
      "Content-Disposition": `${disposition}; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(submission.fileName)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      ...(assignmentTitle ? { "X-Assignment": assignmentTitle.replace(/[^\x20-\x7E]/g, "") } : {}),
    },
  });
}
