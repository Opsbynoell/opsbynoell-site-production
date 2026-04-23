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

const VERTICAL_LINKS = [
  { name: "Dental Offices", href: "/verticals/dental" },
  { name: "Med Spas", href: "/verticals/med-spas" },
  { name: "Salons", href: "/verticals/salons" },
  { name: "Massage Therapy", href: "/verticals/massage" },
  { name: "Estheticians", href: "/verticals/estheticians" },
  { name: "HVAC", href: "/verticals/hvac" },
];

interface NavbarProps {
  navItems: {
    name: string;
    link: string;
    isAccent?: boolean;
  }[];
  visible: boolean;
}

export const Navbar = () => {
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Systems", link: "/systems" },
    { name: "About", link: "/about" },
    { name: "Verticals", link: "/verticals" },
    { name: "Agents", link: "/agents" },
    { name: "Pricing", link: "/pricing" },
    { name: "Noell Support", link: "/noell-support", isAccent: true },
    { name: "Book", link: "/book" },
  ];

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
      <DesktopNav visible={visible} navItems={navItems} />
      <MobileNav visible={visible} navItems={navItems} />
    </motion.nav>
  );
};

const DesktopNav = ({ navItems, visible }: NavbarProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [verticalsOpen, setVerticalsOpen] = useState(false);

  return (
    <motion.div
      onMouseLeave={() => {
        setHoveredIndex(null);
        setVerticalsOpen(false);
      }}
      animate={{
        width: visible ? "60%" : "85%",
        backgroundColor: visible
          ? "rgba(250, 246, 241, 0.98)"
          : "rgba(250, 246, 241, 0.92)",
        backdropFilter: visible ? "blur(12px)" : "blur(8px)",
        y: visible ? 4 : 0,
        boxShadow: visible
          ? "0 10px 30px -10px rgba(28,25,23,0.08)"
          : "0 0 0 transparent",
      }}
      initial={{ width: "85%", scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "hidden lg:flex flex-row self-center items-center justify-between py-3 mx-auto px-5 rounded-full relative z-[100] border border-warm-border/40"
      )}
    >
      <Logo />
      <motion.div
        className="lg:flex flex-row flex-1 items-center justify-center space-x-1 text-sm"
        animate={{ scale: 1, justifyContent: visible ? "flex-end" : "center" }}
      >
        {navItems.map((navItem, idx) => {
          const isVerticals = navItem.name === "Verticals";
          return (
            <motion.div
              key={`nav-item-${idx}`}
              onHoverStart={() => {
                setHoveredIndex(idx);
                if (isVerticals) setVerticalsOpen(true);
              }}
              onHoverEnd={() => {
                if (isVerticals) {
                  // keep open briefly so user can move cursor to dropdown
                }
              }}
              className="relative"
            >
              {isVerticals ? (
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={verticalsOpen}
                  aria-controls="verticals-menu"
                  className="text-charcoal/80 hover:text-charcoal relative px-2.5 py-1.5 transition-colors flex items-center gap-1"
                  onClick={() => setVerticalsOpen((v) => !v)}
                >
                  <span className="relative z-10">{navItem.name}</span>
                  <IconChevronDown
                    aria-hidden="true"
                    focusable="false"
                    size={13}
                    className={cn(
                      "transition-transform duration-200",
                      verticalsOpen ? "rotate-180" : ""
                    )}
                  />
                  {hoveredIndex === idx && (
                    <motion.div
                      layoutId="menu-hover"
                      className="absolute inset-0 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        background:
                          "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(240,224,214,0.35) 100%)",
                        boxShadow: "0 4px 15px rgba(28,25,23,0.06)",
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.05 }}
                    />
                  )}
                </button>
              ) : (
                <Link
                  className="text-charcoal/80 hover:text-charcoal relative px-2.5 py-1.5 transition-colors flex items-center gap-1.5"
                  href={navItem.link}
                >
                  {navItem.isAccent && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-lilac-dark" />
                  )}
                  <span className="relative z-10">{navItem.name}</span>
                  {hoveredIndex === idx && (
                    <motion.div
                      layoutId="menu-hover"
                      className="absolute inset-0 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        background:
                          "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(240,224,214,0.35) 100%)",
                        boxShadow: "0 4px 15px rgba(28,25,23,0.06)",
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.05 }}
                    />
                  )}
                </Link>
              )}

              {/* Verticals dropdown */}
              {isVerticals && (
                <AnimatePresence>
                  {verticalsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      onMouseEnter={() => setVerticalsOpen(true)}
                      onMouseLeave={() => setVerticalsOpen(false)}
                      id="verticals-menu"
                      role="menu"
                      aria-label="Verticals"
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 rounded-2xl border border-warm-border bg-white/95 backdrop-blur-xl shadow-[0_20px_40px_-8px_rgba(28,25,23,0.12)] p-2 z-50"
                    >
                      {VERTICAL_LINKS.map((v) => (
                        <Link
                          key={v.href}
                          href={v.href}
                          role="menuitem"
                          onClick={() => setVerticalsOpen(false)}
                          className="block px-3 py-2 text-sm text-charcoal/70 hover:text-charcoal hover:bg-cream rounded-xl transition-colors"
                        >
                          {v.name}
                        </Link>
                      ))}
                      <div className="mt-1 pt-1 border-t border-warm-border">
                        <Link
                          href="/verticals"
                          onClick={() => setVerticalsOpen(false)}
                          className="block px-3 py-2 text-xs text-wine/70 hover:text-wine hover:bg-blush rounded-xl transition-colors font-medium"
                        >
                          View all verticals &rarr;
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <AnimatePresence mode="popLayout" initial={false}>
        {!visible && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
          >
            <Button href="/book" variant="primary">
              Get Your Free Audit
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const MobileNav = ({ navItems, visible }: NavbarProps) => {
  const [open, setOpen] = useState(false);
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
            <IconX aria-hidden="true" focusable="false" className="text-charcoal cursor-pointer" />
          ) : (
            <IconMenu2 aria-hidden="true" focusable="false" className="text-charcoal cursor-pointer" />
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
            className="flex rounded-2xl absolute top-16 backdrop-blur-xl bg-cream/95 inset-x-0 z-50 flex-col items-start justify-start gap-3 w-full px-6 py-6 shadow-lg border border-warm-border/40"
          >
            {navItems.map((navItem, idx) => (
              <motion.div
                key={`link=${idx}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { delay: idx * 0.05 },
                }}
                whileHover={{ x: 5 }}
                className="w-full"
              >
                <Link
                  href={navItem.link}
                  onClick={() => setOpen(false)}
                  className="relative text-charcoal/90 hover:text-charcoal transition-colors flex items-center gap-2 tap-target py-2"
                >
                  {navItem.isAccent && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-lilac-dark" />
                  )}
                  <span className="block">{navItem.name}</span>
                </Link>
              </motion.div>
            ))}
            <Button
              href="/book"
              variant="primary"
              className="w-full mt-2"
            >
              Get Your Free Audit
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
