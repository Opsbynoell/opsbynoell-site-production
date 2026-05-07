"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IconCheck, IconBolt, IconPhoneCall, IconHeartHandshake } from "@tabler/icons-react";

const PLAN_LABELS: Record<string, string> = {
  agents_founding: "Noell Agents — Founding Rate ($197/mo)",
  agents_standard: "Noell Agents ($297/mo)",
  essentials: "Noell System — Essentials ($197/mo)",
  growth: "Noell System — Growth ($797/mo)",
  custom_ops: "Noell System — Custom Ops ($1,497/mo)",
};

const BOOKING_TOOLS = [
  "GoHighLevel",
  "Acuity Scheduling",
  "Mindbody",
  "Vagaro",
  "Calendly",
  "Jane App",
  "Square Appointments",
  "Booksy",
  "Fresha",
  "Other",
];

const VERTICALS = [
  "Massage Therapy",
  "Med Spa / Aesthetics",
  "Dental Practice",
  "Salon / Hair",
  "Chiropractic",
  "Physical Therapy",
  "HVAC / Home Services",
  "Coaching / Consulting",
  "Other Service Business",
];

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id") ?? "";
  const planId = searchParams.get("plan") ?? "agents_founding";

  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    phone: "",
    website: "",
    bookingTool: "",
    vertical: "",
    password: "",
    confirmPassword: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stripeSessionId: sessionId,
          planId,
          businessName: form.businessName,
          ownerName: form.ownerName,
          phone: form.phone,
          website: form.website,
          bookingTool: form.bookingTool,
          vertical: form.vertical,
          password: form.password,
        }),
      });

      if (res.ok) {
        setStep("success");
      } else {
        const d = await res.json();
        setError(d.error ?? "Something went wrong. Please try again or email hello@opsbynoell.com.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-[#f8f4f0] flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg text-center">
          {/* Success icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-6">
            <IconCheck size={28} className="text-emerald-700" />
          </div>

          <h1 className="font-serif text-3xl font-semibold text-charcoal mb-3">
            You are in.
          </h1>
          <p className="text-charcoal/70 leading-relaxed mb-8">
            Your agents are being set up. Noell will be in touch within one business day to confirm your go-live date. In the meantime, your client portal is ready.
          </p>

          {/* What happens next */}
          <div className="bg-white rounded-[20px] border border-warm-border p-6 text-left mb-8">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-charcoal/50 mb-4">
              What happens next
            </p>
            <div className="space-y-4">
              {[
                { step: "1", label: "Confirmation email sent", sub: "Check your inbox for your receipt and portal login." },
                { step: "2", label: "Noell reviews your setup", sub: "We configure your agents with your business details." },
                { step: "3", label: "Go live in 5 business days", sub: "Your agents start working. We monitor the first 48 hours." },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-wine/10 text-wine text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal">{item.label}</p>
                    <p className="text-xs text-charcoal/60 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => router.push("/client/dashboard")}
            className="w-full py-3 rounded-[10px] bg-[linear-gradient(181deg,_#8B4D5E_18.12%,_#5A1F30_99.57%)] text-white text-sm font-medium shadow-[0px_4px_8px_0px_rgba(90,31,48,0.18)] hover:-translate-y-0.5 transition duration-200"
          >
            Go to my dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f4f0] py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
            <IconCheck size={22} className="text-emerald-700" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/50 mb-1">
            Payment confirmed
          </p>
          <h1 className="font-serif text-2xl font-semibold text-charcoal">
            Set up your account
          </h1>
          <p className="text-sm text-charcoal/60 mt-1.5">
            {PLAN_LABELS[planId] ?? planId}. Tell us about your business so we can get your agents live.
          </p>
        </div>

        {/* Agents included */}
        <div className="bg-white rounded-[16px] border border-warm-border p-4 mb-6">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-charcoal/50 mb-3">
            Agents included in your plan
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Noell Support", icon: <IconBolt size={14} />, color: "text-[#7C5CFC]", bg: "bg-[#7C5CFC]/10" },
              { label: "Front Desk", icon: <IconPhoneCall size={14} />, color: "text-wine", bg: "bg-wine/10" },
              { label: "Noell Care", icon: <IconHeartHandshake size={14} />, color: "text-emerald-700", bg: "bg-emerald-100" },
            ].map((a) => (
              <div key={a.label} className="flex flex-col items-center gap-1.5 py-2">
                <div className={`w-7 h-7 rounded-full ${a.bg} flex items-center justify-center ${a.color}`}>
                  {a.icon}
                </div>
                <span className="text-[10px] text-charcoal/70 text-center leading-tight">{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-[20px] border border-warm-border shadow-[0px_15px_15px_0px_rgba(28,25,23,0.06)] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-charcoal/70 mb-1.5">
                  Business name *
                </label>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => update("businessName", e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-warm-border bg-[#f8f4f0] text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-wine/30 focus:border-wine/50 transition"
                  placeholder="Healing Hands Spa"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal/70 mb-1.5">
                  Your name *
                </label>
                <input
                  type="text"
                  value={form.ownerName}
                  onChange={(e) => update("ownerName", e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-warm-border bg-[#f8f4f0] text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-wine/30 focus:border-wine/50 transition"
                  placeholder="Jane Smith"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-charcoal/70 mb-1.5">
                  Business phone *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-warm-border bg-[#f8f4f0] text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-wine/30 focus:border-wine/50 transition"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal/70 mb-1.5">
                  Website
                </label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-warm-border bg-[#f8f4f0] text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-wine/30 focus:border-wine/50 transition"
                  placeholder="https://yourbusiness.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-charcoal/70 mb-1.5">
                  Booking tool
                </label>
                <select
                  value={form.bookingTool}
                  onChange={(e) => update("bookingTool", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-warm-border bg-[#f8f4f0] text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-wine/30 focus:border-wine/50 transition"
                >
                  <option value="">Select one</option>
                  {BOOKING_TOOLS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal/70 mb-1.5">
                  Business type
                </label>
                <select
                  value={form.vertical}
                  onChange={(e) => update("vertical", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-warm-border bg-[#f8f4f0] text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-wine/30 focus:border-wine/50 transition"
                >
                  <option value="">Select one</option>
                  {VERTICALS.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Portal password */}
            <div className="pt-2 border-t border-warm-border">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-charcoal/50 mb-3">
                Create your portal password
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-charcoal/70 mb-1.5">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-3.5 py-2.5 rounded-[10px] border border-warm-border bg-[#f8f4f0] text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-wine/30 focus:border-wine/50 transition"
                    placeholder="Min 8 characters"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal/70 mb-1.5">
                    Confirm password *
                  </label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-[10px] border border-warm-border bg-[#f8f4f0] text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-wine/30 focus:border-wine/50 transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-[10px] bg-[linear-gradient(181deg,_#8B4D5E_18.12%,_#5A1F30_99.57%)] text-white text-sm font-medium shadow-[0px_4px_8px_0px_rgba(90,31,48,0.18)] hover:-translate-y-0.5 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Setting up your account...
                </span>
              ) : (
                "Complete setup and go to my dashboard"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-charcoal/50 mt-6">
          Questions?{" "}
          <a href="mailto:hello@opsbynoell.com" className="text-wine hover:underline">
            Email hello@opsbynoell.com
          </a>
        </p>
      </div>
    </div>
  );
}
