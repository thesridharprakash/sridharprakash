"use client";

import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export default function ClientOnly({ children, fallback = null }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!ready) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
