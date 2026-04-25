/**
 * Generic integration (Supabase-backed calendar + Twilio SMS).
 *
 * For clients who do not run GHL. The calendar lives entirely in our
 * `appointments` table; SMS is sent through Twilio. Availability is
 * derived from a simple rule: open working-hours minus booked slots.
 *
 * This is the "plain" implementation of the pluggable interfaces.
 * Future Calendly / Acuity / Vagaro adapters slot in alongside it.
 */

import { env } from "../env";
import { sbInsert, sbSelect, sbUpdate } from "../supabase";
import type {
  AppointmentDetails,
  BookingRequest,
  BookingResult,
  CalendarIntegration,
  SMSIntegration,
  TimeSlot,
} from "../types";

interface GenericCalendarConfig {
  clientId: string;
  defaultDurationMinutes?: number;
  /** Open hours per weekday, 0=Sun..6=Sat. e.g. { "1": "09:00-17:00" }. */
  workingHours?: Record<string, string>;
}

interface AppointmentRow {
  id: string;
  visitor_name: string | null;
  visitor_phone: string | null;
  service_type: string | null;
  scheduled_at: string;
  duration_minutes: number | null;
  status: AppointmentDetails["status"];
}

function parseRange(range: string): { start: number; end: number } | null {
  const m = /^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/.exec(range);
  if (!m) return null;
  return {
    start: parseInt(m[1], 10) * 60 + parseInt(m[2], 10),
    end: parseInt(m[3], 10) * 60 + parseInt(m[4], 10),
  };
}

export class GenericCalendar implements CalendarIntegration {
  private readonly cfg: GenericCalendarConfig;
  constructor(cfg: GenericCalendarConfig) {
    if (!cfg.clientId) throw new Error("generic calendar clientId required");
    this.cfg = cfg;
  }

  async getAvailableSlots(
    date: Date,
    _serviceType: string
  ): Promise<TimeSlot[]> {
    const duration = this.cfg.defaultDurationMinutes ?? 60;
    const weekday = String(date.getDay());
    const hours = this.cfg.workingHours?.[weekday];
    if (!hours) return [];
    const range = parseRange(hours);
    if (!range) return [];

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const booked = await sbSelect<AppointmentRow>(
      "appointments",
      {
        client_id: `eq.${this.cfg.clientId}`,
        scheduled_at: `gte.${dayStart.toISOString()}`,
        status: "in.(confirmed,reminded,rescheduled)",
      },
      { limit: 200, order: "scheduled_at.asc" }
    );
    const bookedMinutes = new Set<number>();
    for (const a of booked) {
      const t = new Date(a.scheduled_at);
      if (t >= dayEnd) continue;
      const minutesFromMidnight = t.getHours() * 60 + t.getMinutes();
      const dur = a.duration_minutes ?? duration;
      for (let m = 0; m < dur; m += 15) {
        bookedMinutes.add(minutesFromMidnight + m);
      }
    }

    const slots: TimeSlot[] = [];
    for (let m = range.start; m + duration <= range.end; m += 30) {
      let free = true;
      for (let k = 0; k < duration; k += 15) {
        if (bookedMinutes.has(m + k)) {
          free = false;
          break;
        }
      }
      if (!free) continue;
      const start = new Date(dayStart);
      start.setMinutes(m);
      const end = new Date(start.getTime() + duration * 60 * 1000);
      slots.push({ start, end });
    }
    return slots;
  }

  async createAppointment(booking: BookingRequest): Promise<BookingResult> {
    const row = await sbInsert<{ id: string }>("appointments", {
      client_id: this.cfg.clientId,
      visitor_name: booking.clientName,
      visitor_phone: booking.clientPhone,
      visitor_email: booking.clientEmail,
      service_type: booking.serviceType,
      scheduled_at: booking.scheduledAt.toISOString(),
      duration_minutes:
        booking.durationMinutes ?? this.cfg.defaultDurationMinutes ?? 60,
      status: "confirmed",
      calendar_provider: "generic",
      notes: booking.notes,
    });
    return { appointmentId: row.id };
  }

  async rescheduleAppointment(
    appointmentId: string,
    newTime: Date
  ): Promise<void> {
    await sbUpdate("appointments", { id: `eq.${appointmentId}` }, {
      scheduled_at: newTime.toISOString(),
      status: "rescheduled",
    });
  }

