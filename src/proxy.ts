/**
 * Next.js 16 Proxy — canonical-host hotfix + admin gate + client portal gate.
 *
 * Responsibilities:
 *   1. On production, force the canonical host.
 *   2. For `/admin/*` pages, require a valid admin session cookie.
 *   3. For `/api/admin/*` API routes, require a valid admin session cookie.
 *   4. For `/client/*` pages (excluding login), require a valid client session cookie.
 *   5. For `/api/client/*` API routes, require a valid client session cookie.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/admin-auth";
import { verifyClientToken, CLIENT_COOKIE_NAME } from "@/lib/client-auth";

const CANONICAL_HOST = "www.opsbynoell.com";

function isNonCanonicalProdHost(host: string | null): boolean {
  if (!host) return false;
  const bare = host.split(":")[0].toLowerCase();
  if (bare === CANONICAL_HOST) return false;
  return bare.endsWith(".vercel.app");
}

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // -------------------------------------------------------------------
  // Canonical-host enforcement (production only).
  // -------------------------------------------------------------------
  if (process.env.VERCEL_ENV === "production") {
    const host = req.headers.get("host");
    if (isNonCanonicalProdHost(host)) {
      if (req.method === "GET" || req.method === "HEAD") {
        const target = new URL(`https://${CANONICAL_HOST}${pathname}${search}`);
        return NextResponse.redirect(target, 308);
      }
      const passthrough = NextResponse.next();
      passthrough.headers.set("X-Robots-Tag", "noindex, nofollow");
      return passthrough;
    }
  }

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
    requestHeaders.set("x-admin-clients", payload.accessibleClients.join(","));

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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-admin-user-id", payload.userId);
    requestHeaders.set("x-admin-email", payload.email);
    requestHeaders.set("x-admin-is-super", payload.isSuperAdmin ? "1" : "0");
    requestHeaders.set("x-admin-clients", payload.accessibleClients.join(","));

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // -------------------------------------------------------------------
  // /client/* — client portal pages (excluding login)
  // -------------------------------------------------------------------
  if (
    pathname.startsWith("/client") &&
    !pathname.startsWith("/client/login")
  ) {
    const token = req.cookies.get(CLIENT_COOKIE_NAME)?.value;
    const payload = await verifyClientToken(token);
    if (!payload) {
      const url = req.nextUrl.clone();
      url.pathname = "/client/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-client-user-id", payload.userId);
    requestHeaders.set("x-client-email", payload.email);
    requestHeaders.set("x-client-id", payload.clientId);
    requestHeaders.set("x-client-name", payload.name);

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // -------------------------------------------------------------------
  // /api/client/* — client portal API routes (excluding login)
  // -------------------------------------------------------------------
  if (
    pathname.startsWith("/api/client") &&
    !pathname.startsWith("/api/client/login") &&
    !pathname.startsWith("/api/client/logout")
  ) {
    const token = req.cookies.get(CLIENT_COOKIE_NAME)?.value;
    const payload = await verifyClientToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-client-user-id", payload.userId);
    requestHeaders.set("x-client-email", payload.email);
    requestHeaders.set("x-client-id", payload.clientId);
    requestHeaders.set("x-client-name", payload.name);

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
