import { LegalShell, legalMetadataBase } from "@/components/legal-shell";

export const metadata = legalMetadataBase("Privacy Policy");

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      lead="How Ops by Noell collects, uses, and protects your information. Plain language, no dark patterns."
    >
      <h2>What we collect</h2>
      <p>
        When you book an audit, chat with Noell Support, or contact us directly,
        we collect the information you choose to share: your name, phone number,
        email address, business name, and notes about your situation. We also
        collect basic technical information about your visit (pages viewed,
        device type, and referrer) through standard web analytics.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To reply to your inquiry and schedule your audit.</li>
        <li>To deliver and improve the Ops by Noell system if you become a client.</li>
        <li>To send occasional updates you opt into. We don&apos;t rent, sell, or share your information with third parties for marketing.</li>
      </ul>

      <h2>Who sees your data</h2>
      <p>
        Access is limited to Noell and the operators directly running your
        install. We use industry-standard vendors (hosting, email, scheduling,
        CRM) who process data on our behalf and are bound by their own
        agreements.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us at any time to export, correct, or delete your
        information. Email{" "}
        <a href="mailto:hello@opsbynoell.com">hello@opsbynoell.com</a> and
        we&apos;ll confirm within a reasonable timeframe.
      </p>

      <h2>Retention</h2>
      <p>
        We keep audit records and client data for as long as needed to provide
        the service, then delete or anonymize it. If you ask us to delete your
        data earlier, we will.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes materially, we&apos;ll update the date at the top
        of this page and, where required, reach out directly.
      </p>
    </LegalShell>
  );
}
