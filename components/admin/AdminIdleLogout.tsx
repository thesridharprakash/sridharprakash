"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const WARNING_BEFORE_MS = 60 * 1000;

export default function AdminIdleLogout() {
  const router = useRouter();
  const pathname = usePathname();
  const warningTimeoutRef = useRef<number | null>(null);
  const logoutTimeoutRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const resetTimerRef = useRef<() => void>(() => {});
  const logoutNowRef = useRef<() => void>(() => {});
  const loggingOutRef = useRef(false);
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(WARNING_BEFORE_MS / 1000);

  useEffect(() => {
    if (!pathname?.startsWith("/admin") || pathname === "/admin/login") return;

    const clearTimers = () => {
      if (warningTimeoutRef.current !== null) {
        window.clearTimeout(warningTimeoutRef.current);
        warningTimeoutRef.current = null;
      }
      if (logoutTimeoutRef.current !== null) {
        window.clearTimeout(logoutTimeoutRef.current);
        logoutTimeoutRef.current = null;
      }
      if (countdownRef.current !== null) {
        window.clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
    logoutNowRef.current = () => {
      void logoutForInactivity();
    };

    const logoutForInactivity = async () => {
      if (loggingOutRef.current) return;
      loggingOutRef.current = true;
      clearTimers();
      setShowWarning(false);

      try {
        await fetch("/api/admin/logout", { method: "POST" });
      } catch {
        // Redirect to login even if the logout request fails.
      } finally {
        router.replace("/admin/login");
      }
    };

    const startWarningCountdown = () => {
      setShowWarning(true);
      setSecondsLeft(WARNING_BEFORE_MS / 1000);
      if (countdownRef.current !== null) {
        window.clearInterval(countdownRef.current);
      }
      countdownRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 1));
      }, 1000);
    };

    const resetTimer = () => {
      if (loggingOutRef.current) return;
      clearTimers();
      setShowWarning(false);
      setSecondsLeft(WARNING_BEFORE_MS / 1000);
      warningTimeoutRef.current = window.setTimeout(() => {
        startWarningCountdown();
      }, IDLE_TIMEOUT_MS - WARNING_BEFORE_MS);
      logoutTimeoutRef.current = window.setTimeout(() => {
        void logoutForInactivity();
      }, IDLE_TIMEOUT_MS);
    };
    resetTimerRef.current = resetTimer;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        resetTimer();
      }
    };

    const events: Array<keyof WindowEventMap> = [
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "focus",
    ];

    resetTimer();
    for (const eventName of events) {
      window.addEventListener(eventName, resetTimer, { passive: true });
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimers();
      for (const eventName of events) {
        window.removeEventListener(eventName, resetTimer);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname, router]);

  if (!showWarning || pathname === "/admin/login") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl border border-amber-300/30 bg-slate-950/95 p-5 text-white shadow-2xl">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">Session timeout warning</p>
        <h2 className="mt-2 text-lg font-semibold">You will be logged out for inactivity.</h2>
        <p className="mt-2 text-sm text-slate-300">
          No activity detected for 29 minutes. Auto logout in about {secondsLeft} second{secondsLeft === 1 ? "" : "s"}.
        </p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => resetTimerRef.current()}
            className="rounded-full bg-amber-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-amber-200"
          >
            Stay signed in
          </button>
          <button
            type="button"
            onClick={() => logoutNowRef.current()}
            className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white/40"
          >
            Log out now
          </button>
        </div>
      </div>
    </div>
  );
}
