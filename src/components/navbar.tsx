"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX, IconChevronDown } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { Button } from "./button";
import { Logo } from "./logo";
import { trackAuditCtaClick } from "@/lib/analytics";

// ─── Who We Help dropdown links ────────────────────────────────────────────
const WHO_WE_HELP_LINKS = [
  {
    name: "Service Businesses",
    href: "/for-service-businesses",
    description: "Consultants, agencies, salons, med spas, and more",
  },
  {
    name: "B2B and Enterprise",
    href: "/for-b2b",
    description: "SaaS, AI vendors, and teams selling into enterprise",
  },
];

// ─── Systems dropdown links (trimmed to 3) ─────────────────────────────────
const SYSTEMS_LINKS = [
  { name: "Systems Overview", href: "/systems", description: "The full operations platform" },
  { name: "Agents", href: "/agents", description: "Noell Support, Front Desk & Care" },
  { name: "Predictive Intelligence", href: "/predictive-customer-intelligence", description: "Signals before revenue leaves" },
  { name: "Noell Inbound", href: "/noell-inbound", description: "B2B lead qualification" },
  { name: "Noell Pipeline", href: "/noell-pipeline", description: "B2B sales operations" },
  { name: "Noell Account", href: "/noell-account", description: "B2B account management" },
];

// ─── Resources dropdown links (trimmed to 3) ──────────────────────────────
const RESOURCES_LINKS = [
  { name: "Case Studies", href: "/case-studies", description: "Real results from real clients" },
  { name: "Compare", href: "/compare", description: "How we stack up against alternatives" },
  { name: "ROI Calculator", href: "/roi", description: "Estimate your missed revenue" },
];

type DropdownKey = "who-we-help" | "systems" | "resources" | null;

interface NavbarProps {
  visible: boolean;
}

// ─── Navbar root ──────────────────────────────────────────────────────────
export const Navbar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState<boolean>(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 100);
  });

  return (
    <motion.nav
      ref={ref}
      aria-label="Main navigation"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full fixed top-2 inset-x-0 z-50"
    >
      <DesktopNav visible={visible} />
      <MobileNav visible={visible} />
    </motion.nav>
  );
};

