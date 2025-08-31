import { type NextRequest, NextResponse } from "next/server"
import type { OpenWeatherResponse, OpenWeatherForecastResponse, WeatherData } from "@/lib/weather-api"
import { kelvinToCelsius, msToKmh, metersToKm } from "@/lib/weather-api"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const city = searchParams.get("city")

  if (!lat && !lon && !city) {
    return NextResponse.json({ error: "Se requieren coordenadas (lat, lon) o nombre de ciudad" }, { status: 400 })
  }

  const API_KEY = process.env.OPENWEATHER_API_KEY
  if (!API_KEY) {
    return NextResponse.json({ error: "API key de OpenWeather no configurada" }, { status: 500 })
  }

  try {
    let weatherUrl = ""
    let forecastUrl = ""

    if (city) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}`
    } else {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    }

    // Fetch current weather and forecast in parallel
    const [weatherResponse, forecastResponse] = await Promise.all([fetch(weatherUrl), fetch(forecastUrl)])

    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.json()
      return NextResponse.json(
        { error: errorData.message || "Error al obtener datos del clima" },
        { status: weatherResponse.status },
      )
    }

    const weatherData: OpenWeatherResponse = await weatherResponse.json()
    const forecastData: OpenWeatherForecastResponse = await forecastResponse.json()

    // Process forecast data (get daily forecasts)
    const dailyForecasts = forecastData.list
      .filter((_, index) => index % 8 === 0) // Get one forecast per day (every 8th item = 24 hours)
      .slice(0, 5) // Get 5 days
      .map((item) => ({
        date: new Date(item.dt * 1000).toLocaleDateString("es-ES", { weekday: "long" }),
        temp_max: kelvinToCelsius(item.main.temp_max),
        temp_min: kelvinToCelsius(item.main.temp_min),
        weather: {
          main: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        },
      }))

    // Transform the data to our format
    const transformedData: WeatherData = {
      location: {
        name: weatherData.name,
        country: weatherData.sys.country,
        lat: weatherData.coord.lat,
        lon: weatherData.coord.lon,
      },
      current: {
        temp: kelvinToCelsius(weatherData.main.temp),
        feels_like: kelvinToCelsius(weatherData.main.feels_like),
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        visibility: metersToKm(weatherData.visibility),
        wind_speed: msToKmh(weatherData.wind.speed),
        wind_deg: weatherData.wind.deg,
        weather: {
          main: weatherData.weather[0].main,
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
        },
      },
      forecast: dailyForecasts,
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
