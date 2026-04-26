/**
 * Next.js 16 Proxy — admin gate.
 *
 * In Next.js 16 the middleware file convention was renamed to
 * `proxy`. The framework looks for `proxy.ts` at the project root or
 * under `src/`, and expects a function exported as `proxy` (default
 * export also works). `middleware.ts` still loads with a deprecation
 * warning, but we use the current name.
 *
 * Responsibilities:
 *   1. For `/admin/*` pages (excluding login / accept-invite), require
 *      a valid admin session cookie; otherwise bounce to /admin/login.
 *   2. For `/api/admin/*` API routes (excluding public login/invite/
 *      forgot-password flows), require a valid admin session cookie;
 *      otherwise return 401 JSON.
 *   3. On valid sessions, forward the decoded payload to downstream
 *      handlers via `x-admin-*` request headers so they do not need
 *      to re-verify the token on every call.
 *
 * Route handlers should still call `readAdminHeaders(req)` — from
 * `@/lib/agents/request-security` — so that any handler mis-mounted
 * outside the matcher fails closed.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/admin-auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // -------------------------------------------------------------------
  // /admin/* — browser pages
  // -------------------------------------------------------------------
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/admin/accept-invite")
  ) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const payload = await verifyToken(token);
    if (!payload) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-admin-user-id", payload.userId);
    requestHeaders.set("x-admin-email", payload.email);
    requestHeaders.set("x-admin-is-super", payload.isSuperAdmin ? "1" : "0");
    requestHeaders.set(
      "x-admin-clients",
      payload.accessibleClients.join(",")
    );

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // -------------------------------------------------------------------
  // /api/admin/* — API routes. Excludes public auth entry points.
  // -------------------------------------------------------------------
  if (pathname.startsWith("/api/admin")) {
    const publicAdminApi =
      pathname.startsWith("/api/admin/login") ||
      pathname.startsWith("/api/admin/accept-invite") ||
      pathname.startsWith("/api/admin/forgot-password") ||
      pathname.startsWith("/api/admin/reset-password") ||
      pathname.startsWith("/api/admin/logout");

    if (publicAdminApi) return NextResponse.next();

    const token = req.cookies.get(COOKIE_NAME)?.value;
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-admin-user-id", payload.userId);
    requestHeaders.set("x-admin-email", payload.email);
    requestHeaders.set("x-admin-is-super", payload.isSuperAdmin ? "1" : "0");
    requestHeaders.set(
      "x-admin-clients",
      payload.accessibleClients.join(",")
    );

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
