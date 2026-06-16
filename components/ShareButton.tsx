"use client";

import { useEffect, useState } from "react";
import { FiShare2 } from "react-icons/fi";

type ShareButtonProps = {
  title: string;
  description: string;
  url: string;
  iconOnly?: boolean;
  className?: string;
  ariaLabel?: string;
  onAction?: (action: "share" | "copy" | "error" | "click") => void;
};

export default function ShareButton({
  title,
  description,
  url,
  iconOnly = false,
  className = "",
  ariaLabel,
  onAction,
}: ShareButtonProps) {
  const [status, setStatus] = useState<null | "copied" | "error">(null);

  useEffect(() => {
    if (!status) return;
    const handle = window.setTimeout(() => setStatus(null), 2000);
    return () => window.clearTimeout(handle);
  }, [status]);

  const handleShare = async () => {
    onAction?.("click");
    try {
      if (navigator.share) {
        await navigator.share({ title, text: description, url });
        onAction?.("share");
      } else {
        await navigator.clipboard.writeText(url);
        setStatus("copied");
        onAction?.("copy");
      }
    } catch {
      setStatus("error");
      onAction?.("error");
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleShare}
        aria-label={ariaLabel ?? (iconOnly ? `Share ${title}` : undefined)}
        className={
          iconOnly
            ? `inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white transition hover:border-white/40 hover:bg-black/70 ${className}`
            : `rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/40 ${className}`
        }
      >
        {iconOnly ? <FiShare2 className="h-4 w-4" aria-hidden="true" /> : "Share"}
      </button>
      {status ? (
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-black/80 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white">
          {status === "copied" ? "Link copied" : "Try again"}
        </span>
      ) : null}
    </div>
  );
}
