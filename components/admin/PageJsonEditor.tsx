"use client";

import { useCallback, useEffect, useState } from "react";

type Props = {
  title: string;
  description?: string;
  apiPath: string;
};

export default function PageJsonEditor({ title, description, apiPath }: Props) {
  const [jsonText, setJsonText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState("");

  const authFetch = useCallback(
    async (url: string, init: RequestInit = {}) => {
      const headers = {
        ...(init.headers ?? {}),
        ...(otpCode ? { "x-admin-otp": otpCode } : {}),
      };
      return fetch(url, { credentials: "include", ...init, headers });
    },
    [otpCode],
  );

  const loadContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    setStatusMessage(null);
    try {
      const response = await authFetch(apiPath);
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; data?: unknown; error?: string } | null;
      if (!response.ok || !payload?.data) {
        setError(payload?.error || "Unable to load content.");
        return;
      }
      setJsonText(JSON.stringify(payload.data, null, 2));
    } catch {
      setError("Network error while loading content.");
    } finally {
      setLoading(false);
    }
  }, [apiPath, authFetch]);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  const handleSave = async () => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      setError("Invalid JSON. Please fix the format before saving.");
      setStatusMessage(null);
      return;
    }

    setSaving(true);
    setError(null);
    setStatusMessage(null);

    try {
      const response = await authFetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok) {
        setError(payload?.error || "Unable to save content.");
        return;
      }
      setStatusMessage("Content saved successfully.");
    } catch {
      setError("Network error while saving content.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Page Editor</p>
            <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">{title}</h1>
            {description ? <p className="mt-1 text-sm text-slate-300">{description}</p> : null}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Authenticator Code</label>
            <input
              type="text"
              value={otpCode}
              onChange={(event) => setOtpCode(event.target.value)}
              placeholder="6-digit code"
              className="w-48 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/15 bg-black/25 p-6">
        <div className="mb-4 flex items-center justify-between gap-3 text-sm uppercase tracking-[0.3em] text-slate-400">
          <span>JSON payload</span>
          <button
            type="button"
            onClick={() => void loadContent()}
            className="rounded-full border border-white/20 px-4 py-1 text-xs text-white transition hover:border-white"
            disabled={loading}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        <textarea
          value={jsonText}
          onChange={(event) => setJsonText(event.target.value)}
          rows={24}
          className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm font-mono text-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
              saving
                ? "cursor-not-allowed bg-white/20 text-slate-400"
                : "bg-[var(--accent)] text-black hover:bg-[var(--accent-strong)]"
            }`}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          {statusMessage ? (
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">{statusMessage}</p>
          ) : null}
          {error ? <p className="text-xs uppercase tracking-[0.3em] text-rose-300">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
