/**
 * GET /api/admin/revenue
 *
 * Returns revenue metrics for the admin dashboard.
 * Protected by proxy.ts middleware (admin session required).
 */
import { NextResponse } from "next/server";
import { sbSelect } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SubscriptionRow {
  id: string;
  customer_id: string;
  stripe_subscription_id: string;
  plan_id: string;
  status: string;
  amount_cents: number;
  currency: string;
  interval: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

interface CustomerRow {
  id: string;
  client_id: string | null;
  stripe_customer_id: string;
  email: string;
  name: string | null;
  created_at: string;
}

interface OnboardingRow {
  id: string;
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  plan_id: string;
  vertical: string | null;
  booking_tool: string | null;
  provisioned: boolean;
  client_id: string | null;
  created_at: string;
}

const PLAN_LABELS: Record<string, string> = {
  agents_founding: "Noell Agents — Founding",
  agents_standard: "Noell Agents",
  essentials: "Essentials",
  growth: "Growth",
  custom_ops: "Custom Ops",
};

export async function GET(req: Request): Promise<Response> {
  const isSuperAdmin = req.headers.get("x-admin-is-super") === "1";
  if (!isSuperAdmin) {
    return NextResponse.json({ error: "Super admin required." }, { status: 403 });
  }

  const [subsResult, customersResult, onboardingResult] = await Promise.allSettled([
    sbSelect<SubscriptionRow>("subscriptions", {}, { limit: 500, order: "created_at.desc" }),
    sbSelect<CustomerRow>("customers", {}, { limit: 500, order: "created_at.desc" }),
    sbSelect<OnboardingRow>("onboarding_submissions", {}, { limit: 100, order: "created_at.desc" }),
  ]);

  const subs = subsResult.status === "fulfilled" ? subsResult.value : [];
  const customers = customersResult.status === "fulfilled" ? customersResult.value : [];
  const onboarding = onboardingResult.status === "fulfilled" ? onboardingResult.value : [];

  // Build customer map
  const customerMap = new Map<string, CustomerRow>();
  for (const c of customers) customerMap.set(c.id, c);

  // Active subscriptions
  const activeSubs = subs.filter((s) => s.status === "active");
  const mrr = activeSubs.reduce((sum, s) => {
    // Normalize to monthly
    const monthly = s.interval === "year" ? s.amount_cents / 12 : s.amount_cents;
    return sum + monthly;
  }, 0);

  // Plan breakdown
  const planBreakdown: Record<string, { count: number; mrr: number }> = {};
  for (const s of activeSubs) {
    const label = PLAN_LABELS[s.plan_id] ?? s.plan_id;
    if (!planBreakdown[label]) planBreakdown[label] = { count: 0, mrr: 0 };
    planBreakdown[label].count += 1;
    planBreakdown[label].mrr +=
      s.interval === "year" ? s.amount_cents / 12 : s.amount_cents;
  }

  // Recent subscriptions with customer info
  const recentSubs = subs.slice(0, 20).map((s) => {
    const customer = customerMap.get(s.customer_id);
    return {
      id: s.id,
      planId: s.plan_id,
      planLabel: PLAN_LABELS[s.plan_id] ?? s.plan_id,
      status: s.status,
      amountCents: s.amount_cents,
      interval: s.interval,
      cancelAtPeriodEnd: s.cancel_at_period_end,
      currentPeriodEnd: s.current_period_end,
      customer: customer
        ? {
            email: customer.email,
            name: customer.name,
            clientId: customer.client_id,
          }
        : null,
      createdAt: s.created_at,
    };
  });

  // Pending onboarding (not yet provisioned)
  const pendingOnboarding = onboarding.filter((o) => !o.provisioned).slice(0, 20);

  return NextResponse.json({
    summary: {
      mrr,
      mrrFormatted: `$${(mrr / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      activeSubscriptions: activeSubs.length,
      totalCustomers: customers.length,
      churnedThisMonth: subs.filter(
        (s) =>
          s.status === "canceled" &&
          new Date(s.updated_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length,
    },
    planBreakdown: Object.entries(planBreakdown).map(([label, data]) => ({
      label,
      count: data.count,
      mrr: data.mrr,
      mrrFormatted: `$${(data.mrr / 100).toFixed(0)}`,
    })),
    recentSubscriptions: recentSubs,
    pendingOnboarding,
  });
}
