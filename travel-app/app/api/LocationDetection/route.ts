import { NextRequest, NextResponse } from 'next/server';

// Types
interface Destination {
  id: number;
  name: string;
  image: string;
  distance: number;
  category: string;
  rating: number;
  tagline: string;
  tags: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  weatherInfo?: {
    temperature: number;
    condition: string;
    emoji: string;
  };
}

interface LocationInfo {
  city: string;
  area: string;
  country: string;
  state: string;
}

// Sample destinations database with coordinates
const destinationsDatabase: (Destination & { baseCoordinates: { lat: number; lng: number } })[] = [
  {
    id: 1,
    name: "Sarangkot Viewpoint",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    distance: 0,
    category: "Viewpoint",
    rating: 4.8,
    tagline: "Sunrise views over the Annapurna range",
    tags: ["Sunrise", "Mountain Views", "Photography"],
    coordinates: { lat: 28.2096, lng: 83.9856 },
    baseCoordinates: { lat: 28.2096, lng: 83.9856 },
    weatherInfo: { temperature: 18, condition: "Clear", emoji: "🌤️" }
  },
  {
    id: 2,
    name: "Phewa Lake",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop",
    distance: 0,
    category: "Lake",
    rating: 4.6,
    tagline: "Serene lake perfect for boating and reflection",
    tags: ["Boating", "Peaceful", "Locals' Favorite"],
    coordinates: { lat: 28.2096, lng: 83.9856 },
    baseCoordinates: { lat: 28.2096, lng: 83.9856 },
    weatherInfo: { temperature: 22, condition: "Partly Cloudy", emoji: "⛅" }
  },
  {
    id: 3,
    name: "World Peace Pagoda",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=600&fit=crop",
    distance: 0,
    category: "Temple",
    rating: 4.7,
    tagline: "Buddhist stupa with panoramic valley views",
    tags: ["Spiritual", "Hidden Gem", "Hiking"],
    coordinates: { lat: 28.2096, lng: 83.9856 },
    baseCoordinates: { lat: 28.2096, lng: 83.9856 },
    weatherInfo: { temperature: 16, condition: "Sunny", emoji: "☀️" }
  },
  {
    id: 4,
    name: "Devi's Fall",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    distance: 0,
    category: "Waterfall",
    rating: 4.4,
    tagline: "Mysterious waterfall that disappears underground",
    tags: ["Nature", "Adventure", "Photography"],
    coordinates: { lat: 28.1951, lng: 83.9856 },
    baseCoordinates: { lat: 28.1951, lng: 83.9856 },
    weatherInfo: { temperature: 20, condition: "Misty", emoji: "🌫️" }
  },
  {
    id: 5,
    name: "Everest Base Camp",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    distance: 0,
    category: "Trekking",
    rating: 4.9,
    tagline: "Journey to the base of the world's highest peak",
    tags: ["Adventure", "Trekking", "Bucket List"],
    coordinates: { lat: 28.0026, lng: 86.8528 },
    baseCoordinates: { lat: 28.0026, lng: 86.8528 },
    weatherInfo: { temperature: -5, condition: "Snow", emoji: "❄️" }
  },
  {
    id: 6,
    name: "Annapurna Base Camp",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop",
    distance: 0,
    category: "Trekking",
    rating: 4.8,
    tagline: "Trek through rhododendron forests to mountain sanctuary",
    tags: ["Trekking", "Nature", "Mountain Views"],
    coordinates: { lat: 28.5314, lng: 83.8731 },
    baseCoordinates: { lat: 28.5314, lng: 83.8731 },
    weatherInfo: { temperature: 8, condition: "Cloudy", emoji: "☁️" }
  },
  {
    id: 7,
    name: "Chitwan National Park",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop",
    distance: 0,
    category: "Wildlife",
    rating: 4.5,
    tagline: "Safari adventure in Nepal's premier wildlife reserve",
    tags: ["Wildlife", "Safari", "Nature"],
    coordinates: { lat: 27.5291, lng: 84.3542 },
    baseCoordinates: { lat: 27.5291, lng: 84.3542 },
    weatherInfo: { temperature: 28, condition: "Humid", emoji: "🌴" }
  },
  {
    id: 8,
    name: "Kathmandu Durbar Square",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=600&fit=crop",
    distance: 0,
    category: "Heritage",
    rating: 4.3,
    tagline: "Ancient royal palace complex with stunning architecture",
    tags: ["Cultural", "Heritage", "Architecture"],
    coordinates: { lat: 27.7041, lng: 85.3077 },
    baseCoordinates: { lat: 27.7041, lng: 85.3077 },
    weatherInfo: { temperature: 24, condition: "Pleasant", emoji: "🌞" }
  }
];

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

