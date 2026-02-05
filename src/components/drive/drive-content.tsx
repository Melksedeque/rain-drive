"use client"

import { FolderCard } from "@/components/drive/folder-card"
import { FileIcon, ChevronRight, Home, UploadCloud, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useCallback } from "react"
import { useFileUpload } from "@/hooks/use-file-upload"
import { cn } from "@/lib/utils"
import { moveItem } from "@/actions/storage"
import { ItemActions } from "./item-actions"
import { useWeather } from "@/components/providers/weather-provider"
import { toast } from "sonner"

import { Folder, File } from "@prisma/client"

interface FolderWithCount extends Folder {
  _count?: {
    files: number
    children: number
  }
}

interface DriveContentProps {
  folders: FolderWithCount[]
  files: File[]
  breadcrumbs?: { label: string; href: string }[]
  currentFolderId?: string | null
}

export function DriveContent({ folders, files, breadcrumbs = [], currentFolderId }: DriveContentProps) {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [draggedItem, setDraggedItem] = useState<{ id: string; type: "file" | "folder" } | null>(null)
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null)
  const { uploadFile } = useFileUpload({ folderId: currentFolderId })
  const { status: weatherStatus } = useWeather()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Only set global dragging if NOT dragging an internal item
    if (!draggedItem) {
        setIsDragging(true)
    }
  }, [draggedItem])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!draggedItem) {
        setIsDragging(false)
    }
  }, [draggedItem])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      await uploadFile(file)
    }
  }, [uploadFile])

  // Internal DnD handlers
  const handleItemDragStart = (e: React.DragEvent, id: string, type: "file" | "folder") => {
    e.stopPropagation()
    setDraggedItem({ id, type })
    e.dataTransfer.effectAllowed = "move"
    // Set transparent image or custom drag image if needed
  }

  const handleFolderDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (draggedItem && draggedItem.id !== folderId) {
        setDragOverFolderId(folderId)
        e.dataTransfer.dropEffect = "move"
    }
  }

  const handleFolderDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverFolderId(null)
  }

  const handleFolderDrop = async (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverFolderId(null)

    if (draggedItem) {
        if (draggedItem.id === targetFolderId) return // Cannot move to itself

        try {
            await moveItem(draggedItem.id, draggedItem.type, targetFolderId)
            toast.success("Item movido")
            // Optimistic update could happen here, but router.refresh() handles it via server action
        } catch (error) {
            console.error("Failed to move item", error)
            toast.error("Erro ao mover item")
        }
        setDraggedItem(null)
    }
  }

  return (
    <div 
      className="space-y-6 h-full min-h-[calc(100vh-8rem)] relative flex flex-col"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-accent/10 border-2 border-dashed border-accent rounded-xl z-50 flex items-center justify-center backdrop-blur-sm pointer-events-none">
          <div className="text-center p-8 bg-card rounded-xl shadow-lg animate-in fade-in zoom-in duration-200">
            <UploadCloud className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-medium text-fg">Solte para fazer upload</h3>
            <p className="text-sm text-muted-fg mt-1">O arquivo será salvo nesta pasta</p>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-muted-fg">
        <Link href="/drive" className="hover:text-fg transition-colors flex items-center gap-1">
          <Home className="w-4 h-4" />
        </Link>
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-1 text-border" />
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-fg">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-fg transition-colors">
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      <section>
        <h2 className="text-sm font-medium text-muted-fg mb-4 uppercase tracking-wider">Pastas</h2>
        {folders.length === 0 ? (
           <p className="text-sm text-muted-fg italic">Nenhuma pasta criada.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {folders.map((folder) => (
              <div 
                key={folder.id} 
                onClick={() => router.push(`/drive/${folder.id}`)}
                draggable
                onDragStart={(e) => handleItemDragStart(e, folder.id, "folder")}
                onDragOver={(e) => handleFolderDragOver(e, folder.id)}
                onDragLeave={handleFolderDragLeave}
                onDrop={(e) => handleFolderDrop(e, folder.id)}
                className={cn(
                    "transition-all duration-200 rounded-xl cursor-pointer",
                    dragOverFolderId === folder.id && "ring-2 ring-accent scale-105 bg-accent/5",
                    draggedItem?.id === folder.id && "opacity-50"
                )}
              >
                <FolderCard 
                  name={folder.name} 
                  itemCount={(folder._count?.files || 0) + (folder._count?.children || 0)}
                  status={weatherStatus}
                  menu={<ItemActions id={folder.id} type="folder" />}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-medium text-muted-fg mb-4 uppercase tracking-wider">Arquivos</h2>
        {files.length === 0 ? (
           <p className="text-sm text-muted-fg italic">Nenhum arquivo aqui.</p>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-fg font-medium">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3 w-32">Tamanho</th>
                  <th className="px-4 py-3 w-32">Modificado</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {files.map((file) => (
                  <tr 
                    key={file.id} 
                    className={cn(
                        "group hover:bg-accent/5 transition-colors cursor-move",
                        draggedItem?.id === file.id && "opacity-50 bg-accent/10"
                    )}
                    draggable
                    onDragStart={(e) => handleItemDragStart(e, file.id, "file")}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-accent/10 text-accent rounded">
                            <FileIcon className="w-4 h-4" />
                        </div>
                        <a 
                           href={`/api/download?fileId=${file.id}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="font-medium text-fg group-hover:text-accent transition-colors hover:underline"
                           onClick={(e) => e.stopPropagation()}
                         >
                           {file.name}
                         </a>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-fg">{(Number(file.sizeBytes) / 1024 / 1024).toFixed(2)} MB</td>
                    <td className="px-4 py-3 text-muted-fg">{new Date(file.updatedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                        <button className="text-muted-fg hover:text-fg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
