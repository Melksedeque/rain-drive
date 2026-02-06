"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { del } from "@vercel/blob"

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

  if (itemType === "file") {
    const file = await prisma.file.findUnique({
      where: { id: itemId, userId: user.id },
      select: { storageUrl: true }
    })

    if (file?.storageUrl) {
      try {
        await del(file.storageUrl)
      } catch (error) {
        console.error("Erro ao deletar blob:", error)
      }
    }

    await prisma.file.delete({
      where: { id: itemId, userId: user.id }
    })
  } else {
    // Para pastas, precisamos deletar recursivamente os blobs de todos os arquivos dentro
    // TODO: Implementar deleção recursiva de blobs para pastas (similar ao cron job)
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

  await prisma.file.deleteMany({
    where: { userId: user.id, inTrash: true }
  })

  await prisma.folder.deleteMany({
    where: { userId: user.id, inTrash: true }
  })

  revalidatePath("/drive/trash")
}

export async function getRecentFiles(limit: number = 20, offset: number = 0) {
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
    skip: offset,
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

    if (targetFolderId === itemId) throw new Error("Não é possível mover uma pasta para dentro dela mesma")
    
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
