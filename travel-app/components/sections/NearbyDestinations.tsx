'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Navigation, Eye, Star, Clock, Thermometer, Filter, Search, X, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';



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
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

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

  // Pagination state
  const [displayedCount, setDisplayedCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
        setDestinations([]);
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
            
            // Set empty destinations array when location fails
            setDestinations([]);
            
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
          setDestinations([]);
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
        setDestinations([]);
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
        setDisplayedCount(6); // Reset to show first 6 destinations
        
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
            setDisplayedCount(6); // Reset to show first 6 destinations
            
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

  // Get category color with enhanced travel-themed palette
  const getCategoryColor = (category: string) => {
    const colors = {
      'Viewpoint': 'bg-gradient-to-r from-orange-400 to-pink-400',
      'Lake': 'bg-gradient-to-r from-blue-400 to-cyan-400',
      'Temple': 'bg-gradient-to-r from-purple-400 to-indigo-400',
      'Waterfall': 'bg-gradient-to-r from-green-400 to-teal-400',
      'Mountain': 'bg-gradient-to-r from-gray-600 to-slate-700',
      'Park': 'bg-gradient-to-r from-emerald-500 to-green-600',
      'Museum': 'bg-gradient-to-r from-purple-500 to-indigo-600',
      'Adventure': 'bg-gradient-to-r from-red-500 to-pink-600',
      'Nature': 'bg-gradient-to-r from-green-600 to-lime-600',
      'Heritage': 'bg-gradient-to-r from-amber-500 to-orange-600',
      'Trekking': 'bg-gradient-to-r from-emerald-600 to-teal-600',
      'Wildlife': 'bg-gradient-to-r from-green-700 to-emerald-700',
      'default': 'bg-blue-500'
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
          height: 22px;
          width: 22px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
          transition: all 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          background: #059669;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }
        
        .slider::-moz-range-thumb {
          height: 22px;
          width: 22px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }
        
        .slider::-webkit-slider-track {
          background: #f3f4f6;
          height: 4px;
          border-radius: 2px;
        }
        
        .slider::-moz-range-track {
          background: #f3f4f6;
          height: 4px;
          border-radius: 2px;
          border: none;
        }
        
        /* Text truncation utilities */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Card hover animations */
        .destination-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .destination-card:hover {
          transform: translateY(-4px);
        }
      `}</style>
      <section 
        ref={sectionRef}
        className="relative pt-32 pb-24 bg-white overflow-hidden"
      >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.02)_0%,transparent_50%)]"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-full px-6 py-3 mb-8 shadow-sm">
            <div className="relative">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-sm font-semibold text-blue-700 tracking-wide">DISCOVER NEARBY</span>
            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
            <span className="text-xs text-blue-600 font-medium">AI-Powered</span>
          </div>
          
          {/* Main Title with Gradient */}
          <div className="relative mb-8">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent mb-4 tracking-tight leading-none">
              Near You
            </h1>
            {/* Subtle accent line */}
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
          </div>
          
          {/* Enhanced Description */}
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed mb-6">
              Discover hidden gems, popular attractions, and local favorites within your reach
            </p>
            <p className="text-base text-gray-500 max-w-2xl mx-auto">
              Powered by real-time location data, curated recommendations, and local insights to help you explore like never before
            </p>
          </div>
          
          {/* Premium Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <div className="group flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-300">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse group-hover:animate-bounce"></div>
              <span className="text-sm font-medium text-gray-700">Real-time distances</span>
            </div>
            <div className="group flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse group-hover:animate-bounce"></div>
              <span className="text-sm font-medium text-gray-700">Curated recommendations</span>
            </div>
            <div className="group flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm hover:shadow-md transition-all duration-300 hover:border-purple-300">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse group-hover:animate-bounce"></div>
              <span className="text-sm font-medium text-gray-700">Local insights</span>
            </div>
            <div className="group flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm hover:shadow-md transition-all duration-300 hover:border-orange-300">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse group-hover:animate-bounce"></div>
              <span className="text-sm font-medium text-gray-700">Weather updates</span>
            </div>
          </div>

          {/* Premium Location Status */}
          {userLocation && (
            <div className="mt-12 mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-gradient-to-r from-white to-green-50/50 rounded-3xl px-8 py-6 border border-green-200/50 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    {/* Location Indicator */}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span className="text-gray-800 font-semibold text-lg">
                          {userLocation.city}
                        </span>
                      </div>
                    </div>
                    
                    {/* Separator */}
                    <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                    
                    {/* Results Count */}
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 rounded-xl px-4 py-2">
                        <span className="text-blue-700 font-bold text-lg">
                          {destinations.length}
                        </span>
                      </div>
                      <span className="text-gray-600 font-medium">
                        places discovered
                      </span>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex items-center gap-2 bg-green-100 rounded-full px-4 py-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 font-medium text-sm">Live</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Premium Enable Location Section */}
          {!userLocation && !loading && (
            <div className="mt-16">
              <div className="relative max-w-4xl mx-auto">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl blur-3xl opacity-60"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-3xl"></div>
                
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-white/50 shadow-2xl">
                  <div className="text-center space-y-8">
                    {/* Premium Icon */}
                    <div className="relative inline-flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
                      <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                        <Navigation className="w-12 h-12 text-white" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Title and Description */}
                    <div className="space-y-4">
                      <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Unlock Your Adventure
                      </h3>
                      <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                        Enable location access to discover amazing destinations, hidden gems, and local favorites perfectly tailored to your surroundings
                      </p>
                    </div>
                    
                    {/* Premium Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                      <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <span className="text-2xl">🎯</span>
                        </div>
                        <div className="text-green-700 font-bold text-lg mb-2">Hyper-Personalized</div>
                        <div className="text-green-600">AI-powered recommendations based on your exact location and preferences</div>
                      </div>
                      
                      <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <span className="text-2xl">📍</span>
                        </div>
                        <div className="text-blue-700 font-bold text-lg mb-2">Precision Mapping</div>
                        <div className="text-blue-600">Real-time distances, accurate directions, and live traffic updates</div>
                      </div>
                      
                      <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <span className="text-2xl">⚡</span>
                        </div>
                        <div className="text-purple-700 font-bold text-lg mb-2">Instant Discovery</div>
                        <div className="text-purple-600">Lightning-fast recommendations updated in real-time</div>
                      </div>
                    </div>
                    
                    {/* Premium Action Button */}
                    <div className="pt-6">
                      <button
                        onClick={getCurrentLocation}
                        className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-3xl"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                        <Navigation className="relative w-6 h-6 transition-transform group-hover:rotate-12" />
                        <span className="relative text-lg">Enable Location Access</span>
                        <ArrowRight className="relative w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                    
                    {/* Enhanced Privacy Note */}
                    <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-200/50 max-w-2xl mx-auto">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm">🔒</span>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-gray-800">Privacy Protected</p>
                          <p className="text-xs text-gray-600">Your location is only used for recommendations and never stored or shared with third parties</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Premium Loading State */}
          {loading && (
            <div className="mt-12">
              <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-3xl p-10 max-w-3xl mx-auto border border-blue-100/50 shadow-xl backdrop-blur-sm">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <div className="absolute top-4 right-4 w-20 h-20 bg-blue-100/30 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-6 left-6 w-16 h-16 bg-purple-100/30 rounded-full animate-pulse delay-300"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-blue-50/20 to-purple-50/20 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
                </div>
                
                <div className="relative text-center space-y-8">
                  {/* Premium Loading Icon */}
                  <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl animate-pulse"></div>
                    <Sparkles className="relative w-10 h-10 text-white animate-spin" style={{animationDuration: '3s'}} />
                  </div>
                  
                  {/* Enhanced Loading Message */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">🗺️ Discovering Amazing Places</h3>
                    <p className="text-lg text-blue-700 font-semibold">Finding the best destinations near you...</p>
                    <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto animate-pulse"></div>
                  </div>
                  
                  {/* Premium Progress Steps */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex flex-col items-center gap-3 p-4 bg-white/60 rounded-2xl border border-white/40 backdrop-blur-sm">
                      <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce"></div>
                      <span className="font-medium text-gray-700">Getting your location</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 p-4 bg-white/60 rounded-2xl border border-white/40 backdrop-blur-sm">
                      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                      <span className="font-medium text-gray-700">Searching nearby attractions</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 p-4 bg-white/60 rounded-2xl border border-white/40 backdrop-blur-sm">
                      <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce delay-300"></div>
                      <span className="font-medium text-gray-700">Curating recommendations</span>
                    </div>
                  </div>
                  
                  {/* Premium Tip Card */}
                  <div className="bg-gradient-to-r from-white/80 to-blue-50/80 rounded-2xl p-6 border border-blue-200/50 backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">💡</span>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-800 mb-1">Smart Discovery in Progress</p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          We're analyzing your location, preferences, and real-time data to find the perfect places within your preferred distance and interests.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Loading Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {locationError && (
            <div className="mt-8">
              <div className="bg-red-50 border border-red-200 rounded-3xl p-6 max-w-2xl mx-auto">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
                    <X className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-red-900">Location Access Issue</h3>
                    <p className="text-red-700 font-medium">{locationError}</p>
                  </div>
                  
                  {/* Helpful Solutions */}
                  <div className="bg-white/60 rounded-2xl p-4 border border-white/40 text-left">
                    <p className="text-sm font-medium text-red-800 mb-2">💡 Try these solutions:</p>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Check if location services are enabled in your browser</li>
                      <li>• Refresh the page and try again</li>
                      <li>• Make sure you're using HTTPS (secure connection)</li>
                    </ul>
                  </div>
                  
                  {/* Retry Button */}
                  <button
                    onClick={getCurrentLocation}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300"
                  >
                    <Navigation className="w-4 h-4" />
                    Try Again
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* No Results State */}
        {userLocation && !loading && destinations.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12 max-w-2xl mx-auto border border-gray-200">
              <div className="space-y-6">
                {/* Icon */}
                <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto">
                  <Search className="w-10 h-10 text-blue-600" />
                </div>
                
                {/* Message */}
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold text-gray-900">No destinations found</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We couldn't find any places matching your current filters. Try adjusting your search criteria.
                  </p>
                </div>
                
                {/* Suggestions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/60 rounded-xl p-4 border border-white/40 text-left">
                    <div className="text-blue-600 font-medium mb-2">🔍 Expand Search</div>
                    <div className="text-gray-600">Increase distance radius or remove category filters</div>
                  </div>
                  <div className="bg-white/60 rounded-xl p-4 border border-white/40 text-left">
                    <div className="text-green-600 font-medium mb-2">⭐ Lower Standards</div>
                    <div className="text-gray-600">Try reducing the minimum rating requirement</div>
                  </div>
                </div>
                
                {/* Action Button */}
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg"
                >
                  <Search className="w-5 h-5" />
                  Reset All Filters
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

        {/* Search Filters */}
        {userLocation && (
          <div className={`mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Filter Toggle Button */}
              <div className="flex items-center justify-between p-6 border-b border-gray-50 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Refine Search
                  </h3>
                  <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                    {destinations.length} found
                  </span>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    showFilters 
                      ? 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {showFilters ? (
                    <>
                      <X className="w-4 h-4" />
                      Close
                    </>
                  ) : (
                    <>
                      <Filter className="w-4 h-4" />
                      Show Filters
                    </>
                  )}
                </button>
              </div>

              {/* Filters Content */}
              {showFilters && (
                <div className="p-6 bg-gray-50/30">{/* Filters Content */}
                  <div className="space-y-8">
                    {/* Category Selection */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <label className="text-sm font-semibold text-gray-900">
                          Category
                        </label>
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        <span className="text-xs text-gray-500">Choose your interest</span>
                      </div>
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        <button
                          onClick={() => setSearchFilters(prev => ({ ...prev, category: '' }))}
                          className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                            searchFilters.category === '' 
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                              : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          🌍 All
                        </button>
                        {categories.map(category => {
                          const categoryEmojis = {
                            'Viewpoint': '🏔️',
                            'Lake': '🏞️',
                            'Temple': '🏛️',
                            'Waterfall': '💧',
                            'Trekking': '🥾',
                            'Wildlife': '🦋',
                            'Heritage': '🏺',
                            'Adventure': '🎯',
                            'Nature': '🌿'
                          };
                          return (
                            <button
                              key={category}
                              onClick={() => setSearchFilters(prev => ({ ...prev, category }))}
                              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                                searchFilters.category === category 
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                              }`}
                            >
                              {categoryEmojis[category as keyof typeof categoryEmojis]} {category}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Distance Range */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-semibold text-gray-900">
                            Distance
                          </label>
                          <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          {searchFilters.radiusInKm} km radius
                        </div>
                      </div>
                      <div className="relative bg-white rounded-xl p-4 border border-gray-200">
                        <input
                          type="range"
                          min="5"
                          max="200"
                          step="5"
                          value={searchFilters.radiusInKm}
                          onChange={(e) => setSearchFilters(prev => ({ ...prev, radiusInKm: Number(e.target.value) }))}
                          className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #10b981 0%, #10b981 ${((searchFilters.radiusInKm - 5) / 195) * 100}%, #f3f4f6 ${((searchFilters.radiusInKm - 5) / 195) * 100}%, #f3f4f6 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>🚶 5 km</span>
                          <span>🚗 200 km</span>
                        </div>
                      </div>
                    </div>

                    {/* Rating Filter */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <label className="text-sm font-semibold text-gray-900">
                          Minimum Rating
                        </label>
                        <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                        <span className="text-xs text-gray-500">
                          {searchFilters.minRating > 0 ? `${searchFilters.minRating}+ stars` : 'Any rating'}
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {[0, 3, 4, 4.5, 5].map(rating => (
                          <button
                            key={rating}
                            onClick={() => setSearchFilters(prev => ({ ...prev, minRating: rating }))}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                              searchFilters.minRating === rating 
                                ? 'bg-yellow-500 text-white border-yellow-500 shadow-md' 
                                : 'bg-white text-gray-700 border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
                            }`}
                          >
                            {rating === 0 ? '⭐ Any' : `⭐ ${rating}+`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-6 border-t border-gray-200">
                      <button
                        onClick={handleSearch}
                        disabled={isSearching || !userLocation}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                      >
                        {isSearching ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-300 border-t-white"></div>
                            Searching...
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4" />
                            Find Destinations
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={resetFilters}
                        className="px-6 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
                      >
                        🔄 Reset
                      </button>
                    </div>
                    
                    {/* Quick Filter Tips */}
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-blue-900 mb-1">💡 Quick Tips</p>
                          <p className="text-xs text-blue-700 leading-relaxed">
                            Use category filters to find specific types of places. Adjust distance for nearby or distant adventures. Higher ratings ensure quality experiences.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}



        {/* Premium Destinations Section */}
        {destinations.length > 0 && (
          <div className="space-y-12 mt-20">
            {/* Premium Section Header */}
            <div className="text-center relative">
              {/* Background Effects */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-96 h-32 bg-gradient-to-r from-blue-100/30 via-purple-100/30 to-pink-100/30 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative space-y-6">
                {/* Premium Discovery Badge */}
                <div className="inline-flex items-center gap-4 bg-gradient-to-r from-white via-blue-50/50 to-purple-50/50 backdrop-blur-sm rounded-3xl px-8 py-4 border border-blue-200/50 shadow-xl">
                  <div className="relative">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                    {destinations.length} Amazing Places Discovered
                  </span>
                  <div className="relative">
                    <Sparkles className="w-6 h-6 text-blue-500 animate-spin" style={{animationDuration: '4s'}} />
                    <div className="absolute inset-0 w-6 h-6 text-purple-400 animate-pulse">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Description */}
                <div className="max-w-3xl mx-auto space-y-3">
                  <p className="text-lg text-gray-700 font-medium leading-relaxed">
                    Handpicked destinations that match your preferences, sorted by distance and quality
                  </p>
                  <p className="text-sm text-gray-500">
                    Each destination is carefully curated with real-time data, local insights, and weather updates
                  </p>
                </div>
                
                {/* Premium Stats */}
                <div className="flex flex-wrap justify-center gap-6 mt-8">
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border border-gray-200/50 shadow-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">Live Updates</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border border-gray-200/50 shadow-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">Verified Reviews</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border border-gray-200/50 shadow-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">Weather Ready</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Destinations Grid - 3 Cards Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 xl:gap-12 max-w-7xl mx-auto">
            {destinations.slice(0, displayedCount).map((destination, index) => (
              <div
                key={destination.id}
                className={`destination-card group relative bg-white rounded-3xl border border-gray-200/50 hover:border-blue-300/50 hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:scale-[1.02] hover:-translate-y-2 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  boxShadow: hoveredCard === destination.id ? '0 25px 50px -12px rgba(0, 0, 0, 0.15)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={() => setHoveredCard(destination.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Premium Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
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
                  

                  
                  {/* Premium Distance Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl px-3 py-2 shadow-lg border border-white/20">
                      <span className="text-sm font-bold text-gray-800">
                        {destination.distance} km
                      </span>
                    </div>
                  </div>

                  {/* Premium Category Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`${getCategoryColor(destination.category)} backdrop-blur-md text-white px-3 py-2 rounded-2xl shadow-lg border border-white/20`}>
                      <span className="text-sm font-bold">
                        {destination.category}
                      </span>
                    </div>
                  </div>

                  {/* Premium Favorite Button */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <button className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 border border-white/20">
                      <svg className="w-5 h-5 text-red-500 hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Premium Content */}
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 flex-1 group-hover:text-blue-700 transition-colors duration-300">
                      {destination.name}
                    </h3>
                    <div className="flex items-center ml-3 flex-shrink-0 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl px-3 py-2 border border-yellow-200/50">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-bold text-yellow-700 ml-1">
                        {destination.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-2">
                    {destination.tagline && destination.tagline.length > 80 
                      ? `${destination.tagline.substring(0, 80)}...` 
                      : destination.tagline}
                  </p>

                  {/* Premium Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {destination.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200/50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                    {destination.tags.length > 2 && (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-gray-50 to-slate-50 text-gray-600 border border-gray-200/50 hover:from-gray-100 hover:to-slate-100 transition-all duration-300 cursor-pointer">
                        +{destination.tags.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Premium Weather Info */}
                  {destination.weatherInfo && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl px-3 py-2 border border-blue-100/50">
                        <span className="text-lg mr-2">{destination.weatherInfo.emoji}</span>
                        <div className="text-sm">
                          <span className="font-bold text-gray-800">{destination.weatherInfo.temperature}°C</span>
                          <span className="text-gray-500 mx-2">•</span>
                          <span className="text-gray-600 font-medium">{destination.weatherInfo.condition}</span>
                        </div>
                      </div>
                      <button className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                        <span className="text-sm">Explore</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            </div>

            {/* Load More Button */}
            {destinations.length > displayedCount && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => {
                    setIsLoadingMore(true);
                    setTimeout(() => {
                      setDisplayedCount(prev => Math.min(prev + 6, destinations.length));
                      setIsLoadingMore(false);
                    }, 800);
                  }}
                  disabled={isLoadingMore}
                  className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="flex items-center gap-3">
                    {isLoadingMore ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Loading More...</span>
                      </>
                    ) : (
                      <>
                        <span>Load More Destinations</span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm bg-white/20 rounded-full px-2 py-1">
                            +{Math.min(6, destinations.length - displayedCount)}
                          </span>
                          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Premium background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            )}
          </div>
        )}




      </div>

      </section>
    </>
  );
};

export default NearbyDestinations;