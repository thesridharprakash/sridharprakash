"use client";

type Props = {
  url: string;
  title: string;
};

export default function StickyShareButtons({ url, title }: Props) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="hidden lg:flex fixed left-6 top-1/3 z-40 flex-col gap-3">
      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-11 h-11 flex items-center justify-center rounded-full bg-green-600 text-white shadow hover:scale-110 transition"
        aria-label="Share on WhatsApp"
      >
        🟢
      </a>

      {/* X */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-11 h-11 flex items-center justify-center rounded-full bg-black text-white shadow hover:scale-110 transition"
        aria-label="Share on X"
      >
        𝕏
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-11 h-11 flex items-center justify-center rounded-full bg-blue-600 text-white shadow hover:scale-110 transition"
        aria-label="Share on Facebook"
      >
        f
      </a>
    </div>
  );
}
