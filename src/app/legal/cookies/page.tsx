import { LegalShell, legalMetadataBase } from "@/components/legal-shell";

export const metadata = legalMetadataBase("Cookie Policy");

export default function CookiesPage() {
  return (
    <LegalShell
      title="Cookie Policy"
      lead="What cookies opsbynoell.com uses and why. No tracking theater."
    >
      <h2>What cookies are</h2>
      <p>
        Cookies are small text files a website stores in your browser. They
        help the site remember your session, measure usage, and, in some
        cases, show you relevant content.
      </p>

      <h2>What we use</h2>
      <ul>
        <li>
          <strong>Essential cookies</strong>, required to serve the site
          (hosting session, security). These are always on.
        </li>
        <li>
          <strong>Analytics cookies</strong>, aggregated and anonymized usage
          data so we understand what pages are helpful. You can opt out via
          your browser&apos;s Do Not Track setting.
        </li>
        <li>
          <strong>Scheduling cookies</strong>, if you book via our embedded
          scheduler, the scheduler provider sets its own cookies to support the
          booking flow.
        </li>
      </ul>
      <p>
        We do not use cookies for cross-site advertising or to build
        advertising profiles.
      </p>

      <h2>Managing cookies</h2>
      <p>
        You can clear or block cookies through your browser settings. Blocking
        essential cookies may prevent parts of the site from working.
      </p>

      <h2>Changes</h2>
      <p>
        If our cookie use changes materially, we&apos;ll update this page.
        Questions?{" "}
        <a href="mailto:hello@opsbynoell.com">hello@opsbynoell.com</a>.
      </p>
    </LegalShell>
  );
}
