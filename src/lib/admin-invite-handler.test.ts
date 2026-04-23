/**
 * Tests for handleAdminInvite().
 *
 * Covers:
 *   1. 403 when the caller is not a super admin
 *   2. Successful invite inserts a user, stores a token, sends email
 *   3. 409 when the target email already has a password set
 */

import { strict as assert } from "node:assert";
import { mock, test } from "node:test";

// ── Mocks ───────────────────────────────────────────────────────────────────

type InsertCall = { table: string; row: Record<string, unknown> };
type SelectCall = { table: string; params: Record<string, unknown> };

const insertCalls: InsertCall[] = [];
const selectCalls: SelectCall[] = [];
const emailCalls: Array<{ toEmail: string; inviteUrl: string }> = [];

// Overrideable return for sbSelect(admin_users, …).
let existingUser: Record<string, unknown> | null = null;

mock.module("./agents/supabase.ts", {
  namedExports: {
    sbSelect: async (table: string, params: Record<string, unknown>) => {
      selectCalls.push({ table, params });
      if (table === "admin_users" && existingUser) return [existingUser];
      return [];
    },
    sbInsert: async (table: string, row: Record<string, unknown>) => {
      insertCalls.push({ table, row });
      if (table === "admin_users") return { id: "user-uuid-123", ...row };
      return { id: `row-${insertCalls.length}`, ...row };
    },
    sbUpdate: async () => [],
    sbUpsert: async () => ({}),
  },
});

mock.module("./admin-invite-email.ts", {
  namedExports: {
    sendAdminInviteEmail: async (p: { toEmail: string; inviteUrl: string }) => {
      emailCalls.push(p);
      return { ok: true };
    },
  },
});

const { handleAdminInvite } = await import("./admin-invite-handler.ts");

function resetMocks() {
  insertCalls.length = 0;
  selectCalls.length = 0;
  emailCalls.length = 0;
  existingUser = null;
}

const baseInput = {
  email: "test@example.com",
  isSuperAdmin: false,
  accessibleClients: [] as string[],
  buildInviteUrl: (t: string) => `https://example.com/admin/accept-invite?token=${t}`,
};

// ── Tests ───────────────────────────────────────────────────────────────────

test("returns 403 when caller is not super admin", async () => {
  resetMocks();
  const res = await handleAdminInvite({ ...baseInput, callerIsSuperAdmin: false });

  assert.equal(res.status, 403);
  assert.equal(res.body.error, "Forbidden");
  assert.equal(insertCalls.length, 0);
  assert.equal(emailCalls.length, 0);
});

test("invite creates user + token row and sends email", async () => {
  resetMocks();
  const res = await handleAdminInvite({
    ...baseInput,
    callerIsSuperAdmin: true,
    email: "NEW.user@Example.com",
    accessibleClients: ["santa"],
  });

  assert.equal(res.status, 201);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.userId, "user-uuid-123");
  assert.equal(res.body.emailSent, true);

  // admin_users insert — email normalized, password_hash null
  const userInsert = insertCalls.find((c) => c.table === "admin_users");
  assert.ok(userInsert, "expected admin_users insert");
  assert.equal(userInsert.row.email, "new.user@example.com");
  assert.equal(userInsert.row.password_hash, null);
  assert.equal(userInsert.row.is_super_admin, false);

  // user_clients insert
  const ucInsert = insertCalls.find((c) => c.table === "user_clients");
  assert.ok(ucInsert, "expected user_clients insert");
  assert.equal(ucInsert.row.user_id, "user-uuid-123");
  assert.equal(ucInsert.row.client_id, "santa");

  // admin_invite_tokens insert — stores hash, not plaintext
  const tokenInsert = insertCalls.find((c) => c.table === "admin_invite_tokens");
  assert.ok(tokenInsert, "expected admin_invite_tokens insert");
  assert.equal(tokenInsert.row.user_id, "user-uuid-123");
  assert.ok(typeof tokenInsert.row.token_hash === "string");
  assert.equal((tokenInsert.row.token_hash as string).length, 64); // sha256 hex
  const expiresAt = new Date(tokenInsert.row.expires_at as string).getTime();
  const expectedMin = Date.now() + 47 * 60 * 60 * 1000;
  const expectedMax = Date.now() + 49 * 60 * 60 * 1000;
  assert.ok(
    expiresAt >= expectedMin && expiresAt <= expectedMax,
    `expires_at should be ~48h out, got ${new Date(expiresAt).toISOString()}`
  );

  // Email sent to the normalized address, URL contains a token
  assert.equal(emailCalls.length, 1);
  assert.equal(emailCalls[0].toEmail, "new.user@example.com");
  assert.match(emailCalls[0].inviteUrl, /\/admin\/accept-invite\?token=/);
});

test("returns 409 when email already has a password set", async () => {
  resetMocks();
  existingUser = {
    id: "existing-uuid",
    email: "test@example.com",
    password_hash: "pbkdf2:100000:SHA-256:aa:bb",
    is_super_admin: false,
  };

  const res = await handleAdminInvite({ ...baseInput, callerIsSuperAdmin: true });

  assert.equal(res.status, 409);
  assert.equal(res.body.error, "Email already exists");
  assert.equal(insertCalls.length, 0);
  assert.equal(emailCalls.length, 0);
});
