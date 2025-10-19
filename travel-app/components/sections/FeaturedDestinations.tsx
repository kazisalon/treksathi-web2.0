'use client';

import { useState, useEffect } from 'react';
import { useDestinations } from '../../hooks/useApi';

// Popular destinations data
const popularDestinations = [
  { name: "Annapurna Circuit", icon: "🏔️", category: "Trekking" },
  { name: "Everest Base Camp", icon: "⛰️", category: "Adventure" },
  { name: "Chitwan Safari", icon: "🦏", category: "Wildlife" },
  { name: "Kathmandu Valley", icon: "🏛️", category: "Culture" },
  { name: "Pokhara Lakes", icon: "🏞️", category: "Nature" },
  { name: "Lumbini", icon: "🕉️", category: "Spiritual" }
];

// Featured destinations data
const featuredDestinations = [
  {
    id: 1,
    name: "Everest Base Camp Trek",
    location: "Solukhumbu District, Khumbu Region",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop",
    rating: 4.9,
    reviews: 324,
    category: "Trekking"
  },
  {
    id: 2,
    name: "Annapurna Sanctuary",
    location: "Annapurna Conservation Area",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    rating: 4.8,
    reviews: 189,
    category: "Adventure"
  },
  {
    id: 3,
    name: "Kathmandu Heritage Tour",
    location: "Kathmandu Valley UNESCO Sites",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop",
    rating: 4.7,
    reviews: 256,
    category: "Culture"
  }
];

