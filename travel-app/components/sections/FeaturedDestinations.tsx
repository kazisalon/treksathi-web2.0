'use client';

import { useState } from 'react';
import { Heart, MapPin, Star, Users, Eye, TrendingUp, Award, Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { destinations } from '@/lib/data/destinations';
import Button from '@/components/ui/Button';

const FeaturedDestinations = () => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const toggleFavorite = (id: number) => {
    const updated = new Set(favorites);
    if (favorites.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setFavorites(updated);
  };

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'Trending': return 'bg-gradient-to-r from-orange-500 to-red-500';
      case 'Top Rated': return 'bg-gradient-to-r from-yellow-500 to-amber-500';
      case 'Best Seller': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'New': return 'bg-gradient-to-r from-blue-500 to-indigo-500';
      case 'Hidden Gem': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case 'Trending': return <TrendingUp className="w-3 h-3" />;
      case 'Top Rated': return <Award className="w-3 h-3" />;
      case 'Best Seller': return <Star className="w-3 h-3 fill-current" />;
      case 'New': return <Sparkles className="w-3 h-3" />;
      case 'Hidden Gem': return <Eye className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
              <MapPin className="w-4 h-4" />
              Top Destinations
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Top Destinations
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Embark on a journey through Nepal's most breathtaking landscapes.
            From ancient temples to towering peaks, your adventure awaits.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => {
            const isFavorite = favorites.has(destination.id);
            const isHovered = hoveredCard === destination.id;

            return (
              <div
                key={destination.id}
                className="group relative"
                onMouseEnter={() => setHoveredCard(destination.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      className={`object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                    />

                    {/* Enhanced Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    {/* Enhanced Badge */}
                    {destination.badge && (
                      <div className={`absolute top-4 left-4 ${getBadgeColor(destination.badge)} text-white px-5 py-2.5 rounded-full text-xs font-extrabold flex items-center gap-2 shadow-2xl backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform duration-300`}>
                        {getBadgeIcon(destination.badge)}
                        <span>{destination.badge}</span>
                      </div>
                    )}

                    {/* Enhanced Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(destination.id)}
                      className="absolute top-4 right-4 w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:scale-125 hover:rotate-12 transition-all duration-300 border border-white/50"
                    >
                      <Heart
                        className={`w-6 h-6 transition-all duration-500 ${isFavorite
                          ? 'fill-red-500 text-red-500 animate-pulse'
                          : 'text-gray-600 hover:text-red-500'}`}
                      />
                    </button>

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">{destination.region}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 relative z-10">
                    <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-indigo-600 group-hover:to-purple-600 transition-all duration-300 leading-tight">
                      {destination.name}
                    </h3>
                    <p className="text-base text-gray-600 mb-5 leading-relaxed">
                      {destination.subtitle}
                    </p>

                    {/* Enhanced Stats */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold text-gray-900">{destination.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span className="text-sm font-medium">{destination.users}</span>
                        </div>
                      </div>
                      <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {destination.price}
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      icon={ArrowRight}
                      className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white"
                    >
                      Explore Destination
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Button variant="outline" icon={ArrowRight} className="mx-auto group px-10">
            View All Destinations
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;