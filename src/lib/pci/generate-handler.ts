/**
 * Pure request handler behind POST /api/admin/pci/generate.
 *
 * Split out from the Next.js route so the authorization + scoping +
 * body-validation logic is unit-testable without constructing
 * NextRequest / NextResponse objects. The route (see
 * src/app/api/admin/pci/generate/route.ts) is a thin adapter.
 */

import {
  generateSignals,
  isSupportedRule,
  SUPPORTED_RULES,
  type GenerateResult,
  type SupportedRule,
} from "./ingest";
import type { AdminTokenPayload } from "../admin-auth";

export interface GenerateHandlerInput {
  /** Verified admin session payload, or `null` when the caller is unauthenticated. */
  session: AdminTokenPayload | null;
  /** Parsed JSON body (or `null` when none). */
  body: unknown;
  /**
   * Injected generator. Tests pass a stub; the route uses the real
   * `generateSignals`. Must accept the same options shape as ingest.ts.
   */
  run?: typeof generateSignals;
}

export interface GenerateHandlerResponse {
  status: number;
  body: GenerateResult | { error: string };
}

function err(status: number, message: string): GenerateHandlerResponse {
  return { status, body: { error: message } };
}

export async function handleGenerate(
  input: GenerateHandlerInput
): Promise<GenerateHandlerResponse> {
  if (!input.session) return err(401, "Unauthorized");

  const raw = input.body as
    | {
        dryRun?: unknown;
        rules?: unknown;
        clientIds?: unknown;
        limit?: unknown;
      }
    | null
    | undefined;
  const body = raw ?? {};

  // dryRun defaults TRUE — explicit `false` required to persist.
  const dryRun = body.dryRun === false ? false : true;

  // rules — validated subset of SUPPORTED_RULES.
  let rules: readonly SupportedRule[] = SUPPORTED_RULES;
  if (body.rules !== undefined) {
    if (!Array.isArray(body.rules)) return err(400, "rules must be an array.");
    const cleaned: SupportedRule[] = [];
    for (const r of body.rules) {
      if (typeof r !== "string" || !isSupportedRule(r)) {
        return err(400, `Unsupported rule: ${String(r)}`);
      }
      cleaned.push(r);
    }
    if (cleaned.length === 0) return err(400, "rules must be non-empty.");
    rules = cleaned;
  }

  // limit — 1..500, default 200.
  let limit = 200;
  if (body.limit !== undefined) {
    const n =
      typeof body.limit === "number"
        ? body.limit
        : parseInt(String(body.limit), 10);
    if (!Number.isFinite(n) || n < 1 || n > 500) {
      return err(400, "limit must be a number between 1 and 500.");
    }
    limit = Math.floor(n);
  }

  // Scope:
  //   super admin → may pass clientIds; omitting means "all clients" (null).
  //   non-super   → forced to accessibleClients; clientIds body is forbidden.
  let client_ids: string[] | null;
  if (input.session.isSuperAdmin) {
    if (body.clientIds === undefined) {
      client_ids = null;
    } else {
      if (!Array.isArray(body.clientIds)) {
        return err(400, "clientIds must be an array of strings.");
      }
      const ids: string[] = [];
      for (const id of body.clientIds) {
        if (typeof id !== "string" || id.length === 0) {
          return err(400, "clientIds must be an array of non-empty strings.");
        }
        ids.push(id);
      }
      client_ids = ids;
    }
  } else {
    if (body.clientIds !== undefined) {
      return err(403, "Only super admins may set clientIds.");
    }
    client_ids = input.session.accessibleClients;
  }

  const runner = input.run ?? generateSignals;
  const result = await runner({ client_ids, rules, limit, dryRun });
  return { status: 200, body: result };
}
