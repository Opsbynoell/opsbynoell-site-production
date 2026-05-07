/**
 * POST /api/webhooks/stripe
 *
 * Handles Stripe webhook events to keep Supabase in sync with
 * subscription state. Verifies the Stripe signature before processing.
 *
 * Events handled:
 *   - checkout.session.completed  → upsert customer + subscription
 *   - customer.subscription.updated → update subscription status
 *   - customer.subscription.deleted → mark subscription canceled
 *   - invoice.payment_failed       → mark subscription past_due
 */
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { sbInsert, sbUpdate, sbSelect, sbUpsert } from "@/lib/agents/supabase";
import { sendAgentEmailAlert } from "@/lib/agents/email-alert";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Disable body parsing — we need the raw body for signature verification
export async function POST(req: Request): Promise<Response> {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  if (!STRIPE_WEBHOOK_SECRET) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[stripe-webhook] Signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`[stripe-webhook] Processing event: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        // Acknowledge but do not process
        break;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error(`[stripe-webhook] Handler error for ${event.type}:`, message);
    // Return 200 to prevent Stripe from retrying — log the error for investigation
    return NextResponse.json({ received: true, warning: message });
  }

  return NextResponse.json({ received: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// Event handlers
// ─────────────────────────────────────────────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const stripeCustomerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? "";

  const stripeSubscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id ?? "";

  const email = session.customer_details?.email ?? session.customer_email ?? "";
  const name = session.customer_details?.name ?? "";
  const planId = session.metadata?.plan_id ?? "agents_founding";

  if (!stripeCustomerId || !stripeSubscriptionId) {
    console.error("[stripe-webhook] Missing customer or subscription ID in checkout session");
    return;
  }

  // 1. Upsert customer record
  interface CustomerRow {
    id: string;
    client_id: string | null;
    stripe_customer_id: string;
    email: string;
    name: string | null;
  }

  const customer = await sbUpsert<CustomerRow>(
    "customers",
    {
      stripe_customer_id: stripeCustomerId,
      email,
      name: name || null,
      updated_at: new Date().toISOString(),
    },
    "stripe_customer_id"
  );

  // 2. Fetch full subscription details from Stripe
  const stripeSub = await getStripe().subscriptions.retrieve(stripeSubscriptionId);
  const priceId = stripeSub.items.data[0]?.price?.id ?? "";
  const amountCents = stripeSub.items.data[0]?.price?.unit_amount ?? 0;
  const interval = (stripeSub.items.data[0]?.price?.recurring?.interval ?? "month") as "month" | "year";

  // 3. Upsert subscription record
  await sbUpsert(
    "subscriptions",
    {
      customer_id: customer.id,
      stripe_subscription_id: stripeSubscriptionId,
      stripe_price_id: priceId,
      plan_id: planId,
      status: stripeSub.status,
      amount_cents: amountCents,
      currency: stripeSub.currency,
      interval,
      current_period_start: (stripeSub as unknown as Record<string, unknown>).current_period_start ? new Date(((stripeSub as unknown as Record<string, number>).current_period_start) * 1000).toISOString() : null,
      current_period_end: (stripeSub as unknown as Record<string, unknown>).current_period_end ? new Date(((stripeSub as unknown as Record<string, number>).current_period_end) * 1000).toISOString() : null,
      cancel_at_period_end: stripeSub.cancel_at_period_end,
      metadata: { plan_id: planId, checkout_session_id: session.id },
      updated_at: new Date().toISOString(),
    },
    "stripe_subscription_id"
  );

  // 4. Notify the operator
  await sendAgentEmailAlert({
    subject: `New subscription: ${email} — ${planId}`,
    text: [
      `New subscription purchased on opsbynoell.com.`,
      ``,
      `Email: ${email}`,
      `Name: ${name || "(not provided)"}`,
      `Plan: ${planId}`,
      `Amount: $${(amountCents / 100).toFixed(2)}/month`,
      `Stripe Customer: ${stripeCustomerId}`,
      `Stripe Subscription: ${stripeSubscriptionId}`,
      ``,
      `Next step: They should complete onboarding at /onboarding.`,
      `Check the admin dashboard at /admin/revenue for full details.`,
    ].join("\n"),
  });

  console.log(`[stripe-webhook] New subscription: ${email} (${planId})`);
}

async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
  const stripeSubscriptionId = sub.id;
  const planId = sub.metadata?.plan_id ?? "";

  await sbUpdate(
    "subscriptions",
    { stripe_subscription_id: `eq.${stripeSubscriptionId}` },
    {
      status: sub.status,
      current_period_start: (sub as unknown as Record<string, unknown>).current_period_start ? new Date(((sub as unknown as Record<string, number>).current_period_start) * 1000).toISOString() : null,
      current_period_end: (sub as unknown as Record<string, unknown>).current_period_end ? new Date(((sub as unknown as Record<string, number>).current_period_end) * 1000).toISOString() : null,
      cancel_at_period_end: sub.cancel_at_period_end,
      canceled_at: sub.canceled_at
        ? new Date(sub.canceled_at * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    }
  );

  console.log(`[stripe-webhook] Subscription updated: ${stripeSubscriptionId} → ${sub.status}`);
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  await sbUpdate(
    "subscriptions",
    { stripe_subscription_id: `eq.${sub.id}` },
    {
      status: "canceled",
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  );

  // Look up the customer email to notify the operator
  interface CustomerRow { email: string; name: string | null; }
  try {
    const customers = await sbSelect<CustomerRow>(
      "customers",
      { stripe_customer_id: `eq.${typeof sub.customer === "string" ? sub.customer : sub.customer.id}` },
      { limit: 1 }
    );
    const customer = customers[0];
    if (customer) {
      await sendAgentEmailAlert({
        subject: `Subscription canceled: ${customer.email}`,
        text: [
          `A subscription has been canceled.`,
          ``,
          `Email: ${customer.email}`,
          `Name: ${customer.name ?? "(not provided)"}`,
          `Stripe Subscription: ${sub.id}`,
          `Canceled at: ${new Date().toISOString()}`,
        ].join("\n"),
      });
    }
  } catch {
    // Non-critical — just log
    console.warn("[stripe-webhook] Could not fetch customer for cancellation email");
  }

  console.log(`[stripe-webhook] Subscription canceled: ${sub.id}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const invoiceAny = invoice as unknown as { subscription?: string | { id: string } | null };
  const stripeSubscriptionId =
    typeof invoiceAny.subscription === "string"
      ? invoiceAny.subscription
      : invoiceAny.subscription?.id ?? null;

  if (!stripeSubscriptionId) return;

  await sbUpdate(
    "subscriptions",
    { stripe_subscription_id: `eq.${stripeSubscriptionId}` },
    {
      status: "past_due",
      updated_at: new Date().toISOString(),
    }
  );

  console.log(`[stripe-webhook] Payment failed for subscription: ${stripeSubscriptionId}`);
}
