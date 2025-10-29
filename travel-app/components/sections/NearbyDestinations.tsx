'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Navigation, Eye, Star, Clock, Thermometer, Filter, Search, X, ChevronDown } from 'lucide-react';



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
  isFromAPI?: boolean;
  source?: string;
}

interface UserLocation {
  lat: number;
  lng: number;
  city?: string;
  area?: string;
}

interface SearchFilters {
  radiusInKm: number;
  category: string;
  minRating: number;
  maxDistance: number;
}

// Mock data for nearby destinations
const mockDestinations: Destination[] = [
  {
    id: 1,
    name: "Sarangkot Viewpoint",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    distance: 2.3,
    category: "Viewpoint",
    rating: 4.8,
    tagline: "Sunrise views over the Annapurna range",
    tags: ["Sunrise", "Mountain Views", "Photography"],
    coordinates: { lat: 28.2096, lng: 83.9856 },
    weatherInfo: { temperature: 18, condition: "Clear", emoji: "🌤️" }
  },
  {
    id: 2,
    name: "Phewa Lake",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop",
    distance: 1.8,
    category: "Lake",
    rating: 4.6,
    tagline: "Serene lake perfect for boating and reflection",
    tags: ["Boating", "Peaceful", "Locals' Favorite"],
    coordinates: { lat: 28.2096, lng: 83.9856 },
    weatherInfo: { temperature: 22, condition: "Partly Cloudy", emoji: "⛅" }
  },
  {
    id: 3,
    name: "World Peace Pagoda",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    distance: 4.7,
    category: "Temple",
    rating: 4.7,
    tagline: "Buddhist stupa with panoramic valley views",
    tags: ["Spiritual", "Hidden Gem", "Hiking"],
    coordinates: { lat: 28.2096, lng: 83.9856 },
    weatherInfo: { temperature: 16, condition: "Sunny", emoji: "☀️" }
  },
  {
    id: 4,
    name: "Devi's Fall",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    distance: 3.2,
    category: "Waterfall",
    rating: 4.4,
    tagline: "Mysterious waterfall that disappears underground",
    tags: ["Nature", "Adventure", "Photography"],
    coordinates: { lat: 28.2096, lng: 83.9856 },
    weatherInfo: { temperature: 20, condition: "Misty", emoji: "🌫️" }
  }
];

// Available categories for filtering
const categories = [
  "Viewpoint",
  "Lake", 
  "Temple",
  "Waterfall",
  "Trekking",
  "Wildlife",
  "Heritage",
  "Adventure",
  "Nature"
];

