'use client';

import { useState } from 'react';
import { Mountain, Compass, Heart, Flower, ArrowRight, MapPin, Clock, Star, Users, CheckCircle, Sparkles, Trophy, Globe } from 'lucide-react';
import Image from 'next/image';

const travelerTypes = [
  {
    id: 'adventurer',
    title: 'Adventurer',
    icon: Mountain,
    description: 'Pushing limits and conquering peaks',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-500'
  },
  {
    id: 'cultural',
    title: 'Cultural Explorer',
    icon: Compass,
    description: 'Discovering traditions and heritage',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-500'
  },
  {
    id: 'relaxed',
    title: 'Leisure Traveler',
    icon: Heart,
    description: 'Enjoying scenic beauty at your pace',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    borderColor: 'border-green-500'
  },
  {
    id: 'spiritual',
    title: 'Spiritual Seeker',
    icon: Flower,
    description: 'Finding inner peace and wisdom',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-500'
  }
];

const recommendations = {
  adventurer: [
    {
      id: 1,
      title: "Everest Base Camp Trek",
      location: "Khumbu Region",
      duration: "14 days",
      difficulty: "Challenging",
      price: "$1,299",
      rating: 4.9,
      reviews: 1250,
      image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&h=400&fit=crop",
      highlights: ["Epic views", "High altitude", "Sherpa culture"],
      badge: "Best Seller"
    },
    {
      id: 2,
      title: "Annapurna Circuit Trek",
      location: "Annapurna Region",
      duration: "17 days",
      difficulty: "Challenging",
      price: "$1,199",
      rating: 4.8,
      reviews: 980,
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop",
      highlights: ["Diverse landscapes", "Thorong La Pass", "Hot springs"]
    },
    {
      id: 3,
      title: "Manaslu Circuit Trek",
      location: "Manaslu Region",
      duration: "16 days",
      difficulty: "Challenging",
      price: "$1,199",
      rating: 4.7,
      reviews: 620,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      highlights: ["Remote trails", "Larkya La Pass", "Untouched nature"],
      badge: "Hidden Gem"
    }
  ],
  cultural: [
    {
      id: 4,
      title: "Kathmandu Heritage Tour",
      location: "Kathmandu Valley",
      duration: "5 days",
      difficulty: "Easy",
      price: "$399",
      rating: 4.7,
      reviews: 840,
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop",
      highlights: ["UNESCO sites", "Ancient temples", "Living culture"],
      badge: "Top Rated"
    },
    {
      id: 5,
      title: "Newari Cultural Experience",
      location: "Bhaktapur & Patan",
      duration: "3 days",
      difficulty: "Easy",
      price: "$199",
      rating: 4.6,
      reviews: 520,
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop",
      highlights: ["Traditional cuisine", "Artisan workshops", "Ancient palaces"]
    },
    {
      id: 6,
      title: "Tharu Village Homestay",
      location: "Chitwan Plains",
      duration: "4 days",
      difficulty: "Easy",
      price: "$299",
      rating: 4.6,
      reviews: 380,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      highlights: ["Pottery making", "Traditional architecture", "Local festivals"]
    }
  ],
  relaxed: [
    {
      id: 7,
      title: "Pokhara Lake Retreat",
      location: "Pokhara Valley",
      duration: "4 days",
      difficulty: "Easy",
      price: "$349",
      rating: 4.5,
      reviews: 680,
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop",
      highlights: ["Lakeside relaxation", "Boating", "Mountain views"],
      badge: "Recommended"
    },
    {
      id: 8,
      title: "Nagarkot Sunrise Escape",
      location: "Kathmandu Valley",
      duration: "2 days",
      difficulty: "Easy",
      price: "$159",
      rating: 4.4,
      reviews: 420,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      highlights: ["Sunrise views", "Spa & wellness", "Nature walks"]
    },
    {
      id: 9,
      title: "Bandipur Heritage Walk",
      location: "Central Nepal",
      duration: "3 days",
      difficulty: "Easy",
      price: "$199",
      rating: 4.4,
      reviews: 310,
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop",
      highlights: ["Himalayan views", "Historic town", "Peaceful walks"]
    }
  ],
  spiritual: [
    {
      id: 10,
      title: "Gokyo Lakes Meditation Trek",
      location: "Everest Region",
      duration: "12 days",
      difficulty: "Moderate",
      price: "$1,099",
      rating: 4.8,
      reviews: 540,
      image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&h=400&fit=crop",
      highlights: ["Sacred lakes", "Morning meditation", "Spiritual guides"],
      badge: "New"
    },
    {
      id: 11,
      title: "Kopan Monastery Retreat",
      location: "Kathmandu",
      duration: "7 days",
      difficulty: "Easy",
      price: "$499",
      rating: 4.7,
      reviews: 380,
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop",
      highlights: ["Buddhist teachings", "Meditation practice", "Peaceful environment"]
    },
    {
      id: 12,
      title: "Muktinath Pilgrimage",
      location: "Mustang Region",
      duration: "10 days",
      difficulty: "Moderate",
      price: "$699",
      rating: 4.6,
      reviews: 290,
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop",
      highlights: ["Sacred temple", "Eternal flames", "Spiritual journey"]
    }
  ]
};

