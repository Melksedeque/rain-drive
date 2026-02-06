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

export async function copyItem(itemId: string, itemType: "file" | "folder", targetFolderId?: string | null) {
  const session = await auth()
  if (!session?.user?.email) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) throw new Error("User not found")

  if (itemType === "file") {
    const file = await prisma.file.findUnique({
      where: { id: itemId, userId: user.id }
    })
    
    if (!file) throw new Error("Arquivo não encontrado")

    // Copy file record. Vercel Blob URL is reused (it's public).
    // In a real scenario, we might want to copy the blob too, but reusing URL saves space/bandwidth.
    // Appending " - Cópia" to name.
    await prisma.file.create({
      data: {
        name: `${file.name.replace(/(\.[\w\d_-]+)$/i, ' - Cópia$1')}`, // Insert before extension
        sizeBytes: file.sizeBytes,
        storageUrl: file.storageUrl,
        storageKey: file.storageKey,
        mimeType: file.mimeType,
        folderId: targetFolderId !== undefined ? targetFolderId : file.folderId,
        userId: user.id,
      },
    })
  } else {
    // Copying folders is complex (recursive). For MVP, we'll just throw or implement shallow copy.
    // Let's allow shallow copy of folder structure (empty folder).
    const folder = await prisma.folder.findUnique({
      where: { id: itemId, userId: user.id }
    })
    
    if (!folder) throw new Error("Pasta não encontrada")

    await prisma.folder.create({
      data: {
        name: `${folder.name} - Cópia`,
        parentId: targetFolderId !== undefined ? targetFolderId : folder.parentId,
        userId: user.id,
      }
    })
  }

  revalidatePath("/drive")
}

export async function renameItem(itemId: string, itemType: "file" | "folder", newName: string) {
  const session = await auth()
  if (!session?.user?.email) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) throw new Error("User not found")

  if (itemType === "file") {
    await prisma.file.update({
      where: { id: itemId, userId: user.id },
      data: { name: newName }
    })
  } else {
    await prisma.folder.update({
      where: { id: itemId, userId: user.id },
      data: { name: newName }
    })
  }

  revalidatePath("/drive")
}


export async function deleteItem(itemId: string, itemType: "file" | "folder") {
  const session = await auth()
  if (!session?.user?.email) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) throw new Error("User not found")

  if (itemType === "file") {
    await prisma.file.update({
      where: { id: itemId, userId: user.id },
      data: { inTrash: true, deletedAt: new Date() }
    })
  } else {
    await prisma.folder.update({
      where: { id: itemId, userId: user.id },
      data: { inTrash: true, deletedAt: new Date() }
    })
  }

  revalidatePath("/drive")
}

export async function restoreItem(itemId: string, itemType: "file" | "folder") {
  const session = await auth()
  if (!session?.user?.email) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) throw new Error("User not found")

  if (itemType === "file") {
    await prisma.file.update({
      where: { id: itemId, userId: user.id },
      data: { inTrash: false, deletedAt: null }
    })
  } else {
    await prisma.folder.update({
      where: { id: itemId, userId: user.id },
      data: { inTrash: false, deletedAt: null }
    })
  }

  revalidatePath("/drive")
  revalidatePath("/drive/trash")
}

export async function permanentDeleteItem(itemId: string, itemType: "file" | "folder") {
  const session = await auth()
  if (!session?.user?.email) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) throw new Error("User not found")

  // TODO: Se for arquivo, deletar do Vercel Blob também (ver PENDING.md)
  // Por enquanto, deletamos apenas do banco e o Blob fica órfão (precisa de limpeza periódica ou deletar aqui)
  
  if (itemType === "file") {
     // Tentativa de deletar do Blob seria ideal aqui se tivéssemos a URL
     // const file = await prisma.file.findUnique({ where: { id: itemId }})
     // if (file) await del(file.storageUrl) 

    await prisma.file.delete({
      where: { id: itemId, userId: user.id }
    })
  } else {
    // Cascade cuida dos filhos
    await prisma.folder.delete({
      where: { id: itemId, userId: user.id }
    })
  }

  revalidatePath("/drive/trash")
}

export async function emptyTrash() {
  const session = await auth()
  if (!session?.user?.email) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) throw new Error("User not found")

  // Deletar arquivos na lixeira
  await prisma.file.deleteMany({
    where: { userId: user.id, inTrash: true }
  })

  // Deletar pastas na lixeira
  await prisma.folder.deleteMany({
    where: { userId: user.id, inTrash: true }
  })

  revalidatePath("/drive/trash")
}

export async function getRecentFiles(limit: number = 20) {
  const session = await auth()
  if (!session?.user?.email) return []

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) return []

  return prisma.file.findMany({
    where: { 
      userId: user.id, 
      inTrash: false 
    },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    include: { folder: { select: { name: true } } }
  })
}

export async function getTrashItems() {
  const session = await auth()
  if (!session?.user?.email) return { files: [], folders: [] }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) return { files: [], folders: [] }

  const folders = await prisma.folder.findMany({
    where: { userId: user.id, inTrash: true },
    orderBy: { deletedAt: 'desc' }
  })

  const files = await prisma.file.findMany({
    where: { userId: user.id, inTrash: true },
    orderBy: { deletedAt: 'desc' }
  })

  return { folders, files }
}

export async function getUserStorageUsage() {
  const session = await auth()
  if (!session?.user?.email) return 0

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { files: { select: { sizeBytes: true } } }
  })

  if (!user) return 0

  const totalBytes = user.files.reduce((acc, file) => acc + BigInt(file.sizeBytes), BigInt(0))
  return Number(totalBytes)
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
