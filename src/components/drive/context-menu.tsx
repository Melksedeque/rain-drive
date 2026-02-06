"use client"

import * as React from "react"

export function ContextMenuItem({ 
  children, 
  onClick, 
  className,
  danger = false,
  inset = false,
  disabled = false
}: { 
  children: React.ReactNode
  onClick?: () => void
  className?: string
  danger?: boolean
  inset?: boolean
  disabled?: boolean
}) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      data-disabled={disabled ? true : undefined}
      className={`
        relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors 
        hover:bg-accent hover:text-accent-fg focus:bg-accent focus:text-accent-fg 
        data-disabled:pointer-events-none data-disabled:opacity-50
        ${danger ? "text-red-500 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20" : ""}
        ${inset ? "pl-8" : ""}
        ${className || ""}
      `}
    >
      {children}
    </div>
  )
}

export function ContextMenuSeparator() {
  return <div className="-mx-1 my-1 h-px bg-border" />
}
