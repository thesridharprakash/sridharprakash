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
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-blue-900">
          {title}
        </h1>

        <div className="w-16 h-1 bg-orange-600 mx-auto my-6"></div>

        <p className="text-gray-700 text-base md:text-lg">
          {subtitle}
        </p>
      </motion.div>
    </section>
  );
}