const NearbyDestinations = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>(mockDestinations); // Initialize with mock data
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Track if component is mounted
  const sectionRef = useRef<HTMLDivElement>(null);

  // Search filters state
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    radiusInKm: 50,
    category: "",
    minRating: 0,
    maxDistance: 1000
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Test API connectivity
  const testExternalAPI = async () => {
    console.log('🧪 Testing external API connectivity...');
    try {
      const testPayload = {
        latitude: 27.7172,
        longitude: 85.3240,
        radiusInKm: 50,
        category: "",
        minRating: 0,
        maxDistance: 1000
      };
      
      console.log('🧪 Test payload:', testPayload);
      
      const response = await fetch('https://travelguide-rttu.onrender.com/api/LocationDetection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(testPayload),
        signal: AbortSignal.timeout(15000) // 15 second timeout for test
      });
      
      console.log('🧪 Test response status:', response.status, response.statusText);
      console.log('🧪 Test response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ External API test successful!', data);
        return { success: true, data };
      } else {
        const errorText = await response.text();
        console.error('❌ External API test failed:', errorText);
        return { success: false, error: `${response.status}: ${errorText}` };
      }
    } catch (error) {
      console.error('❌ External API test error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };



  // Get user's current location using built-in JavaScript geolocation
  const getCurrentLocation = async () => {
    return new Promise<void>((resolve, reject) => {
      // Only run on client-side
      if (typeof window === 'undefined') {
        reject(new Error('Not running on client-side'));
        return;
      }

      setLoading(true);
      setLocationError(null);

      // Check if geolocation is available and not hijacked by extensions
      if (!navigator.geolocation || typeof navigator.geolocation.getCurrentPosition !== 'function') {
        const errorMsg = "Geolocation is not supported by this browser. Showing popular destinations instead.";
        setLocationError(errorMsg);
        setDestinations(mockDestinations);
        setLoading(false);
        setUserLocation({
          lat: 0,
          lng: 0,
          city: 'Location Unavailable',
          area: errorMsg
        });
        reject(new Error(errorMsg));
        return;
      }

      // Create a unique message channel ID to avoid conflicts
      const messageId = `geo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Set up message listener for isolated communication
      const messageHandler = async (event: MessageEvent) => {
        if (event.data?.type !== messageId) return;
        
        try {
          if (event.data.success) {
            const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed } = event.data.position.coords;
            const timestamp = event.data.position.timestamp;
            
            // Enhanced debugging for location data
            console.log('=== GEOLOCATION DEBUG INFO ===');
            console.log(`Coordinates: ${latitude}, ${longitude}`);
            console.log(`Accuracy: ${accuracy}m`);
            console.log(`Altitude: ${altitude}m (accuracy: ${altitudeAccuracy}m)`);
            console.log(`Heading: ${heading}°, Speed: ${speed}m/s`);
            console.log(`Timestamp: ${new Date(timestamp).toISOString()}`);
            console.log(`Age: ${Date.now() - timestamp}ms`);
            
            // Validate coordinates
            const isValidLat = latitude >= -90 && latitude <= 90;
            const isValidLng = longitude >= -180 && longitude <= 180;
            const isReasonableAccuracy = accuracy <= 10000; // 10km max
            
            console.log('Coordinate validation:', {
              isValidLat,
              isValidLng,
              isReasonableAccuracy,
              accuracy: `${accuracy}m`
            });
            
            // Check for common default/fallback coordinates
            const isWashingtonDC = Math.abs(latitude - 38.8833) < 0.01 && Math.abs(longitude - (-77.0000)) < 0.01;
            const isNullIsland = Math.abs(latitude) < 0.01 && Math.abs(longitude) < 0.01;
            
            if (isWashingtonDC) {
              console.warn('⚠️ WARNING: Detected Washington D.C. coordinates - this might be a default/fallback location');
            }
            if (isNullIsland) {
              console.warn('⚠️ WARNING: Detected Null Island coordinates (0,0) - this is likely an error');
            }
            if (accuracy > 1000) {
              console.warn(`⚠️ WARNING: Low accuracy location (${accuracy}m) - location might be imprecise`);
            }
            
            if (!isValidLat || !isValidLng) {
              throw new Error(`Invalid coordinates: lat=${latitude}, lng=${longitude}`);
            }
            
            // Set user location with enhanced information
            const location: UserLocation = {
              lat: latitude,
              lng: longitude,
              city: isWashingtonDC ? 'Washington D.C. (Fallback?)' : 'Your Location',
              area: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)} (±${Math.round(accuracy)}m)`
            };

            setUserLocation(location);
            
            // Fetch nearby destinations using coordinates directly with default filters
            await fetchNearbyDestinations(latitude, longitude, searchFilters);
            setLoading(false);
            resolve();
          } else {
            const error = event.data.error;
            console.error('Error getting location:', error);
            console.log('Full error details:', {
              error,
              type: typeof error,
              keys: error ? Object.keys(error) : 'null'
            });
            setLoading(false);
            
            // Handle different types of geolocation errors with enhanced error checking
            let errorMessage = 'Unable to detect location';
            let errorCode = 'UNKNOWN';
            
            if (error && typeof error === 'object') {
              // Use the enhanced error structure from the improved errorCallback
              if (error.type && typeof error.type === 'string') {
                errorCode = error.type;
                switch (error.type) {
                  case 'PERMISSION_DENIED':
                    errorMessage = 'Location access denied. Please enable location permissions and try again.';
                    break;
                  case 'POSITION_UNAVAILABLE':
                    errorMessage = 'Location information unavailable. Please check your GPS settings.';
                    break;
                  case 'TIMEOUT':
                    errorMessage = 'Location request timed out. Please try again.';
                    break;
                  case 'PROCESSING_ERROR':
                    errorMessage = 'Error processing location data. Using fallback destinations.';
                    break;
                  default:
                    errorMessage = error.message || 'Location detection failed';
                    break;
                }
              } else if (typeof error.code === 'number') {
                // Fallback to code-based error handling
                switch (error.code) {
                  case 1: // PERMISSION_DENIED
                    errorMessage = 'Location access denied by user';
                    errorCode = 'PERMISSION_DENIED';
                    break;
                  case 2: // POSITION_UNAVAILABLE
                    errorMessage = 'Location information unavailable';
                    errorCode = 'POSITION_UNAVAILABLE';
                    break;
                  case 3: // TIMEOUT
                    errorMessage = 'Location request timed out';
                    errorCode = 'TIMEOUT';
                    break;
                  default:
                    errorMessage = `Location error (code: ${error.code})`;
                    errorCode = `CODE_${error.code}`;
                    break;
                }
              } else if (error.message && typeof error.message === 'string') {
                errorMessage = error.message;
                errorCode = 'MESSAGE_ERROR';
              }
            } else {
              console.warn('Received malformed or empty error object:', error);
              errorMessage = 'Location detection failed with unknown error';
              errorCode = 'MALFORMED_ERROR';
            }
            
            console.log(`Geolocation error [${errorCode}]: ${errorMessage}`);
            
            // Fallback to mock destinations without location-based filtering
            setDestinations(mockDestinations);
            
            // Set a default location indicator
            setUserLocation({
              lat: 0,
              lng: 0,
              city: 'Location Unavailable',
              area: errorMessage
            });
            
            setLocationError(`${errorMessage}. Showing popular destinations instead.`);
            
            reject(new Error(errorMessage));
          }
        } catch (error) {
          console.error('Error in message handler:', error);
          setLoading(false);
          setDestinations(mockDestinations);
          reject(error);
        } finally {
          // Clean up message listener
          window.removeEventListener('message', messageHandler);
        }
      };
      
      // Add message listener
      window.addEventListener('message', messageHandler);
      
      // Create isolated callback functions that only post messages
      const successCallback = (position: GeolocationPosition) => {
        console.log('🎯 Location successfully obtained:', position);
        
        // Extract serializable properties from the GeolocationPosition object
        const serializablePosition = {
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed
          },
          timestamp: position.timestamp
        };
        
        console.log('📤 Sending serialized position:', serializablePosition);
        
        window.postMessage({
          type: messageId,
          success: true,
          position: serializablePosition
        }, '*');
      };
      
      const errorCallback = (error: GeolocationPositionError) => {
        console.error('Geolocation error occurred:', error);
        console.log('Error object type:', typeof error);
        console.log('Error is null/undefined:', error == null);
        console.log('Error object keys:', Object.keys(error || {}));
        console.log('Error object values:', Object.values(error || {}));
        console.log('Error prototype:', Object.getPrototypeOf(error || {}));
        console.log('Error properties:', {
          code: error?.code,
          message: error?.message,
          toString: error?.toString?.(),
          constructor: error?.constructor?.name,
          PERMISSION_DENIED: error?.PERMISSION_DENIED,
          POSITION_UNAVAILABLE: error?.POSITION_UNAVAILABLE,
          TIMEOUT: error?.TIMEOUT
        });
        
        // Try to access properties directly
        try {
          console.log('Direct property access:', {
            'error.code': error.code,
            'error.message': error.message,
            'error[0]': (error as any)[0],
            'error[1]': (error as any)[1],
            'error[2]': (error as any)[2]
          });
        } catch (e) {
          console.log('Error accessing properties:', e);
        }
        
        // Check if it's actually an empty object or has hidden properties
        console.log('JSON.stringify result:', JSON.stringify(error));
        console.log('Object.getOwnPropertyNames:', Object.getOwnPropertyNames(error || {}));
        console.log('Object.getOwnPropertyDescriptors:', Object.getOwnPropertyDescriptors(error || {}));
        
        // Extract serializable properties from the error object with comprehensive fallbacks
        let errorCode = 0;
        let errorMessage = 'Unknown geolocation error';
        let errorType = 'UNKNOWN';
        let isEmptyError = false;
        
        try {
          // Check if error object is completely empty or malformed
          const errorKeys = Object.keys(error || {});
          const errorValues = Object.values(error || {});
          const hasProperties = errorKeys.length > 0 || errorValues.length > 0;
          
          if (!error || typeof error !== 'object' || !hasProperties) {
            console.warn('⚠️ Received empty or malformed geolocation error object');
            isEmptyError = true;
            errorCode = 2; // Default to POSITION_UNAVAILABLE
            errorType = 'EMPTY_ERROR_OBJECT';
            errorMessage = 'Geolocation failed - empty error object received. This may indicate a browser or system issue.';
          } else {
            // Try to get error code
            if (typeof error.code === 'number') {
              errorCode = error.code;
            } else if (error.PERMISSION_DENIED && error.code === error.PERMISSION_DENIED) {
              errorCode = 1;
            } else if (error.POSITION_UNAVAILABLE && error.code === error.POSITION_UNAVAILABLE) {
              errorCode = 2;
            } else if (error.TIMEOUT && error.code === error.TIMEOUT) {
              errorCode = 3;
            } else {
              // If no code found, try to infer from browser behavior
              console.warn('No error code found, inferring from context');
              errorCode = 2; // Default to POSITION_UNAVAILABLE
            }
            
            // Try to get error message
            if (typeof error.message === 'string' && error.message.length > 0) {
              errorMessage = error.message;
            } else if (typeof error.toString === 'function') {
              try {
                const toStringResult = error.toString();
                if (toStringResult && toStringResult !== '[object Object]') {
                  errorMessage = toStringResult;
                }
              } catch (e) {
                console.log('toString failed:', e);
              }
            }
            
            // Determine error type
            switch (errorCode) {
              case 1:
                errorType = 'PERMISSION_DENIED';
                errorMessage = 'Location access denied by user';
                break;
              case 2:
                errorType = 'POSITION_UNAVAILABLE';
                errorMessage = isEmptyError ? 
                  'Location information unavailable - browser may not support geolocation or GPS is disabled' :
                  'Location information unavailable';
                break;
              case 3:
                errorType = 'TIMEOUT';
                errorMessage = 'Location request timed out';
                break;
              default:
                errorType = 'UNKNOWN';
                errorMessage = isEmptyError ? 
                  'Unknown geolocation error - empty error object received' :
                  'Unknown geolocation error';
                break;
            }
          }
        } catch (e) {
          console.error('Error processing geolocation error:', e);
          errorCode = 2;
          errorMessage = 'Failed to process geolocation error - system may not support location services';
          errorType = 'PROCESSING_ERROR';
        }
        
        const serializableError = {
          code: errorCode,
          message: errorMessage,
          type: errorType,
          timestamp: Date.now(),
          originalError: error ? JSON.stringify(error, Object.getOwnPropertyNames(error)) : 'null'
        };
        
        console.log('Sending error message:', serializableError);
        
        window.postMessage({
          type: messageId,
          success: false,
          error: serializableError
        }, '*');
      };

      try {
        // Comprehensive geolocation support detection
        console.log('🔍 Checking geolocation support...');
        console.log('Navigator object:', !!navigator);
        console.log('Navigator.geolocation:', !!navigator?.geolocation);
        console.log('Geolocation.getCurrentPosition:', !!navigator?.geolocation?.getCurrentPosition);
        console.log('HTTPS context:', location.protocol === 'https:');
        console.log('Localhost context:', location.hostname === 'localhost' || location.hostname === '127.0.0.1');
        
        if (!navigator) {
          throw new Error('Navigator object not available');
        }
        
        if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported by this browser');
        }
        
        if (!navigator.geolocation.getCurrentPosition) {
          throw new Error('getCurrentPosition method not available');
        }
        
        // Check if we're in a secure context (required for geolocation in modern browsers)
        if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
          console.warn('⚠️ Geolocation may not work properly over HTTP (non-secure context)');
        }
        
        console.log('🌍 Requesting high-accuracy location...');
        console.log('Geolocation options:', {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 60000
        });
        
        // Add additional timeout as a safety net
        const timeoutId = setTimeout(() => {
          console.warn('⏰ Geolocation request taking too long, triggering fallback...');
          errorCallback({
            code: 3,
            message: 'Location request timed out after 35 seconds',
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3
          } as GeolocationPositionError);
        }, 35000); // 35 second fallback timeout
        
        // Wrap callbacks to clear timeout
        const wrappedSuccessCallback = (position: GeolocationPosition) => {
          clearTimeout(timeoutId);
          successCallback(position);
        };
        
        const wrappedErrorCallback = (error: GeolocationPositionError) => {
          clearTimeout(timeoutId);
          errorCallback(error);
        };
        
        navigator.geolocation.getCurrentPosition(
          wrappedSuccessCallback,
          wrappedErrorCallback,
          {
            enableHighAccuracy: true,    // Request GPS if available
            timeout: 30000,              // 30 seconds timeout
            maximumAge: 60000            // Accept cached location up to 1 minute old
          }
        );
      } catch (extensionError) {
        // Handle case where browser extension interferes with geolocation
        console.error('Browser extension interference detected:', extensionError);
        const errorMsg = "Location detection blocked by browser extension. Showing popular destinations instead.";
        setLocationError(errorMsg);
        setDestinations(mockDestinations);
        setLoading(false);
        setUserLocation({
          lat: 0,
          lng: 0,
          city: 'Extension Blocked',
          area: errorMsg
        });
        
        // Clean up message listener
        window.removeEventListener('message', messageHandler);
        
        reject(new Error(errorMsg));
      }
    });
  };

  // Track when component is mounted (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Intersection Observer for animations (only on client-side)
  useEffect(() => {
    if (!isMounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isMounted]);

  useEffect(() => {
    if (isVisible && isMounted) {
      getCurrentLocation()
        .then(() => console.log("Location and destinations loaded successfully"))
        .catch(err => console.error("Failed to load location and destinations:", err.message));
    }
  }, [isVisible, isMounted]);

  // Auto-search when filters change (with debouncing)
  useEffect(() => {
    if (!userLocation || !isMounted) return;

    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [searchFilters, userLocation, isMounted]);

  // Fetch nearby destinations using coordinates and filtersand filters
  const fetchNearbyDestinations = useCallback(async (lat: number, lng: number, filters?: SearchFilters) => {
    console.log(`🌍 Fetching destinations for coordinates: ${lat}, ${lng}`);
    
    // Validate coordinates before sending
    const isValidLat = typeof lat === 'number' && !isNaN(lat) && lat >= -90 && lat <= 90;
    const isValidLng = typeof lng === 'number' && !isNaN(lng) && lng >= -180 && lng <= 180;
    
    console.log(`🔍 Coordinate Validation:`, {
      lat: { value: lat, type: typeof lat, isValid: isValidLat },
      lng: { value: lng, type: typeof lng, isValid: isValidLng },
      isNaN_lat: isNaN(lat),
      isNaN_lng: isNaN(lng)
    });
    
    if (!isValidLat || !isValidLng) {
      throw new Error(`Invalid coordinates: lat=${lat} (valid: ${isValidLat}), lng=${lng} (valid: ${isValidLng})`);
    }
    
    // Prepare the API payload according to the external API specification
    const currentFilters = filters || searchFilters;
    
    // Ensure category is properly formatted - use empty string if "All" or empty
    const categoryValue = currentFilters.category === "All" || !currentFilters.category ? "" : currentFilters.category;
    
    const payload = {
      latitude: Number(lat),
      longitude: Number(lng),
      radiusInKm: Number(currentFilters.radiusInKm),
      category: categoryValue,
      minRating: Number(currentFilters.minRating),
      maxDistance: Number(currentFilters.maxDistance)
    };

    try {
      
      console.log(`🔍 Payload Validation:`, {
        originalFilters: currentFilters,
        finalPayload: payload,
        coordinates: { lat, lng },
        isLatValid: !isNaN(payload.latitude) && payload.latitude >= -90 && payload.latitude <= 90,
        isLngValid: !isNaN(payload.longitude) && payload.longitude >= -180 && payload.longitude <= 180,
      });
      
      console.log(`📤 SENDING TO EXTERNAL API:`, JSON.stringify(payload, null, 2));
      
      // Primary external API URL
      const externalApiUrl = 'https://travelguide-rttu.onrender.com/api/LocationDetection';
      const localApiUrl = '/api/LocationDetection';
      
      let response;
      let apiUsed = '';
      
      try {
        console.log(`🚀 Hitting external API: ${externalApiUrl}`);
        
        // Make the API call with proper headers and timeout
        response = await fetch(externalApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(30000) // 30 second timeout
        });
        
        apiUsed = 'external';
        console.log(`📊 External API Response: ${response.status} ${response.statusText}`);
        console.log(`📊 Response Headers:`, Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ External API Error Response:`, errorText);
          throw new Error(`External API failed: ${response.status} ${response.statusText} - ${errorText}`);
        }
        
      } catch (externalError) {
        console.warn(`⚠️ External API failed, falling back to local API:`, externalError);
        
        try {
          console.log(`🏠 Trying local API fallback: ${localApiUrl}`);
          response = await fetch(localApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          
          apiUsed = 'local';
          console.log(`📊 Local API Response: ${response.status} ${response.statusText}`);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Local API Error Response:`, errorText);
            throw new Error(`Local API failed: ${response.status} ${response.statusText} - ${errorText}`);
          }
          
        } catch (localError) {
          console.error(`❌ Both APIs failed:`, { externalError, localError });
          throw new Error(`Both external and local APIs failed. External: ${externalError instanceof Error ? externalError.message : 'Unknown error'}, Local: ${localError instanceof Error ? localError.message : 'Unknown error'}`);
        }
      }

      if (!response) {
        throw new Error('No valid response received from any API');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error Details:`, {
          status: response.status,
          statusText: response.statusText,
          errorText,
          url: response.url,
          apiUsed,
          headers: Object.fromEntries(response.headers.entries())
        });
        throw new Error(`${apiUsed} API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ ${apiUsed.toUpperCase()} API Response received:`, data);
      
      console.log('🔍 Response structure analysis:', {
        apiUsed,
        isArray: Array.isArray(data),
        length: Array.isArray(data) ? data.length : 'N/A',
        firstItem: Array.isArray(data) && data.length > 0 ? data[0] : null,
        keys: Array.isArray(data) ? 'Array' : Object.keys(data),
        hasDestinations: !!data.destinations,
        hasData: !!data.data,
        hasSuccess: !!data.success,
        hasResults: !!data.results,
        responseType: typeof data
      });
      
      // Handle different API response formats with priority for external API
      let destinationsArray = [];
      
      if (apiUsed === 'external') {
        // Handle external API response format - check for nearbyAttractions first
        if (data.nearbyAttractions && Array.isArray(data.nearbyAttractions)) {
          destinationsArray = data.nearbyAttractions;
          console.log('✅ External API: Using data.nearbyAttractions');
        } else if (Array.isArray(data)) {
          destinationsArray = data;
          console.log('✅ External API: Using direct array response');
        } else if (data.results && Array.isArray(data.results)) {
          destinationsArray = data.results;
          console.log('✅ External API: Using data.results');
        } else if (data.destinations && Array.isArray(data.destinations)) {
          destinationsArray = data.destinations;
          console.log('✅ External API: Using data.destinations');
        } else if (data.data && Array.isArray(data.data)) {
          destinationsArray = data.data;
          console.log('✅ External API: Using data.data');
        } else if (data.locations && Array.isArray(data.locations)) {
          destinationsArray = data.locations;
          console.log('✅ External API: Using data.locations');
        } else {
          console.log('⚠️ External API: Unknown response structure, trying to handle as single object');
          destinationsArray = [data];
        }
      } else {
        // Handle local API response format
        if (data.destinations && Array.isArray(data.destinations)) {
          destinationsArray = data.destinations;
          console.log('✅ Local API: Using data.destinations');
        } else if (Array.isArray(data)) {
          destinationsArray = data;
          console.log('✅ Local API: Using direct array response');
        } else if (data.data && Array.isArray(data.data)) {
          destinationsArray = data.data;
          console.log('✅ Local API: Using data.data');
        } else {
          console.log('⚠️ Local API: Unknown response structure, trying to handle as single object');
          destinationsArray = [data];
        }
      }
      
      console.log('🎯 Final destinations array:', destinationsArray);
      console.log(`📊 Found ${destinationsArray.length} destinations from your API`);
      
      if (destinationsArray && destinationsArray.length > 0) {
        const transformedDestinations = destinationsArray.map((dest: any, index: number) => {
          // Enhanced coordinate extraction with multiple field name support
          const destLat = dest.latitude || dest.lat || dest.coordinates?.lat || dest.location?.latitude || dest.location?.lat || lat;
          const destLng = dest.longitude || dest.lng || dest.coordinates?.lng || dest.location?.longitude || dest.location?.lng || lng;
          
          // Enhanced distance calculation with multiple field name support
          const distance = dest.distanceInKm || dest.distance || dest.distanceKm || dest.dist || calculateDistance(lat, lng, destLat, destLng);
          
          // Enhanced name extraction
          const name = dest.name || dest.title || dest.placeName || dest.locationName || `Destination ${index + 1}`;
          
          // Enhanced category extraction with better logic for external API
          let category = 'Other';
          if (dest.category) {
            category = dest.category;
          } else if (dest.type) {
            category = dest.type;
          } else if (dest.categoryName) {
            category = dest.categoryName;
          } else if (dest.placeType) {
            category = dest.placeType;
          } else {
            // Try to infer category from name or description
            const nameAndDesc = `${name} ${dest.description || ''}`.toLowerCase();
            if (nameAndDesc.includes('temple') || nameAndDesc.includes('pagoda') || nameAndDesc.includes('monastery')) {
              category = 'Temple';
            } else if (nameAndDesc.includes('lake') || nameAndDesc.includes('pond')) {
              category = 'Lake';
            } else if (nameAndDesc.includes('viewpoint') || nameAndDesc.includes('view') || nameAndDesc.includes('lookout')) {
              category = 'Viewpoint';
            } else if (nameAndDesc.includes('waterfall') || nameAndDesc.includes('falls')) {
              category = 'Waterfall';
            } else if (nameAndDesc.includes('trek') || nameAndDesc.includes('hiking') || nameAndDesc.includes('trail')) {
              category = 'Trekking';
            } else if (nameAndDesc.includes('museum') || nameAndDesc.includes('heritage') || nameAndDesc.includes('palace')) {
              category = 'Heritage';
            } else if (nameAndDesc.includes('park') || nameAndDesc.includes('garden') || nameAndDesc.includes('nature')) {
              category = 'Nature';
            } else {
              category = 'Adventure';
            }
          }
          
          // Enhanced rating extraction
          const rating = dest.rating || dest.score || dest.stars || dest.review_score || (4.0 + Math.random() * 1.0);
          
          // Enhanced description/tagline extraction - prioritize description from API
          const tagline = dest.description || dest.tagline || dest.summary || dest.shortDescription || `Discover ${name}`;
          
          // Enhanced tags extraction with better logic
          let tags = [];
          if (dest.tags && Array.isArray(dest.tags)) {
            tags = dest.tags;
          } else if (dest.categories && Array.isArray(dest.categories)) {
            tags = dest.categories;
          } else if (dest.keywords && Array.isArray(dest.keywords)) {
            tags = dest.keywords;
          } else if (typeof dest.tags === 'string') {
            tags = dest.tags.split(',').map((tag: string) => tag.trim());
          } else {
            // Generate tags based on available information
            tags = [category];
            if (dest.entryFee && dest.entryFee > 0) {
              tags.push('Paid Entry');
            }
            if (dest.openHours) {
              tags.push('Scheduled Hours');
            }
            if (rating >= 4.5) {
              tags.push('Highly Rated');
            }
            tags.push('Travel');
          }
          
          console.log(`🏗️ Processing destination ${index + 1}: ${name}`, {
            originalData: dest,
            extractedFields: {
              name,
              category,
              rating,
              tagline,
              tags,
              coordinates: { lat: destLat, lng: destLng },
              distance,
              imageUrl: dest.imageUrl,
              description: dest.description,
              entryFee: dest.entryFee,
              openHours: dest.openHours
            },
            coordinateFields: {
              latitude: dest.latitude,
              longitude: dest.longitude,
              lat: dest.lat,
              lng: dest.lng,
              coordinates_lat: dest.coordinates?.lat,
              location_latitude: dest.location?.latitude
            },
            distanceFields: {
              distanceInKm: dest.distanceInKm,
              distance: dest.distance,
              distanceKm: dest.distanceKm,
              calculated: calculateDistance(lat, lng, destLat, destLng)
            },
            apiFields: {
              hasImageUrl: !!dest.imageUrl,
              hasDescription: !!dest.description,
              hasEntryFee: dest.entryFee !== undefined,
              hasOpenHours: !!dest.openHours,
              hasRating: dest.rating !== undefined
            }
          });
          
          // Enhanced image handling with multiple field checks and better fallbacks
          const getImageUrl = (destination: any, categoryType: string) => {
            // Check multiple possible image field names from your API - prioritize imageUrl
            const possibleImageFields = [
              destination.imageUrl,  // Primary field from your API
              destination.image,
              destination.photo,
              destination.picture,
              destination.thumbnail,
              destination.img,
              destination.images?.[0], // If images is an array
              destination.media?.image,
              destination.cover_image,
              destination.featured_image
            ];
            
            // Find the first non-empty image URL
            const imageUrl = possibleImageFields.find(url => 
              url && typeof url === 'string' && url.trim() !== '' && url !== 'null'
            );
            
            // If we have an image URL, validate it's properly formatted
            if (imageUrl) {
              // If it's a relative URL, you might need to prepend your API base URL
              if (imageUrl.startsWith('/') || imageUrl.startsWith('./')) {
                console.log(`🔗 Converting relative image URL: ${imageUrl}`);
                // You can uncomment and modify this if your API returns relative URLs
                // return `https://travelguide-rttu.onrender.com${imageUrl}`;
              }
              console.log(`🖼️ Using image from API: ${imageUrl}`);
              return imageUrl;
            }
            
            // Enhanced fallback images based on category
            const categoryImages = {
              'Temple': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
              'Lake': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
              'Viewpoint': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
              'Waterfall': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
              'Mountain': 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&h=600&fit=crop',
              'Trekking': 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop',
              'Heritage': 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&h=600&fit=crop',
              'Adventure': 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop',
              'Nature': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
              'Other': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
            };
            
            const fallbackImage = categoryImages[categoryType as keyof typeof categoryImages] || categoryImages.Nature;
            
            console.log(`📷 No image found in API for "${destination.name}", using fallback for category "${categoryType}"`);
            return fallbackImage;
          };

          return {
            id: dest.id || dest.placeId || index + 1,
            name: name,
            image: getImageUrl(dest, category),
            distance: typeof distance === 'number' ? Number(distance.toFixed(1)) : 0,
            category: category,
            rating: typeof rating === 'number' ? Number(rating.toFixed(1)) : 4.5,
            tagline: tagline,
            tags: tags,
            coordinates: {
              lat: Number(destLat),
              lng: Number(destLng)
            },
            weatherInfo: dest.weather || dest.weatherInfo || {
              temperature: Math.round(15 + Math.random() * 15),
              condition: 'Pleasant',
              emoji: '🌤️'
            },
            isFromAPI: true,
            source: apiUsed === 'external' ? 'External API' : 'Local API'
          };
        });

        console.log('✅ Successfully transformed API destinations:', transformedDestinations);
        console.log(`🌐 Displaying ${transformedDestinations.length} destinations from ${apiUsed.toUpperCase()} API`);
        
        if (apiUsed === 'external') {
          console.log('🎉 SUCCESS: Using REAL EXTERNAL API data from https://travelguide-rttu.onrender.com');
          console.log('🔗 External API is working correctly!');
        } else {
          console.log('🏠 Using local API fallback data');
        }
        
        // Log each destination with full details to verify transformation
        transformedDestinations.forEach((dest: Destination, index: number) => {
          console.log(`📍 Destination ${index + 1}:`, {
            name: dest.name,
            category: dest.category,
            distance: `${dest.distance}km`,
            rating: dest.rating,
            coordinates: `${dest.coordinates.lat}, ${dest.coordinates.lng}`,
            hasImage: !!dest.image,
            tagline: dest.tagline.substring(0, 50) + '...',
            tags: dest.tags,
            source: dest.source
          });
        });
        
        // Verify no destinations have invalid data
        const invalidDestinations = transformedDestinations.filter((dest: Destination) => 
          !dest.name || dest.name === 'Destination 1' || 
          dest.distance === 0 || 
          dest.category === 'Other' ||
          !dest.coordinates.lat || !dest.coordinates.lng
        );
        
        if (invalidDestinations.length > 0) {
          console.warn('⚠️ Found destinations with potentially invalid data:', invalidDestinations);
        } else {
          console.log('✅ All destinations have valid data structure');
        }
        
        // Add a flag to indicate these are from API
        const apiDestinations = transformedDestinations.map((dest: Destination) => ({
          ...dest,
          isFromAPI: true,
          source: apiUsed === 'external' ? 'External API' : 'Local API'
        }));
        
        setDestinations(apiDestinations);
        
        // Update user location with any location info from API response
        if (data.location) {
          setUserLocation(prev => ({
            ...prev!,
            city: data.location.city || data.location.name || 'Detected Location',
            area: data.location.area || data.location.region || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
          }));
        }
      } else {
        console.warn('⚠️ No destinations found in external API response');
        console.log('📋 API response structure for debugging:', data);
        console.log('🔄 Triggering local API fallback due to empty response...');
        
        // Throw error to trigger fallback to local API
        throw new Error('External API returned no destinations');
      }
    } catch (error) {
      console.error('❌ Error fetching nearby destinations from external API:', error);
      console.log('🔄 Attempting fallback to local API...');
      
      try {
        // Fallback to local API
        const localApiUrl = '/api/LocationDetection';
        console.log('🏠 Trying local API:', localApiUrl);
        
        const localResponse = await fetch(localApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        if (localResponse.ok) {
          const localData = await localResponse.json();
          console.log('✅ Local API response received:', localData);
          
          // Process local API response
          let destinationsArray: any[] = [];
          
          if (Array.isArray(localData)) {
            destinationsArray = localData;
            console.log('✅ Using direct array from local API');
          } else if (localData.destinations && Array.isArray(localData.destinations)) {
            destinationsArray = localData.destinations;
            console.log('✅ Using destinations array from local API');
          } else if (localData.data && Array.isArray(localData.data)) {
            destinationsArray = localData.data;
            console.log('✅ Using data array from local API');
          }
          
          if (destinationsArray.length > 0) {
            const transformedDestinations = destinationsArray.map((dest: any, index: number) => {
              const destLat = dest.latitude || dest.coordinates?.lat || dest.lat || lat;
              const destLng = dest.longitude || dest.coordinates?.lng || dest.lng || lng;
              const distance = dest.distanceInKm || dest.distance || calculateDistance(lat, lng, destLat, destLng);
              
              return {
                id: dest.id || index + 1,
                name: dest.name || 'Unknown Destination',
                image: dest.imageUrl || dest.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                distance: typeof distance === 'number' ? Number(distance.toFixed(1)) : 0,
                category: dest.category || dest.type || 'Other',
                rating: dest.rating || (4.0 + Math.random() * 1.0),
                tagline: dest.description || dest.tagline || 'Discover this amazing destination',
                tags: dest.tags || (dest.category ? [dest.category, 'Local'] : ['Adventure', 'Nature']),
                coordinates: {
                  lat: destLat,
                  lng: destLng
                },
                weatherInfo: dest.weather || dest.weatherInfo || {
                  temperature: Math.round(15 + Math.random() * 15),
                  condition: 'Pleasant',
                  emoji: '🌤️'
                },
                isFromAPI: true,
                source: 'Local API'
              };
            });
            
            console.log('✅ Successfully using local API fallback:', transformedDestinations);
            setDestinations(transformedDestinations);
            
            // Update location info if available
            if (localData.location) {
              setUserLocation(prev => ({
                ...prev!,
                city: localData.location.city || localData.location.name || 'Detected Location',
                area: localData.location.area || localData.location.region || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
              }));
            }
            
            return; // Successfully used local API
          }
        }
        
        // If local API also fails, show error
        console.error('❌ Both external and local APIs failed');
        setDestinations([]);
        setLocationError(`Failed to fetch destinations: External API error - ${error instanceof Error ? error.message : 'Unknown error'}`);
        
      } catch (localError) {
        console.error('❌ Local API fallback also failed:', localError);
        setDestinations([]);
        setLocationError(`Both APIs failed: External - ${error instanceof Error ? error.message : 'Unknown error'}, Local - ${localError instanceof Error ? localError.message : 'Unknown error'}`);
      }
    }
  }, [searchFilters]);

  // Handle search with filters
  const handleSearch = useCallback(async () => {
    if (!userLocation) {
      console.log('❌ No user location available for search');
      return;
    }

    setIsSearching(true);
    try {
      await fetchNearbyDestinations(userLocation.lat, userLocation.lng, searchFilters);
    } catch (error) {
      console.error('❌ Error during search:', error);
    } finally {
      setIsSearching(false);
    }
  }, [userLocation, searchFilters, fetchNearbyDestinations]);

  // Helper function to calculate distance (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors = {
      'Viewpoint': 'bg-gradient-to-r from-orange-400 to-pink-400',
      'Lake': 'bg-gradient-to-r from-blue-400 to-cyan-400',
      'Temple': 'bg-gradient-to-r from-purple-400 to-indigo-400',
      'Waterfall': 'bg-gradient-to-r from-green-400 to-teal-400',
      'default': 'bg-gradient-to-r from-gray-400 to-gray-500'
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  // Get tag color
  const getTagColor = (tag: string) => {
    const colors = {
      'Hidden Gem': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Locals\' Favorite': 'bg-orange-100 text-orange-700 border-orange-200',
      'Sunrise': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Spiritual': 'bg-purple-100 text-purple-700 border-purple-200',
      'Photography': 'bg-pink-100 text-pink-700 border-pink-200',
      'default': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[tag as keyof typeof colors] || colors.default;
  };



  // Reset filters to default values
  const resetFilters = () => {
    setSearchFilters({
      radiusInKm: 50,
      category: '',
      minRating: 0,
      maxDistance: 100
    });
  };

  return (
    <>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316, #ec4899);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316, #ec4899);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-webkit-slider-track {
          background: linear-gradient(90deg, #f97316, #ec4899);
          height: 4px;
          border-radius: 2px;
        }
        
        .slider::-moz-range-track {
          background: linear-gradient(90deg, #f97316, #ec4899);
          height: 4px;
          border-radius: 2px;
          border: none;
        }
      `}</style>
      <section 
        ref={sectionRef}
        className="relative pt-72 pb-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden"
      >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Near You
            <span className="block text-lg md:text-xl font-normal text-gray-600 mt-2">
              Find amazing places around your current location
            </span>
          </h2>

          {/* Location Status */}
          {userLocation && (
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/20 mb-6">
              <MapPin className="w-5 h-5 text-orange-500" />
              <span className="text-gray-700 font-medium">
                You're in {userLocation.city} — here's what's nearby!
              </span>
            </div>
          )}

          {/* Enable Location Button */}
          {!userLocation && !loading && (
            <button
              onClick={getCurrentLocation}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Navigation className="w-5 h-5" />
              📍 Enable Location
            </button>
          )}

          {/* Loading State */}
          {loading && (
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
              <span className="text-gray-700">Finding nearby destinations...</span>
            </div>
          )}

          {/* Current Location Display */}
          {userLocation && (
            <div className="inline-flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-6 py-3 text-green-700">
              <MapPin className="w-4 h-4" />
              <span>📍 {userLocation.city}, {userLocation.area} ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})</span>
            </div>
          )}

          {/* Data Source Summary */}
          {destinations.length > 0 && (
            <div className={`inline-flex items-center gap-3 rounded-2xl px-6 py-3 transition-all duration-500 ${
              destinations.some(d => (d as any).isFromAPI) 
                ? 'bg-green-50 border border-green-200 text-green-700 shadow-lg' 
                : 'bg-blue-50 border border-blue-200 text-blue-700'
            }`}>
              {destinations.some(d => (d as any).isFromAPI) ? (
                <>
                  <span className="text-green-600 animate-pulse">🌐</span>
                  <span className="font-medium">
                    ✅ Live API Data Active! Showing {destinations.filter(d => (d as any).isFromAPI).length} real destinations near you
                  </span>
                </>
              ) : (
                <>
                  <span className="text-orange-600">📋</span>
                  <span>Showing demo destinations ({destinations.length} places) - API data will load when available</span>
                </>
              )}
            </div>
          )}

          {/* Error Message */}
          {locationError && (
            <div className="inline-flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-6 py-3 text-amber-700">
              <span>{locationError}</span>
            </div>
          )}
        </div>

        {/* Search Filters */}
        {userLocation && (
          <div className={`mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              {/* Filter Toggle Button */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Search Filters
                </h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  {showFilters ? <X className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showFilters ? 'Hide' : 'Show'} Filters
                </button>
              </div>

              {/* Filters Content */}
              {showFilters && (
                <div className="space-y-6">
                  {/* First Row: Radius and Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Radius Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Radius: {searchFilters.radiusInKm} km
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="200"
                        step="5"
                        value={searchFilters.radiusInKm}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, radiusInKm: Number(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>5 km</span>
                        <span>200 km</span>
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={searchFilters.category}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Second Row: Rating and Max Distance */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Minimum Rating Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Rating: {searchFilters.minRating > 0 ? `${searchFilters.minRating}+ stars` : 'Any rating'}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={searchFilters.minRating}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Any</span>
                        <span>5★</span>
                      </div>
                    </div>

                    {/* Max Distance Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Distance: {searchFilters.maxDistance} km
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="500"
                        step="5"
                        value={searchFilters.maxDistance}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, maxDistance: Number(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1 km</span>
                        <span>500 km</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSearch}
                      disabled={isSearching || !userLocation}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                    >
                      {isSearching ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          Search Destinations
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={resetFilters}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* View Mode Toggle */}
        {destinations.length > 0 && (
          <div className={`flex justify-center mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                  viewMode === 'map' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Map View
              </button>
            </div>
          </div>
        )}

        {/* Destinations Grid */}
        {destinations.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {destinations.map((destination, index) => (
              <div
                key={destination.id}
                className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-500 overflow-hidden border border-white/20 min-h-[400px] max-h-[450px] flex flex-col ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onMouseEnter={() => setHoveredCard(destination.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Image Container */}
                <div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden flex-shrink-0">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      console.log(`❌ Image failed to load for "${destination.name}": ${destination.image}`);
                      // Set a fallback image based on category
                      const fallbackImages = {
                        'Temple': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
                        'Lake': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
                        'Viewpoint': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                        'Waterfall': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
                        'Mountain': 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&h=600&fit=crop',
                        'Park': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
                        'Museum': 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&h=600&fit=crop',
                        'Adventure': 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop',
                        'Nature': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
                      };
                      const fallback = fallbackImages[destination.category as keyof typeof fallbackImages] || fallbackImages.Nature;
                      (e.target as HTMLImageElement).src = fallback;
                      console.log(`🔄 Using fallback image for "${destination.name}": ${fallback}`);
                    }}
                    onLoad={() => {
                      console.log(`✅ Image loaded successfully for "${destination.name}": ${destination.image}`);
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  
                  {/* Top Left Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    <div className="bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg">
                      <span className="text-xs sm:text-sm font-semibold text-gray-800">
                        {destination.distance} km
                      </span>
                    </div>
                  </div>

                  {/* Top Right Badges */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
                    <div className={`${getCategoryColor(destination.category)} text-white px-2 py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg`}>
                      {destination.category}
                    </div>
                    {(destination as any).isFromAPI !== undefined && (
                      <div className={`px-2 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm transition-all duration-300 ${
                        (destination as any).isFromAPI 
                          ? 'bg-green-500/95 text-white border border-green-400/50' 
                          : 'bg-orange-500/95 text-white border border-orange-400/50'
                      }`}>
                        <span className="hidden sm:inline">{(destination as any).isFromAPI ? '🌐 API' : '📋 Demo'}</span>
                        <span className="sm:hidden">{(destination as any).isFromAPI ? '🌐' : '📋'}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Left Weather Info */}
                  {destination.weatherInfo && (
                    <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <span className="text-sm font-medium text-gray-800">
                        {destination.weatherInfo.emoji} {destination.weatherInfo.temperature}°C
                      </span>
                    </div>
                  )}

                  {/* View Details Button */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-1">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">View</span>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2 flex-1 mr-2">
                      {destination.name}
                    </h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                      <span className="text-xs sm:text-sm font-medium text-gray-600">
                        {destination.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base line-clamp-2 flex-1">
                    {destination.tagline}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-auto">
                    {destination.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getTagColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                    {destination.tags.length > 2 && (
                      <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                        +{destination.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Map View Placeholder */}
        {destinations.length > 0 && viewMode === 'map' && (
          <div className={`bg-white rounded-3xl shadow-lg p-8 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Map</h3>
                <p className="text-gray-600">Map integration coming soon!</p>
                <p className="text-sm text-gray-500 mt-2">Will show your location and nearby destinations</p>
              </div>
            </div>
          </div>
        )}

        {/* Mini Map Preview (when in grid mode) */}
        {destinations.length > 0 && viewMode === 'grid' && userLocation && (
          <div className="fixed bottom-6 right-6 w-48 h-32 bg-white rounded-2xl shadow-lg border border-white/20 overflow-hidden z-10 opacity-80 hover:opacity-100 transition-opacity duration-300">
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Mini Map</p>
                <p className="text-xs text-gray-500">{destinations.length} nearby</p>
              </div>
            </div>
          </div>
        )}
      </div>

      </section>
    </>
  );
};

export default NearbyDestinations;