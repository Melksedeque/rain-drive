"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createFile(data: {
  name: string
  size: number
  url: string
  folderId?: string | null
  mimeType: string
}) {
  const session = await auth()
  if (!session?.user?.email) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) throw new Error("User not found")

  await prisma.file.create({
    data: {
      name: data.name,
      sizeBytes: BigInt(data.size),
      storageUrl: data.url,
      storageKey: data.url, // TODO: Usar URL como chave por enquanto, ou extrair da URL se necessário (ver PENDING.md)
      mimeType: data.mimeType,
      folderId: data.folderId || null,
      userId: user.id,
    },
  })

  revalidatePath("/drive")
}

export async function createFolder(name: string, parentId?: string | null) {
  const session = await auth()
  if (!session?.user?.email) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) throw new Error("User not found")

  await prisma.folder.create({
    data: {
      name,
      parentId: parentId || null,
      userId: user.id,
    },
  })

  revalidatePath("/drive")
}

export async function moveItem(itemId: string, itemType: "file" | "folder", targetFolderId: string | null) {
  const session = await auth()
  if (!session?.user?.email) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) throw new Error("User not found")

  // Verificação básica de propriedade é implícita pela cláusula where com userId
  // Mas vamos verificar explicitamente para garantir
  
  if (itemType === "file") {
    const file = await prisma.file.findFirst({ where: { id: itemId, userId: user.id }})
    if (!file) throw new Error("Arquivo não encontrado")
    
    await prisma.file.update({
      where: { id: itemId },
      data: { folderId: targetFolderId }
    })
  } else {
    const folder = await prisma.folder.findFirst({ where: { id: itemId, userId: user.id }})
    if (!folder) throw new Error("Pasta não encontrada")

    // Prevenir mover pasta para dentro dela mesma ou de seus filhos (Dependência Circular)
    // Isso requer uma verificação recursiva. Para o MVP, checamos apenas se o destino é o próprio item.
    if (targetFolderId === itemId) throw new Error("Não é possível mover uma pasta para dentro dela mesma")
    
    // Verificação circular adequada:
    if (targetFolderId) {
       let currentId: string | null = targetFolderId
       while (currentId) {
         if (currentId === itemId) throw new Error("Não é possível mover uma pasta para dentro dela mesma")
         
         const parentFolder: { parentId: string | null } | null = await prisma.folder.findUnique({
            where: { id: currentId },
            select: { parentId: true }
         })
        
        if (!parentFolder) break 
        currentId = parentFolder.parentId
       }
    }

    await prisma.folder.update({
      where: { id: itemId },
      data: { parentId: targetFolderId }
    })
  }

  revalidatePath("/drive")
}
