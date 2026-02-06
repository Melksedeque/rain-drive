"use client"

import * as React from "react"
import { useState, useRef } from "react"
import { 
  FolderPlus, FileUp, FolderUp, Info, Trash2, MoreHorizontal
} from "lucide-react"
import { ContextMenuItem, ContextMenuSeparator } from "./context-menu"
import { useContextMenu } from "@/components/providers/context-menu-provider"
import { DropdownMenu } from "./dropdown-menu"
import { DetailsDialog } from "./details-dialog"
import { CreateFolderDialog } from "./create-folder-dialog"
import { deleteFolder } from "@/actions/delete"
import { useFileUpload } from "@/hooks/use-file-upload"
import { toast } from "sonner"
import { Folder } from "@prisma/client"

interface FolderActionsMenuProps {
  folder: Folder
  children?: React.ReactNode
  asDropdown?: boolean
}

export function FolderActionsMenu({ folder, children, asDropdown = false }: FolderActionsMenuProps) {
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  
  const { uploadFile } = useFileUpload({ folderId: folder.id })

  const handleNewFolder = () => {
    setIsFolderDialogOpen(true)
  }

  const handleUploadFile = () => {
    fileInputRef.current?.click()
  }

  const handleUploadFolder = () => {
    folderInputRef.current?.click()
  }

  const handleDetails = () => {
    setIsDetailsOpen(true)
  }

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir a pasta "${folder.name}" e todo seu conteúdo?`)) return
    
    setIsDeleting(true)
    try {
      await deleteFolder(folder.id)
      toast.success("Pasta excluída")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro desconhecido"
      toast.error("Erro ao excluir pasta: " + message)
    } finally {
      setIsDeleting(false)
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
        uploadFile(e.target.files[0])
    }
    // Reset input
    e.target.value = ""
  }

  const onFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          Array.from(e.target.files).forEach(file => {
              uploadFile(file)
          })
      }
      // Reset input
      e.target.value = ""
  }

  const MenuItems = () => (
    <>
      <div className="px-2 py-1.5 text-xs font-semibold text-muted-fg">
        Ações da Pasta
      </div>
      <ContextMenuItem onClick={handleNewFolder}>
        <FolderPlus className="mr-2 h-4 w-4" />
        Nova pasta
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem onClick={handleUploadFile}>
        <FileUp className="mr-2 h-4 w-4" />
        Upload de arquivo
      </ContextMenuItem>
      
      <ContextMenuItem onClick={handleUploadFolder}>
        <FolderUp className="mr-2 h-4 w-4" />
        Upload de pasta
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
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
      <CreateFolderDialog 
        isOpen={isFolderDialogOpen} 
        onClose={() => setIsFolderDialogOpen(false)} 
        parentId={folder.id}
      />
      
      {isDetailsOpen && (
        <DetailsDialog 
            onClose={() => setIsDetailsOpen(false)} 
            item={folder} 
        />
      )}

      {/* Hidden Inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={onFileChange} 
      />
      <input 
        type="file" 
        ref={folderInputRef} 
        className="hidden" 
        // @ts-expect-error directory attributes
        webkitdirectory=""
        directory=""
        multiple
        onChange={onFolderChange} 
      />
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
       <FolderContextMenuTrigger menuItems={<MenuItems />}>
         {children}
       </FolderContextMenuTrigger>
       <Dialogs />
    </>
  )
}

function FolderContextMenuTrigger({ 
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
