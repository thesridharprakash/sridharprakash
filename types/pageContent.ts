export type HighlightCard = {
  label: string;
  title: string;
  value: string;
  description: string;
};

export interface ContactPageContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  highlights: HighlightCard[];
  brief: {
    label: string;
    title: string;
    description: string;
  };
  collaborationTypes: string[];
  socialHeading: string;
  socialCtaLabel: string;
  socialCtaHref: string;
  success: {
    title: string;
    description: string;
  };
}

export type BookingHighlight = {
  label: string;
  title: string;
  description: string;
};

export type BookingFaq = {
  question: string;
  answer: string;
};

export interface BookPageContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  highlights: BookingHighlight[];
  bookingTypes: string[];
  bookingAreas: string[];
  faqHeading: string;
  bookingFaqs: BookingFaq[];
  form: {
    heading: string;
    introLinkLabel: string;
    introLinkHref: string;
    buttonLabel: string;
    successTitle: string;
    successDescription: string;
    successLinkLabel: string;
    successLinkHref: string;
  };
}

export type MediaKitEntry = {
  label: string;
  value: string;
};

export type FeaturedSeriesEntry = {
  title: string;
  type: string;
  image: string;
  description: string;
};

export interface MediaPageContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: {
      label: string;
      href: string;
      download?: boolean;
    };
    secondaryCta: {
      label: string;
      href: string;
    };
  };
  mediaKit: MediaKitEntry[];
  featuredSeries: FeaturedSeriesEntry[];
  deliverables: string[];
  liveSectionHeading: string;
  partnership: {
    title: string;
    description: string;
    badges: string[];
    ctaLabel: string;
    ctaHref: string;
  };
}

export type PressMention = {
  title: string;
  outlet: string;
  date: string;
  note: string;
  link?: string;
  mediaType?: "text" | "video" | "image";
  mediaUrl?: string;
  previewImage?: string;
};

export type MilestoneEntry = {
  title: string;
  date: string;
  detail: string;
};

export interface PressPageContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  interviews: PressMention[];
  mediaCoverage: PressMention[];
  guestAppearances: string[];
  awards: string[];
  milestones: MilestoneEntry[];
  pressQueryCta: {
    label: string;
    href: string;
  };
}

export type GalleryStat = {
  label: string;
  value: string;
};

export type GalleryCollection = {
  title: string;
  description: string;
  image: string;
  location: string;
  pieces: string;
};

export type GalleryStory = {
  title: string;
  format: string;
  detail: string;
};

export type GalleryTimelineEntry = {
  title: string;
  subtitle: string;
  date: string;
  note: string;
};

export interface GalleryPageContent {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    ctaPrimary: {
      label: string;
      href: string;
    };
    ctaSecondary: {
      label: string;
      href: string;
    };
    backgroundImage: string;
  };
  stats: GalleryStat[];
  featuredCollections: GalleryCollection[];
  immersiveStories: GalleryStory[];
  timeline: GalleryTimelineEntry[];
  cta: {
    headline: string;
    detail: string;
    primary: {
      label: string;
      href: string;
    };
    secondary: {
      label: string;
      href: string;
    };
  };
}

export type GalleryPost = {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  pieces: string;
  date: string;
};
