"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Clock, Trash2, HardDrive } from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"

const sidebarItems = [
  { icon: HardDrive, label: "Meu Drive", href: "/drive" },
  { icon: Clock, label: "Recentes", href: "/drive/recent" },
  { icon: Trash2, label: "Lixeira", href: "/drive/trash" },
]

export function Sidebar({ usageBytes = 0 }: { usageBytes?: number }) {
  const pathname = usePathname()
  const limitBytes = 1024 * 1024 * 1024; // 1GB
  const percentage = Math.min((usageBytes / limitBytes) * 100, 100);
  const usageFormatted = (usageBytes / (1024 * 1024)).toFixed(1); // MB
  const limitFormatted = "1 GB";

  return (
    <aside className="w-64 border-r border-border bg-card/30 flex-col h-full hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <Logo className="text-lg" />
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
            <span className="text-xs font-bold text-accent">{Math.round(percentage)}%</span>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent rounded-full transition-all duration-500" 
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-fg mt-2">
            {usageFormatted} MB de {limitFormatted} usados
          </p>
        </div>
      </div>
    </aside>
  )
}
