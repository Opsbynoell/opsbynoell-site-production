/**
 * Pure-logic handler for POST /api/admin/users/invite.
 *
 * Split out of the route so unit tests can exercise the flow without
 * constructing a full NextRequest or booting the Supabase REST client.
 *
 *   route.ts: auth → parse JSON → build invite URL → call this handler
 *   handler:  validate email → insert user → insert token → send email
 */

import { sbInsert, sbSelect } from "./agents/supabase";
import {
  generateInviteToken,
  hashInviteToken,
  INVITE_TTL_MS,
} from "./admin-invite-token";
import { sendAdminInviteEmail } from "./admin-invite-email";

export interface InviteHandlerInput {
  callerIsSuperAdmin: boolean;
  email: string | undefined;
  isSuperAdmin?: boolean;
  accessibleClients?: string[];
  /** Build the accept-invite URL from the plaintext token. */
  buildInviteUrl: (token: string) => string;
}

export interface InviteHandlerResult {
  status: number;
  body: {
    ok?: true;
    userId?: string;
    emailSent?: boolean;
    emailError?: string;
    error?: string;
  };
}

interface AdminUserRow {
  id: string;
  email: string;
  password_hash: string | null;
  is_super_admin: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function handleAdminInvite(
  input: InviteHandlerInput
): Promise<InviteHandlerResult> {
  if (!input.callerIsSuperAdmin) {
    return { status: 403, body: { error: "Forbidden" } };
  }

  const email = input.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return { status: 400, body: { error: "valid email required" } };
  }

  const isSuperAdmin = input.isSuperAdmin === true;
  const accessibleClients = Array.isArray(input.accessibleClients)
    ? input.accessibleClients.map((s) => String(s).trim()).filter(Boolean)
    : [];

  let existing: AdminUserRow | null = null;
  try {
    const rows = await sbSelect<AdminUserRow>(
      "admin_users",
      { email: `eq.${email}` },
      { limit: 1 }
    );
    existing = rows[0] ?? null;
  } catch {
    return { status: 500, body: { error: "DB error" } };
  }

  if (existing && existing.password_hash) {
    return { status: 409, body: { error: "Email already exists" } };
  }

  let userId: string;
  if (existing) {
    userId = existing.id;
  } else {
    try {
      const created = await sbInsert<{ id: string }>("admin_users", {
        email,
        password_hash: null,
        is_super_admin: isSuperAdmin,
      });
      userId = created.id;
    } catch {
      return { status: 500, body: { error: "Failed to create user" } };
    }

    if (!isSuperAdmin && accessibleClients.length > 0) {
      try {
        for (const clientId of accessibleClients) {
          await sbInsert("user_clients", { user_id: userId, client_id: clientId });
        }
      } catch {
        // Non-fatal
      }
    }
  }

  const token = generateInviteToken();
  const tokenHash = await hashInviteToken(token);
  const expiresAt = new Date(Date.now() + INVITE_TTL_MS).toISOString();

  try {
    await sbInsert("admin_invite_tokens", {
      token_hash: tokenHash,
      user_id: userId,
      expires_at: expiresAt,
    });
  } catch {
    return {
      status: 500,
      body: { error: "Failed to create invite token" },
    };
  }

  const inviteUrl = input.buildInviteUrl(token);
  const emailResult = await sendAdminInviteEmail({ toEmail: email, inviteUrl });

  return {
    status: 201,
    body: {
      ok: true,
      userId,
      emailSent: emailResult.ok,
      emailError: emailResult.ok ? undefined : emailResult.error,
    },
  };
}
