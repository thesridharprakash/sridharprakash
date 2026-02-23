import Link from "next/link";
import type { Metadata } from "next";
import pressContent from "@/data/pages/press.json";
import type { PressPageContent, PressMention } from "@/types/pageContent";

const pressData = pressContent as PressPageContent;
const { hero, interviews, mediaCoverage, guestAppearances, milestones, pressQueryCta } = pressData;
const coverageItems: PressMention[] = [...interviews, ...mediaCoverage];

export const metadata: Metadata = {
  title: "Press | Sridhar Prakash",
  description: hero.description,
  alternates: {
    canonical: "/press",
  },
};

const badgeStyles: Record<string, string> = {
  text: "border-white/20 bg-white/10 text-slate-200",
  video: "border-[#5bf4ff]/30 bg-[#5bf4ff]/10 text-[#cfefff]",
  image: "border-[#ffd166]/30 bg-[#ffd166]/10 text-[#FFE29F]",
};

export default function PressPage() {
  return (
    <main className="relative overflow-hidden text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_86%_12%,rgba(245,158,11,0.12),transparent_34%),radial-gradient(circle_at_10%_80%,rgba(56,189,248,0.12),transparent_38%)]" />

      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-12 pt-28 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">{hero.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">{hero.title}</h1>
        <p className="mt-4 text-base text-slate-300 md:text-lg">{hero.description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={pressQueryCta.href}
            className="rounded-full bg-[var(--accent)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-[var(--accent-strong)]"
          >
            {pressQueryCta.label}
          </Link>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {coverageItems.map((item, index) => (
            <article
              key={`${item.title}-${item.outlet}-${index}`}
              className="content-card flex h-full flex-col gap-4 p-6"
            >
              {item.previewImage ? (
                <div
                  className="h-44 w-full overflow-hidden rounded-2xl bg-slate-900"
                  style={{ backgroundImage: `url(${item.previewImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
                />
              ) : null}
              <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-slate-400">
                <span className={`rounded-full border px-3 py-1 ${badgeStyles[item.mediaType ?? "text"] ?? badgeStyles.text}`}>
                  {(item.mediaType ?? "text").toUpperCase()}
                </span>
                <span className="text-[var(--accent)]">{item.date}</span>
              </div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-slate-300">{item.note}</p>
              <div className="mt-auto flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.3em]">
                {item.link ? (
                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white transition hover:text-[var(--accent)]"
                  >
                    {item.mediaType === "video" ? "Watch video" : "Read article"}
                  </Link>
                ) : null}
                {item.mediaUrl && item.mediaUrl !== item.link ? (
                  <Link
                    href={item.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-200 transition hover:text-[var(--accent)]"
                  >
                    View media asset
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-12">
        <h2 className="text-lg font-semibold text-white">Guest appearances & recognitions</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {guestAppearances.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-20">
        <h2 className="text-lg font-semibold text-white">Milestones</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {milestones.map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)]">{item.date}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <div className="content-card flex flex-col gap-4 p-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">General Inquiry</p>
          <h2 className="text-2xl font-semibold text-white">Need to reach out directly?</h2>
          <p className="text-sm text-slate-300">
            Use this form for press kits, partnership ideas, or general questions that don’t fit the other channels. We respond within 24 hours.
          </p>
          <Link
            href="/volunteer"
            className="mx-auto rounded-full bg-[var(--accent)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-[var(--accent-strong)]"
          >
            Submit an inquiry
          </Link>
        </div>
      </section>
    </main>
  );
}
