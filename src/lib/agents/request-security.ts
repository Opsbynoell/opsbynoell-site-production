/**
 * Request-security helpers shared by agent API routes.
 *
 * - requireAdmin / assertClientAccess: read the admin-session headers
 *   injected by middleware.ts. These fail closed if the middleware did
 *   not run (e.g. handler mis-mounted outside the matcher), so every
 *   sensitive route should call them regardless of whether the matcher
 *   should already have caught the request.
 *
 * - assertOriginAllowed: for public chat endpoints, reject cross-site
 *   POSTs whose Origin is not in the allowlist. Same-origin and
 *   no-origin (native mobile / curl-shaped) requests pass. Widgets
 *   embedded on partner domains must be added explicitly via env var
 *   PUBLIC_WIDGET_ORIGINS (comma-separated).
 *
 * - rateLimit: simple fixed-window in-memory limiter keyed by
 *   "bucket:identity". Per-instance only — on Vercel each lambda
 *   instance has its own counter, so this is best-effort abuse
 *   braking, not a hard quota. The numbers are sized accordingly.
 *
 * - clampPublicMessage: truncates user-submitted chat text to a sane
 *   per-request ceiling so one request cannot balloon our Claude spend.
 */

import { NextRequest } from "next/server";
import { COOKIE_NAME, verifyToken } from "@/lib/admin-auth";

// ---------------------------------------------------------------------------
// Admin headers (set by middleware) / direct-cookie fallback
// ---------------------------------------------------------------------------

export interface AdminContext {
  userId: string;
  email: string;
  isSuperAdmin: boolean;
  accessibleClients: string[];
}

/**
 * Read admin context from headers set by middleware. Works for routes
 * under the middleware matcher (`/api/admin/*`). For routes *outside*
 * the matcher, use `verifyAdminFromCookie` instead.
 */
export function readAdminHeaders(req: Request): AdminContext | null {
  const userId = req.headers.get("x-admin-user-id");
  const email = req.headers.get("x-admin-email");
  if (!userId || !email) return null;
  const isSuperAdmin = req.headers.get("x-admin-is-super") === "1";
  const clients = (req.headers.get("x-admin-clients") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return { userId, email, isSuperAdmin, accessibleClients: clients };
}

/**
 * Verify admin session directly from the cookie. Use on routes that
 * are not under the middleware matcher (e.g. `/api/care/knowledge`,
 * `/api/care/contact-lookup`). Returns null on any failure.
 */
export async function verifyAdminFromCookie(
  req: Request
): Promise<AdminContext | null> {
  // Next's `NextRequest` exposes cookies.get; plain Request does not.
  const asNext = req as NextRequest;
  let token: string | undefined;
  if (typeof asNext.cookies?.get === "function") {
    token = asNext.cookies.get(COOKIE_NAME)?.value;
  }
  if (!token) {
    const cookieHeader = req.headers.get("cookie") ?? "";
    const match = cookieHeader.match(
      new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`)
    );
    if (match) token = decodeURIComponent(match[1]);
  }
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  return {
    userId: payload.userId,
    email: payload.email,
    isSuperAdmin: payload.isSuperAdmin,
    accessibleClients: payload.accessibleClients,
  };
}

/** Throws a Response-like sentinel when the caller is not a signed-in admin. */
export function requireAdmin(req: Request): AdminContext | Response {
  const ctx = readAdminHeaders(req);
  if (!ctx) {
    return jsonError("Unauthorized", 401);
  }
  return ctx;
}

export function hasClientAccess(ctx: AdminContext, clientId: string): boolean {
  if (ctx.isSuperAdmin) return true;
  if (!clientId) return false;
  return ctx.accessibleClients.includes(clientId);
}

// ---------------------------------------------------------------------------
// Origin allowlist for public chat endpoints
// ---------------------------------------------------------------------------

function parseAllowedOrigins(): string[] {
  const env = process.env.PUBLIC_WIDGET_ORIGINS ?? "";
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const set = new Set<string>();
  for (const raw of [env, site].join(",").split(",")) {
    const v = raw.trim().replace(/\/$/, "");
    if (v) set.add(v);
  }
  // Sensible defaults — our own production host.
  set.add("https://www.opsbynoell.com");
  set.add("https://opsbynoell.com");
  return Array.from(set);
}

/**
 * Returns true if the request's Origin header is allowed (or absent —
 * native mobile / server-to-server don't send Origin). Returns false
 * only for browser cross-site POSTs from an untrusted domain.
 */
export function isOriginAllowed(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  const allowed = parseAllowedOrigins();
  const norm = origin.replace(/\/$/, "");
  return allowed.includes(norm);
}

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter
// ---------------------------------------------------------------------------

interface Bucket {
  count: number;
  resetAt: number;
}

const rateBuckets = new Map<string, Bucket>();

/**
 * Fixed-window limiter. Returns { ok, retryAfterMs }. In serverless
 * this is only best-effort — each instance keeps its own map — but it
 * does slow obvious abuse without requiring Redis.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; retryAfterMs: number } {
  const now = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterMs: 0 };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfterMs: Math.max(0, bucket.resetAt - now) };
  }
  return { ok: true, retryAfterMs: 0 };
}

/** Best-effort identity for rate-limiting a request. */
export function clientIdentity(req: NextRequest | Request): string {
  const xfwd = req.headers.get("x-forwarded-for");
  const ip =
    (xfwd ? xfwd.split(",")[0].trim() : "") ||
    req.headers.get("x-real-ip") ||
    "0.0.0.0";
  return ip;
}

// ---------------------------------------------------------------------------
// Public-chat content clamp
// ---------------------------------------------------------------------------

export const PUBLIC_MESSAGE_MAX_CHARS = 4000;

export function clampPublicMessage(text: unknown): string {
  if (typeof text !== "string") return "";
  const trimmed = text.trim();
  if (trimmed.length <= PUBLIC_MESSAGE_MAX_CHARS) return trimmed;
  return trimmed.slice(0, PUBLIC_MESSAGE_MAX_CHARS);
}

// ---------------------------------------------------------------------------
// Response helpers
// ---------------------------------------------------------------------------

export function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function rateLimitResponse(retryAfterMs: number): Response {
  const retryAfterSec = Math.max(1, Math.ceil(retryAfterMs / 1000));
  return new Response(
    JSON.stringify({ error: "Rate limit exceeded" }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSec),
      },
    }
  );
}
