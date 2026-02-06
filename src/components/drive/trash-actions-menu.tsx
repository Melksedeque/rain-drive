"use client"

import * as React from "react"
import { useState } from "react"
import { 
  RotateCcw, Trash2, Info
} from "lucide-react"
import { ContextMenuItem, ContextMenuSeparator } from "./context-menu"
import { useContextMenu } from "@/components/providers/context-menu-provider"
import { DetailsDialog } from "./details-dialog"
import { restoreItem, permanentDeleteItem } from "@/actions/storage"
import { toast } from "sonner"
import { File, Folder } from "@prisma/client"

interface TrashActionsMenuProps {
  item: File | Folder
  itemType: "file" | "folder"
  children?: React.ReactNode
}

export function TrashActionsMenu({ item, itemType, children }: TrashActionsMenuProps) {
  const { open } = useContextMenu()
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleRestore = async () => {
    setIsRestoring(true)
    try {
      await restoreItem(item.id, itemType)
      toast.success("Item restaurado com sucesso")
    } catch (error) {
      toast.error("Erro ao restaurar item")
      console.error(error)
    } finally {
      setIsRestoring(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza? Esta ação não pode ser desfeita.")) return

    setIsDeleting(true)
    try {
      await permanentDeleteItem(item.id, itemType)
      toast.success("Item excluído permanentemente")
    } catch (error) {
      toast.error("Erro ao excluir item")
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDetails = () => {
    setIsDetailsOpen(true)
  }

  const MenuItems = (
    <>
      <div className="px-2 py-1.5 text-xs font-semibold text-muted-fg">
        Ações da Lixeira
      </div>
      <ContextMenuItem onClick={handleRestore} disabled={isRestoring}>
        <RotateCcw className="mr-2 h-4 w-4" />
        Restaurar
      </ContextMenuItem>
      
      <ContextMenuItem onClick={handleDetails}>
        <Info className="mr-2 h-4 w-4" />
        Detalhes
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem onClick={handleDelete} danger disabled={isDeleting}>
        <Trash2 className="mr-2 h-4 w-4" />
        Excluir permanentemente
      </ContextMenuItem>
    </>
  )

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    open(e.clientX, e.clientY, MenuItems)
  }

  if (!React.isValidElement(children)) {
    return <>{children}</>
  }

  return (
    <>
      {React.cloneElement(children, {
        onContextMenu: handleContextMenu
      } as React.HTMLAttributes<HTMLElement>)}
      
      {isDetailsOpen && (
        <DetailsDialog 
            onClose={() => setIsDetailsOpen(false)} 
            item={item} 
        />
      )}
    </>
  )
}
