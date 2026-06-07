"use client";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type Attribution = {
  source?: string;
  campaign?: string;
  medium?: string;
  ref?: string;
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

function visitorId() {
  if (typeof window === "undefined") return "";
  const key = "spk_analytics_visitor_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const generated = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(key, generated);
  return generated;
}

function campaignContext() {
  if (typeof window === "undefined") return {};

  const searchParams = new URLSearchParams(window.location.search);
  const lastTouch = parseStoredAttribution(LAST_TOUCH_KEY);

  return {
    source: searchParams.get("source") || searchParams.get("utm_source") || lastTouch.source || lastTouch.utm_source || "",
    campaign: searchParams.get("campaign") || searchParams.get("utm_campaign") || lastTouch.campaign || lastTouch.utm_campaign || "",
    medium: searchParams.get("medium") || searchParams.get("utm_medium") || lastTouch.medium || lastTouch.utm_medium || "",
    ref: searchParams.get("ref") || lastTouch.ref || document.referrer || "",
    pagePath: `${window.location.pathname}${window.location.search}`,
    pageUrl: window.location.href,
    device: window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop",
  };
}

function sendInternalAnalytics(eventName: string, params: Record<string, string | number | boolean | undefined>) {
  if (typeof window === "undefined") return;

  const body = JSON.stringify({
    eventName,
    visitorId: visitorId(),
    ...campaignContext(),
    ...params,
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
    return;
  }

  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

export function trackEvent(
  eventName: string,
  params: Record<string, string | number | boolean | undefined> = {}
) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, { ...campaignContext(), ...params });
  }
  sendInternalAnalytics(eventName, params);
}

export function trackPageView(pagePath: string) {
  if (typeof window === "undefined") return;
  sendInternalAnalytics("page_view", { pagePath });
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
