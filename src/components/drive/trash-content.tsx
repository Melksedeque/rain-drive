"use client"

import { FileIcon, Folder as FolderIcon, Trash2, RotateCcw, AlertTriangle, Loader2 } from "lucide-react"
import { File, Folder } from "@prisma/client"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { restoreItem, permanentDeleteItem, emptyTrash } from "@/actions/storage"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface TrashContentProps {
  files: File[]
  folders: Folder[]
}

import { TrashActionsMenu } from "./trash-actions-menu"

export function TrashContent({ files, folders }: TrashContentProps) {
  const router = useRouter()
  const [isEmptying, setIsEmptying] = useState(false)
  // ... existing state ...

  // Keep existing handlers if they are still needed for the inline buttons, 
  // or remove them if we fully replace with context menu.
  // The requirement is to ADD context menu, not necessarily replace inline buttons.
  // But usually context menu is hidden until right click.
  // The user asked to "Criar componente de menu de contexto... Adicionar as opções...".
  // Let's wrap the rows in TrashActionsMenu.

  // ...


  const handleRestore = async (id: string, type: "file" | "folder") => {
    setProcessingId(id)
    try {
      await restoreItem(id, type)
      toast.success("Item restaurado com sucesso")
    } catch (error) {
      toast.error("Erro ao restaurar item")
      console.error(error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleDelete = async (id: string, type: "file" | "folder") => {
    if (!confirm("Tem certeza? Esta ação não pode ser desfeita.")) return

    setProcessingId(id)
    try {
      await permanentDeleteItem(id, type)
      toast.success("Item excluído permanentemente")
    } catch (error) {
      toast.error("Erro ao excluir item")
      console.error(error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleEmptyTrash = async () => {
    if (!confirm("Tem certeza que deseja esvaziar a lixeira? Todos os itens serão perdidos permanentemente.")) return

    setIsEmptying(true)
    try {
      await emptyTrash()
      toast.success("Lixeira esvaziada")
    } catch (error) {
      toast.error("Erro ao esvaziar lixeira")
      console.error(error)
    } finally {
      setIsEmptying(false)
    }
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <header className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-fg flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-red-500" />
            Lixeira
          </h1>
          <p className="text-muted-fg text-sm mt-1">
            Itens são excluídos permanentemente após 30 dias
          </p>
        </div>
        {!isEmpty && (
            <button 
                onClick={handleEmptyTrash}
                disabled={isEmptying}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
                {isEmptying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Esvaziar Lixeira
            </button>
        )}
      </header>

      <section className="flex-1 overflow-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Trash2 className="w-12 h-12 text-muted-fg/20 mb-4" />
            <h3 className="text-lg font-medium text-fg">A lixeira está vazia</h3>
            <p className="text-muted-fg text-sm max-w-sm mt-1">
              Itens que você excluir aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-fg font-medium">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3 w-32">Tipo</th>
                  <th className="px-4 py-3 w-32">Tamanho</th>
                  <th className="px-4 py-3 w-32">Deletado em</th>
                  <th className="px-4 py-3 w-32 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {folders.map((folder) => (
                  <TrashActionsMenu key={folder.id} item={folder} itemType="folder">
                    <tr className="group hover:bg-accent/5 transition-colors cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-accent/10 text-accent rounded-lg">
                             <FolderIcon className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-fg">{folder.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-fg text-xs">Pasta</td>
                      <td className="px-4 py-3 text-muted-fg font-mono text-xs">-</td>
                      <td className="px-4 py-3 text-muted-fg text-xs">
                          {folder.deletedAt ? new Date(folder.deletedAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                              <button 
                                  onClick={() => handleRestore(folder.id, "folder")}
                                  disabled={processingId === folder.id}
                                  className="p-2 hover:bg-green-500/10 text-muted-fg hover:text-green-500 rounded-full transition-colors cursor-pointer"
                                  title="Restaurar"
                              >
                                  {processingId === folder.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                              </button>
                              <button 
                                  onClick={() => handleDelete(folder.id, "folder")}
                                  disabled={processingId === folder.id}
                                  className="p-2 hover:bg-red-500/10 text-muted-fg hover:text-red-500 rounded-full transition-colors cursor-pointer"
                                  title="Excluir Permanentemente"
                              >
                                  <Trash2 className="w-4 h-4" />
                              </button>
                          </div>
                      </td>
                    </tr>
                  </TrashActionsMenu>
                ))}
                {files.map((file) => (
                  <TrashActionsMenu key={file.id} item={file} itemType="file">
                    <tr className="group hover:bg-accent/5 transition-colors cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-accent/10 text-accent rounded-lg">
                             <FileIcon className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-fg">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-fg text-xs">Arquivo</td>
                      <td className="px-4 py-3 text-muted-fg font-mono text-xs">
                          {(Number(file.sizeBytes) / 1024 / 1024).toFixed(2)} MB
                      </td>
                      <td className="px-4 py-3 text-muted-fg text-xs">
                          {file.deletedAt ? new Date(file.deletedAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                              <button 
                                  onClick={() => handleRestore(file.id, "file")}
                                  disabled={processingId === file.id}
                                  className="p-2 hover:bg-green-500/10 text-muted-fg hover:text-green-500 rounded-full transition-colors cursor-pointer"
                                  title="Restaurar"
                              >
                                  {processingId === file.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                              </button>
                              <button 
                                  onClick={() => handleDelete(file.id, "file")}
                                  disabled={processingId === file.id}
                                  className="p-2 hover:bg-red-500/10 text-muted-fg hover:text-red-500 rounded-full transition-colors cursor-pointer"
                                  title="Excluir Permanentemente"
                              >
                                  <Trash2 className="w-4 h-4" />
                              </button>
                          </div>
                      </td>
                    </tr>
                  </TrashActionsMenu>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
