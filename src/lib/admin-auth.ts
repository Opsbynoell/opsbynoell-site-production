/**
 * Admin session auth helpers — multi-tenant edition.
 *
 * Uses the Web Crypto API (crypto.subtle) throughout — compatible with
 * both Edge Runtime (middleware) and Node.js >= 18 (API routes).
 *
 * Token format: base64url(JSON payload).base64url(HMAC-SHA256 signature)
 *
 * Payload shape:
 *   {
 *     userId: string;
 *     email: string;
 *     isSuperAdmin: boolean;
 *     accessibleClients: string[];   // populated from user_clients join table
 *     exp: number;                   // Unix ms expiry
 *   }
 *
 * Middleware reads user metadata from the cookie without a DB round-trip.
 * API routes receive that metadata via x-admin-* request headers injected
 * by middleware.
 *
 * Password hashing: PBKDF2-SHA-256, 100 000 iterations.
 * Hash format stored in DB:  pbkdf2:100000:SHA-256:<salt_hex>:<hash_hex>
 *
 * Legacy fallback: if the users table lookup fails, checkLegacyPassword()
 * compares against the ADMIN_PASSWORD env var (plain-text) for backward
 * compatibility during the migration cutover.
 *
 * Required env vars:
 *   ADMIN_SECRET     — 32+ char secret for signing session tokens
 *   ADMIN_PASSWORD   — (legacy) plain-text password for old single-user login
 */

const COOKIE_NAME = "admin_session";
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface AdminTokenPayload {
  userId: string;
  email: string;
  isSuperAdmin: boolean;
  accessibleClients: string[];
  exp: number;
}

// ----------------------------------------------------------------
// Base64url helpers (Edge + Node.js compatible)
// ----------------------------------------------------------------

function toBase64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function strToBase64url(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64urlToStr(b64: string): string {
  const padded = b64.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  const padded2 = pad ? padded + "=".repeat(4 - pad) : padded;
  return decodeURIComponent(escape(atob(padded2)));
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  const buffer = new ArrayBuffer(hex.length / 2);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

function bytesToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ----------------------------------------------------------------
// HMAC signing (token auth)
// ----------------------------------------------------------------

function getSecret(): string {
  const s = process.env.ADMIN_SECRET ?? process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("ADMIN_SECRET env var required");
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

// ----------------------------------------------------------------
// Token creation / verification
// ----------------------------------------------------------------

export async function createToken(
  payload: Omit<AdminTokenPayload, "exp">
): Promise<string> {
  const full: AdminTokenPayload = {
    ...payload,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const encoded = strToBase64url(JSON.stringify(full));
  const sig = await hmacSign(getSecret(), encoded);
  return `${encoded}.${sig}`;
}

export async function verifyToken(
  token: string | undefined
): Promise<AdminTokenPayload | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encoded, sig] = parts;
  try {
    const expected = await hmacSign(getSecret(), encoded);
    if (expected !== sig) return null;
    const payload = JSON.parse(base64urlToStr(encoded)) as AdminTokenPayload;
    if (typeof payload.exp !== "number" || Date.now() >= payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// ----------------------------------------------------------------
// PBKDF2 password hashing
// ----------------------------------------------------------------

/**
 * Hash a plaintext password.
 * Returns: `pbkdf2:100000:SHA-256:<salt_hex>:<hash_hex>`
 */
export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const saltBuffer = new ArrayBuffer(16);
  const salt = new Uint8Array(saltBuffer);
  crypto.getRandomValues(salt);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const saltHex = bytesToHex(salt.buffer);
  const hashHex = bytesToHex(bits);
  return `pbkdf2:100000:SHA-256:${saltHex}:${hashHex}`;
}

/**
 * Verify a plaintext password against a stored hash string.
 */
export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const parts = stored.split(":");
  if (parts.length !== 5 || parts[0] !== "pbkdf2") return false;
  const [, iterStr, hashAlgo, saltHex, expectedHex] = parts;
  const iterations = parseInt(iterStr, 10);
  if (!iterations || hashAlgo !== "SHA-256") return false;

  const enc = new TextEncoder();
  const salt = hexToBytes(saltHex);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const candidateHex = bytesToHex(bits);

  // Constant-time compare
  if (candidateHex.length !== expectedHex.length) return false;
  let diff = 0;
  for (let i = 0; i < candidateHex.length; i++) {
    diff |= candidateHex.charCodeAt(i) ^ expectedHex.charCodeAt(i);
  }
  return diff === 0;
}

// ----------------------------------------------------------------
// Legacy plain-text password fallback
// ----------------------------------------------------------------

/**
 * Compares input against the ADMIN_PASSWORD env var.
 * Used only during the transition period before all users are migrated to DB.
 */
export function checkLegacyPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  return input === pw;
}

export { COOKIE_NAME };
