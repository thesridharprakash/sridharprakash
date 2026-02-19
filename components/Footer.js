import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaTwitch } from "react-icons/fa6";
import { SiKick } from "react-icons/si";
import { socialProfiles } from "@/constants/socials";

const socialIcons = {
  YouTube: FaYoutube,
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  Twitch: FaTwitch,
  Kick: SiKick,
};

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#020817]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl text-white">Sridhar Prakash</p>
            <p className="mt-3 max-w-sm text-sm text-slate-300">
              Political campaign and IRL storyteller creating social media content, travel vlogs, and on-ground public coverage.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Explore</p>
            <div className="mt-3 space-y-2 text-sm">
              <Link href="/about" className="block text-slate-300 transition hover:text-white">Story</Link>
              <Link href="/media" className="block text-slate-300 transition hover:text-white">Media</Link>
              <Link href="/articles" className="block text-slate-300 transition hover:text-white">Journal</Link>
              <Link href="/volunteer" className="block text-slate-300 transition hover:text-white">Volunteer</Link>
              <Link href="/contact" className="block text-slate-300 transition hover:text-white">Contact</Link>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Social</p>
            <div className="mt-3 space-y-2 text-sm text-slate-300">
              {socialProfiles.map((social) => {
                const Icon = socialIcons[social.name];
                return (
                  <p key={social.name} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {social.name}: {social.handle}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5 text-xs text-slate-400">
          (c) {new Date().getFullYear()} Sridhar Prakash. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
