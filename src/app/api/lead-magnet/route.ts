import { NextResponse } from "next/server";
import { sbInsert } from "@/lib/agents/supabase";
import { sendAgentEmailAlert } from "@/lib/agents/email-alert";

function clean(value: unknown, max = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
  const source = clean(body.source, 100) || "lead-magnet";

  if (!name || !email) {
    return NextResponse.json(
      { ok: false, error: "Name and email are required." },
      { status: 400 }
    );
  }

  if (!isEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  try {
    // Store in Supabase
    await sbInsert("lead_magnet_downloads", {
      name,
      email,
      source,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Supabase insert error (lead-magnet):", err);
    // Don't block the download — log and continue
  }

  try {
    // Send email alert to Noell
    await sendAgentEmailAlert({
      subject: `New Lead Magnet Download — ${name}`,
      text: `
Name: ${name}
Email: ${email}
Source: ${source}
Time: ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })} PT

They downloaded the Missed Call Audit Guide. Follow up within 24 hours.
      `.trim(),
    });
  } catch (err) {
    console.error("Email alert error (lead-magnet):", err);
    // Don't block the download — log and continue
  }

  return NextResponse.json({ ok: true });
}
