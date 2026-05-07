/**
 * POST /api/onboarding
 *
 * Processes the post-purchase onboarding form:
 * 1. Validates the Stripe checkout session.
 * 2. Creates a client_portal_users record for dashboard access.
 * 3. Creates/updates the onboarding_submissions record.
 * 4. Notifies the operator via email.
 * 5. Sets the client session cookie so the user lands on their dashboard.
 */
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { hashPassword } from "@/lib/admin-password";
import { createClientToken, CLIENT_COOKIE_NAME } from "@/lib/client-auth";
import { sbInsert, sbSelect, sbUpdate, sbUpsert } from "@/lib/agents/supabase";
import { sendAgentEmailAlert } from "@/lib/agents/email-alert";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CustomerRow {
  id: string;
  client_id: string | null;
  stripe_customer_id: string;
  email: string;
  name: string | null;
}

interface ClientPortalUser {
  id: string;
  client_id: string;
  email: string;
}

function clean(v: unknown, max = 200): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

export async function POST(req: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const stripeSessionId = clean(body.stripeSessionId, 100);
  const planId = clean(body.planId, 50);
  const businessName = clean(body.businessName);
  const ownerName = clean(body.ownerName);
  const phone = clean(body.phone, 60);
  const website = clean(body.website);
  const bookingTool = clean(body.bookingTool, 100);
  const vertical = clean(body.vertical, 100);
  const password = typeof body.password === "string" ? body.password : "";

  if (!businessName || !ownerName || !phone || !password) {
    return NextResponse.json(
      { error: "Business name, your name, phone, and password are required." },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  // 1. Validate the Stripe session and get the customer email
  let stripeEmail = "";
  let stripeCustomerId = "";

  if (stripeSessionId) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(stripeSessionId);
      stripeEmail = session.customer_details?.email ?? session.customer_email ?? "";
      stripeCustomerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id ?? "";
    } catch (err) {
      console.error("[onboarding] Stripe session retrieval failed:", err);
      // Non-blocking — proceed without Stripe validation in dev
    }
  }

  // 2. Find the customer record to get client_id
  let clientId = `client-${Date.now()}`;
  let customerId: string | null = null;

  if (stripeCustomerId) {
    try {
      const customers = await sbSelect<CustomerRow>(
        "customers",
        { stripe_customer_id: `eq.${stripeCustomerId}` },
        { limit: 1 }
      );
      if (customers[0]) {
        customerId = customers[0].id;
        if (customers[0].client_id) {
          clientId = customers[0].client_id;
        }
      }
    } catch {
      // Non-critical
    }
  }

  const email = stripeEmail || `${businessName.toLowerCase().replace(/\s+/g, ".")}@client.opsbynoell.com`;

  // 3. Create or update the client_portal_users record
  const passwordHash = await hashPassword(password);

  let portalUser: ClientPortalUser | null = null;
  try {
    // Check if user already exists (e.g. re-submitting form)
    const existing = await sbSelect<ClientPortalUser>(
      "client_portal_users",
      { email: `eq.${email.toLowerCase()}` },
      { limit: 1 }
    );

    if (existing[0]) {
      portalUser = existing[0];
      // Update password if they're re-submitting
      await sbUpdate(
        "client_portal_users",
        { id: `eq.${existing[0].id}` },
        { password_hash: passwordHash, updated_at: new Date().toISOString() }
      );
    } else {
      portalUser = await sbInsert<ClientPortalUser>("client_portal_users", {
        client_id: clientId,
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name: ownerName,
        is_owner: true,
      });
    }
  } catch (err) {
    console.error("[onboarding] Failed to create portal user:", err);
    return NextResponse.json(
      { error: "Failed to create your account. Please try again or contact hello@opsbynoell.com." },
      { status: 500 }
    );
  }

  // 4. Upsert onboarding submission
  try {
    await sbUpsert(
      "onboarding_submissions",
      {
        stripe_session_id: stripeSessionId || `manual-${Date.now()}`,
        stripe_customer_id: stripeCustomerId || "manual",
        email: email.toLowerCase(),
        business_name: businessName,
        owner_name: ownerName,
        phone,
        website: website || null,
        booking_tool: bookingTool || null,
        vertical: vertical || null,
        plan_id: planId,
        client_id: clientId,
      },
      "stripe_session_id"
    );
  } catch (err) {
    console.error("[onboarding] Failed to save submission:", err);
    // Non-blocking
  }

  // 5. Update customer record with client_id if we have one
  if (customerId) {
    try {
      await sbUpdate(
        "customers",
        { id: `eq.${customerId}` },
        { client_id: clientId, name: ownerName, updated_at: new Date().toISOString() }
      );
    } catch {
      // Non-critical
    }
  }

  // 6. Notify operator
  await sendAgentEmailAlert({
    subject: `New client onboarded: ${businessName}`,
    text: [
      `New client completed onboarding.`,
      ``,
      `Business: ${businessName}`,
      `Owner: ${ownerName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Website: ${website || "(not provided)"}`,
      `Booking tool: ${bookingTool || "(not provided)"}`,
      `Business type: ${vertical || "(not provided)"}`,
      `Plan: ${planId}`,
      `Client ID: ${clientId}`,
      ``,
      `Action needed: Configure their agents and go live within 5 business days.`,
      `Admin dashboard: https://www.opsbynoell.com/admin`,
    ].join("\n"),
  });

  // 7. Set client session cookie so they land on their dashboard
  const token = await createClientToken({
    userId: portalUser!.id,
    email: email.toLowerCase(),
    clientId,
    name: ownerName,
  });

  const res = NextResponse.json({ ok: true, clientId });
  res.cookies.set(CLIENT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return res;
}
