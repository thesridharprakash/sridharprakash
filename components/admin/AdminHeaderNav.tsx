"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminSections = [
  { label: "Articles", path: "/admin/articles" },
  { label: "Press", path: "/admin/press" },
  { label: "Events", path: "/admin/events" },
  { label: "Gallery", path: "/admin/gallery" },
];

export default function AdminHeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em]">
      {adminSections.map((section) => {
        const isActive = pathname?.startsWith(section.path);
        return (
          <Link
            key={section.path}
            href={section.path}
            className={`rounded-full border px-3 py-1 transition ${
              isActive ? "border-white bg-white/10 text-white" : "border-white/40 text-slate-300 hover:border-white"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {section.label}
          </Link>
        );
      })}
    </nav>
  );
}
