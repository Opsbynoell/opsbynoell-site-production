import Link from "next/link";
import { Logo } from "./logo";
import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandFacebook,
} from "@tabler/icons-react";

export function Footer() {
  const pages = [
    { title: "Home", href: "/" },
    { title: "Systems", href: "/#systems" },
    { title: "Verticals", href: "/#verticals" },
    { title: "Pricing", href: "/#pricing" },
    { title: "About", href: "/#about" },
  ];

  const products = [
    { title: "Nova Prospect", href: "/nova" },
    { title: "Book an Audit", href: "/book" },
  ];

  const legal = [
    { title: "Privacy Policy", href: "#" },
    { title: "Terms of Service", href: "#" },
    { title: "Cookie Policy", href: "#" },
  ];

  return (
    <footer className="w-full max-w-7xl mx-auto rounded-3xl mb-10 mx-auto bg-cream-dark border border-warm-border">
      <div className="max-w-7xl mx-auto px-8 py-16 md:py-20">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <div className="flex items-start flex-col max-w-sm">
            <Logo />
            <h2 className="font-serif text-xl md:text-2xl font-medium text-charcoal mt-6 leading-snug">
              Systems that catch missed calls, follow up instantly, and keep
              your calendar full.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            <div className="space-y-5">
              <h3 className="text-[11px] uppercase tracking-widest text-charcoal/40">
                Pages
              </h3>
              <ul className="space-y-3">
                {pages.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={item.href}
                      className="text-sm text-charcoal/70 hover:text-charcoal"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <h3 className="text-[11px] uppercase tracking-widest text-charcoal/40">
                Product
              </h3>
              <ul className="space-y-3">
                {products.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={item.href}
                      className="text-sm text-charcoal/70 hover:text-charcoal flex items-center gap-1.5"
                    >
                      {item.title === "Nova Prospect" && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-lilac-dark" />
                      )}
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <h3 className="text-[11px] uppercase tracking-widest text-charcoal/40">
                Legal
              </h3>
              <ul className="space-y-3">
                {legal.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={item.href}
                      className="text-sm text-charcoal/70 hover:text-charcoal"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 mt-12 border-t border-warm-border">
          <p className="text-xs text-charcoal/50">
            &copy; {new Date().getFullYear()} Ops by Noell. Quiet operations for
            service businesses.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link
              href="#"
              className="text-charcoal/50 hover:text-charcoal transition-colors"
            >
              <IconBrandInstagram size={18} />
            </Link>
            <Link
              href="#"
              className="text-charcoal/50 hover:text-charcoal transition-colors"
            >
              <IconBrandLinkedin size={18} />
            </Link>
            <Link
              href="#"
              className="text-charcoal/50 hover:text-charcoal transition-colors"
            >
              <IconBrandFacebook size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
