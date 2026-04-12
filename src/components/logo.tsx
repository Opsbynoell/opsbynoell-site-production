"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const LogoIcon = ({ className }: { className?: string }) => (
  <svg
    width="28"
    height="29"
    viewBox="0 0 28 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g filter="url(#filter0_di_noell)">
      <path
        d="M4.53553 16.0355C2.58291 14.0829 2.58291 10.9171 4.53553 8.96447L10.1924 3.30761C12.145 1.35499 15.3108 1.35499 17.2635 3.30761L22.9203 8.96447C24.8729 10.9171 24.8729 14.0829 22.9203 16.0355L17.2635 21.6924C15.3108 23.645 12.145 23.645 10.1924 21.6924L4.53553 16.0355Z"
        fill="#6B2D3E"
      />
    </g>
    <defs>
      <filter
        id="filter0_di_noell"
        x="0.0712891"
        y="0.843262"
        width="27.3135"
        height="27.3135"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="1.5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.42 0 0 0 0 0.18 0 0 0 0 0.24 0 0 0 0.18 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.96 0 0 0 0 0.87 0 0 0 0 0.83 0 0 0 1 0"
        />
        <feBlend mode="normal" in2="shape" result="effect2_innerShadow" />
      </filter>
    </defs>
  </svg>
);

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Link
      href="/"
      className={cn(
        "font-normal flex gap-2 justify-center items-center text-sm text-charcoal px-2 py-1 shrink-0 relative z-20",
        className
      )}
    >
      <LogoIcon />
      <span className="font-serif font-semibold text-charcoal text-lg tracking-tight">
        Noell
      </span>
    </Link>
  );
};
