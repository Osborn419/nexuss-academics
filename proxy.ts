import { NextRequest, NextResponse } from "next/server";

/**
 * Reject cross-origin browser mutations to cookie-authenticated API routes.
 * Browser fetch/form POST includes Origin; server-side/curl clients without
 * Origin remain possible for maintenance. Cookie SameSite=Lax is defence 2.
 */
export function proxy(request: NextRequest) {
  if (["POST", "PATCH", "PUT", "DELETE"].includes(request.method)) {
    const origin = request.headers.get("origin");
    if (origin) {
      const forwarded = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
      const host = forwarded || request.headers.get("host") || request.nextUrl.host;
      try {
        if (new URL(origin).host.toLowerCase() !== host.toLowerCase()) {
          return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: "Invalid Origin header." }, { status: 403 });
      }
    }
  }
  return NextResponse.next();
}

export const config = { matcher: "/api/:path*" };