  async cancelAppointment(
    appointmentId: string,
    reason?: string
  ): Promise<void> {
    await sbUpdate("appointments", { id: `eq.${appointmentId}` }, {
      status: "cancelled",
      notes: reason,
    });
  }

  async getAppointment(appointmentId: string): Promise<AppointmentDetails> {
    const rows = await sbSelect<AppointmentRow>(
      "appointments",
      { id: `eq.${appointmentId}` },
      { limit: 1 }
    );
    if (rows.length === 0) {
      throw new Error(`appointment ${appointmentId} not found`);
    }
    const a = rows[0];
    return {
      appointmentId: a.id,
      clientName: a.visitor_name ?? "",
      clientPhone: a.visitor_phone ?? "",
      serviceType: a.service_type ?? "",
      scheduledAt: new Date(a.scheduled_at),
      status: a.status,
    };
  }
}

// ---------- Twilio SMS ----------

/**
 * Twilio SMS sender (A2P 10DLC).
 *
 * Sender selection (in priority order):
 *   1. cfg.messagingServiceSid  — per-client override (recommended for multi-tenant)
 *   2. TWILIO_MESSAGING_SERVICE_SID env  — default Messaging Service for all clients
 *   3. cfg.fromNumber  — explicit E.164 sender (fallback / dev / smoke test)
 *   4. TWILIO_FROM_NUMBER env  — last-resort fallback
 *
 * Auth (in priority order):
 *   1. TWILIO_API_KEY_SID + TWILIO_API_KEY_SECRET (recommended — rotatable, scoped)
 *   2. TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN  (fallback)
 *
 * If TWILIO_STATUS_CALLBACK_URL is set, delivery status callbacks (sent /
 * delivered / failed / undelivered) are POSTed back to that URL by Twilio.
 */
export interface TwilioSmsConfig {
  /** Per-client Messaging Service SID override (e.g. "MGd2131b4ca062be6705d95e671a35a33d"). */
  messagingServiceSid?: string;
  /** Per-client explicit FROM number override. Ignored if messagingServiceSid is set. */
  fromNumber?: string;
  /** Per-client status callback URL override. */
  statusCallback?: string;
}

export class TwilioSms implements SMSIntegration {
  private readonly cfg: TwilioSmsConfig;

  constructor(cfg: TwilioSmsConfig = {}) {
    this.cfg = cfg;
  }

  async sendSMS(to: string, body: string): Promise<{ messageId: string }> {
    const sid = env.twilioAccountSid();
    if (!sid) {
      throw new Error("Twilio not configured: missing TWILIO_ACCOUNT_SID");
    }

    // Auth header — prefer scoped API Key over Account auth token.
    const apiKeySid = env.twilioApiKeySid();
    const apiKeySecret = env.twilioApiKeySecret();
    const authUser = apiKeySid ?? sid;
    const authPass = apiKeySid ? apiKeySecret : env.twilioAuthToken();
    if (!authPass) {
      throw new Error(
        "Twilio not configured: missing TWILIO_API_KEY_SECRET or TWILIO_AUTH_TOKEN"
      );
    }

    // Sender selection — Messaging Service wins.
    const messagingServiceSid =
      this.cfg.messagingServiceSid ?? env.twilioMessagingServiceSid();
    const fromNumber = this.cfg.fromNumber ?? env.twilioFromNumber();
    if (!messagingServiceSid && !fromNumber) {
      throw new Error(
        "Twilio not configured: set TWILIO_MESSAGING_SERVICE_SID (recommended) or TWILIO_FROM_NUMBER"
      );
    }

    const params = new URLSearchParams({ To: to, Body: body });
    if (messagingServiceSid) {
      params.set("MessagingServiceSid", messagingServiceSid);
    } else if (fromNumber) {
      params.set("From", fromNumber);
    }

    const statusCallback =
      this.cfg.statusCallback ?? env.twilioStatusCallbackUrl();
    if (statusCallback) {
      params.set("StatusCallback", statusCallback);
    }

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " + Buffer.from(`${authUser}:${authPass}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      }
    );
    if (!res.ok) {
      throw new Error(`twilio send failed: ${res.status} ${await res.text()}`);
    }
    const data = (await res.json()) as { sid: string };
    return { messageId: data.sid };
  }
}
