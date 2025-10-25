const features = [
  {
    icon: "🏔️",
    title: "Local Sherpa Guides",
    description: "Experienced Sherpa and local guides with deep knowledge of Nepal's mountains, culture, and hidden gems."
  },
  {
    icon: "🛡️",
    title: "Safety First",
    description: "Comprehensive safety protocols, emergency evacuation insurance, and 24/7 support throughout your Nepal adventure."
  },
  {
    icon: "🏛️",
    title: "Cultural Immersion",
    description: "Authentic experiences with local families, monastery visits, and traditional ceremonies you won't find elsewhere."
  },
  {
    icon: "🌱",
    title: "Eco-Responsible",
    description: "Supporting local communities and environmental conservation while minimizing our footprint in the Himalayas."
  },
  {
    icon: "💰",
    title: "Transparent Pricing",
    description: "No hidden fees. All permits, guides, accommodation, and meals clearly outlined with best value guarantee."
  },
  {
    icon: "🎯",
    title: "Custom Adventures",
    description: "From gentle cultural tours to extreme mountain expeditions - every itinerary crafted for your fitness and interests."
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 relative overflow-hidden">
      {/* Sunrise Mountain Silhouettes */}
      <div className="absolute inset-0 opacity-30">
        <svg className="absolute bottom-0 w-full h-48" viewBox="0 0 1200 200" fill="none">
          <path d="M0 200L100 150L200 180L300 120L400 160L500 100L600 140L700 80L800 120L900 60L1000 100L1100 40L1200 80V200H0Z" fill="currentColor"/>
        </svg>
      </div>
      
      {/* Sun Rays */}
      <div className="absolute top-20 right-20 w-32 h-32 opacity-20">
        <div className="absolute inset-0 bg-yellow-300 rounded-full"></div>
        <div className="absolute inset-2 bg-yellow-200 rounded-full"></div>
        <div className="absolute inset-4 bg-yellow-100 rounded-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
            Why Choose TrekSathi?
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            We're not just another travel company. We're your partners in creating extraordinary adventures that last a lifetime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group border border-white/20"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              2,500+
            </div>
            <div className="text-white/80 font-semibold">
              Trekkers Guided
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              25+
            </div>
            <div className="text-white/80 font-semibold">
              Nepal Destinations
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              8+
            </div>
            <div className="text-white/80 font-semibold">
              Years in Nepal
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              4.8★
            </div>
            <div className="text-white/80 font-semibold">
              TripAdvisor Rating
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;