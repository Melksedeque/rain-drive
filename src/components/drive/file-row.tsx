"use client"

import { FileIcon } from "lucide-react"
import { File } from "@prisma/client"
import { FileActionsMenu } from "./file-actions-menu"
import { cn } from "@/lib/utils"

interface FileRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  file: File
}

export function FileRow({ file, className, ...props }: FileRowProps) {
  return (
    <FileActionsMenu file={file}>
      <tr 
        className={cn("group hover:bg-accent/5 transition-colors cursor-pointer", className)}
        {...props}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-accent/10 text-accent rounded-lg">
               <FileIcon className="w-4 h-4" />
            </div>
            <span className="font-medium text-fg">
               {file.name}
            </span>
          </div>
        </td>
        <td className="px-4 py-3 text-muted-fg font-mono text-xs">
            {(Number(file.sizeBytes) / 1024 / 1024).toFixed(2)} MB
        </td>
        <td className="px-4 py-3 text-muted-fg text-xs">
            {new Date(file.updatedAt).toLocaleDateString()}
        </td>
        <td className="px-4 py-3 text-right">
            <div onClick={(e) => e.stopPropagation()} className="inline-block">
                <FileActionsMenu file={file} asDropdown />
            </div>
        </td>
      </tr>
    </FileActionsMenu>
  )
}
