"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { ROUTES, CTA } from "@/lib/constants";

// ─── Verticals dropdown items ──────────────────────────────────────────────────
const verticalItems = [
  { label: "Med Spas",           href: "/verticals/med-spas" },
  { label: "Salons",             href: "/verticals/salons" },
  { label: "Massage Therapists", href: "/verticals/massage-therapists" },
  { label: "Dental Offices",     href: "/verticals/dental-offices" },
  { label: "HVAC",               href: "/verticals/hvac" },
  { label: "Home Services",      href: "/verticals/home-services" },
  { label: "Pool Services",      href: "/verticals/pool-services" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileVerticalsOpen, setMobileVerticalsOpen] = useState(false);
  const hoverRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;
  const isVerticalsActive = pathname.startsWith("/verticals");

  const openDropdown = () => {
    if (hoverRef.current) clearTimeout(hoverRef.current);
    setDesktopDropdownOpen(true);
  };
  const closeDropdown = () => {
    hoverRef.current = setTimeout(() => setDesktopDropdownOpen(false), 130);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between rounded-full bg-[#FAF5F0]/92 backdrop-blur-md border border-[#EDE3DE] px-5 py-2.5 shadow-[0_1px_8px_rgba(31,26,26,0.06)]">

          {/* ── Wordmark — editorial lock-up with bar accent ────────────────── */}
          <Link
            href={ROUTES.home}
            className="flex items-center gap-2 group select-none"
            aria-label="Ops by Noell — Home"
          >
            <span className="w-[2px] h-7 rounded-full bg-[#6A2C3E] opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            <span className="flex flex-col leading-none gap-[3px]">
              <span className="text-[8px] font-semibold uppercase tracking-[0.24em] text-[#6D6664] group-hover:text-[#6A2C3E] transition-colors">
                OPS BY
              </span>
              <span className="font-display text-[18px] font-bold text-[#1F1A1A] group-hover:text-[#6A2C3E] transition-colors leading-none tracking-tight">
                Noell
              </span>
            </span>
          </Link>

          {/* ── Desktop nav ─────────────────────────────────────────────────── */}
          <ul className="hidden md:flex items-center gap-6">

            {/* Home */}
            <li>
              <Link
                href={ROUTES.home}
                className={`text-sm font-medium transition-colors ${
                  isActive(ROUTES.home) ? "text-[#6A2C3E]" : "text-[#6D6664] hover:text-[#1F1A1A]"
                }`}
              >
                Home
              </Link>
            </li>

            {/* Systems */}
            <li>
              <Link
                href={ROUTES.systems}
                className={`text-sm font-medium transition-colors ${
                  isActive(ROUTES.systems) ? "text-[#6A2C3E]" : "text-[#6D6664] hover:text-[#1F1A1A]"
                }`}
              >
                Systems
              </Link>
            </li>

            {/* Verticals — dropdown */}
            <li
              className="relative"
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
            >
              <Link
                href={ROUTES.verticals}
                className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${
                  isVerticalsActive ? "text-[#6A2C3E]" : "text-[#6D6664] hover:text-[#1F1A1A]"
                }`}
              >
                Verticals
                <svg
                  width="10" height="6" viewBox="0 0 10 6" fill="none"
                  aria-hidden
                  className={`transition-transform duration-150 ${desktopDropdownOpen ? "rotate-180" : ""}`}
                >
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              {/* Dropdown panel */}
              {desktopDropdownOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-52 rounded-2xl bg-white border border-[#EDE3DE] shadow-[0_8px_32px_rgba(31,26,26,0.1)] py-2 overflow-hidden"
                  onMouseEnter={openDropdown}
                  onMouseLeave={closeDropdown}
                >
                  <div className="px-3.5 pt-1.5 pb-1">
                    <p className="log-ts text-[#C8C4C0] uppercase tracking-widest">Industries</p>
                  </div>
                  {verticalItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#6D6664] hover:text-[#1F1A1A] hover:bg-[#FAF5F0] transition-colors"
                      onClick={() => setDesktopDropdownOpen(false)}
                    >
                      <span className="w-1 h-1 rounded-full bg-[#EDE3DE] flex-shrink-0" />
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-[#EDE3DE] mt-1.5 pt-1.5 px-3.5 pb-1">
                    <Link
                      href={ROUTES.verticals}
                      className="text-[10px] font-semibold text-[#6A2C3E] hover:text-[#5a2233] transition-colors"
                      onClick={() => setDesktopDropdownOpen(false)}
                    >
                      View all verticals →
                    </Link>
                  </div>
                </div>
              )}
            </li>

            {/* Pricing */}
            <li>
              <Link
                href={ROUTES.pricing}
                className={`text-sm font-medium transition-colors ${
                  isActive(ROUTES.pricing) ? "text-[#6A2C3E]" : "text-[#6D6664] hover:text-[#1F1A1A]"
                }`}
              >
                Pricing
              </Link>
            </li>

            {/* Nova — purple accent so it reads as distinct product */}
            <li>
              <Link
                href={ROUTES.nova}
                className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive(ROUTES.nova) ? "text-[#7C5CFC]" : "text-[#6D6664] hover:text-[#7C5CFC]"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] flex-shrink-0 opacity-75" />
                Nova
              </Link>
            </li>

            {/* About */}
            <li>
              <Link
                href={ROUTES.about}
                className={`text-sm font-medium transition-colors ${
                  isActive(ROUTES.about) ? "text-[#6A2C3E]" : "text-[#6D6664] hover:text-[#1F1A1A]"
                }`}
              >
                About
              </Link>
            </li>
          </ul>

          {/* ── Desktop CTA ──────────────────────────────────────────────────── */}
          <Link
            href={ROUTES.book}
            className="hidden md:inline-flex items-center justify-center rounded-full bg-[#6A2C3E] px-5 py-2 text-sm font-semibold text-white hover:bg-[#5a2233] transition-colors"
          >
            {CTA.primary}
          </Link>

          {/* ── Mobile hamburger ─────────────────────────────────────────────── */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="md:hidden p-1 text-[#6D6664] hover:text-[#1F1A1A] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
                <path d="M0 1h18M0 7h18M0 13h18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </nav>

        {/* ── Mobile menu ───────────────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="md:hidden mt-2 rounded-2xl bg-[#FAF5F0] border border-[#EDE3DE] shadow-md px-5 py-4">
            <ul className="flex flex-col mb-4">

              <li>
                <Link
                  href={ROUTES.home}
                  className="block py-2.5 text-sm font-medium text-[#6D6664] hover:text-[#1F1A1A] transition-colors border-b border-[#F5EFEB]"
                  onClick={() => setMobileOpen(false)}
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href={ROUTES.systems}
                  className="block py-2.5 text-sm font-medium text-[#6D6664] hover:text-[#1F1A1A] transition-colors border-b border-[#F5EFEB]"
                  onClick={() => setMobileOpen(false)}
                >
                  Systems
                </Link>
              </li>

              {/* Verticals — expandable */}
              <li className="border-b border-[#F5EFEB]">
                <button
                  type="button"
                  onClick={() => setMobileVerticalsOpen(!mobileVerticalsOpen)}
                  className="w-full flex items-center justify-between py-2.5 text-sm font-medium text-[#6D6664] hover:text-[#1F1A1A] transition-colors"
                >
                  Verticals
                  <svg
                    width="10" height="6" viewBox="0 0 10 6" fill="none"
                    aria-hidden
                    className={`transition-transform duration-150 ${mobileVerticalsOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {mobileVerticalsOpen && (
                  <ul className="pl-3 border-l-2 border-[#EDE3DE] mb-2 flex flex-col gap-0.5">
                    {verticalItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block py-1.5 text-xs font-medium text-[#6D6664] hover:text-[#1F1A1A] transition-colors"
                          onClick={() => { setMobileVerticalsOpen(false); setMobileOpen(false); }}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}

                    <li>
                      <Link
                        href={ROUTES.verticals}
                        className="block py-1.5 text-xs font-semibold text-[#6A2C3E] hover:text-[#5a2233] transition-colors"
                        onClick={() => { setMobileVerticalsOpen(false); setMobileOpen(false); }}
                      >
                        View all verticals →
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <Link
                  href={ROUTES.pricing}
                  className="block py-2.5 text-sm font-medium text-[#6D6664] hover:text-[#1F1A1A] transition-colors border-b border-[#F5EFEB]"
                  onClick={() => setMobileOpen(false)}
                >
                  Pricing
                </Link>
              </li>

              <li>
                <Link
                  href={ROUTES.nova}
                  className="flex items-center gap-2 py-2.5 text-sm font-medium text-[#6D6664] hover:text-[#7C5CFC] transition-colors border-b border-[#F5EFEB]"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] opacity-75 flex-shrink-0" />
                  Nova
                </Link>
              </li>

              <li>
                <Link
                  href={ROUTES.about}
                  className="block py-2.5 text-sm font-medium text-[#6D6664] hover:text-[#1F1A1A] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  About
                </Link>
              </li>
            </ul>

            <Link
              href={ROUTES.book}
              className="block w-full text-center rounded-full bg-[#6A2C3E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5a2233] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {CTA.primary}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
