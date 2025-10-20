'use client';

import { useState, useEffect, useRef } from 'react';

// Premium destinations data with enhanced structure for immersive experience
const destinations = [
  {
    id: 1,
    name: "Mustang",
    region: "Upper Mustang",
    description: "Ride through the desert trails of the last forbidden kingdom.",
    poeticTagline: "Where ancient winds whisper forgotten tales",
    poeticSubtitle: "Desert kingdom where time stands still",
    tag: "Hidden Gem",
    tagColor: "emerald",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop",
    experiences: ["Cultural", "Adventure", "Offbeat"],
    topExperience: "Desert Trekking",
    difficulty: "Moderate",
    bestTime: "Mar-Nov",
    elevation: "3,840m",
    recommended: true,
    nearby: false,
    rating: 4.9,
    duration: "12-15 days",
    activities: ["🏔️", "🐎", "🏛️", "📸"],
    seasonalHighlight: "Spring Desert Blooms",
    seasonalIcon: "🌸",
    isSeasonalFeatured: true,
    travelerStories: [
      { avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop", review: "Life-changing experience!" },
      { avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop", review: "Absolutely magical" }
    ],
    localLegend: "Ancient legends speak of Mustang as the last kingdom where the wind carries prayers to the heavens, and every stone tells a story of resilience."
  },
  {
    id: 2,
    name: "Everest Base Camp",
    region: "Khumbu Valley", 
    description: "Stand where legends are born, beneath the roof of the world.",
    poeticTagline: "Every step echoes with mountaineer dreams",
    poeticSubtitle: "Where legends touch the sky",
    tag: "Adventure Hotspot",
    tagColor: "blue",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    experiences: ["Adventure", "Spiritual"],
    topExperience: "High Altitude Trekking",
    difficulty: "Challenging",
    bestTime: "Mar-May, Sep-Nov",
    elevation: "5,364m",
    recommended: true,
    nearby: true,
    rating: 4.8,
    duration: "14-16 days",
    activities: ["🏔️", "🥾", "📷", "🧗"],
    seasonalHighlight: "Clear Mountain Views",
    seasonalIcon: "❄️",
    isSeasonalFeatured: false,
    travelerStories: [
      { avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop", review: "Dream come true!" },
      { avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop", review: "Incredible journey" }
    ],
    localLegend: "The Sherpa people believe that Everest, known as Chomolungma, is the goddess mother of the world, watching over all who dare to approach her sacred summit."
  },
  {
    id: 3,
    name: "Annapurna Sanctuary",
    region: "Annapurna Conservation Area",
    description: "Walk into nature's amphitheater where rhododendrons bloom.",
    poeticTagline: "A sacred circle where earth meets heaven",
    poeticSubtitle: "Nature's amphitheater of wonder",
    tag: "Nature's Paradise",
    tagColor: "rose",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop",
    experiences: ["Adventure", "Spiritual"],
    topExperience: "Rhododendron Trails",
    difficulty: "Moderate",
    bestTime: "Mar-May, Sep-Nov",
    elevation: "4,130m",
    recommended: false,
    nearby: true,
    rating: 4.7,
    duration: "10-12 days",
    activities: ["🌸", "🏔️", "🥾", "🦋"],
    seasonalHighlight: "Rhododendron Blooms",
    seasonalIcon: "🌺",
    isSeasonalFeatured: true,
    travelerStories: [
      { avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop", review: "Breathtaking beauty!" },
      { avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop", review: "Pure serenity" }
    ],
    localLegend: "The sanctuary is said to be blessed by the goddess Annapurna, who provides nourishment to all living beings in this sacred amphitheater."
  },
  {
    id: 4,
    name: "Pokhara Valley",
    region: "Gandaki Province",
    description: "Mirror lakes reflect the soul of the Himalayas.",
    poeticTagline: "Where tranquility finds perfect reflection",
    poeticSubtitle: "Lake city of eternal peace",
    tag: "Romantic Escape",
    tagColor: "purple",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    experiences: ["Romantic", "Adventure"],
    topExperience: "Lake Boating",
    difficulty: "Easy",
    bestTime: "Oct-Apr",
    elevation: "822m",
    recommended: true,
    nearby: false,
    rating: 4.6,
    duration: "3-5 days",
    activities: ["🚤", "🏔️", "🌅", "💕"],
    seasonalHighlight: "Perfect Weather",
    seasonalIcon: "☀️",
    isSeasonalFeatured: false,
    travelerStories: [
      { avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop", review: "Perfect romantic getaway!" },
      { avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop", review: "So peaceful and beautiful" }
    ],
    localLegend: "Local fishermen believe that the lake holds the tears of joy from the mountain gods, blessing all lovers who visit with eternal happiness."
  },
  {
    id: 5,
    name: "Kathmandu Valley",
    region: "Central Nepal",
    description: "Seven UNESCO sites cradle centuries of devotion and art.",
    poeticTagline: "Living museum of gods and mortals",
    poeticSubtitle: "Where ancient culture lives and breathes",
    tag: "Cultural Heritage",
    tagColor: "amber",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=600&fit=crop",
    experiences: ["Cultural", "Spiritual"],
    topExperience: "Temple Hopping",
    difficulty: "Easy",
    bestTime: "Oct-Apr",
    elevation: "1,400m",
    recommended: false,
    nearby: true,
    rating: 4.5,
    duration: "2-4 days",
    activities: ["🏛️", "🙏", "🎨", "📿"],
    seasonalHighlight: "Festival Season",
    seasonalIcon: "🎊",
    isSeasonalFeatured: true,
    travelerStories: [
      { avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop", review: "Rich cultural experience!" },
      { avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop", review: "Amazing temples and art" }
    ],
    localLegend: "It is said that the valley was once a lake, drained by the sword of Manjushri to create a sacred space where gods and humans could coexist."
  },
  {
    id: 6,
    name: "Chitwan National Park",
    region: "Terai Region",
    description: "Where royal Bengal tigers roam through emerald jungles.",
    poeticTagline: "Jungle symphony of the wild heart",
    poeticSubtitle: "Where wildlife roams free",
    tag: "Wildlife Safari",
    tagColor: "green",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop",
    experiences: ["Wildlife", "Adventure"],
    topExperience: "Tiger Safari",
    difficulty: "Easy",
    bestTime: "Oct-Mar",
    elevation: "150m",
    recommended: true,
    nearby: false,
    rating: 4.4,
    duration: "2-3 days",
    activities: ["🐅", "🐘", "🦏", "🌿"],
    seasonalHighlight: "Wildlife Spotting",
    seasonalIcon: "🦌",
    isSeasonalFeatured: false,
    travelerStories: [
      { avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop", review: "Saw a tiger up close!" },
      { avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop", review: "Amazing wildlife experience" }
    ],
    localLegend: "The Tharu people believe that the jungle spirits protect all who respect the forest, and tigers are the guardians of ancient wisdom."
  }
];

// Hidden Treasures data
const hiddenTreasures = [
  {
    id: 1,
    name: "Rara Lake",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    description: "Nepal's largest lake, a pristine jewel in the remote wilderness",
    location: "Mugu District",
    difficulty: "Moderate"
  },
  {
    id: 2,
    name: "Tsum Valley",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop",
    description: "Sacred valley of ancient Buddhist culture and traditions",
    location: "Gorkha District",
    difficulty: "Challenging"
  },
  {
    id: 3,
    name: "Dolpo Region",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop",
    description: "Remote trans-Himalayan region with Tibetan culture",
    location: "Dolpa District",
    difficulty: "Expert"
  },
  {
    id: 4,
    name: "Khopra Ridge",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    description: "Off-the-beaten-path trek with stunning Annapurna views",
    location: "Annapurna Region",
    difficulty: "Moderate"
  }
];

// Traveler Voices data
const travelerVoices = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop",
    location: "New York, USA",
    story: "Nepal changed my perspective on life. The warmth of the people and the majesty of the mountains created memories I'll treasure forever.",
    trip: "Everest Base Camp Trek",
    rating: 5,
    date: "March 2024"
  },
  {
    id: 2,
    name: "Marco Rodriguez",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop",
    location: "Barcelona, Spain",
    story: "The spiritual energy in Kathmandu's temples and the adventure in the Himalayas made this the trip of a lifetime.",
    trip: "Cultural Heritage Tour",
    rating: 5,
    date: "February 2024"
  },
  {
    id: 3,
    name: "Emma Thompson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop",
    location: "London, UK",
    story: "From the bustling streets of Thamel to the serene lakes of Pokhara, every moment was magical.",
    trip: "Nepal Highlights",
    rating: 5,
    date: "January 2024"
  }
];

// Cultural Insights data
const culturalInsights = [
  {
    id: 1,
    title: "Festival of Lights",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop",
    description: "Experience Tihar, Nepal's festival of lights, where every home glows with oil lamps and marigold garlands",
    category: "Festivals",
    readTime: "5 min read",
    author: "Local Expert",
    icon: "🪔"
  },
  {
    id: 2,
    title: "Mountain Monasteries",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop",
    description: "Discover the ancient Buddhist monasteries perched high in the Himalayas, where monks preserve centuries-old traditions",
    category: "Spirituality",
    readTime: "7 min read",
    author: "Cultural Guide",
    icon: "🏛️"
  },
  {
    id: 3,
    title: "Sherpa Heritage",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    description: "Learn about the legendary Sherpa people, their mountaineering culture, and their deep connection to the Himalayas",
    category: "People",
    readTime: "6 min read",
    author: "Mountain Guide",
    icon: "🏔️"
  },
  {
    id: 4,
    title: "Traditional Crafts",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop",
    description: "Explore Nepal's rich tradition of handicrafts, from intricate wood carvings to beautiful handwoven textiles",
    category: "Arts",
    readTime: "4 min read",
    author: "Artisan",
    icon: "🎨"
  }
];

const FeaturedDestinations = () => {
  // Enhanced state management for premium experience
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showLegend, setShowLegend] = useState<number | null>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

  // Add CSS animations
  const styles = `
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-blob {
      animation: blob 7s infinite;
    }
    
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    
    .animation-delay-4000 {
      animation-delay: 4s;
    }
    
    .animate-float {
      animation: float linear infinite;
    }
    
    .animate-fadeInUp {
      animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `;

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Filter options with icons for enhanced UX
  const filterOptions = [
    { id: 'all', label: 'All Destinations', icon: '🌍', count: destinations.length },
    { id: 'recommended', label: 'Recommended for You', icon: '⭐', count: destinations.filter(d => d.recommended).length },
    { id: 'nearby', label: 'Nearby', icon: '📍', count: destinations.filter(d => d.nearby).length },
    { id: 'adventure', label: 'Adventure', icon: '🏔️', count: destinations.filter(d => d.experiences.includes('Adventure')).length },
    { id: 'cultural', label: 'Cultural', icon: '🏛️', count: destinations.filter(d => d.experiences.includes('Cultural')).length },
    { id: 'spiritual', label: 'Spiritual', icon: '🙏', count: destinations.filter(d => d.experiences.includes('Spiritual')).length },
    { id: 'wildlife', label: 'Wildlife', icon: '🦏', count: destinations.filter(d => d.experiences.includes('Wildlife')).length },
    { id: 'seasonal', label: 'Seasonal', icon: '🌸', count: destinations.filter(d => d.isSeasonalFeatured).length }
  ];

  // Filter destinations based on active filter
  const filteredDestinations = destinations.filter(destination => {
    switch (activeFilter) {
      case 'recommended':
        return destination.recommended;
      case 'nearby':
        return destination.nearby;
      case 'adventure':
        return destination.experiences.includes('Adventure');
      case 'cultural':
        return destination.experiences.includes('Cultural');
      case 'spiritual':
        return destination.experiences.includes('Spiritual');
      case 'seasonal':
        return destination.isSeasonalFeatured;
      default:
        return true;
    }
  });

  // Tag color mapping
  const getTagColor = (color: string) => {
    const colors = {
      emerald: 'bg-emerald-500/90 text-white',
      blue: 'bg-blue-500/90 text-white',
      rose: 'bg-rose-500/90 text-white',
      purple: 'bg-purple-500/90 text-white',
      amber: 'bg-amber-500/90 text-white',
      green: 'bg-green-500/90 text-white'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500/90 text-white';
  };

  const parallaxRef = useRef<HTMLDivElement>(null);

  // Scroll effect for parallax and component initialization
  useEffect(() => {
    setIsLoaded(true);
    
    // Scroll animation handler
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = parseInt(entry.target.getAttribute('data-card-id') || '0');
            setVisibleCards(prev => new Set([...prev, cardId]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Observe all destination cards
    const cardElements = document.querySelectorAll('[data-card-id]');
    cardElements.forEach(el => observer.observe(el));

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [filteredDestinations]);

  // Get grid class based on card size for staggered layout
  const getGridClass = (size: string, index: number) => {
    switch (size) {
      case 'large':
        return 'md:col-span-2 md:row-span-2';
      case 'medium':
        return 'md:col-span-1 md:row-span-2';
      case 'small':
        return 'md:col-span-1 md:row-span-1';
      default:
        return 'md:col-span-1 md:row-span-1';
    }
  };

  const getCardHeight = (size: string) => {
    switch (size) {
      case 'large':
        return 'h-96 md:h-[500px]';
      case 'medium':
        return 'h-80 md:h-96';
      case 'small':
        return 'h-64 md:h-80';
      default:
        return 'h-80';
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white overflow-hidden">
      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(-5px) rotate(-1deg); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      {/* Animated Background Elements */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      >
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-300 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-green-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-5 h-5 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Premium Hero Section */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 text-transparent bg-clip-text mb-6 tracking-tight">
            Discover Nepal
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 font-light mb-8 max-w-3xl mx-auto leading-relaxed">
            Where every mountain tells a story, every temple whispers ancient wisdom, 
            and every trail leads to transformation
          </p>
          
          {/* Floating Icons */}
          <div className="flex justify-center space-x-6 mb-12 text-3xl">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>🏔️</span>
            <span className="animate-bounce" style={{ animationDelay: '0.5s' }}>🙏</span>
            <span className="animate-bounce" style={{ animationDelay: '1s' }}>🕉️</span>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className={`flex justify-center mb-8 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg border border-white/20">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              🔲 Grid View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                viewMode === 'map'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              🗺️ Map View
            </button>
          </div>
        </div>

        {/* Enhanced Dynamic Filter Section */}
        <div className={`mb-12 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveFilter(option.id)}
                className={`group relative px-6 py-3 rounded-full font-medium transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 ${
                  activeFilter === option.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/25'
                    : 'bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-white hover:shadow-lg border border-white/50 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                    {option.icon}
                  </span>
                  <span className="relative">
                    {option.label}
                    <div className={`absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                      activeFilter === option.id ? 'scale-x-100' : ''
                    }`} />
                  </span>
                  <span className={`ml-1 text-xs px-2 py-1 rounded-full transition-all duration-300 ${
                    activeFilter === option.id
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-100 text-blue-700 group-hover:bg-blue-200'
                  }`}>
                    {option.count}
                  </span>
                </div>
                
                {/* Enhanced glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
              </button>
            ))}
          </div>
          
          <p className="text-center text-slate-600 text-sm">
            Showing {filteredDestinations.length} destinations
          </p>
        </div>

        {/* Enhanced Map View */}
        {viewMode === 'map' && (
          <div className="mb-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="h-[500px] bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 flex items-center justify-center relative">
              <div className="text-center z-10">
                <div className="text-8xl mb-6 animate-pulse">🗺️</div>
                <h3 className="text-3xl font-bold text-slate-700 mb-4 font-['Poppins']">Interactive Nepal Map</h3>
                <p className="text-slate-600 text-lg font-['Inter']">Click on regions to explore destinations</p>
              </div>
              
              {/* Enhanced Map Markers with Glow Effect */}
              <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-red-500 rounded-full animate-pulse cursor-pointer hover:scale-150 transition-all duration-300 shadow-lg hover:shadow-red-500/50" title="Everest Region">
                <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-blue-500 rounded-full animate-pulse cursor-pointer hover:scale-150 transition-all duration-300 shadow-lg hover:shadow-blue-500/50" title="Annapurna Region" style={{ animationDelay: '0.5s' }}>
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <div className="absolute top-3/4 left-1/2 w-6 h-6 bg-green-500 rounded-full animate-pulse cursor-pointer hover:scale-150 transition-all duration-300 shadow-lg hover:shadow-green-500/50" title="Kathmandu Valley" style={{ animationDelay: '1s' }}>
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-purple-500 rounded-full animate-pulse cursor-pointer hover:scale-150 transition-all duration-300 shadow-lg hover:shadow-purple-500/50" title="Mustang" style={{ animationDelay: '1.5s' }}>
                <div className="absolute inset-0 bg-purple-400 rounded-full animate-ping opacity-75"></div>
              </div>
              
              {/* Floating Clouds */}
              <div className="absolute top-10 left-20 w-16 h-8 bg-white/30 rounded-full animate-float"></div>
              <div className="absolute top-20 right-32 w-20 h-10 bg-white/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
        )}

        {/* Premium Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredDestinations.map((destination, index) => (
            <div
              key={destination.id}
              data-card-id={destination.id}
              className={`group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 h-[420px] flex flex-col ${
                visibleCards.has(destination.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.1)'
              }}
              onMouseEnter={() => setHoveredCard(destination.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Image Container with Overlay */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                
                {/* Glowing Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400/50 rounded-t-2xl transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Seasonal Highlight Badge */}
                {destination.isSeasonalFeatured && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse shadow-lg">
                    <span>{destination.seasonalIcon}</span>
                    <span>Seasonal Highlight</span>
                  </div>
                )}
                
                {/* Floating Info Pills */}
                <div className={`absolute ${destination.isSeasonalFeatured ? 'top-16' : 'top-4'} left-4 flex flex-wrap gap-2`}>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm border border-white/20">
                    ✨ {destination.topExperience}
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm text-slate-700 px-3 py-1 rounded-full text-xs font-medium shadow-lg border border-white/20">
                    🏔️ {destination.elevation}
                  </div>
                </div>
                
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <div className="bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg border border-white/20 group-hover:scale-105 transition-transform duration-300">
                    📅 {destination.bestTime}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm border border-white/20 group-hover:scale-105 transition-transform duration-300 ${
                    destination.difficulty === 'Easy' ? 'bg-green-500/90 text-white' :
                    destination.difficulty === 'Moderate' ? 'bg-yellow-500/90 text-white' :
                    'bg-red-500/90 text-white'
                  }`}>
                    ⚡ {destination.difficulty}
                  </div>
                </div>

                {/* Enhanced Traveler Stories Overlay */}
                {hoveredCard === destination.id && destination.travelerStories && (
                  <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-emerald-900/80 backdrop-blur-md flex items-center justify-center p-6 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
                    <div className="text-center text-white max-w-sm">
                      <div className="mb-4">
                        <h4 className="text-xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                          Traveler Stories
                        </h4>
                        <div className="w-16 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto rounded-full" />
                      </div>
                      
                      <div className="space-y-4">
                        {destination.travelerStories.map((story, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-start gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                            style={{ animationDelay: `${idx * 150}ms` }}
                          >
                            <img
                              src={story.avatar}
                              alt="Traveler"
                              className="w-12 h-12 rounded-full border-2 border-emerald-400/50 shadow-lg flex-shrink-0"
                            />
                            <div className="text-left">
                              <p className="text-sm italic leading-relaxed text-gray-100">
                                "{story.review}"
                              </p>
                              <div className="flex items-center gap-1 mt-2">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className="text-yellow-400 text-xs">★</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 text-xs text-emerald-200 opacity-80">
                        Hover to explore more stories
                      </div>
                    </div>
                  </div>
                )}

                {/* Poetic Tagline */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-medium italic opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    "{destination.poeticSubtitle}"
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 leading-tight font-['Poppins'] group-hover:text-blue-600 transition-colors duration-300">{destination.name}</h3>
                    <p className="text-sm text-slate-500 mb-2 font-['Inter']">{destination.region}</p>
                    
                    {/* Poetic Subtitle */}
                    <p className="text-sm italic text-blue-700 font-medium opacity-80 group-hover:opacity-100 transition-opacity duration-300 font-['Manrope']">
                      "{destination.poeticSubtitle}"
                    </p>
                  </div>
                  <button className="w-8 h-8 bg-slate-100 hover:bg-red-50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group/heart">
                    <span className="text-slate-400 group-hover/heart:text-red-500 transition-colors duration-200">♥</span>
                  </button>
                </div>
                
                {/* Seasonal Highlight Info */}
                {destination.seasonalHighlight && (
                  <div className="mb-3 p-2 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200/50">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{destination.seasonalIcon}</span>
                      <span className="font-medium text-orange-800 font-['Inter']">{destination.seasonalHighlight}</span>
                    </div>
                  </div>
                )}
                
                <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-1 font-['Inter'] leading-relaxed">{destination.description}</p>
                
                {/* Enhanced Metadata */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                      <span>📍</span>
                      <span className="font-['Inter']">{destination.region}</span>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                      <span>⏱️</span>
                      <span className="font-['Inter']">{destination.bestTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-blue-600">
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                      <span className="font-['Inter']">{destination.topExperience}</span>
                    </div>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-600 font-['Inter']">
                      {destination.duration}
                    </span>
                  </div>
                </div>
                
                {/* Activities */}
                <div className="flex space-x-2 mb-4">
                  {destination.activities.map((activity, idx) => (
                    <span key={idx} className="text-lg hover:scale-125 transition-transform cursor-pointer">
                      {activity}
                    </span>
                  ))}
                </div>
                
                {/* CTA Button */}
                <button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm font-['Poppins']"
                  onClick={() => setShowLegend(destination.id)}
                >
                  Explore Journey
                </button>
              </div>

              {/* Local Legend Popup */}
              {showLegend === destination.id && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 z-20 animate-fadeIn">
                  <div className="bg-white rounded-2xl p-6 max-w-md text-center">
                    <h4 className="text-xl font-bold text-slate-800 mb-3 font-['Poppins']">Local Legend</h4>
                    <p className="text-slate-600 mb-4 font-['Inter'] leading-relaxed">{destination.localLegend}</p>
                    <button 
                      onClick={() => setShowLegend(null)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Enhanced Hidden Treasures Section with Advanced Animations */}
        <div className="mb-24 relative">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-green-200/30 to-cyan-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="text-6xl animate-bounce">💎</span>
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-6 font-['Poppins']">
                Hidden Treasures
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto font-['Inter'] leading-relaxed">
                Discover Nepal's best-kept secrets, away from the crowds, where ancient stories whisper through untouched landscapes
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 mx-auto mt-6 rounded-full animate-pulse"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(hiddenTreasures || []).map((treasure, index) => (
                <div 
                  key={treasure.id} 
                  className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-6 hover:rotate-1 bg-white"
                  style={{ 
                    animationDelay: `${index * 0.15}s`,
                    transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '2deg' : '-2deg'})`,
                  }}
                >
                  {/* Glowing Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                  <div className="relative bg-white rounded-3xl overflow-hidden">
                    <img
                      src={treasure.image}
                      alt={treasure.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-1000 group-hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/70"></div>
                    
                    {/* Animated Floating Badge */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg animate-pulse group-hover:animate-bounce">
                      <span className="mr-1">💎</span>
                      Hidden Gem
                    </div>
                    
                    {/* Difficulty Badge */}
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium border border-white/30">
                      {treasure.difficulty}
                    </div>
                    
                    {/* Sparkle Effects */}
                    <div className="absolute top-8 right-8 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping">
                      ✨
                    </div>
                    <div className="absolute top-16 right-12 text-yellow-200 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-ping" style={{ animationDelay: '0.5s' }}>
                      ⭐
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-2 font-['Poppins'] group-hover:text-emerald-300 transition-colors duration-300">{treasure.name}</h3>
                      <p className="text-sm opacity-90 italic mb-2 font-['Manrope'] group-hover:opacity-100 transition-opacity duration-300">"Where ancient stories whisper"</p>
                      <p className="text-xs opacity-75 font-['Inter'] flex items-center gap-1 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-emerald-300">📍</span>
                        {treasure.location || 'Remote Nepal'}
                      </p>
                      <p className="text-xs opacity-75 font-['Inter'] mt-2 line-clamp-2 group-hover:opacity-100 transition-opacity duration-300">{treasure.description}</p>
                      
                      {/* Enhanced Discover Button */}
                      <button className="mt-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-emerald-500/40 hover:to-teal-500/40 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 hover:scale-105 shadow-lg">
                        <span className="flex items-center gap-2">
                          <span>🔍</span>
                          Discover Secret
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Call to Action for More Hidden Gems */}
            <div className="text-center mt-16">
              <button className="group bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 shadow-xl font-['Poppins'] relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  <span className="group-hover:rotate-12 transition-transform duration-300">🗺️</span>
                  Explore More Hidden Gems
                </span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Traveler Voices Section with Interactive Elements */}
        <div className="mb-24 relative">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="text-6xl animate-bounce">💬</span>
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-6 font-['Poppins']">
                Traveler Voices
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto font-['Inter'] leading-relaxed">
                Real stories from fellow adventurers who found their souls in the Himalayas
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto mt-6 rounded-full animate-pulse"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {(travelerVoices || []).map((voice, index) => (
                <div 
                  key={voice.id} 
                  className="group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 hover:rotate-1 border border-white/20 overflow-hidden"
                  style={{ 
                    animationDelay: `${index * 0.2}s`,
                    transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '2deg' : '-2deg'})`,
                  }}
                >
                  {/* Glowing Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-400 to-orange-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                  <div className="relative bg-white/95 rounded-3xl p-8 -m-8">
                    
                    {/* Quote Icon */}
                    <div className="absolute top-4 right-4 text-4xl text-orange-200 group-hover:text-orange-300 transition-colors duration-300 opacity-50 group-hover:opacity-100">
                      💬
                    </div>
                    
                    {/* Avatar */}
                    <div className="flex items-center mb-6">
                      <img 
                        src={voice.avatar} 
                        alt={voice.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-orange-200 group-hover:border-orange-300 transition-colors duration-300"
                      />
                      <div className="ml-4">
                        <h3 className="font-bold text-slate-800 text-lg font-['Poppins']">{voice.name}</h3>
                        <p className="text-slate-500 text-sm font-['Inter']">{voice.location}</p>
                      </div>
                    </div>
                    
                    {/* Story */}
                    <p className="text-slate-600 font-['Inter'] leading-relaxed mb-6 italic">
                      "{voice.story}"
                    </p>
                    
                    {/* Trip Info */}
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                      <span className="font-medium">{voice.trip}</span>
                      <span>{voice.date}</span>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {[...Array(voice.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-lg">⭐</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* View More Button */}
            <div className="text-center mt-16">
              <button className="group bg-gradient-to-r from-orange-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-orange-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-xl font-['Poppins'] relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  <span className="group-hover:rotate-12 transition-transform duration-300">💬</span>
                  Read More Stories
                </span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Cultural Insights Section with Interactive Elements */}
        <div className="mb-24 relative">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="text-6xl animate-bounce">🏛️</span>
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-6 font-['Poppins']">
                Cultural Insights
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto font-['Inter'] leading-relaxed">
                Immerse yourself in the rich tapestry of Nepal's ancient traditions, vibrant festivals, and timeless wisdom
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 mx-auto mt-6 rounded-full animate-pulse"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(culturalInsights || []).map((insight, index) => (
                <div 
                  key={index} 
                  className="group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-6 hover:rotate-2 border border-white/20 overflow-hidden"
                  style={{ 
                    animationDelay: `${index * 0.15}s`,
                    transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '2deg' : '-2deg'})`,
                  }}
                >
                  {/* Glowing Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                  <div className="relative bg-white rounded-3xl p-8 text-center">
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg animate-pulse">
                      {insight.category}
                    </div>
                    
                    {/* Sparkle Effects */}
                    <div className="absolute top-6 left-6 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping">
                      ✨
                    </div>
                    
                    <div className="text-6xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                      {insight.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-4 font-['Poppins'] group-hover:text-amber-600 transition-colors duration-300">
                      {insight.title}
                    </h3>
                    
                    <p className="text-slate-600 font-['Inter'] leading-relaxed text-sm mb-4 group-hover:text-slate-700 transition-colors">
                      {insight.description}
                    </p>
                    
                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <span className="flex items-center gap-1">
                        <span>📖</span>
                        {insight.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>👤</span>
                        {insight.author}
                      </span>
                    </div>
                    
                    {/* Enhanced Learn More Button */}
                    <button className="w-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-200 text-amber-700 px-4 py-2 rounded-full text-sm font-medium hover:from-amber-500/40 hover:to-orange-500/40 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 hover:scale-105 shadow-lg">
                      <span className="flex items-center justify-center gap-2">
                        <span>📚</span>
                        Explore Culture
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Call to Action for Cultural Experiences */}
            <div className="text-center mt-16">
              <button className="group bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 hover:scale-105 shadow-xl font-['Poppins'] relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  <span className="group-hover:rotate-12 transition-transform duration-300">🎭</span>
                  Experience Nepal's Culture
                </span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="relative text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-16 text-white overflow-hidden">
          {/* Background Animation */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-float"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-6xl font-bold mb-6 font-['Poppins']">Ready for Your Nepal Adventure?</h2>
            <p className="text-2xl mb-10 opacity-90 font-['Manrope'] italic max-w-4xl mx-auto leading-relaxed">
              "Every mountain tells a story. Let us help you create memories that will last a lifetime, where every step becomes a cherished chapter in your journey."
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="group bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl font-['Poppins']">
                <span className="group-hover:hidden">Plan Your Trip</span>
                <span className="hidden group-hover:inline">✈️ Start Planning</span>
              </button>
              <button className="group border-2 border-white text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105 shadow-xl font-['Poppins']">
                <span className="group-hover:hidden">Contact Expert</span>
                <span className="hidden group-hover:inline">💬 Get Expert Help</span>
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-80">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <span className="font-['Inter']">Award Winning</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                <span className="font-['Inter']">100% Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span className="font-['Inter']">5000+ Happy Travelers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;