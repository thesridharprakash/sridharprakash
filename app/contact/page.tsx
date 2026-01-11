import Hero from "@/components/Hero";

export const metadata = {
  title: "Contact | Sridhar Prakash",
  description:
    "Get in touch with Sridhar Prakash for public engagement, community initiatives, and official communication.",
};

export default function ContactPage() {
  return (
    <>
      <Hero
        title="Contact"
        subtitle="Official communication and public engagement"
      />

      <main className="bg-white px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-14">

          {/* CONTACT INFO */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900">
              Get in Touch
            </h2>

            <div className="w-12 h-1 bg-orange-600 my-4"></div>

            <p className="text-gray-700 max-w-2xl">
              For public service initiatives, community engagement, or official
              communication, please use the contact details below. Our team
              reviews all messages and responds where appropriate.
            </p>
          </section>

          {/* DETAILS */}
          <section className="grid gap-8 md:grid-cols-2">

            {/* EMAIL */}
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
              <h3 className="font-semibold text-gray-900">
                Email
              </h3>
              <p className="mt-2 text-gray-700">
                <a
                  href="mailto:thesridharprakash@gmail.com"
                  className="text-orange-600 font-medium hover:underline"
                >
                  thesridharprakash@gmail.com
                </a>
              </p>
              <p className="mt-2 text-sm text-gray-500">
                For official communication only.
              </p>
            </div>

            {/* LOCATION */}
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
              <h3 className="font-semibold text-gray-900">
                Location
              </h3>
              <p className="mt-2 text-gray-700">
                Bengaluru, Karnataka
              </p>
              <p className="mt-2 text-sm text-gray-500">
                India
              </p>
            </div>

          </section>

          {/* SOCIAL */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Follow on Social Media
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <a
                href="https://instagram.com/sridhar_prakash"
                target="_blank"
                className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition"
              >
                Instagram
              </a>

              <a
                href="https://x.com/"
                target="_blank"
                className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition"
              >
                X (Twitter)
              </a>

              <a
                href="https://facebook.com/"
                target="_blank"
                className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition"
              >
                Facebook
              </a>

              <a
                href="https://youtube.com/@sridhar_prakash"
                target="_blank"
                className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition"
              >
                YouTube
              </a>
            </div>
          </section>

          {/* NOTE */}
          <section className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-600 max-w-2xl mx-auto text-sm">
              Please note: This platform is intended for constructive public
              engagement. Messages unrelated to public service initiatives may
              not receive a response.
            </p>
          </section>

        </div>
      </main>
    </>
  );
}
