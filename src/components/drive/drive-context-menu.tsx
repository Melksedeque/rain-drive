"use client"

import { useState, useRef } from "react"
import { ContextMenuItem, ContextMenuSeparator } from "./context-menu"
import { useContextMenu } from "@/components/providers/context-menu-provider"
import { FolderPlus, FileUp, FolderUp, Info } from "lucide-react"
import { useFileUpload } from "@/hooks/use-file-upload"
import { CreateFolderDialog } from "./create-folder-dialog"
import { DetailsDialog } from "./details-dialog"
import { Folder } from "@prisma/client"

interface DriveContextMenuProps {
  children: React.ReactNode
  currentFolder?: Folder | null
}

export function DriveContextMenu({ children, currentFolder }: DriveContextMenuProps) {
  const { open } = useContextMenu()
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  const { uploadFile } = useFileUpload({ folderId: currentFolder?.id })

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

  const MenuItems = (
    <>
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
      
      {currentFolder && (
        <>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={handleDetails}>
            <Info className="mr-2 h-4 w-4" />
            Detalhes
          </ContextMenuItem>
        </>
      )}
    </>
  )

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    open(e.clientX, e.clientY, MenuItems)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
        uploadFile(e.target.files[0])
    }
  }

  const onFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          Array.from(e.target.files).forEach(file => {
              // TODO: Implementar estrutura de pastas apropriada
              uploadFile(file)
          })
      }
  }

  return (
    <div onContextMenu={handleContextMenu} className="h-full w-full">
      {children}
      
      <CreateFolderDialog 
        isOpen={isFolderDialogOpen} 
        onClose={() => setIsFolderDialogOpen(false)} 
        parentId={currentFolder?.id}
      />

      {currentFolder && isDetailsOpen && (
        <DetailsDialog 
          onClose={() => setIsDetailsOpen(false)} 
          item={currentFolder} 
        />
      )}

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
        webkitdirectory=""
        directory=""
        multiple
        onChange={onFolderChange} 
      />
    </div>
  )
}
