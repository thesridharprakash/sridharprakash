import GalleryEditorClient from "@/components/admin/GalleryEditorClient";
import ClientOnly from "@/components/ClientOnly";
import { readGalleryPosts } from "@/lib/galleryPosts";

type Props = {
  searchParams?: Promise<{ id?: string }>;
};

export default async function AdminGalleryNewPage({ searchParams }: Props) {
  const posts = readGalleryPosts();
  const resolvedSearchParams = await searchParams;
  const searchId = resolvedSearchParams?.id;
  const initialPost = searchId ? posts.find((post) => post.id === searchId) : null;

  return (
    <main className="min-h-screen bg-black/80 pb-20 pt-24 text-white">
      <section className="mx-auto max-w-5xl space-y-6 px-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Admin</p>
          <h1 className="text-4xl font-semibold">Gallery entry</h1>
          <p className="text-sm text-slate-300">
            Build multi-frame stories exactly like the articles workflow. Upload, save, and return to the index with one tap.
          </p>
        </header>
        <ClientOnly fallback={<p className="text-sm text-slate-400">Loading editor…</p>}>
          <GalleryEditorClient initialPost={initialPost ?? null} />
        </ClientOnly>
      </section>
    </main>
  );
}
