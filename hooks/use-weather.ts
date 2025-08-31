"use client"

import { useState, useEffect } from "react"
import type { WeatherData } from "@/lib/weather-api"

interface UseWeatherProps {
  lat?: number
  lon?: number
  city?: string
}

interface UseWeatherReturn {
  data: WeatherData | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useWeather({ lat, lon, city }: UseWeatherProps): UseWeatherReturn {
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = async () => {
    if (!lat && !lon && !city) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (city) {
        params.append("city", city)
      } else if (lat && lon) {
        params.append("lat", lat.toString())
        params.append("lon", lon.toString())
      }

      const response = await fetch(`/api/weather?${params}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al cargar datos del clima")
      }

      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()
  }, [lat, lon, city])

  return {
    data,
    loading,
    error,
    refetch: fetchWeather,
  }
}
