import Hero from "@/components/Hero";

export const metadata = {
  title: "About | Sridhar Prakash",
  description:
    "Learn about Sridhar Prakash, his journey in public service, and his commitment to citizen-first governance.",
};

export default function AboutPage() {
  return (
    <>
      <Hero
        title="About Sridhar Prakash"
        subtitle="Public service rooted in integrity, discipline, and grassroots leadership."
      />

      <main className="bg-white px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* INTRO */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900">
              A Commitment to Public Service
            </h2>

            <div className="w-12 h-1 bg-orange-600 my-4"></div>

            <p className="text-gray-700 leading-relaxed">
              Sridhar Prakash is a public servant from Bengaluru, Karnataka,
              committed to citizen-first governance, nation-building, and
              development-driven leadership. His work focuses on connecting
              policy with people and ensuring that public systems work with
              transparency and accountability.
            </p>
          </section>

          {/* VALUES */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900">
              Core Values
            </h2>

            <div className="w-12 h-1 bg-orange-600 my-4"></div>

            <ul className="space-y-3 text-gray-700 list-disc list-inside">
              <li>Integrity and ethical public life</li>
              <li>Nation-first development approach</li>
              <li>Grassroots engagement and listening to citizens</li>
              <li>Efficient governance and accountability</li>
              <li>Empowering youth and community leadership</li>
            </ul>
          </section>

          {/* VISION */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900">
              Vision for Bengaluru
            </h2>

            <div className="w-12 h-1 bg-orange-600 my-4"></div>

            <p className="text-gray-700 leading-relaxed">
              The vision is to contribute towards a Bengaluru that is inclusive,
              well-governed, and future-ready — where citizens actively
              participate in decision-making and governance becomes responsive,
              transparent, and development-oriented.
            </p>
          </section>

          {/* CALL TO ACTION */}
          <section className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900">
              Get Involved
            </h3>

            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              Public service thrives when citizens participate. Whether through
              volunteering, attending events, or sharing ideas — your
              involvement matters.
            </p>

            <a
              href="/volunteer"
              className="inline-block mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-md font-medium transition"
            >
              Join as a Volunteer
            </a>
          </section>

        </div>
      </main>
    </>
  );
}
