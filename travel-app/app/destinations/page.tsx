'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Heart, Filter, Grid, List } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Destination {
  id: string;
  name: string;
  nameNepali: string;
  description: string;
  location: string;
  images: string[];
  category: string;
  featured: boolean;
  rating: number;
  reviewCount: number;
  price: number;
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'सबै', nameEn: 'All' },
    { id: 'mountain', name: 'पहाड', nameEn: 'Mountains' },
    { id: 'cultural', name: 'सांस्कृतिक', nameEn: 'Cultural' },
    { id: 'adventure', name: 'साहसिक', nameEn: 'Adventure' },
    { id: 'religious', name: 'धार्मिक', nameEn: 'Religious' },
    { id: 'wildlife', name: 'वन्यजन्तु', nameEn: 'Wildlife' },
  ];

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockDestinations: Destination[] = [
      {
        id: '1',
        name: 'Everest Base Camp',
        nameNepali: 'एभरेस्ट बेस क्याम्प',
        description: 'विश्वको सर्वोच्च शिखरको आधार शिविरमा पुग्ने अविस्मरणीय यात्रा',
        location: 'सोलुखुम्बु',
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4'],
        category: 'mountain',
        featured: true,
        rating: 4.9,
        reviewCount: 1250,
        price: 150000,
      },
      {
        id: '2',
        name: 'Pokhara',
        nameNepali: 'पोखरा',
        description: 'तालहरूको शहर र अन्नपूर्ण हिमालको सुन्दर दृश्य',
        location: 'गण्डकी प्रदेश',
        images: ['https://images.unsplash.com/photo-1605640840605-14ac1855827b'],
        category: 'cultural',
        featured: true,
        rating: 4.8,
        reviewCount: 890,
        price: 25000,
      },
      {
        id: '3',
        name: 'Chitwan National Park',
        nameNepali: 'चितवन राष्ट्रिय निकुञ्ज',
        description: 'गैंडा र बाघ देख्न सकिने नेपालको पहिलो राष्ट्रिय निकुञ्ज',
        location: 'चितवन',
        images: ['https://images.unsplash.com/photo-1549366021-9f761d040a94'],
        category: 'wildlife',
        featured: true,
        rating: 4.7,
        reviewCount: 650,
        price: 35000,
      },
      {
        id: '4',
        name: 'Lumbini',
        nameNepali: 'लुम्बिनी',
        description: 'भगवान बुद्धको जन्मस्थान र विश्व सम्पदा सूचीमा सूचीकृत',
        location: 'लुम्बिनी प्रदेश',
        images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa'],
        category: 'religious',
        featured: true,
        rating: 4.6,
        reviewCount: 420,
        price: 15000,
      },
    ];

    setTimeout(() => {
      setDestinations(mockDestinations);
      setFilteredDestinations(mockDestinations);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = destinations;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(dest => dest.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.nameNepali.includes(searchQuery) ||
        dest.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDestinations(filtered);
  }, [destinations, selectedCategory, searchQuery]);

  const DestinationCard = ({ destination }: { destination: Destination }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`card hover:shadow-2xl transition-all duration-300 ${
        viewMode === 'list' ? 'flex flex-row' : ''
      }`}
    >
      <div className={`relative ${viewMode === 'list' ? 'w-1/3' : 'h-48'} overflow-hidden`}>
        <Image
          src={destination.images[0]}
          alt={destination.name}
          fill
          className="object-cover hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors duration-200">
            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
          </button>
        </div>
        {destination.featured && (
          <div className="absolute top-4 left-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            विशेष
          </div>
        )}
      </div>

      <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{destination.name}</h3>
            <p className="text-lg text-gray-600 nepali-text">{destination.nameNepali}</p>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{destination.rating}</span>
            <span className="text-sm text-gray-500">({destination.reviewCount})</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm nepali-text">{destination.location}</span>
        </div>

        <p className="text-gray-700 mb-4 nepali-text line-clamp-2">
          {destination.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-blue-600">
              रू {destination.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 nepali-text"> प्रति व्यक्ति</span>
          </div>
          <Link
            href={`/destinations/${destination.id}`}
            className="btn-primary"
          >
            <span className="nepali-text">विवरण हेर्नुहोस्</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 nepali-text">
              गन्तव्यहरू अन्वेषण गर्नुहोस्
            </h1>
            <p className="text-xl text-gray-600 nepali-text">
              नेपालका सुन्दर ठाउँहरू खोज्नुहोस् र आफ्नो अर्को यात्राको योजना बनाउनुहोस्
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="गन्तव्य खोज्नुहोस्..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 nepali-text"
              />
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field nepali-text"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-300 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-300" />
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2" />
                  <div className="h-4 bg-gray-300 rounded w-2/3 mb-4" />
                  <div className="h-3 bg-gray-300 rounded mb-2" />
                  <div className="h-3 bg-gray-300 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 nepali-text">
                {filteredDestinations.length} गन्तव्यहरू फेला परे
              </p>
            </div>

            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredDestinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>

            {filteredDestinations.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MapPin className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2 nepali-text">
                  कुनै गन्तव्य फेला परेन
                </h3>
                <p className="text-gray-600 nepali-text">
                  कृपया आफ्नो खोज शब्द परिवर्तन गर्नुहोस् वा फिल्टर हटाउनुहोस्
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}