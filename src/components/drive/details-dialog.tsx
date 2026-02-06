"use client"

import { useEffect, useState, type ElementType } from "react"
import { createPortal } from "react-dom"
import { X, FileText, Calendar, HardDrive, Tag, Trash2, Clock } from "lucide-react"
import { File } from "@prisma/client"
import { formatBytes } from "@/lib/utils"

interface DetailsDialogProps {
  onClose: () => void
  file: File
}

const DetailRow = ({ icon: Icon, label, value, className }: { icon: any, label: string, value: string, className?: string }) => (
  <div className={`flex items-start gap-3 py-3 border-b border-border last:border-0 ${className}`}>
    <div className="p-2 bg-muted rounded-lg shrink-0">
      <Icon className="w-4 h-4 text-muted-fg" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-muted-fg uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-medium text-fg break-all">{value}</p>
    </div>
  </div>
)

export function DetailsDialog({ onClose, file }: DetailsDialogProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  if (!mounted) return null

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
        onClick={onClose}
      />
      
      <div className="relative bg-card w-full max-w-md rounded-xl border border-border shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-101 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <h3 className="font-medium text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            Detalhes do Arquivo
          </h3>
          <button onClick={onClose} className="text-muted-fg hover:text-fg cursor-pointer p-1 hover:bg-accent/10 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto">
          <div className="space-y-1">
            <DetailRow 
              icon={FileText} 
              label="Nome" 
              value={file.name} 
            />
            <DetailRow 
              icon={Tag} 
              label="Tipo" 
              value={file.mimeType} 
            />
            <DetailRow 
              icon={HardDrive} 
              label="Tamanho" 
              value={formatBytes(file.sizeBytes)} 
            />
            <DetailRow 
              icon={Calendar} 
              label="Criado em" 
              value={formatDate(file.createdAt)} 
            />
            <DetailRow 
              icon={Clock} 
              label="Modificado em" 
              value={formatDate(file.updatedAt)} 
            />
            
            {file.inTrash && file.deletedAt && (
              <DetailRow 
                icon={Trash2} 
                label="Excluído em" 
                value={formatDate(file.deletedAt)}
                className="bg-red-50 dark:bg-red-900/10 -mx-4 px-4 border-red-100 dark:border-red-900/20"
              />
            )}
          </div>
        </div>

        <div className="p-4 border-t border-border bg-muted/30 rounded-b-xl shrink-0 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm bg-accent text-accent-fg hover:bg-accent/90 rounded-lg transition-colors cursor-pointer font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
