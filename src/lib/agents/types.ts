/**
 * Shared types for the Noell agent system.
 *
 * These types describe the data contracts between:
 *   - the widget (React) and the API routes
 *   - the API routes and Supabase
 *   - the API routes and the pluggable integration layer
 *
 * Nothing in this file should reach for a network or read from the
 * filesystem. Keep it pure.
 */

// -----------------------------------------------------------------
// Agent identity
// -----------------------------------------------------------------

export type AgentKind = "support" | "frontDesk" | "care";

export type Channel = "sms" | "chat" | "voice";

export type Intent = "hot" | "warm" | "low" | "unknown";

export type Role = "visitor" | "bot" | "human" | "system";

// -----------------------------------------------------------------
// Per-client configuration
// -----------------------------------------------------------------

export interface LocationInfo {
  label: string;
  address: string;
  parkingNotes?: string;
  arrivalNotes?: string;
}

export interface TeamMember {
  name: string;
  role?: string;
  specialties?: string[];
}

export interface EscalationRule {
  // Any signal that, if detected in a message, triggers escalation.
  match: string[]; // keywords (case-insensitive)
  reason: string; // human-readable reason for the alert
}

/**
 * Per-client PCI cron tier.
 *   "disabled" — no scheduled signal generation (default)
 *   "standard" — nightly run at 1am Pacific
 *   "realtime" — every 6 hours at 1am, 7am, 1pm, 7pm Pacific
 */
export type PciCronTier = "disabled" | "standard" | "realtime";

export interface ClientConfig {
  clientId: string;
  businessName: string;
  brandName?: string;
  vertical: string; // "massage" | "dental" | ...

  agents: {
    support: boolean;
    frontDesk: boolean;
    care: boolean;
  };

  // Noell Support (existing)
  supportSystemPrompt?: string;
  supportGreeting?: string;
  supportBookingUrl?: string;

  // Noell Front Desk
  frontDeskSystemPrompt?: string;
  calendarProvider?: "ghl" | "generic" | "calendly" | "acuity";
  calendarConfig?: Record<string, unknown>;
  smsProvider?: "ghl" | "ghl_whatsapp" | "twilio" | "generic";
  smsConfig?: Record<string, unknown>;
  missedCallTextTemplate?: string;
  reminderCadence?: string[]; // e.g. ["24h", "2h"]
  reviewPlatform?: "google" | "yelp" | "custom";
  reviewUrl?: string;
  reactivationThresholdDays?: number;

  // Noell Care
  careSystemPrompt?: string;
  careGreeting?: string;

  // Shared
  primaryColor?: string;
  phone?: string;
  email?: string;
  hours?: Record<string, string>;
  locations?: LocationInfo[];
  team?: TeamMember[];
  escalationRules?: EscalationRule[];
  telegramChatId?: string;
  services?: ServiceDefinition[];

  // PCI scheduled-generation tier. Read from clients.pci_config.cronTier.
  // Defaults to "disabled" when missing.
  pciCronTier?: PciCronTier;

  active: boolean;
}

export interface ServiceDefinition {
  name: string;
  durationMinutes: number;
  description?: string;
  priceRange?: string;
}

// -----------------------------------------------------------------
// Messages
// -----------------------------------------------------------------

export interface ChatMessage {
  role: Role;
  content: string;
  timestamp?: string;
}

// -----------------------------------------------------------------
// Integration layer
// -----------------------------------------------------------------

export interface TimeSlot {
  start: Date;
  end: Date;
  providerId?: string;
}

export interface BookingRequest {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceType: string;
  scheduledAt: Date;
  durationMinutes?: number;
  notes?: string;
}

export interface BookingResult {
  appointmentId: string;
  confirmationUrl?: string;
  externalId?: string;
}

export interface AppointmentDetails {
  appointmentId: string;
  clientName: string;
  clientPhone: string;
  serviceType: string;
  scheduledAt: Date;
  status: "confirmed" | "completed" | "no_show" | "rescheduled" | "cancelled";
}

export interface CalendarIntegration {
  getAvailableSlots(
    date: Date,
    serviceType: string
  ): Promise<TimeSlot[]>;
  createAppointment(booking: BookingRequest): Promise<BookingResult>;
  rescheduleAppointment(
    appointmentId: string,
    newTime: Date
  ): Promise<void>;
  cancelAppointment(
    appointmentId: string,
    reason?: string
  ): Promise<void>;
  getAppointment(appointmentId: string): Promise<AppointmentDetails>;
}

export interface SMSIntegration {
  sendSMS(to: string, body: string): Promise<{ messageId: string }>;
}

/** WhatsApp template variable sections (BODY, HEADER, etc.) */
export interface TemplateParams {
  [section: string]: { params: string[] };
}

/**
 * Extended messaging integration that adds optional WhatsApp template
 * sending on top of the basic SMSIntegration.sendSMS(). Returned by the
 * registry when smsProvider === 'ghl_whatsapp'.
 */
export interface MessagingIntegration extends SMSIntegration {
  /**
   * Send an approved WhatsApp template message via its GHL template ID.
   * Falls back to sendSMS() free-form if not implemented.
   */
  sendTemplate?(
    to: string,
    templateId: string,
    params?: TemplateParams
  ): Promise<{ messageId: string }>;
  /** True for WhatsApp providers; used by routes to choose send path. */
  isWhatsApp?: boolean;
}

export interface ReviewPlatformIntegration {
  getReviewUrl(clientId: string, platform: string): string;
}

// -----------------------------------------------------------------
// API payloads
// -----------------------------------------------------------------

export interface MissedCallPayload {
  clientId: string;
  from: string; // phone number
  to?: string;
  callSid?: string;
  contactName?: string;
}

export interface AgentMessagePayload {
  clientId: string;
  sessionId?: string; // omit for new sessions
  agent: AgentKind;
  channel: Channel;
  from: {
    name?: string;
    phone?: string;
    email?: string;
    ip?: string;
  };
  message: string;
}

export interface AgentMessageResponse {
  sessionId: string;
  reply: string;
  intent: Intent;
  escalated: boolean;
  handoff?: AgentKind;
}
