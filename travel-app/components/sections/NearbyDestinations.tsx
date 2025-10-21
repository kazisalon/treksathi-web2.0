'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Eye, Star, Clock, Thermometer } from 'lucide-react';



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
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=600&fit=crop",
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
            
            // Fetch nearby destinations using coordinates directly
            await fetchNearbyDestinations(latitude, longitude);
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

  // Fetch nearby destinations using coordinates directly
  const fetchNearbyDestinations = async (lat: number, lng: number) => {
    try {
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
      
      // Test API endpoint accessibility first
      try {
        const testResponse = await fetch('https://travelguide-rttu.onrender.com/api/LocationDetection', {
          method: 'GET'
        });
        console.log(`🔍 API Endpoint Test: ${testResponse.status} ${testResponse.statusText}`);
      } catch (testError) {
        console.warn(`⚠️ API Endpoint Test Failed:`, testError);
      }
      
      // Use the correct payload structure as per API specification
      const payload = {
        lat: Number(lat),  // Ensure it's a proper number
        lng: Number(lng),  // Ensure it's a proper number
        radius: 50  // 50km radius for nearby destinations
      };
      
      // Additional payload validation
      console.log(`🔍 Final Payload Validation:`, {
        payload,
        latType: typeof payload.lat,
        lngType: typeof payload.lng,
        latValue: payload.lat,
        lngValue: payload.lng,
        radiusType: typeof payload.radius,
        radiusValue: payload.radius,
        isLatValid: !isNaN(payload.lat) && payload.lat >= -90 && payload.lat <= 90,
        isLngValid: !isNaN(payload.lng) && payload.lng >= -180 && payload.lng <= 180,
        payloadJSON: JSON.stringify(payload)
      });
      
      console.log(`📤 EXACT PAYLOAD BEING SENT TO API:`, JSON.stringify(payload, null, 2));
      
      // Use ONLY the external API - no local fallback
      const apiUrl = 'https://travelguide-rttu.onrender.com/api/LocationDetection';
      
      console.log(`📡 Calling External API ONLY:`, {
        url: apiUrl,
        method: 'POST',
        payload: payload,
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log(`🚀 Making API call to your external API...`);
      console.log(`📤 Using payload:`, JSON.stringify(payload, null, 2));
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response) {
        throw new Error('No valid response received from API');
      }

      console.log(`📊 External API Response Status: ${response.status} ${response.statusText}`);
      
      console.log(`📊 API Response Status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ LocationDetection API Error Details:`, {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText,
          url: apiUrl,
          sentPayload: payload
        });
        
        // Try to parse error as JSON for more details
        try {
          const errorJson = JSON.parse(errorText);
          console.error(`📋 Parsed Error Details:`, errorJson);
        } catch (parseError) {
          console.error(`📋 Raw Error Text:`, errorText);
        }
        
        throw new Error(`Failed to fetch destinations: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📊 Raw API Response:', data);
      console.log('🔍 Response structure analysis:', {
        isArray: Array.isArray(data),
        length: Array.isArray(data) ? data.length : 'N/A',
        firstItem: Array.isArray(data) && data.length > 0 ? data[0] : null,
        keys: Array.isArray(data) ? 'Array' : Object.keys(data)
      });
      
      // Your API returns a direct array of destinations
      let destinationsArray = [];
      
      if (Array.isArray(data)) {
        // Direct array response (your API format)
        destinationsArray = data;
        console.log('✅ Using direct array response from your API');
      } else if (data.destinations) {
        destinationsArray = data.destinations;
        console.log('✅ Using data.destinations');
      } else if (data.data) {
        destinationsArray = data.data;
        console.log('✅ Using data.data');
      } else {
        console.log('❌ Unknown response structure, trying to handle as single object');
        destinationsArray = [data];
      }
      
      console.log('🎯 Final destinations array:', destinationsArray);
      console.log(`📊 Found ${destinationsArray.length} destinations from your API`);
      
      if (destinationsArray && destinationsArray.length > 0) {
        const transformedDestinations = destinationsArray.map((dest: any, index: number) => {
          // Handle your API's actual response structure
          const destLat = dest.latitude || dest.coordinates?.lat || dest.lat || lat;
          const destLng = dest.longitude || dest.coordinates?.lng || dest.lng || lng;
          const distance = dest.distanceInKm || dest.distance || calculateDistance(lat, lng, destLat, destLng);
          
          console.log(`🏗️ Processing destination: ${dest.name}`, {
            originalData: dest,
            extractedLat: destLat,
            extractedLng: destLng,
            originalDistance: dest.distanceInKm,
            calculatedDistance: calculateDistance(lat, lng, destLat, destLng),
            finalDistance: distance
          });
          
          return {
            id: dest.id || index + 1,
            name: dest.name || 'Unknown Destination',
            image: dest.imageUrl || dest.image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
            distance: typeof distance === 'number' ? Number(distance.toFixed(1)) : 0,
            category: dest.category || dest.type || 'Other',
            rating: dest.rating || (4.0 + Math.random() * 1.0),
            tagline: dest.description || dest.tagline || 'Discover this amazing destination',
            tags: dest.tags || (dest.category ? [dest.category, 'Local'] : ['Adventure', 'Nature']),
            coordinates: {
              lat: destLat,
              lng: destLng
            },
            weatherInfo: dest.weather || {
              temperature: Math.round(15 + Math.random() * 15),
              condition: 'Pleasant',
              emoji: '🌤️'
            }
          };
        });

        console.log('✅ Successfully transformed EXTERNAL API destinations:', transformedDestinations);
        console.log(`🌐 Displaying ${transformedDestinations.length} destinations from EXTERNAL API`);
        console.log('🎉 SUCCESS: Using your real API data from https://travelguide-rttu.onrender.com');
        
        // Log each destination name to verify we're using real data
        transformedDestinations.forEach((dest: Destination, index: number) => {
          console.log(`📍 Destination ${index + 1}: "${dest.name}" at ${dest.coordinates.lat}, ${dest.coordinates.lng} (${dest.distance}km away)`);
        });
        
        // Add a flag to indicate these are from external API
        const apiDestinations = transformedDestinations.map((dest: Destination) => ({
          ...dest,
          isFromAPI: true,
          source: 'External API'
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
        console.warn('⚠️ No destinations found in API response');
        console.log('📋 API response structure for debugging:', data);
        console.log('🚫 NO FALLBACK - Only showing real API data');
        
        // Set empty destinations and show message
        setDestinations([]);
        setLocationError('No destinations found in your area from the API');
      }
    } catch (error) {
      console.error('❌ Error fetching nearby destinations from external API:', error);
      console.log('🚫 NO FALLBACK - Only showing real API data');
      
      // Set error state instead of showing mock data
      setDestinations([]);
      setLocationError(`Failed to fetch destinations from API: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };



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

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <div
                key={destination.id}
                className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden border border-white/20 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onMouseEnter={() => setHoveredCard(destination.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Distance Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                    <span className="text-sm font-semibold text-gray-800">
                      {destination.distance} km away
                    </span>
                  </div>

                  {/* Data Source Badge */}
                  <div className={`absolute top-4 right-4 flex flex-col gap-1`}>
                    <div className={`${getCategoryColor(destination.category)} text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg`}>
                      {destination.category}
                    </div>
                    {(destination as any).isFromAPI !== undefined && (
                      <div className={`px-2 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm transition-all duration-300 ${
                        (destination as any).isFromAPI 
                          ? 'bg-green-500/90 text-white border border-green-400/50 animate-pulse' 
                          : 'bg-orange-500/90 text-white border border-orange-400/50'
                      }`}>
                        {(destination as any).isFromAPI ? '🌐 Live API' : '📋 Demo'}
                      </div>
                    )}
                  </div>

                  {/* Weather Info */}
                  {destination.weatherInfo && (
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium text-gray-800">
                        {destination.weatherInfo.emoji} {destination.weatherInfo.temperature}°C
                      </span>
                    </div>
                  )}

                  {/* View Details Button */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                      {destination.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-600">
                        {destination.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {destination.tagline}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {destination.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getTagColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                    {destination.tags.length > 2 && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                        +{destination.tags.length - 2} more
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

      {/* Custom CSS for animations */}
      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </section>
  );
};

export default NearbyDestinations;