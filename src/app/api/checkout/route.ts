/**
 * POST /api/checkout
 *
 * Creates a Stripe Checkout Session for a given plan and redirects the
 * browser to the Stripe-hosted checkout page.
 *
 * Body: { planId: string, email?: string }
 * Returns: { url: string } — the Stripe checkout URL to redirect to.
 */
import { NextResponse } from "next/server";
import { getStripe, getPlanById, STRIPE_PLANS } from "@/lib/stripe";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.opsbynoell.com";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  let body: { planId?: string; email?: string };
  try {
    body = (await req.json()) as { planId?: string; email?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const planId = body.planId ?? "agents_founding";
  const plan = getPlanById(planId);

  if (!plan) {
    return NextResponse.json(
      { error: `Unknown plan: ${planId}. Valid plans: ${STRIPE_PLANS.map((p) => p.id).join(", ")}` },
      { status: 400 }
    );
  }

  if (!plan.priceId) {
    return NextResponse.json(
      {
        error: `Stripe Price ID not configured for plan "${planId}". Set the STRIPE_PRICE_${planId.toUpperCase()} environment variable.`,
      },
      { status: 500 }
    );
  }

  const stripe = getStripe();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      ...(body.email ? { customer_email: body.email } : {}),
      success_url: `${SITE_URL}/onboarding?session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
      cancel_url: `${SITE_URL}/pricing?checkout=canceled`,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          plan_id: planId,
          source: "opsbynoell_website",
        },
      },
      metadata: {
        plan_id: planId,
      },
      // Collect billing address for tax purposes
      billing_address_collection: "auto",
      // Show the plan name in the checkout header
      custom_text: {
        submit: {
          message: `You will be charged $${(plan.amountCents / 100).toFixed(0)}/month. Cancel anytime with 30 days notice.`,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[checkout] Stripe session creation failed:", message);
    return NextResponse.json(
      { error: "Could not create checkout session. Please try again." },
      { status: 500 }
    );
  }
}
