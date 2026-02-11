"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import {
  LinkIcon,
  MicrophoneIcon,
  ChevronLeftIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { allArticles } from "../../../constants/articles";

export default function ArticleDetail() {
  const params = useParams();
  const [activeShare, setActiveShare] = useState<string | null>(null);

  const article = useMemo(() => {
    const id = params?.id;
    if (!id) return null;
    return allArticles.find((a) => a.id === Number(id));
  }, [params]);

  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return allArticles
      .filter((a) => a.id !== article.id && a.type === article.type)
      .slice(0, 3);
  }, [article]);

  if (!params?.id) return <div className="h-screen flex items-center justify-center bg-[#f8f5f2] font-serif italic text-stone-400">Initializing...</div>;
  if (!article) return <div className="h-screen flex items-center justify-center bg-[#f8f5f2] font-serif italic text-stone-500">Article not found.</div>;

  const handleShare = (platform: string) => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(`Check out this: ${article.title}`);

    let shareUrl = "";
    switch (platform) {
      case "X":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case "FB":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "WA":
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case "COPY":
        navigator.clipboard.writeText(url);
        setActiveShare("COPY");
        setTimeout(() => setActiveShare(null), 2000);
        return;
    }
    if (shareUrl) window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#1a1817] pb-24 selection:bg-orange-100">
     
      {/* --- HERO SECTION --- */}
      <article className="max-w-4xl mx-auto px-6 pt-12 md:pt-20">
        <header className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <span className="h-px w-8 bg-orange-200" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">{article.type}</span>
            <span className="h-px w-8 bg-orange-200" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif font-medium leading-[1.1] mb-8 tracking-tight">
            {article.title}
          </h1>
          
          <p className="text-xl md:text-2xl font-serif italic text-stone-500 leading-relaxed max-w-2xl mx-auto">
            &ldquo;{article.summary}&rdquo;
          </p>
          
          <div className="mt-8 text-[11px] font-bold tracking-widest text-stone-400 uppercase">
            Published {article.date}
          </div>
        </header>

        {/* --- MEDIA PLAYER CONTAINER --- */}
        <section className="relative group">
          <div className="absolute -inset-4 bg-stone-100/50 rounded-3xl -z-10 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700" />
          
          <div className="relative aspect-video w-full rounded-2xl bg-stone-900 overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] border border-stone-200">
            {article.type === "video" ? (
              <iframe className="absolute inset-0 w-full h-full" src={article.videoUrl} title={article.title} allowFullScreen />
            ) : article.type === "audio" ? (
              <div className="relative w-full h-full flex flex-col justify-end bg-stone-900">
                <Image
                  src={article.img || "/images/placeholder.jpg"}
                  alt="Cover"
                  fill
                  className="object-cover opacity-50 mix-blend-luminosity group-hover:opacity-60 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-orange-600/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-2xl transform group-hover:scale-110 transition-transform">
                        <MicrophoneIcon className="w-10 h-10 text-white" />
                    </div>
                    <span className="mt-6 text-white/50 font-serif italic text-sm tracking-widest uppercase">Special Feature Audio</span>
                </div>

                <div className="relative z-20 w-full p-8 bg-black/40 backdrop-blur-xl border-t border-white/10">
                  <audio controls className="w-full h-10 accent-orange-600">
                    <source src={article.videoUrl} type="audio/mpeg" />
                  </audio>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-stone-700 italic font-serif text-xl bg-stone-50">
                Read full article below
              </div>
            )}
          </div>
        </section>

        {/* --- SOCIAL BAR --- */}
        <div className="mt-12 flex items-center justify-between border-y border-stone-200 py-6">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => handleShare("X")} 
              className="group flex items-center gap-2 text-stone-400 hover:text-black transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              <span className="text-[10px] font-bold uppercase tracking-tighter hidden sm:block">Share on X</span>
            </button>
            <button 
              onClick={() => handleShare("FB")} 
              className="group flex items-center gap-2 text-stone-400 hover:text-[#1877F2] transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </button>
          </div>

          <button 
            onClick={() => handleShare("COPY")} 
            className="relative flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-full transition-all text-stone-600"
          >
            {activeShare === "COPY" ? (
                <>
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    <span className="text-[11px] font-bold uppercase">Copied!</span>
                </>
            ) : (
                <>
                    <LinkIcon className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Copy Link</span>
                </>
            )}
          </button>
        </div>

        {/* --- ARTICLE CONTENT (Placeholder for actual text) --- */}
        <section className="mt-16 prose prose-stone max-w-none prose-headings:font-serif prose-p:font-serif prose-p:text-lg prose-p:leading-relaxed text-stone-800">
           {/* If you have article.content, map it here. Otherwise, these are styles for the body text. */}
           <p className="first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left">
             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
           </p>
        </section>
      </article>
         {/* --- NAVIGATION / BACK BUTTON --- */}
      <nav className="max-w-6xl mx-auto px-6 pt-8">
        <Link href="/articles" className="inline-flex items-center text-xs font-bold tracking-widest uppercase text-stone-400 hover:text-orange-600 transition-colors group">
          <ChevronLeftIcon className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Journal
        </Link>
      </nav>

      {/* --- FOOTER / RELATED --- */}
      <section className="max-w-6xl mx-auto px-6 mt-24 pt-16 border-t border-stone-200">
        <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-12 text-center text-stone-400">Continue Reading</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {relatedArticles.map((rel) => (
            <Link href={`/articles/${rel.id}`} key={rel.id} className="group">
              <div className="relative aspect-[4/5] mb-6 overflow-hidden bg-stone-200 rounded-lg">
                <Image src={rel.img || "/images/placeholder.jpg"} alt={rel.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
              </div>
              <h4 className="font-serif text-xl leading-tight group-hover:text-orange-600 transition-colors">{rel.title}</h4>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-stone-400">{rel.date}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
