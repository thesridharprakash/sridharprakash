export const metadata = {
  title: "Media | Sridhar Prakash",
  description:
    "Photos, videos, and media coverage of public interactions and initiatives in Bengaluru.",
};

export default function MediaPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-16">
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-900">
          Media
        </h1>

        <div className="w-16 h-1 bg-orange-600 mx-auto my-6"></div>

        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Photos, videos, and highlights from public meetings, community
          interactions, and development initiatives across Bengaluru.
        </p>

        {/* Photo Gallery */}
        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Photo Gallery
          </h2>
          <div className="w-12 h-1 bg-orange-600 mt-3 mb-8"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
       {
          image: "/media/photo1.jpg",
          title: "Community Interaction Meet",
          meta: "Bengaluru South • June 2025",
       },
       {
           image: "/media/photo2.jpg",
           title: "Volunteer Orientation Program",
           meta: "Central Bengaluru • June 2025",
        },
        {
           image: "/media/photo3.jpg",
           title: "Ward-level Meeting",
           meta: "Jayanagar • May 2025",
         },
       {
         image: "/media/photo4.jpg",
         title: "Public Outreach Drive",
         meta: "Basavanagudi • May 2025",
       },
      {
         image: "/media/photo5.jpg",
        title: "Youth Interaction Session",
        meta: "Bengaluru • April 2025",
        },
      {
          image: "/media/photo6.jpg",
           title: "Community Service Activity",
          meta: "Bengaluru • April 2025",
       },
        ].map((item, index) => (

              <div
  key={index}
  className="group overflow-hidden rounded-lg border bg-white transition hover:shadow-lg"
>
  <img
    src={item.image}
    alt={item.title}
    className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105"
    loading="lazy"
  />

  <div className="p-4 text-sm text-gray-700">
    <p className="font-medium text-gray-900">
      {item.title}
    </p>
    <p className="mt-1 text-gray-500">
      {item.meta}
    </p>
  </div>
</div>

                ))}
              </div>
              </section>

        {/* Videos */}
        <section className="mt-20">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Videos
          </h2>
          <div className="w-12 h-1 bg-orange-600 mt-3 mb-8"></div>

          <div className="grid gap-8 md:grid-cols-2">
            <iframe
              className="w-full aspect-video rounded-lg border"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
              title="Public Address"
              allowFullScreen
            ></iframe>

            <iframe
              className="w-full aspect-video rounded-lg border"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
              title="Community Interaction"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        {/* Social Media */}
        <section className="mt-20 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Follow on Social Media
          </h2>
          <div className="w-12 h-1 bg-orange-600 mx-auto mt-3 mb-8"></div>

          <div className="flex justify-center gap-8 text-sm font-medium">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:underline"
            >
              YouTube
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:underline"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:underline"
            >
              Instagram
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}
