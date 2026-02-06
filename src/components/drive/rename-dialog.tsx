"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Loader2, X } from "lucide-react"
import { renameItem } from "@/actions/storage"
import { toast } from "sonner"

interface RenameDialogProps {
  isOpen: boolean
  onClose: () => void
  itemId: string
  itemType: "file" | "folder"
  currentName: string
}

export function RenameDialog({ isOpen, onClose, itemId, itemType, currentName }: RenameDialogProps) {
  const [name, setName] = useState(currentName)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setName(currentName)
    }
  }, [isOpen, currentName])

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || name === currentName) {
        onClose()
        return
    }

    setIsLoading(true)
    try {
      await renameItem(itemId, itemType, name)
      toast.success("Renomeado com sucesso")
      onClose()
    } catch (error) {
      console.error(error)
      toast.error("Erro ao renomear")
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-card w-full max-w-sm rounded-xl border border-border shadow-2xl animate-in fade-in zoom-in duration-200 z-[101]">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-medium text-lg">Renomear</h3>
          <button onClick={onClose} className="text-muted-fg hover:text-fg cursor-pointer p-1 hover:bg-accent/10 rounded-md transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <form onSubmit={handleRename} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-fg mb-1.5">Novo nome</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm text-muted-fg hover:text-fg hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isLoading || !name.trim()}
              className="px-4 py-2 text-sm bg-accent text-accent-fg hover:bg-accent/90 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Renomear
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
