'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Heart, Star } from 'lucide-react';
import Image from 'next/image';
import { locals } from '@/lib/data/locals';
import Button from '@/components/ui/Button';

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
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${hoveredCard === local.id ? 'opacity-100' : 'opacity-0'
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
                      {'expeditions' in local && local.expeditions && `${local.expeditions} expeditions`}
                      {'guests' in local && local.guests && `${local.guests} hosted`}
                      {'tours' in local && local.tours && `${local.tours} tours`}
                      {'workshops' in local && local.workshops && `${local.workshops} workshops`}
                      {'retreats' in local && local.retreats && `${local.retreats} retreats`}
                      {'safaris' in local && local.safaris && `${local.safaris} safaris`}
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
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${hoveredCard === local.id ? 'opacity-100' : 'opacity-0'
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
                          {'expeditions' in local && local.expeditions && `${local.expeditions} expeditions`}
                          {'guests' in local && local.guests && `${local.guests} hosted`}
                          {'tours' in local && local.tours && `${local.tours} tours`}
                          {'workshops' in local && local.workshops && `${local.workshops} workshops`}
                          {'retreats' in local && local.retreats && `${local.retreats} retreats`}
                          {'safaris' in local && local.safaris && `${local.safaris} safaris`}
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
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'
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
          <Button variant="secondary" className="px-8 py-4 text-lg">
            Meet Our Local Guides
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LocalsWhoInspire;