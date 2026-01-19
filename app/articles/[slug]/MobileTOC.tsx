"use client";

import { useEffect, useState } from "react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

export default function MobileTOC() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll("article h2, article h3")
    ) as HTMLHeadingElement[];

    const mapped: Heading[] = elements.map((el, index) => {
      if (!el.id) {
        el.id = `heading-${index}`;
      }

      return {
        id: el.id,
        text: el.textContent ?? "",
        level: Number(el.tagName.replace("H", "")),
      };
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(mapped);
  }, []);

  if (!headings.length) return null;

  return (
    <div className="xl:hidden fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-full bg-orange-600 text-white px-4 py-2 shadow-lg"
      >
        Contents
      </button>

      {open && (
        <div className="absolute bottom-14 right-0 w-72 max-h-[60vh] overflow-auto rounded-lg border bg-white shadow-xl p-4">
          <p className="mb-3 font-semibold text-sm text-gray-700">
            On this page
          </p>

          <ul className="space-y-2 text-sm">
            {headings.map((h) => (
              <li
                key={h.id}
                className={`cursor-pointer text-gray-700 hover:text-orange-600 ${
                  h.level === 3 ? "ml-4" : ""
                }`}
                onClick={() => {
                  document
                    .getElementById(h.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                  setOpen(false);
                }}
              >
                {h.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
