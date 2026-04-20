"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";

/**
 * Meta Pixel integration for Ops by Noell
 *
 * Reads pixel ID from NEXT_PUBLIC_META_PIXEL_ID env var.
 * Fires PageView on initial load and on every client-side navigation.
 *
 * Custom events to fire from other components:
 *   window.fbq('track', 'Lead')            // when a user submits a form
 *   window.fbq('track', 'Contact')         // when a user clicks /book or /contact
 *   window.fbq('track', 'Schedule')        // when a user completes booking
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

function MetaPixelPageview({ pixelId }: { pixelId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasMountedRef = useRef(false);

  useEffect(() => {
    // Skip the initial mount, the inline base script already fires PageView on load.
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (typeof window === "undefined" || !window.fbq) return;
    window.fbq("track", "PageView");
    void pathname;
    void searchParams;
  }, [pathname, searchParams, pixelId]);

  return null;
}

export function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  if (!pixelId) {
    // Gracefully no-op in dev or if env var is missing.
    return null;
  }

  return (
    <>
      <Script
        id="meta-pixel-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <Suspense fallback={null}>
        <MetaPixelPageview pixelId={pixelId} />
      </Suspense>
    </>
  );
}
