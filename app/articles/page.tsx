import ArticlesClient from "./ArticlesClient";

export const metadata = {
  title: "Articles | Sridhar Prakash",
  description:
    "Articles and reflections on public service, governance, and nation-first development.",
};

export default function ArticlesPage() {
  const articles = [
    {
      title: "Why Public Service Matters",
      summary:
        "Public service is about integrity, responsibility, and putting citizens first. This article explores why ethical leadership matters today.",
      date: "15 January 2025",
      link: "https://www.ndtv.com/india-news/why-ajit-doval-does-not-use-a-mobile-phone-internet-10647819?pfrom=home-ndtv_topstories_lastestImg",
    },
    {
      title: "Nation-First Development",
      summary:
        "Development must empower citizens, strengthen institutions, and focus on long-term national interest.",
      date: "10 January 2025",
      link: "https://docs.google.com/document/d/YOUR_GOOGLE_DOC_ID",
    },
  ];

  return <ArticlesClient articles={articles} />;
}
