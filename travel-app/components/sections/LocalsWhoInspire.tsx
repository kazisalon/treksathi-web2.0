'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Heart, Star } from 'lucide-react';
import Image from 'next/image';

const locals = [
  {
    id: 1,
    name: "Pemba Sherpa",
    role: "Mountain Guide",
    location: "Khumbu Valley",
    quote: "Every mountain has a story, and I'm here to share them with you.",
    story: "With 15 years of guiding experience, Pemba has led over 200 successful expeditions to Everest Base Camp. His deep knowledge of Sherpa culture and mountain safety makes every journey unforgettable.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
    specialties: ["High Altitude Trekking", "Sherpa Culture", "Mountain Safety"],
    rating: 4.9,
    expeditions: 200
  },
  {
    id: 2,
    name: "Sita Tamang",
    role: "Homestay Host",
    location: "Langtang Valley",
    quote: "Our home is your home. Come, let me share our traditions with you.",
    story: "Sita runs a traditional homestay where travelers experience authentic Tamang culture. Her warm hospitality and delicious local cuisine have touched hearts from around the world.",
    image: "https://images.unsplash.com/photo-1494790108755-2616c9c0e8e5?w=400&h=500&fit=crop&crop=face",
    specialties: ["Traditional Cooking", "Tamang Culture", "Organic Farming"],
    rating: 4.8,
    guests: 150
  },
  {
    id: 3,
    name: "Raj Thapa",
    role: "Cultural Guide",
    location: "Kathmandu Valley",
    quote: "History lives in every stone of our ancient cities.",
    story: "A passionate historian and cultural expert, Raj brings Nepal's rich heritage to life through his engaging storytelling and deep knowledge of art, architecture, and traditions.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
    specialties: ["Heritage Sites", "Art History", "Local Traditions"],
    rating: 4.9,
    tours: 300
  },
  {
    id: 4,
    name: "Maya Gurung",
    role: "Artisan & Weaver",
    location: "Pokhara",
    quote: "Each thread tells a story of our ancestors and their wisdom.",
    story: "Maya is a master weaver who creates beautiful traditional textiles. She teaches visitors the ancient art of Nepali weaving while sharing stories of Gurung culture.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face",
    specialties: ["Traditional Weaving", "Gurung Culture", "Handicrafts"],
    rating: 4.7,
    workshops: 80
  },
  {
    id: 5,
    name: "Tenzin Lama",
    role: "Spiritual Guide",
    location: "Mustang Region",
    quote: "In the silence of mountains, we find the voice of our soul.",
    story: "A Buddhist monk and meditation teacher, Tenzin guides spiritual journeys through ancient monasteries and sacred sites, offering insights into Tibetan Buddhism.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face",
    specialties: ["Meditation", "Buddhist Philosophy", "Sacred Sites"],
    rating: 4.9,
    retreats: 120
  },
  {
    id: 6,
    name: "Kamala Rai",
    role: "Wildlife Expert",
    location: "Chitwan National Park",
    quote: "Every creature in our jungle has a purpose and a story.",
    story: "Kamala is a wildlife conservationist and expert guide who has dedicated her life to protecting Nepal's biodiversity. Her passion for nature is truly infectious.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face",
    specialties: ["Wildlife Conservation", "Jungle Safari", "Bird Watching"],
    rating: 4.8,
    safaris: 250
  }
];

