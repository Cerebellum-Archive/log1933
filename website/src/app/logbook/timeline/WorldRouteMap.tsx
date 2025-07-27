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
    if (typeof window === 'undefined') {
      return
    }

    const initializeMap = async () => {
      // Ensure container exists and has dimensions
      if (!mapRef.current) {
        console.warn('Map container not found')
        return
      }

      // Prevent double initialization
      if (mapInstanceRef.current) {
        return
      }

      // Check if container has proper dimensions
      const containerRect = mapRef.current.getBoundingClientRect()
      if (containerRect.width === 0 || containerRect.height === 0) {
        console.warn('Map container has no dimensions, retrying in 100ms')
        setTimeout(initializeMap, 100)
        return
      }
      
      const L = (await import('leaflet')).default

      // Clear any existing Leaflet instance from the container
      if (mapRef.current) {
        mapRef.current.innerHTML = ''
        // Remove any Leaflet-specific data attributes
        mapRef.current.removeAttribute('data-leaflet-id')
        // Remove any existing leaflet containers
        const existingContainers = mapRef.current.querySelectorAll('.leaflet-container')
        existingContainers.forEach(container => container.remove())
      }

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

      try {
        // Ensure the container is still valid before creating the map
        if (!mapRef.current || !mapRef.current.isConnected) {
          console.warn('Map container is no longer connected to DOM')
          return
        }

        const map = L.map(mapRef.current!, {
          center: [40, 30],
          zoom: 2,
          minZoom: 2,
          maxZoom: 2,
          zoomControl: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          dragging: true,
          preferCanvas: true // This can help with performance and some rendering issues
        })
        mapInstanceRef.current = map

        // Add a small delay to ensure map is fully initialized before adding layers
        await new Promise(resolve => setTimeout(resolve, 10))
        
      } catch (error) {
        console.error('Error initializing Leaflet map:', error)
        return
      }

      const map = mapInstanceRef.current
      if (!map || !mapRef.current) return

      try {
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
          attribution: '&copy; National Geographic | &copy; OpenStreetMap contributors',
          maxZoom: 16
        }).addTo(map)
      } catch (error) {
        console.error('Error adding tile layer:', error)
        return
      }

      const routeCoordinates: [number, number][] = []
      for (let i = 0; i < journeyStops.length - 2; i++) {
        const stop = journeyStops[i]
        routeCoordinates.push([stop.lat, stop.lng])
      }

      try {
        L.polyline(routeCoordinates, {
          color: '#FF6B35',
          weight: 4,
          opacity: 0.9,
          dashArray: '12, 6'
        }).addTo(map)

        // Add Pacific crossing from Japan to San Francisco as two segments
        // to handle the map split at the international date line
        const japanStop = journeyStops.find(stop => stop.name === 'Japan')
        const sanFranciscoStop = journeyStops.find(stop => stop.name === 'San Francisco')
        
        if (japanStop && sanFranciscoStop) {
          // First segment: Japan to eastern edge of map
          const pacificSegment1 = [
            [japanStop.lat, japanStop.lng],
            [japanStop.lat, 179] // Go to eastern edge of map
          ]
          
          // Second segment: western edge of map to San Francisco
          const pacificSegment2 = [
            [sanFranciscoStop.lat, -179], // Start from western edge of map
            [sanFranciscoStop.lat, sanFranciscoStop.lng]
          ]
          
          // Add both Pacific segments with same styling as main route
          L.polyline(pacificSegment1, {
            color: '#FF6B35',
            weight: 4,
            opacity: 0.9,
            dashArray: '12, 6'
          }).addTo(map)
          
          L.polyline(pacificSegment2, {
            color: '#FF6B35',
            weight: 4,
            opacity: 0.9,
            dashArray: '12, 6'
          }).addTo(map)
        }
      } catch (error) {
        console.error('Error adding route polyline:', error)
      }

      try {
        for (let i = 0; i < routeCoordinates.length - 1; i++) {
        const start = routeCoordinates[i]
        const end = routeCoordinates[i + 1]
        const midLat = (start[0] + end[0]) / 2
        const midLng = (start[1] + end[1]) / 2
        const angle = Math.atan2(end[1] - start[1], end[0] - start[0]) * 180 / Math.PI
        
        L.marker([midLat, midLng], { 
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

        // Add arrows for Pacific crossing segments
        const japanStop = journeyStops.find(stop => stop.name === 'Japan')
        const sanFranciscoStop = journeyStops.find(stop => stop.name === 'San Francisco')
        
        if (japanStop && sanFranciscoStop) {
          // Arrow for first Pacific segment (Japan to eastern edge)
          const midLat1 = japanStop.lat
          const midLng1 = (japanStop.lng + 179) / 2
          const angle1 = 90 // Pointing east
          
          L.marker([midLat1, midLng1], { 
            icon: L.divIcon({
              className: 'route-arrow',
              html: `<div style="
                width: 0; 
                height: 0; 
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-bottom: 12px solid #FF6B35;
                transform: rotate(${angle1}deg);
              "></div>`,
              iconSize: [12, 12],
              iconAnchor: [6, 6]
            })
          }).addTo(map)
          
          // Arrow for second Pacific segment (western edge to San Francisco)
          const midLat2 = sanFranciscoStop.lat
          const midLng2 = (-179 + sanFranciscoStop.lng) / 2
          const angle2 = 90 // Pointing east
          
          L.marker([midLat2, midLng2], { 
            icon: L.divIcon({
              className: 'route-arrow',
              html: `<div style="
                width: 0; 
                height: 0; 
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-bottom: 12px solid #FF6B35;
                transform: rotate(${angle2}deg);
              "></div>`,
              iconSize: [12, 12],
              iconAnchor: [6, 6]
            })
          }).addTo(map)
        }
      } catch (error) {
        console.error('Error adding route arrows:', error)
      }

      try {
        // Add markers for all stops except Los Angeles (include San Francisco now)
        journeyStops.slice(0, -1).forEach((stop) => {
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

        marker.on('mouseover', () => marker.openPopup())
        marker.on('click', () => {
          if (onLocationClick) {
            // Direct mapping to match the patterns used in timeline scrollToLocation
            onLocationClick(stop.name)
          }
        })
        })
      } catch (error) {
        console.error('Error adding location markers:', error)
      }

      try {
        // Include San Francisco in bounds calculation now that we have the Pacific crossing
        const journeyCoordinates = journeyStops.slice(0, -1).map(stop => [stop.lat, stop.lng] as [number, number])
        const routeBounds = L.latLngBounds(journeyCoordinates)
        
        map.fitBounds(routeBounds, { 
          padding: [20, 20],
          maxZoom: 4
        })
      } catch (error) {
        console.error('Error fitting map bounds:', error)
      }

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
    }

    // Add a small delay to ensure the container is properly rendered
    const timer = setTimeout(() => {
      if (!mapInstanceRef.current) {
        initializeMap()
      }
    }, 50)

    return () => {
      clearTimeout(timer)
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
        } catch (error) {
          console.warn('Error removing Leaflet map:', error)
        }
        mapInstanceRef.current = null
      }
      // Also clean up the DOM container
      if (mapRef.current) {
        mapRef.current.innerHTML = ''
        mapRef.current.removeAttribute('data-leaflet-id')
      }
    }
  }, [])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full"
      style={{ 
        minHeight: '500px',
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#87CEEB' // Fallback background color
      }}
    />
  )
}

export default WorldRouteMap 