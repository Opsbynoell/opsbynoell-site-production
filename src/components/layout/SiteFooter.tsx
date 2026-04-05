import Link from "next/link";
import { ROUTES, SITE_META, CTA } from "@/lib/constants";

const footerLinks = [
  { label: "Services", href: ROUTES.services },
  { label: "Pricing", href: ROUTES.pricing },
  { label: "Nova AI", href: ROUTES.nova },
  { label: "About", href: ROUTES.about },
  { label: "Book a Free Audit", href: ROUTES.book },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[#E8E8E8] bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <Link
              href={ROUTES.home}
              className="text-base font-semibold tracking-tight text-[#1A1A1A]"
            >
              Ops by Noell
            </Link>
            <p className="mt-2 text-sm leading-relaxed text-[#717171]">
              {SITE_META.tagline}
            </p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA */}
          <Link
            href={ROUTES.book}
            className="self-start inline-flex items-center justify-center rounded-full bg-[#E8604C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d94f3b] transition-colors"
          >
            {CTA.primary}
          </Link>
        </div>

        <div className="mt-10 border-t border-[#F0F0F0] pt-6">
          <p className="text-xs text-[#717171]">
            © {new Date().getFullYear()} {SITE_META.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
