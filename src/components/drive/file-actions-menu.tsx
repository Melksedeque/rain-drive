"use client"

import * as React from "react"
import { useState } from "react"
import { 
  Eye, Download, Edit2, Copy, Move, Info, Trash2, MoreHorizontal, ExternalLink 
} from "lucide-react"
import { ContextMenuItem, ContextMenuSeparator } from "./context-menu"
import { useContextMenu } from "@/components/providers/context-menu-provider"
import { DropdownMenu } from "./dropdown-menu"
import { RenameDialog } from "./rename-dialog"
import { PreviewModal } from "./preview-modal"
import { DetailsDialog } from "./details-dialog"
import { copyItem } from "@/actions/storage"
import { deleteFile } from "@/actions/delete"
import { toast } from "sonner"
import { File } from "@prisma/client"

interface FileActionsMenuProps {
  file: File
  children?: React.ReactNode
  asDropdown?: boolean
}

export function FileActionsMenu({ file, children, asDropdown = false }: FileActionsMenuProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCopying, setIsCopying] = useState(false)

  const handlePreview = () => {
    console.log("Context Menu: Preview clicked")
    setIsPreviewOpen(true)
  }

  const handleNewTab = () => {
    console.log("Context Menu: New Tab clicked")
    window.open(file.storageUrl, "_blank")
  }

  const handleDownload = async () => {
    console.log("Context Menu: Download clicked")
    toast.info("Iniciando download...")
    
    try {
        const response = await fetch(file.storageUrl)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        toast.success("Download concluído")
    } catch (error) {
        console.error("Download failed:", error)
        toast.error("Erro ao baixar arquivo")
        // Fallback to direct link
        const link = document.createElement("a")
        link.href = file.storageUrl
        link.download = file.name
        link.target = "_blank"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
  }

  const handleRename = () => {
    console.log("Context Menu: Rename clicked")
    setIsRenameOpen(true)
  }

  const handleCopy = async () => {
    console.log("Context Menu: Copy clicked")
    setIsCopying(true)
    try {
      await copyItem(file.id, "file")
      toast.success("Cópia criada com sucesso")
    } catch {
      toast.error("Erro ao criar cópia")
    } finally {
      setIsCopying(false)
    }
  }

  const handleMove = () => {
    console.log("Context Menu: Move clicked")
    toast.info("Funcionalidade de mover em breve")
    // TODO: Criar o modal de Mover arquivo
  }

  const handleDetails = () => {
    console.log("Context Menu: Details clicked")
    setIsDetailsOpen(true)
  }

  const handleDelete = async () => {
    console.log("Context Menu: Delete clicked")
    if (!confirm("Tem certeza que deseja excluir este arquivo?")) return
    setIsDeleting(true)
    try {
      await deleteFile(file.id)
      toast.success("Arquivo excluído")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro desconhecido"
      toast.error("Erro ao excluir arquivo: " + message)
    } finally {
      setIsDeleting(false)
    }
  }

  const MenuItems = () => (
    <>
      <div className="px-2 py-1.5 text-xs font-semibold text-muted-fg">
        Abrir com...
      </div>
      <ContextMenuItem onClick={handlePreview}>
        <Eye className="mr-2 h-4 w-4" />
        Visualização
      </ContextMenuItem>
      <ContextMenuItem onClick={handleNewTab}>
        <ExternalLink className="mr-2 h-4 w-4" />
        Nova aba
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem onClick={handleDownload}>
        <Download className="mr-2 h-4 w-4" />
        Baixar
      </ContextMenuItem>
      
      <ContextMenuItem onClick={handleRename}>
        <Edit2 className="mr-2 h-4 w-4" />
        Renomear
      </ContextMenuItem>
      
      <ContextMenuItem onClick={handleCopy} disabled={isCopying}>
        <Copy className="mr-2 h-4 w-4" />
        Fazer uma cópia
      </ContextMenuItem>
      
      <ContextMenuItem onClick={handleMove} disabled>
        <Move className="mr-2 h-4 w-4" />
        Mover (Em breve)
      </ContextMenuItem>
      
      <ContextMenuItem onClick={handleDetails}>
        <Info className="mr-2 h-4 w-4" />
        Detalhes
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem onClick={handleDelete} danger disabled={isDeleting}>
        <Trash2 className="mr-2 h-4 w-4" />
        Excluir
      </ContextMenuItem>
    </>
  )

  const Dialogs = () => (
    <>
      {isRenameOpen && (
        <RenameDialog 
            isOpen={isRenameOpen} 
            onClose={() => setIsRenameOpen(false)} 
            itemId={file.id} 
            itemType="file" 
            currentName={file.name} 
        />
      )}
      
      {isPreviewOpen && (
        <PreviewModal 
            onClose={() => setIsPreviewOpen(false)} 
            file={file} 
        />
      )}
      
      {isDetailsOpen && (
        <DetailsDialog 
            onClose={() => setIsDetailsOpen(false)} 
            item={file} 
        />
      )}
    </>
  )

  if (asDropdown) {
    return (
      <>
        <DropdownMenu 
            trigger={
                <button className="p-2 hover:bg-accent/10 rounded-full text-muted-fg hover:text-fg transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            }
            align="right"
        >
            <MenuItems />
        </DropdownMenu>
        <Dialogs />
      </>
    )
  }

  return (
    <>
       <FileContextMenuTrigger menuItems={<MenuItems />}>
         {children}
       </FileContextMenuTrigger>
       <Dialogs />
    </>
  )
}

function FileContextMenuTrigger({ 
    children, 
    menuItems
}: { 
    children: React.ReactNode
    menuItems: React.ReactNode
}) {
    const { open } = useContextMenu()

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        open(e.clientX, e.clientY, menuItems)
    }

    if (React.isValidElement(children)) {
      const child = children as React.ReactElement<{ onContextMenu?: React.MouseEventHandler }>
      return React.cloneElement(child, {
        onContextMenu: (e: React.MouseEvent) => {
          handleContextMenu(e)
          child.props.onContextMenu?.(e)
        }
      })
    }

    return (
        <div onContextMenu={handleContextMenu}>
            {children}
        </div>
    )
}
