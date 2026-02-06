"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { createPortal } from "react-dom"

type ContextMenuContextType = {
  open: (x: number, y: number, content: React.ReactNode) => void
  close: () => void
  isOpen: boolean
}

const ContextMenuContext = createContext<ContextMenuContextType | undefined>(undefined)

export function ContextMenuProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [content, setContent] = useState<React.ReactNode | null>(null)
  const [isRendered, setIsRendered] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true)
    } else {
      const timer = setTimeout(() => {
        setIsRendered(false)
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
    }
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const open = useCallback((x: number, y: number, newContent: React.ReactNode) => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current)
    }

    openTimeoutRef.current = setTimeout(() => {
      try {
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const estimatedWidth = 200 
        const estimatedHeight = 300 

        let finalX = x
        let finalY = y

        if (x + estimatedWidth > viewportWidth) finalX = x - estimatedWidth
        if (y + estimatedHeight > viewportHeight) finalY = y - estimatedHeight

        setPosition({ x: finalX, y: finalY })
        setContent(newContent)
        setIsOpen(true)
      } catch (error) {
        console.error("ContextMenuProvider: Error opening menu", error)
      }
    }, 50)
  }, [])

  useEffect(() => {
    const handleInteraction = (e: Event) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        return
      }
      if (isOpen) {
        close()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }

    window.addEventListener("scroll", close, true)
    window.addEventListener("resize", close)
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("click", handleInteraction)
    window.addEventListener("contextmenu", handleInteraction)

    return () => {
      window.removeEventListener("scroll", close, true)
      window.removeEventListener("resize", close)
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("click", handleInteraction)
      window.removeEventListener("contextmenu", handleInteraction)
    }
  }, [isOpen, close])

  return (
    <ContextMenuContext.Provider value={{ open, close, isOpen }}>
      {children}
      {isRendered && createPortal(
        <div
          ref={menuRef}
          data-state={isOpen ? "open" : "closed"}
          className={`
            fixed z-50 min-w-20 overflow-hidden rounded-md border border-border bg-card p-1 text-card-fg shadow-md 
            animate-in fade-in zoom-in-95 duration-100 
            data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
          `}
          style={{ 
            left: position.x, 
            top: position.y,
          }}
          onClick={(e) => {
            close()
            e.stopPropagation()
          }}
          onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          {content}
        </div>,
        document.body
      )}
    </ContextMenuContext.Provider>
  )
}

export function useContextMenu() {
  const context = useContext(ContextMenuContext)
  if (!context) {
    throw new Error("useContextMenu must be used within a ContextMenuProvider")
  }
  return context
}
