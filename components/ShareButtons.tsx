"use client";

import { FaWhatsapp, FaXTwitter, FaFacebookF, FaInstagram } from "react-icons/fa6";

type ShareButtonsProps = {
  title: string;
  slug: string;
};

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const url = `https://www.sridharprakash.in/articles/${slug}`;

  return (
    <div className="mt-12 border-t pt-6">
      <p className="text-sm font-semibold text-gray-700 mb-4">Share this article</p>

      <div className="flex gap-4 flex-wrap">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(title + " " + url)}`}
          target="_blank"
          className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2"
        >
          <FaWhatsapp /> WhatsApp
        </a>

        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${url}`}
          target="_blank"
          className="px-4 py-2 bg-black text-white rounded-md flex items-center gap-2"
        >
          <FaXTwitter /> X
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          target="_blank"
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
        >
          <FaFacebookF /> Facebook
        </a>

        <button
          onClick={() => {
            navigator.clipboard.writeText(url);
            alert("Link copied. Paste it on Instagram.");
          }}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md flex items-center gap-2"
        >
          <FaInstagram /> Instagram
        </button>
      </div>
    </div>
  );
}
