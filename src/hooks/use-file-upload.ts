"use client"

import { upload } from "@vercel/blob/client"
import { useState } from "react"
import { createFile } from "@/actions/storage"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface UseFileUploadOptions {
  folderId?: string | null
  onSuccess?: () => void
  onError?: (error: any) => void
}

export function useFileUpload({ folderId, onSuccess, onError }: UseFileUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const uploadFile = async (file: File) => {
    setIsUploading(true)

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
      toast.success("Arquivo enviado!")
      onSuccess?.()
    } catch (error) {
      console.error("Upload error:", error)
      onError?.(error)
      toast.error("Erro ao fazer upload. Tente novamente.")
    } finally {
      setIsUploading(false)
    }
  }

  return {
    uploadFile,
    isUploading
  }
}
