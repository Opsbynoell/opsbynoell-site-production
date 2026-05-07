/**
 * GET /api/client/me
 *
 * Returns the current client portal user's identity and subscription status.
 * Protected by proxy.ts middleware.
 */
import { NextResponse } from "next/server";
import { sbSelect } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SubscriptionRow {
  id: string;
  plan_id: string;
  status: string;
  amount_cents: number;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

interface CustomerRow {
  id: string;
  email: string;
  name: string | null;
  stripe_customer_id: string;
}

export async function GET(req: Request): Promise<Response> {
  const headers = req.headers;
  const clientId = headers.get("x-client-id");
  const email = headers.get("x-client-email");
  const name = headers.get("x-client-name");

  if (!clientId || !email) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Fetch subscription status
  let subscription: SubscriptionRow | null = null;
  try {
    const customers = await sbSelect<CustomerRow>(
      "customers",
      { email: `eq.${email}` },
      { limit: 1 }
    );
    if (customers[0]) {
      const subs = await sbSelect<SubscriptionRow>(
        "subscriptions",
        {
          customer_id: `eq.${customers[0].id}`,
          status: "eq.active",
        },
        { limit: 1, order: "created_at.desc" }
      );
      subscription = subs[0] ?? null;
    }
  } catch {
    // Non-critical — return auth info without subscription
  }

  return NextResponse.json({
    authenticated: true,
    clientId,
    email,
    name,
    subscription: subscription
      ? {
          planId: subscription.plan_id,
          status: subscription.status,
          amountCents: subscription.amount_cents,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        }
      : null,
  });
}
