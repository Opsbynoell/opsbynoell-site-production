import { LegalPage } from "@/components/legal-page";

export const dynamic = "force-static";

export const metadata = {
  title: "Terms of Service — Ops by Noell",
  description: "Terms governing use of Ops by Noell and the Noell System.",
  alternates: { canonical: "https://www.opsbynoell.com/legal/terms" },
  robots: { index: false, follow: true },
};

const content = `# Terms of Service

**Effective date:** April 18, 2026
**Last updated:** April 18, 2026

These Terms of Service ("Terms") govern your access to and use of www.opsbynoell.com and the services offered by Ops by Noell ("we," "us," or "our"), including our AI assistants Noell Support, Noell Front Desk, and Noell Care (collectively, the "Services"). By using the Services, you agree to these Terms.

## 1. Who we are

Ops by Noell is a sole proprietorship registered under James Noell (EIN 42-1859974), operating as "Ops by Noell."

**Contact:** hello@opsbynoell.com
**Mailing address:**
Ops by Noell
23710 El Toro Road #1086
Lake Forest, CA 92630
United States

## 2. What we offer

The Noell System is an AI-powered suite of three tiers:
- **Noell Support** — AI for new prospects (website qualification and discovery-call booking)
- **Noell Front Desk** — AI for inbound and missed calls with appointment booking
- **Noell Care** — AI for existing clients (customer-service support)

Information and communications from our AI assistants are informational and do not constitute a binding commitment by Ops by Noell unless explicitly confirmed by Nikki Dowdell in writing. Pricing, timelines, and scope are always confirmed separately after a discovery call.

## 3. Use of the Services

You agree to:
- Use the Services only for lawful purposes
- Provide accurate information when engaging with our AI assistants or forms
- Not attempt to reverse-engineer, disrupt, or scrape the Site or its backend
- Not use the Services to transmit malicious content, spam, or harmful code

## 4. AI-generated content disclaimer

Our AI assistants are trained on business context provided by Ops by Noell and are designed to answer factually and escalate to Nikki when uncertain. However:
- AI responses may contain errors, omissions, or misunderstandings
- AI-provided information is not a substitute for professional advice (legal, financial, medical, technical, or otherwise)
- For anything custom, high-stakes, or unclear, conversations are escalated to Nikki for human review

You acknowledge that AI outputs are provided as-is and should be verified before relied upon for consequential decisions.

## 5. Communications

By providing your contact information and consenting in the chat flow or on a form, you agree to receive:
- Email responses and follow-ups from Ops by Noell
- SMS messages from Ops by Noell if you explicitly opt in during the chat or via a form (see our [SMS Policy](/sms-policy))
- Occasional updates about services you have inquired about

You can opt out of email marketing via the unsubscribe link in any email, or SMS by replying STOP.

## 5a. SMS Terms (A2P 10DLC)

**Program Name:** Ops by Noell — Customer Care & Lead Follow-up

1. **Program description.** Ops by Noell sends SMS messages to users who have opted in for lead follow-up, appointment confirmations and reminders, and customer-care notifications related to services you have inquired about. We do not send marketing promotions or third-party content.

2. **Opt-out.** You can cancel the SMS service at any time. Simply **text "STOP"** to the number messaging you. Upon sending "STOP," we will confirm your unsubscribe status via SMS. Following this confirmation, you will no longer receive SMS messages from us. **To rejoin, sign up again as you did initially (via our chat assistant or a form on our Site), and we will resume sending SMS messages to you.**

3. **Help.** If you experience issues with the messaging program, reply with the keyword **HELP** for more assistance, or reach out directly to **hello@opsbynoell.com**.

4. **Carrier liability.** Carriers are not liable for delayed or undelivered messages.

5. **Message and data rates.** As always, message and data rates may apply for messages sent to you from us and to us from you. Message frequency varies. For questions about your text plan or data plan, contact your wireless provider.

6. **Privacy.** For privacy-related inquiries, please refer to our [Privacy Policy](/privacy).

7. **Compliance with industry standards.** Ops by Noell complies with CTIA messaging principles and best practices, TCPA requirements, and the A2P 10DLC registration requirements established by The Campaign Registry (TCR) and U.S. wireless carriers.

8. **Legal compliance.** We comply with all applicable federal and state laws governing SMS communications, including the Telephone Consumer Protection Act (TCPA) and CAN-SPAM Act.

See our full [SMS Policy](/sms-policy) for additional details on supported carriers, consent logging, and frequency.

## 6. Intellectual property

All content on the Site — including the Noell System branding, AI prompt designs, written copy, graphics, and software — is owned by Ops by Noell or its licensors and is protected by U.S. copyright and trademark laws. You may not copy, reproduce, or create derivative works without our prior written permission.

## 7. Third-party services

Our Services integrate with third parties including (but not limited to) Supabase, Vercel, Anthropic, GoHighLevel, and Twilio. Each has its own terms and privacy policies. Ops by Noell is not responsible for the practices or content of third-party providers.

## 8. Disclaimers

THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT GUARANTEE SPECIFIC BUSINESS OUTCOMES, LEAD GENERATION VOLUME, OR RETURN ON INVESTMENT.

## 9. Limitation of liability

TO THE MAXIMUM EXTENT PERMITTED BY LAW, OPS BY NOELL, ITS OWNER, AND ITS AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICES. OUR TOTAL LIABILITY SHALL NOT EXCEED ONE HUNDRED U.S. DOLLARS ($100) OR THE AMOUNT YOU HAVE PAID TO OPS BY NOELL IN THE PRIOR TWELVE MONTHS, WHICHEVER IS GREATER.

## 10. Indemnification

You agree to indemnify and hold harmless Ops by Noell, Nikki Dowdell, and affiliated parties from any claims, damages, or expenses arising from your violation of these Terms or misuse of the Services.

## 11. Termination

We may suspend or terminate your access to the Services at any time, with or without cause, including for violations of these Terms.

## 12. Governing law

These Terms are governed by the laws of the State of California, without regard to its conflict-of-laws principles. Any dispute arising from these Terms or the Services shall be resolved exclusively in the state or federal courts located in Orange County, California.

## 13. Changes to these Terms

We may update these Terms from time to time. The "Last updated" date above reflects the most recent changes. Continued use of the Services after changes means you accept the updated Terms.

## 14. Contact us

Questions about these Terms:

**Ops by Noell**
Email: hello@opsbynoell.com
23710 El Toro Road #1086
Lake Forest, CA 92630, USA
`;

export default function TermsPage() {
  return <LegalPage title="Terms of Service" content={content} />;
}
