"use client";

/**
 * Agent router.
 *
 * The single widget entry point for the marketing site. Based on the
 * current path:
 *   - /noell-front-desk  -> show the Front Desk demo widget
 *   - /noell-care        -> show the Care demo widget
 *   - everything else    -> show the existing Noell Support widget
 *
 * For embedded client sites, the "auto" mode (determined by a future
 * `agent=auto` script tag parameter) starts with Support and hands off
 * to Front Desk or Care based on visitor intent.
 */

import { usePathname } from "next/navigation";
import { NoellSupportChat } from "./noell-support-chat";
import { AgentChatWidget } from "./agent-chat-widget";

// GTM item 3: Front Desk now asks a qualifying question before routing to audit.
// "I'm missing calls" triggers a qualifying question first, not an immediate CTA.
const frontDeskScript: Record<string, string[]> = {
  "*": [
    "Got it. In a real install I'd text back the missed call, find a time that works, and put it straight into the calendar.",
    "For now, want to book an audit so we can show you this on your own numbers? opsbynoell.com/book",
  ],
  "i'm missing calls": [
    "How many calls do you think you're missing in a typical week?",
  ],
  "1-2": [
    "Even one or two a week adds up fast at $150 to $300 per appointment. I text back within ten seconds and get them booked before they call someone else.",
    "Want to see this on your actual numbers? opsbynoell.com/book",
  ],
  "3-5": [
    "Three to five a week is $500 to $750 walking out the door every week. I fix that the moment a call goes unanswered.",
    "Want to book a 30-minute audit? opsbynoell.com/book",
  ],
  "more than 5": [
    "That's a real revenue leak. I text back in under ten seconds and book the appointment before they call someone else.",
    "Let's put a number on it. opsbynoell.com/book",
  ],
  "book an appointment": [
    "On a live install I'd pull up availability right here and lock a slot in 20 seconds. On the marketing site I'll send you to the audit.",
    "opsbynoell.com/book",
  ],
  "reschedule my visit": [
    "On a live install the client texts 'reschedule' and I handle it without a phone call. I protect the appointment and keep the calendar clean.",
    "Want to see how this works for your practice? opsbynoell.com/book",
  ],
};

// GTM item 5: Care greeting now demonstrates client recognition immediately.
// The headline says "Recognized. Not re-interrogated." The widget should prove it.
const careScript: Record<string, string[]> = {
  "*": [
    "In a real install I'd have your name, your last visit, and your usual services pulled up already. No re-introduction needed.",
    "Want to see how this would work on your practice? Book a 30-minute audit: opsbynoell.com/book",
  ],
  "do you offer deep tissue": [
    "On a live Care install I'd check your service list and tell you exactly what's offered, how long it takes, and whether your regular provider does it.",
  ],
  "where do i park": [
    "On a live Care install I'd pull up your location notes and tell you the easiest spot, which door to use, and whether to arrive early.",
  ],
  "can i rebook": [
    "On a live install I'd pull up your last visit, suggest the same provider and time slot, and lock it in. No hold music.",
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
        // GTM item 7: Social proof in subtitle
        greeting="Hey, front desk here. Were you hoping to get on the books, or was there something quick I can answer?"
        headerLabel="Noell Front Desk"
        headerSubtitle="Responding in under 10 seconds"
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
        // GTM item 5: Recognition-first greeting
        greeting="Hey, I recognize your number from a previous visit. Welcome back. What can I help you with?"
        headerLabel="Noell Care"
        // GTM item 7: Social proof in subtitle
        headerSubtitle="Recognized. Not re-interrogated."
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
