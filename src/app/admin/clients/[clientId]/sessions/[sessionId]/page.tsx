/**
 * Per-client session detail (stub).
 *
 * The existing per-session view lives at /admin/sessions/[id] and is fully
 * functional. Until we build a client-scoped variant, redirect there so the
 * dashboard click-through works end-to-end.
 */

import { redirect } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ClientSessionRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ clientId: string; sessionId: string }>;
  searchParams: Promise<{ agent?: string }>;
}) {
  const { sessionId } = await params;
  const { agent } = await searchParams;
  const qs = agent ? `?agent=${encodeURIComponent(agent)}` : "";
  redirect(`/admin/sessions/${sessionId}${qs}`);
}
