/**
 * Client portal session auth helpers.
 *
 * Mirrors the pattern from admin-auth.ts but for client-facing dashboard users.
 * This file is imported by src/proxy.ts (Edge Runtime) so it MUST only use
 * Web Crypto API — no Node.js built-ins.
 *
 * Token format: base64url(JSON payload).base64url(HMAC-SHA256 signature)
 */

export const CLIENT_COOKIE_NAME = "client_session";
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface ClientTokenPayload {
  userId: string;
  email: string;
  clientId: string;
  name: string;
  exp: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Base64url helpers (Edge Runtime safe)
// ─────────────────────────────────────────────────────────────────────────────
function toBase64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function strToBase64url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64urlToStr(b64: string): string {
  const padded = b64.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  const padded2 = pad ? padded + "=".repeat(4 - pad) : padded;
  const binary = atob(padded2);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

// ─────────────────────────────────────────────────────────────────────────────
// HMAC signing
// ─────────────────────────────────────────────────────────────────────────────
function getSecret(): string {
  const s = process.env.CLIENT_PORTAL_SECRET ?? process.env.ADMIN_SECRET;
  if (!s) throw new Error("CLIENT_PORTAL_SECRET env var required");
  return s;
}

async function hmacSign(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return toBase64url(sig);
}

// ─────────────────────────────────────────────────────────────────────────────
// Token creation / verification
// ─────────────────────────────────────────────────────────────────────────────
export async function createClientToken(
  payload: Omit<ClientTokenPayload, "exp">
): Promise<string> {
  const full: ClientTokenPayload = { ...payload, exp: Date.now() + TOKEN_TTL_MS };
  const encoded = strToBase64url(JSON.stringify(full));
  const sig = await hmacSign(getSecret(), encoded);
  return `${encoded}.${sig}`;
}

export async function verifyClientToken(
  token: string | undefined
): Promise<ClientTokenPayload | null> {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;
  const encoded = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  try {
    const expected = await hmacSign(getSecret(), encoded);
    if (expected !== sig) return null;
    const payload = JSON.parse(base64urlToStr(encoded)) as ClientTokenPayload;
    if (typeof payload.exp !== "number" || Date.now() >= payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}
