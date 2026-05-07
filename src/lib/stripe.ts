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
      "Three AI agents: Noell Support, Noell Front Desk, and Noell Care. Founding rate locked for 24 months.",
    priceId: process.env.STRIPE_PRICE_AGENTS_FOUNDING ?? "",
    amountCents: 19700,
    interval: "month",
    isFoundingRate: true,
  },
  {
    id: "agents_standard",
    name: "Noell Agents",
    description:
      "Three AI agents: Noell Support, Noell Front Desk, and Noell Care.",
    priceId: process.env.STRIPE_PRICE_AGENTS_STANDARD ?? "",
    amountCents: 29700,
    interval: "month",
  },
  {
    id: "essentials",
    name: "Noell System — Essentials",
    description:
      "Full done-for-you operations layer. CRM, booking calendar, missed-call text-back, confirmations, and review requests.",
    priceId: process.env.STRIPE_PRICE_ESSENTIALS ?? "",
    amountCents: 19700,
    interval: "month",
    setupFeeAmountCents: 49700,
  },
  {
    id: "growth",
    name: "Noell System — Growth",
    description:
      "Full operations layer plus all three AI agents, PCI signals, no-show recovery, and reputation workflows.",
    priceId: process.env.STRIPE_PRICE_GROWTH ?? "",
    amountCents: 79700,
    interval: "month",
    setupFeeAmountCents: 99700,
  },
  {
    id: "custom_ops",
    name: "Noell System — Custom Ops",
    description:
      "Everything in Growth plus multi-location sync, reactivation campaigns, dedicated account manager, and client mobile app.",
    priceId: process.env.STRIPE_PRICE_CUSTOM_OPS ?? "",
    amountCents: 149700,
    interval: "month",
    setupFeeAmountCents: 149700,
  },
];

export function getPlanById(planId: string): StripePlan | undefined {
  return STRIPE_PLANS.find((p) => p.id === planId);
}
