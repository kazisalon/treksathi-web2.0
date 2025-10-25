'use client';

import { useState } from 'react';
import { Heart, MapPin, Star, Users, Eye } from 'lucide-react';
import Image from 'next/image';

export default function DestinationsPage() {
  const [favorites, setFavorites] = useState<number[]>([]);

  const destinations = [
    {
      id: 1,
      name: "Himayairom trumings",
      subtitle: "Feeling and excitement",
      region: "Region 2",
      users: 3,
      price: 3,
      rating: 4,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Deer Mountain Plaching",
      subtitle: "Feeling you cannot see the sky",
      region: "Region 4",
      users: 1,
      price: 1,
      rating: 4,
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Deep Mountain Blue Hardy",
      subtitle: "Reach the top of the world",
      region: "Region 6",
      users: 4,
      price: 4,
      rating: 5,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      name: "Adventure & Roughishings",
      subtitle: "Feeling you cannot Goal",
      region: "Region 2",
      users: 2,
      price: 2,
      rating: 4,
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      name: "Undert the Scruning",
      subtitle: "Feeling achievement Goal",
      region: "Region 3",
      users: 1,
      price: 1,
      rating: 4,
      image: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=400&h=300&fit=crop"
    },
    {
      id: 6,
      name: "Real therhgean Fluations",
      subtitle: "Feeling you cannot Goal",
      region: "Region 6",
      users: 7,
      price: 7,
      rating: 5,
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
    }
  ];

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">Fleebira</h1>
              <nav className="flex space-x-6">
                <a href="#" className="text-gray-600 hover:text-gray-900">Food Now</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Travel Upgrades</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Free</a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Destinations Section */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Top Destinations</h2>
            <p className="text-gray-600 text-sm">For yured to fuk with your flat loagus.</p>
          </div>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
            Plan
          </button>
        </div>

        {/* Pustinations Section */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-semibold text-gray-900">Pustinations</h3>
          <a href="#" className="text-blue-500 hover:text-blue-600 text-sm font-medium">
            Hewa Mad
          </a>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <div key={destination.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              {/* Image Section */}
              <div className="relative h-48">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover"
                />
                
                {/* Top badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-white/90 text-gray-700 text-xs px-2 py-1 rounded">
                    {destination.region}
                  </span>
                  <div className="flex items-center bg-white/90 text-gray-700 text-xs px-2 py-1 rounded gap-1">
                    <Users className="w-3 h-3" />
                    <span>{destination.users}</span>
                  </div>
                </div>

                {/* Price badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 text-gray-700 text-xs px-2 py-1 rounded font-medium">
                    £ {destination.price}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4">
                {/* Title */}
                <h4 className="font-semibold text-gray-900 mb-1">
                  {destination.name}
                </h4>
                
                {/* Subtitle */}
                <p className="text-sm text-gray-600 mb-3">
                  {destination.subtitle}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < destination.rating 
                            ? 'text-orange-400 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{destination.rating}</span>
                </div>

                {/* Bottom Section */}
                <div className="flex items-center justify-between">
                  {/* Icons */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleFavorite(destination.id)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Heart 
                        className={`w-4 h-4 ${
                          favorites.includes(destination.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-gray-400'
                        }`} 
                      />
                    </button>
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <Users className="w-4 h-4 text-gray-400" />
                  </div>

                  {/* View Button */}
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}