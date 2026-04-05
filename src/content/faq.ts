// ─── Shared FAQ Content ─────────────────────────────────────────────────────────
// Centralized FAQ exports consumed by pricing and nova pages.
// Import and use directly — do not duplicate across page content files.

// ── Pricing Page FAQ ────────────────────────────────────────────────────────────
// Re-exported from src/content/pricing.ts for shared access
export { pricingFaq } from "@/content/pricing";

// ── Nova Page FAQ ────────────────────────────────────────────────────────────────
// Re-exported from src/content/nova.ts for shared access
export { novaFaq } from "@/content/nova";

// ── Type ─────────────────────────────────────────────────────────────────────────
export type FaqItem = {
  question: string;
  answer: string;
};
