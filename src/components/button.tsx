"use client";
import React from "react";
import NextLink from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "dark" | "wine" | "lilac";

type BaseProps = {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type AnchorProps = BaseProps & {
  href: string;
  as?: never;
  type?: never;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

type ButtonProps = BaseProps & {
  href?: never;
  as?: never;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const baseStyles = cn(
  "px-5 py-2.5 flex rounded-[8px] text-sm font-medium relative",
  "cursor-pointer hover:-translate-y-0.5 transition duration-200",
  "inline-flex items-center justify-center"
);

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    "rounded-[8px]",
    "bg-[linear-gradient(181deg,_#8B4D5E_18.12%,_#5A1F30_99.57%)]",
    "shadow-[0px_4px_8px_0px_rgba(90,31,48,0.18),_0px_2px_4px_0px_rgba(90,31,48,0.12),",
    "0px_0px_0px_1px_rgba(90,31,48,0.12),_0px_1px_1px_2px_rgba(255,255,255,0.28)_inset,",
    "0px_-1px_5px_2px_rgba(255,255,255,0.20)_inset]",
    "text-white"
  ),
  secondary: cn(
    "bg-white rounded-[8px] border border-warm-border text-charcoal"
  ),
  dark: cn("bg-charcoal text-cream rounded-[8px]"),
  wine: cn(
    "rounded-[8px] bg-wine text-cream",
    "shadow-[0px_2px_4px_0px_rgba(90,31,48,0.18)]",
    "hover:bg-wine-dark"
  ),
  lilac: cn(
    "rounded-[8px]",
    "bg-[linear-gradient(181deg,_#C4B5CE_18.12%,_#8B6F9C_99.57%)]",
    "shadow-[0px_4px_8px_0px_rgba(139,111,156,0.20),_0px_2px_4px_0px_rgba(139,111,156,0.12),",
    "0px_0px_0px_1px_rgba(139,111,156,0.12),_0px_1px_1px_2px_rgba(255,255,255,0.28)_inset,",
    "0px_-1px_5px_2px_rgba(255,255,255,0.22)_inset]",
    "text-white"
  ),
};

export function Button(props: AnchorProps | ButtonProps) {
  const { variant = "primary", className, children } = props;
  const composedClass = cn(baseStyles, variantStyles[variant], className);

  if ("href" in props && props.href !== undefined) {
    const { href, onClick } = props;
    const isExternal = /^https?:\/\//.test(href) || href.startsWith("mailto:");
    if (isExternal) {
      return (
        <a
          href={href}
          className={composedClass}
          onClick={onClick}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    }
    return (
      <NextLink href={href} className={composedClass} onClick={onClick}>
        {children}
      </NextLink>
    );
  }

  const { type = "button", onClick } = props as ButtonProps;
  return (
    <button type={type} className={composedClass} onClick={onClick}>
      {children}
    </button>
  );
}
