import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  HandRaisedIcon,
  HeartIcon,
  MegaphoneIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import ShareButton from "@/components/ShareButton";
import { communityInitiatives } from "./initiatives";

export const metadata: Metadata = {
  title: "Community Participation | Volunteer with Sridhar Prakash",
  description:
    "Choose a dedicated community participation page for seva volunteering, public outreach, local concerns, digital updates, event coordination, or blood donation initiatives.",
  keywords: [
    "Community Participation Bengaluru",
    "Seva Volunteers",
    "Public Outreach",
    "Local Concerns",
    "Digital Updates",
    "Event Coordination",
    "Blood Donation Bengaluru",
  ],
  alternates: {
    canonical: "/community",
  },
};

const iconMap = {
  "seva-volunteers": HandRaisedIcon,
  "public-outreach": MegaphoneIcon,
  "local-concern": ChatBubbleLeftRightIcon,
  "digital-updates": BuildingOffice2Icon,
  "event-coordination": CalendarDaysIcon,
};

const participationLinks = [
  ...communityInitiatives
    .filter((initiative) => initiative.slug !== "local-concern")
    .map((initiative) => ({
    href: `/community/${initiative.slug}`,
    slug: initiative.slug,
    title:
      initiative.slug === "seva-volunteers"
        ? "Seva Activities"
        : initiative.slug === "public-outreach"
          ? "Public Outreach"
          : initiative.slug === "event-coordination"
            ? "Event Support"
            : "Digital Support",
    eyebrow: initiative.eyebrow,
    description: initiative.subtitle,
  })),
  {
    href: "/yuva-morcha",
    slug: "youth-participation",
    title: "Youth Participation",
    eyebrow: "Youth Participation",
    description: "Join youth-focused seva, discipline, civic awareness, and constructive community work.",
  },
  {
    href: "/blood-donation",
    slug: "blood-donation",
    title: "Join the Blood Donation Initiative",
    eyebrow: "Blood Donation Camps",
    description: "Register as a donor, volunteer, medical support volunteer, or organizer for blood donation initiatives.",
  },
];

export default function CommunityPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pt-28 text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_10%,rgba(56,189,248,0.16),transparent_34%),radial-gradient(circle_at_8%_80%,rgba(245,158,11,0.14),transparent_40%)]" />

      <section className="relative mx-auto max-w-6xl px-6 pb-10 pt-10">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Community Circle</p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-white md:text-7xl">
            Choose how you want to participate.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-slate-300 md:text-lg">
            Select a community participation option below. Each option now has a dedicated page and focused registration form.
          </p>
          <div className="mt-5">
            <ShareButton
              title="Community Participation"
              description="Join community participation initiatives with Sridhar Prakash."
              url={`${process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.sridharprakash.in"}/community`}
            />
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Community Participation Options</p>
              <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">Dedicated registration pages</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Click the option that matches your interest. This improves clarity and sends you to the right focused form.
              </p>
            </div>
            <UserGroupIcon className="h-12 w-12 text-[var(--accent)]" aria-hidden="true" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {participationLinks.map((item) => {
            const Icon = item.slug === "blood-donation" ? HeartIcon : item.slug === "youth-participation" ? UserGroupIcon : iconMap[item.slug as keyof typeof iconMap];

            return (
              <Link
                key={item.slug}
                href={item.href}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/[0.07]"
              >
                <Icon className="h-8 w-8 text-[var(--accent)]" aria-hidden="true" />
                <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{item.eyebrow}</p>
                <h3 className="mt-2 font-display text-2xl text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-slate-300">{item.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                  Open dedicated page
                  <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
