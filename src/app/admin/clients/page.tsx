"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconArrowLeft,
  IconRefresh,
  IconUsers,
  IconCheck,
  IconClock,
  IconExternalLink,
  IconKey,
} from "@tabler/icons-react";

interface OnboardingSubmission {
  id: string;
  stripe_session_id: string;
  stripe_customer_id: string;
  email: string;
  business_name: string;
  owner_name: string;
  phone: string;
  website: string | null;
  booking_tool: string | null;
  vertical: string | null;
  plan_id: string;
  provisioned: boolean;
  provisioned_at: string | null;
  client_id: string | null;
  created_at: string;
}

interface Customer {
  id: string;
  email: string;
  name: string | null;
  stripe_customer_id: string;
  client_id: string | null;
  created_at: string;
}

interface ClientsData {
  onboardingSubmissions: OnboardingSubmission[];
  customers: Customer[];
}

function relativeTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminClientsPage() {
  const router = useRouter();
  const [data, setData] = useState<ClientsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [provisioningId, setProvisioningId] = useState<string | null>(null);
  const [createPortalId, setCreatePortalId] = useState<string | null>(null);
  const [portalResult, setPortalResult] = useState<{ email: string; tempPassword: string } | null>(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch("/api/admin/clients");
      if (res.status === 401 || res.status === 403) {
        router.replace("/admin/login");
        return;
      }
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function markProvisioned(submissionId: string, clientId: string) {
    setProvisioningId(submissionId);
    try {
      const res = await fetch("/api/admin/clients/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, clientId }),
      });
      if (res.ok) fetchData(true);
    } finally {
      setProvisioningId(null);
    }
  }

  async function createPortalUser(submissionId: string, email: string, name: string, clientId: string) {
    setCreatePortalId(submissionId);
    try {
      const res = await fetch("/api/admin/clients/create-portal-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, email, name, clientId }),
      });
      if (res.ok) {
        const result = await res.json();
        setPortalResult(result);
        fetchData(true);
      }
    } finally {
      setCreatePortalId(null);
    }
  }

  const pending = data?.onboardingSubmissions.filter((s) => !s.provisioned) ?? [];
  const provisioned = data?.onboardingSubmissions.filter((s) => s.provisioned) ?? [];

  return (
    <div className="min-h-screen bg-[#f8f4f0]">
      <header className="bg-white border-b border-warm-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-1.5 text-xs text-charcoal/60 hover:text-charcoal transition">
              <IconArrowLeft size={14} />
              Admin
            </Link>
            <span className="text-charcoal/30">/</span>
            <span className="text-sm font-semibold text-charcoal">Clients</span>
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
        {/* Portal credentials result */}
        {portalResult && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-[16px] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-800 mb-1">Client portal account created</p>
                <p className="text-xs text-emerald-700">Email: <strong>{portalResult.email}</strong></p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Temporary password: <strong className="font-mono">{portalResult.tempPassword}</strong>
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  Share these credentials with the client. They can change their password after logging in at{" "}
                  <a href="/client/login" target="_blank" className="underline">/client/login</a>.
                </p>
              </div>
              <button onClick={() => setPortalResult(null)} className="text-emerald-600 hover:text-emerald-800 text-xs">
                Dismiss
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Pending provisioning */}
            {pending.length > 0 && (
              <div className="bg-white rounded-[20px] border border-warm-border overflow-hidden">
                <div className="px-6 py-4 border-b border-warm-border flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <p className="text-sm font-semibold text-charcoal">
                    Needs Setup ({pending.length})
                  </p>
                  <span className="text-xs text-charcoal/50">— new purchases awaiting agent provisioning</span>
                </div>
                <div className="divide-y divide-warm-border">
                  {pending.map((o) => (
                    <div key={o.id} className="px-6 py-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-charcoal">{o.business_name}</p>
                          <p className="text-xs text-charcoal/60 mt-0.5">
                            {o.owner_name} · {o.email} · {o.phone}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-wine/10 text-wine">
                              {o.plan_id}
                            </span>
                            {o.vertical && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-charcoal/5 text-charcoal/60">
                                {o.vertical}
                              </span>
                            )}
                            {o.booking_tool && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-charcoal/5 text-charcoal/60">
                                {o.booking_tool}
                              </span>
                            )}
                            {o.website && (
                              <a href={o.website} target="_blank" rel="noopener noreferrer"
                                className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 flex items-center gap-0.5 hover:bg-blue-100">
                                <IconExternalLink size={9} />
                                Website
                              </a>
                            )}
                          </div>
                          <p className="text-[10px] text-charcoal/40 mt-1.5">
                            Signed up {relativeTime(o.created_at)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          {/* Create portal user */}
                          <button
                            onClick={() => createPortalUser(o.id, o.email, o.owner_name, o.client_id ?? "")}
                            disabled={createPortalId === o.id || !!o.client_id}
                            className="flex items-center gap-1.5 text-xs bg-wine text-white px-3 py-1.5 rounded-lg hover:bg-wine-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {createPortalId === o.id ? (
                              <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <IconKey size={12} />
                            )}
                            Create Portal Login
                          </button>
                          {/* Mark as provisioned */}
                          <button
                            onClick={() => markProvisioned(o.id, o.client_id ?? "")}
                            disabled={provisioningId === o.id}
                            className="flex items-center gap-1.5 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                          >
                            {provisioningId === o.id ? (
                              <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <IconCheck size={12} />
                            )}
                            Mark Provisioned
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Provisioned clients */}
            <div className="bg-white rounded-[20px] border border-warm-border overflow-hidden">
              <div className="px-6 py-4 border-b border-warm-border flex items-center gap-2">
                <IconUsers size={15} className="text-charcoal/60" />
                <p className="text-sm font-semibold text-charcoal">
                  Active Clients ({provisioned.length})
                </p>
              </div>
              {provisioned.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                  <p className="text-sm text-charcoal/60">No provisioned clients yet.</p>
                  <p className="text-xs text-charcoal/40 mt-1">
                    Clients will appear here after their agents are set up.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-warm-border">
                  {provisioned.map((o) => (
                    <div key={o.id} className="px-6 py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-medium text-charcoal">{o.business_name}</p>
                          <span className="flex items-center gap-0.5 text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            <IconCheck size={9} strokeWidth={3} />
                            Live
                          </span>
                        </div>
                        <p className="text-xs text-charcoal/60">
                          {o.owner_name} · {o.email}
                        </p>
                        {o.client_id && (
                          <p className="text-[10px] font-mono text-charcoal/40 mt-0.5">
                            client_id: {o.client_id}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-wine/10 text-wine">
                          {o.plan_id}
                        </span>
                        {o.client_id && (
                          <Link
                            href={`/admin/clients/${o.client_id}`}
                            className="text-xs text-wine hover:text-wine-dark underline underline-offset-2"
                          >
                            View
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* All customers (from Stripe) */}
            {(data?.customers ?? []).length > 0 && (
              <div className="bg-white rounded-[20px] border border-warm-border overflow-hidden">
                <div className="px-6 py-4 border-b border-warm-border">
                  <p className="text-sm font-semibold text-charcoal">All Stripe Customers</p>
                </div>
                <div className="divide-y divide-warm-border">
                  {data!.customers.map((c) => (
                    <div key={c.id} className="px-6 py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-charcoal">{c.name ?? c.email}</p>
                        {c.name && <p className="text-xs text-charcoal/50">{c.email}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {c.client_id ? (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            {c.client_id}
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-charcoal/5 text-charcoal/50">
                            unlinked
                          </span>
                        )}
                        <span className="text-[10px] text-charcoal/40">
                          {relativeTime(c.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
