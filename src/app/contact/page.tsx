import Script from "next/script";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/contact",
  title: "Contact",
  description:
    "Contact Ops by Noell. Tell us about your service business and what you are trying to fix. Nikki personally reviews every inquiry and replies within one business day.",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
        id="contact"
      />
      <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-charcoal">
        Let&apos;s talk
      </h1>
      <p className="mt-4 text-lg text-charcoal/70">
        Tell us about your service business and what you&apos;re trying to fix.
        Nikki personally reviews every inquiry and replies within one business
        day. If you opt in to SMS, we&apos;ll also send you a confirmation text
        after you submit.
      </p>

      <div className="mt-10">
        <iframe
          src="https://api.leadconnectorhq.com/widget/form/pn741UhuOW16S9Pkklpa"
          style={{ width: "100%", minHeight: "600px", border: "none", borderRadius: "8px" }}
          id="inline-pn741UhuOW16S9Pkklpa"
          data-layout='{"id":"INLINE"}'
          data-trigger-type="alwaysShow"
          data-trigger-value=""
          data-activation-type="alwaysActivated"
          data-activation-value=""
          data-deactivation-type="neverDeactivate"
          data-deactivation-value=""
          data-form-name="Website Contact Form"
          data-height="600"
          data-layout-iframe-id="inline-pn741UhuOW16S9Pkklpa"
          data-form-id="pn741UhuOW16S9Pkklpa"
          title="Contact form"
        />
        <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
      </div>

      <p className="mt-8 text-sm text-muted-medium">
        By submitting this form and checking the consent boxes, you agree to our{" "}
        <a href="/legal/privacy" className="underline">Privacy Policy</a>,{" "}
        <a href="/legal/terms" className="underline">Terms of Service</a>, and{" "}
        <a href="/sms-policy" className="underline">SMS Policy</a>. Message and data rates
        may apply. Message frequency varies. Reply HELP for help, STOP to cancel.
      </p>
    </div>
  );
}
