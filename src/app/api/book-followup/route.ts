import { NextResponse } from "next/server";
import { sbInsert } from "@/lib/agents/supabase";
import { sendAgentEmailAlert } from "@/lib/agents/email-alert";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface BookRequestRow {
  id: string;
  created_at: string;
  name: string;
  business: string;
  phone: string;
  email: string;
  booking_system: string;
  leak_description: string;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Bad request." },
      { status: 400 }
    );
  }

  const email =
    typeof body?.email === "string" ? body.email.trim().slice(0, 200) : "";
  const source =
    typeof body?.source === "string" ? body.source.trim().slice(0, 80) : "exit_intent";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Invalid email." },
      { status: 400 }
    );
  }

  // Record the lead in Supabase using the existing book_requests table so the
  // visitor shows up in the admin pipeline. Unfilled fields are placeholders
  // marked with "(followup)" so we can tell these apart from the full form.
  try {
    await sbInsert<BookRequestRow>("book_requests", {
      name: "(followup)",
      business: "(followup)",
      phone: "(followup)",
      email,
      booking_system: "(followup)",
      leak_description: `Exit-intent followup capture from ${source}`,
    });
  } catch (err) {
    // Don't fail the user — still send the email alert below.
    console.error("[book-followup] sbInsert failed:", err);
  }

  await sendAgentEmailAlert({
    subject: `New exit-intent lead: ${email}`,
    text: [
      `An exit-intent visitor left their email.`,
      ``,
      `Email: ${email}`,
      `Source: ${source}`,
      ``,
      `Follow up within 4 hours to capture intent.`,
    ].join("\n"),
  });

  return NextResponse.json({ ok: true });
}
