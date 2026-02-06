'use client';

import { useState, useEffect } from 'react';
import { Heart, MapPin, Star, Users, Eye, TrendingUp, Award, Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const destinations = [
  {
    id: 1,
    name: "Himalayan Sunsets",
    subtitle: "Witness the golden glow on snow-capped peaks",
    region: "Kathmandu Valley",
    users: "1,500+",
    price: "Popular",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    featured: true,
    badge: "Trending"
  },
  {
    id: 2,
    name: "Sacred Temples of Kathmandu",
    subtitle: "Ancient spirituality meets vibrant culture",
    region: "Kathmandu Valley",
    users: "2,200+",
    price: "Recommended",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop",
    featured: true,
    badge: "Top Rated"
  },
  {
    id: 3,
    name: "Everest Base Camp",
    subtitle: "Stand at the foot of the world's highest peak",
    region: "Solukhumbu Region",
    users: "4,800+",
    price: "Adventure",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&h=600&fit=crop",
    featured: true,
    badge: "Best Seller"
  },
  {
    id: 4,
    name: "Annapurna Sanctuary",
    subtitle: "A natural amphitheater surrounded by giants",
    region: "Annapurna Region",
    users: "3,200+",
    price: "Recommended",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop",
    badge: "New"
  },
  {
    id: 5,
    name: "Upper Mustang Trails",
    subtitle: "Journey into the mythical last forbidden kingdom",
    region: "Upper Mustang",
    users: "1,800+",
    price: "Hidden Gem",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&h=600&fit=crop",
    badge: "Hidden Gem"
  },
  {
    id: 6,
    name: "Chitwan Wildlife Safari",
    subtitle: "Deep in the heart of sub-tropical jungles",
    region: "Chitwan National Park",
    users: "2,100+",
    price: "Wildlife",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&h=600&fit=crop"
  }
];


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
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-6 py-3 rounded-full">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Top Destinations</span>
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-serif">
            Top Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
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
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      className={`object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'
                        }`}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Badge */}
                    {destination.badge && (
                      <div className={`absolute top-4 left-4 ${getBadgeColor(destination.badge)} text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg`}>
                        {getBadgeIcon(destination.badge)}
                        <span>{destination.badge}</span>
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(destination.id)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
                    >
                      <Heart
                        className={`w-5 h-5 transition-all duration-300 ${isFavorite
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-600'
                          }`}
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
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {destination.name}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {destination.subtitle}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        {/* Rating */}
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold text-gray-900">{destination.rating}</span>
                        </div>

                        {/* Users */}
                        <div className="flex items-center gap-1 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span className="text-sm font-medium">{destination.users}</span>
                        </div>
                      </div>

                      {/* Price Badge */}
                      <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {destination.price}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group">
                      <span>Explore Destination</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <button className="px-10 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-600 transition-all duration-300 shadow-md hover:shadow-xl flex items-center gap-3 mx-auto group">
            <span>View All Destinations</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
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

export default FeaturedDestinations;