"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, FolderPlus, FileUp, ChevronDown, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useFileUpload } from "@/hooks/use-file-upload"
import { usePathname } from "next/navigation"
import { CreateFolderDialog } from "./create-folder-dialog"
import { cn } from "@/lib/utils"

export function NewItemButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputFileRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  
  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Setup file upload hook
  const folderId = pathname.startsWith('/drive/') && pathname.length > 7 
    ? pathname.split('/drive/')[1] 
    : null

  const { uploadFile, isUploading } = useFileUpload({
    folderId,
    onSuccess: () => {
      // Clear input
      if (inputFileRef.current) {
        inputFileRef.current.value = ""
      }
    }
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      uploadFile(e.target.files[0])
    }
  }

  const triggerFileUpload = () => {
    setIsOpen(false)
    inputFileRef.current?.click()
  }

  const openFolderDialog = () => {
    setIsOpen(false)
    setIsFolderDialogOpen(true)
  }

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isUploading}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-fg rounded-lg text-sm font-medium hover:bg-accent/90 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer group active:scale-[0.98]"
        >
          {isUploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
          <span className="hidden sm:inline">Novo</span>
          {!isUploading && (
            <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")} />
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 w-48 p-1 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden"
            >
              <button
                onClick={openFolderDialog}
                className="flex items-center w-full gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-accent/10 hover:text-accent text-fg transition-colors cursor-pointer group/item"
              >
                <div className="p-1.5 bg-muted rounded-md group-hover/item:bg-accent/20 transition-colors">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <span className="font-medium">Nova Pasta</span>
              </button>
              
              <button
                onClick={triggerFileUpload}
                className="flex items-center w-full gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-accent/10 hover:text-accent text-fg transition-colors cursor-pointer group/item mt-1"
              >
                <div className="p-1.5 bg-muted rounded-md group-hover/item:bg-accent/20 transition-colors">
                  <FileUp className="w-4 h-4" />
                </div>
                <span className="font-medium">Upload de Arquivo</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <input
        ref={inputFileRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
      />

      <CreateFolderDialog 
        isOpen={isFolderDialogOpen} 
        onClose={() => setIsFolderDialogOpen(false)} 
      />
    </>
  )
}
