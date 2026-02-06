"use client"

import { useState, useRef } from "react"
import { ContextMenuItem, ContextMenuSeparator } from "./context-menu"
import { useContextMenu } from "@/components/providers/context-menu-provider"
import { FolderPlus, FileUp, FolderUp } from "lucide-react"
import { useFileUpload } from "@/hooks/use-file-upload"
import { CreateFolderDialog } from "./create-folder-dialog"

interface DriveContextMenuProps {
  children: React.ReactNode
  currentFolderId?: string | null
}

export function DriveContextMenu({ children, currentFolderId }: DriveContextMenuProps) {
  const { open } = useContextMenu()
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  const { uploadFile } = useFileUpload({ folderId: currentFolderId })

  const handleNewFolder = () => {
    setIsFolderDialogOpen(true)
  }

  const handleUploadFile = () => {
    fileInputRef.current?.click()
  }

  const handleUploadFolder = () => {
    folderInputRef.current?.click()
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
    </>
  )

  const handleContextMenu = (e: React.MouseEvent) => {
    // Only trigger if clicking on the background (not bubbling from a file item)
    // We can check if the target is an element with specific data-attribute or just rely on 
    // stopPropagation in the file items.
    e.preventDefault()
    open(e.clientX, e.clientY, MenuItems)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
        uploadFile(e.target.files[0])
    }
  }

  const onFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Handle folder upload (multiple files)
      if (e.target.files && e.target.files.length > 0) {
          // Upload logic for folders is more complex (preserving structure).
          // For now, we can just upload all files flat or warn user.
          // Or recursively create folders. 
          // Given the current 'uploadFile' hook handles single file, we might need to loop.
          Array.from(e.target.files).forEach(file => {
              // TODO: Implement proper folder structure preservation
              // For now, just uploading the files to the current folder
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
      />

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
