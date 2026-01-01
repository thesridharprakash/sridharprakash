export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
<section className="relative px-6 py-28 text-center overflow-hidden">
  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: "url('/hero.jpg')" }}
  ></div>

  {/* Overlay */}
  <div className="absolute inset-0 bg-white/85"></div>

  {/* Content */}
  <div className="relative max-w-3xl mx-auto">
     <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
     <span className="text-blue-900">Sridhar</span>{" "}
  <span className="text-orange-600">Prakash</span>
   </h1>


    <p className="mt-6 text-lg md:text-xl text-gray-700">
      Nation First &nbsp;•&nbsp; Development &nbsp;•&nbsp; Public Service
    </p>
    <p className="mt-2 text-base text-gray-600">
       ರಾಷ್ಟ್ರ ಮೊದಲು • ಅಭಿವೃದ್ಧಿ • ಸಾರ್ವಜನಿಕ ಸೇವೆ
    </p>

    <p className="mt-3 text-xs md:text-sm uppercase tracking-widest text-gray-500">
     Bengaluru, Karnataka
   </p>


    <div className="mt-10">
     <a
      href="#about-content"   
      className="inline-block bg-orange-600 text-white px-8 py-3 rounded-md font-medium hover:bg-orange-700 transition"
    >
      Know More
    </a>
  </div>

  </div>
</section>

{/* About Section */}  
<section id="about" className="px-6 py-20 md:py-28 bg-gray-50">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 tracking-tight">
      About
    </h2>

    <p
       id="about-content"
       className="scroll-mt-24 mt-6 text-gray-700 leading-relaxed text-base md:text-lg"
     >
      I am a public servant from Bengaluru, deeply committed to
      public service, clean governance, and nation-building. Inspired by
      the leadership and vision of the Bharatiya Janata Party, my journey
      in public life is driven by a strong belief in development-led
      politics and citizen-first governance.
    </p>

    <p className="mt-4 text-gray-700 leading-relaxed text-base md:text-lg">
      Karnataka, and Bengaluru in particular, represents India’s potential
      when innovation, infrastructure, and inclusive growth come together.
      My focus is to contribute meaningfully at the grassroots level while
      upholding the values of integrity, discipline, and service.
    </p>
  </div>
</section>

{/* Section Divider */}
<div className="w-16 h-1 bg-orange-600 mx-auto my-8"></div>




      {/* Vision Section */}
      <section id="vision" className="px-6 py-16 bg-gray-50">

        <div className="max-w-5xl mx-auto">
         <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 tracking-tight">
          Vision & Ideology
       </h2>



          <div className="mt-12 grid gap-8 md:grid-cols-2">
  <div className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-md transition">
    <div className="text-orange-600 text-2xl">🇮🇳</div>
    <h3 className="mt-4 text-lg font-semibold text-gray-900">
      Nation First
    </h3>
    <p className="mt-2 text-gray-700">
      A strong, united, and self-reliant India where national interest
      always comes before individual or political considerations.
    </p>
  </div>

  <div className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-md transition">
    <div className="text-orange-600 text-2xl">🏗️</div>
    <h3 className="mt-4 text-lg font-semibold text-gray-900">
      Development for All
    </h3>
    <p className="mt-2 text-gray-700">
      Inclusive and sustainable development that reaches every citizen,
      empowering youth, women, and marginalized communities.
    </p>
  </div>

  <div className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-md transition">
    <div className="text-orange-600 text-2xl">🛡️</div>
    <h3 className="mt-4 text-lg font-semibold text-gray-900">
      Clean & Accountable Governance
    </h3>
    <p className="mt-2 text-gray-700">
      Transparent, corruption-free governance focused on efficiency,
      service delivery, and trust between citizens and institutions.
    </p>
  </div>

  <div className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-md transition">
    <div className="text-orange-600 text-2xl">🤝</div>
    <h3 className="mt-4 text-lg font-semibold text-gray-900">
      Grassroots Leadership
    </h3>
    <p className="mt-2 text-gray-700">
      Strengthening communities by listening to citizens and working
      from the ground up in Karnataka and Bengaluru.
    </p>
  </div>
</div>

        </div>
      </section>
    </main>
  );
}
