import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  const pages = [
    { title: "Home", href: "/" },
    { title: "Systems", href: "/systems" },
    { title: "Pricing", href: "/pricing" },
    { title: "ROI Calculator", href: "/roi" },
    { title: "Resources", href: "/resources" },
    { title: "Missed Call Audit", href: "/book" },
    { title: "Digital Readiness Review", href: "/digital-readiness-review" },
  ];

  const serviceProducts = [
    { title: "Noell Support", href: "/noell-support" },
    { title: "Noell Front Desk", href: "/noell-front-desk" },
    { title: "Noell Care", href: "/noell-care" },
    { title: "For Service Businesses", href: "/for-service-businesses" },
    { title: "Upgrade Your AI Tool", href: "/upgrade" },
  ];

  const legal = [
    { title: "Contact", href: "/contact" },
    { title: "Privacy Policy", href: "/legal/privacy" },
    { title: "Terms of Service", href: "/legal/terms" },
    { title: "SMS Policy", href: "/sms-policy" },
    { title: "Cookie Policy", href: "/legal/cookies" },
  ];

  return (
    <footer className="w-full max-w-7xl mx-auto rounded-3xl mb-10 mx-auto bg-[#301A26] border border-white/10">
      <div className="max-w-7xl mx-auto px-8 py-16 md:py-20">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <div className="flex items-start flex-col max-w-sm">
            <Logo />
            <h2 className="font-serif text-xl md:text-2xl font-medium text-cream mt-6 leading-snug">
              AI-powered operations for service businesses. Built, installed, and managed end-to-end.
            </h2>
            {/* Review badge */}
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-[#271520] px-4 py-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    className="w-3.5 h-3.5 text-wine"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-cream leading-none">5.0, rated by clients</p>
                <p className="text-[10px] text-cream/50 mt-0.5">Service businesses nationwide</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            <div className="space-y-5">
              <h3 className="text-[11px] uppercase tracking-widest text-muted-strong">
                Pages
              </h3>
              <ul className="space-y-3">
                {pages.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={item.href}
                      className="text-sm text-cream/70 hover:text-cream inline-flex items-center tap-target"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <h3 className="text-[11px] uppercase tracking-widest text-muted-strong">
                Service Track
              </h3>
              <ul className="space-y-3">
                {serviceProducts.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={item.href}
                      className="text-sm text-cream/70 hover:text-cream inline-flex items-center tap-target"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <h3 className="text-[11px] uppercase tracking-widest text-muted-strong">
                Legal
              </h3>
              <ul className="space-y-3">
                {legal.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={item.href}
                      className="text-sm text-cream/70 hover:text-cream inline-flex items-center tap-target"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 mt-12 border-t border-white/10 gap-3">
          <p className="text-xs text-muted-strong">
            &copy; {new Date().getFullYear()} Ops by Noell. Quiet operations for service businesses.
          </p>
          <p className="text-xs text-muted-strong">
            Done for you. Managed end-to-end.
          </p>
        </div>
        <div className="pt-6 mt-6 border-t border-white/10/60">
          <p className="text-[11px] leading-relaxed text-muted-strong/80 max-w-4xl">
            Ops by Noell is an independent service provider. We are not
            affiliated with, endorsed by, or a certified partner of any
            third-party booking, scheduling, practice management, electronic
            health record, CRM, or field service management platform. All
            third-party product names, logos, and brands referenced on this
            site are the property of their respective owners. Reference to a
            third-party platform is descriptive only and does not imply any
            sponsorship, partnership, or endorsement.
          </p>
        </div>
      </div>
    </footer>
  );
}
