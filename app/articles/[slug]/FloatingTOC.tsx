"use client";

import { useEffect, useState } from "react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

export default function FloatingTOC() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-30% 0px -60% 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  if (!headings.length) return null;

  return (
    <aside className="hidden xl:block fixed right-6 top-32 w-64">
      <div className="rounded-lg border p-4 bg-white shadow-sm">
        <p className="mb-3 text-sm font-semibold text-gray-700">
          On this page
        </p>

        <ul className="space-y-2 text-sm">
          {headings.map((h) => (
            <li
              key={h.id}
              className={`cursor-pointer transition-colors ${
                activeId === h.id
                  ? "text-orange-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              } ${h.level === 3 ? "ml-4" : ""}`}
              onClick={() =>
                document
                  .getElementById(h.id)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {h.text}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
