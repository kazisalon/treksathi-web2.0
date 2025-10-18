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
  }, []);

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <motion.div
            key={image}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
            transition={{ duration: 1 }}
          />
        ))}
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Discover Nepal's
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Hidden Treasures
            </span>
            <span className="block text-3xl md:text-4xl mt-2 text-emerald-200">
              नेपालका लुकेका खजानाहरू खोज्नुहोस्
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed">
            Embark on extraordinary adventures through the majestic Himalayas, 
            ancient temples, and vibrant cultures of Nepal
          </p>
          <p className="text-lg md:text-xl text-emerald-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            हिमालयका अद्भुत साहसिक यात्राहरू, पुरातन मन्दिरहरू र नेपालको जीवन्त संस्कृतिमा डुब्नुहोस्
          </p>

          {/* Search Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            onSubmit={handleSearch}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Destination */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination / गन्तव्य
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="input-field pl-10 appearance-none focus:ring-emerald-500"
                  >
                    <option value="">Choose your destination / गन्तव्य छान्नुहोस्</option>
                    {destinations.map((dest) => (
                      <option key={dest} value={dest}>{dest}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Check-in Date */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Date / यात्रा मिति
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5" />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="input-field pl-10 focus:ring-emerald-500 focus:border-emerald-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travelers / यात्रुहरू
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="input-field pl-10 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Traveler / यात्रु' : 'Travelers / यात्रुहरू'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group shadow-lg hover:shadow-xl"
                >
                  <Search className="w-5 h-5" />
                  <span>Search Adventures / साहसिक खोज्नुहोस्</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.form>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            {[
              { name: '🏔️ Everest Trek / एभरेस्ट ट्रेक', href: '/tours/everest' },
              { name: '🏞️ Pokhara Lakes / पोखराका तालहरू', href: '/tours/pokhara' },
              { name: '🐘 Chitwan Safari / चितवन सफारी', href: '/tours/chitwan' },
              { name: '🕉️ Lumbini Pilgrimage / लुम्बिनी तीर्थयात्रा', href: '/tours/lumbini' },
              { name: '🏛️ Kathmandu Heritage / काठमाडौं सम्पदा', href: '/tours/kathmandu' },
            ].map((action) => (
              <button
                key={action.name}
                onClick={() => router.push(action.href)}
                className="bg-emerald-500/20 backdrop-blur-md text-white px-6 py-3 rounded-full hover:bg-emerald-500/30 transition-all duration-200 border border-emerald-300/30 hover:scale-105 font-medium"
              >
                {action.name}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;