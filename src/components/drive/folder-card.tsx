import { Folder, MoreHorizontal } from "lucide-react"
import { StatusBadge, WeatherStatus } from "./status-badge"

interface FolderProps {
  name: string
  itemCount: number
  status: WeatherStatus
  menu?: React.ReactNode
}

export function FolderCard({ name, itemCount, status, menu }: FolderProps) {
  return (
    <div className="group bg-card border border-border rounded-xl p-4 hover:border-accent/50 hover:shadow-md transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 bg-accent/10 text-accent rounded-lg">
          <Folder className="w-6 h-6" />
        </div>
        <div onClick={(e) => e.stopPropagation()}>
            {menu || (
                <button className="text-muted-fg hover:text-fg opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted-fg/10 rounded cursor-pointer">
                <MoreHorizontal className="w-4 h-4" />
                </button>
            )}
        </div>
      </div>
      
      <h3 className="font-medium truncate mb-1" title={name}>{name}</h3>
      
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-muted-fg">{itemCount} itens</span>
        <StatusBadge status={status} />
      </div>
    </div>
  )
}
