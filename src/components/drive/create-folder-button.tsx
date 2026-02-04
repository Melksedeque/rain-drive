"use client"

import { useState } from "react"
import { FolderPlus, Loader2, X } from "lucide-react"
import { createFolder } from "@/actions/storage"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"

export function CreateFolderButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    
    // Extract folderId
    const parentId = pathname.startsWith('/drive/') && pathname.length > 7 
      ? pathname.split('/drive/')[1] 
      : null

    try {
      await createFolder(name, parentId)
      setIsOpen(false)
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

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-card border border-border text-fg rounded-lg text-sm font-medium hover:bg-accent/5 transition-colors"
      >
        <FolderPlus className="w-4 h-4" />
        Nova Pasta
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-sm rounded-xl border border-border shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-medium">Nova Pasta</h3>
              <button onClick={() => setIsOpen(false)} className="text-muted-fg hover:text-fg cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-fg mb-1">Nome</label>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Projetos"
                  className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 text-sm text-muted-fg hover:text-fg"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading || !name.trim()}
                  className="px-3 py-1.5 bg-accent text-accent-fg rounded-lg text-sm font-medium hover:bg-accent/90 disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
