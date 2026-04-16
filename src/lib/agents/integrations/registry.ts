/**
 * Integration registry.
 *
 * Given a `ClientConfig`, returns the concrete CalendarIntegration and
 * SMSIntegration instances the agent system should use for that client.
 * All of the agent logic depends on the interfaces, never on the
 * concrete classes — this is the one place where the provider choice
 * lives.
 */

import { GhlCalendar, GhlSms, GhlWhatsapp } from "./ghl";
import { GenericCalendar, TwilioSms } from "./generic";
import type {
  CalendarIntegration,
  ClientConfig,
  MessagingIntegration,
  SMSIntegration,
} from "../types";

export function getCalendarIntegration(
  cfg: ClientConfig
): CalendarIntegration {
  const provider = cfg.calendarProvider ?? "generic";
  const conf = cfg.calendarConfig ?? {};
  switch (provider) {
    case "ghl":
      return new GhlCalendar({
        locationId: conf.locationId as string,
        calendarId: conf.calendarId as string | undefined,
        apiKey: conf.apiKey as string | undefined,
      });
    case "generic":
      return new GenericCalendar({
        clientId: cfg.clientId,
        defaultDurationMinutes: Number(conf.defaultDurationMinutes ?? 60),
        workingHours: (cfg.hours as Record<string, string>) ?? {},
      });
    case "calendly":
    case "acuity":
      throw new Error(
        `${provider} integration not yet implemented — add under src/lib/agents/integrations/`
      );
    default:
      throw new Error(`Unknown calendar provider: ${provider}`);
  }
}

export function getSmsIntegration(cfg: ClientConfig): MessagingIntegration {
  const provider = cfg.smsProvider ?? "generic";
  const conf = cfg.smsConfig ?? {};
  switch (provider) {
    case "ghl":
      return new GhlSms({
        locationId: conf.locationId as string,
        apiKey: conf.apiKey as string | undefined,
      });
    case "ghl_whatsapp":
      return new GhlWhatsapp({
        locationId: conf.locationId as string,
        apiKey: conf.apiKey as string | undefined,
        whatsappNumber: conf.whatsappNumber as string | undefined,
        templates: conf.templates as Record<string, string> | undefined,
      });
    case "twilio":
    case "generic":
      return new TwilioSms();
    default:
      throw new Error(`Unknown SMS provider: ${provider}`);
  }
}

export function getReviewUrl(cfg: ClientConfig): string {
  return cfg.reviewUrl ?? "";
}
