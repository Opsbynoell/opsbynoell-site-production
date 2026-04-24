/**
 * PCI v0 — execution handoff interface.
 *
 * The intelligence layer (Supabase) creates and resolves signals.
 * The execution layer (GHL) applies tags, creates tasks, and drives
 * SMS/email sequences. This file is the seam between them.
 *
 * v0 intentionally ships this as a typed no-op interface. v1 wires
 * the GHL API calls. Keeping the shape defined now prevents rule
 * code from accidentally reaching into GHL primitives.
 */

import type { CustomerSignal } from "./types";
import { SIGNAL_GHL_TAG } from "./types";

export interface HandoffResult {
  ok: boolean;
  /** Matches the enum in the SIGNAL_GHL_TAG table in types.ts. */
  tag_applied: string;
  /** Opaque execution-side identifier once v1 is implemented. */
  external_ref?: string;
  error?: string;
}

/**
 * v0 stub: returns the tag that WOULD be applied and logs the signal.
 * Rule runners may call this during backfill/dry-run to verify
 * downstream routing without actually touching GHL.
 *
 * TODO(v1): wire this to src/lib/agents/integrations/ghl.ts using
 * `clients.calendar_config` / `clients.sms_config` to resolve the
 * right GHL location, then POST tag + task per signal_type.
 */
export async function handoffToExecution(
  signal: CustomerSignal
): Promise<HandoffResult> {
  const tag = SIGNAL_GHL_TAG[signal.signal_type];
  return {
    ok: true,
    tag_applied: tag,
  };
}
