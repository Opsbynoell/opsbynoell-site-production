/**
 * Pure runner behind GET /api/cron/pci-generate.
 *
 * Loads every client_id, asks each one for its PCI cron tier, and
 * invokes a per-client generator for those whose tier matches the
 * incoming `tier` parameter. One client failing must not stop the
 * loop — failures are collected into the response.
 *
 * The route (src/app/api/cron/pci-generate/route.ts) wires the real
 * Supabase reads, the real `getClientConfig`, and a `generateForClient`
 * that delegates to `handleGenerate`. Tests here pass stubs.
 */

import type { PciCronTier } from "../agents/types";

/** The two tiers that drive a scheduled run. "disabled" is opt-out. */
export type PciCronTierName = "standard" | "realtime";

export interface CronGenerateDeps {
  /** Returns every client_id known to the system. */
  listClientIds: () => Promise<string[]>;
  /** Returns the tier configured for one client. */
  getTierFor: (clientId: string) => Promise<PciCronTier>;
  /** Performs the signal generation for one client. May throw. */
  generateForClient: (clientId: string) => Promise<void>;
}

export interface CronGenerateResult {
  ok: true;
  tier: PciCronTierName;
  processed: number;
  succeeded: number;
  failed: number;
  errors: Array<{ clientId: string; error: string }>;
}

/**
 * Parse the `tier` query string. Anything other than "realtime" falls
 * through to "standard" so a missing or malformed value still produces
 * a deterministic run.
 */
export function parseTier(searchParams: URLSearchParams): PciCronTierName {
  const raw = searchParams.get("tier");
  return raw === "realtime" ? "realtime" : "standard";
}

export async function runPciGenerateCron(
  tier: PciCronTierName,
  deps: CronGenerateDeps
): Promise<CronGenerateResult> {
  const ids = await deps.listClientIds();
  const errors: Array<{ clientId: string; error: string }> = [];
  let succeeded = 0;
  let processed = 0;

  for (const clientId of ids) {
    let clientTier: PciCronTier;
    try {
      clientTier = await deps.getTierFor(clientId);
    } catch (e) {
      errors.push({ clientId, error: (e as Error).message });
      continue;
    }
    if (clientTier !== tier) continue;

    processed++;
    try {
      await deps.generateForClient(clientId);
      succeeded++;
    } catch (e) {
      errors.push({ clientId, error: (e as Error).message });
    }
  }

  return {
    ok: true,
    tier,
    processed,
    succeeded,
    failed: errors.length,
    errors,
  };
}
