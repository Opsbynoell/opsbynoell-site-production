"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

/**
 * Ops by Noell logo system.
 *
 * LogoMark: the "O" favicon monogram at /images/logo-favicon-o.png.
 *   Used for: favicon, chat avatar, mobile compact marks, small badges.
 *
 * Logo: the full "Ops by Noell" lockup at /images/logo-ops-by-noell.png.
 *   Used for: navbar, footer, email signatures, social previews.
 */

export const LogoMark = ({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) => (
  <Image
    src="/images/logo-favicon-o.png"
    alt="Ops by Noell"
    width={size}
    height={size}
    className={className}
    priority
  />
);

/** Back-compat alias, some older imports referenced `LogoIcon`. */
export const LogoIcon = LogoMark;

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Link
      href="/"
      aria-label="Ops by Noell, home"
      className={cn(
        "flex items-center shrink-0 relative z-20 px-1 py-1",
        className
      )}
    >
      <Image
        src="/images/logo-ops-by-noell.png"
        alt="Ops by Noell"
        width={979}
        height={740}
        className="h-12 md:h-14 w-auto"
        priority
      />
    </Link>
  );
};
