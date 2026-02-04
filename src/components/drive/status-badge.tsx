import { Cloud, CloudRain, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

export type WeatherStatus = "CLOUDY" | "DRY" | "RAINING"

const statusConfig = {
  CLOUDY: {
    icon: Cloud,
    label: "Nublado",
    className: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  },
  DRY: {
    icon: Sun,
    label: "Seco",
    className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  },
  RAINING: {
    icon: CloudRain,
    label: "Chovendo",
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
}

export function StatusBadge({ status }: { status: WeatherStatus }) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium w-fit", config.className)}>
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </div>
  )
}
