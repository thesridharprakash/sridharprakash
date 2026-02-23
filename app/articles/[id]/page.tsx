import Link from "next/link";
import Image from "next/image";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { remark } from "remark";
import html from "remark-html";
import { getAllArticleSlugs, getArticleBySlug } from "../lib";

function getYouTubeEmbedUrl(input?: string) {
  if (!input) return "";
  try {
    const url = new URL(input);
    let videoId = "";
    if (url.hostname.includes("youtu.be")) {
      videoId = url.pathname.slice(1);
    } else if (url.searchParams.has("v")) {
      videoId = url.searchParams.get("v") ?? "";
    } else if (url.pathname.includes("/embed/")) {
      videoId = url.pathname.split("/embed/")[1].split("/")[0];
    }
    if (!videoId) return "";
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return "";
  }
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ id: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = getArticleBySlug(id);

  if (!article) {
    return {
      title: "Article Not Found",
      alternates: {
        canonical: `/articles/${id}`,
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: article.title,
    description: article.summary,
    alternates: {
      canonical: `/articles/${id}`,
    },
    openGraph: {
      title: `${article.title} | Sridhar Prakash`,
      description: article.summary,
      url: `/articles/${id}`,
      type: "article",
      images: [article.img || "/images/og-image.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | Sridhar Prakash`,
      description: article.summary,
      images: [article.img || "/images/og-image.jpg"],
    },
  };
}

export default async function ArticleDetail({ params }: PageProps) {
  const { id } = await params;
  const article = getArticleBySlug(id);

  if (!article || article.status === "draft") {
    notFound();
  }

  const processed = await remark().use(html).process(article.content);
  const contentHtml = processed.toString();

  return (
    <main className="min-h-screen bg-[#fcfaf8] pb-24 pt-12 text-[#1a1817] selection:bg-orange-100 md:pt-20">
      <article className="mx-auto max-w-4xl px-6">
        <header className="mb-12 text-center md:mb-16">
          <div className="mb-6 flex items-center justify-center space-x-3">
            <span className="h-px w-8 bg-orange-200" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">
              field note
            </span>
            <span className="h-px w-8 bg-orange-200" />
          </div>

          <h1 className="mb-6 text-4xl font-serif font-medium leading-[1.1] tracking-tight md:text-6xl">
            {article.title}
          </h1>

          <p className="mx-auto max-w-2xl text-xl font-serif italic leading-relaxed text-stone-500 md:text-2xl">
            &ldquo;{article.summary}&rdquo;
          </p>

          <div className="mt-8 text-[11px] font-bold uppercase tracking-widest text-stone-400">
            Published {article.date} | {article.readTime}
          </div>
          <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-500">
            Category: {article.category}
          </div>
        </header>

        {(() => {
          const embedUrl = getYouTubeEmbedUrl(article.videoUrl);
          if (embedUrl) {
            return (
              <section className="mb-12">
                <div className="overflow-hidden rounded-2xl border border-stone-200 bg-black">
                  <div className="aspect-video">
                    <iframe
                      src={embedUrl}
                      title="YouTube video"
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </div>
              </section>
            );
          }

          return (
            <section className="group relative mb-12">
              <div className="absolute -inset-4 -z-10 scale-95 rounded-3xl bg-stone-100/50 opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100" />
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-stone-200 bg-stone-900 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)]">
                <Image
                  src={article.img}
                  alt={article.title}
                  fill
                  className="object-cover opacity-85 transition-all duration-700 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-sm font-medium text-white">
                  {article.title}
                </div>
              </div>
            </section>
          );
        })()}
        {article.voiceUrl && (
          <section className="mb-10 rounded-2xl border border-stone-200 bg-white/80 p-4 text-sm text-stone-800">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-600">Voice Clip</p>
            <a
              href={article.voiceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-base font-semibold text-amber-600 underline decoration-dashed decoration-amber-400"
            >
              Listen to the voice clip
            </a>
          </section>
        )}

        <section
          className="article-prose prose prose-stone max-w-none text-stone-800 prose-p:font-serif prose-p:text-lg prose-p:leading-relaxed prose-headings:font-serif"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <nav className="pt-10">
          <Link
            href="/articles"
            className="group inline-flex items-center text-xs font-bold uppercase tracking-widest text-stone-400 transition-colors hover:text-orange-600"
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Field Journal
          </Link>
        </nav>
      </article>
    </main>
  );
}
