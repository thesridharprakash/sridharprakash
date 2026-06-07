"use client";

import { FaWhatsapp } from "react-icons/fa";
import { trackEvent } from "@/lib/analytics";

const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/919880666751";

export default function QuickActionBar() {
  if (!whatsappUrl) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      onClick={() => trackEvent("quick_action_click", { label: "WhatsApp" })}
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--accent)]/45 bg-[#020817]/95 text-[var(--accent)] shadow-2xl shadow-black/35 backdrop-blur transition hover:-translate-y-1 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-black focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60 md:bottom-6 md:right-6 md:h-16 md:w-16"
    >
      <FaWhatsapp className="h-7 w-7 md:h-8 md:w-8" aria-hidden="true" />
    </a>
  );
}
