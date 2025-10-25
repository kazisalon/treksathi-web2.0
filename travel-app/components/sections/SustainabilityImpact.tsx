'use client';

import { Recycle, Leaf, Users, Heart, TreePine, Droplets, Sun, Mountain } from 'lucide-react';

const impactStats = [
  {
    id: 1,
    icon: Recycle,
    number: '1,200',
    label: 'Plastic Bottles Reduced',
    description: 'Through our refillable water initiative',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600'
  },
  {
    id: 2,
    icon: Sun,
    number: '30',
    label: 'Solar-Powered Homestays',
    description: 'Supporting clean energy in remote villages',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600'
  },
  {
    id: 3,
    icon: TreePine,
    number: '500+',
    label: 'Trees Planted',
    description: 'Reforestation efforts in trekking regions',
    color: 'from-green-600 to-teal-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
  },
  {
    id: 4,
    icon: Users,
    number: '150',
    label: 'Local Families Supported',
    description: 'Direct employment and fair wages',
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  {
    id: 5,
    icon: Heart,
    number: '25',
    label: 'Community Projects',
    description: 'Schools, clinics, and infrastructure',
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600'
  },
  {
    id: 6,
    icon: Droplets,
    number: '10',
    label: 'Clean Water Systems',
    description: 'Providing safe drinking water access',
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-600'
  }
];

const initiatives = [
  {
    title: 'Carbon Neutral Trekking',
    description: 'We offset 100% of our carbon emissions through verified reforestation projects',
    icon: Leaf,
    color: 'text-green-600'
  },
  {
    title: 'Local Community Support',
    description: 'Direct partnerships with local communities ensuring fair wages and cultural preservation',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    title: 'Waste Management',
    description: 'Zero-waste trekking policies with proper waste disposal and recycling programs',
    icon: Recycle,
    color: 'text-emerald-600'
  },
  {
    title: 'Wildlife Conservation',
    description: 'Supporting endangered species protection and habitat conservation efforts',
    icon: Mountain,
    color: 'text-purple-600'
  }
];

const SustainabilityImpact = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800 relative overflow-hidden">
      {/* Forest Silhouettes */}
      <div className="absolute inset-0 opacity-30">
        <svg className="absolute bottom-0 w-full h-40" viewBox="0 0 1200 160" fill="none">
          <path d="M0 160L50 120L100 140L150 100L200 130L250 90L300 120L350 80L400 110L450 70L500 100L550 60L600 90L650 50L700 80L750 40L800 70L850 30L900 60L950 20L1000 50L1050 10L1100 40L1150 0L1200 30V160H0Z" fill="currentColor"/>
        </svg>
      </div>
      
      {/* Organic Shapes */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-400 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 right-32 w-40 h-40 bg-emerald-400 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-teal-400 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-28 h-28 bg-green-300 rounded-full blur-xl"></div>
        
        {/* Leaf Shapes */}
        <div className="absolute top-32 left-1/3 w-16 h-8 bg-green-400/30 rounded-full rotate-45"></div>
        <div className="absolute bottom-40 right-1/4 w-12 h-6 bg-emerald-400/30 rounded-full -rotate-12"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">
            Sustainability & Impact
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Travel responsibly with us. Every journey creates positive impact for Nepal's communities and environment
          </p>
        </div>

        {/* Impact Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {impactStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.id}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-20 h-20 ${stat.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-10 h-10 ${stat.textColor}`} />
                </div>
                
                <div className="text-center">
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.number}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {stat.label}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Initiatives Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">
              Our Green Initiatives
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We're committed to making every adventure a force for good
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {initiatives.map((initiative, index) => {
              const IconComponent = initiative.icon;
              return (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-6 rounded-2xl hover:bg-slate-50 transition-colors duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <IconComponent className={`w-6 h-6 ${initiative.color}`} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">
                      {initiative.title}
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      {initiative.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Commitment Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 md:p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-6">
            Our Commitment to Nepal
          </h3>
          <p className="text-xl leading-relaxed mb-8 max-w-3xl mx-auto opacity-90">
            "We believe that responsible tourism is the key to preserving Nepal's natural beauty and cultural heritage for future generations. Every trek you take with us contributes to this mission."
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="opacity-90">Carbon Neutral</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">50%</div>
              <div className="opacity-90">Profits to Communities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">Zero</div>
              <div className="opacity-90">Waste Policy</div>
            </div>
          </div>

          <button className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-50 transform hover:scale-105 transition-all duration-300 shadow-lg">
            Learn More About Our Impact
          </button>
        </div>

        {/* Quote Section */}
        <div className="text-center mt-16">
          <blockquote className="text-2xl font-serif text-slate-700 italic mb-6 max-w-4xl mx-auto">
            "Take only memories, leave only footprints, but create lasting positive impact."
          </blockquote>
          <p className="text-slate-500">- TrekSathi Philosophy</p>
        </div>
      </div>
    </section>
  );
};

export default SustainabilityImpact;