"use client"

import { upload } from "@vercel/blob/client"
import { useState, useRef } from "react"
import { Loader2, Plus } from "lucide-react"
import { createFile } from "@/actions/storage"
import { useRouter, usePathname } from "next/navigation"

export function UploadButton() {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleUpload = async () => {
    if (!inputFileRef.current?.files) return
    const file = inputFileRef.current.files[0]
    if (!file) return

    setIsUploading(true)
    console.log("Iniciando upload:", { name: file.name, type: file.type, size: file.size })

    const folderId = pathname.startsWith('/drive/') && pathname.length > 7 
      ? pathname.split('/drive/')[1] 
      : null

    try {
      const newBlob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      })

      await createFile({
        name: file.name,
        size: file.size,
        url: newBlob.url,
        mimeType: file.type,
        folderId: folderId
      })
      
      router.refresh()
    } catch (error) {
      console.error("Upload error:", error)
      alert("Erro ao fazer upload. Tente novamente.")
    } finally {
      setIsUploading(false)
      if (inputFileRef.current) {
        inputFileRef.current.value = ""
      }
    }
  }

  return (
    <>
      <input
        name="file"
        ref={inputFileRef}
        type="file"
        required
        className="hidden"
        onChange={handleUpload}
      />
      <button 
        onClick={() => inputFileRef.current?.click()}
        disabled={isUploading}
        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-accent text-accent-fg rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isUploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        {isUploading ? "Enviando..." : "Novo"}
      </button>
    </>
  )
}
