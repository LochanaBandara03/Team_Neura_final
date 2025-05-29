'use client';

import { useEffect, useRef, useState } from 'react';
import { MapMarker } from '@/types/dashboard';
import { Loader } from '@googlemaps/js-api-loader';

interface MapProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (marker: MapMarker) => void;
  onMapLoad?: (map: google.maps.Map) => void;
}

export default function Map({ markers, center, zoom = 12, onMarkerClick, onMapLoad }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [googleMarkers, setGoogleMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
      });

      try {
        const google = await loader.load();
        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: center || { lat: 0, lng: 0 },
            zoom,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          });
          setMap(mapInstance);
          if (onMapLoad) {
            onMapLoad(mapInstance);
          }
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, [center, zoom, onMapLoad]);

  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    googleMarkers.forEach(marker => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    markers.forEach(marker => {
      const googleMarker = new google.maps.Marker({
        position: marker.position,
        map,
        title: marker.title,
        icon: {
          url: getMarkerIcon(marker.type, marker.priority),
          scaledSize: new google.maps.Size(32, 32),
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-bold">${marker.title}</h3>
            <p>${marker.description}</p>
            ${marker.priority ? `<p class="text-red-600">Priority: ${marker.priority}</p>` : ''}
          </div>
        `,
      });

      googleMarker.addListener('click', () => {
        infoWindow.open(map, googleMarker);
        if (onMarkerClick) {
          onMarkerClick(marker);
        }
      });

      newMarkers.push(googleMarker);
    });

    setGoogleMarkers(newMarkers);
  }, [map, markers, onMarkerClick]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-[500px] rounded-lg shadow-lg"
    />
  );
}

function getMarkerIcon(type: MapMarker['type'], priority?: number): string {
  const baseUrl = '/markers/';
  switch (type) {
    case 'request':
      return priority && priority > 7 
        ? `${baseUrl}high-priority.png`
        : `${baseUrl}request.png`;
    case 'resource':
      return `${baseUrl}resource.png`;
    case 'volunteer':
      return `${baseUrl}volunteer.png`;
    default:
      return `${baseUrl}default.png`;
  }
} 