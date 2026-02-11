export const metadata = {
  title: "Impact | Sridhar Prakash",
  description:
    "Key initiatives and measurable outcomes across public engagement, governance, and community development.",
};

const initiatives = [
  {
    title: "Ward-Level Citizen Meetings",
    detail: "Direct issue collection with local follow-up across Bengaluru neighborhoods.",
  },
  {
    title: "Volunteer Mobilization",
    detail: "Structured on-ground support for outreach events and public service activities.",
  },
  {
    title: "Policy Awareness Drives",
    detail: "Accessible communication of governance updates and citizen rights.",
  },
];

export default function ImpactPage() {
  return (
    <main className="min-h-screen bg-[#f8f5f2] pt-24 md:pt-32 pb-20 px-6 text-[#332f2c]">
      <section className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#2d2a27] text-center">
          Public Impact
        </h1>
        <p className="text-center text-[#635c55] mt-6 max-w-2xl mx-auto">
          A concise view of ongoing work and outcomes from community-first efforts.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {initiatives.map((item) => (
            <article
              key={item.title}
              className="bg-white border border-[#e5e0da] p-6 shadow-sm"
            >
              <h2 className="text-xl font-serif font-bold text-[#2d2a27] mb-3">
                {item.title}
              </h2>
              <p className="text-sm text-[#635c55] leading-relaxed">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
