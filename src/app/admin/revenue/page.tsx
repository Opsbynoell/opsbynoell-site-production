"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconArrowLeft,
  IconRefresh,
  IconTrendingUp,
  IconUsers,
  IconCreditCard,
  IconAlertTriangle,
  IconCheck,
  IconClock,
} from "@tabler/icons-react";

interface PlanBreakdown {
  label: string;
  count: number;
  mrr: number;
  mrrFormatted: string;
}

interface RecentSub {
  id: string;
  planId: string;
  planLabel: string;
  status: string;
  amountCents: number;
  interval: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string;
  customer: { email: string; name: string | null; clientId: string | null } | null;
  createdAt: string;
}

interface PendingOnboarding {
  id: string;
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  plan_id: string;
  vertical: string | null;
  booking_tool: string | null;
  client_id: string | null;
  created_at: string;
}

interface RevenueData {
  summary: {
    mrr: number;
    mrrFormatted: string;
    activeSubscriptions: number;
    totalCustomers: number;
    churnedThisMonth: number;
  };
  planBreakdown: PlanBreakdown[];
  recentSubscriptions: RecentSub[];
  pendingOnboarding: PendingOnboarding[];
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  trialing: "bg-blue-100 text-blue-700",
  past_due: "bg-red-100 text-red-700",
  canceled: "bg-charcoal/10 text-charcoal/60",
  unpaid: "bg-red-100 text-red-700",
  incomplete: "bg-amber-100 text-amber-700",
};

function relativeTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminRevenuePage() {
  const router = useRouter();
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch("/api/admin/revenue");
      if (res.status === 401 || res.status === 403) {
        router.replace("/admin/login");
        return;
      }
      if (res.ok) {
        setData(await res.json());
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-[#f8f4f0]">
      {/* Header */}
      <header className="bg-white border-b border-warm-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs text-charcoal/60 hover:text-charcoal transition"
            >
              <IconArrowLeft size={14} />
              Admin
            </Link>
            <span className="text-charcoal/30">/</span>
            <span className="text-sm font-semibold text-charcoal">Revenue</span>
          </div>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs text-charcoal/60 hover:text-charcoal transition disabled:opacity-50"
          >
            <IconRefresh size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
          </div>
        ) : !data ? (
          <p className="text-sm text-charcoal/60 text-center py-16">Could not load revenue data.</p>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-[16px] border border-warm-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] text-charcoal/60 font-medium">Monthly Recurring Revenue</p>
                  <IconTrendingUp size={16} className="text-emerald-600" />
                </div>
                <p className="font-serif text-3xl font-semibold text-charcoal">
                  {data.summary.mrrFormatted}
                </p>
                <p className="text-[10px] text-charcoal/50 mt-0.5">per month</p>
              </div>
              <div className="bg-white rounded-[16px] border border-warm-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] text-charcoal/60 font-medium">Active Subscriptions</p>
                  <IconCreditCard size={16} className="text-wine" />
                </div>
                <p className="font-serif text-3xl font-semibold text-charcoal">
                  {data.summary.activeSubscriptions}
                </p>
                <p className="text-[10px] text-charcoal/50 mt-0.5">paying clients</p>
              </div>
              <div className="bg-white rounded-[16px] border border-warm-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] text-charcoal/60 font-medium">Total Customers</p>
                  <IconUsers size={16} className="text-[#7C5CFC]" />
                </div>
                <p className="font-serif text-3xl font-semibold text-charcoal">
                  {data.summary.totalCustomers}
                </p>
                <p className="text-[10px] text-charcoal/50 mt-0.5">all time</p>
              </div>
              <div className="bg-white rounded-[16px] border border-warm-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] text-charcoal/60 font-medium">Churned This Month</p>
                  <IconAlertTriangle size={16} className="text-amber-600" />
                </div>
                <p className="font-serif text-3xl font-semibold text-charcoal">
                  {data.summary.churnedThisMonth}
                </p>
                <p className="text-[10px] text-charcoal/50 mt-0.5">cancellations</p>
              </div>
            </div>

            {/* Plan breakdown */}
            {data.planBreakdown.length > 0 && (
              <div className="bg-white rounded-[20px] border border-warm-border overflow-hidden">
                <div className="px-6 py-4 border-b border-warm-border">
                  <p className="text-sm font-semibold text-charcoal">Revenue by Plan</p>
                </div>
                <div className="divide-y divide-warm-border">
                  {data.planBreakdown.map((plan) => (
                    <div key={plan.label} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-charcoal">{plan.label}</p>
                        <p className="text-xs text-charcoal/60 mt-0.5">
                          {plan.count} subscriber{plan.count !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-emerald-700">
                        {plan.mrrFormatted}/mo
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending onboarding */}
            {data.pendingOnboarding.length > 0 && (
              <div className="bg-white rounded-[20px] border border-warm-border overflow-hidden">
                <div className="px-6 py-4 border-b border-warm-border flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <p className="text-sm font-semibold text-charcoal">
                    Pending Provisioning ({data.pendingOnboarding.length})
                  </p>
                </div>
                <div className="divide-y divide-warm-border">
                  {data.pendingOnboarding.map((o) => (
                    <div key={o.id} className="px-6 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-charcoal">{o.business_name}</p>
                          <p className="text-xs text-charcoal/60 mt-0.5">
                            {o.owner_name} · {o.email} · {o.phone}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-wine/10 text-wine">
                              {o.plan_id}
                            </span>
                            {o.vertical && (
                              <span className="text-[9px] font-mono text-charcoal/50">
                                {o.vertical}
                              </span>
                            )}
                            {o.booking_tool && (
                              <span className="text-[9px] font-mono text-charcoal/50">
                                {o.booking_tool}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="flex items-center gap-1 text-[10px] text-amber-600">
                            <IconClock size={11} />
                            Needs setup
                          </span>
                          <span className="text-[10px] text-charcoal/50">
                            {relativeTime(o.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent subscriptions */}
            <div className="bg-white rounded-[20px] border border-warm-border overflow-hidden">
              <div className="px-6 py-4 border-b border-warm-border">
                <p className="text-sm font-semibold text-charcoal">Recent Subscriptions</p>
              </div>
              {data.recentSubscriptions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                  <p className="text-sm text-charcoal/60">No subscriptions yet.</p>
                  <p className="text-xs text-charcoal/40 mt-1">
                    Subscriptions will appear here after the first purchase.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-warm-border">
                  {data.recentSubscriptions.map((sub) => (
                    <div key={sub.id} className="px-6 py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-medium text-charcoal truncate">
                            {sub.customer?.name ?? sub.customer?.email ?? "Unknown customer"}
                          </p>
                          <span
                            className={`shrink-0 text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                              STATUS_COLORS[sub.status] ?? "bg-charcoal/10 text-charcoal/60"
                            }`}
                          >
                            {sub.status}
                          </span>
                          {sub.cancelAtPeriodEnd && (
                            <span className="shrink-0 text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                              cancels at period end
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-charcoal/60">
                          {sub.planLabel} · {sub.customer?.email}
                        </p>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <p className="text-sm font-semibold text-charcoal">
                          ${(sub.amountCents / 100).toFixed(0)}/{sub.interval === "year" ? "yr" : "mo"}
                        </p>
                        <p className="text-[10px] text-charcoal/50">
                          {relativeTime(sub.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
