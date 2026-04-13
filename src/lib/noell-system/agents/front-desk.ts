import type { AgentConfig } from "../types";

/**
 * Noell Front Desk
 *
 * Operations layer. Runs the full receptionist workflow: inbound calls,
 * missed-call text-back, scheduling, confirmations, reminders, reschedules,
 * review capture, and reactivation.
 *
 * First-version scope: this agent is structured in config so that its
 * intents + escalation rules + follow-ups are ready, but the external
 * integrations (phone provider, scheduler, review platform) still need
 * to be wired — see README.md "External dependencies" and "Production gaps".
 *
 * Explicit non-scope:
 *   - website chat with brand-new prospects → Noell Support
 *   - existing-client service questions → Noell Care
 */
export const frontDeskAgent: AgentConfig = {
  identity: {
    id: "front_desk",
    displayName: "Noell Front Desk",
    persona: "Operations layer — full receptionist workflow",
    eyebrow: "Operations layer",
    launcherColor: "wine",
    initial: "N",
    scope: {
      does: [
        "Inbound call handling + routing",
        "Missed-call text-back in under 10 seconds",
        "Scheduling (smart booking logic)",
        "Appointment confirmations (SMS/email)",
        "Reminder cadence",
        "Reschedules (self-serve + assisted)",
        "Review capture with filter routing",
        "Reactivation workflows for dormant clients",
      ],
      doesNot: [
        "Catch new website prospects (that's Noell Support)",
        "Answer existing-client service/account questions (that's Noell Care)",
        "Replace your staff",
        "Process payments",
      ],
    },
  },
  greeting: {
    from: "agent",
    text: "Front Desk here. I handle calls, scheduling, confirmations, reminders, reschedules, reviews, and reactivation for {{businessName}}. What do you need?",
  },
  starterChips: [
    "I missed a call",
    "Reschedule a client",
    "Send confirmations",
    "Trigger reactivation",
  ],
  intents: [
    {
      intent: "missed_call_textback",
      matchers: ["i missed a call", "missed call", "call came in"],
      responses: [
        {
          from: "agent",
          text: "On it. I'll send the missed-call text-back with your booking link and log it to the dashboard.",
        },
      ],
      route: { kind: "workflow", workflowKey: "missed_call_textback" },
    },
    {
      intent: "reschedule",
      matchers: ["reschedule", "move appointment", "change appointment"],
      responses: [
        {
          from: "agent",
          text: "Share the client name or phone number and the new time window — I'll offer them self-serve reschedule options.",
        },
      ],
      nextStage: "qualified",
      capture: true,
      route: { kind: "workflow", workflowKey: "reschedule" },
    },
    {
      intent: "send_confirmations",
      matchers: ["send confirmations", "confirm appointments", "confirmations"],
      responses: [
        {
          from: "agent",
          text: "Queued. Tomorrow's appointments will receive SMS confirmations tonight at your reminder cadence.",
        },
      ],
      route: { kind: "workflow", workflowKey: "send_confirmations" },
    },
    {
      intent: "reminders",
      matchers: ["reminders", "remind clients"],
      responses: [
        {
          from: "agent",
          text: "Reminder cadence is already running. I'll send a report tomorrow showing delivery + response rates.",
        },
      ],
      route: { kind: "workflow", workflowKey: "reminders" },
    },
    {
      intent: "review_capture",
      matchers: ["review", "reviews", "review capture"],
      responses: [
        {
          from: "agent",
          text: "Post-visit review requests are active. Happy clients route to Google, unhappy ones route to you first.",
        },
      ],
      route: { kind: "workflow", workflowKey: "review_capture" },
    },
    {
      intent: "reactivation",
      matchers: ["reactivation", "dormant", "come back"],
      responses: [
        {
          from: "agent",
          text: "Reactivation workflow is ready. I'll identify clients past the dormancy threshold and queue the campaign.",
        },
      ],
      route: { kind: "workflow", workflowKey: "reactivation" },
    },
  ],
  captureResponse: [
    {
      from: "agent",
      text: "Got it{{capturedName}} — logged. You'll see the task in the dashboard and I'll report back when it's done.",
    },
  ],
  fallbackResponse: [
    {
      from: "agent",
      text: "I handle calls, scheduling, confirmations, reminders, reschedules, reviews, and reactivation. Can you tell me which one you need?",
    },
  ],
  escalationRules: [
    {
      trigger: "human_requested",
      message:
        "Flagging this for you directly. I'll leave the context in the dashboard.",
      handoffTarget: { kind: "human", role: "front_desk" },
    },
    {
      trigger: "keyword",
      keywords: ["complaint", "refund", "angry", "lawyer"],
      message:
        "This needs a human. I'm flagging it to you now and holding the rest of the workflow.",
      handoffTarget: { kind: "human", role: "owner" },
    },
    {
      trigger: "unresolved_after_n",
      afterTurns: 2,
      message:
        "Let me loop in the team directly — I don't want to guess on operations decisions.",
      handoffTarget: { kind: "human", role: "front_desk" },
    },
  ],
  knowledgeSources: [
    {
      key: "hours",
      label: "Business hours",
      questions: ["hours", "when are we open"],
      answerTemplate: "{{businessName}} is open {{hours}}.",
    },
    {
      key: "reminder_cadence",
      label: "Reminder cadence",
      questions: ["reminder cadence", "when are reminders sent"],
      answerTemplate:
        "Reminders follow {{businessName}}'s configured cadence — 48h SMS + 2h SMS by default.",
    },
  ],
  followUpRules: [
    {
      trigger: "capture",
      channel: "sms",
      delayMinutes: 0,
      template:
        "This is {{businessName}}. Quick note: your appointment on {{apptDate}} is confirmed. Reply R to reschedule.",
    },
    {
      trigger: "resolved",
      channel: "email",
      delayMinutes: 60,
      template:
        "Front Desk summary for {{businessName}}: {{summary}}. See dashboard for detail.",
    },
  ],
  stages: ["intro", "qualified", "captured", "escalated", "resolved"],
};
