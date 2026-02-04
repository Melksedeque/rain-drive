"use client"

import { CloudRain, Cloud, Sun, Loader2 } from "lucide-react"
import { useWeather } from "@/components/providers/weather-provider"
import { cn } from "@/lib/utils"

export function WeatherWidget({ className }: { className?: string }) {
  const { status, loading } = useWeather()

  if (loading) {
    return (
      <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium animate-pulse", className)}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Verificando clima...</span>
      </div>
    )
  }

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
