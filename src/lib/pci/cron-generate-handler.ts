/**
 * Pure cron handler for scheduled PCI signal generation.
 *
 * Split out from the Next.js route (see
 * src/app/api/cron/pci-generate/route.ts) so the tier-filter +
 * per-client error-isolation logic is unit-testable without
 * NextRequest / NextResponse.
 *
 * Loop semantics:
 *   - For each client_id, load its ClientConfig and inspect
 *     pciCronTier (defaults to "disabled" when absent).
 *   - Skip clients whose tier does not match the run's tier.
 *   - For matching clients, invoke the existing handleGenerate
 *     pure function with a synthetic super-admin session so the
 *     scope rules let us pass clientIds explicitly.
 *   - One client failing must not stop the loop. Per-client errors
 *     accumulate in the errors array.
 *
 * Why a synthetic session: handleGenerate already enforces the
 * scope contract that admin requests rely on. Passing a super-admin
 * session lets the cron reuse the same code path the admin route
 * takes. same generator call, same persistence, same return shape.
 * The session never leaves this process.
 */

import {
  handleGenerate,
  type GenerateHandlerInput,
} from "./generate-handler";
import type { AdminTokenPayload } from "../admin-auth";
import type { ClientConfig } from "../agents/types";

export type PciCronRunTier = "standard" | "realtime";

export interface CronGenerateInput {
  /** Run tier. only clients with this exact pciCronTier are processed. */
  tier: PciCronRunTier;
  /** All client_ids known to the system. The handler filters internally. */
  clientIds: string[];
  /** Resolves a ClientConfig for a clientId. Tests pass a stub. */
  loadConfig: (clientId: string) => Promise<ClientConfig>;
  /**
   * Optional injected generator. Tests pass a stub; the route uses
   * the real generateSignals. Forwarded to handleGenerate.
   */
  run?: GenerateHandlerInput["run"];
  /** Deterministic clock for the synthetic session expiry. */
  now?: () => number;
}

export interface CronGenerateError {
  clientId: string;
  error: string;
}

export interface CronGenerateResponse {
  ok: true;
  tier: PciCronRunTier;
  processed: number;
  succeeded: number;
  failed: number;
  errors: CronGenerateError[];
}

const SYNTHETIC_SESSION_EMAIL = "cron@opsbynoell.com";
const SYNTHETIC_SESSION_USER_ID = "cron";

export async function runPciGenerateCron(
  input: CronGenerateInput
): Promise<CronGenerateResponse> {
  const errors: CronGenerateError[] = [];
  let processed = 0;
  let succeeded = 0;

  for (const clientId of input.clientIds) {
    let cfg: ClientConfig;
    try {
      cfg = await input.loadConfig(clientId);
    } catch (e) {
      // Config load failures are surfaced but do not count toward
      // processed/failed for this tier (we cannot determine which
      // tier the client belongs to). Logged so an alert pipeline can
      // pick them up if wired.
      console.error(
        "[cron/pci-generate] config load failed",
        clientId,
        (e as Error).message
      );
      continue;
    }

    const tier = cfg.pciCronTier ?? "disabled";
    if (tier !== input.tier) continue;

    processed += 1;

    const session: AdminTokenPayload = {
      userId: SYNTHETIC_SESSION_USER_ID,
      email: SYNTHETIC_SESSION_EMAIL,
      isSuperAdmin: true,
      accessibleClients: [],
      exp: (input.now?.() ?? Date.now()) + 60_000,
    };

    try {
      const result = await handleGenerate({
        session,
        body: { dryRun: false, clientIds: [clientId] },
        run: input.run,
      });
      if (result.status >= 200 && result.status < 300) {
        succeeded += 1;
      } else {
        const body = result.body as { error?: string };
        errors.push({
          clientId,
          error:
            body.error ?? `handleGenerate returned status ${result.status}`,
        });
      }
    } catch (e) {
      errors.push({ clientId, error: (e as Error).message });
    }
  }

  return {
    ok: true,
    tier: input.tier,
    processed,
    succeeded,
    failed: errors.length,
    errors,
  };
}
