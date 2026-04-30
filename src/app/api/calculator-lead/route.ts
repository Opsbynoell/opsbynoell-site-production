import { NextResponse } from "next/server";
import { sbInsert } from "@/lib/agents/supabase";
import { sendAgentEmailAlert } from "@/lib/agents/email-alert";

const ALLOWED_INDUSTRIES = new Set(["dental", "med_spa", "chiropractic"]);

interface CalculatorLeadRow {
  id: string;
  created_at: string;
  name: string;
  email: string;
  industry: string;
  monthly_leads: number;
  booking_rate: number;
  avg_ticket: number;
  no_show_rate: number;
  current_monthly_revenue: number;
  projected_monthly_revenue: number;
  monthly_lift: number;
  annual_lift: number;
  breakeven_days: number | null;
  source: string;
}

function clean(value: unknown, max = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function toInt(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : null;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad JSON." }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const industry = clean(body.industry, 60);

  if (!name || !email || !industry) {
    return NextResponse.json({ ok: false, error: "Missing required field." }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
  }
  if (!ALLOWED_INDUSTRIES.has(industry)) {
    return NextResponse.json({ ok: false, error: "Invalid industry." }, { status: 400 });
  }

  const monthlyLeads = toInt(body.monthly_leads);
  const bookingRate = toInt(body.booking_rate);
  const avgTicket = toInt(body.avg_ticket);
  const noShowRate = toInt(body.no_show_rate);
  const currentMonthlyRevenue = toInt(body.current_monthly_revenue);
  const projectedMonthlyRevenue = toInt(body.projected_monthly_revenue);
  const monthlyLift = toInt(body.monthly_lift);
  const annualLift = toInt(body.annual_lift);
  const breakevenDays = toInt(body.breakeven_days);

  if (
    monthlyLeads === null || bookingRate === null || avgTicket === null ||
    noShowRate === null || currentMonthlyRevenue === null ||
    projectedMonthlyRevenue === null || monthlyLift === null || annualLift === null
  ) {
    return NextResponse.json({ ok: false, error: "Invalid calculator values." }, { status: 400 });
  }

  const industryLabel: Record<string, string> = {
    dental: "Dental Practice",
    med_spa: "Med Spa",
    chiropractic: "Chiropractic Office",
  };

  // Persist to Supabase
  let inserted: CalculatorLeadRow | null = null;
  try {
    inserted = await sbInsert<CalculatorLeadRow>("calculator_leads", {
      name,
      email,
      industry,
      monthly_leads: monthlyLeads,
      booking_rate: bookingRate,
      avg_ticket: avgTicket,
      no_show_rate: noShowRate,
      current_monthly_revenue: currentMonthlyRevenue,
      projected_monthly_revenue: projectedMonthlyRevenue,
      monthly_lift: monthlyLift,
      annual_lift: annualLift,
      breakeven_days: breakevenDays,
      source: "revenue_calculator",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[calculator-lead] supabase insert failed:", message);
    // Don't fail the user — still send the email alert
  }

  // Email alert to operator
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const subject = `New revenue calculator lead: ${name} (${industryLabel[industry] ?? industry})`;
  const text = [
    `New lead from /resources/revenue-calculator`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    `Industry: ${industryLabel[industry] ?? industry}`,
    ``,
    `Calculator inputs:`,
    `  Monthly leads: ${monthlyLeads}`,
    `  Booking rate: ${bookingRate}%`,
    `  Avg ticket: ${fmt(avgTicket)}`,
    `  No-show rate: ${noShowRate}%`,
    ``,
    `Projected results:`,
    `  Current monthly revenue: ${fmt(currentMonthlyRevenue)}`,
    `  Projected monthly revenue: ${fmt(projectedMonthlyRevenue)}`,
    `  Monthly lift: ${fmt(monthlyLift)}`,
    `  Annual lift: ${fmt(annualLift)}`,
    `  Breakeven days: ${breakevenDays !== null ? `${breakevenDays} days` : "n/a"}`,
    ``,
    inserted?.id ? `Supabase row id: ${inserted.id}` : ``,
  ]
    .filter(Boolean)
    .join("\n");

  const alert = await sendAgentEmailAlert({
    subject,
    text,
    toEmail: process.env.BOOK_REQUEST_TO_EMAIL ?? undefined,
  });
  if (!alert.ok) {
    console.warn("[calculator-lead] email alert skipped:", alert.error);
  }

  return NextResponse.json({ ok: true, id: inserted?.id ?? null });
}
