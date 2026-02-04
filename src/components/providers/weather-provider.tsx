"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { WeatherState } from "@/lib/weather"

interface WeatherContextType {
  status: WeatherState
  loading: boolean
  refresh: () => Promise<void>
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined)

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<WeatherState>("CLOUDY")
  const [loading, setLoading] = useState(true)

  const fetchWeather = async () => {
    try {
        let lat, lon
        if (typeof navigator !== "undefined" && "geolocation" in navigator) {
            try {
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
                })
                lat = position.coords.latitude
                lon = position.coords.longitude
            } catch (e) {
                // ignore
            }
        }
        const query = lat && lon ? `?lat=${lat}&lon=${lon}` : ""
        const res = await fetch(`/api/weather${query}`)
        if (res.ok) {
            const data = await res.json()
            setStatus(data.status)
        }
    } catch (error) {
        console.error("Weather fetch failed", error)
        setStatus("DRY")
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()
    const interval = setInterval(fetchWeather, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <WeatherContext.Provider value={{ status, loading, refresh: fetchWeather }}>
      {children}
    </WeatherContext.Provider>
  )
}

export function useWeather() {
  const context = useContext(WeatherContext)
  if (context === undefined) {
    throw new Error("useWeather must be used within a WeatherProvider")
  }
  return context
}
