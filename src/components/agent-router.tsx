"use client";

/**
 * Agent router.
 *
 * The single widget entry point for the marketing site. Based on the
 * current path:
 *   - /noell-front-desk  → show the Front Desk demo widget
 *   - /noell-care        → show the Care demo widget
 *   - everything else    → show the existing Noell Support widget
 *
 * For embedded client sites, the "auto" mode (determined by a future
 * `agent=auto` script tag parameter) starts with Support and hands off
 * to Front Desk or Care based on visitor intent.
 */

import { usePathname } from "next/navigation";
import { NoellSupportChat } from "./noell-support-chat";
import { AgentChatWidget } from "./agent-chat-widget";

const frontDeskScript: Record<string, string[]> = {
  "*": [
    "Got it — I'm the operations desk. In a real install I'd text back the missed call, find a time that works, and put it straight into the calendar.",
    "For now, want to book an audit so we can show you this on your own numbers? opsbynoell.com/book",
  ],
  "i'm missing calls": [
    "That's the first thing I fix. The moment a call goes unanswered, I text back in under ten seconds with the booking link.",
    "Want me to book you a 30-minute audit? I'll route it to Noell.",
  ],
  "book an appointment": [
    "On a live install I'd pull up availability right here and lock a slot in 20 seconds. On the marketing site I'll send you to the audit.",
    "opsbynoell.com/book",
  ],
};

const careScript: Record<string, string[]> = {
  "*": [
    "Hey — I'm Noell Care, the desk for people who already come in. In a real install I'd recognize you by phone, pull your file, and answer from your business's knowledge base.",
    "Want to see how this would work on your practice? Book a 30-minute audit: opsbynoell.com/book",
  ],
  "do you offer deep tissue": [
    "On a live Care install I'd check your service list and tell you exactly what's offered, how long it takes, and whether your regular provider does it.",
  ],
  "where do i park": [
    "On a live Care install I'd pull up your location notes and tell you the easiest spot, which door to use, and whether to arrive early.",
  ],
};

export function AgentRouter() {
  const pathname = usePathname();

  if (pathname === "/noell-front-desk") {
    return (
      <AgentChatWidget
        agent="frontDesk"
        mode="demo"
        accent="wine"
        greeting="Hey — front desk here. Were you hoping to get on the books, or was there something quick I can answer?"
        headerLabel="Noell Front Desk"
        headerSubtitle="Operations · Online"
        autoOpenOnPath="/noell-front-desk"
        starterChips={[
          "I'm missing calls",
          "Book an appointment",
          "Reschedule my visit",
        ]}
        scriptedResponses={frontDeskScript}
      />
    );
  }

  if (pathname === "/noell-care") {
    return (
      <AgentChatWidget
        agent="care"
        mode="demo"
        accent="sage"
        greeting="Hey — good to hear from you. What can I grab for you?"
        headerLabel="Noell Care"
        headerSubtitle="Returning clients · Online"
        autoOpenOnPath="/noell-care"
        starterChips={[
          "Do you offer deep tissue?",
          "Where do I park?",
          "Can I rebook?",
        ]}
        scriptedResponses={careScript}
      />
    );
  }

  return <NoellSupportChat />;
}
