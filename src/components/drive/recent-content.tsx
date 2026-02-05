"use client"

import { FileIcon, Clock } from "lucide-react"
import { File } from "@prisma/client"
import { FileActionsMenu } from "./file-actions-menu"

interface RecentFile extends File {
  folder: { name: string } | null
}

interface RecentContentProps {
  files: RecentFile[]
}

export function RecentContent({ files }: RecentContentProps) {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <header className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-fg flex items-center gap-2">
            <Clock className="w-6 h-6 text-accent" />
            Recentes
          </h1>
          <p className="text-muted-fg text-sm mt-1">
            Arquivos modificados recentemente
          </p>
        </div>
      </header>

      <section className="flex-1 overflow-auto">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Clock className="w-12 h-12 text-muted-fg/20 mb-4" />
            <h3 className="text-lg font-medium text-fg">Nenhum arquivo recente</h3>
            <p className="text-muted-fg text-sm max-w-sm mt-1">
              Os arquivos que você enviar ou modificar aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-fg font-medium">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3 w-48">Localização</th>
                  <th className="px-4 py-3 w-32">Tamanho</th>
                  <th className="px-4 py-3 w-32">Modificado</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {files.map((file) => (
                  <FileActionsMenu key={file.id} file={file}>
                    <tr 
                      className="group hover:bg-accent/5 transition-colors cursor-default"
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
                      <td className="px-4 py-3 text-muted-fg">
                        {file.folder ? (
                          <span className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full w-fit">
                            {file.folder.name}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-fg/50 italic">Meu Drive</span>
                        )}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
