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
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose TrekSathi?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We're not just another travel company. We're your partners in creating extraordinary adventures that last a lifetime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              2,500+
            </div>
            <div className="text-gray-600 dark:text-gray-300 font-semibold">
              Trekkers Guided
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              25+
            </div>
            <div className="text-gray-600 dark:text-gray-300 font-semibold">
              Nepal Destinations
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
              8+
            </div>
            <div className="text-gray-600 dark:text-gray-300 font-semibold">
              Years in Nepal
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              4.8★
            </div>
            <div className="text-gray-600 dark:text-gray-300 font-semibold">
              TripAdvisor Rating
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;