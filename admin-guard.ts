import { NextResponse } from "next/server";
import { getCurrentProfile, isAdminProfile, type Profile } from "@/lib/auth";

export { isAdminProfile };

export async function getSessionProfile(): Promise<Profile | null> {
  return getCurrentProfile();
}

/** @deprecated Use getSessionProfile()/requireApiAdmin() — kept for call sites during migration. */
export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentProfile();
  return isAdminProfile(profile);
}

export async function requireApiProfile() {
  const profile = await getCurrentProfile();
  if (!profile) {
    return {
      profile: null,
      response: NextResponse.json({ error: "Please sign in." }, { status: 401 }),
    } as const;
  }
  return { profile, response: null } as const;
}

export async function requireApiAdmin() {
  const profile = await getCurrentProfile();
  if (!profile) {
    return {
      profile: null,
      response: NextResponse.json({ error: "Please sign in." }, { status: 401 }),
    } as const;
  }
  if (!(await isAdminProfile(profile))) {
    return {
      profile: null,
      response: NextResponse.json({ error: "Administrator access required." }, { status: 403 }),
    } as const;
  }
  return { profile, response: null } as const;
}
