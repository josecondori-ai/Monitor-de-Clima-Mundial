"use client"

import { Navbar } from "@/components/navbar"
import { WeatherMap } from "@/components/weather-map"
import { WeatherPanel } from "@/components/weather-panel"
import { ThemeProvider } from "@/components/theme-provider"
import { useState, useRef } from "react"

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<{
    name: string
    country: string
    lat: number
    lng: number
  } | null>(null)

  const [searchedCity, setSearchedCity] = useState<string | null>(null)
  const [searchedLocation, setSearchedLocation] = useState<{
    name: string
    lat: number
    lng: number
  } | null>(null)
  const mapRef = useRef<any>(null)

  const handleSearch = async (cityName: string) => {
    setSearchedCity(cityName)
    // Limpiar la ciudad seleccionada del mapa cuando se busca una nueva
    setSelectedCity(null)
    setSearchedLocation(null)

    try {
      // Obtener las coordenadas de la ciudad usando la API de OpenWeather
      const response = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`)
      const data = await response.json()

      if (response.ok && data.location) {
        // Establecer la ubicación buscada para mostrar el marcador
        setSearchedLocation({
          name: data.location.name,
          lat: data.location.lat,
          lng: data.location.lon
        })
      }
    } catch (error) {
      console.error("Error al obtener coordenadas de la ciudad:", error)
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <Navbar onSearch={handleSearch} />
        <main className="relative h-[calc(100vh-4rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-4 h-full">
            {/* Map Container */}
            <div className="lg:col-span-3 relative">
              <WeatherMap 
                onCityClick={setSelectedCity} 
                onMapReady={(map) => {
                  mapRef.current = map
                }}
                searchedLocation={searchedLocation}
              />
            </div>

            {/* Weather Info Panel */}
            <div className="lg:col-span-1 bg-card border-l border-border overflow-y-auto">
              <WeatherPanel 
                selectedCity={selectedCity} 
                searchedCity={searchedCity}
                onClearSearch={() => {
                  setSearchedCity(null)
                  setSearchedLocation(null)
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}
