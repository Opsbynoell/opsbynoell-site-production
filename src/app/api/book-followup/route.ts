import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email." },
        { status: 400 }
      );
    }

    // Stub: the downstream wiring (CRM capture, audit worksheet send)
    // is handled by the next phase. For now we acknowledge receipt so
    // the exit-intent modal can confirm success to the visitor.
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Bad request." },
      { status: 400 }
    );
  }
}
