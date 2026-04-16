/**
 * GoHighLevel (GHL) integration.
 *
 * Implements CalendarIntegration + SMSIntegration against the LeadConnector
 * HQ API (v2). Each client's GHL location id and calendar id are stored
 * in `clients.calendar_config` / `clients.sms_config` and passed in at
 * construction time.
 *
 * This is the FIRST concrete implementation of the pluggable integration
 * interfaces. Additional providers (Calendly, Acuity, Vagaro) can be
 * added under src/lib/agents/integrations/ without changing any agent
 * logic.
 *
 * Known GHL location IDs (from the session context):
 *   - Ops by Noell:     Un5H1b2zXJM3agZ56j7c
 *   - Santa (anchor):   vdWqRPcn6jIx8AK0DlHF
 */

import { env } from "../env";
import type {
  AppointmentDetails,
  BookingRequest,
  BookingResult,
  CalendarIntegration,
  MessagingIntegration,
  SMSIntegration,
  TemplateParams,
  TimeSlot,
} from "../types";

interface GhlConfig {
  locationId: string;
  calendarId?: string;
  /** Optional per-location API key. Falls back to the env key. */
  apiKey?: string;
}

interface GhlWhatsappConfig extends GhlConfig {
  /** The WhatsApp Business phone number (e.g. '+19497849726'). */
  whatsappNumber?: string;
  /**
   * Map of template purpose → GHL template ID.
   * GHL template IDs are available in GHL Settings > WhatsApp > Templates
   * once Meta has approved the template.
   *
   * Keys: missedCallTextback | appointmentConfirmation | appointmentReminder
   *       | reviewRequest | reactivation
   */
  templates?: Record<string, string>;
}

