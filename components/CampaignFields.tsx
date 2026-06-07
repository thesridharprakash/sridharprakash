"use client";

import { useState } from "react";

type CampaignValues = {
  source: string;
  campaign: string;
  medium: string;
  ref: string;
  pageUrl: string;
  userAgent: string;
};

const emptyValues: CampaignValues = {
  source: "",
  campaign: "",
  medium: "",
  ref: "",
  pageUrl: "",
  userAgent: "",
};

export default function CampaignFields() {
  const [values] = useState<CampaignValues>(() => {
    if (typeof window === "undefined") return emptyValues;

    const searchParams = new URLSearchParams(window.location.search);

    return {
      source: searchParams.get("source") || searchParams.get("utm_source") || "",
      campaign: searchParams.get("campaign") || searchParams.get("utm_campaign") || "",
      medium: searchParams.get("medium") || searchParams.get("utm_medium") || "",
      ref: searchParams.get("ref") || document.referrer || "",
      pageUrl: window.location.href,
      userAgent: navigator.userAgent || "",
    };
  });

  return (
    <>
      <input suppressHydrationWarning type="hidden" name="source" value={values.source} />
      <input suppressHydrationWarning type="hidden" name="campaign" value={values.campaign} />
      <input suppressHydrationWarning type="hidden" name="medium" value={values.medium} />
      <input suppressHydrationWarning type="hidden" name="ref" value={values.ref} />
      <input suppressHydrationWarning type="hidden" name="pageUrl" value={values.pageUrl} />
      <input suppressHydrationWarning type="hidden" name="userAgent" value={values.userAgent} />
    </>
  );
}
