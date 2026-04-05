"use client";

import Link from "next/link";
import { useState } from "react";
import { ROUTES, CTA } from "@/lib/constants";

const navLinks = [
  { label: "Services", href: ROUTES.services },
  { label: "Pricing", href: ROUTES.pricing },
  { label: "Nova", href: ROUTES.nova },
  { label: "About", href: ROUTES.about },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Pill nav container */}
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between rounded-full bg-white/90 backdrop-blur-md border border-[#E8E8E8] px-5 py-3 shadow-sm">
          {/* Wordmark */}
          <Link
            href={ROUTES.home}
            className="text-[15px] font-semibold tracking-tight text-[#1A1A1A] hover:text-[#E8604C] transition-colors"
          >
            Ops by Noell
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <Link
            href={ROUTES.book}
            className="hidden md:inline-flex items-center justify-center rounded-full bg-[#E8604C] px-5 py-2 text-sm font-semibold text-white hover:bg-[#d94f3b] transition-colors"
          >
            {CTA.primary}
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            className="md:hidden p-1 text-[#4A4A4A]"
            onClick={() => setOpen(!open)}
          >
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current" />
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden mt-2 rounded-2xl bg-white border border-[#E8E8E8] shadow-md px-5 py-4">
            <ul className="flex flex-col gap-4 mb-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block text-sm font-medium text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={ROUTES.book}
              className="block w-full text-center rounded-full bg-[#E8604C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d94f3b] transition-colors"
              onClick={() => setOpen(false)}
            >
              {CTA.primary}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
