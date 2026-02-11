"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/about", label: "Story" },
  { href: "/media", label: "Media" },
  { href: "/articles", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-6">
      <div
        className={`mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full border px-5 transition-all md:px-7 ${
          isScrolled || open
            ? "border-white/20 bg-[#020817]/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            : "border-white/10 bg-[#020817]/60"
        }`}
      >
        <Link href="/" className="font-display text-xl tracking-tight text-white">
          Sridhar Prakash
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs uppercase tracking-[0.16em] transition-colors ${
                  isActive ? "text-[var(--accent)]" : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/contact"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-[var(--accent-strong)]"
          >
            Book Me
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="space-y-1.5 p-2 md:hidden"
          aria-label="Toggle menu"
        >
          <span className="block h-0.5 w-6 bg-white" />
          <span className="block h-0.5 w-6 bg-white" />
          <span className="block h-0.5 w-6 bg-white" />
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl px-2 md:hidden">
          <div className="rounded-2xl border border-white/20 bg-[#020817]/95 p-4 shadow-xl backdrop-blur">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-3 text-xs uppercase tracking-[0.18em] ${
                    isActive ? "bg-white/10 text-[var(--accent)]" : "text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-3 block rounded-lg bg-[var(--accent)] px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-black"
            >
              Book Me
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
