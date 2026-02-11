import { useEffect, useState } from "react";
import { Heading } from "../articles/types/types";

export default function useActiveHeading(headings: Heading[]) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const offsets = headings.map(h => {
        const el = document.getElementById(h.id);
        return { id: h.id, offset: el?.getBoundingClientRect().top ?? Infinity };
      });

      const current = offsets
        .filter(o => o.offset <= 100)
        .sort((a, b) => b.offset - a.offset)[0];

      if (current) setActiveId(current.id);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initialize

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  return activeId;
}
