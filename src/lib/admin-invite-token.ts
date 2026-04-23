/**
 * Magic-link invite token helpers.
 *
 * Tokens are 32 random bytes encoded as base64url. The plaintext token
 * is emailed to the invitee; only the SHA-256 hash is stored in the
 * database, so a DB leak never exposes usable invite links.
 *
 * Uses the Web Crypto API so this file is safe to import from both
 * Node.js routes and the Edge runtime.
 */

export const INVITE_TTL_MS = 48 * 60 * 60 * 1000; // 48 hours

function toBase64url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/** Random 32-byte invite token, base64url encoded (43 chars). */
export function generateInviteToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return toBase64url(bytes);
}

/** SHA-256 hash of the token, hex encoded. This is what we store. */
export async function hashInviteToken(token: string): Promise<string> {
  const data = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
