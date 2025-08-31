// OpenWeather API types and utilities

export interface WeatherData {
  location: {
    name: string
    country: string
    lat: number
    lon: number
  }
  current: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
    visibility: number
    wind_speed: number
    wind_deg: number
    weather: {
      main: string
      description: string
      icon: string
    }
  }
  forecast?: ForecastDay[]
}

export interface ForecastDay {
  date: string
  temp_max: number
  temp_min: number
  weather: {
    main: string
    description: string
    icon: string
  }
}

export interface OpenWeatherResponse {
  name: string
  sys: { country: string }
  coord: { lat: number; lon: number }
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
}

export interface OpenWeatherForecastResponse {
  list: Array<{
    dt: number
    main: {
      temp_max: number
      temp_min: number
    }
    weather: Array<{
      main: string
      description: string
      icon: string
    }>
  }>
}

// Weather icon mapping for better display
export const getWeatherIcon = (iconCode: string): string => {
  const iconMap: Record<string, string> = {
    "01d": "☀️", // clear sky day
    "01n": "🌙", // clear sky night
    "02d": "⛅", // few clouds day
    "02n": "☁️", // few clouds night
    "03d": "☁️", // scattered clouds
    "03n": "☁️", // scattered clouds
    "04d": "☁️", // broken clouds
    "04n": "☁️", // broken clouds
    "09d": "🌧️", // shower rain
    "09n": "🌧️", // shower rain
    "10d": "🌦️", // rain day
    "10n": "🌧️", // rain night
    "11d": "⛈️", // thunderstorm
    "11n": "⛈️", // thunderstorm
    "13d": "❄️", // snow
    "13n": "❄️", // snow
    "50d": "🌫️", // mist
    "50n": "🌫️", // mist
  }
  return iconMap[iconCode] || "🌤️"
}

// Convert temperature from Kelvin to Celsius
export const kelvinToCelsius = (kelvin: number): number => {
  return Math.round(kelvin - 273.15)
}

// Convert wind speed from m/s to km/h
export const msToKmh = (ms: number): number => {
  return Math.round(ms * 3.6)
}

// Convert visibility from meters to kilometers
export const metersToKm = (meters: number): number => {
  return Math.round(meters / 1000)
}

// Get weather description in Spanish
export const getWeatherDescriptionES = (main: string): string => {
  const descriptions: Record<string, string> = {
    Clear: "Despejado",
    Clouds: "Nublado",
    Rain: "Lluvia",
    Drizzle: "Llovizna",
    Thunderstorm: "Tormenta",
    Snow: "Nieve",
    Mist: "Neblina",
    Fog: "Niebla",
    Haze: "Bruma",
    Dust: "Polvo",
    Sand: "Arena",
    Ash: "Ceniza",
    Squall: "Chubasco",
    Tornado: "Tornado",
  }
  return descriptions[main] || main
}
