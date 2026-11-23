import { createHash, randomBytes, scryptSync, timingSafeEqual, randomUUID } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { passwordResetTokens, profiles, sessions } from "@/db/schema";

export const SESSION_COOKIE = "nexus_session";
const SESSION_DAYS = 30;
const RESET_MINUTES = 60;

/* ---------------------------------------------------------- password utils */

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, expectedHex] = parts;
  const a = Buffer.from(scryptSync(password, salt, 64).toString("hex"), "hex");
  const b = Buffer.from(expectedHex, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Use at least 8 characters.";
  if (password.length > 100) return "Use fewer than 100 characters.";
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
    return "Include at least one letter and one number.";
  return null;
}

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function displayNameFor(name: string): string {
  const trimmed = name.trim().replace(/\s+/g, " ");
  return trimmed.slice(0, 60);
}

/* ----------------------------------------------------------------- sessions */

export async function createSession(profileId: number): Promise<string> {
  const token = randomBytes(32).toString("hex");
  await db.insert(sessions).values({
    token,
    profileId,
    expiresAt: new Date(Date.now() + SESSION_DAYS * 86_400_000),
  });
  return token;
}

export async function destroySession(token: string | undefined): Promise<void> {
  if (token) await db.delete(sessions).where(eq(sessions.token, token));
}

export type Profile = {
  id: number;
  name: string;
  email: string;
  displayName: string;
  role: "student" | "admin" | string;
};

/** Current profile — one query per request thanks to React cache(). */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const rows = await db
    .select({
      id: profiles.id,
      name: profiles.name,
      email: profiles.email,
      displayName: profiles.displayName,
      role: profiles.role,
      token: sessions.token,
    })
    .from(sessions)
    .innerJoin(profiles, eq(sessions.profileId, profiles.id))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);

  const row = rows[0];
  if (!row) return null;
  return { id: row.id, name: row.name, email: row.email, displayName: row.displayName, role: row.role };
});

export async function isAdminProfile(profile: Profile | null): Promise<boolean> {
  return profile?.role === "admin";
}

export async function adminExists(): Promise<boolean> {
  const rows = await db.select({ id: profiles.id }).from(profiles).where(eq(profiles.role, "admin")).limit(1);
  return rows.length > 0;
}

/* ------------------------------------------------------------ reset tokens */

export async function createPasswordResetToken(profileId: number): Promise<string> {
  const token = randomUUID().replace(/-/g, "") + randomBytes(16).toString("hex");
  await db.insert(passwordResetTokens).values({
    token: hashToken(token),
    profileId,
    expiresAt: new Date(Date.now() + RESET_MINUTES * 60_000),
  });
  return token;
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function consumePasswordResetToken(
  token: string,
): Promise<number | null> {
  const hashed = hashToken(token);
  const rows = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.token, hashed),
        gt(passwordResetTokens.expiresAt, new Date()),
      ),
    )
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, hashed));
  return row.profileId;
}