const FeaturedDestinations = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Safarfire Earar Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-xl">⭐</span>
            ))}
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Safarfire Earar</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Inspiring travel with expert this website is nepal exploration comes in varied 
            routes, joyful hot conversations about with recurring guide.
          </p>

          {/* Travel App Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* AI Itinerary Builder */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                <div className="absolute top-3 left-3 w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs">📱</span>
                </div>
                <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=150&fit=crop"
                  alt="Mountain sunset"
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-900">AI Itinerary Builder</h3>
                <p className="text-sm text-gray-600 mb-3">
                  🎯 Focus: first trekking routes
                  Personalized route details
                </p>
                <div className="flex items-center justify-between">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs">🔥 $1499 ABS</span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs">Try Now</span>
                </div>
              </div>
            </div>

            {/* Live GPS Route */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                <div className="absolute top-3 left-3 w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs">📱</span>
                </div>
                <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=300&h=150&fit=crop"
                  alt="Mountain peak"
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-900">Live GPS Route</h3>
                <p className="text-sm text-gray-600 mb-3">
                  🎯 Comprehensive Everest
                  Automated route alerts
                </p>
                <div className="flex items-center justify-between">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs">🔥 $1899 ABS</span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs">Try Now</span>
                </div>
              </div>
            </div>

            {/* Local Weather */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                <div className="absolute top-3 left-3 w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs">📱</span>
                </div>
                <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=150&fit=crop"
                  alt="Trekker on mountain"
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-900">Local Weather</h3>
                <p className="text-sm text-gray-600 mb-3">
                  🎯 Frost: Real-time Warnings
                  Automated forecast alerts
                </p>
                <div className="flex items-center justify-between">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs">🔥 $399 ABS</span>
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs">Try Now</span>
                </div>
              </div>
            </div>

            {/* Cortine Explorer */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                <div className="absolute top-3 left-3 w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs">📱</span>
                </div>
                <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=300&h=150&fit=crop"
                  alt="Mountain lodge"
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-900">Cortine Explorer</h3>
                <p className="text-sm text-gray-600 mb-3">
                  🎯 Frost: Mountaineering paths
                  Pre-travel base bed colors
                </p>
                <div className="flex items-center justify-between">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs">🔥 $999 ABS</span>
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs">Try Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ali Experied Moments Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              {[...Array(6)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">⭐</span>
              ))}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nepal Experienced Moments</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover authentic Nepal through curated experiences that connect you with local culture, 
              breathtaking landscapes, and unforgettable adventures in the heart of the Himalayas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - TrekSathi Explorer */}
            <div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full inline-block mb-6">
                POPULAR
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">TrekSathi Explorer</h3>
              <p className="text-gray-600 mb-8">
                Experience Nepal's diverse landscapes through 3 unique adventure packages featuring 
                expert local guides, authentic cultural immersion, and carefully curated trekking 
                routes across the majestic Himalayan ranges.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm">🌍 Cultural Heritage Tours</span>
                <span className="bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm">💕 Authentic Local Stays</span>
                <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm">🏔️ Mountain Adventures</span>
              </div>

              {/* Trek Cards */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-blue-500 rounded-xl p-3 text-white text-center">
                  <img
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=60&fit=crop"
                    alt="Cat trek"
                    className="w-full h-12 object-cover rounded-lg mb-2"
                  />
                  <p className="text-xs font-medium">Cat</p>
                </div>
                <div className="bg-orange-500 rounded-xl p-3 text-white text-center">
                  <img
                    src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=100&h=60&fit=crop"
                    alt="Owl trek"
                    className="w-full h-12 object-cover rounded-lg mb-2"
                  />
                  <p className="text-xs font-medium">Owl</p>
                </div>
                <div className="bg-teal-500 rounded-xl p-3 text-white text-center">
                  <img
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=60&fit=crop"
                    alt="Whale trek"
                    className="w-full h-12 object-cover rounded-lg mb-2"
                  />
                  <p className="text-xs font-medium">Whale</p>
                </div>
                <div className="bg-red-500 rounded-xl p-3 text-white text-center">
                  <img
                    src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=100&h=60&fit=crop"
                    alt="Mitra trek"
                    className="w-full h-12 object-cover rounded-lg mb-2"
                  />
                  <p className="text-xs font-medium">Mitra</p>
                </div>
                <div className="bg-purple-500 rounded-xl p-3 text-white text-center">
                  <img
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=60&fit=crop"
                    alt="Caffe trek"
                    className="w-full h-12 object-cover rounded-lg mb-2"
                  />
                  <p className="text-xs font-medium">Caffe</p>
                </div>
                <div className="bg-yellow-500 rounded-xl p-3 text-white text-center">
                  <img
                    src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=100&h=60&fit=crop"
                    alt="Powa trek"
                    className="w-full h-12 object-cover rounded-lg mb-2"
                  />
                  <p className="text-xs font-medium">Powa</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-lg mb-1">Himigran Red Polider</h4>
                  <p className="text-sm text-gray-600 mb-1">Himigran 3734</p>
                  <p className="text-sm text-gray-600">
                    Amalthingman erosion entirely
                    Antler grimance 344560
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-1">Sky Everest Push Comp</h4>
                  <p className="text-sm text-gray-600 mb-1">Himigranified 3734</p>
                  <p className="text-sm text-gray-600">
                    Annapurnaexpedient entirely
                    Antlergrimmance 344560
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Mobile Interface */}
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-4 text-white shadow-2xl w-80 h-fit">
                {/* Phone Header */}
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-white/30 rounded-full"></div>
                    <div className="w-4 h-4 bg-white/30 rounded-full"></div>
                  </div>
                  <div className="text-white font-medium text-sm">Hetuayan Aval</div>
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">→</span>
                  </div>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl p-4 mb-4">
                  <div className="text-right space-y-2">
                    <div className="text-gray-400 text-xs">Compactar dimensions</div>
                    <div className="text-gray-600 text-sm">Shove elevates</div>
                    <div className="text-orange-500 text-sm flex items-center justify-end">
                      One top Stengel 
                      <span className="ml-1 w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 text-xs">⏰</span>
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm">Froste mita</div>
                  </div>
                </div>

                {/* Mountain Image */}
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop"
                  alt="Nepal Mountain"
                  className="w-full h-48 object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;