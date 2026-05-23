/**
 * Stripe server-side client.
 *
 * Import this only from server-side code (API routes, Server Components).
 * Never import from client components — it would expose the secret key.
 */
import Stripe from "stripe";

function getStripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY environment variable. Set it in Vercel project settings."
    );
  }
  return key;
}

// Singleton pattern — reuse across hot reloads in dev
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(getStripeSecretKey(), {
      apiVersion: "2026-04-22.dahlia",
      typescript: true,
    });
  }
  return _stripe;
}

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

// ─────────────────────────────────────────────────────────────────────────────
// Product / Price catalog
// Maps plan IDs to Stripe Price IDs (set via env vars so you can swap
// test vs live prices without code changes).
// ─────────────────────────────────────────────────────────────────────────────
export interface StripePlan {
  id: string;
  name: string;
  description: string;
  priceId: string;        // Stripe Price ID (from env)
  amountCents: number;    // Display amount
  interval: "month" | "year";
  isFoundingRate?: boolean;
  setupFeeAmountCents?: number;
}

export const STRIPE_PLANS: StripePlan[] = [
  {
    id: "agents_founding",
    name: "Noell Agents — Founding Rate",
    description:
      "Three AI agents: Noell Support, Noell Front Desk, and Noell Care. Founding rate locked from day one.",
    priceId: process.env.STRIPE_PRICE_AGENTS_FOUNDING ?? "",
    amountCents: 39700,
    interval: "month",
    isFoundingRate: true,
  },
  {
    id: "agents_standard",
    name: "Noell Agents",
    description:
      "Three AI agents: Noell Support, Noell Front Desk, and Noell Care.",
    priceId: process.env.STRIPE_PRICE_AGENTS_STANDARD ?? "",
    amountCents: 49700,
    interval: "month",
  },
  {
    id: "essentials",
    name: "Noell System — Signal",
    description:
      "One agent: Noell Support handles 24/7 website chat and lead capture with HOT/WARM scoring. Works alongside any existing booking tool.",
    priceId: process.env.STRIPE_PRICE_ESSENTIALS ?? "",
    amountCents: 39700,
    interval: "month",
  },
  {
    id: "growth",
    name: "Noell System — System",
    description:
      "All three agents (Support, Front Desk, Care), deep two-way PMS or booking integration, no-show recovery, review automation, and the full Noell Ops Dashboard.",
    priceId: process.env.STRIPE_PRICE_GROWTH ?? "",
    amountCents: 89700,
    interval: "month",
  },
  {
    id: "custom_ops",
    name: "Noell System — Full Stack",
    description:
      "Everything in System, plus a full website build or redesign, the Noell Ops CRM, click-through audit, custom automation workflows, and a dedicated ops partner.",
    priceId: process.env.STRIPE_PRICE_CUSTOM_OPS ?? "",
    amountCents: 149700,
    interval: "month",
  },
];

export function getPlanById(planId: string): StripePlan | undefined {
  return STRIPE_PLANS.find((p) => p.id === planId);
}
