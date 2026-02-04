"use client"

import { Trash2, Loader2 } from "lucide-react"
import { deleteFile, deleteFolder } from "@/actions/delete"
import { useState } from "react"
import { toast } from "sonner"

export function ItemActions({ id, type }: { id: string, type: "file" | "folder" }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm("Tem certeza que deseja excluir?")) return
        
        setIsDeleting(true)
        try {
            if (type === "file") await deleteFile(id)
            else await deleteFolder(id)
            toast.success("Item excluído")
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erro ao excluir")
            setIsDeleting(false)
        }
    }

    return (
        <button 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="text-muted-fg hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-500/10 cursor-pointer"
            title="Excluir"
        >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
    )
}
