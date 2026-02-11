'use client';

import { Shield, Users, Globe, Leaf, DollarSign, Target, Award, TrendingUp, Star, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: "Local Sherpa Guides",
    description: "Experienced Sherpa and local guides with deep knowledge of Nepal's mountains, culture, and hidden gems.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50"
  },
  {
    icon: Shield,
    title: "Safety First",
    description: "Comprehensive safety protocols, emergency evacuation insurance, and 24/7 support throughout your Nepal adventure.",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50"
  },
  {
    icon: Globe,
    title: "Cultural Immersion",
    description: "Authentic experiences with local families, monastery visits, and traditional ceremonies you won't find elsewhere.",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50"
  },
  {
    icon: Leaf,
    title: "Eco-Responsible",
    description: "Supporting local communities and environmental conservation while minimizing our footprint in the Himalayas.",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50"
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "No hidden fees. All permits, guides, accommodation, and meals clearly outlined with best value guarantee.",
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-50"
  },
  {
    icon: Target,
    title: "Custom Adventures",
    description: "From gentle cultural tours to extreme mountain expeditions - every itinerary crafted for your fitness and interests.",
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50"
  }
];

const stats = [
  {
    value: "2,500+",
    label: "Trekkers Guided",
    icon: Users,
    color: "text-blue-600"
  },
  {
    value: "25+",
    label: "Destinations",
    icon: Globe,
    color: "text-purple-600"
  },
  {
    value: "8+",
    label: "Years in Nepal",
    icon: Award,
    color: "text-green-600"
  },
  {
    value: "4.8★",
    label: "TripAdvisor Rating",
    icon: Star,
    color: "text-yellow-600"
  }
];

const WhyChooseUs = () => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-blue-50/50 to-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Section Header */}
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
              <Award className="w-4 h-4" />
              Why Choose Us
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose TrekSathi?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're not just another travel company. We're your partners in creating extraordinary adventures that last a lifetime.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
              >
                <div>
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-sm`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-900 mb  -2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>

                  {/* Checkmark */}
                  <div className="mt-4 flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">Verified Service</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32" />

          <div className="relative z-10">
            {/* Stats Header */}
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our Track Record Speaks
              </h3>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                Numbers that showcase our commitment to excellence and customer satisfaction
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={index}
                    className="text-center group"
                  >
                    {/* Icon */}
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Value */}
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </div>

                    {/* Label */}
                    <div className="text-blue-100 font-semibold text-sm md:text-base">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trust Badges */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="flex flex-wrap items-center justify-center gap-8">
                <div className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-medium">Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-medium">24/7 Support</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-medium">Best Price Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-medium">Eco-Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Your Adventure?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied travelers who trusted us with their Nepal journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Explore All Tours
            </button>
            <button className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-600 transition-all duration-300 shadow-md">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default WhyChooseUs;