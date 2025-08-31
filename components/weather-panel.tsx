"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Droplets, Wind, Eye, Gauge, MapPin, RefreshCw, AlertCircle } from "lucide-react"
import { useWeather } from "@/hooks/use-weather"
import { getWeatherIcon, getWeatherDescriptionES } from "@/lib/weather-api"
import { SearchHelp } from "@/components/search-help"

interface WeatherPanelProps {
  selectedCity?: {
    name: string
    country: string
    lat: number
    lng: number
  } | null
  searchedCity?: string | null
  onClearSearch?: () => void
}

export function WeatherPanel({ selectedCity, searchedCity, onClearSearch }: WeatherPanelProps) {
  const { data, loading, error, refetch } = useWeather({
    lat: selectedCity?.lat,
    lon: selectedCity?.lng,
    city: searchedCity || undefined,
  })

  return (
    <div className="p-4 space-y-4">
      {/* Welcome Message or Selected City Info */}
      {!selectedCity && !searchedCity ? (
        <>
          <SearchHelp />
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Clima</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Haz clic en cualquier ciudad del mapa o busca una ciudad en la barra superior para ver su información meteorológica en tiempo real.
              </p>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <CardTitle className="text-lg">
                    {selectedCity ? selectedCity.name : searchedCity}
                  </CardTitle>
                  {selectedCity && (
                    <>
                      <p className="text-sm text-muted-foreground">{selectedCity.country}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedCity.lat.toFixed(4)}, {selectedCity.lng.toFixed(4)}
                      </p>
                    </>
                  )}
                  {searchedCity && !selectedCity && (
                    <p className="text-sm text-muted-foreground">Ciudad buscada</p>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                {searchedCity && !selectedCity && onClearSearch && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClearSearch}
                    className="text-muted-foreground hover:text-foreground"
                    title="Limpiar búsqueda"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={refetch}
                  disabled={loading}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Cargando datos del clima...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Error al cargar el clima</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weather Data */}
      {data && !loading && (
        <>
          {/* Current Weather Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{data.location.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{data.location.country}</p>
                  {searchedCity && !selectedCity && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Coordenadas: {data.location.lat.toFixed(4)}, {data.location.lon.toFixed(4)}
                    </p>
                  )}
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {getWeatherDescriptionES(data.current.weather.main)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Temperature */}
              <div className="flex items-center gap-3">
                <div className="text-3xl">{getWeatherIcon(data.current.weather.icon)}</div>
                <div>
                  <p className="text-3xl font-bold">{data.current.temp}°C</p>
                  <p className="text-sm text-muted-foreground">Sensación: {data.current.feels_like}°C</p>
                </div>
              </div>

              {/* Weather Details */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Humedad</p>
                    <p className="text-sm text-muted-foreground">{data.current.humidity}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Viento</p>
                    <p className="text-sm text-muted-foreground">{data.current.wind_speed} km/h</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Presión</p>
                    <p className="text-sm text-muted-foreground">{data.current.pressure} hPa</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Visibilidad</p>
                    <p className="text-sm text-muted-foreground">{data.current.visibility} km</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forecast */}
          {data.forecast && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pronóstico 5 días</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.forecast.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{day.date}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {day.temp_max}°/{day.temp_min}°
                        </span>
                        <div className="text-lg">{getWeatherIcon(day.weather.icon)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Footer */}
      <div className="text-center pt-4">
        <p className="text-xs text-muted-foreground">Powered by OpenWeather & Mapbox</p>
      </div>
    </div>
  )
}
