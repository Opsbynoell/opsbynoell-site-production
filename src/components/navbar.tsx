"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
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

interface NavbarProps {
  navItems: {
    name: string;
    link: string;
    nova?: boolean;
  }[];
  visible: boolean;
}

export const Navbar = () => {
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Systems", link: "/#systems" },
    { name: "Verticals", link: "/#verticals" },
    { name: "Pricing", link: "/#pricing" },
    { name: "Nova", link: "/nova", nova: true },
    { name: "About", link: "/#about" },
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
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full fixed top-2 inset-x-0 z-50"
    >
      <DesktopNav visible={visible} navItems={navItems} />
      <MobileNav visible={visible} navItems={navItems} />
    </motion.div>
  );
};

const DesktopNav = ({ navItems, visible }: NavbarProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHoveredIndex(null)}
      animate={{
        width: visible ? "60%" : "85%",
        backgroundColor: visible
          ? "rgba(250, 246, 241, 0.95)"
          : "rgba(250, 246, 241, 0.6)",
        backdropFilter: visible ? "blur(10px)" : "blur(5px)",
        y: visible ? 4 : 0,
        boxShadow: visible
          ? "0 10px 30px -10px rgba(28,25,23,0.08)"
          : "0 0 0 transparent",
      }}
      initial={{ width: "85%", scale: 0.95, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "hidden lg:flex flex-row self-center items-center justify-between py-3 mx-auto px-8 rounded-full relative z-[100] border border-warm-border/40"
      )}
    >
      <Logo />
      <motion.div
        className="lg:flex flex-row flex-1 items-center justify-center space-x-1 text-sm"
        animate={{ scale: 1, justifyContent: visible ? "flex-end" : "center" }}
      >
        {navItems.map((navItem, idx) => (
          <motion.div
            key={`nav-item-${idx}`}
            onHoverStart={() => setHoveredIndex(idx)}
            className="relative"
          >
            <Link
              className="text-charcoal/80 hover:text-charcoal relative px-3 py-1.5 transition-colors flex items-center gap-1.5"
              href={navItem.link}
            >
              {navItem.nova && (
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
          </motion.div>
        ))}
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
          ? "rgba(250, 246, 241, 0.95)"
          : "rgba(250, 246, 241, 0.8)",
        width: visible ? "92%" : "95%",
        y: visible ? 4 : 0,
        borderRadius: open ? "24px" : "9999px",
        padding: "12px 20px",
        boxShadow: visible
          ? "0 10px 30px -10px rgba(28,25,23,0.08)"
          : "0 0 0 transparent",
      }}
      initial={{ width: "95%", scale: 0.95, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "flex relative flex-col lg:hidden w-full justify-between items-center max-w-[calc(100vw-1rem)] mx-auto z-50 border border-warm-border/40"
      )}
    >
      <div className="flex flex-row justify-between items-center w-full">
        <Logo />
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          {open ? (
            <IconX
              className="text-charcoal cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          ) : (
            <IconMenu2
              className="text-charcoal cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
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
                  className="relative text-charcoal/90 hover:text-charcoal transition-colors flex items-center gap-2"
                >
                  {navItem.nova && (
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
