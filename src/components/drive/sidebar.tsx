"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Cloud, Clock, Trash2, HardDrive } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { icon: HardDrive, label: "Meu Drive", href: "/drive" },
  { icon: Clock, label: "Recentes", href: "/drive/recent" },
  { icon: Trash2, label: "Lixeira", href: "/drive/trash" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card/30 flex flex-col h-full hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="bg-accent/10 p-1.5 rounded-lg text-accent">
            <Cloud className="w-5 h-5" />
          </div>
          <span>RainDrive</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                isActive 
                  ? "bg-accent/10 text-accent" 
                  : "text-muted-fg hover:bg-accent/5 hover:text-fg"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="bg-accent/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-fg">Armazenamento</span>
            <span className="text-xs font-bold text-accent">75%</span>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-accent w-3/4 rounded-full" />
          </div>
          <p className="text-[10px] text-muted-fg mt-2">
            7.5 GB de 10 GB usados
          </p>
        </div>
      </div>
    </aside>
  )
}
