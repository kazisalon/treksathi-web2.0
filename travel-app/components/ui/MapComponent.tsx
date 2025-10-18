'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Destination {
  id: string;
  name: string;
  nameNepali: string;
  latitude: number;
  longitude: number;
  images: string[];
  rating: number;
}

interface MapComponentProps {
  destinations: Destination[];
  userLocation?: { lat: number; lng: number } | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ destinations, userLocation }) => {
  const center: [number, number] = [28.3949, 84.1240]; // Center of Nepal

  // Custom icon for user location
  const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Custom icon for destinations
  const destinationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="h-96 w-full">
      <MapContainer
        center={center}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User Location Marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold">तपाईंको स्थान</h3>
                <p className="text-sm text-gray-600">Your Current Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Markers */}
        {destinations.map((destination) => (
          <Marker
            key={destination.id}
            position={[destination.latitude, destination.longitude]}
            icon={destinationIcon}
          >
            <Popup>
              <div className="min-w-[200px]">
                <img
                  src={destination.images[0]}
                  alt={destination.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <h3 className="font-semibold text-lg">{destination.name}</h3>
                <p className="text-sm nepali-text text-gray-600 mb-2">
                  {destination.nameNepali}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium">{destination.rating}</span>
                  </div>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;