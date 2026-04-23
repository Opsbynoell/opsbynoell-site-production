import { LegalPage } from "@/components/legal-page";

export const dynamic = "force-static";

export const metadata = {
  title: "SMS Policy — Ops by Noell",
  description: "How we use SMS to communicate with visitors and clients.",
  alternates: { canonical: "https://www.opsbynoell.com/sms-policy" },
};

const content = `# SMS Policy & Terms

**Effective date:** April 18, 2026
**Last updated:** April 18, 2026

This SMS Policy explains how Ops by Noell ("we," "us," or "our") uses text messages (SMS) to communicate with visitors and clients. This policy is referenced by our A2P 10DLC campaign registration and is available to all recipients of our messages.

## 1. Program name

**Ops by Noell — Customer Care & Lead Follow-up**

## 2. What messages we send

If you opt in, Ops by Noell may send you SMS messages for these purposes:
- **Lead follow-up:** confirming a discovery call, sending a calendar link, or responding to a question you raised in our chat assistant (Noell Support)
- **Appointment confirmations and reminders:** confirming, reminding, or rescheduling a scheduled call with Nikki
- **Account and service notifications:** follow-up on a service inquiry, account updates, and related customer care

We do not send marketing promotions, mass marketing campaigns, or unrelated third-party content via SMS.

## 3. How you opt in

You consent to receive SMS from Ops by Noell when:
1. You engage in a conversation with Noell Support (our AI chat assistant) on www.opsbynoell.com and provide your phone number in response to an explicit disclosure that you will receive a text message
2. You submit your phone number on a form on our website with an SMS consent checkbox
3. You explicitly request an SMS follow-up during a call or email exchange with Nikki

The disclosure language you will see before consenting is substantially:

> "By sharing your phone number, you agree to receive SMS messages from Ops by Noell related to your inquiry. Message and data rates may apply. Message frequency varies. Reply HELP for help, STOP to cancel."

Your consent is logged with a timestamp and the conversation transcript or form submission record.

## 4. Message frequency

Message frequency varies based on your interaction with us. Typical volume: 1–5 messages per active inquiry. You will not receive messages after your inquiry is resolved unless you explicitly request ongoing updates.

## 5. Carrier fees

Message and data rates may apply. Ops by Noell does not charge for the messages themselves, but your mobile carrier may charge you for SMS or data depending on your plan.

## 6. How to opt out

Reply **STOP** to any SMS from Ops by Noell at any time. Upon sending STOP, we will confirm your unsubscribe status via SMS, and you will no longer receive SMS messages from us.

You can also opt out by emailing hello@opsbynoell.com with the phone number you want removed.

**To rejoin after opting out:** sign up again as you did initially (via our chat assistant on www.opsbynoell.com or by submitting a form on our Site), and we will resume sending SMS messages to you.

## 7. How to get help

Reply **HELP** to any SMS from Ops by Noell for assistance, or email hello@opsbynoell.com.

## 8. Supported carriers

Our SMS program works with all major U.S. wireless carriers including AT&T, T-Mobile, Verizon, and US Cellular. Carriers are not liable for delayed or undelivered messages.

## 9. Privacy

Your phone number and the content of your SMS conversations with us are handled per our [Privacy Policy](/privacy).

**No mobile information will be shared with third parties or affiliates for marketing/promotional purposes.** Text messaging originator opt-in data and consent will not be shared with any third parties, except for aggregators and providers of the Text Message services.

## 10. Changes to this policy

We may update this SMS Policy from time to time. The "Last updated" date above reflects the most recent changes.

## 11. Contact

Questions about our SMS program:

**Ops by Noell**
Email: hello@opsbynoell.com
23710 El Toro Road #1086
Lake Forest, CA 92630, USA
`;

export default function SmsPolicyPage() {
  return <LegalPage title="SMS Policy" content={content} />;
}
