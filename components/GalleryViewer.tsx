"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

type Props = {
  images: string[];
  title: string;
};

const DEFAULT_ASPECT_RATIO = 16 / 9;

type Size = {
  width: number;
  height: number;
};

export default function GalleryViewer({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(DEFAULT_ASPECT_RATIO);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const [thumbRatios, setThumbRatios] = useState<Record<string, number>>({});
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const safeImages = useMemo(() => (images.length ? images : ["/images/og-image.jpg"]), [images]);
  const total = safeImages.length;
  const activeImage = safeImages[activeIndex % total];

  useEffect(() => {
    if (!isTransitioning) return;
    const handle = window.setTimeout(() => setIsTransitioning(false), 400);
    return () => window.clearTimeout(handle);
  }, [activeIndex, isTransitioning]);

  const recalcSize = useCallback(() => {
    if (typeof window === "undefined") return;
    const maxHeight = Math.max(window.innerHeight * 0.72, 320);
    const maxWidth = Math.max(window.innerWidth * 0.92, 320);
    let width = Math.min(maxWidth, maxHeight * aspectRatio);
    let height = width / aspectRatio;
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }
    setSize({ width, height });
  }, [aspectRatio]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const schedule = () => window.requestAnimationFrame(recalcSize);
    schedule();
    window.addEventListener("resize", schedule);
    return () => window.removeEventListener("resize", schedule);
  }, [recalcSize]);

  const prev = () => {
    setIsTransitioning(true);
    setActiveIndex((value) => (value - 1 + total) % total);
  };
  const next = () => {
    setIsTransitioning(true);
    setActiveIndex((value) => (value + 1) % total);
  };

  const goToIndex = (index: number) => {
    setIsTransitioning(true);
    setActiveIndex(index);
    setIsViewerOpen(true);
  };

  const heroMarkup = (
    <div className="group relative overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-br from-stone-900 via-black/70 to-black/40 shadow-[0_60px_100px_-40px_rgba(0,0,0,0.7)]">
      <div
        className={`relative overflow-hidden rounded-3xl border border-white/5 bg-stone-900/60 transition-all duration-500`}
        style={{
          aspectRatio,
          height: `${size.height || 360}px`,
          width: `${size.width || 360}px`,
          maxHeight: "80vh",
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        <div className="absolute inset-0 bg-stone-900/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.1),_transparent_65%)] opacity-70 mix-blend-screen pointer-events-none" />
        <div className="relative h-full w-full flex items-center justify-center">
          <Image
            key={`${activeImage}-${activeIndex}`}
            src={activeImage}
            alt={`${title}: frame ${activeIndex + 1}`}
            fill
            className={`object-cover transition duration-700 ${isTransitioning ? "opacity-80 scale-[1.01]" : "opacity-100 scale-100"}`}
            sizes="(max-width: 768px) 100vw, 90vw"
            style={{ objectPosition: "center" }}
            onLoadingComplete={({ naturalHeight, naturalWidth }) => {
              if (naturalWidth && naturalHeight) {
                const ratio = naturalWidth / naturalHeight;
                const clamped = Math.min(Math.max(ratio, 1), 2);
                setAspectRatio(clamped);
              }
            }}
          />
        </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-90 pointer-events-none" />
      </div>
      <div className="absolute inset-y-0 left-0 flex items-center">
        <button
          type="button"
          onClick={prev}
          className="m-4 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
          aria-label="Previous image"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          type="button"
          onClick={next}
          className="m-4 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
          aria-label="Next image"
        >
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="absolute bottom-4 left-4 right-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>{title}</span>
          <span className="text-[10px] tracking-[0.4em] text-slate-200">{activeIndex + 1}/{total} frames</span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="space-y-6">
      {isViewerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8"
          onClick={() => setIsViewerOpen(false)}
        >
          <div className="relative" onClick={(event) => event.stopPropagation()}>
            {heroMarkup}
            <button
              type="button"
              onClick={() => setIsViewerOpen(false)}
              className="absolute right-6 top-6 rounded-full border border-white/30 bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white transition hover:border-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-4">
        {safeImages.map((image, index) => {
          const isActive = index === activeIndex;
          const ratio = thumbRatios[image] ?? 1;
          return (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => goToIndex(index)}
              className={`group relative overflow-hidden rounded-2xl border-2 p-0 transition-all duration-300 ${
                isActive
                  ? "border-[var(--accent)] shadow-[0_15px_35px_-15px_rgba(0,0,0,0.8)]"
                  : "border-white/10 hover:border-white/60 hover:shadow-[0_15px_35px_-20px_rgba(0,0,0,0.9)]"
              }`}
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-black/0 to-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-90" />
              <div
                className="relative w-full overflow-hidden rounded-2xl"
                style={{
                  aspectRatio: ratio,
                  minHeight: "110px",
                }}
              >
                <Image
                  src={image}
                  alt={`${title} thumbnail ${index + 1}`}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  onLoadingComplete={({ naturalHeight, naturalWidth }) => {
                    if (naturalHeight && naturalWidth) {
                      const thumbRatio = Math.min(Math.max(naturalWidth / naturalHeight, 1), 2);
                      setThumbRatios((prev) => {
                        if (prev[image] === thumbRatio) return prev;
                        return { ...prev, [image]: thumbRatio };
                      });
                    }
                  }}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-2xl" />
            </button>
          );
        })}
      </div>

    </section>
  );
}
