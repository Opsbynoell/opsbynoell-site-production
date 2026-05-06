/**
 * Next.js 16 Proxy — canonical-host hotfix + admin gate.
 *
 * In Next.js 16 the middleware file convention was renamed to
 * `proxy`. The framework looks for `proxy.ts` at the project root or
 * under `src/`, and expects a function exported as `proxy` (default
 * export also works). `middleware.ts` still loads with a deprecation
 * warning, but we use the current name.
 *
 * Responsibilities:
 *   1. On production, force the canonical host. Requests reaching the
 *      production deployment via a non-canonical `*.vercel.app` alias
 *      are 308-redirected to the same path on www.opsbynoell.com for
 *      safe methods, and tagged `X-Robots-Tag: noindex, nofollow` for
 *      everything else so search engines stop indexing legacy aliases.
 *   2. For `/admin/*` pages (excluding login / accept-invite), require
 *      a valid admin session cookie; otherwise bounce to /admin/login.
 *   3. For `/api/admin/*` API routes (excluding public login/invite/
 *      forgot-password flows), require a valid admin session cookie;
 *      otherwise return 401 JSON.
 *   4. On valid sessions, forward the decoded payload to downstream
 *      handlers via `x-admin-*` request headers so they do not need
 *      to re-verify the token on every call.
 *
 * Route handlers should still call `readAdminHeaders(req)` — from
 * `@/lib/agents/request-security` — so that any handler mis-mounted
 * outside the matcher fails closed.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/admin-auth";

const CANONICAL_HOST = "www.opsbynoell.com";

function isNonCanonicalProdHost(host: string | null): boolean {
  if (!host) return false;
  // Strip an optional port suffix; the host header may include `:443`
  // on some platforms.
  const bare = host.split(":")[0].toLowerCase();
  if (bare === CANONICAL_HOST) return false;
  // Any *.vercel.app alias attached to the production deployment is
  // legacy and should not be served as the canonical site. Matches the
  // known `opsbynoell-marketing-review.vercel.app` alias plus any
  // future production aliases that get added by mistake.
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
      // For safe methods, redirect permanently to the canonical host.
      // For other methods (POST webhooks, etc.) we don't redirect —
      // a 308 would be followed by clients but could break non-browser
      // callers that target a vercel.app URL directly. Tag the response
      // as noindex so any HTML body still served via that path is not
      // crawled.
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
      pathname.startsWith("/api/admin/oneshot-reset") ||
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
  // Match all routes except Next.js static assets and image optimizer
  // output, plus the favicon. The proxy itself dispatches based on
  // path: canonical-host check applies everywhere, the admin gate
  // only fires for /admin/* and /api/admin/*.
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
