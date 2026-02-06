"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Loader2, X } from "lucide-react"
import { createFolder } from "@/actions/storage"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"

interface CreateFolderDialogProps {
  isOpen: boolean
  onClose: () => void
  parentId?: string | null
}

export function CreateFolderDialog({ isOpen, onClose, parentId: propParentId }: CreateFolderDialogProps) {
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      setName("")
    }
  }, [isOpen])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    
    // Use prop parentId if provided, otherwise fallback to pathname extraction
    const parentId = propParentId !== undefined 
      ? propParentId 
      : (pathname.startsWith('/drive/') && pathname.length > 7 ? pathname.split('/drive/')[1] : null)

    try {
      await createFolder(name, parentId)
      onClose()
      setName("")
      router.refresh()
      toast.success("Pasta criada")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar pasta")
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card w-full max-w-sm rounded-xl border border-border shadow-2xl animate-in fade-in zoom-in duration-200 z-[101]">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-medium text-lg">Nova Pasta</h3>
          <button onClick={onClose} className="text-muted-fg hover:text-fg cursor-pointer p-1 hover:bg-accent/10 rounded-md transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <form onSubmit={handleCreate} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-fg mb-1.5">Nome da pasta</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Projetos"
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
              className="px-4 py-2 bg-accent text-accent-fg rounded-lg text-sm font-medium hover:bg-accent/90 disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
