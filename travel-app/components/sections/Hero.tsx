'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, X, MapPin, Calendar, Users, Filter, Heart, MessageCircle, Share2, Bookmark, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { TravelGuideAPI } from '../../lib/api';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('Nepal');
  const [isCardVisible, setIsCardVisible] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Dynamic stories for right-side card
  type Story = {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    likesCount: number;
    commentCount: number;
    location?: string;
    userName?: string;
    userId?: string;
    dateCreated?: string;
  };
  const [topStories, setTopStories] = useState<Story[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [loadingStories, setLoadingStories] = useState(false);
  const [storiesError, setStoriesError] = useState<string | null>(null);

  // Fetch and prepare top stories for carousel
  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        setLoadingStories(true);
        setStoriesError(null);

        const raw = await TravelGuideAPI.getAllPosts();

        // Normalize various API shapes into an array
        const arr = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.posts)
          ? raw.posts
          : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw?.results)
          ? raw.results
          : [];

        const normalize = (p: any): Story => ({
          id: p.id || p._id || `${Date.now()}-${Math.random()}`,
          title: p.title || p.name || 'Untitled',
          description: p.description || p.content || '',
          imageUrl:
            (Array.isArray(p.imageUrls) ? p.imageUrls[0] : p.imageUrl) ||
            'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=60',
          likesCount: Number(p.likesCount ?? p.likes ?? 0),
          commentCount: Number(
            p.commentCount ??
              p.commentsCount ??
              (Array.isArray(p.comments) ? p.comments.length : 0) ??
              0
          ),
          location: p.location || p.place || 'Nepal',
          userName: p.userName || p.username || p.user?.name || 'Traveler',
          userId: p.userId || p.user?.id || '',
          dateCreated: p.dateCreated || p.createdAt || '',
        });

        const stories: Story[] = arr.map(normalize);

        // Score by likes and comments, descending
        const score = (s: Story) => (s.likesCount || 0) * 2 + (s.commentCount || 0);
        stories.sort((a, b) => score(b) - score(a));

        setTopStories(stories.slice(0, 6)); // show top 6 in carousel
        setActiveStoryIndex(0);
      } catch (err: any) {
        console.error('Hero: Failed to load stories', err);
        setStoriesError(err?.message || 'Failed to load stories');
      } finally {
        setLoadingStories(false);
      }
    };

    fetchTopStories();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (!topStories.length) return;
    const id = setInterval(() => {
      setActiveStoryIndex((i) => (i + 1) % topStories.length);
    }, 6000);
    return () => clearInterval(id);
  }, [topStories.length]);

  const currentStory = topStories[activeStoryIndex];
  const isTrending = currentStory
    ? currentStory.likesCount * 2 + currentStory.commentCount >= 20
    : false;
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

  // BOOKING INTERFACE - COMMENTED OUT FOR FUTURE IMPLEMENTATION
  // const tripTypes = [
  //   { id: 'trekking', label: 'Trekking', icon: '🥾' },
  //   { id: 'cultural', label: 'Cultural', icon: '🏛️' },
  //   { id: 'adventure', label: 'Adventure', icon: '🏔️' },
  //   { id: 'wildlife', label: 'Wildlife', icon: '🦌' }
  // ];

  // const handleSearch = () => {
  //   const searchData = {
  //     destination: searchQuery,
  //     checkIn: checkInDate,
  //     checkOut: checkOutDate,
  //     guests: guestCount,
  //     tripTypes: selectedTripTypes
  //   };
  //   console.log('Searching with data:', searchData);
  //   // Add search functionality here
  // };

  // const toggleTripType = (typeId: string) => {
  //   setSelectedTripTypes(prev => 
  //     prev.includes(typeId) 
  //       ? prev.filter(t => t !== typeId)
  //       : [...prev, typeId]
  //   );
  // };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const destinationData = [
    { name: 'Kathmandu', tours: 45, reviews: 1250, rating: 4.8, temp: '22°C', weather: 'Sunny' },
    { name: 'Pokhara', tours: 38, reviews: 980, rating: 4.9, temp: '18°C', weather: 'Cloudy' },
    { name: 'Everest Region', tours: 25, reviews: 750, rating: 4.7, temp: '-5°C', weather: 'Snow' },
    { name: 'Chitwan', tours: 32, reviews: 890, rating: 4.6, temp: '28°C', weather: 'Humid' }
  ];

  const currentDestination = destinationData.find(d => d.name === selectedDestination) || destinationData[0];

  return (
    <section className="relative min-h-[80vh] flex items-center py-20">
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
            

          </motion.div>

          {/* Right Content - Dynamic Stories Carousel */}
          {isCardVisible && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center lg:justify-end order-1 lg:order-2"
            >
              <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100/50 backdrop-blur-sm">
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-gray-50/80 to-white/90 backdrop-blur-sm border-b border-gray-100/60">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm tracking-wide">
                            {currentStory?.userName?.slice(0, 2)?.toUpperCase() || 'TS'}
                          </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base tracking-tight">
                          {currentStory?.userName || 'Traveler'}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="text-gray-500">
                            {currentStory?.dateCreated ? new Date(currentStory.dateCreated).toLocaleDateString() : 'Recently'}
                          </span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="text-indigo-600 font-medium flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {currentStory?.location || 'Nepal'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsCardVisible(false)}
                      className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:bg-gray-100 rounded-full p-2 hover:rotate-90"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  {loadingStories && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <span className="text-gray-500 text-sm">Loading stories…</span>
                    </div>
                  )}
                  {!loadingStories && !storiesError && currentStory && (
                    <>
                      <img 
                        src={currentStory.imageUrl}
                        alt={currentStory.title}
                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        {isTrending && (
                          <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30">
                            🔥 Trending
                          </span>
                        )}
                        <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30">
                          Premium
                        </span>
                      </div>
                      <div className="absolute bottom-6 left-6 text-white">
                        <h4 className="font-bold text-2xl mb-2 tracking-tight">{currentStory.title}</h4>
                        <p className="text-sm opacity-90 font-medium line-clamp-2">
                          {currentStory.description || 'Discover an incredible adventure in Nepal.'}
                        </p>
                      </div>

                      {/* Carousel controls */}
                      <button
                        aria-label="Previous story"
                        onClick={() =>
                          setActiveStoryIndex((i) => (i - 1 + topStories.length) % topStories.length)
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        aria-label="Next story"
                        onClick={() =>
                          setActiveStoryIndex((i) => (i + 1) % topStories.length)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {!loadingStories && (storiesError || !currentStory) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
                      <span className="text-gray-600 text-sm">
                        {storiesError || 'No stories yet. Share your first adventure!'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content and actions */}
                {currentStory && (
                  <div className="p-6 bg-gradient-to-b from-white to-gray-50/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-amber-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-base font-bold text-gray-800">4.8</span>
                        <span className="text-sm text-gray-500 font-medium">• Top story</span>
                      </div>
                      {isTrending && (
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-lg">
                          Trending
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200/60">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-semibold">{currentStory.likesCount}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MessageCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-semibold">{currentStory.commentCount}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Share2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-semibold">Share</span>
                        </div>
                      </div>
                      <Bookmark className="w-4 h-4 text-amber-500" />
                    </div>

                    {/* Dots */}
                    {topStories.length > 1 && (
                      <div className="mt-4 flex items-center justify-center gap-2">
                        {topStories.map((_, idx) => (
                          <button
                            key={idx}
                            aria-label={`Go to story ${idx + 1}`}
                            onClick={() => setActiveStoryIndex(idx)}
                            className={`w-2.5 h-2.5 rounded-full ${
                              idx === activeStoryIndex ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* FLOATING BOOKING INTERFACE - COMMENTED OUT FOR FUTURE IMPLEMENTATION
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-[9999] w-full max-w-4xl px-4">
        <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end mb-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Where to?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="date" 
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="date" 
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select 
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                >
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num}>
                      {num} Guest{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button 
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Trip Type:</span>
              <div className="flex gap-2">
                {tripTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => toggleTripType(type.id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                      selectedTripTypes.includes(type.id)
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-green-100'
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all duration-300"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>
      */}

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