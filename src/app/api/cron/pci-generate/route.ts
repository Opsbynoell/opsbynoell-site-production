/**
 * GET /api/cron/pci-generate?tier=standard|realtime
 *
 * Vercel cron entry point that runs PCI signal generation for every
 * client whose `pciCronTier` matches the incoming `tier` query string.
 * Two scheduled invocations are wired in `vercel.json`:
 *
 *   tier=standard  → 0 8 * * *           (1am Pacific, nightly)
 *   tier=realtime  → 0 8,14,20,2 * * *   (1am, 7am, 1pm, 7pm Pacific)
 *
 * Clients without a tier (or set to "disabled") are skipped by both.
 * Auth is the shared `assertCron` bearer-secret check used by the other
 * cron routes. Generation logic delegates to `handleGenerate` so the
 * scope and validation rules stay aligned with the manual admin path.
 */

import { NextResponse } from "next/server";
import { assertCron } from "@/lib/agents/cron-auth";
import { getClientConfig } from "@/lib/agents/config";
import { sbSelect } from "@/lib/agents/supabase";
import { handleGenerate } from "@/lib/pci/generate-handler";
import { parseTier, runPciGenerateCron } from "@/lib/pci/cron-generate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  try {
    assertCron(req);
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const tier = parseTier(new URL(req.url).searchParams);

  const result = await runPciGenerateCron(tier, {
    listClientIds: async () => {
      const rows = await sbSelect<{ client_id: string }>(
        "clients",
        {},
        { select: "client_id" }
      );
      return rows.map((r) => r.client_id);
    },
    getTierFor: async (clientId) => {
      const cfg = await getClientConfig(clientId);
      return cfg.pciCronTier ?? "disabled";
    },
    generateForClient: async (clientId) => {
      const res = await handleGenerate({
        session: {
          userId: "cron",
          email: "cron@opsbynoell.com",
          isSuperAdmin: true,
          accessibleClients: [],
          exp: Date.now() + 60_000,
        },
        body: { clientIds: [clientId], dryRun: false },
      });
      if (res.status !== 200) {
        const body = res.body as { error?: string };
        throw new Error(
          body?.error ?? `pci generate failed (status ${res.status})`
        );
      }
    },
  });

  return NextResponse.json(result);
}
