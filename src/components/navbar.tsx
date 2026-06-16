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
import { usePathname } from "next/navigation";
import React, { useRef, useState } from "react";
import { Button } from "./button";
import { Logo } from "./logo";
import { trackAuditCtaClick } from "@/lib/analytics";
import { useMediaQuery } from "@/hooks/use-media-query";
// ─── Resources dropdown links ──────────────────────────────────────────────────
const RESOURCES_LINKS = [
  { name: "Predictive Intelligence", href: "/predictive-customer-intelligence", description: "Spot clients before they ghost" },
  { name: "Case Studies", href: "/case-studies", description: "Real results from real clients" },
  { name: "Compare", href: "/compare", description: "How we stack up against alternatives" },
  { name: "ROI Calculator", href: "/roi", description: "Estimate your missed revenue" },
];
interface NavbarProps {
  visible: boolean;
}
/** Active when the visitor is on the link's page or one of its children. */
function useIsActivePath() {
  const pathname = usePathname();
  return (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
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
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const isActive = useIsActivePath();
  // Below 2xl the full item row plus the CTA button needs more of the
  // viewport, otherwise nav items collide with the button around 1450px.
  const isWide = useMediaQuery("(min-width: 1536px)");
  return (
    <motion.div
      animate={{
        width: visible ? (isWide ? "70%" : "85%") : (isWide ? "88%" : "96%"),
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
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
            isActive("/for-service-businesses")
              ? "text-[#C45A2A]"
              : "text-cream/80 hover:text-cream hover:bg-wine/10"
          )}
        >
          For Service Businesses
        </Link>
        {/* Resources dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setResourcesOpen(true)}
          onMouseLeave={() => setResourcesOpen(false)}
        >
          <button
            type="button"
            onClick={() => setResourcesOpen((v) => !v)}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              resourcesOpen
                ? "text-wine bg-wine/15"
                : "text-cream/80 hover:text-cream hover:bg-wine/10"
            )}
          >
            Resources
            <IconChevronDown
              size={13}
              className={cn(
                "transition-transform duration-200",
                resourcesOpen ? "rotate-180" : "rotate-0"
              )}
            />
          </button>
          <AnimatePresence>
            {resourcesOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-2xl border border-white/10 bg-[#1F1219]/98 backdrop-blur-xl shadow-[0_20px_40px_-10px_rgba(28,25,23,0.12)] p-2 z-50"
              >
                {RESOURCES_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setResourcesOpen(false)}
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
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
            isActive("/pricing")
              ? "text-[#C45A2A]"
              : "text-cream/80 hover:text-cream hover:bg-wine/10"
          )}
        >
          Pricing
        </Link>
        {/* About */}
        <Link
          href="/about"
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
            isActive("/about")
              ? "text-[#C45A2A]"
              : "text-cream/80 hover:text-cream hover:bg-wine/10"
          )}
        >
          About
        </Link>
      </div>
      {/* Primary CTA — appears once the user scrolls past the hero */}
      <AnimatePresence mode="popLayout" initial={false}>
        {visible && (
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
                  cta_label: "Free Missed Call Audit",
                })
              }
            >
              Free Missed Call Audit
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
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const isActive = useIsActivePath();
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
            {/* For Service Businesses */}
            <Link
              href="/for-service-businesses"
              onClick={() => setOpen(false)}
              className={cn(
                "w-full px-3 py-2.5 rounded-xl transition-colors text-sm font-medium",
                isActive("/for-service-businesses")
                  ? "text-[#C45A2A]"
                  : "text-cream/90 hover:text-cream hover:bg-wine/10"
              )}
            >
              For Service Businesses
            </Link>
            {/* Resources accordion */}
            <div className="w-full">
              <button
                type="button"
                onClick={() => setResourcesOpen((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-cream/90 hover:bg-wine/10 transition-colors text-sm font-medium"
              >
                Resources
                <IconChevronDown
                  size={14}
                  className={cn(
                    "transition-transform duration-200",
                    resourcesOpen ? "rotate-180" : "rotate-0"
                  )}
                />
              </button>
              <AnimatePresence>
                {resourcesOpen && (
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
                  cta_label: "Free Missed Call Audit",
                })
              }
            >
              Free Missed Call Audit
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
