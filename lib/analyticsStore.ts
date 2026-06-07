type AnalyticsEventPayload = {
  eventName: string;
  pagePath?: string;
  pageUrl?: string;
  source?: string;
  campaign?: string;
  medium?: string;
  ref?: string;
  device?: string;
};

type AnalyticsSnapshot = {
  totalVisitors: number;
  totalPageViews: number;
  visitorsByPage: Record<string, number>;
  formSubmissions: number;
  bloodDonationRegistrations: number;
  communityFormSubmissions: number;
  reportIssueSubmissions: number;
  contactFormSubmissions: number;
  eventRegistrations: number;
  whatsAppClicks: number;
  topTrafficSources: Record<string, number>;
  events: Record<string, number>;
  updatedAt: string | null;
};

const globalForAnalytics = globalThis as typeof globalThis & {
  spAnalyticsStore?: {
    visitorIds: Set<string>;
    totalPageViews: number;
    visitorsByPage: Map<string, number>;
    topTrafficSources: Map<string, number>;
    events: Map<string, number>;
    updatedAt: string | null;
  };
};

const store =
  globalForAnalytics.spAnalyticsStore ??
  {
    visitorIds: new Set<string>(),
    totalPageViews: 0,
    visitorsByPage: new Map<string, number>(),
    topTrafficSources: new Map<string, number>(),
    events: new Map<string, number>(),
    updatedAt: null,
  };

globalForAnalytics.spAnalyticsStore = store;

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function mapToObject(map: Map<string, number>) {
  return Object.fromEntries([...map.entries()].sort((a, b) => b[1] - a[1]));
}

function normalizedPage(payload: AnalyticsEventPayload) {
  if (payload.pagePath) return payload.pagePath;
  if (!payload.pageUrl) return "unknown";

  try {
    return new URL(payload.pageUrl).pathname;
  } catch {
    return payload.pageUrl;
  }
}

function normalizedSource(payload: AnalyticsEventPayload) {
  return payload.source || payload.medium || payload.ref || "direct";
}

export function recordAnalyticsEvent(payload: AnalyticsEventPayload, visitorId: string) {
  const eventName = payload.eventName || "unknown_event";
  store.visitorIds.add(visitorId);
  increment(store.events, eventName);
  increment(store.topTrafficSources, normalizedSource(payload));

  if (eventName === "page_view") {
    store.totalPageViews += 1;
    increment(store.visitorsByPage, normalizedPage(payload));
  }

  store.updatedAt = new Date().toISOString();
}

export function readAnalyticsSnapshot(): AnalyticsSnapshot {
  const events = mapToObject(store.events);
  const formSubmissions =
    (events.blood_donation_registration ?? 0) +
    (events.community_form_submission ?? 0) +
    (events.report_issue_submission ?? 0) +
    (events.contact_form_submission ?? 0) +
    (events.event_registration ?? 0);

  return {
    totalVisitors: store.visitorIds.size,
    totalPageViews: store.totalPageViews,
    visitorsByPage: mapToObject(store.visitorsByPage),
    formSubmissions,
    bloodDonationRegistrations: events.blood_donation_registration ?? 0,
    communityFormSubmissions: events.community_form_submission ?? 0,
    reportIssueSubmissions: events.report_issue_submission ?? 0,
    contactFormSubmissions: events.contact_form_submission ?? 0,
    eventRegistrations: events.event_registration ?? 0,
    whatsAppClicks: events.whatsapp_button_click ?? 0,
    topTrafficSources: mapToObject(store.topTrafficSources),
    events,
    updatedAt: store.updatedAt,
  };
}
