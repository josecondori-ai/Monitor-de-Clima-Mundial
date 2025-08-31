"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

// Mapbox GL JS types
declare global {
  interface Window {
    mapboxgl: any
  }
}

interface WeatherMapProps {
  onCityClick?: (city: { name: string; country: string; lat: number; lng: number }) => void
  onMapReady?: (map: any) => void
  searchedLocation?: {
    name: string
    lat: number
    lng: number
  } | null
}

export function WeatherMap({ onCityClick, onMapReady, searchedLocation }: WeatherMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)
  const { theme } = useTheme()

  // Major cities with coordinates for initial markers
  const majorCities = [
    { name: "Madrid", country: "España", lat: 40.4168, lng: -3.7038 },
    { name: "Buenos Aires", country: "Argentina", lat: -34.6118, lng: -58.396 },
    { name: "Tokyo", country: "Japón", lat: 35.6762, lng: 139.6503 },
    { name: "New York", country: "Estados Unidos", lat: 40.7128, lng: -74.006 },
    { name: "London", country: "Reino Unido", lat: 51.5074, lng: -0.1278 },
    { name: "Paris", country: "Francia", lat: 48.8566, lng: 2.3522 },
    { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
    { name: "São Paulo", country: "Brasil", lat: -23.5505, lng: -46.6333 },
    { name: "Mumbai", country: "India", lat: 19.076, lng: 72.8777 },
    { name: "Cairo", country: "Egipto", lat: 30.0444, lng: 31.2357 },
  ]

  useEffect(() => {
    // Load Mapbox GL JS dynamically
    const loadMapbox = async () => {
      if (typeof window !== "undefined" && !window.mapboxgl) {
        // Load Mapbox GL JS CSS
        const link = document.createElement("link")
        link.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css"
        link.rel = "stylesheet"
        document.head.appendChild(link)

        // Load Mapbox GL JS
        const script = document.createElement("script")
        script.src = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js"
        script.onload = initializeMap
        document.head.appendChild(script)
      } else if (window.mapboxgl) {
        initializeMap()
      }
    }

    const initializeMap = () => {
      if (map.current || !mapContainer.current) return

      // Get Mapbox token from environment variables
      const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
      
      if (!MAPBOX_TOKEN) {
        console.error("Mapbox token no configurado. Por favor, agrega NEXT_PUBLIC_MAPBOX_TOKEN a tu archivo .env.local")
        return
      }

      window.mapboxgl.accessToken = MAPBOX_TOKEN

      map.current = new window.mapboxgl.Map({
        container: mapContainer.current,
        style: theme === "dark" ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/light-v11",
        center: [0, 20], // Centered on world
        zoom: 2,
        projection: "globe",
      })

      // Add navigation controls
      map.current.addControl(new window.mapboxgl.NavigationControl(), "top-right")

      // Add markers for major cities
      majorCities.forEach((city) => {
        // Create custom marker element
        const markerElement = document.createElement("div")
        markerElement.className = "weather-marker"
        markerElement.style.cssText = `
          width: 16px;
          height: 16px;
          background-color: #A0D2E8;
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: all 0.2s ease;
          position: relative;
        `

        // Create popup
        const popup = new window.mapboxgl.Popup({
          offset: 15,
          closeButton: false,
          closeOnClick: false,
        }).setHTML(`
          <div style="padding: 8px; font-size: 14px; color: #374151;">
            <strong>${city.name}</strong><br>
            <span style="color: #6B7280;">${city.country}</span>
          </div>
        `)

        // Create marker with simple configuration
        const marker = new window.mapboxgl.Marker({
          element: markerElement,
          anchor: 'center'
        })
          .setLngLat([city.lng, city.lat])
          .setPopup(popup)
          .addTo(map.current)

        // Store marker reference for cleanup
        markersRef.current.push(marker)

        // Add hover effects
        markerElement.addEventListener("mouseenter", (e) => {
          e.stopPropagation()
          markerElement.style.backgroundColor = "#85C1E0"
          markerElement.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)"
          markerElement.style.borderColor = "#ffffff"
        })

        markerElement.addEventListener("mouseleave", (e) => {
          e.stopPropagation()
          markerElement.style.backgroundColor = "#A0D2E8"
          markerElement.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)"
          markerElement.style.borderColor = "#ffffff"
        })

        // Add click handler
        markerElement.addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation()
          
          // Call the callback
          onCityClick?.(city)

          // Fly to city
          map.current.flyTo({
            center: [city.lng, city.lat],
            zoom: 10,
            duration: 2000,
          })
        })
      })

      // Add click handler for map (to get coordinates of any location)
      map.current.on("click", (e: any) => {
        const { lng, lat } = e.lngLat

        // Reverse geocoding would go here in a real implementation
        // For now, we'll create a generic location
        const genericLocation = {
          name: `Ubicación (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
          country: "Coordenadas",
          lat: lat,
          lng: lng,
        }

        onCityClick?.(genericLocation)
      })

      map.current.on("load", () => {
        setMapLoaded(true)
        console.log("[v0] Mapbox map loaded successfully")
        // Notify parent component that map is ready
        onMapReady?.(map.current)
      })
    }

    loadMapbox()

    return () => {
      // Clean up markers
      markersRef.current.forEach(marker => {
        if (marker && marker.remove) {
          marker.remove()
        }
      })
      markersRef.current = []

      // Clean up map
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [onCityClick])

  // Update map style when theme changes
  useEffect(() => {
    if (map.current && mapLoaded) {
      const newStyle = theme === "dark" ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/light-v11"
      map.current.setStyle(newStyle)
    }
  }, [theme, mapLoaded])

  // Handle searched location
  useEffect(() => {
    if (map.current && mapLoaded && searchedLocation) {
      // Remove any existing search marker
      const existingMarker = document.querySelector('.search-marker')
      if (existingMarker) {
        existingMarker.remove()
      }

      // Create temporary search marker
      const searchMarkerElement = document.createElement("div")
      searchMarkerElement.className = "search-marker"
      searchMarkerElement.style.cssText = `
        width: 20px;
        height: 20px;
        background-color: #FF6B6B;
        border: 3px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        animation: pulse 2s infinite;
      `

      // Add pulse animation
      const style = document.createElement('style')
      style.textContent = `
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `
      document.head.appendChild(style)

      // Create search marker
      const searchMarker = new window.mapboxgl.Marker({
        element: searchMarkerElement,
        anchor: 'center'
      })
        .setLngLat([searchedLocation.lng, searchedLocation.lat])
        .addTo(map.current)

      // Fly to searched location
      map.current.flyTo({
        center: [searchedLocation.lng, searchedLocation.lat],
        zoom: 12,
        duration: 2000,
      })

      // Remove marker after 5 seconds
      setTimeout(() => {
        if (searchMarker && searchMarker.remove) {
          searchMarker.remove()
        }
        if (style && style.remove) {
          style.remove()
        }
      }, 5000)
    }
  }, [searchedLocation, mapLoaded])

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Loading overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? (
              <>
                <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-destructive">Configuración Requerida</p>
                <p className="text-sm">Necesitas configurar NEXT_PUBLIC_MAPBOX_TOKEN en tu archivo .env.local</p>
                <p className="text-xs mt-2">Consulta el README.md para instrucciones</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium">Cargando Mapa</p>
                <p className="text-sm">Inicializando Mapbox...</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Instructions overlay */}
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 max-w-xs">
        <p className="text-sm font-medium text-foreground mb-1">Instrucciones:</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Haz clic en los marcadores azules para ver el clima</li>
          <li>• Haz clic en cualquier lugar del mapa para obtener coordenadas</li>
          <li>• Usa los controles para navegar y hacer zoom</li>
        </ul>
      </div>

      {/* Mapbox attribution */}
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-card/80 backdrop-blur-sm px-2 py-1 rounded">
        Powered by Mapbox
      </div>
    </div>
  )
}
