'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('Nepal');
  const [isCardVisible, setIsCardVisible] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // Add search functionality here
  };

  const destinationData = [
    { name: 'Kathmandu', tours: 45, reviews: 1250, rating: 4.8, temp: '22°C', weather: 'Sunny' },
    { name: 'Pokhara', tours: 38, reviews: 980, rating: 4.9, temp: '18°C', weather: 'Cloudy' },
    { name: 'Everest Region', tours: 25, reviews: 750, rating: 4.7, temp: '-5°C', weather: 'Snow' },
    { name: 'Chitwan', tours: 32, reviews: 890, rating: 4.6, temp: '28°C', weather: 'Humid' }
  ];

  const currentDestination = destinationData.find(d => d.name === selectedDestination) || destinationData[0];

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden py-20">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-blue-400/20 z-10"></div>
        {backgroundImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${image}')` }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: index === currentImageIndex ? 1 : 0,
              scale: index === currentImageIndex ? 1.05 : 1
            }}
            transition={{ 
              duration: 1.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center pt-16 sm:pt-20">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left order-2 lg:order-1 flex flex-col justify-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
              Namaste!<br />
              Discover Amazing<br />
              Adventures
            </h1>
            
            <div className="mb-8 max-w-lg space-y-3">
              <p className="text-xl text-yellow-300 font-semibold">
                🏔️ सपना देखेको ठाउँमा जाऔं!
              </p>
              <p className="text-lg text-white/90 leading-relaxed">
                Experience the magic of Nepal with expert local Sherpa guides
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="bg-white rounded-full p-2 flex items-center space-x-4 shadow-lg mb-8 max-w-md">
              <div className="flex items-center space-x-3 flex-1 px-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Where's your dream destination?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-gray-600 placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button 
                onClick={handleSearch}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300"
              >
                खोज्नुहोस्
              </button>
            </div>
          </motion.div>

          {/* Right Content - Travel Info Card */}
          {isCardVisible && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center lg:justify-end order-1 lg:order-2"
            >
              <div className="bg-white rounded-2xl p-4 shadow-2xl w-full max-w-sm">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      🇳🇵 Nepal Guide
                    </h3>
                    <p className="text-xs text-orange-500">{selectedDestination}</p>
                  </div>
                  <button 
                    onClick={() => setIsCardVisible(false)}
                    className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors hover:rotate-90 duration-300"
                  >
                    <X className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
                
                {/* Destination Selector */}
                <div className="mb-4">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <select 
                      value={selectedDestination}
                      onChange={(e) => setSelectedDestination(e.target.value)}
                      className="w-full bg-transparent outline-none text-gray-700 text-sm"
                    >
                      {destinationData.map(dest => (
                        <option key={dest.name} value={dest.name}>{dest.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Stats with Weather */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800">{currentDestination.tours}</div>
                    <div className="text-xs text-gray-500">Tours</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800">{currentDestination.rating}</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800">{currentDestination.temp}</div>
                    <div className="text-xs text-gray-500">{currentDestination.weather}</div>
                  </div>
                </div>
                
                {/* Travel Categories */}
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 bg-orange-50 rounded-lg p-2 text-center">
                    <div className="text-lg">🥾</div>
                    <div className="text-xs font-semibold text-gray-700">Trekking</div>
                  </div>
                  <div className="flex-1 bg-blue-50 rounded-lg p-2 text-center">
                    <div className="text-lg">🏛️</div>
                    <div className="text-xs font-semibold text-gray-700">Culture</div>
                  </div>
                  <div className="flex-1 bg-green-50 rounded-lg p-2 text-center">
                    <div className="text-lg">🦌</div>
                    <div className="text-xs font-semibold text-gray-700">Wildlife</div>
                  </div>
                </div>

                {/* Weather & Info */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm font-semibold text-gray-800">🌤️ {currentDestination.weather}</div>
                      <div className="text-xs text-gray-500">Best time: Oct - Dec</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">{currentDestination.temp}</div>
                      <div className="text-xs text-gray-500">Current</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    Perfect weather for outdoor adventures and sightseeing
                  </div>
                </div>
                
                {/* Destination Highlights */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-semibold text-gray-800">✨ {selectedDestination} Highlights</div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500 text-sm">⭐</span>
                      <span className="text-xs text-gray-600">{currentDestination.rating}/5</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    Discover breathtaking landscapes, rich culture, and unforgettable adventures
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>📍 {currentDestination.tours} tours available</span>
                    <span>💬 {currentDestination.reviews} reviews</span>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t pt-3">
                  <div className="flex gap-2">
                    <button className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 px-3 rounded-lg font-semibold text-xs transition-all duration-300 shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-red-700">
                      🎒 Book Now
                    </button>
                    <button className="flex-1 bg-blue-100 text-blue-600 py-2 px-3 rounded-lg font-semibold text-xs hover:bg-blue-200 transition-all duration-300">
                      📍 Explore
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Image Navigation Dots */}
      <div className="absolute bottom-8 left-8 flex space-x-2">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-red-500 scale-110' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
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