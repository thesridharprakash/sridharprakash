"use client";

import { motion } from "framer-motion";

export default function Hero({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f8f5f2] via-[#fbf7f2] to-white px-6 py-20">
      <div className="absolute -top-24 right-10 w-64 h-64 bg-orange-200/50 rounded-full blur-[120px]" />
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#2d2a27] tracking-tight">
          {title}
        </h1>

        <div className="w-16 h-1 bg-[#ff7000] mx-auto my-6"></div>

        <p className="text-[#635c55] text-base md:text-lg">
          {subtitle}
        </p>
      </motion.div>
    </section>
  );
}
