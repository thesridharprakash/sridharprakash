export const metadata = {
  title: "Highlights | Sridhar Prakash",
  description: "Snapshots of projects, routines, and creative progress.",
};

const initiatives = [
  {
    title: "Weekend City Walks",
    detail: "Short walking routes across Bengaluru to collect visuals, ambient sound, and stories.",
  },
  {
    title: "Creator Collabs",
    detail: "Small collaborations with photographers, editors, and indie creators.",
  },
  {
    title: "Daily Output Rhythm",
    detail: "Consistent posting and editing routines focused on quality over noise.",
  },
];

export default function ImpactPage() {
  return (
    <main className="min-h-screen bg-[#f8f5f2] px-6 pb-20 pt-24 text-[#332f2c] md:pt-32">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-center font-serif text-4xl font-bold text-[#2d2a27] md:text-6xl">Life Highlights</h1>
        <p className="mx-auto mt-6 max-w-2xl text-center text-[#635c55]">A quick view of what I am building and documenting this season.</p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {initiatives.map((item) => (
            <article key={item.title} className="border border-[#e5e0da] bg-white p-6 shadow-sm">
              <h2 className="mb-3 font-serif text-xl font-bold text-[#2d2a27]">{item.title}</h2>
              <p className="text-sm leading-relaxed text-[#635c55]">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
