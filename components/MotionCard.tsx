"use client";

import { motion } from "framer-motion";

export default function MotionCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="bg-white border border-gray-200 rounded-xl p-6
                 hover:shadow-md transition"
    >
      {children}
    </motion.div>
  );
}
