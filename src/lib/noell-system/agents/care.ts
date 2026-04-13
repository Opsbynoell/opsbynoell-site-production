import type { AgentConfig } from "../types";

/**
 * Noell Care
 *
 * Existing-client support layer. Handles the noise that would otherwise
 * clog new-business intake: rebookings, service questions, account help,
 * directions, "can I change my appointment," etc.
 *
 * First-version scope: structured config covers the core intents, but
 * richer knowledge sources (e.g. per-service FAQ, per-location parking)
 * are client-specific and live in ClientConfig + VerticalConfig.
 *
 * Explicit non-scope:
 *   - new-prospect intake → Noell Support
 *   - operational workflows like scheduling backends → Noell Front Desk
 */
export const careAgent: AgentConfig = {
  identity: {
    id: "care",
    displayName: "Noell Care",
    persona: "Existing client support",
    eyebrow: "Existing client support",
    launcherColor: "blush",
    initial: "N",
    scope: {
      does: [
        "Rebooking existing clients",
        "Service + policy questions",
        "Account-level support",
        "Directions, parking, arrival instructions",
        "Appointment change requests (routed to Front Desk)",
        "Quick how-tos ('where do I send my intake form?')",
      ],
      doesNot: [
        "Handle brand-new prospects (that's Noell Support)",
        "Run scheduling workflows directly (that's Noell Front Desk)",
        "Process payments or refunds",
        "Give clinical advice",
      ],
    },
  },
  greeting: {
    from: "agent",
    text: "Hi again — I'm Noell Care. I help existing {{businessName}} clients with rebooking, account questions, and quick how-tos. What do you need?",
  },
  starterChips: [
    "Rebook me",
    "Change my appointment",
    "Where do I park?",
    "I have a service question",
  ],
  intents: [
    {
      intent: "rebook",
      matchers: ["rebook", "book again", "rebook me", "same as last time"],
      responses: [
        {
          from: "agent",
          text: "Love that. Share your name and number — I'll pull your last visit and text you a direct rebooking link.",
        },
      ],
      nextStage: "qualified",
      capture: true,
      route: { kind: "booking_link" },
    },
    {
      intent: "change_appointment",
      matchers: [
        "change my appointment",
        "reschedule",
        "move my appointment",
        "can't make it",
      ],
      responses: [
        {
          from: "agent",
          text: "No problem. Share your name + appointment date — I'll route this to Front Desk so we don't double-book you.",
        },
      ],
      nextStage: "qualified",
      capture: true,
      route: { kind: "human", role: "front_desk" },
    },
    {
      intent: "directions",
      matchers: [
        "where do i park",
        "parking",
        "directions",
        "where are you",
        "how do i find you",
      ],
      responses: [
        {
          from: "agent",
          text: "Parking and arrival info depends on your appointment location — I'll text it to you now.",
        },
      ],
      nextStage: "resolved",
      route: { kind: "knowledge_base", sourceKey: "parking" },
    },
    {
      intent: "service_question",
      matchers: [
        "service question",
        "what is included",
        "how long",
        "do you offer",
      ],
      responses: [
        {
          from: "agent",
          text: "Ask away — I'll pull the answer from the service notes. If it needs a human, I'll flag it to the team.",
        },
      ],
    },
    {
      intent: "account_support",
      matchers: ["account", "update my info", "change my number", "email on file"],
      responses: [
        {
          from: "agent",
          text: "Share the correction (new phone, new email, etc.) and I'll route it to the team to update in your profile.",
        },
      ],
      nextStage: "qualified",
      capture: true,
      route: { kind: "human", role: "care" },
    },
  ],
  captureResponse: [
    {
      from: "agent",
      text: "Got it{{capturedName}} — I've routed this to the right place for {{businessName}}. You'll hear back shortly.",
    },
  ],
  fallbackResponse: [
    {
      from: "agent",
      text: "I'm here for existing-client questions. If you're trying to book for the first time, I'll hand you to Noell Support. Otherwise, what do you need?",
    },
  ],
  escalationRules: [
    {
      trigger: "human_requested",
      message:
        "Sure — flagging this for the team at {{businessName}}. They'll follow up directly.",
      handoffTarget: { kind: "human", role: "care" },
    },
    {
      trigger: "keyword",
      keywords: ["refund", "complaint", "injury", "reaction"],
      message:
        "That needs a human on our side. I'm flagging it now and you'll hear from the team directly.",
      handoffTarget: { kind: "human", role: "owner" },
    },
    {
      trigger: "unresolved_after_n",
      afterTurns: 2,
      message:
        "Let me hand this to the team so nothing gets lost. Share your name + best number and we'll take it from here.",
      handoffTarget: { kind: "human", role: "care" },
    },
  ],
  knowledgeSources: [
    {
      key: "parking",
      label: "Parking + directions",
      questions: ["parking", "directions", "where do i park"],
      answerTemplate:
        "Parking info for {{businessName}} depends on the location — the team will text arrival instructions when we have your appointment pulled up.",
    },
    {
      key: "policies",
      label: "Cancellation + late policy",
      questions: ["cancellation", "late", "policy", "fees"],
      answerTemplate:
        "{{businessName}}'s policies are in your welcome email. Short version: please give as much notice as you can for changes.",
    },
  ],
  followUpRules: [
    {
      trigger: "resolved",
      channel: "sms",
      delayMinutes: 0,
      template:
        "This is {{businessName}}. {{answerText}} Reply if you need anything else.",
    },
    {
      trigger: "capture",
      channel: "email",
      delayMinutes: 5,
      template:
        "Noell Care logged an update for {{capturedName}}. See dashboard for detail.",
    },
  ],
  stages: ["intro", "qualified", "captured", "escalated", "resolved"],
};
