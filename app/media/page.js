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
          Moments from public interactions, grassroots engagement, and
          initiatives focused on development and public service.
        </p>
         
                {/* Social Media Links */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
  <a
    href="https://www.youtube.com/@sridhar_prakash"
    target="_blank"
    rel="noopener noreferrer"
    className="px-5 py-2 border rounded-full text-sm font-medium text-red-600 border-red-200 hover:bg-red-50 transition"
  >
    YouTube
  </a>

  <a
    href="https://www.facebook.com/doddabommasandra"
    target="_blank"
    rel="noopener noreferrer"
    className="px-5 py-2 border rounded-full text-sm font-medium text-blue-700 border-blue-200 hover:bg-blue-50 transition"
  >
    Facebook
  </a>

  <a
    href="https://www.instagram.com/sridhar_prakash"
    target="_blank"
    rel="noopener noreferrer"
    className="px-5 py-2 border rounded-full text-sm font-medium text-pink-600 border-pink-200 hover:bg-pink-50 transition"
  >
    Instagram
  </a>
      </div>

        {/* Media Grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          
          {/* Media Card */}
          <div className="border rounded-lg overflow-hidden hover:shadow-md transition">
            <img
              src="/media1.jpg"
              alt="Public interaction"
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <p className="text-sm text-gray-700">
                Interacting with citizens during a local outreach program in Bengaluru.
              </p>
            </div>
          </div>

          {/* Media Card */}
          <div className="border rounded-lg overflow-hidden hover:shadow-md transition">
            <img
              src="/media2.jpg"
              alt="Community meeting"
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <p className="text-sm text-gray-700">
                Community discussion on development priorities and civic issues.
              </p>
            </div>
          </div>

          {/* Media Card */}
          <div className="border rounded-lg overflow-hidden hover:shadow-md transition">
            <img
              src="/media3.jpg"
              alt="Public service activity"
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <p className="text-sm text-gray-700">
                Participating in a public service initiative with local volunteers.
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
