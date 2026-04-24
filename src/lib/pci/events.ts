/**
 * PCI v0 — event stream helpers.
 *
 * `recordEvent()` is the single entry point the agent backend should
 * use to normalize an operational action into the PCI stream. The
 * three agent handlers call this alongside their existing writes.
 *
 * Intentionally tolerant: failure to record an event must not break
 * the agent's primary flow. Callers should `await` but wrap in a
 * try/catch or fire-and-forget pattern as appropriate.
 */

import { sbInsert, sbSelect } from "../agents/supabase";
import type { AgentSource, CustomerEvent, CustomerEventType } from "./types";

const TABLE = "customer_events";

export interface RecordEventArgs {
  client_id: string;
  event_type: CustomerEventType;
  event_source: string;
  agent_source?: AgentSource | null;
  contact_id?: string | null;
  session_id?: string | null;
  appointment_id?: string | null;
  conversation_message_id?: string | null;
  service_interest?: string | null;
  channel?: string | null;
  occurred_at?: string;
  metadata?: Record<string, unknown>;
}

export async function recordEvent(
  args: RecordEventArgs
): Promise<CustomerEvent> {
  return sbInsert<CustomerEvent>(TABLE, {
    client_id: args.client_id,
    contact_id: args.contact_id ?? null,
    event_type: args.event_type,
    event_source: args.event_source,
    agent_source: args.agent_source ?? null,
    session_id: args.session_id ?? null,
    appointment_id: args.appointment_id ?? null,
    conversation_message_id: args.conversation_message_id ?? null,
    service_interest: args.service_interest ?? null,
    channel: args.channel ?? null,
    occurred_at: args.occurred_at ?? new Date().toISOString(),
    metadata: args.metadata ?? {},
  });
}

export async function recentEventsForContact(
  contact_id: string,
  limit = 50
): Promise<CustomerEvent[]> {
  return sbSelect<CustomerEvent>(
    TABLE,
    { contact_id: `eq.${contact_id}` },
    { order: "occurred_at.desc", limit }
  );
}

export async function recentEventsForClient(
  client_id: string,
  limit = 100
): Promise<CustomerEvent[]> {
  return sbSelect<CustomerEvent>(
    TABLE,
    { client_id: `eq.${client_id}` },
    { order: "occurred_at.desc", limit }
  );
}
