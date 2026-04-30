"use client";

import { useState } from "react";
import { trackConversion, ConversionEvents } from "@/lib/analytics";

type Industry = "dental" | "med_spa" | "chiropractic";
type FormState = "idle" | "submitting" | "sent" | "error";

interface CalcInputs {
  industry: Industry | "";
  monthlyLeads: number;
  bookingRate: number;
  avgTicket: number;
  noShowRate: number;
  name: string;
  email: string;
}

const INDUSTRY_LABELS: Record<Industry, string> = {
  dental: "Dental Practice",
  med_spa: "Med Spa",
  chiropractic: "Chiropractic Office",
};

function formatMoney(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function calcResults(inputs: CalcInputs) {
  if (!inputs.industry || inputs.monthlyLeads <= 0 || inputs.avgTicket <= 0) return null;

  const { monthlyLeads, bookingRate, avgTicket, noShowRate } = inputs;

  // Current state
  const currentBookings = monthlyLeads * (bookingRate / 100);
  const currentNoShows = currentBookings * (noShowRate / 100);
  const currentAttendedBookings = currentBookings - currentNoShows;
  const currentMonthlyRevenue = currentAttendedBookings * avgTicket;

  // PCI lift assumptions (midpoints of stated ranges)
  const bookingLiftPct = 0.215; // +21.5% conversion lift (midpoint of 18–25%)
  const noShowReductionPct = 0.675; // 67.5% no-show reduction (midpoint of 60–75%)

  const projectedBookings = monthlyLeads * (bookingRate / 100) * (1 + bookingLiftPct);
  const projectedNoShows = projectedBookings * (noShowRate / 100) * (1 - noShowReductionPct);
  const projectedAttendedBookings = projectedBookings - projectedNoShows;
  const projectedMonthlyRevenue = projectedAttendedBookings * avgTicket;

  const monthlyLift = projectedMonthlyRevenue - currentMonthlyRevenue;
  const annualLift = monthlyLift * 12;

  // Breakeven: Ops by Noell engagement cost ~$797/mo setup equiv. (Growth tier)
  // Use $797 as the monthly equivalent investment figure
  const engagementCost = 797;
  const breakevenDays = monthlyLift > 0 ? Math.ceil((engagementCost / monthlyLift) * 30) : null;

  return {
    currentMonthlyRevenue,
    projectedMonthlyRevenue,
    monthlyLift,
    annualLift,
    breakevenDays,
    projectedBookings: Math.round(projectedBookings),
    currentBookings: Math.round(currentBookings),
  };
}

export function RevenueCalculator() {
  const [inputs, setInputs] = useState<CalcInputs>({
    industry: "",
    monthlyLeads: 80,
    bookingRate: 55,
    avgTicket: 200,
    noShowRate: 15,
    name: "",
    email: "",
  });
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const results = calcResults(inputs);

  function setField<K extends keyof CalcInputs>(field: K, value: CalcInputs[K]) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formState === "submitting") return;

    if (!inputs.name.trim() || !inputs.email.trim()) {
      setFormState("error");
      setErrorMessage("Enter your name and email to send your results.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
      setFormState("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!results) {
      setFormState("error");
      setErrorMessage("Please fill in all calculator fields above first.");
      return;
    }

    setFormState("submitting");
    setErrorMessage("");

    try {
      const payload = {
        name: inputs.name.trim(),
        email: inputs.email.trim(),
        industry: inputs.industry,
        monthly_leads: inputs.monthlyLeads,
        booking_rate: inputs.bookingRate,
        avg_ticket: inputs.avgTicket,
        no_show_rate: inputs.noShowRate,
        current_monthly_revenue: Math.round(results.currentMonthlyRevenue),
        projected_monthly_revenue: Math.round(results.projectedMonthlyRevenue),
        monthly_lift: Math.round(results.monthlyLift),
        annual_lift: Math.round(results.annualLift),
        breakeven_days: results.breakevenDays,
        source: "revenue_calculator",
      };

      const res = await fetch("/api/calculator-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "send_failed");
      }

      setFormState("sent");
      trackConversion(ConversionEvents.AUDIT_REQUEST_SUBMITTED, {
        source_page: "revenue_calculator",
        source_section: "calculator_lead_form",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "send_failed";
      setFormState("error");
      setErrorMessage(
        message === "send_failed"
          ? "Something went wrong. Try again, or email hello@opsbynoell.com."
          : message
      );
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Inputs */}
      <div className="rounded-[24px] border border-warm-border bg-white p-7 md:p-10 shadow-[0px_15px_15px_0px_rgba(28,25,23,0.04),0px_4px_8px_0px_rgba(28,25,23,0.05)]">
        <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-2">
          Revenue calculator
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-6">
          Your numbers. Your leak.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Industry */}
          <div className="md:col-span-2">
            <label className="block text-sm text-charcoal/80 mb-2">Industry</label>
            <select
              value={inputs.industry}
              onChange={(e) => setField("industry", e.target.value as Industry | "")}
              className="w-full rounded-lg border border-warm-border bg-cream px-3 py-3 text-charcoal focus:outline-none focus:border-wine/60 focus:bg-white"
            >
              <option value="" disabled>
                Select your industry
              </option>
              <option value="dental">Dental Practice</option>
              <option value="med_spa">Med Spa</option>
              <option value="chiropractic">Chiropractic Office</option>
            </select>
          </div>

          {/* Monthly leads */}
          <label className="block">
            <span className="block text-sm text-charcoal/80 mb-2">
              Monthly leads (calls + inquiries):{" "}
              <span className="font-semibold text-charcoal">{inputs.monthlyLeads}</span>
            </span>
            <input
              type="range"
              min={5}
              max={500}
              step={5}
              value={inputs.monthlyLeads}
              onChange={(e) => setField("monthlyLeads", Number(e.target.value))}
              className="w-full accent-wine cursor-pointer mt-2"
            />
            <div className="flex justify-between text-[10px] text-charcoal/60 mt-1">
              <span>5</span>
              <span>500</span>
            </div>
          </label>

          {/* Current booking rate */}
          <label className="block">
            <span className="block text-sm text-charcoal/80 mb-2">
              Current booking conversion rate:{" "}
              <span className="font-semibold text-charcoal">{inputs.bookingRate}%</span>
            </span>
            <input
              type="range"
              min={5}
              max={95}
              step={1}
              value={inputs.bookingRate}
              onChange={(e) => setField("bookingRate", Number(e.target.value))}
              className="w-full accent-wine cursor-pointer mt-2"
            />
            <div className="flex justify-between text-[10px] text-charcoal/60 mt-1">
              <span>5%</span>
              <span>95%</span>
            </div>
          </label>

          {/* Average ticket */}
          <label className="block">
            <span className="block text-sm text-charcoal/80 mb-2">
              Average ticket value:{" "}
              <span className="font-semibold text-charcoal">${inputs.avgTicket}</span>
            </span>
            <input
              type="range"
              min={50}
              max={2000}
              step={25}
              value={inputs.avgTicket}
              onChange={(e) => setField("avgTicket", Number(e.target.value))}
              className="w-full accent-wine cursor-pointer mt-2"
            />
            <div className="flex justify-between text-[10px] text-charcoal/60 mt-1">
              <span>$50</span>
              <span>$2,000</span>
            </div>
          </label>

          {/* No-show rate */}
          <label className="block">
            <span className="block text-sm text-charcoal/80 mb-2">
              Current no-show rate:{" "}
              <span className="font-semibold text-charcoal">{inputs.noShowRate}%</span>
            </span>
            <input
              type="range"
              min={0}
              max={50}
              step={1}
              value={inputs.noShowRate}
              onChange={(e) => setField("noShowRate", Number(e.target.value))}
              className="w-full accent-wine cursor-pointer mt-2"
            />
            <div className="flex justify-between text-[10px] text-charcoal/60 mt-1">
              <span>0%</span>
              <span>50%</span>
            </div>
          </label>
        </div>
      </div>

      {/* Results */}
      {results && inputs.industry ? (
        <div className="mt-6 rounded-[24px] border border-warm-border bg-cream-dark p-7 md:p-10">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
            Your results · {INDUSTRY_LABELS[inputs.industry as Industry]}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <div className="rounded-[16px] bg-white border border-warm-border p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/60 mb-2">
                Current monthly revenue
              </p>
              <p className="font-serif text-3xl md:text-4xl font-semibold text-charcoal">
                {formatMoney(results.currentMonthlyRevenue)}
              </p>
              <p className="text-xs text-charcoal/60 mt-1">
                {results.currentBookings} booked, ~{Math.round(results.currentBookings * (1 - inputs.noShowRate / 100))} show
              </p>
            </div>

            <div className="rounded-[16px] bg-white border border-wine/20 p-5 ring-1 ring-wine/10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-wine mb-2">
                Projected monthly revenue with PCI
              </p>
              <p className="font-serif text-3xl md:text-4xl font-semibold text-wine">
                {formatMoney(results.projectedMonthlyRevenue)}
              </p>
              <p className="text-xs text-charcoal/60 mt-1">
                {results.projectedBookings} booked · 75% fewer no-shows
              </p>
            </div>

            <div className="rounded-[16px] bg-white border border-warm-border p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/60 mb-2">
                Projected annual revenue lift
              </p>
              <p className="font-serif text-3xl md:text-4xl font-semibold text-charcoal">
                {formatMoney(results.annualLift)}
              </p>
              <p className="text-xs text-charcoal/60 mt-1">
                +{formatMoney(results.monthlyLift)}/mo in recovered revenue
              </p>
            </div>

            <div className="rounded-[16px] bg-white border border-warm-border p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/60 mb-2">
                Breakeven on Ops by Noell
              </p>
              {results.breakevenDays !== null ? (
                <>
                  <p className="font-serif text-3xl md:text-4xl font-semibold text-charcoal">
                    {results.breakevenDays} days
                  </p>
                  <p className="text-xs text-charcoal/60 mt-1">
                    Based on Growth tier · $797/mo
                  </p>
                </>
              ) : (
                <p className="font-serif text-xl text-charcoal/60 mt-2">
                  Adjust inputs above
                </p>
              )}
            </div>
          </div>

          {/* Assumption note */}
          <p className="text-[11px] text-charcoal/50 leading-relaxed mb-6">
            Model assumes +21.5% booking conversion lift and 67.5% no-show reduction (midpoints of verified ranges). 
            Santa Essenberge saw 75% no-show reduction and $960 recovered in 14 days. 
            Your results depend on lead volume, timing, and existing workflow.
          </p>

          {/* CTA to book */}
          <div className="border-t border-warm-border pt-6">
            <p className="text-sm text-charcoal/80 mb-4">
              At {formatMoney(results.monthlyLift)}/month in preventable losses, your revenue leak is{" "}
              {results.monthlyLift > 797 ? "larger than" : "close to"} the cost of the full automation stack.
            </p>

            {formState === "sent" ? (
              <div className="rounded-[16px] bg-wine/5 border border-wine/20 p-5 text-center">
                <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-2">Got it</p>
                <p className="font-serif text-lg text-charcoal">
                  Your results are on their way. We&apos;ll follow up within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} aria-label="Send my results">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <label className="block">
                    <span className="block text-sm text-charcoal/80 mb-2">Your name</span>
                    <input
                      type="text"
                      required
                      value={inputs.name}
                      onChange={(e) => setField("name", e.target.value)}
                      autoComplete="name"
                      placeholder="First Last"
                      className="w-full rounded-lg border border-warm-border bg-white px-3 py-3 text-charcoal focus:outline-none focus:border-wine/60"
                    />
                  </label>
                  <label className="block">
                    <span className="block text-sm text-charcoal/80 mb-2">Email</span>
                    <input
                      type="email"
                      required
                      value={inputs.email}
                      onChange={(e) => setField("email", e.target.value)}
                      autoComplete="email"
                      placeholder="you@yourpractice.com"
                      className="w-full rounded-lg border border-warm-border bg-white px-3 py-3 text-charcoal focus:outline-none focus:border-wine/60"
                    />
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={formState === "submitting"}
                    className="rounded-full bg-wine text-cream text-sm font-medium px-7 py-3 hover:bg-wine-dark transition-colors disabled:opacity-60 whitespace-nowrap"
                    data-event="audit_cta_click"
                    data-source-page="revenue_calculator"
                    data-source-section="calculator_results"
                  >
                    {formState === "submitting" ? "Sending..." : "Send my results + book a free audit"}
                  </button>
                  <a
                    href="/book"
                    className="rounded-full border border-warm-border bg-white text-charcoal text-sm font-medium px-7 py-3 hover:bg-cream transition-colors text-center"
                  >
                    Just book a call
                  </a>
                </div>
                {formState === "error" && errorMessage && (
                  <p className="text-sm text-wine mt-3">{errorMessage}</p>
                )}
                <p className="text-[11px] text-charcoal/50 mt-3">
                  No pitch. No pressure. We reply within one business day.
                </p>
              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-[24px] border border-dashed border-warm-border bg-cream p-8 text-center">
          <p className="text-sm text-charcoal/60">
            Select an industry and tune the sliders above to see your revenue projection.
          </p>
        </div>
      )}
    </div>
  );
}
