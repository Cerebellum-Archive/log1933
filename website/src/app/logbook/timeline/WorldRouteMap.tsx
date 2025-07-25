'use client'

import { useEffect, useRef } from 'react'

// Journey stops data for Ernest's 1933 world tour
const journeyStops = [
  { name: 'Chicago', lat: 41.8781, lng: -87.6298, order: 1 },
  { name: 'Atlantic Ocean', lat: 40.0, lng: -30.0, order: 2 },
  { name: 'Southampton', lat: 50.9097, lng: -1.4044, order: 3 },
  { name: 'London', lat: 51.5074, lng: -0.1278, order: 4 },
  { name: 'Liverpool', lat: 53.4084, lng: -2.9916, order: 5 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, order: 6 },
  { name: 'Brussels', lat: 50.8503, lng: 4.3517, order: 7 },
  { name: 'Antwerp', lat: 51.2194, lng: 4.4025, order: 8 },
  { name: 'Berlin', lat: 52.5200, lng: 13.4050, order: 9 },
  { name: 'Vienna', lat: 48.2082, lng: 16.3738, order: 10 },
  { name: 'Switzerland', lat: 46.8182, lng: 8.2275, order: 11 },
  { name: 'Italy', lat: 41.8719, lng: 12.5674, order: 12 },
  { name: 'Lisbon', lat: 38.7223, lng: -9.1393, order: 13 },
  { name: 'Morocco', lat: 31.7917, lng: -7.0926, order: 14 },
  { name: 'Suez Canal', lat: 30.0444, lng: 31.2357, order: 15 },
  { name: 'Ceylon', lat: 7.8731, lng: 80.7718, order: 16 },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, order: 17 },
  { name: 'Malay States', lat: 3.1390, lng: 101.6869, order: 18 },
  { name: 'Shanghai', lat: 31.2304, lng: 121.4737, order: 19 },
  { name: 'Beijing', lat: 39.9042, lng: 116.4074, order: 20 },
  { name: 'Manchuria', lat: 43.8383, lng: 125.3245, order: 21 },
  { name: 'Japan', lat: 36.2048, lng: 138.2529, order: 22 },
  { name: 'San Francisco', lat: 37.7749, lng: -122.4194, order: 23 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, order: 24 }
]

interface WorldRouteMapProps {
  onLocationClick?: (location: string) => void
}

