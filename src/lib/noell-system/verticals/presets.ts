import type { VerticalConfig, VerticalKey } from "../types";

/**
 * Vertical presets.
 *
 * Each vertical captures the common defaults for a type of service business:
 * common services, qualification questions, starter chip tweaks, and reminder
 * cadence. A client's ClientConfig picks a vertical; the runtime then prefers
 * vertical defaults when the agent's generic defaults aren't specific enough.
 *
 * Adding a vertical = one entry. No code changes anywhere else.
 */

const massage: VerticalConfig = {
  key: "massage",
  label: "Massage Therapy",
  commonServices: ["Deep tissue", "Swedish", "Prenatal", "Sports", "Couples"],
  qualifyingQuestions: [
    "What kind of massage are you looking for?",
    "Is this your first visit or a rebooking?",
    "Any areas you want focused on?",
  ],
  starterChipPresets: {
    support: ["Book a massage", "What services do you offer?", "Is this your first visit?"],
    care: ["Rebook my last massage", "Change my appointment", "Where do I park?"],
  },
  reminderCadence: "48h SMS + 2h SMS",
};

const medSpa: VerticalConfig = {
  key: "med_spa",
  label: "Med Spa",
  commonServices: ["Botox", "Filler", "Laser", "Facials", "Body contouring"],
  qualifyingQuestions: [
    "Which treatment are you interested in?",
    "Have you had this treatment before?",
    "Any timing preferences (weekend, evening)?",
  ],
  starterChipPresets: {
    support: ["Book a consult", "Pricing on Botox / filler", "What treatments do you offer?"],
    care: ["Rebook my treatment", "Post-treatment question", "Reschedule"],
  },
  reminderCadence: "72h email + 24h SMS + 2h SMS",
};

const salon: VerticalConfig = {
  key: "salon",
  label: "Salon",
  commonServices: ["Haircut", "Color", "Balayage", "Treatment", "Blowout"],
  qualifyingQuestions: [
    "Which service? Cut, color, or both?",
    "Who do you usually see?",
    "Any photos or references?",
  ],
  starterChipPresets: {
    support: ["Book with a stylist", "Color consult", "What's your availability?"],
    care: ["Rebook with my stylist", "Change my appointment", "Product question"],
  },
  reminderCadence: "48h SMS + 2h SMS",
};

const dental: VerticalConfig = {
  key: "dental",
  label: "Dental Office",
  commonServices: ["Cleaning", "Exam", "Whitening", "Crown", "Emergency"],
  qualifyingQuestions: [
    "Is this a routine cleaning or something urgent?",
    "Do you have insurance we should file with?",
    "Any preferred day/time?",
  ],
  starterChipPresets: {
    support: ["New patient booking", "Insurance question", "Emergency?"],
    care: ["Rebook 6-month cleaning", "Insurance update", "Reschedule"],
  },
  reminderCadence: "7d email + 48h SMS + 2h SMS",
};

const esthetics: VerticalConfig = {
  key: "esthetics",
  label: "Esthetician",
  commonServices: ["Facial", "Waxing", "Peel", "Microneedling", "Consult"],
  qualifyingQuestions: [
    "Which service are you interested in?",
    "Any skin concerns we should know about?",
    "First visit or returning?",
  ],
  starterChipPresets: {
    support: ["Book a facial", "Consult on my skin concern", "First-visit question"],
    care: ["Rebook", "Post-treatment question", "Reschedule"],
  },
  reminderCadence: "48h SMS + 2h SMS",
};

const generic: VerticalConfig = {
  key: "generic",
  label: "Service Business",
  commonServices: [],
  qualifyingQuestions: [
    "What are you looking for today?",
    "First time or returning?",
    "Any timing preferences?",
  ],
  reminderCadence: "48h SMS + 2h SMS",
};

export const verticals: Record<VerticalKey, VerticalConfig> = {
  massage,
  med_spa: medSpa,
  salon,
  dental,
  esthetics,
  generic,
};

export function getVertical(key: VerticalKey): VerticalConfig {
  return verticals[key];
}
