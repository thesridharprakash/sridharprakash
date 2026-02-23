"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/about", label: "Story" },
  { href: "/press", label: "Press" },
  { href: "/events", label: "Events" },
  { href: "/articles", label: "Journal" },
  { href: "/gallery", label: "Gallery" },
  { href: "/volunteer", label: "Volunteer" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const mobileNavId = "mobile-primary-nav";
  const mobileNavRef = useRef(null);
  const menuToggleRef = useRef(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const isAdminPath = mounted && pathname?.startsWith("/admin");

  useEffect(() => {
    if (!mounted || isAdminPath) return;

    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAdminPath, mounted]);

  useEffect(() => {
    if (!mounted || isAdminPath || !open) return;

    const navElement = mobileNavRef.current;
    if (!navElement) return;

    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableElements = navElement.querySelectorAll(focusableSelector);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (firstFocusable) {
      firstFocusable.focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuToggleRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || focusableElements.length === 0) {
        return;
      }

      const activeElement = document.activeElement;
      if (event.shiftKey && activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAdminPath, mounted, open]);

  if (!mounted || isAdminPath) {
    return null;
  }

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

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`text-xs uppercase tracking-[0.16em] transition-colors ${
                  isActive ? "text-[var(--accent)]" : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/book"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-[var(--accent-strong)]"
          >
            Work With Me
          </Link>
        </nav>

        <button
          ref={menuToggleRef}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="space-y-1.5 p-2 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={mobileNavId}
          aria-haspopup="menu"
          suppressHydrationWarning
        >
          <span className="block h-0.5 w-6 bg-white" />
          <span className="block h-0.5 w-6 bg-white" />
          <span className="block h-0.5 w-6 bg-white" />
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl px-2 md:hidden">
          <nav
            id={mobileNavId}
            ref={mobileNavRef}
            aria-label="Mobile primary"
            className="rounded-2xl border border-white/20 bg-[#020817]/95 p-4 shadow-xl backdrop-blur"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`block rounded-lg px-3 py-3 text-xs uppercase tracking-[0.18em] ${
                    isActive ? "bg-white/10 text-[var(--accent)]" : "text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="mt-3 block rounded-lg bg-[var(--accent)] px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-black"
            >
              Work With Me
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
