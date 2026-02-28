import { readGalleryPosts } from "@/lib/galleryPosts";
import { readFeaturedGalleryId } from "@/lib/galleryFeatured";
import GalleryAdminIndexClient from "@/components/admin/GalleryAdminIndexClient";

export default function AdminGalleryPage() {
  const posts = readGalleryPosts();
  const featuredId = readFeaturedGalleryId();

  return (
    <main className="min-h-screen bg-black/80 pb-20 pt-24 text-white">
      <section className="mx-auto max-w-5xl space-y-6 px-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Admin</p>
          <h1 className="text-4xl font-semibold">Manage Gallery</h1>
          <p className="text-sm text-slate-300">
            Review every upload, patrol drafts, and jump straight into the multi-image editor.
          </p>
        </header>
        <GalleryAdminIndexClient posts={posts} featuredId={featuredId} />
      </section>
    </main>
  );
}