// ─── Desktop nav ──────────────────────────────────────────────────────────
const DesktopNav = ({ visible }: NavbarProps) => {
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);

  return (
    <motion.div
      onMouseLeave={() => setOpenDropdown(null)}
      animate={{
        width: visible ? "70%" : "88%",
        backgroundColor: visible
          ? "rgba(250, 246, 241, 0.98)"
          : "rgba(250, 246, 241, 0.92)",
        backdropFilter: visible ? "blur(12px)" : "blur(8px)",
        y: visible ? 4 : 0,
        boxShadow: visible
          ? "0 10px 30px -10px rgba(28,25,23,0.08)"
          : "0 0 0 transparent",
      }}
      initial={{ width: "88%", scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "hidden lg:flex flex-row self-center items-center justify-between py-3 mx-auto px-5 rounded-full relative z-[100] border border-warm-border/40"
      )}
    >
      <Logo />

      {/* Nav items */}
      <div className="flex items-center gap-1">

        {/* Who We Help dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setOpenDropdown("who-we-help")}
        >
          <button
            type="button"
            onClick={() =>
              setOpenDropdown(openDropdown === "who-we-help" ? null : "who-we-help")
            }
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              openDropdown === "who-we-help"
                ? "text-wine bg-blush/60"
                : "text-charcoal/80 hover:text-charcoal hover:bg-cream-dark/60"
            )}
          >
            Who We Help
            <IconChevronDown
              size={13}
              className={cn(
                "transition-transform duration-200",
                openDropdown === "who-we-help" ? "rotate-180" : "rotate-0"
              )}
            />
          </button>
          <AnimatePresence>
            {openDropdown === "who-we-help" && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                onMouseLeave={() => setOpenDropdown(null)}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-2xl border border-warm-border bg-cream/98 backdrop-blur-xl shadow-[0_20px_40px_-10px_rgba(28,25,23,0.12)] p-2 z-50"
              >
                {WHO_WE_HELP_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpenDropdown(null)}
                    className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-blush/50 transition-colors group"
                  >
                    <span className="text-sm font-medium text-charcoal group-hover:text-wine transition-colors">
                      {link.name}
                    </span>
                    <span className="text-[11px] text-charcoal/55 mt-0.5">
                      {link.description}
                    </span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Systems dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setOpenDropdown("systems")}
        >
          <button
            type="button"
            onClick={() =>
              setOpenDropdown(openDropdown === "systems" ? null : "systems")
            }
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              openDropdown === "systems"
                ? "text-wine bg-blush/60"
                : "text-charcoal/80 hover:text-charcoal hover:bg-cream-dark/60"
            )}
          >
            Systems
            <IconChevronDown
              size={13}
              className={cn(
                "transition-transform duration-200",
                openDropdown === "systems" ? "rotate-180" : "rotate-0"
              )}
            />
          </button>
          <AnimatePresence>
            {openDropdown === "systems" && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                onMouseLeave={() => setOpenDropdown(null)}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-2xl border border-warm-border bg-cream/98 backdrop-blur-xl shadow-[0_20px_40px_-10px_rgba(28,25,23,0.12)] p-2 z-50"
              >
                {SYSTEMS_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpenDropdown(null)}
                    className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-blush/50 transition-colors group"
                  >
                    <span className="text-sm font-medium text-charcoal group-hover:text-wine transition-colors">
                      {link.name}
                    </span>
                    <span className="text-[11px] text-charcoal/55 mt-0.5">
                      {link.description}
                    </span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Resources dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setOpenDropdown("resources")}
        >
          <button
            type="button"
            onClick={() =>
              setOpenDropdown(openDropdown === "resources" ? null : "resources")
            }
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              openDropdown === "resources"
                ? "text-wine bg-blush/60"
                : "text-charcoal/80 hover:text-charcoal hover:bg-cream-dark/60"
            )}
          >
            Resources
            <IconChevronDown
              size={13}
              className={cn(
                "transition-transform duration-200",
                openDropdown === "resources" ? "rotate-180" : "rotate-0"
              )}
            />
          </button>
          <AnimatePresence>
            {openDropdown === "resources" && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                onMouseLeave={() => setOpenDropdown(null)}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-2xl border border-warm-border bg-cream/98 backdrop-blur-xl shadow-[0_20px_40px_-10px_rgba(28,25,23,0.12)] p-2 z-50"
              >
                {RESOURCES_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpenDropdown(null)}
                    className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-blush/50 transition-colors group"
                  >
                    <span className="text-sm font-medium text-charcoal group-hover:text-wine transition-colors">
                      {link.name}
                    </span>
                    <span className="text-[11px] text-charcoal/55 mt-0.5">
                      {link.description}
                    </span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pricing */}
        <Link
          href="/pricing"
          className="px-3 py-1.5 rounded-full text-sm font-medium text-charcoal/80 hover:text-charcoal hover:bg-cream-dark/60 transition-colors"
        >
          Pricing
        </Link>

        {/* About */}
        <Link
          href="/about"
          className="px-3 py-1.5 rounded-full text-sm font-medium text-charcoal/80 hover:text-charcoal hover:bg-cream-dark/60 transition-colors"
        >
          About
        </Link>
      </div>

      {/* Primary CTA */}
      <AnimatePresence mode="popLayout" initial={false}>
        {!visible && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
          >
            <Button
              href="/book"
              variant="primary"
              data-event="audit_cta_click"
              data-source-page="navbar"
              data-source-section="navbar_primary"
              onClick={() =>
                trackAuditCtaClick("navbar", "navbar_primary", {
                  destination: "/book",
                  cta_label: "Free Revenue Signal Report",
                })
              }
            >
              Free Revenue Signal Report
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Mobile nav ───────────────────────────────────────────────────────────
const MobileNav = ({ visible }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState<DropdownKey>(null);

  const toggleSection = (key: "who-we-help" | "systems" | "resources") => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  return (
    <motion.div
      animate={{
        backdropFilter: "blur(16px)",
        background: visible
          ? "rgba(250, 246, 241, 0.98)"
          : "rgba(250, 246, 241, 0.95)",
        width: visible ? "92%" : "95%",
        y: visible ? 4 : 0,
        borderRadius: open ? "24px" : "9999px",
        padding: "12px 20px",
        boxShadow: visible
          ? "0 10px 30px -10px rgba(28,25,23,0.08)"
          : "0 0 0 transparent",
      }}
      initial={{ width: "95%", scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "flex relative flex-col lg:hidden w-full justify-between items-center max-w-[calc(100vw-1rem)] mx-auto z-50 border border-warm-border/40"
      )}
    >
      <div className="flex flex-row justify-between items-center w-full">
        <Logo />
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
          className="tap-target flex items-center justify-center"
        >
          {open ? (
            <IconX
              aria-hidden="true"
              focusable="false"
              className="text-charcoal cursor-pointer"
            />
          ) : (
            <IconMenu2
              aria-hidden="true"
              focusable="false"
              className="text-charcoal cursor-pointer"
            />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            id="mobile-nav-menu"
            role="menu"
            aria-label="Mobile navigation"
            className="flex rounded-2xl absolute top-16 backdrop-blur-xl bg-cream/95 inset-x-0 z-50 flex-col items-start justify-start gap-1 w-full px-4 py-4 shadow-lg border border-warm-border/40"
          >
            {/* Who We Help accordion */}
            <div className="w-full">
              <button
                type="button"
                onClick={() => toggleSection("who-we-help")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-charcoal/90 hover:bg-blush/40 transition-colors text-sm font-medium"
              >
                Who We Help
                <IconChevronDown
                  size={14}
                  className={cn(
                    "transition-transform duration-200",
                    openSection === "who-we-help" ? "rotate-180" : "rotate-0"
                  )}
                />
              </button>
              <AnimatePresence>
                {openSection === "who-we-help" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden pl-3"
                  >
                    {WHO_WE_HELP_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex flex-col px-3 py-2 rounded-xl hover:bg-blush/40 transition-colors"
                      >
                        <span className="text-sm font-medium text-charcoal/85">
                          {link.name}
                        </span>
                        <span className="text-[11px] text-charcoal/50">
                          {link.description}
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Systems accordion */}
            <div className="w-full">
              <button
                type="button"
                onClick={() => toggleSection("systems")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-charcoal/90 hover:bg-blush/40 transition-colors text-sm font-medium"
              >
                Systems
                <IconChevronDown
                  size={14}
                  className={cn(
                    "transition-transform duration-200",
                    openSection === "systems" ? "rotate-180" : "rotate-0"
                  )}
                />
              </button>
              <AnimatePresence>
                {openSection === "systems" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden pl-3"
                  >
                    {SYSTEMS_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex flex-col px-3 py-2 rounded-xl hover:bg-blush/40 transition-colors"
                      >
                        <span className="text-sm text-charcoal/85">
                          {link.name}
                        </span>
                        <span className="text-[11px] text-charcoal/50">
                          {link.description}
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resources accordion */}
            <div className="w-full">
              <button
                type="button"
                onClick={() => toggleSection("resources")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-charcoal/90 hover:bg-blush/40 transition-colors text-sm font-medium"
              >
                Resources
                <IconChevronDown
                  size={14}
                  className={cn(
                    "transition-transform duration-200",
                    openSection === "resources" ? "rotate-180" : "rotate-0"
                  )}
                />
              </button>
              <AnimatePresence>
                {openSection === "resources" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden pl-3"
                  >
                    {RESOURCES_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex flex-col px-3 py-2 rounded-xl hover:bg-blush/40 transition-colors"
                      >
                        <span className="text-sm text-charcoal/85">
                          {link.name}
                        </span>
                        <span className="text-[11px] text-charcoal/50">
                          {link.description}
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pricing */}
            <Link
              href="/pricing"
              onClick={() => setOpen(false)}
              className="w-full px-3 py-2.5 rounded-xl text-charcoal/90 hover:text-charcoal hover:bg-blush/40 transition-colors text-sm font-medium"
            >
              Pricing
            </Link>

            {/* About */}
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="w-full px-3 py-2.5 rounded-xl text-charcoal/90 hover:text-charcoal hover:bg-blush/40 transition-colors text-sm font-medium"
            >
              About
            </Link>

            {/* Book CTA */}
            <Button
              href="/book"
              variant="primary"
              className="w-full mt-2"
              data-event="audit_cta_click"
              data-source-page="navbar"
              data-source-section="navbar_mobile"
              onClick={() =>
                trackAuditCtaClick("navbar", "navbar_mobile", {
                  destination: "/book",
                  cta_label: "Free Revenue Signal Report",
                })
              }
            >
              Free Revenue Signal Report
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
