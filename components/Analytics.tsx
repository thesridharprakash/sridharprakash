"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { persistAttribution } from "@/lib/analytics";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function getAttributionFromSearchParams(searchParams: {
  get: (key: string) => string | null;
}): Record<string, string> {
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "fbclid",
  ];

  return keys.reduce<Record<string, string>>((acc, key) => {
    const value = searchParams.get(key);
    if (value) acc[key] = value;
    return acc;
  }, {});
}

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!measurementId || typeof window.gtag !== "function") return;
    const qs = searchParams?.toString();
    const pagePath = qs ? `${pathname}?${qs}` : pathname;
    window.gtag("event", "page_view", { page_path: pagePath });
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!searchParams) return;
    persistAttribution(getAttributionFromSearchParams(searchParams));
  }, [searchParams]);

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
