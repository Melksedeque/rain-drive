"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { X, ZoomIn, ZoomOut, Download, ExternalLink, Loader2, AlertCircle } from "lucide-react"
import { File } from "@prisma/client"
import { cn, formatBytes } from "@/lib/utils"
import Image from "next/image"

interface PreviewModalProps {
  onClose: () => void
  file: File
}

export function PreviewModal({ onClose, file }: PreviewModalProps) {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [error, setError] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  if (!mounted) return null

  const isImage = file.mimeType.startsWith("image/")
  const isPDF = file.mimeType === "application/pdf"
  const isVideo = file.mimeType.startsWith("video/")
  const isAudio = file.mimeType.startsWith("audio/")
  const isText = file.mimeType.startsWith("text/") || file.mimeType === "application/json" || file.mimeType.includes("javascript") || file.mimeType.includes("css")

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = file.storageUrl
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 text-white">
          <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">Não foi possível carregar a visualização</p>
          <button 
            onClick={handleDownload}
            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
          >
            Baixar arquivo
          </button>
        </div>
      )
    }

    if (isImage) {
      return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-4" onClick={(e) => e.stopPropagation()}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Loader2 className="w-8 h-8 animate-spin text-white/50" />
                </div>
            )}
            <Image
              src={file.storageUrl} 
              alt={file.name}
              fill
              sizes="100vw"
              className={cn(
                "object-contain transition-transform duration-200", 
                isLoading ? "opacity-0" : "opacity-100"
              )}
              style={{ transform: `scale(${zoom})` }}
              onLoad={() => setIsLoading(false)}
              onError={() => { setIsLoading(false); setError(true) }}
            />
        </div>
      )
    }

    if (isPDF) {
      return (
        <iframe 
          src={`${file.storageUrl}#toolbar=0`}
          className="w-full h-full bg-white rounded-lg shadow-lg"
          onLoad={() => setIsLoading(false)}
          onError={() => { setIsLoading(false); setError(true) }}
        />
      )
    }

    if (isVideo) {
      return (
        <video 
          controls 
          className="max-w-full max-h-full rounded-lg shadow-lg"
          onLoadedData={() => setIsLoading(false)}
          onError={() => { setIsLoading(false); setError(true) }}
        >
          <source src={file.storageUrl} type={file.mimeType} />
          Seu navegador não suporta a tag de vídeo.
        </video>
      )
    }

    if (isAudio) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-black/20 rounded-xl backdrop-blur-sm">
            <Loader2 className={cn("w-8 h-8 mb-4 animate-spin text-white/50", !isLoading && "hidden")} />
            <audio 
              controls 
              className="w-full max-w-md"
              onLoadedData={() => setIsLoading(false)}
              onError={() => { setIsLoading(false); setError(true) }}
            >
              <source src={file.storageUrl} type={file.mimeType} />
              Seu navegador não suporta a tag de áudio.
            </audio>
        </div>
      )
    }

    if (isText) {
       // For text, we might want to fetch and display, but iframe is safer/easier for now if CORS allows.
       // However, iframes for text/plain often look raw.
       return (
         <iframe 
           src={file.storageUrl}
           className="w-full h-full bg-white rounded-lg shadow-lg font-mono p-4"
           onLoad={() => setIsLoading(false)}
           onError={() => { setIsLoading(false); setError(true) }}
         />
       )
    }

    // Default fallback
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 text-white">
        <p className="text-lg font-medium mb-2">Visualização não disponível</p>
        <p className="text-sm text-white/60 mb-6">Este tipo de arquivo não pode ser visualizado aqui.</p>
        <button 
          onClick={handleDownload}
          className="px-6 py-3 bg-accent text-accent-fg rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Baixar Arquivo
        </button>
      </div>
    )
  }

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity animate-in fade-in duration-200" 
        onClick={onClose}
      />
      
      <div className="relative w-full h-full flex flex-col z-101">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 text-white bg-linear-to-b from-black/50 to-transparent">
          <div className="flex items-center gap-4">
             <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Fechar (Esc)">
               <X className="w-5 h-5" />
             </button>
             <div className="flex flex-col">
               <span className="font-medium truncate max-w-[200px] sm:max-w-md">{file.name}</span>
               <span className="text-xs text-white/60">{formatBytes(file.sizeBytes)}</span>
             </div>
          </div>

          <div className="flex items-center gap-2">
            {isImage && (
                <>
                    <button 
                        onClick={() => setZoom(z => Math.max(0.1, z - 0.25))} 
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        title="Diminuir Zoom"
                    >
                        <ZoomOut className="w-5 h-5" />
                    </button>
                    <span className="text-xs w-12 text-center">{Math.round(zoom * 100)}%</span>
                    <button 
                        onClick={() => setZoom(z => Math.min(3, z + 0.25))} 
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        title="Aumentar Zoom"
                    >
                        <ZoomIn className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-white/20 mx-2" />
                </>
            )}
            
            <button 
                onClick={() => window.open(file.storageUrl, '_blank')} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block"
                title="Abrir em nova aba"
            >
                <ExternalLink className="w-5 h-5" />
            </button>
            <button 
                onClick={handleDownload}
                className="p-2 bg-accent text-accent-fg rounded-full hover:bg-accent/90 transition-colors shadow-lg"
                title="Baixar"
            >
                <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative p-4 sm:p-8 flex items-center justify-center" onClick={onClose}>
           <div className="w-full h-full flex items-center justify-center max-w-6xl mx-auto" onClick={(e) => e.stopPropagation()}>
               {renderContent()}
           </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
