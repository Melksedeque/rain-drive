export type WeatherState = "CLOUDY" | "DRY" | "RAINING"

interface WeatherResponse {
  current: {
    precipitation: number
    weather_code: number
  }
}

// Códigos WMO de chuva/garoa/tempestade
// https://open-meteo.com/en/docs
const RAIN_CODES = [
  51, 53, 55, // Drizzle
  56, 57, // Freezing Drizzle
  61, 63, 65, // Rain
  66, 67, // Freezing Rain
  80, 81, 82, // Rain showers
  95, 96, 99, // Thunderstorm
]

// Cache simples em memória (global variable)
// Em produção serverless, isso pode resetar, mas ok para MVP.
// O ideal seria KV ou Redis, mas vamos manter simples conforme specs.
let weatherCache: {
  state: WeatherState
  timestamp: number
  lat?: number
  lon?: number
} | null = null

const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutos

export async function checkWeather(lat?: number, lon?: number): Promise<WeatherState> {
  // 1. Verificar cache
  const now = Date.now()
  if (weatherCache && (now - weatherCache.timestamp < CACHE_TTL_MS)) {
    // Se tiver geo específica, verificar se é "perto" o suficiente ou ignorar e usar cache global
    // Para MVP, vamos simplificar: se tem cache válido, usa ele.
    return weatherCache.state
  }

  try {
    // 2. Definir coordenadas (Default: São Paulo/SP - Onde sempre chove quando não deve)
    const targetLat = lat ?? -23.5505
    const targetLon = lon ?? -46.6333

    // 3. Consultar Open-Meteo
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${targetLat}&longitude=${targetLon}&current=precipitation,weather_code`,
      { next: { revalidate: 60 } } // Cache do fetch do Next.js
    )

    if (!response.ok) {
      throw new Error("Weather API error")
    }

    const data: WeatherResponse = await response.json()
    
    // 4. Determinar estado
    const isRaining = 
      data.current.precipitation > 0 || 
      RAIN_CODES.includes(data.current.weather_code)

    const newState: WeatherState = isRaining ? "RAINING" : "DRY"

    // 5. Atualizar cache
    weatherCache = {
      state: newState,
      timestamp: now,
      lat: targetLat,
      lon: targetLon
    }

    return newState

  } catch (error) {
    console.error("Weather check failed:", error)
    // Fallback: Modo anti-felicidade (assumir DRY para não bloquear sem saber, 
    // OU assumir erro e bloquear? Docs diz: "assumir DRY (sem chuva) - modo anti-felicidade")
    return "DRY"
  }
}
