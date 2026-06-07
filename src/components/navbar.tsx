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
// ─── Systems dropdown links ───────────────────────────────────────────────────
const SYSTEMS_LINKS = [
  { name: "Systems Overview", href: "/systems", description: "The full operations platform" },
  { name: "Agents", href: "/agents", description: "Noell Support, Front Desk & Care" },
  { name: "Predictive Intelligence", href: "/predictive-customer-intelligence", description: "Signals before revenue leaves" },
  { name: "Noell Inbound", href: "/noell-inbound", description: "B2B lead qualification" },
  { name: "Noell Pipeline", href: "/noell-pipeline", description: "B2B sales operations" },
  { name: "Noell Account", href: "/noell-account", description: "B2B account management" },
];
// ─── Platform dropdown links ───────────────────────────────────────────────────
const PLATFORM_LINKS = [
  {
    name: "Lead Intelligence Dashboard",
    href: "/platform/lead-intelligence",
    description: "Live leads, conversations, and conversion funnel",
    external: false,
  },
  {
    name: "B2B Pipeline Dashboard",
    href: "/platform/b2b-pipeline",
    description: "Deal stages, ICP scores, and pipeline value",
    external: false,
  },
  {
    name: "ROI Calculator",
    href: "/roi",
    description: "Estimate your missed revenue",
    external: false,
  },
];
// ─── Resources dropdown links ──────────────────────────────────────────────────
const RESOURCES_LINKS = [
  { name: "Case Studies", href: "/case-studies", description: "Real results from real clients" },
  { name: "Compare", href: "/compare", description: "How we stack up against alternatives" },
  { name: "ROI Calculator", href: "/roi", description: "Estimate your missed revenue" },
];
type DropdownKey = "systems" | "platform" | "resources" | null;
interface NavbarProps {
  visible: boolean;
}
// ─── Navbar root ────────────────────────────────────────────────────────────
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
// ─── Desktop nav ────────────────────────────────────────────────────────────
const DesktopNav = ({ visible }: NavbarProps) => {
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  return (
    <motion.div
      onMouseLeave={() => setOpenDropdown(null)}
      animate={{
        width: visible ? "70%" : "88%",
        backgroundColor: visible
          ? "rgba(31, 18, 25, 0.97)"
          : "rgba(31, 18, 25, 0.88)",
        backdropFilter: visible ? "blur(12px)" : "blur(8px)",
        y: visible ? 4 : 0,
        boxShadow: visible
          ? "0 10px 30px -10px rgba(28,25,23,0.08)"
          : "0 0 0 transparent",
      }}
      initial={{ width: "88%", scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "hidden lg:flex flex-row self-center items-center justify-between py-3 mx-auto px-5 rounded-full relative z-[100] border border-white/10/40"
      )}
    >
      <Logo />
      {/* Nav items */}
      <div className="flex items-center gap-1">
        {/* For Service Businesses — primary track */}
        <Link
          href="/for-service-businesses"
          className="px-3 py-1.5 rounded-full text-sm font-medium text-cream/80 hover:text-cream hover:bg-wine/10 transition-colors"
        >
          For Service Businesses
        </Link>
        {/* For B2B & SaaS — secondary track, visually distinct */}
        <Link
          href="/for-b2b"
          className="px-3 py-1.5 rounded-full text-sm font-medium text-[#C45A2A]/90 hover:text-[#C45A2A] hover:bg-[#C45A2A]/10 transition-colors"
        >
          For B2B &amp; SaaS
        </Link>
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
                ? "text-wine bg-wine/15"
                : "text-cream/80 hover:text-cream hover:bg-wine/10"
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
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-2xl border border-white/10 bg-[#1F1219]/98 backdrop-blur-xl shadow-[0_20px_40px_-10px_rgba(28,25,23,0.12)] p-2 z-50"
              >
                {SYSTEMS_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpenDropdown(null)}
                    className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-wine/10 transition-colors group"
                  >
                    <span className="text-sm font-medium text-cream group-hover:text-wine transition-colors">
                      {link.name}
                    </span>
                    <span className="text-[11px] text-cream/55 mt-0.5">
                      {link.description}
                    </span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Platform dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setOpenDropdown("platform")}
        >
          <button
            type="button"
            onClick={() =>
              setOpenDropdown(openDropdown === "platform" ? null : "platform")
            }
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              openDropdown === "platform"
                ? "text-wine bg-wine/15"
                : "text-cream/80 hover:text-cream hover:bg-wine/10"
            )}
          >
            Platform
            <IconChevronDown
              size={13}
              className={cn(
                "transition-transform duration-200",
                openDropdown === "platform" ? "rotate-180" : "rotate-0"
              )}
            />
          </button>
          <AnimatePresence>
            {openDropdown === "platform" && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                onMouseLeave={() => setOpenDropdown(null)}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 rounded-2xl border border-white/10 bg-[#1F1219]/98 backdrop-blur-xl shadow-[0_20px_40px_-10px_rgba(28,25,23,0.12)] p-2 z-50"
              >
                <p className="px-3.5 pt-1.5 pb-2 text-[10px] uppercase tracking-[0.2em] text-cream/40 font-medium">
                  Platform previews
                </p>
                {PLATFORM_LINKS.map((link) => (
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      onClick={() => setOpenDropdown(null)}
                      className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-wine/10 transition-colors group"
                    >
                      <span className="text-sm font-medium text-cream group-hover:text-wine transition-colors flex items-center gap-1.5">
                        {link.name}
                        <span className="text-[9px] uppercase tracking-wider bg-wine/10 text-wine px-1.5 py-0.5 rounded-full font-semibold">Live</span>
                      </span>
                      <span className="text-[11px] text-cream/55 mt-0.5">
                        {link.description}
                      </span>
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpenDropdown(null)}
                      className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-wine/10 transition-colors group"
                    >
                      <span className="text-sm font-medium text-cream group-hover:text-wine transition-colors">
                        {link.name}
                      </span>
                      <span className="text-[11px] text-cream/55 mt-0.5">
                        {link.description}
                      </span>
                    </Link>
                  )
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
                ? "text-wine bg-wine/15"
                : "text-cream/80 hover:text-cream hover:bg-wine/10"
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
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-2xl border border-white/10 bg-[#1F1219]/98 backdrop-blur-xl shadow-[0_20px_40px_-10px_rgba(28,25,23,0.12)] p-2 z-50"
              >
                {RESOURCES_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpenDropdown(null)}
                    className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-wine/10 transition-colors group"
                  >
                    <span className="text-sm font-medium text-cream group-hover:text-wine transition-colors">
                      {link.name}
                    </span>
                    <span className="text-[11px] text-cream/55 mt-0.5">
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
          className="px-3 py-1.5 rounded-full text-sm font-medium text-cream/80 hover:text-cream hover:bg-wine/10 transition-colors"
        >
          Pricing
        </Link>
        {/* About */}
        <Link
          href="/about"
          className="px-3 py-1.5 rounded-full text-sm font-medium text-cream/80 hover:text-cream hover:bg-wine/10 transition-colors"
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
// ─── Mobile nav ────────────────────────────────────────────────────────────
const MobileNav = ({ visible }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState<DropdownKey>(null);
  const toggleSection = (key: "systems" | "platform" | "resources") => {
    setOpenSection((prev) => (prev === key ? null : key));
  };
  return (
    <motion.div
      animate={{
        backdropFilter: "blur(16px)",
        background: visible
          ? "rgba(31, 18, 25, 0.97)"
          : "rgba(31, 18, 25, 0.95)",
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
        "flex lg:hidden self-center mx-auto relative z-[100] border border-white/10/40"
      )}
    >
      <div className="flex w-full items-center justify-between">
        <Logo />
        <motion.button
          type="button"
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
              className="text-cream cursor-pointer"
            />
          ) : (
            <IconMenu2
              aria-hidden="true"
              focusable="false"
              className="text-cream cursor-pointer"
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
            className="flex rounded-2xl absolute top-16 backdrop-blur-xl bg-[#1F1219]/95 inset-x-0 z-50 flex-col items-start justify-start gap-1 w-full px-4 py-4 shadow-lg border border-white/10/40"
          >
            {/* Track separator label */}
            <p className="w-full px-3 pt-1 pb-0.5 text-[10px] uppercase tracking-[0.2em] text-cream/35 font-medium">
              Who we help
            </p>
            {/* For Service Businesses — primary track */}
            <Link
              href="/for-service-businesses"
              onClick={() => setOpen(false)}
              className="w-full px-3 py-2.5 rounded-xl text-cream/90 hover:text-cream hover:bg-wine/10 transition-colors text-sm font-medium"
            >
              For Service Businesses
            </Link>
            {/* For B2B & SaaS — secondary track */}
            <Link
              href="/for-b2b"
              onClick={() => setOpen(false)}
              className="w-full px-3 py-2.5 rounded-xl text-[#C45A2A]/90 hover:text-[#C45A2A] hover:bg-[#C45A2A]/10 transition-colors text-sm font-medium"
            >
              For B2B &amp; SaaS
            </Link>
            <div className="w-full h-px bg-white/8 my-1" />
            {/* Systems accordion */}
            <div className="w-full">
              <button
                type="button"
                onClick={() => toggleSection("systems")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-cream/90 hover:bg-wine/10 transition-colors text-sm font-medium"
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
                        className="flex flex-col px-3 py-2 rounded-xl hover:bg-wine/10 transition-colors"
                      >
                        <span className="text-sm text-cream/85">
                          {link.name}
                        </span>
                        <span className="text-[11px] text-cream/50">
                          {link.description}
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Platform accordion */}
            <div className="w-full">
              <button
                type="button"
                onClick={() => toggleSection("platform")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-cream/90 hover:bg-wine/10 transition-colors text-sm font-medium"
              >
                Platform
                <IconChevronDown
                  size={14}
                  className={cn(
                    "transition-transform duration-200",
                    openSection === "platform" ? "rotate-180" : "rotate-0"
                  )}
                />
              </button>
              <AnimatePresence>
                {openSection === "platform" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden pl-3"
                  >
                    {PLATFORM_LINKS.map((link) => (
                      link.external ? (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          onClick={() => setOpen(false)}
                          className="flex flex-col px-3 py-2 rounded-xl hover:bg-wine/10 transition-colors"
                        >
                          <span className="text-sm text-cream/85 flex items-center gap-1.5">
                            {link.name}
                            <span className="text-[9px] uppercase tracking-wider bg-wine/10 text-wine px-1.5 py-0.5 rounded-full font-semibold">Live</span>
                          </span>
                          <span className="text-[11px] text-cream/50">
                            {link.description}
                          </span>
                        </a>
                      ) : (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="flex flex-col px-3 py-2 rounded-xl hover:bg-wine/10 transition-colors"
                        >
                          <span className="text-sm text-cream/85">
                            {link.name}
                          </span>
                          <span className="text-[11px] text-cream/50">
                            {link.description}
                          </span>
                        </Link>
                      )
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
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-cream/90 hover:bg-wine/10 transition-colors text-sm font-medium"
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
                        className="flex flex-col px-3 py-2 rounded-xl hover:bg-wine/10 transition-colors"
                      >
                        <span className="text-sm text-cream/85">
                          {link.name}
                        </span>
                        <span className="text-[11px] text-cream/50">
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
              className="w-full px-3 py-2.5 rounded-xl text-cream/90 hover:text-cream hover:bg-wine/10 transition-colors text-sm font-medium"
            >
              Pricing
            </Link>
            {/* About */}
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="w-full px-3 py-2.5 rounded-xl text-cream/90 hover:text-cream hover:bg-wine/10 transition-colors text-sm font-medium"
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
