import { LegalShell, legalMetadataBase } from "@/components/legal-shell";

export const metadata = legalMetadataBase("Terms of Service");

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms of Service"
      lead="The plain-language agreement that covers using opsbynoell.com and the Ops by Noell system."
    >
      <h2>Using the site</h2>
      <p>
        You can browse opsbynoell.com and book an audit without creating an
        account. By using the site you agree not to attempt to disrupt it,
        reverse-engineer internal systems, or misrepresent yourself.
      </p>

      <h2>The audit</h2>
      <p>
        The free audit is a scoped 30-minute conversation. We share our
        assessment of where leads are falling through in your business.
        Recommendations are offered in good faith; outcomes depend on your
        implementation and business context.
      </p>

      <h2>Engagements</h2>
      <p>
        If you choose to install the Noell system, a separate client agreement
        governs that work (scope, pricing, deliverables, and support). Nothing
        on this website constitutes a contract for services by itself.
      </p>

      <h2>Content ownership</h2>
      <p>
        The copy, design, and system thinking on opsbynoell.com are owned by
        Ops by Noell. You&apos;re welcome to share links; please don&apos;t
        copy substantial portions without asking.
      </p>

      <h2>Warranties</h2>
      <p>
        We do our best to keep the site accurate and available, but we provide
        it &quot;as is&quot; without warranty. We&apos;re not liable for
        indirect or consequential damages arising from use of the site.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. Material changes will be announced on the
        site and, where required, communicated directly.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email{" "}
        <a href="mailto:hello@opsbynoell.com">hello@opsbynoell.com</a>.
      </p>
    </LegalShell>
  );
}
