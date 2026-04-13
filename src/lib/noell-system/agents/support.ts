import type { AgentConfig } from "../types";

/**
 * Noell Support
 *
 * New-prospect intake layer. Catches brand-new visitors on the website
 * (chat widget + post-missed-call SMS replies), qualifies them, captures
 * contact, and hands off to booking or the right human.
 *
 * Explicit non-scope:
 *   - missed inbound calls / call routing → Noell Front Desk
 *   - existing-client questions → Noell Care
 */
export const supportAgent: AgentConfig = {
  identity: {
    id: "support",
    displayName: "Noell Support",
    persona: "New-prospect intake assistant",
    eyebrow: "New prospect intake",
    launcherColor: "lilac",
    initial: "N",
    scope: {
      does: [
        "Instant first response on website chat",
        "Lead qualification (service, timing, urgency)",
        "Contact capture (name, phone, email)",
        "Smart routing to the right booking or team member",
        "Booking-link handoff",
        "Human escalation with full context",
      ],
      doesNot: [
        "Handle inbound missed calls (that's Noell Front Desk)",
        "Answer existing-client account questions (that's Noell Care)",
        "Manage your calendar or reschedule appointments",
        "Process payments",
        "Pretend to be a full AI receptionist",
      ],
    },
  },
  greeting: {
    from: "agent",
    text: "Hi — I'm Noell Support, the new-prospect intake layer for {{businessName}}. I can help you get started. Are you looking to book a free consultation, ask about services, or something else?",
  },
  starterChips: [
    "I'm new — book me in",
    "What do you offer?",
    "How does this work?",
  ],
  intents: [
    {
      intent: "booking_new",
      matchers: [
        "i'm new — book me in",
        "book me",
        "book an appointment",
        "i want to book",
        "schedule",
      ],
      responses: [
        {
          from: "agent",
          text: "Perfect. Can I grab your name and the best number to reach you? I'll route this to the right booking link for {{businessName}}.",
        },
      ],
      nextStage: "qualified",
      capture: true,
      route: { kind: "booking_link" },
    },
    {
      intent: "services_question",
      matchers: ["what do you offer", "services", "what do you do"],
      responses: [
        {
          from: "agent",
          text: "Happy to walk you through it. If you share your name and number, I'll text you a service menu and a direct booking link.",
        },
      ],
      nextStage: "qualified",
      capture: true,
      route: { kind: "knowledge_base", sourceKey: "services" },
    },
    {
      intent: "how_it_works",
      matchers: ["how does this work", "how it works"],
      responses: [
        {
          from: "agent",
          text: "Easy: share your name + best number, I route you to the booking link, and you get a confirmation text immediately. No sales theater.",
        },
      ],
      nextStage: "qualified",
      capture: true,
      route: { kind: "booking_link" },
    },
  ],
  captureResponse: [
    {
      from: "agent",
      text: "Got it{{capturedName}} — thanks. I've captured your contact and routed this to the team. You'll get a text with booking options shortly. The direct booking link is here: {{bookingUrl}}",
    },
    {
      from: "agent",
      text: "Anything else I can help with? Otherwise I'll hand off from here.",
    },
  ],
  fallbackResponse: [
    {
      from: "agent",
      text: "I'm focused on helping new visitors get to the right place. Can you share your name and best number? I'll route this to the team.",
    },
  ],
  escalationRules: [
    {
      trigger: "human_requested",
      message:
        "Totally — I'll flag this for the team at {{businessName}}. Can you share your name and best number so they can follow up?",
      handoffTarget: { kind: "human", role: "owner" },
    },
    {
      trigger: "unresolved_after_n",
      afterTurns: 2,
      message:
        "I don't want to keep you guessing — let me hand this to a person on the team. Share your name + best number and they'll reach out.",
      handoffTarget: { kind: "human", role: "owner" },
    },
  ],
  knowledgeSources: [
    {
      key: "services",
      label: "Services menu",
      questions: ["what do you offer", "services", "what do you do"],
      answerTemplate:
        "{{businessName}} offers the services on our site. I can text you a direct menu if you share your number.",
    },
    {
      key: "hours",
      label: "Business hours",
      questions: ["hours", "open", "when are you open"],
      answerTemplate: "We're open {{hours}}. Booking link: {{bookingUrl}}",
    },
  ],
  followUpRules: [
    {
      trigger: "capture",
      channel: "sms",
      delayMinutes: 1,
      template:
        "Hi {{capturedName}} — this is {{businessName}}. Here's your booking link: {{bookingUrl}}. Reply with any questions.",
    },
  ],
  stages: ["intro", "qualified", "captured", "escalated"],
};
