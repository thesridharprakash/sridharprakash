import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { readGalleryPosts } from "@/lib/galleryPosts";
import { readFeaturedGalleryId } from "@/lib/galleryFeatured";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse photos and visual updates from Sridhar Prakash's public events, community outreach, and local work.",
  alternates: {
    canonical: "/gallery",
  },
};

export default function GalleryPage() {
  const posts = readGalleryPosts();
  const sortedPosts = [...posts].sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));
  const featuredId = readFeaturedGalleryId();
  const featured =
    (featuredId ? posts.find((entry) => entry.id === featuredId) : null) ?? sortedPosts[0] ?? null;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.sridharprakash.in";
  const featuredImages = featured ? [featured.image, ...(featured.images ?? [])].filter(Boolean) : [];

  return (
    <main className="relative overflow-hidden pt-28 text-[var(--foreground)]">
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Gallery</p>
            <h1 className="font-display text-4xl text-white">Public work, community moments, and event highlights.</h1>
            <p className="mt-2 text-sm text-slate-300">
              A visual archive of Sridhar Prakash&apos;s outreach, youth engagement, public programs, and local community updates.
            </p>
          </div>
          <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
            {sortedPosts.length} uploads
          </div>
        </div>

        {featured ? (
          <section className="mb-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] content-card p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
            <div className="relative aspect-[4/2.6] overflow-hidden rounded-3xl border border-white/5 bg-black">
              <Image
                src={featuredImages[0] ?? featured.image ?? "/images/og-image.jpg"}
                alt={featured.title}
                fill
                className="object-cover transition duration-1000 ease-out hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">
                Featured update
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{featured.location || "Location TBD"}</p>
                <h2 className="text-3xl font-semibold text-white">{featured.title}</h2>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">{featured.description}</p>
              <div className="grid gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                <span>{featured.pieces || "Multiple frames"}</span>
                <span>{featured.date}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">
                <span>{featuredImages.length || 1} frames</span>
                <a href={`${baseUrl}/gallery/${featured.id}`} className="underline-offset-4 hover:underline">
                  View update
                </a>
              </div>
            </div>
          </section>
        ) : null}

        <GalleryGrid posts={sortedPosts} baseUrl={baseUrl} />
      </section>
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="content-card p-6 text-center text-sm text-slate-100">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">General inquiry</p>
          <p className="mt-2 text-base text-white">
            Want to share an event update, public concern, or community moment? Send a note and connect with Sridhar Prakash.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-[var(--accent-strong)]"
          >
            Contact
          </Link>
        </div>
      </section>
    </main>
  );
}
