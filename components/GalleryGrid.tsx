"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { GalleryPost } from "@/lib/galleryPosts";
import ShareButton from "./ShareButton";

type FilterOption = {
  label: string;
  value: "all" | "30" | "7";
};

const FILTER_OPTIONS: FilterOption[] = [
  { label: "All time", value: "all" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 7 days", value: "7" },
];

type Props = {
  posts: GalleryPost[];
  baseUrl: string;
};

function matchesFilter(post: GalleryPost, filter: FilterOption["value"]) {
  if (filter === "all") return true;
  const days = Number(filter);
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - days);
  const postDate = new Date(post.date);
  return postDate >= threshold;
}

export default function GalleryGrid({ posts, baseUrl }: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterOption["value"]>("all");

  const filteredPosts = useMemo(
    () => posts.filter((post) => matchesFilter(post, activeFilter)),
    [posts, activeFilter],
  );

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setActiveFilter(option.value)}
            className={`rounded-full border px-4 py-1 text-[11px] uppercase tracking-[0.3em] transition ${
              activeFilter === option.value
                ? "border-white bg-white text-black"
                : "border-white/20 text-white/80 hover:border-white/60"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <p className="text-sm text-slate-400">No uploads match the selected date range.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5"
            >
              <Link
                href={`/gallery/${post.id}`}
                className="relative h-52 w-full"
                aria-label={`View ${post.title}`}
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              </Link>
              <div className="flex flex-1 flex-col gap-3 border-t border-white/5 p-5">
                <div>
                  <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                  <p className="mt-1 text-sm text-slate-300">{post.description}</p>
                </div>
                <div className="flex flex-wrap items-center justify-between text-[11px] uppercase tracking-[0.3em] text-slate-400">
                  <span>{post.location}</span>
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-slate-400">
                  <span>{post.pieces}</span>
                  <ShareButton
                    title={post.title}
                    description={post.description}
                    url={`${baseUrl}/gallery/${post.id}`}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
