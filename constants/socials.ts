export type SocialProfile = {
  name: "YouTube" | "Facebook" | "Instagram" | "Twitch" | "Kick";
  handle: string;
  href?: string;
};

export const socialProfiles: SocialProfile[] = [
  { name: "YouTube", handle: "@sridhar_prakash", href: "https://www.youtube.com/@sridhar_prakash" },
  { name: "Facebook", handle: "Link coming soon" },
  { name: "Instagram", handle: "@sridhar_prakash", href: "https://instagram.com/sridhar_prakash" },
  { name: "Twitch", handle: "sridhar_prakash", href: "https://www.twitch.tv/sridhar_prakash" },
  { name: "Kick", handle: "sridhar-prakash", href: "https://kick.com/sridhar-prakash" },
];
