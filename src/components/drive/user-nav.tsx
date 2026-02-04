"use client"

import { signOut } from "next-auth/react"
import { LogOut, User } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function UserNav({ email }: { email?: string | null }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center border border-accent/20 hover:bg-accent/20 transition-colors cursor-pointer"
      >
        <User className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50 p-1"
          >
            <div className="px-3 py-2 border-b border-border mb-1">
                <p className="text-sm font-medium truncate">{email}</p>
                <p className="text-xs text-muted-fg">Plano Gratuito</p>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
