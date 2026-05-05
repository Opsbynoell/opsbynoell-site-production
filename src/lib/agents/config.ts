/**
 * Per-client configuration loader.
 *
 * Reads a `clients` row from Supabase and normalizes it into the
 * `ClientConfig` shape used throughout the agent system. Results are
 * memoized for the lifetime of the serverless invocation so repeated
 * lookups inside one request do not cost extra round-trips.
 */

import { sbSelect } from "./supabase";
import type { ClientConfig, PciCronTier } from "./types";

type ClientRow = {
  client_id: string;
  business_name: string;
  brand_name?: string | null;
  vertical?: string | null;
  agents?: ClientConfig["agents"];
  support_system_prompt?: string | null;
  support_greeting?: string | null;
  support_booking_url?: string | null;
  front_desk_system_prompt?: string | null;
  calendar_provider?: ClientConfig["calendarProvider"] | null;
  calendar_config?: Record<string, unknown>;
  sms_provider?: ClientConfig["smsProvider"] | null;
  sms_config?: Record<string, unknown>;
  missed_call_text_template?: string | null;
  reminder_cadence?: string[];
  review_platform?: ClientConfig["reviewPlatform"] | null;
  review_url?: string | null;
  reactivation_threshold_days?: number;
  care_system_prompt?: string | null;
  care_greeting?: string | null;
  primary_color?: string | null;
  phone?: string | null;
  email?: string | null;
  hours?: Record<string, string>;
  locations?: ClientConfig["locations"];
  team?: ClientConfig["team"];
  escalation_rules?: ClientConfig["escalationRules"];
  telegram_chat_id?: string | null;
  services?: ClientConfig["services"];
  pci_config?: Record<string, unknown> | null;
  active: boolean;
};

function parsePciCronTier(raw: unknown): PciCronTier {
  if (raw === "standard" || raw === "realtime" || raw === "disabled") {
    return raw;
  }
  return "disabled";
}

interface CacheEntry {
  cfg: ClientConfig;
  expiresAt: number;
}

// Short TTL so a bad system prompt or killswitch flip rolls out in at
// most CONFIG_CACHE_TTL_MS. Set to 0 to disable the cache entirely.
const CONFIG_CACHE_TTL_MS = (() => {
  const raw = process.env.CLIENT_CONFIG_TTL_MS;
  if (!raw) return 30_000; // 30s default
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : 30_000;
})();

const cache = new Map<string, CacheEntry>();

export async function getClientConfig(
  clientId: string
): Promise<ClientConfig> {
  const now = Date.now();
  const cached = cache.get(clientId);
  if (cached && cached.expiresAt > now) return cached.cfg;
  const rows = await sbSelect<ClientRow>(
    "clients",
    { client_id: `eq.${clientId}` },
    { limit: 1 }
  );
  if (rows.length === 0) {
    throw new Error(`Unknown client_id: ${clientId}`);
  }
  const row = rows[0];
  const cfg: ClientConfig = {
    clientId: row.client_id,
    businessName: row.business_name,
    brandName: row.brand_name ?? undefined,
    vertical: row.vertical ?? "",
    agents: row.agents ?? { support: true, frontDesk: false, care: false },
    supportSystemPrompt: row.support_system_prompt ?? undefined,
    supportGreeting: row.support_greeting ?? undefined,
    supportBookingUrl: row.support_booking_url ?? undefined,
    frontDeskSystemPrompt: row.front_desk_system_prompt ?? undefined,
    calendarProvider: row.calendar_provider ?? undefined,
    calendarConfig: row.calendar_config ?? {},
    smsProvider: row.sms_provider ?? undefined,
    smsConfig: row.sms_config ?? {},
    missedCallTextTemplate: row.missed_call_text_template ?? undefined,
    reminderCadence: row.reminder_cadence ?? ["24h", "2h"],
    reviewPlatform: row.review_platform ?? undefined,
    reviewUrl: row.review_url ?? undefined,
    reactivationThresholdDays: row.reactivation_threshold_days ?? 60,
    careSystemPrompt: row.care_system_prompt ?? undefined,
    careGreeting: row.care_greeting ?? undefined,
    primaryColor: row.primary_color ?? undefined,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    hours: row.hours ?? {},
    locations: row.locations ?? [],
    team: row.team ?? [],
    escalationRules: row.escalation_rules ?? [],
    telegramChatId: row.telegram_chat_id ?? undefined,
    services: row.services ?? [],
    pciCronTier: parsePciCronTier(
      (row.pci_config ?? {})["cronTier"]
    ),
    active: row.active,
  };
  if (CONFIG_CACHE_TTL_MS > 0) {
    cache.set(clientId, { cfg, expiresAt: now + CONFIG_CACHE_TTL_MS });
  }
  return cfg;
}

/** Force-clear the cache for a client (or all clients). Exported for
 *  admin tooling that mutates clients rows and wants the change live now. */
export function invalidateClientConfig(clientId?: string): void {
  if (clientId) cache.delete(clientId);
  else cache.clear();
}
