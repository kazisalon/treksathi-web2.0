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
    'काठमाडौं (Kathmandu)',
    'पोखरा (Pokhara)', 
    'चितवन (Chitwan)',
    'लुम्बिनी (Lumbini)',
    'एभरेस्ट (Everest)',
    'अन्नपूर्ण (Annapurna)',
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
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            <span className="block">तपाईंको सपनाको</span>
            <span className="block text-yellow-400">यात्रा सुरु गर्नुहोस्</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            नेपालका अद्भुत गन्तव्यहरू अन्वेषण गर्नुहोस् र अविस्मरणीय अनुभवहरू सिर्जना गर्नुहोस्
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
                  गन्तव्य (Destination)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="input-field pl-10 appearance-none"
                  >
                    <option value="">गन्तव्य छान्नुहोस्</option>
                    {destinations.map((dest) => (
                      <option key={dest} value={dest}>{dest}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Check-in Date */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  मिति (Date)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  यात्रुहरू (Guests)
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="input-field pl-10"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>{num} जना</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group"
                >
                  <Search className="w-5 h-5" />
                  <span>खोज्नुहोस्</span>
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
              { name: 'एभरेस्ट ट्रेक', href: '/tours/everest' },
              { name: 'पोखरा टुर', href: '/tours/pokhara' },
              { name: 'चितवन सफारी', href: '/tours/chitwan' },
              { name: 'लुम्बिनी यात्रा', href: '/tours/lumbini' },
            ].map((action) => (
              <button
                key={action.name}
                onClick={() => router.push(action.href)}
                className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full hover:bg-white/30 transition-all duration-200 border border-white/30"
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