const LocalsWhoInspire = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(locals.length / 3));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(locals.length / 3)) % Math.ceil(locals.length / 3));
  };

  const getVisibleLocals = () => {
    const startIndex = currentIndex * 3;
    return locals.slice(startIndex, startIndex + 3);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-rose-900 via-orange-800 to-amber-700 relative overflow-hidden">
      {/* Modern Gradient Overlays */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-pink-600/30 via-orange-500/30 to-yellow-500/30 blur-2xl"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-rose-400/40 to-orange-600/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-amber-400/40 to-yellow-600/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-400/30 to-red-500/30 rounded-full blur-3xl"></div>
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-32 left-32 w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
        <div className="absolute top-60 right-40 w-4 h-4 bg-orange-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-40 w-2 h-2 bg-rose-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/3 w-3 h-3 bg-amber-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Modern Geometric Elements */}
        <div className="absolute top-20 right-20 w-16 h-16 border border-white/30 rotate-45 rounded-lg backdrop-blur-sm"></div>
        <div className="absolute bottom-32 left-32 w-12 h-12 border border-white/30 rounded-full backdrop-blur-sm"></div>
        <div className="absolute top-1/2 right-10 w-10 h-10 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rotate-12 rounded-lg backdrop-blur-sm"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">
            Locals Who Inspire
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Meet the heart and soul of Nepal - the incredible people who make every journey meaningful
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 mb-12">
          {locals.map((local) => (
            <div
              key={local.id}
              className="group relative"
              onMouseEnter={() => setHoveredCard(local.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                {/* Image */}
                <div className="relative overflow-hidden">
                  <Image
                    src={local.image}
                    alt={local.name}
                    width={400}
                    height={500}
                    className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
                    hoveredCard === local.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <p className="text-sm leading-relaxed mb-4 italic">
                        "{local.quote}"
                      </p>
                      <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors duration-300">
                        See Their Story
                      </button>
                    </div>
                  </div>

                  {/* Location Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                      <MapPin className="w-3 h-3 text-slate-600 mr-1" />
                      <span className="text-xs font-medium text-slate-700">{local.location}</span>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                      <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                      <span className="text-xs font-medium text-slate-700">{local.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    {local.name}
                  </h3>
                  
                  <p className="text-amber-600 font-medium mb-4">
                    {local.role}
                  </p>

                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {local.story}
                  </p>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {local.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>
                      {local.expeditions && `${local.expeditions} expeditions`}
                      {local.guests && `${local.guests} hosted`}
                      {local.tours && `${local.tours} tours`}
                      {local.workshops && `${local.workshops} workshops`}
                      {local.retreats && `${local.retreats} retreats`}
                      {local.safaris && `${local.safaris} safaris`}
                    </span>
                    <Heart className="w-4 h-4 text-red-400" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Slider */}
        <div className="lg:hidden">
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getVisibleLocals().map((local) => (
                <div
                  key={local.id}
                  className="group relative"
                  onMouseEnter={() => setHoveredCard(local.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <Image
                        src={local.image}
                        alt={local.name}
                        width={400}
                        height={500}
                        className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Overlay on Hover */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
                        hoveredCard === local.id ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                          <p className="text-sm leading-relaxed mb-4 italic">
                            "{local.quote}"
                          </p>
                          <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors duration-300">
                            See Their Story
                          </button>
                        </div>
                      </div>

                      {/* Location Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                          <MapPin className="w-3 h-3 text-slate-600 mr-1" />
                          <span className="text-xs font-medium text-slate-700">{local.location}</span>
                        </div>
                      </div>

                      {/* Rating Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                          <span className="text-xs font-medium text-slate-700">{local.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {local.name}
                      </h3>
                      
                      <p className="text-amber-600 font-medium mb-3">
                        {local.role}
                      </p>

                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        {local.story}
                      </p>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {local.specialties.slice(0, 2).map((specialty, index) => (
                          <span
                            key={index}
                            className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-medium"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>
                          {local.expeditions && `${local.expeditions} expeditions`}
                          {local.guests && `${local.guests} hosted`}
                          {local.tours && `${local.tours} tours`}
                          {local.workshops && `${local.workshops} workshops`}
                          {local.retreats && `${local.retreats} retreats`}
                          {local.safaris && `${local.safaris} safaris`}
                        </span>
                        <Heart className="w-4 h-4 text-red-400" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-slate-700" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors duration-300"
            >
              <ChevronRight className="w-6 h-6 text-slate-700" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(locals.length / 3) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-6 italic">
            "Travel is not just about places, it's about the people who make them special."
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transform hover:scale-105 transition-all duration-300 shadow-lg">
            Meet Our Local Guides
          </button>
        </div>
      </div>
    </section>
  );
};

export default LocalsWhoInspire;