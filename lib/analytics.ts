"use client";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
};

const FIRST_TOUCH_KEY = "spk_first_touch_attribution";
const LAST_TOUCH_KEY = "spk_last_touch_attribution";

function parseStoredAttribution(key: string): Attribution {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Attribution;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function trackEvent(
  eventName: string,
  params: Record<string, string | number | boolean | undefined> = {}
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

export function persistAttribution(values: Attribution) {
  if (typeof window === "undefined") return;

  const hasAttribution = Object.values(values).some(Boolean);
  if (!hasAttribution) return;

  const firstTouch = parseStoredAttribution(FIRST_TOUCH_KEY);
  const hasFirstTouch = Object.values(firstTouch).some(Boolean);

  if (!hasFirstTouch) {
    window.localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(values));
  }

  window.localStorage.setItem(LAST_TOUCH_KEY, JSON.stringify(values));
}

export function getAttributionContext() {
  return {
    first_touch: parseStoredAttribution(FIRST_TOUCH_KEY),
    last_touch: parseStoredAttribution(LAST_TOUCH_KEY),
  };
}
