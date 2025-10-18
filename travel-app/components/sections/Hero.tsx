'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [guests, setGuests] = useState('2');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  const heroImages = [
    '/images/everest.jpg',
    '/images/pokhara.jpg',
    '/images/chitwan.jpg',
    '/images/lumbini.jpg',
  ];

  const destinations = [
    'Kathmandu Valley',
    'Pokhara Lake City', 
    'Chitwan National Park',
    'Lumbini - Birthplace of Buddha',
    'Everest Base Camp',
    'Annapurna Circuit',
    'Bandipur Heritage Town',
    'Mustang - Upper Mustang',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      q: searchQuery,
      destination,
      checkIn,
      guests,
    });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Mountain Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-blue-600/30 z-10"></div>
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        ></div>
      </div>

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-5rem)] py-8 lg:py-16">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left order-2 lg:order-1"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 lg:mb-6 leading-tight">
              TrekSathi
            </h1>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-light text-white/90 mb-6 lg:mb-8 leading-relaxed">
              People Travel<br />
              To Spiritual Journey
            </h2>
            
            <p className="text-base lg:text-lg text-white/80 mb-6 lg:mb-8 max-w-md leading-relaxed">
              Connection and adventure across Nepal's Nepal
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6 lg:mb-8">
              <div className="flex items-center space-x-2 text-white/70">
                <span className="w-2 h-2 bg-white/50 rounded-full"></span>
                <span className="text-sm">1.1M+ users</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70">
                <span className="w-2 h-2 bg-white/50 rounded-full"></span>
                <span className="text-sm">10 categories</span>
              </div>
            </div>
            
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-sm lg:text-base">
              Start Your Journey
            </button>
          </motion.div>

          {/* Right Content - Mobile App Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center lg:justify-end order-1 lg:order-2 mt-8 lg:mt-0"
          >
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-64 sm:w-72 lg:w-80 h-[480px] sm:h-[540px] lg:h-[600px] bg-black rounded-[2.5rem] lg:rounded-[3rem] p-1.5 lg:p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden relative">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 lg:w-32 h-5 lg:h-6 bg-black rounded-b-xl lg:rounded-b-2xl z-10"></div>
                  
                  {/* App Content */}
                  <div className="pt-6 lg:pt-8 px-3 lg:px-4 h-full bg-gradient-to-b from-gray-50 to-white">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 lg:mb-6">
                      <h3 className="text-base lg:text-lg font-bold text-gray-800">Spiritual Destinations</h3>
                      <button className="w-6 lg:w-8 h-6 lg:h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-600 text-sm lg:text-base">×</span>
                      </button>
                    </div>
                    
                    {/* Search */}
                    <div className="mb-4 lg:mb-6">
                      <div className="bg-gray-100 rounded-lg lg:rounded-xl p-2 lg:p-3 flex items-center space-x-2 lg:space-x-3">
                        <span className="text-gray-400 text-sm lg:text-base">🔍</span>
                        <span className="text-gray-500 text-xs lg:text-sm">Search destinations...</span>
                      </div>
                    </div>
                    
                    {/* Tour Stories */}
                    <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
                      {[
                        { name: 'Pashupatinath', location: 'Kathmandu', icon: '🕉️', color: 'bg-blue-100' },
                        { name: 'Annapurna', location: 'Pokhara', icon: '🏔️', color: 'bg-green-100' },
                        { name: 'Everest', location: 'Solukhumbu', icon: '⛰️', color: 'bg-red-100' },
                        { name: 'Lumbini', location: 'Rupandehi', icon: '☸️', color: 'bg-yellow-100' },
                        { name: 'Chitwan', location: 'Chitwan', icon: '🐘', color: 'bg-purple-100' },
                      ].map((tour, index) => (
                        <div key={index} className="flex items-center space-x-2 lg:space-x-3 p-2 lg:p-3 bg-white rounded-lg lg:rounded-xl shadow-sm">
                          <div className={`w-8 lg:w-12 h-8 lg:h-12 ${tour.color} rounded-lg lg:rounded-xl flex items-center justify-center text-sm lg:text-xl`}>
                            {tour.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-xs lg:text-sm">{tour.name}</h4>
                            <p className="text-gray-500 text-xs">{tour.location}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-400">4.8 ⭐</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Bottom Button */}
                    <button className="w-full bg-red-500 text-white py-3 lg:py-4 rounded-lg lg:rounded-xl font-semibold text-sm lg:text-base">
                      See Locations
                    </button>
                    
                    {/* Bottom Navigation */}
                    <div className="absolute bottom-2 lg:bottom-4 left-2 lg:left-4 right-2 lg:right-4 flex justify-around py-1 lg:py-2">
                      {['🏠', '📍', '❤️', '👤'].map((icon, index) => (
                        <button key={index} className="w-8 lg:w-10 h-8 lg:h-10 flex items-center justify-center text-lg lg:text-xl">
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-8 flex space-x-2">
        {[0, 1, 2, 3, 4].map((dot, index) => (
          <div 
            key={index} 
            className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-red-500' : 'bg-white/30'}`}
          ></div>
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;