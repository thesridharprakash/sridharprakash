"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { TotpSetupInfo } from "@/app/admin/types";

function AdminLoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [secret, setSecret] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totpInfo, setTotpInfo] = useState<TotpSetupInfo | null>(null);
  const [totpLoading, setTotpLoading] = useState(false);
  const [totpError, setTotpError] = useState<string | null>(null);
  const [totpCopyMessage, setTotpCopyMessage] = useState<string | null>(null);
  const totpCopyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, otp: otpCode }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok) {
        setError(payload?.error || "Invalid credentials or authenticator code.");
        return;
      }

      const target = searchParams.get("returnUrl") ?? "/admin/articles";
      router.replace(target);
    } catch {
      setError("Network error while creating admin session.");
    } finally {
      setLoading(false);
    }
  };

  const loadTotpInfo = useCallback(async () => {
    if (!secret.trim()) {
      setTotpError("Enter Admin Secret to load the authenticator QR.");
      setTotpInfo(null);
      return;
    }

    setTotpLoading(true);
    setTotpError(null);
    try {
      const response = await fetch("/api/admin/mfa/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      const payload = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            secret?: string;
            qrCode?: string;
            provisioningUri?: string;
            error?: string;
          }
        | null;

      if (!response.ok || !payload?.ok) {
        setTotpError(payload?.error || "Unable to load authenticator info.");
        setTotpInfo(null);
        return;
      }

      if (!payload.secret || !payload.qrCode) {
        setTotpError("Authenticator setup is not available yet.");
        setTotpInfo(null);
        return;
      }

      setTotpInfo({
        secret: payload.secret,
        qrCode: payload.qrCode,
        provisioningUri: payload.provisioningUri || "",
      });
    } catch {
      setTotpError("Unable to reach the authenticator setup service.");
      setTotpInfo(null);
    } finally {
      setTotpLoading(false);
    }
  }, [secret]);

  const copyTotpSecret = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setTotpCopyMessage("Authenticator secret copied.");
      if (totpCopyTimeoutRef.current) {
        clearTimeout(totpCopyTimeoutRef.current);
      }
      totpCopyTimeoutRef.current = setTimeout(() => setTotpCopyMessage(null), 2500);
    } catch {
      setTotpCopyMessage("Clipboard access denied.");
    }
  };

  useEffect(() => {
    return () => {
      if (totpCopyTimeoutRef.current) {
        clearTimeout(totpCopyTimeoutRef.current);
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#111827,_#050505)] py-16 px-4 text-white">
      <section className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-white/10 bg-black/50 p-8 shadow-2xl">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Admin Access</p>
          <h1 className="text-3xl font-semibold">Sign in to manage articles</h1>
          <p className="text-sm text-slate-300">
            Enter your admin secret and the current authenticator code. The MFA setup panel will show
            the QR/secret after you provide the admin password.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="admin-login-secret" className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Admin Secret
            </label>
            <input
              id="admin-login-secret"
              type="password"
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Set in ADMIN_ARTICLES_SECRET"
            />
          </div>
          <div>
            <label htmlFor="admin-login-otp" className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Authenticator Code
            </label>
            <input
              id="admin-login-otp"
              value={otpCode}
              onChange={(event) => setOtpCode(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="6-digit code"
              maxLength={6}
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <p className="text-[11px] text-slate-400">
              Codes rotate every 30 seconds; make sure your device clock is synced for reliable sign-in.
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold text-black transition ${
              loading ? "bg-white/30" : "bg-[var(--accent)] hover:bg-[var(--accent-strong)]"
            }`}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
          {error ? <p className="text-xs text-rose-300">{error}</p> : null}
        </form>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Multi-factor setup</p>
              <h2 className="text-lg font-semibold">Google Authenticator</h2>
            </div>
            <button
              type="button"
              onClick={() => void loadTotpInfo()}
              className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white"
            >
              Load QR
            </button>
          </div>
          {totpLoading ? (
            <p className="mt-3 text-xs text-slate-400">Loading authenticator info…</p>
          ) : totpError ? (
            <p className="mt-3 text-xs text-rose-300">{totpError}</p>
          ) : totpInfo ? (
            <div className="mt-4 grid gap-4 md:grid-cols-[130px_minmax(0,1fr)]">
              <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-black/30 p-3">
                <Image
                  src={totpInfo.qrCode}
                  alt="Scan this code with Google Authenticator"
                  width={138}
                  height={138}
                  unoptimized
                  className="h-32 w-32 rounded-xl object-contain"
                  loading="lazy"
                />
              </div>
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Manual secret</p>
                <div className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm font-semibold text-white">
                  {totpInfo.secret.match(/.{1,4}/g)?.join(" ") || totpInfo.secret}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void copyTotpSecret(totpInfo.secret)}
                    className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white transition hover:border-white"
                  >
                    Copy secret
                  </button>
                  {totpInfo.provisioningUri ? (
                    <a
                      href={totpInfo.provisioningUri}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white transition hover:border-white"
                    >
                      Open in authenticator
                    </a>
                  ) : null}
                </div>
                {totpCopyMessage ? (
                  <p className="text-[11px] text-emerald-400">{totpCopyMessage}</p>
                ) : null}
                <p className="text-xs text-slate-400">
                  Google Authenticator is free. Scan or paste the secret once, then come back here to log in.
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-xs text-slate-400">
              Load the QR after entering the admin secret to register a new device.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[radial-gradient(circle_at_top,_#111827,_#050505)] py-16 px-4 text-white"><section className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-black/50 p-8"><p className="text-sm text-slate-300">Loading admin login...</p></section></main>}>
      <AdminLoginPageInner />
    </Suspense>
  );
}
