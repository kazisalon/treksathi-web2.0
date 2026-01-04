'use client';

import { useState, useEffect } from 'react';
import { Heart, MapPin, Star, Users, Eye } from 'lucide-react';
import Image from 'next/image';

const destinations = [
  {
    id: 1,
    name: "Himayaram Trunings",
    subtitle: "Where ancient whispers meet modern souls",
    region: "Kathmandu Valley",
    users: "1,500+",
    price: "Popular",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop"
  },
  {
    id: 2,
    name: "Deer Mountain Plashing",
    subtitle: "Where mountains kiss the sky",
    region: "Pokhara Valley",
    users: "5,500+",
    price: "Best Seller",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
  },
  {
    id: 3,
    name: "Deep Mountain Blue Hardy",
    subtitle: "Touch the roof of the world",
    region: "Everest Region",
    users: "2,584+",
    price: "Premium",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
  },
  {
    id: 4,
    name: "Adventure & Roughsinging",
    subtitle: "Journey through nature's symphony",
    region: "Annapurna Region",
    users: "3,200+",
    price: "Recommended",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop"
  },
  {
    id: 5,
    name: "Unveil the Sctuning",
    subtitle: "Step into a timeless realm",
    region: "Upper Mustang",
    users: "1,800+",
    price: "Hidden Gem",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
  },
  {
    id: 6,
    name: "Real Deeringean Plustions",
    subtitle: "Where wild hearts roam free",
    region: "Chitwan National Park",
    users: "2,100+",
    price: "Wildlife",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&h=600&fit=crop"
  }
];



const FeaturedDestinations = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-5 tracking-tight" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            Discover Nepal
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Where every mountain tells a story, every temple whispers ancient wisdom, and every trail leads to transformation
          </p>

          {/* Icons */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <span className="text-2xl">🏔️</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <span className="text-2xl">🙏</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <span className="text-2xl">🕉️</span>
            </div>
          </div>
        </div>




        {/* Top Destinations Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Top Destinations</h2>

          {/* First Row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {destinations.slice(0, 3).map((destination) => (
              <div key={destination.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    width={400}
                    height={250}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {destination.users}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => toggleFavorite(destination.id)}
                      className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${favorites.includes(destination.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                      />
                    </button>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Map View
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{destination.name}</h3>
                  <p className="text-gray-600 mb-4">{destination.subtitle}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{destination.region}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{destination.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      <span className="text-sm">{destination.users}</span>
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {destination.price}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pustinations Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Pustinations</h2>

          {/* Second Row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {destinations.slice(3, 6).map((destination) => (
              <div key={destination.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    width={400}
                    height={250}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {destination.users}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => toggleFavorite(destination.id)}
                      className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${favorites.includes(destination.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                      />
                    </button>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Map View
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{destination.name}</h3>
                  <p className="text-gray-600 mb-4">{destination.subtitle}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{destination.region}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{destination.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      <span className="text-sm">{destination.users}</span>
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {destination.price}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;