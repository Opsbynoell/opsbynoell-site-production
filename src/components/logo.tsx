"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * Ops by Noell, final logo system.
 *
 * LogoMark: the "ON" monogram. Serif uppercase, kerned tight so the O and N
 *   visually kiss, rendered in plum/wine-dark to match the approved direction.
 *   Uses inline SVG with real <text> in Playfair Display (already loaded
 *   site-wide) so it's crisp at any size and keeps the same typographic voice
 *   as the rest of the site.
 *
 * Logo: full lockup. LogoMark + "Ops by Noell" wordmark in a two-line stack.
 *   Used in the navbar and the footer.
 */

const PLUM = "#6A2C3E"; // matches --color-wine in globals.css (Ops by Noell Wine)

export const LogoMark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 110 80"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
    role="presentation"
  >
    <text
      x="0"
      y="66"
      fontFamily='"Playfair Display", Georgia, serif'
      fontWeight={900}
      fontStyle="italic"
      fontSize="82"
      letterSpacing="-6"
      fill={PLUM}
    >
      O
    </text>
    <text
      x="44"
      y="66"
      fontFamily='"Playfair Display", Georgia, serif'
      fontWeight={900}
      fontSize="82"
      letterSpacing="-6"
      fill={PLUM}
    >
      N
    </text>
  </svg>
);

/** Back-compat alias, some older imports referenced `LogoIcon`. */
export const LogoIcon = LogoMark;

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Link
      href="/"
      aria-label="Ops by Noell, home"
      className={cn(
        "flex gap-2.5 items-center shrink-0 relative z-20 px-1 py-1",
        className
      )}
    >
      <LogoMark className="h-8 w-auto md:h-9" />
      <span className="flex flex-col leading-[0.95] font-serif font-semibold text-charcoal">
        <span className="text-[13px] md:text-[14px] tracking-tight">Ops by</span>
        <span className="text-[13px] md:text-[14px] tracking-tight">Noell</span>
      </span>
    </Link>
  );
};
