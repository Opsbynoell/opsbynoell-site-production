import { LegalShell, legalMetadataBase } from "@/components/legal-shell";
export const metadata = legalMetadataBase("Cookie Policy");
export default function CookiePolicyPage() {
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
          data so we understand what pages are helpful. We use Google Analytics
          (G-01DGCY0GXZ) to collect this data. You can opt out via your
          browser&apos;s Do Not Track setting or via{" "}
          <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">
            Google&apos;s Ad Settings
          </a>
          .
        </li>
        <li>
          <strong>Advertising cookies</strong>, if you have previously visited
          this site, Google Ads may use cookies or device identifiers to show
          you Ops by Noell ads on other websites. This is called remarketing.
          You can opt out at{" "}
          <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">
            Google&apos;s Ad Settings
          </a>{" "}
          or via the{" "}
          <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">
            Network Advertising Initiative opt-out page
          </a>
          .
        </li>
        <li>
          <strong>Scheduling cookies</strong>, if you book via our embedded
          scheduler, the scheduler provider sets its own cookies to support the
          booking flow.
        </li>
        <li>
          <strong>Meta Pixel</strong>, we use the Meta Pixel to measure the
          effectiveness of advertising on Meta platforms and to serve relevant
          ads to people who have visited our site. You can manage your
          preferences at{" "}
          <a href="https://www.facebook.com/adpreferences/" target="_blank" rel="noopener noreferrer">
            Facebook Ad Preferences
          </a>
          .
        </li>
      </ul>
      <h2>Managing cookies</h2>
      <p>
        You can clear or block cookies through your browser settings. Blocking
        essential cookies may prevent parts of the site from working. For
        advertising opt-outs, visit{" "}
        <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">
          Google&apos;s Ad Settings
        </a>{" "}
        or the{" "}
        <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">
          Network Advertising Initiative opt-out page
        </a>
        .
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
