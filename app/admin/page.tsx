import Link from "next/link";
import fs from "fs";
import path from "path";
import { NewspaperIcon, PhotoIcon, DocumentTextIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { readGalleryPosts } from "@/lib/galleryPosts";
import { readPageContent } from "@/lib/pageContent";
import { readEventsArchive } from "@/lib/youtubeEvents";
import type { PressPageContent } from "@/types/pageContent";

const adminSections = [
  {
    title: "Articles",
    description: "Publish, edit, and preview journal entries with the same workflow you already use.",
    path: "/admin/articles",
    icon: DocumentTextIcon,
  },
  {
    title: "Press & Media",
    description: "Manage press coverage, interviews, and featured media stories from one screen.",
    path: "/admin/press",
    icon: NewspaperIcon,
  },
  {
    title: "Gallery",
    description: "Manage upcoming gallery content (placeholder page for now).",
    path: "/admin/gallery",
    icon: PhotoIcon,
  },
  {
    title: "Events Archive",
    description: "Store important past live streams so replay tiles remain visible on the Events page.",
    path: "/admin/events",
    icon: VideoCameraIcon,
  },
];

function countArticleFiles() {
  try {
    const articlesDir = path.join(process.cwd(), "content", "articles");
    return fs
      .readdirSync(articlesDir)
      .filter((file) => file.endsWith(".md"))
      .length;
  } catch {
    return 0;
  }
}

function getPressCoverageCount() {
  try {
    const pressData = readPageContent<PressPageContent>("press");
    return (pressData.interviews?.length ?? 0) + (pressData.mediaCoverage?.length ?? 0);
  } catch {
    return 0;
  }
}

export default async function AdminHomePage() {
  const articleCount = countArticleFiles();
  const pressCount = getPressCoverageCount();
  const galleryCount = readGalleryPosts().length;
  const eventsArchiveCount = readEventsArchive().length;
  const stats = [
    { label: "Journal entries", value: articleCount },
    { label: "Press/media items", value: pressCount },
    { label: "Gallery posts", value: galleryCount },
    { label: "Event archive", value: eventsArchiveCount },
  ];

  return (
    <main className="min-h-screen bg-black/80 py-16 text-white">
      <section className="mx-auto max-w-5xl space-y-6 px-6">
        <header className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Protected Admin</p>
          <h1 className="text-4xl font-semibold">Choose a section to edit</h1>
          <p className="text-sm text-slate-300">
            You must be signed in before accessing any section. After signing in, you can open an editor for articles, press, and gallery content.
          </p>
        </header>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-xl sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.title}
                href={section.path}
                className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/40 hover:bg-white/10"
              >
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-slate-400">
                  <span className="rounded-full border border-white/20 p-2 text-white transition group-hover:border-white">{<Icon className="h-5 w-5" />}</span>
                  <span>{section.title}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">{section.description}</p>
                <div className="mt-6 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Edit Section →</div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
