"use client";

import { useState } from "react";

type Heading = {
  id: string;
  text: string;
};

type Props = {
  headings: Heading[];
  activeId: string | null;
};

export default function FloatingTOC({ headings, activeId }: Props) {
  const [open, setOpen] = useState(false);

  if (headings.length === 0) return null;

  return (
    <div className="hidden xl:block">
      {/* Floating Orange Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 bg-orange-600 text-white px-4 py-3 rounded-full shadow-lg text-sm font-medium"
        aria-label="Open table of contents"
      >
        content
      </button>

      {/* Floating TOC Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 max-h-[60vh] overflow-y-auto bg-white rounded-xl shadow-xl border">
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <span className="font-semibold text-sm">On this page</span>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 text-lg leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <ul className="px-4 py-3 space-y-2 text-sm">
            {headings.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  onClick={() => setOpen(false)}
                  className={`block ${
                    activeId === h.id
                      ? "text-orange-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
