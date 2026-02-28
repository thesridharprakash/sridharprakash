import GalleryViewer from "@/components/GalleryViewer";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { readGalleryPosts } from "@/lib/galleryPosts";

export const dynamic = "force-dynamic";

type Params = { id: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const posts = readGalleryPosts();
  const post = posts.find((item) => item.id === id);
  if (!post) {
    return {
      title: "Gallery not found",
      description: "This gallery entry does not exist.",
    };
  }
  return {
    title: `${post.title} | Gallery`,
    description: post.description,
    alternates: { canonical: `/gallery/${post.id}` },
    openGraph: {
      title: `${post.title} | Gallery`,
      description: post.description,
      url: `/gallery/${post.id}`,
      images: [post.image || "/images/og-image.jpg"],
    },
  };
}

export default async function GalleryPostPage({ params }: { params: Params }) {
  const { id } = await params;
  const posts = readGalleryPosts();
  const post = posts.find((item) => item.id === id);
  if (!post) {
    notFound();
  }

  const galleryImages = [post.image, ...(post.images ?? [])].filter(Boolean);

  return (
    <main className="min-h-screen bg-[#fcfaf8] pb-24 pt-12 text-[#1a1817] selection:bg-orange-100 md:pt-20">
      <article className="mx-auto max-w-4xl px-6">
        <header className="mb-12 text-center md:mb-16">
          <div className="mb-6 flex items-center justify-center space-x-3">
            <span className="h-px w-8 bg-orange-200" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">
              gallery story
            </span>
            <span className="h-px w-8 bg-orange-200" />
          </div>

          <h1 className="mb-6 text-4xl font-serif font-medium leading-[1.1] tracking-tight md:text-6xl">
            {post.title}
          </h1>

          <p className="mx-auto max-w-2xl text-xl font-serif italic leading-relaxed text-stone-500 md:text-2xl">
            &ldquo;{post.description}&rdquo;
          </p>
        </header>

        <GalleryViewer images={galleryImages} title={post.title} />
        <div className="mt-6 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-stone-500">
          {post.location ? <span>{post.location}</span> : null}
          {post.date ? <span className="text-slate-400">· {post.date}</span> : null}
        </div>

        <nav className="pt-10">
          <Link
            href="/gallery"
            className="group inline-flex items-center text-xs font-bold uppercase tracking-widest text-stone-400 transition-colors hover:text-orange-600"
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Gallery
          </Link>
        </nav>
      </article>
    </main>
  );
}
