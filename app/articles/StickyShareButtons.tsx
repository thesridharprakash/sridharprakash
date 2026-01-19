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
        {/* WhatsApp SVG */}
        <svg
          viewBox="0 0 32 32"
          className="w-6 h-6 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 0C7.2 0 0 7.2 0 16c0 2.8.7 5.4 2.1 7.8L0 32l8.4-2.2c2.3 1.3 4.9 2 7.6 2 8.8 0 16-7.2 16-16S24.8 0 16 0Zm0 29.3c-2.4 0-4.7-.6-6.7-1.9l-.5-.3-5 1.3 1.3-4.9-.3-.5A13.2 13.2 0 0 1 2.7 16C2.7 8.8 8.8 2.7 16 2.7S29.3 8.8 29.3 16 23.2 29.3 16 29.3Zm7.5-9.1c-.4-.2-2.4-1.2-2.8-1.3-.4-.1-.7-.2-1 .2s-1.1 1.3-1.3 1.6c-.2.2-.4.3-.8.1a10.8 10.8 0 0 1-3.2-2 12 12 0 0 1-2.2-2.8c-.2-.4 0-.6.2-.8.2-.2.4-.4.6-.6.2-.2.3-.4.4-.6.1-.2.1-.4 0-.6s-1-2.4-1.4-3.3c-.4-.9-.8-.8-1-.8h-.9c-.3 0-.6.1-.9.4s-1.2 1.2-1.2 2.9 1.3 3.4 1.5 3.6a15.5 15.5 0 0 0 6 5.3c.8.3 1.4.6 1.9.8.8.2 1.6.2 2.2.1.7-.1 2.4-1 2.7-1.9.3-.9.3-1.7.2-1.9-.1-.2-.4-.3-.8-.5Z" />
        </svg>
      </a>

      {/* X (Twitter) */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-11 h-11 flex items-center justify-center rounded-full bg-black text-white shadow hover:scale-110 transition"
        aria-label="Share on X"
      >
        {/* X SVG */}
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18.9 2H22l-7.3 8.3L23 22h-6.4l-5-6.6L5.8 22H2l7.8-8.9L1 2h6.5l4.5 6L18.9 2Zm-1.1 18h1.7L8.4 4h-1.8l11.2 16Z" />
        </svg>
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-11 h-11 flex items-center justify-center rounded-full bg-blue-600 text-white shadow hover:scale-110 transition"
        aria-label="Share on Facebook"
      >
        {/* Facebook SVG */}
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M22.7 0H1.3C.6 0 0 .6 0 1.3v21.3c0 .7.6 1.3 1.3 1.3h11.5v-9.3H9.7v-3.6h3.1V8.4c0-3.1 1.9-4.8 4.7-4.8 1.3 0 2.5.1 2.8.1v3.2h-1.9c-1.5 0-1.8.7-1.8 1.7v2.3h3.6l-.5 3.6h-3.1v9.3h6.1c.7 0 1.3-.6 1.3-1.3V1.3c0-.7-.6-1.3-1.3-1.3Z" />
        </svg>
      </a>
    </div>
  );
}
