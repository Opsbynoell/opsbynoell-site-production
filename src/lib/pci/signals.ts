/**
 * PCI v0 — signal persistence helpers.
 *
 * Thin wrappers over the PostgREST helpers in
 * src/lib/agents/supabase.ts. Uses the service-role key and bypasses
 * RLS, matching the rest of the agent backend.
 *
 * Duplicate control relies on the partial unique indexes defined in
 * the 0007 migration. `openSignalFor()` reads before writing so rule
 * code can skip work when an open signal already exists, rather than
 * relying on an insert conflict.
 */

import { sbInsert, sbSelect } from "@/lib/agents/supabase";
import type {
  CustomerSignal,
  SignalDraft,
  SignalSeverity,
  SignalStatus,
  SignalType,
} from "./types";

const TABLE = "customer_signals";

export async function openSignalFor(args: {
  client_id: string;
  contact_id: string | null;
  signal_type: SignalType;
}): Promise<CustomerSignal | null> {
  const params: Record<string, string> = {
    client_id: `eq.${args.client_id}`,
    signal_type: `eq.${args.signal_type}`,
    status: "in.(open,in_progress)",
  };
  params.contact_id =
    args.contact_id === null ? "is.null" : `eq.${args.contact_id}`;

  const rows = await sbSelect<CustomerSignal>(TABLE, params, {
    order: "created_at.desc",
    limit: 1,
  });
  return rows[0] ?? null;
}

/**
 * Create a new signal from a rule draft, unless an open signal of the
 * same (client, contact, type) already exists. Returns either the
 * inserted row or the existing open row.
 */
export async function upsertSignalFromDraft(
  draft: SignalDraft
): Promise<{ signal: CustomerSignal; created: boolean }> {
  const existing = await openSignalFor({
    client_id: draft.client_id,
    contact_id: draft.contact_id,
    signal_type: draft.signal_type,
  });
  if (existing) return { signal: existing, created: false };

  const inserted = await sbInsert<CustomerSignal>(TABLE, {
    client_id: draft.client_id,
    contact_id: draft.contact_id,
    signal_type: draft.signal_type,
    severity: draft.severity,
    confidence: draft.confidence,
    reason: draft.reason,
    recommended_action: draft.recommended_action,
    estimated_value: draft.estimated_value ?? null,
    source_event_ids: draft.source_event_ids ?? [],
    source_table: draft.source_table ?? null,
    source_record_id: draft.source_record_id ?? null,
    expires_at: draft.expires_at ?? null,
  });
  return { signal: inserted, created: true };
}

/**
 * Semantic severity ordering. PostgREST can only sort lexicographically
 * on the `severity` text column ("high" < "low" < "medium" < "urgent"),
 * which is not the urgency order we want to surface. We run one query
 * per severity bucket in semantic order, each bucket fully ordered by
 * created_at DESC and capped at the caller's limit, then concatenate
 * and slice. This guarantees the semantic sort is applied BEFORE the
 * final LIMIT.
 */
const SEVERITY_ORDER: readonly SignalSeverity[] = [
  "urgent",
  "high",
  "medium",
  "low",
] as const;

export async function listOpenSignals(args: {
  client_ids: string[] | null;
  signal_type?: SignalType;
  limit?: number;
}): Promise<CustomerSignal[]> {
  const limit = args.limit ?? 200;

  const baseParams: Record<string, string> = {
    status: "in.(open,in_progress)",
  };
  if (args.client_ids !== null) {
    if (args.client_ids.length === 0) return [];
    baseParams.client_id = `in.(${args.client_ids.map(encodeURIComponent).join(",")})`;
  }
  if (args.signal_type) baseParams.signal_type = `eq.${args.signal_type}`;

  const out: CustomerSignal[] = [];
  for (const severity of SEVERITY_ORDER) {
    if (out.length >= limit) break;
    const remaining = limit - out.length;
    const rows = await sbSelect<CustomerSignal>(
      TABLE,
      { ...baseParams, severity: `eq.${severity}` },
      { order: "created_at.desc", limit: remaining }
    );
    out.push(...rows);
  }
  return out;
}

export async function updateSignalStatus(args: {
  id: string;
  status: SignalStatus;
}): Promise<void> {
  // Minimal update — kept separate from sbUpdate generic so callers
  // can't accidentally rewrite severity/reason.
  const patch: Record<string, unknown> = { status: args.status };
  if (args.status === "resolved") patch.resolved_at = new Date().toISOString();
  const { sbUpdate } = await import("@/lib/agents/supabase");
  await sbUpdate(TABLE, { id: `eq.${args.id}` }, patch);
}