const PlanYourPath = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const handleTypeSelection = (typeId: string) => {
    setSelectedType(typeId === selectedType ? null : typeId);
  };

  const resetSelection = () => {
    setSelectedType(null);
  };

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
      case 'Best Seller': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'Top Rated': return 'bg-gradient-to-r from-yellow-500 to-amber-500';
      case 'Recommended': return 'bg-gradient-to-r from-blue-500 to-indigo-500';
      case 'Hidden Gem': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'New': return 'bg-gradient-to-r from-orange-500 to-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getIconForBadge = (badge?: string) => {
    switch (badge) {
      case 'Best Seller': return <Trophy className="w-3 h-3" />;
      case 'Top Rated': return <Star className="w-3 h-3 fill-current" />;
      case 'Recommended': return <CheckCircle className="w-3 h-3" />;
      case 'Hidden Gem': return <Sparkles className="w-3 h-3" />;
      case 'New': return <Globe className="w-3 h-3" />;
      default: return null;
    }
  };

  const currentRecommendations = selectedType
    ? recommendations[selectedType as keyof typeof recommendations]
    : [];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Section Header */}
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
              <Compass className="w-4 h-4" />
              Personalized Recommendations
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Plan Your Path
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Tell us what kind of traveler you are, and we'll curate the perfect Nepal experience just for you.
          </p>
        </div>

        {/* Traveler Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {travelerTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;

            return (
              <button
                key={type.id}
                onClick={() => handleTypeSelection(type.id)}
                className={`relative p-10 rounded-3xl border-2 transition-all duration-700 transform ${isSelected
                  ? `${type.borderColor} ${type.bgColor} scale-110 shadow-2xl ring-4 ring-offset-4 ${type.textColor}/20`
                  : 'border-gray-200 bg-white/90 backdrop-blur-sm hover:border-gray-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105'
                  }`}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-6 shadow-2xl ${isSelected ? 'scale-125 rotate-12' : ''
                    } transition-all duration-700`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className={`text-2xl font-extrabold mb-3 ${isSelected ? type.textColor : 'text-gray-900'
                    } transition-colors`}
                  >
                    {type.title}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    {type.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Recommendations */}
        {selectedType && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Perfect For You
                </h3>
                <p className="text-gray-600">
                  Handpicked tours matching your travel style
                </p>
              </div>
              <button
                onClick={resetSelection}
                className="px-6 py-3 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold text-gray-700 transition-all duration-300"
              >
                Reset
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentRecommendations.map((tour) => {
                const isFavorite = favorites.has(tour.id);

                return (
                  <div
                    key={tour.id}
                    className="group bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 hover:scale-[1.02] border border-gray-200/50 hover:border-blue-300/50"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={tour.image}
                        alt={tour.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Badge */}
                      {tour.badge && (
                        <div className={`absolute top-4 left-4 ${getBadgeColor(tour.badge)} text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg`}>
                          {getIconForBadge(tour.badge)}
                          <span>{tour.badge}</span>
                        </div>
                      )}

                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(tour.id)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
                      >
                        <Heart
                          className={`w-5 h-5 transition-all duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                            }`}
                        />
                      </button>

                      {/* Difficulty Badge */}
                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow">
                        {tour.difficulty}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{tour.location}</span>
                      </div>

                      <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {tour.title}
                      </h4>

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tour.highlights.map((highlight, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold text-gray-900">{tour.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span className="text-xs">{tour.reviews}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">{tour.duration}</span>
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-gray-500 text-xs block">From</span>
                          <span className="text-2xl font-bold text-gray-900">{tour.price}</span>
                        </div>
                        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 group">
                          <span>Book Now</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedType && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Compass className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Adventure Style</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Select a traveler type above to discover tours perfectly matched to your interests and preferences.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PlanYourPath;