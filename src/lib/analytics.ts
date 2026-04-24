/**
 * Conversion analytics — event names and emission helpers.
 *
 * Today these events route through Meta Pixel (the only analytics provider
 * currently wired up). The helpers no-op safely when the pixel is missing.
 *
 * Keep the event name list in sync with docs/analytics.md.
 *
 * Why a thin layer on top of meta-pixel-track.ts:
 *   - One import site for every conversion CTA in the app, so swapping
 *     providers (GA4, PostHog, Segment, etc.) later is a single-file change.
 *   - Stable event names + typed source attribution so the journey
 *     homepage/vertical/comparison/pricing → /book can be rebuilt in any
 *     analytics tool from a single dimension.
 *   - Standard DOM `data-event` attribute can be added to elements we don't
 *     wrap in JS handlers; a future provider can subscribe with a single
 *     delegated click listener.
 */

import {
  trackMetaEvent,
  trackMetaCustomEvent,
} from "@/lib/meta-pixel-track";

/**
 * Pages that originate conversion clicks. When a CTA points at /book (or a
 * pricing tier CTA, or the support chat), include one of these so we can
 * rebuild the funnel in the analytics tool.
 */
export type SourcePage =
  | "home"
  | "pricing"
  | "book"
  | "agents"
  | "systems"
  | "about"
  | "contact"
  | "roi"
  | "noell_support"
  | "noell_front_desk"
  | "noell_care"
  | "verticals_index"
  | "verticals_dental"
  | "verticals_med_spas"
  | "verticals_salons"
  | "verticals_massage"
  | "verticals_estheticians"
  | "verticals_hvac"
  | "compare_index"
  | "compare_my_ai_front_desk"
  | "compare_podium"
  | "compare_ai_front_desk_alternatives"
  | "compare_diy_ai_receptionist"
  | "compare_human_answering_services"
  | "compare_local_business_messaging_platforms"
  | "case_studies"
  | "resources"
  | "navbar"
  | "footer"
  | "global_chat";

/**
 * Semantic section where the click happened. Keep values kebab_case and
 * short — they end up in the analytics UI as segmentation values.
 */
export type SourceSection =
  | "hero"
  | "final_cta"
  | "pick_your_path"
  | "systems_grid"
  | "pricing_cards"
  | "pricing_tier_cta"
  | "comparison_cta"
  | "vertical_card"
  | "vertical_agents_callout"
  | "navbar_primary"
  | "navbar_mobile"
  | "footer"
  | "faq_exit"
  | "book_exit_intent"
  | "booking_fallback"
  | "booking_embed"
  | "audit_request_soft_exit"
  | "founding_cta";

/**
 * The canonical conversion events. Narrow set on purpose — each has a
 * concrete downstream action so they stay useful in dashboards.
 */
export const ConversionEvents = {
  /** User clicked any CTA that leads to /book (audit request start). */
  AUDIT_CTA_CLICK: "audit_cta_click",
  /** User landed on /book page (funnel-entry marker). */
  AUDIT_PAGE_VIEW: "audit_page_view",
  /** User clicked a pricing tier CTA (already emitted as tier_card_click today). */
  PRICING_TIER_CLICK: "tier_card_click",
  /** Any pricing-page view event for segmentation. */
  PRICING_PAGE_VIEW: "pricing_page_view",
  /** User opened the audit worksheet exit-intent modal. */
  AUDIT_EXIT_INTENT_SHOWN: "audit_exit_intent_shown",
  /** User submitted the exit-intent worksheet email form. */
  AUDIT_WORKSHEET_REQUEST: "audit_worksheet_request",
  /** Booking fallback (manual scheduling) email CTA clicked. */
  BOOKING_FALLBACK_EMAIL_CLICK: "booking_fallback_email_click",
  /** Comparison page audit CTA clicked. */
  COMPARISON_AUDIT_CTA_CLICK: "comparison_audit_cta_click",
  /** User clicked a vertical card from the verticals hub. */
  VERTICAL_CARD_CLICK: "vertical_card_click",
  /** A Noell Agent ($197/mo) founding-member CTA click. */
  AGENTS_FOUNDING_CTA_CLICK: "agents_founding_cta_click",
} as const;

export type ConversionEventName =
  (typeof ConversionEvents)[keyof typeof ConversionEvents];

export interface ConversionContext {
  source_page?: SourcePage;
  source_section?: SourceSection;
  /** Destination href, if the click navigates. Useful for disambiguating /book variants. */
  destination?: string;
  /** Free-form extras, e.g. tier id, vertical slug. Keep keys snake_case. */
  [key: string]: unknown;
}

/**
 * Fire a conversion event. Currently sends a Meta Pixel custom event and,
 * for primary audit CTAs, also fires the Meta standard `Contact` event so
 * existing pixel-based audiences keep working unchanged.
 */
export function trackConversion(
  event: ConversionEventName,
  context: ConversionContext = {},
): void {
  if (typeof window === "undefined") return;
  try {
    trackMetaCustomEvent(event, context);
    if (event === ConversionEvents.AUDIT_CTA_CLICK) {
      trackMetaEvent("Contact", {
        content_name: "audit_request",
        source_page: context.source_page,
        source_section: context.source_section,
      });
    }
    if (event === ConversionEvents.AUDIT_WORKSHEET_REQUEST) {
      trackMetaEvent("Lead", {
        content_name: "audit_worksheet",
      });
    }
  } catch {
    // Analytics must never break the UI.
  }
}

/**
 * Emit an audit-CTA click. Convenience wrapper used everywhere a link or
 * button sends the visitor to /book.
 */
export function trackAuditCtaClick(
  source_page: SourcePage,
  source_section: SourceSection,
  extras: Omit<ConversionContext, "source_page" | "source_section"> = {},
): void {
  trackConversion(ConversionEvents.AUDIT_CTA_CLICK, {
    source_page,
    source_section,
    ...extras,
  });
}
