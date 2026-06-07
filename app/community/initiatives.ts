export type CommunityInitiative = {
  slug: string;
  interest: string;
  eyebrow: string;
  title: string;
  hero: string;
  subtitle: string;
  description: string;
  cta: string;
  successMessage: string;
  keywords: string[];
  options: string[];
  messageLabel: string;
  messagePlaceholder: string;
  messageRequired?: boolean;
};

export const communityInitiatives: CommunityInitiative[] = [
  {
    slug: "seva-volunteers",
    interest: "Volunteer for seva activities",
    eyebrow: "Seva Volunteers",
    title: "Join Seva Volunteer Activities",
    hero: "Serve Bengaluru with disciplined community action",
    subtitle: "Register to support seva activities, resident outreach, and people-first public service programs.",
    description:
      "Help with local seva activities, resident support, outreach coordination, follow-up work, and community service efforts across Bengaluru.",
    cta: "Register as Seva Volunteer",
    successMessage: "Thank you for registering as a seva volunteer. Our team will contact you regarding upcoming community service opportunities.",
    keywords: ["Seva Volunteers Bengaluru", "Community Service Bengaluru", "Volunteer Public Service", "Resident Outreach"],
    options: [
      "I can support seva activities",
      "I can assist with resident coordination",
      "I can help during public programs",
      "I can support follow-up work",
      "I can volunteer on weekends",
    ],
    messageLabel: "How would you like to help?",
    messagePlaceholder: "Share your availability, locality, or the kind of seva activities you can support.",
  },
  {
    slug: "public-outreach",
    interest: "Support public outreach",
    eyebrow: "Public Outreach",
    title: "Support Public Outreach",
    hero: "Help residents stay connected and informed",
    subtitle: "Register to support public outreach, resident engagement, and clear community communication.",
    description:
      "Work with the team on outreach programs, local communication, resident meetings, information sharing, and constituency-level coordination.",
    cta: "Register for Outreach",
    successMessage: "Thank you for supporting public outreach. Our team will contact you regarding outreach programs and coordination opportunities.",
    keywords: ["Public Outreach Bengaluru", "Community Outreach", "Resident Engagement", "Public Communication"],
    options: [
      "I can help with resident outreach",
      "I can coordinate with local groups",
      "I can support information sharing",
      "I can help during public meetings",
      "I can assist with follow-up calls",
    ],
    messageLabel: "Outreach support details",
    messagePlaceholder: "Share your area, availability, or outreach support preferences.",
  },
  {
    slug: "local-concern",
    interest: "Share a local concern",
    eyebrow: "Local Concerns",
    title: "Share a Local Concern",
    hero: "Raise local issues for structured follow-up",
    subtitle: "Submit a local concern, civic issue, or resident request that needs attention from the team.",
    description:
      "Use this dedicated page to share civic concerns, location-specific issues, resident requests, and follow-up details clearly.",
    cta: "Submit Concern",
    successMessage: "Thank you for sharing your local concern. Our team will review the details and follow up where possible.",
    keywords: ["Local Concern Bengaluru", "Civic Issues Bengaluru", "Resident Request", "Community Follow Up"],
    options: [
      "Road or footpath issue",
      "Water or drainage concern",
      "Streetlight or safety concern",
      "Public facility concern",
      "Other local issue",
    ],
    messageLabel: "Local concern details",
    messagePlaceholder: "Describe the issue, exact location, and any useful follow-up details.",
    messageRequired: true,
  },
  {
    slug: "digital-updates",
    interest: "Help with digital updates",
    eyebrow: "Digital Updates",
    title: "Help with Digital Updates",
    hero: "Support clear, verified digital communication",
    subtitle: "Register to help with digital updates, content coordination, event information, and verified community communication.",
    description:
      "Support the team with digital communication, social updates, event information, content coordination, and responsible online outreach.",
    cta: "Register for Digital Support",
    successMessage: "Thank you for offering digital support. Our team will contact you regarding content and communication opportunities.",
    keywords: ["Digital Updates Bengaluru", "Community Communication", "Social Media Volunteer", "Digital Outreach"],
    options: [
      "I can help create digital updates",
      "I can support social media coordination",
      "I can help verify local information",
      "I can assist with event updates",
      "I can support content translation",
    ],
    messageLabel: "Digital support details",
    messagePlaceholder: "Share your skills, platforms, language support, or availability.",
  },
  {
    slug: "event-coordination",
    interest: "Event coordination support",
    eyebrow: "Event Coordination",
    title: "Support Event Coordination",
    hero: "Help community events run smoothly",
    subtitle: "Register to support event planning, venue coordination, volunteer management, and resident participation.",
    description:
      "Assist with public programs, resident meetings, community events, logistics, volunteer coordination, and on-ground execution.",
    cta: "Register for Event Support",
    successMessage: "Thank you for offering event coordination support. Our team will contact you regarding upcoming events and volunteer roles.",
    keywords: ["Event Coordination Bengaluru", "Community Events", "Volunteer Event Support", "Public Program Coordination"],
    options: [
      "I can help with event logistics",
      "I can coordinate volunteers",
      "I can support registration desks",
      "I can help with venue coordination",
      "I can assist during public programs",
    ],
    messageLabel: "Event support details",
    messagePlaceholder: "Share your event experience, area, availability, or preferred support role.",
  },
];

export function getCommunityInitiative(slug: string) {
  return communityInitiatives.find((initiative) => initiative.slug === slug);
}
