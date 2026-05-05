/**
 * GET /api/cron/pci-generate?tier=standard|realtime
 *
 * Vercel cron entry point for scheduled PCI signal generation.
 *
 *   tier=standard  → fired daily at 1am Pacific
 *   tier=realtime  → fired every 6 hours at 1am, 7am, 1pm, 7pm Pacific
 *
 * Per-client tier is read from clients.pci_config.cronTier, surfaced
 * as ClientConfig.pciCronTier. Clients without a tier are treated as
 * "disabled" and skipped by both schedules. The pure logic lives in
 * src/lib/pci/cron-generate-handler.ts so the route is a thin adapter.
 *
 * The route uses the standard Response.json helper rather than
 * NextResponse.json so the unit test under __tests__/route.test.ts
 * can import it without a Next.js runtime present. Functionally
 * identical: NextResponse.json is a thin wrapper around the same
 * Response constructor.
 */

import { getClientConfig } from "@/lib/agents/config";
import { assertCron } from "@/lib/agents/cron-auth";
import { sbSelect } from "@/lib/agents/supabase";
import {
  runPciGenerateCron,
  type PciCronRunTier,
} from "@/lib/pci/cron-generate-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ClientIdRow {
  client_id: string;
}

function parseTier(raw: string | null): PciCronRunTier {
  if (raw === "realtime") return "realtime";
  return "standard";
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function GET(req: Request): Promise<Response> {
  try {
    assertCron(req);
  } catch {
    return jsonResponse({ error: "unauthorized" }, 401);
  }

  const url = new URL(req.url);
  const tier = parseTier(url.searchParams.get("tier"));

  let rows: ClientIdRow[];
  try {
    rows = await sbSelect<ClientIdRow>(
      "clients",
      {},
      { select: "client_id" }
    );
  } catch (e) {
    console.error("[cron/pci-generate] client list load failed:", e);
    return jsonResponse({ error: "client list load failed" }, 500);
  }

  const clientIds = rows.map((r) => r.client_id);

  const result = await runPciGenerateCron({
    tier,
    clientIds,
    loadConfig: getClientConfig,
  });

  return jsonResponse(result);
}
