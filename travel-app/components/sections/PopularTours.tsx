'use client';

import { useState } from 'react';
import { Mountain, Compass, Heart, Flower, ArrowRight, MapPin, Clock, Star } from 'lucide-react';
import Image from 'next/image';

const travelerTypes = [
  {
    id: 'adventurer',
    title: 'Adventurer',
    icon: Mountain,
    description: 'Seeking thrills and challenges',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600'
  },
  {
    id: 'cultural',
    title: 'Cultural Explorer',
    icon: Compass,
    description: 'Immersing in traditions and heritage',
    color: 'from-blue-500 to-purple-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  {
    id: 'relaxed',
    title: 'Relaxed Nomad',
    icon: Heart,
    description: 'Enjoying peaceful moments',
    color: 'from-green-500 to-teal-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600'
  },
  {
    id: 'spiritual',
    title: 'Spiritual Seeker',
    icon: Flower,
    description: 'Finding inner peace and wisdom',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600'
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
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      highlights: ["5,364m altitude", "Sherpa culture", "Kala Patthar sunrise"]
    },
    {
      id: 2,
      title: "Annapurna Circuit",
      location: "Annapurna Region",
      duration: "16 days",
      difficulty: "Moderate",
      price: "$999",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop",
      highlights: ["Thorong La Pass", "Diverse landscapes", "Hot springs"]
    },
    {
      id: 3,
      title: "Manaslu Circuit Trek",
      location: "Manaslu Region",
      duration: "18 days",
      difficulty: "Challenging",
      price: "$1,199",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      highlights: ["Remote trails", "Larkya La Pass", "Untouched nature"]
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
      image: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=600&h=400&fit=crop",
      highlights: ["UNESCO sites", "Local markets", "Traditional crafts"]
    },
    {
      id: 5,
      title: "Upper Mustang Trek",
      location: "Mustang Region",
      duration: "10 days",
      difficulty: "Moderate",
      price: "$1,199",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop",
      highlights: ["Lo Manthang", "Ancient monasteries", "Tibetan culture"]
    },
    {
      id: 6,
      title: "Newari Culture Experience",
      location: "Bhaktapur",
      duration: "3 days",
      difficulty: "Easy",
      price: "$299",
      rating: 4.6,
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
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      highlights: ["Phewa Lake", "Mountain views", "Spa treatments"]
    },
    {
      id: 8,
      title: "Chitwan Wildlife Safari",
      location: "Chitwan National Park",
      duration: "3 days",
      difficulty: "Easy",
      price: "$299",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&h=400&fit=crop",
      highlights: ["Rhino spotting", "Jungle safari", "Canoe rides"]
    },
    {
      id: 9,
      title: "Bandipur Hill Station",
      location: "Bandipur",
      duration: "2 days",
      difficulty: "Easy",
      price: "$199",
      rating: 4.4,
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
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      highlights: ["Sacred lakes", "Meditation sessions", "Gokyo Ri sunrise"]
    },
    {
      id: 11,
      title: "Lumbini Pilgrimage",
      location: "Lumbini",
      duration: "3 days",
      difficulty: "Easy",
      price: "$249",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop",
      highlights: ["Buddha's birthplace", "Monasteries", "Peace pagoda"]
    },
    {
      id: 12,
      title: "Muktinath Temple Trek",
      location: "Mustang Region",
      duration: "7 days",
      difficulty: "Moderate",
      price: "$699",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop",
      highlights: ["Sacred temple", "Eternal flames", "Spiritual journey"]
    }
  ]
};

const PlanYourPath = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleTypeSelection = (typeId: string) => {
    setSelectedType(typeId);
    setShowRecommendations(true);
  };

  const resetSelection = () => {
    setSelectedType(null);
    setShowRecommendations(false);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-teal-50 relative overflow-hidden">
      {/* Clean Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/30 to-teal-100/30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
            Plan Your Path
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            What kind of traveler are you? Let us guide you to your perfect Nepal adventure
          </p>
        </div>

        {!showRecommendations ? (
          /* Traveler Type Selection */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {travelerTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <div
                  key={type.id}
                  onClick={() => handleTypeSelection(type.id)}
                  className="bg-white rounded-xl p-8 text-center cursor-pointer transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl group border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                >
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${type.color} flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {type.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {type.description}
                  </p>

                  <div className="mt-6">
                    <div className="inline-flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                      Explore
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Recommendations */
          <div className="space-y-8">
            {/* Back Button */}
            <div className="text-center">
              <button
                onClick={resetSelection}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center mx-auto transition-colors duration-300"
              >
                ← Back to traveler types
              </button>
            </div>

            {/* Selected Type Header */}
            {selectedType && (
              <div className="text-center mb-12">
                <div className={`inline-flex items-center ${travelerTypes.find(t => t.id === selectedType)?.bgColor} rounded-full px-6 py-3 mb-4`}>
                  {(() => {
                    const type = travelerTypes.find(t => t.id === selectedType);
                    if (type) {
                      const IconComponent = type.icon;
                      return (
                        <>
                          <IconComponent className={`w-6 h-6 ${type.textColor} mr-3`} />
                          <span className={`font-semibold ${type.textColor}`}>
                            Perfect for {type.title}s
                          </span>
                        </>
                      );
                    }
                    return null;
                  })()} 
                </div>
                <h3 className="text-3xl font-bold text-slate-800">
                  Recommended Experiences
                </h3>
              </div>
            )}

            {/* Recommendations Grid */}
            {selectedType && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations[selectedType as keyof typeof recommendations].map((rec, index) => (
                  <div
                    key={rec.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 opacity-0 animate-fadeIn group"
                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                  >
                    <div className="relative overflow-hidden">
                      <Image
                        src={rec.image}
                        alt={rec.title}
                        width={600}
                        height={400}
                        className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 text-slate-800 px-3 py-1 rounded-full text-sm font-medium">
                          {rec.difficulty}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center bg-white/90 rounded-full px-2 py-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm font-medium">{rec.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center text-sm text-slate-500 mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        {rec.location}
                        <Clock className="w-4 h-4 ml-4 mr-1" />
                        {rec.duration}
                      </div>

                      <h4 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                        {rec.title}
                      </h4>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {rec.highlights.map((highlight, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-slate-800">
                          {rec.price}
                        </div>
                        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center group">
                          Book Now
                          <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </section>
  );
};

export default PlanYourPath;