// Reverse geocoding function (simplified - in production use Google Maps API)
async function reverseGeocode(lat: number, lng: number): Promise<LocationInfo> {
  // This is a simplified version. In production, you'd use a real geocoding service
  // For now, we'll determine location based on coordinates
  
  if (lat >= 28.0 && lat <= 28.3 && lng >= 83.8 && lng <= 84.2) {
    return {
      city: "Pokhara",
      area: "Lakeside",
      country: "Nepal",
      state: "Gandaki Province"
    };
  } else if (lat >= 27.6 && lat <= 27.8 && lng >= 85.2 && lng <= 85.4) {
    return {
      city: "Kathmandu",
      area: "Thamel",
      country: "Nepal",
      state: "Bagmati Province"
    };
  } else if (lat >= 27.4 && lat <= 27.6 && lng >= 84.2 && lng <= 84.5) {
    return {
      city: "Chitwan",
      area: "Sauraha",
      country: "Nepal",
      state: "Bagmati Province"
    };
  } else {
    return {
      city: "Nepal",
      area: "Unknown",
      country: "Nepal",
      state: "Unknown"
    };
  }
}

// Generate weather info based on location and season
function generateWeatherInfo(lat: number, lng: number): { temperature: number; condition: string; emoji: string } {
  const altitude = lat > 28.0 ? "high" : "low";
  const season = new Date().getMonth();
  
  let baseTemp = altitude === "high" ? 15 : 25;
  let condition = "Clear";
  let emoji = "☀️";
  
  // Adjust for season (simplified)
  if (season >= 11 || season <= 2) { // Winter
    baseTemp -= 10;
    condition = "Cold";
    emoji = "❄️";
  } else if (season >= 6 && season <= 9) { // Monsoon
    baseTemp += 5;
    condition = "Rainy";
    emoji = "🌧️";
  }
  
  // Add some randomness
  baseTemp += Math.floor(Math.random() * 10) - 5;
  
  return { temperature: baseTemp, condition, emoji };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lat, lng, radius = 50 } = body; // Default radius 50km

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Get location information
    const locationInfo = await reverseGeocode(lat, lng);

    // Calculate distances and filter nearby destinations
    const nearbyDestinations = destinationsDatabase
      .map(destination => {
        const distance = calculateDistance(lat, lng, destination.baseCoordinates.lat, destination.baseCoordinates.lng);
        return {
          ...destination,
          distance,
          weatherInfo: generateWeatherInfo(destination.baseCoordinates.lat, destination.baseCoordinates.lng)
        };
      })
      .filter(destination => destination.distance <= radius)
      .sort((a, b) => a.distance - b.distance) // Sort by distance
      .slice(0, 6); // Limit to 6 destinations

    // If no destinations found within radius, get closest ones
    if (nearbyDestinations.length === 0) {
      const closestDestinations = destinationsDatabase
        .map(destination => {
          const distance = calculateDistance(lat, lng, destination.baseCoordinates.lat, destination.baseCoordinates.lng);
          return {
            ...destination,
            distance,
            weatherInfo: generateWeatherInfo(destination.baseCoordinates.lat, destination.baseCoordinates.lng)
          };
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 4);

      return NextResponse.json({
        success: true,
        location: locationInfo,
        destinations: closestDestinations,
        message: `No destinations found within ${radius}km. Showing closest destinations instead.`,
        userCoordinates: { lat, lng }
      });
    }

    return NextResponse.json({
      success: true,
      location: locationInfo,
      destinations: nearbyDestinations,
      message: `Found ${nearbyDestinations.length} destinations near ${locationInfo.city}`,
      userCoordinates: { lat, lng }
    });

  } catch (error) {
    console.error('Location detection error:', error);
    return NextResponse.json(
      { error: 'Failed to process location data' },
      { status: 500 }
    );
  }
}

// GET method for testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '28.2096');
  const lng = parseFloat(searchParams.get('lng') || '83.9856');
  const radius = parseInt(searchParams.get('radius') || '50');

  try {
    const locationInfo = await reverseGeocode(lat, lng);
    
    const nearbyDestinations = destinationsDatabase
      .map(destination => {
        const distance = calculateDistance(lat, lng, destination.baseCoordinates.lat, destination.baseCoordinates.lng);
        return {
          ...destination,
          distance,
          weatherInfo: generateWeatherInfo(destination.baseCoordinates.lat, destination.baseCoordinates.lng)
        };
      })
      .filter(destination => destination.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 6);

    return NextResponse.json({
      success: true,
      location: locationInfo,
      destinations: nearbyDestinations,
      message: `Found ${nearbyDestinations.length} destinations near ${locationInfo.city}`,
      userCoordinates: { lat, lng }
    });

  } catch (error) {
    console.error('Location detection error:', error);
    return NextResponse.json(
      { error: 'Failed to process location data' },
      { status: 500 }
    );
  }
}