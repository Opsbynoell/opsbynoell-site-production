"use client";

import { useEffect } from "react";
import { trackMetaCustomEvent } from "@/lib/meta-pixel-track";

export function SystemsPageAnalytics() {
  useEffect(() => {
    trackMetaCustomEvent("systems_page_view");
  }, []);
  return null;
}
