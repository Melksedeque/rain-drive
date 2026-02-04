"use client"

import { Cloud, CloudRain, Sun, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useWeather } from "@/components/providers/weather-provider"

export function WeatherWidget() {
  const { status, loading } = useWeather()

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors",
      status === "CLOUDY" && "bg-gray-500/10 text-gray-500 border-gray-500/20",
      status === "DRY" && "bg-orange-500/10 text-orange-500 border-orange-500/20",
      status === "RAINING" && "bg-blue-500/10 text-blue-500 border-blue-500/20"
    )}>
      {status === "CLOUDY" && (
        <>
            <Cloud className="w-3.5 h-3.5" />
            <span>Verificando clima...</span>
        </>
      )}
      {status === "DRY" && (
        <>
            <Sun className="w-3.5 h-3.5" />
            <span>Seco • Downloads bloqueados</span>
        </>
      )}
      {status === "RAINING" && (
        <>
            <CloudRain className="w-3.5 h-3.5" />
            <span>Chovendo • Downloads liberados</span>
        </>
      )}
    </div>
  )
}
