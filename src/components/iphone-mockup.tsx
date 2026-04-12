"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const IphoneMockup = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("relative mx-auto w-full max-w-[340px]", className)}>
      <div
        className="relative rounded-[48px] border-[10px] border-charcoal bg-white shadow-[0px_45px_120px_-20px_rgba(28,25,23,0.35),_0px_20px_50px_-15px_rgba(107,45,62,0.18),_0px_0px_0px_1px_rgba(28,25,23,0.08)_inset]"
        style={{ aspectRatio: "9 / 16" }}
      >
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 h-6 w-24 rounded-full bg-charcoal z-20" />
        {/* Screen */}
        <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-cream pt-10 pb-4">
          {children}
        </div>
      </div>
    </div>
  );
};
