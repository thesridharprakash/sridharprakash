import Hero from "@/components/Hero";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

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
              communication, please use the contact details below.
            </p>
          </section>

          {/* DETAILS */}
          <section className="grid gap-8 md:grid-cols-2">
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
              <h3 className="font-semibold text-gray-900">Email</h3>
              <p className="mt-2">
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

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
              <h3 className="font-semibold text-gray-900">Location</h3>
              <p className="mt-2 text-gray-700">Bengaluru, Karnataka</p>
              <p className="mt-2 text-sm text-gray-500">India</p>
            </div>
          </section>

          {/* SOCIAL MEDIA – SUBTLE BRAND HOVER */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Follow on Social Media
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              {/* Instagram */}
              <a
                href="https://instagram.com/sridhar_prakash"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group border border-gray-200 rounded-xl p-6 text-center
                  transition hover:shadow-md hover:border-pink-400
                "
              >
                <FaInstagram className="mx-auto h-7 w-7 text-gray-700 group-hover:text-pink-500 transition" />
                <p className="mt-3 font-medium text-gray-900">
                  Instagram
                </p>
              </a>

              {/* X */}
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group border border-gray-200 rounded-xl p-6 text-center
                  transition hover:shadow-md hover:border-gray-800
                "
              >
                <FaXTwitter className="mx-auto h-7 w-7 text-gray-700 group-hover:text-black transition" />
                <p className="mt-3 font-medium text-gray-900">
                  X (Twitter)
                </p>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com/sridhar.praksah"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group border border-gray-200 rounded-xl p-6 text-center
                  transition hover:shadow-md hover:border-blue-500
                "
              >
                <FaFacebookF className="mx-auto h-7 w-7 text-gray-700 group-hover:text-blue-600 transition" />
                <p className="mt-3 font-medium text-gray-900">
                  Facebook
                </p>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@sridhar_prakash"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group border border-gray-200 rounded-xl p-6 text-center
                  transition hover:shadow-md hover:border-red-500
                "
              >
                <FaYoutube className="mx-auto h-7 w-7 text-gray-700 group-hover:text-red-600 transition" />
                <p className="mt-3 font-medium text-gray-900">
                  YouTube
                </p>
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
