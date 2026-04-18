import { LegalPage } from "@/components/legal-page";

export const dynamic = "force-static";

export const metadata = {
  title: "Privacy Policy — Ops by Noell",
  description: "How Ops by Noell collects, uses, and protects your information.",
};

const content = `# Privacy Policy

**Effective date:** April 18, 2026
**Last updated:** April 18, 2026

This Privacy Policy describes how Ops by Noell ("we," "us," or "our") collects, uses, and shares information about you when you visit www.opsbynoell.com (the "Site"), interact with our AI assistants (Noell Support, Noell Front Desk, and Noell Care), or otherwise engage with our services (collectively, the "Services").

## 1. Who we are

Ops by Noell is a sole proprietorship registered under James Noell (EIN 42-1859974), operating as "Ops by Noell."

**Contact:** hello@opsbynoell.com
**Mailing address:**
Ops by Noell
23710 El Toro Road #1086
Lake Forest, CA 92630
United States

## 2. Information we collect

### Information you provide directly
- **Contact details:** name, business name, email address, phone number, and any details you share while chatting with our AI assistants or filling out forms on the Site.
- **Business details:** information you share about your business, current tools, and the problem you want solved.
- **Conversation content:** the full text of messages you send through the Noell Support chat widget or other AI assistant interfaces on the Site.

### Information collected automatically
- **Technical data:** IP address, browser type, device type, operating system, referring URL, and pages visited.
- **Usage data:** timestamps, interaction patterns, and analytics events.
- **Cookies and similar technologies:** we use cookies for basic functionality, session management, and analytics.

### Information from third parties
- **Form and CRM data:** if you interact with our booking pages (hosted via GoHighLevel) or SMS systems, we receive your contact details and interaction history from those tools.

## 3. How we use your information

We use the information we collect to:
- Respond to your inquiries and operate our AI assistants
- Qualify leads, schedule calls, and deliver the Services you request
- Send you follow-up communications by email or SMS (only with your consent — see Section 5)
- Improve and secure the Site and our Services
- Comply with legal obligations

We do not sell your personal information.

## 4. How we share your information

We share your information only as needed to operate our Services:
- **Service providers (subcontractors):** we use Supabase (database), Vercel (hosting), Anthropic (AI model provider for Noell assistants), GoHighLevel (CRM and communications), and Twilio (SMS) — each of whom processes your information solely to provide services to us under their own privacy terms.
- **Legal and safety:** we may disclose information when required by law, to enforce our Terms, or to protect rights, property, or safety.
- **Business transfers:** in connection with a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.

**No mobile information will be shared with third parties or affiliates for marketing/promotional purposes.** Information sharing to subcontractors in support services, such as customer service, is permitted. All other use case categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.

**Text messaging originator opt-in data and consent will not be shared with any third parties, except for aggregators and providers of the Text Message services.**

All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties, excluding aggregators and providers of the Text Message services.

## 5. SMS and messaging consent

If you provide your phone number, we will only send you SMS messages if you have explicitly opted in during our chat conversation or on a form on our Site. You can opt out at any time by replying STOP to any SMS. Reply HELP for help. Message and data rates may apply. Message frequency varies. See our [SMS Policy](/sms-policy) for full details.

No mobile information will be shared with third parties or affiliates for marketing/promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties, except for aggregators and providers of the Text Message services.

## 6. Your choices and rights

Depending on where you live, you may have rights to:
- Access, correct, or delete the information we hold about you
- Opt out of marketing communications
- Withdraw consent for data processing
- Request a copy of your data
- Lodge a complaint with a data protection authority

To exercise these rights, email hello@opsbynoell.com.

### California residents (CCPA/CPRA)
California residents have the right to know what personal information we collect, request deletion, opt out of "sales" (we do not sell information), and not be discriminated against for exercising these rights.

### EU/UK residents (GDPR)
If you are in the European Union or United Kingdom, the lawful basis for our processing is typically your consent or our legitimate interest in operating our business. You may withdraw consent at any time.

## 7. Data retention

We keep your information only as long as needed to provide the Services, comply with legal obligations, resolve disputes, and enforce our agreements. Chat transcripts are typically retained for up to 24 months unless you request earlier deletion.

## 8. Security

We use reasonable technical and organizational measures to protect your information, including encryption in transit (TLS) and at rest, access controls, and audit logging. No method of transmission or storage is 100% secure.

## 9. Children

Our Services are not directed to children under 13. We do not knowingly collect information from children under 13.

## 10. International users

Our Services are operated from the United States. By using the Services, you consent to the transfer of your information to the United States.

## 11. Changes to this policy

We may update this Privacy Policy from time to time. The "Last updated" date above reflects the most recent changes. Continued use of the Services after changes means you accept the updated policy.

## 12. Contact us

Questions about this policy or how we handle your information:

**Ops by Noell**
Email: hello@opsbynoell.com
23710 El Toro Road #1086
Lake Forest, CA 92630, USA
`;

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" content={content} />;
}
