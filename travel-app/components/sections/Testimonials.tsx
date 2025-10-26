'use client';

import { useState } from 'react';
import { BookOpen, MapPin, Calendar, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const travelerStories = [
  {
    id: 1,
    title: "Finding Peace in Dolpo's Silence",
    author: "Sarah Chen",
    location: "Upper Dolpo",
    date: "March 2024",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop",
    quote: "I found peace in Dolpo's silence.",
    preview: "Three weeks in the remote valleys taught me that sometimes the most profound conversations happen without words...",
    category: "Spiritual Journey",
    readTime: "8 min read"
  },
  {
    id: 2,
    title: "Sunrise Over Everest",
    author: "Marcus Rodriguez",
    location: "Everest Base Camp",
    date: "October 2023",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=600&fit=crop",
    quote: "The mountain whispered secrets only dawn could hear.",
    preview: "Standing at 5,364 meters, watching the first light kiss the world's highest peak...",
    category: "Adventure",
    readTime: "12 min read"
  },
  {
    id: 3,
    title: "Tea with Grandmother Pema",
    author: "Emma Thompson",
    location: "Langtang Valley",
    date: "December 2023",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=700&fit=crop",
    quote: "Her wrinkled hands held stories of a thousand seasons.",
    preview: "In a small teahouse, an 82-year-old woman taught me more about life than any book ever could...",
    category: "Cultural",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "Rhino Encounter in Chitwan",
    author: "David Park",
    location: "Chitwan National Park",
    date: "February 2024",
    image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&h=800&fit=crop",
    quote: "Eye to eye with ancient wisdom.",
    preview: "The one-horned rhinoceros stood just meters away, a living reminder of Nepal's wild heart...",
    category: "Wildlife",
    readTime: "10 min read"
  },
  {
    id: 5,
    title: "Prayer Flags and Promises",
    author: "Lisa Wang",
    location: "Gokyo Lakes",
    date: "April 2024",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
    quote: "Each flag carried a prayer to the wind.",
    preview: "At 4,790 meters, surrounded by turquoise lakes and snow-capped peaks, I understood why this place is sacred...",
    category: "Spiritual Journey",
    readTime: "7 min read"
  },
  {
    id: 6,
    title: "The Last Honey Hunter",
    author: "James Mitchell",
    location: "Annapurna Region",
    date: "May 2024",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=900&fit=crop",
    quote: "Tradition hanging by a thread, 300 feet above the ground.",
    preview: "Witnessing the ancient art of cliff honey hunting, where courage meets tradition in the most spectacular way...",
    category: "Cultural",
    readTime: "15 min read"
  }
];

const StoriesFromNepal = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Spiritual Journey': 'bg-purple-100 text-purple-800',
      'Adventure': 'bg-orange-100 text-orange-800',
      'Cultural': 'bg-blue-100 text-blue-800',
      'Wildlife': 'bg-green-100 text-green-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Clean Minimal Background */}
      <div className="absolute inset-0">
        {/* Subtle Blue/Gray Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/50 to-gray-100/30"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-100/20 to-gray-200/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-gray-100/30 to-blue-50/20 rounded-full blur-2xl"></div>
        
        {/* Minimal Geometric Elements */}
        <div className="absolute top-32 left-32 w-6 h-6 border border-blue-200/40 rotate-45 rounded-sm"></div>
        <div className="absolute bottom-32 right-32 w-4 h-4 border border-gray-300/40 rounded-full"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
            Stories from Nepal
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Real journeys, authentic experiences, and the moments that transform travelers into storytellers
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {travelerStories.map((story, index) => (
            <div
              key={story.id}
              className={`break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer group border border-gray-100 ${
                index % 3 === 0 ? 'mb-8' : index % 3 === 1 ? 'mb-6' : 'mb-4'
              }`}
              onMouseEnter={() => setHoveredCard(story.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <Image
                  src={story.image}
                  alt={story.title}
                  width={600}
                  height={index % 4 === 0 ? 800 : index % 4 === 1 ? 600 : index % 4 === 2 ? 700 : 900}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay with Quote */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
                  hoveredCard === story.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="absolute bottom-6 left-6 right-6">
                    <blockquote className="text-white text-lg md:text-xl font-light italic leading-relaxed">
                      "{story.quote}"
                    </blockquote>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(story.category)}`}>
                    {story.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {story.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {story.date}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {story.title}
                </h3>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {story.preview}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {story.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{story.author}</p>
                      <p className="text-xs text-gray-500">{story.readTime}</p>
                    </div>
                  </div>

                  <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-300 group">
                    <BookOpen className="w-4 h-4 mr-1" />
                    Read Story
                    <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Stories CTA */}
        <div className="text-center mt-16">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            View All Stories
          </button>
        </div>
      </div>
    </section>
  );
};

export default StoriesFromNepal;