/**
 * Environment-variable helpers for the agent backend.
 *
 * Every agent API route reads secrets through these helpers so we fail
 * loudly (in one place) when a deploy is missing a var, instead of
 * mysteriously silently 500ing from a request handler.
 */

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `Missing required environment variable: ${name}. Check Vercel project settings.`
    );
  }
  return v;
}

function optional(name: string): string | undefined {
  return process.env[name];
}

export const env = {
  // Supabase (project clipzfkbzupjctherijz)
  supabaseUrl: () => required("SUPABASE_URL"),
  supabaseServiceKey: () => required("SUPABASE_SERVICE_ROLE_KEY"),

  // Claude
  anthropicApiKey: () => required("ANTHROPIC_API_KEY"),
  anthropicModel: () =>
    optional("ANTHROPIC_MODEL") ?? "claude-sonnet-4-20250514",

  // Telegram
  telegramBotToken: () => optional("TELEGRAM_BOT_TOKEN"),
  telegramDefaultChatId: () => optional("TELEGRAM_DEFAULT_CHAT_ID"),

  // Twilio (generic SMS provider)
  //
  // A2P 10DLC sender pool is configured via a Messaging Service. When
  // TWILIO_MESSAGING_SERVICE_SID is set, the Twilio integration uses
  // MessagingServiceSid (recommended) — Twilio handles sender selection,
  // sticky sender, and rate-limit smoothing. TWILIO_FROM_NUMBER is kept
  // for the dev/smoke fallback path only.
  twilioAccountSid: () => optional("TWILIO_ACCOUNT_SID"),
  twilioAuthToken: () => optional("TWILIO_AUTH_TOKEN"),
  twilioApiKeySid: () => optional("TWILIO_API_KEY_SID"),
  twilioApiKeySecret: () => optional("TWILIO_API_KEY_SECRET"),
  twilioMessagingServiceSid: () => optional("TWILIO_MESSAGING_SERVICE_SID"),
  twilioFromNumber: () => optional("TWILIO_FROM_NUMBER"),
  twilioStatusCallbackUrl: () => optional("TWILIO_STATUS_CALLBACK_URL"),

  // GHL (shared across all clients on GHL — individual location configs
  // live in `clients.calendar_config` / `clients.sms_config`).
  ghlApiKey: () => optional("GHL_API_KEY"),
  ghlApiBase: () => optional("GHL_API_BASE") ?? "https://services.leadconnectorhq.com",
  ghlApiVersion: () => optional("GHL_API_VERSION") ?? "2021-07-28",

  // Resend (email alerts — interim until Twilio SMS is wired post-A2P)
  resendApiKey: () => optional("RESEND_API_KEY"),
  resendFromEmail: () => optional("RESEND_FROM_EMAIL") ?? "hello@opsbynoell.com",
  alertToEmail: () => optional("ALERT_TO_EMAIL") ?? "hello@opsbynoell.com",

  // Cron protection
  cronSecret: () => optional("CRON_SECRET"),

  // Two-way SMS bridge — shared secret for the inbound-SMS webhook.
  // Generate with: openssl rand -hex 32
  // Vercel: Settings → Environment Variables → GHL_WEBHOOK_SECRET
  ghlWebhookSecret: () => optional("GHL_WEBHOOK_SECRET"),
};