function headers(cfg: GhlConfig): Record<string, string> {
  const key = cfg.apiKey ?? env.ghlApiKey();
  if (!key) throw new Error("GHL API key is not configured");
  return {
    Authorization: `Bearer ${key}`,
    Version: env.ghlApiVersion(),
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

function base(): string {
  return env.ghlApiBase();
}

// ---------- Calendar ----------

export class GhlCalendar implements CalendarIntegration {
  constructor(private cfg: GhlConfig) {
    if (!cfg.locationId) throw new Error("GHL locationId is required");
  }

  async getAvailableSlots(
    date: Date,
    _serviceType: string
  ): Promise<TimeSlot[]> {
    if (!this.cfg.calendarId) return [];
    const startEpoch = new Date(date);
    startEpoch.setHours(0, 0, 0, 0);
    const endEpoch = new Date(startEpoch);
    endEpoch.setDate(endEpoch.getDate() + 1);
    const url =
      `${base()}/calendars/${this.cfg.calendarId}/free-slots` +
      `?startDate=${startEpoch.getTime()}&endDate=${endEpoch.getTime()}`;
    const res = await fetch(url, { headers: headers(this.cfg) });
    if (!res.ok) {
      throw new Error(`ghl free-slots failed: ${res.status} ${await res.text()}`);
    }
    const data = (await res.json()) as {
      [dayKey: string]: { slots?: string[] } | unknown;
    };
    const slots: TimeSlot[] = [];
    for (const dayKey of Object.keys(data)) {
      const day = data[dayKey] as { slots?: string[] };
      for (const iso of day?.slots ?? []) {
        const start = new Date(iso);
        const end = new Date(start.getTime() + 30 * 60 * 1000);
        slots.push({ start, end });
      }
    }
    return slots;
  }

  async createAppointment(booking: BookingRequest): Promise<BookingResult> {
    if (!this.cfg.calendarId) throw new Error("GHL calendarId is required");
    // 1. upsert the contact
    const contactRes = await fetch(`${base()}/contacts/upsert`, {
      method: "POST",
      headers: headers(this.cfg),
      body: JSON.stringify({
        locationId: this.cfg.locationId,
        name: booking.clientName,
        phone: booking.clientPhone,
        email: booking.clientEmail,
      }),
    });
    if (!contactRes.ok) {
      throw new Error(
        `ghl contact upsert failed: ${contactRes.status} ${await contactRes.text()}`
      );
    }
    const contact = (await contactRes.json()) as {
      contact?: { id: string };
      id?: string;
    };
    const contactId = contact.contact?.id ?? contact.id;
    if (!contactId) throw new Error("ghl contact upsert returned no id");

    // 2. create the appointment
    const apptRes = await fetch(`${base()}/calendars/events/appointments`, {
      method: "POST",
      headers: headers(this.cfg),
      body: JSON.stringify({
        locationId: this.cfg.locationId,
        calendarId: this.cfg.calendarId,
        contactId,
        startTime: booking.scheduledAt.toISOString(),
        title: booking.serviceType,
        appointmentStatus: "confirmed",
        notes: booking.notes,
      }),
    });
    if (!apptRes.ok) {
      throw new Error(
        `ghl appointment create failed: ${apptRes.status} ${await apptRes.text()}`
      );
    }
    const appt = (await apptRes.json()) as { id?: string; appointmentId?: string };
    const externalId = appt.id ?? appt.appointmentId;
    if (!externalId) throw new Error("ghl appointment create returned no id");

    return { appointmentId: externalId, externalId };
  }

  async rescheduleAppointment(
    appointmentId: string,
    newTime: Date
  ): Promise<void> {
    const res = await fetch(
      `${base()}/calendars/events/appointments/${appointmentId}`,
      {
        method: "PUT",
        headers: headers(this.cfg),
        body: JSON.stringify({
          startTime: newTime.toISOString(),
          appointmentStatus: "confirmed",
        }),
      }
    );
    if (!res.ok) {
      throw new Error(
        `ghl reschedule failed: ${res.status} ${await res.text()}`
      );
    }
  }

  async cancelAppointment(
    appointmentId: string,
    reason?: string
  ): Promise<void> {
    const res = await fetch(
      `${base()}/calendars/events/appointments/${appointmentId}`,
      {
        method: "PUT",
        headers: headers(this.cfg),
        body: JSON.stringify({
          appointmentStatus: "cancelled",
          notes: reason,
        }),
      }
    );
    if (!res.ok) {
      throw new Error(`ghl cancel failed: ${res.status} ${await res.text()}`);
    }
  }

  async getAppointment(appointmentId: string): Promise<AppointmentDetails> {
    const res = await fetch(
      `${base()}/calendars/events/appointments/${appointmentId}`,
      { headers: headers(this.cfg) }
    );
    if (!res.ok) {
      throw new Error(
        `ghl appointment get failed: ${res.status} ${await res.text()}`
      );
    }
    const a = (await res.json()) as {
      id: string;
      startTime: string;
      appointmentStatus?: string;
      contact?: { name?: string; phone?: string };
      title?: string;
    };
    return {
      appointmentId: a.id,
      clientName: a.contact?.name ?? "",
      clientPhone: a.contact?.phone ?? "",
      serviceType: a.title ?? "",
      scheduledAt: new Date(a.startTime),
      status:
        (a.appointmentStatus as AppointmentDetails["status"]) ?? "confirmed",
    };
  }
}

// ---------- SMS ----------

export class GhlSms implements SMSIntegration {
  constructor(private cfg: GhlConfig) {
    if (!cfg.locationId) throw new Error("GHL locationId is required");
  }

  async sendSMS(to: string, body: string): Promise<{ messageId: string }> {
    // GHL requires the contact to exist before sending. Upsert first.
    const upsert = await fetch(`${base()}/contacts/upsert`, {
      method: "POST",
      headers: headers(this.cfg),
      body: JSON.stringify({
        locationId: this.cfg.locationId,
        phone: to,
      }),
    });
    if (!upsert.ok) {
      throw new Error(
        `ghl sms upsert failed: ${upsert.status} ${await upsert.text()}`
      );
    }
    const contact = (await upsert.json()) as {
      contact?: { id: string };
      id?: string;
    };
    const contactId = contact.contact?.id ?? contact.id;
    if (!contactId) throw new Error("ghl sms upsert returned no contact id");

    const send = await fetch(`${base()}/conversations/messages`, {
      method: "POST",
      headers: headers(this.cfg),
      body: JSON.stringify({
        type: "SMS",
        contactId,
        message: body,
      }),
    });
    if (!send.ok) {
      throw new Error(
        `ghl sms send failed: ${send.status} ${await send.text()}`
      );
    }
    const data = (await send.json()) as { messageId?: string };
    return { messageId: data.messageId ?? "" };
  }
}

// ---------- WhatsApp (via GHL Conversations API) ----------

/**
 * Sends messages over WhatsApp Business through GHL's Conversations API.
 *
 * Two modes:
 *  • Free-form  (sendSMS)       — for replies within an active 24-hour
 *                                  conversation window. Uses `type: 'WhatsApp'`
 *                                  with a plain `message` field.
 *  • Template   (sendTemplate)  — for outbound-initiated messages (missed-call
 *                                  text-back, reminders, review requests,
 *                                  reactivation). Uses an approved Meta template
 *                                  referenced by its GHL template ID.
 *
 * Template IDs (GHL internal UUIDs) are stored in `sms_config.templates` and
 * are only available after Meta approves the template in GHL Settings →
 * WhatsApp → Templates. Until approval, sendTemplate falls back to sendSMS
 * with the raw message body.
 *
 * The missed-call route detects `isWhatsApp === true` and calls sendTemplate
 * when a templateId is configured for that trigger type; otherwise falls back
 * to sendSMS.
 */
export class GhlWhatsapp implements MessagingIntegration {
  readonly isWhatsApp = true;

  constructor(private cfg: GhlWhatsappConfig) {
    if (!cfg.locationId) throw new Error("GHL locationId is required");
  }

  /** Upsert a contact in GHL and return their contactId. */
  private async upsertContact(phone: string): Promise<string> {
    const res = await fetch(`${base()}/contacts/upsert`, {
      method: "POST",
      headers: headers(this.cfg),
      body: JSON.stringify({
        locationId: this.cfg.locationId,
        phone,
      }),
    });
    if (!res.ok) {
      throw new Error(
        `ghl whatsapp contact upsert failed: ${res.status} ${await res.text()}`
      );
    }
    const data = (await res.json()) as {
      contact?: { id: string };
      id?: string;
    };
    const id = data.contact?.id ?? data.id;
    if (!id) throw new Error("ghl whatsapp upsert returned no contact id");
    return id;
  }

  /**
   * Send a free-form WhatsApp message (usable within the 24-hour
   * conversation window after the contact has messaged first).
   */
  async sendSMS(to: string, body: string): Promise<{ messageId: string }> {
    const contactId = await this.upsertContact(to);
    const res = await fetch(`${base()}/conversations/messages`, {
      method: "POST",
      headers: headers(this.cfg),
      body: JSON.stringify({
        type: "WhatsApp",
        contactId,
        message: body,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      // If the free-form send fails (e.g., outside 24h window), surface a
      // clear error so the caller can decide whether to retry as a template.
      throw new Error(`ghl whatsapp free-form send failed: ${res.status} ${err}`);
    }
    const data = (await res.json()) as { messageId?: string };
    return { messageId: data.messageId ?? "" };
  }

  /**
   * Send an approved WhatsApp template message.
   *
   * @param to            Recipient E.164 phone number.
   * @param templateId    GHL internal template ID (UUID shown in GHL UI after
   *                      Meta approval). NOT the Meta template name.
   * @param params        Optional variable sections, e.g.:
   *                        { BODY: { params: ["John", "Dr. Lin", "Thursday"] } }
   *
   * Falls back to sendSMS(free-form) if templateId is empty.
   */
  async sendTemplate(
    to: string,
    templateId: string,
    params?: TemplateParams
  ): Promise<{ messageId: string }> {
    if (!templateId) {
      // Template not yet approved — fall back to free-form.
      // The body text will have been pre-rendered by the caller.
      return this.sendSMS(to, Object.values(params ?? {}).flatMap((s) => s.params).join(" "));
    }

    const contactId = await this.upsertContact(to);
    const body: Record<string, unknown> = {
      type: "WhatsApp",
      contactId,
      templateId,
    };

    if (params) {
      // GHL expects templateParams as an object where each key is a section
      // name (BODY, HEADER, etc.) and the value is { params: string[] }.
      body.templateParams = params;
    }

    const res = await fetch(`${base()}/conversations/messages`, {
      method: "POST",
      headers: headers(this.cfg),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(
        `ghl whatsapp template send failed: ${res.status} ${errText}`
      );
    }
    const data = (await res.json()) as { messageId?: string };
    return { messageId: data.messageId ?? "" };
  }
}
