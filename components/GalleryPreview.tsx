"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

type Props = {
  images: string[];
  title: string;
  description: string;
  location: string;
  date: string;
  pieces: string;
};

const HIGHLIGHT_TRANSITION = { duration: 0.45 };

export default function GalleryPreview({
  images,
  title,
  description,
  location,
  date,
  pieces,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = useMemo(() => images[activeIndex] || images[0], [images, activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="mb-10 space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-stone-900 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            className="relative h-[60vh] w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={HIGHLIGHT_TRANSITION}
          >
            <Image
              src={activeImage}
              alt={`${title} shot ${activeIndex + 1}`}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 space-y-2 text-left">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300">{location} · {date}</p>
              <h1 className="text-3xl font-serif font-semibold text-white md:text-5xl">{title}</h1>
              <p className="text-sm text-white/80 md:text-base">{description}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-y-0 left-4 flex items-center">
          <button
            type="button"
            onClick={handlePrev}
            className="rounded-full border border-white/30 bg-black/40 p-2 text-white transition hover:border-white"
          >
            <span className="sr-only">Previous image</span>
            <span className="text-lg">&#8592;</span>
          </button>
        </div>
        <div className="absolute inset-y-0 right-4 flex items-center">
          <button
            type="button"
            onClick={handleNext}
            className="rounded-full border border-white/30 bg-black/40 p-2 text-white transition hover:border-white"
          >
            <span className="sr-only">Next image</span>
            <span className="text-lg">&#8594;</span>
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`relative overflow-hidden rounded-2xl border ${
              activeIndex === index ? "border-amber-400" : "border-white/10"
            } bg-white/5 transition hover:border-white/40`}
          >
            <div className="relative h-28 w-full">
              <Image src={image} alt={`${title} preview ${index + 1}`} fill className="object-cover" sizes="25vw" />
            </div>
            <span className="absolute right-2 top-2 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.3em] text-white">
              {index + 1}
            </span>
          </button>
        ))}
      </div>

      {pieces ? (
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          {pieces}
        </div>
      ) : null}
    </section>
  );
}
