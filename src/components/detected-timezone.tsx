"use client";

import { useEffect, useState } from "react";

export function DetectedTimezone() {
  const [tz, setTz] = useState<string | null>(null);

  useEffect(() => {
    try {
      setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch {
      setTz(null);
    }
  }, []);

  if (!tz) return null;

  return (
    <p className="text-xs text-charcoal/60">
      Detected: {tz} ·{" "}
      <a
        href="mailto:hello@opsbynoell.com?subject=Wrong%20timezone"
        className="underline underline-offset-4 decoration-charcoal/30 hover:text-charcoal"
      >
        Not right? change
      </a>
    </p>
  );
}
