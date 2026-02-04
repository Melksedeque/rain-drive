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
  51, 53, 55, // Chuvisco
  56, 57, // Chuvisco congelante
  61, 63, 65, // Chuva
  66, 67, // Chuva congelante
  80, 81, 82, // Pancadas de chuva
  95, 96, 99, // Tempestade
]

// Cache simples em memória (variável global)
// Em produção serverless, isso pode resetar, mas ok para MVP.
// TODO: Migrar para KV ou Redis (ver PENDING.md)
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
    // Se tiver cache válido, usa ele para economizar chamadas
    return weatherCache.state
  }

  try {
    // 2. Definir coordenadas (Padrão: São Paulo/SP)
    const targetLat = lat ?? -23.5505
    const targetLon = lon ?? -46.6333

    // 3. Consultar Open-Meteo
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${targetLat}&longitude=${targetLon}&current=precipitation,weather_code`,
      { next: { revalidate: 60 } } // Cache do fetch do Next.js
    )

    if (!response.ok) {
      throw new Error("Erro na API de Clima")
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
    console.error("Falha na verificação do clima:", error)
    // Fallback: Assume "DRY" (sem chuva) em caso de erro para segurança
    return "DRY"
  }
}
