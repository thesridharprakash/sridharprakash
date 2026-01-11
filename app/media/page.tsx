import Hero from "@/components/Hero";

export const metadata = {
  title: "Media | Sridhar Prakash",
  description:
    "Media coverage, public appearances, and official social media channels of Sridhar Prakash.",
};

export default function MediaPage() {
  return (
    <>
      <Hero
        title="Media & Public Outreach"
        subtitle="Press coverage, public communication, and official social platforms."
      />

      <main className="bg-white px-6 py-16">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* PRESS COVERAGE */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900">
              Press Coverage
            </h2>

            <div className="w-12 h-1 bg-orange-600 my-4"></div>

            <div className="space-y-4">
              <a
                href="#"
                target="_blank"
                className="block border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
              >
                <p className="font-medium text-gray-900">
                  Community Engagement Initiative in Bengaluru
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  The Hindu • Jan 2025
                </p>
              </a>

              <a
                href="#"
                target="_blank"
                className="block border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
              >
                <p className="font-medium text-gray-900">
                  Citizen-first Governance Model Explained
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Deccan Herald • Dec 2024
                </p>
              </a>

              <p className="text-sm text-gray-500">
                More coverage will be added as updates become available.
              </p>
            </div>
          </section>

          {/* SOCIAL MEDIA */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900">
              Official Social Media
            </h2>

            <div className="w-12 h-1 bg-orange-600 my-4"></div>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              <a
                href="https://instagram.com/"
                target="_blank"
                className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition"
              >
                <p className="font-semibold text-gray-900">Instagram</p>
                <p className="text-sm text-gray-600 mt-1">
                  Photos & updates
                </p>
              </a>

              <a
                href="https://x.com/"
                target="_blank"
                className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition"
              >
                <p className="font-semibold text-gray-900">X (Twitter)</p>
                <p className="text-sm text-gray-600 mt-1">
                  Public statements
                </p>
              </a>

              <a
                href="https://facebook.com/"
                target="_blank"
                className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition"
              >
                <p className="font-semibold text-gray-900">Facebook</p>
                <p className="text-sm text-gray-600 mt-1">
                  Community updates
                </p>
              </a>

              <a
                href="https://youtube.com/"
                target="_blank"
                className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition"
              >
                <p className="font-semibold text-gray-900">YouTube</p>
                <p className="text-sm text-gray-600 mt-1">
                  Videos & speeches
                </p>
              </a>
            </div>
          </section>

          {/* NOTE */}
          <section className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-600 max-w-2xl mx-auto">
              This page serves as the official source for verified media
              references and public communications. For updates and event
              announcements, please follow the official social media channels.
            </p>
          </section>

        </div>
      </main>
    </>
  );
}
