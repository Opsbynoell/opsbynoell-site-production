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
  constructor(private cfg: GenericCalendarConfig) {
    if (!cfg.clientId) throw new Error("generic calendar clientId required");
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

export class TwilioSms implements SMSIntegration {
  async sendSMS(to: string, body: string): Promise<{ messageId: string }> {
    const sid = env.twilioAccountSid();
    const token = env.twilioAuthToken();
    const from = env.twilioFromNumber();
    if (!sid || !token || !from) {
      throw new Error("Twilio env vars not configured");
    }
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: to, From: from, Body: body }),
      }
    );
    if (!res.ok) {
      throw new Error(`twilio send failed: ${res.status} ${await res.text()}`);
    }
    const data = (await res.json()) as { sid: string };
    return { messageId: data.sid };
  }
}