const WorldRouteMap = ({ onLocationClick }: WorldRouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return

    const initializeMap = async () => {
      // Dynamically import Leaflet to avoid SSR issues
      const L = (await import('leaflet')).default

      // Set up custom icons
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 12px; 
          height: 12px; 
          background-color: #dc2626; 
          border: 2px solid white; 
          border-radius: 50%; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      })

      // Initialize map with custom bounds to minimize ocean space
      const map = L.map(mapRef.current!, {
        center: [30, 20], // Center more on land areas
        zoom: 2,
        minZoom: 1,
        maxZoom: 6,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true
      })

      mapInstanceRef.current = map

      // Add beautiful tile layer - Natural Earth style
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; National Geographic | &copy; OpenStreetMap contributors',
        maxZoom: 16
      }).addTo(map)

      // Create route polyline coordinates - excluding the problematic return from Japan to US
      const routeCoordinates: [number, number][] = []
      
      // Only include stops up to Japan (excluding the return to US)
      for (let i = 0; i < journeyStops.length - 2; i++) {
        const stop = journeyStops[i]
        routeCoordinates.push([stop.lat, stop.lng])
      }

      // Add route polyline with brighter color
      const routeLine = L.polyline(routeCoordinates, {
        color: '#FF6B35', // Bright orange-red for better visibility
        weight: 4,
        opacity: 0.9,
        dashArray: '12, 6'
      }).addTo(map)

      // Add directional arrows along the route
      const arrowIcon = L.divIcon({
        className: 'route-arrow',
        html: `<div style="
          width: 0; 
          height: 0; 
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 12px solid #FF6B35;
          transform: rotate(var(--arrow-rotation, 0deg));
        "></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      })

      // Add arrows at regular intervals along the route using actual route coordinates
      for (let i = 0; i < routeCoordinates.length - 1; i++) {
        const start = routeCoordinates[i]
        const end = routeCoordinates[i + 1]
        
        // Calculate midpoint
        const midLat = (start[0] + end[0]) / 2
        const midLng = (start[1] + end[1]) / 2
        
        // Calculate angle for arrow direction
        const angle = Math.atan2(end[1] - start[1], end[0] - start[0]) * 180 / Math.PI
        
        // Add arrow marker
        const arrowMarker = L.marker([midLat, midLng], { 
          icon: L.divIcon({
            className: 'route-arrow',
            html: `<div style="
              width: 0; 
              height: 0; 
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-bottom: 12px solid #FF6B35;
              transform: rotate(${angle}deg);
            "></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          })
        }).addTo(map)
      }

      // Add markers for each stop (excluding the return to US)
      journeyStops.slice(0, -2).forEach((stop, index) => {
        const marker = L.marker([stop.lat, stop.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: 'Courier Prime', monospace; color: #2c1810;">
              <strong>${stop.name}</strong><br/>
              Stop ${stop.order} of ${journeyStops.length - 1}<br/>
              <em>Click to scroll to timeline location</em>
            </div>
          `, {
            className: 'custom-popup'
          })

        // Add hover effects
        marker.on('mouseover', () => {
          marker.openPopup()
        })

        // Add click handler to scroll to timeline location
        marker.on('click', () => {
          if (onLocationClick) {
            // Map journey stop names to timeline location names
            const locationMapping: { [key: string]: string } = {
              'Chicago': 'Chicago',
              'Atlantic Ocean': 'Atlantic Ocean',
              'Southampton': 'Southampton',
              'London': 'London',
              'Liverpool': 'Liverpool', 
              'Paris': 'Paris',
              'Brussels': 'Brussels',
              'Antwerp': 'Antwerp',
              'Berlin': 'Berlin',
              'Vienna': 'Vienna',
              'Switzerland': 'Switzerland',
              'Italy': 'Italy',
              'Lisbon': 'Lisbon',
              'Morocco': 'Morocco',
              'Suez Canal': 'Suez Canal',
              'Ceylon': 'Ceylon',
              'Singapore': 'Singapore',
              'Malay States': 'Malay States',
              'Shanghai': 'Shanghai',
              'Beijing': 'Beijing',
              'Manchuria': 'Manchuria',
              'Japan': 'Japan',
              'San Francisco': 'San Francisco',
              'Los Angeles': 'Los Angeles'
            }
            
            const timelineLocation = locationMapping[stop.name] || stop.name
            onLocationClick(timelineLocation)
          }
        })
      })

      // Calculate tight bounds around the actual journey route
      // Only use the journey stops up to Japan for bounds calculation (excluding return to US)
      const journeyCoordinates = journeyStops.slice(0, -2).map(stop => [stop.lat, stop.lng] as [number, number])
      const routeBounds = L.latLngBounds(journeyCoordinates)
      
      // Fit map to the actual route with minimal padding
      map.fitBounds(routeBounds, { 
        padding: [20, 20], // Minimal padding to focus on the route
        maxZoom: 4 // Allow closer zoom to focus on itinerary
      })

      // Add custom CSS for markers and popups
      const style = document.createElement('style')
      style.textContent = `
        .custom-popup .leaflet-popup-content-wrapper {
          background: rgba(244,241,232,0.95);
          border: 2px solid #8B4513;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .custom-popup .leaflet-popup-tip {
          background: rgba(244,241,232,0.95);
          border: 2px solid #8B4513;
        }
        .leaflet-container {
          background: #87CEEB;
        }
        .leaflet-control-zoom a {
          background-color: rgba(244,241,232,0.9);
          border: 1px solid #8B4513;
          color: #2c1810;
        }
        .leaflet-control-zoom a:hover {
          background-color: rgba(139,69,19,0.1);
        }
        .route-arrow {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
      `
      document.head.appendChild(style)

      // Removed the overlay since info is now above the map
    }

    initializeMap()

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full"
      style={{ 
        minHeight: '500px',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    />
  )
}

export default WorldRouteMap 