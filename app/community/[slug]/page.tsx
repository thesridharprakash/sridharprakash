import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import CommunityInitiativeForm from "./CommunityInitiativeForm";
import { communityInitiatives, getCommunityInitiative } from "../initiatives";

type CommunityInitiativePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return communityInitiatives.map((initiative) => ({ slug: initiative.slug }));
}

export async function generateMetadata({ params }: CommunityInitiativePageProps): Promise<Metadata> {
  const { slug } = await params;
  const initiative = getCommunityInitiative(slug);

  if (!initiative) {
    return {};
  }

  return {
    title: initiative.title,
    description: initiative.subtitle,
    keywords: initiative.keywords,
    alternates: {
      canonical: `/community/${initiative.slug}`,
    },
    openGraph: {
      title: initiative.title,
      description: initiative.subtitle,
      url: `/community/${initiative.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: initiative.title,
      description: initiative.subtitle,
    },
  };
}

export default async function CommunityInitiativePage({ params }: CommunityInitiativePageProps) {
  const { slug } = await params;
  const initiative = getCommunityInitiative(slug);

  if (!initiative) {
    notFound();
  }

  return (
    <main className="relative min-h-screen overflow-hidden pt-24 text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_10%,rgba(245,158,11,0.16),transparent_35%),radial-gradient(circle_at_10%_82%,rgba(56,189,248,0.14),transparent_42%)]" />

      <section className="relative mx-auto grid max-w-6xl gap-8 px-5 pb-10 pt-8 md:px-6 md:pb-14 md:pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <Link href="/community" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline">
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            Back to Community
          </Link>
          <p className="mt-5 inline-flex rounded-full border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            {initiative.eyebrow}
          </p>
          <h1 className="mt-5 font-display text-4xl leading-tight text-white md:text-6xl">{initiative.hero}</h1>
          <p className="mt-5 max-w-xl text-xl font-semibold text-slate-100 md:text-2xl">{initiative.title}</p>
          <p className="mt-3 max-w-xl text-base text-slate-300 md:text-lg">{initiative.subtitle}</p>

          <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
            <CheckCircleIcon className="h-7 w-7 text-[var(--accent)]" aria-hidden="true" />
            <p className="mt-3 text-sm text-slate-300">{initiative.description}</p>
          </div>
        </div>

        <div id="register" className="scroll-mt-28">
          <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
            <h2 className="font-display text-2xl text-white">Register your interest</h2>
            <p className="mt-1 text-sm text-slate-400">Quick mobile-friendly form for this participation area.</p>
          </div>
          <CommunityInitiativeForm initiative={initiative} />
        </div>
      </section>
    </main>
  );
}
