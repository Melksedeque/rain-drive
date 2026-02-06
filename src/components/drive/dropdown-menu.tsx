"use client"

import React, { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"

interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: "left" | "right"
}

export function DropdownMenu({ trigger, children, align = "left" }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const scrollY = window.scrollY
      const scrollX = window.scrollX
      
      // Basic positioning
      const top = rect.bottom + scrollY + 4
      let left = rect.left + scrollX

      // We'll adjust left after render if needed, but for now let's guess
      // If align right, we subtract width (assumed ~12rem) or handle in CSS
      if (align === "right") {
         left = rect.right + scrollX - 192 // 192px = 12rem (w-48)
      }

      setPosition({ top, left })
    }
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(e.target as Node) && 
        triggerRef.current && 
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    
    const handleScroll = () => setIsOpen(false)
    const handleResize = () => setIsOpen(false)
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsOpen(false)
    }

    if (isOpen) {
      window.addEventListener("click", handleOutsideClick)
      window.addEventListener("scroll", handleScroll, true)
      window.addEventListener("resize", handleResize)
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick)
      window.removeEventListener("scroll", handleScroll, true)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  return (
    <>
      <div ref={triggerRef} onClick={toggle} className="inline-block">
        {trigger}
      </div>
      {isOpen && createPortal(
        <div 
          ref={menuRef}
          className="fixed z-50 min-w-[12rem] w-48 overflow-hidden rounded-md border border-border bg-card p-1 text-card-fg shadow-md animate-in fade-in zoom-in-95 duration-100"
          style={{ top: position.top, left: position.left }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>,
        document.body
      )}
    </>
  )
}
