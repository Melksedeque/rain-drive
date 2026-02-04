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
      storageKey: data.url, // Using URL as key for now, or extract from URL if needed
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

  // Basic ownership check is implicit by where clause with userId (if we added it, but let's check explicitly)
  // Or better: ensure the item belongs to user before update.
  
  if (itemType === "file") {
    const file = await prisma.file.findFirst({ where: { id: itemId, userId: user.id }})
    if (!file) throw new Error("File not found")
    
    await prisma.file.update({
      where: { id: itemId },
      data: { folderId: targetFolderId }
    })
  } else {
    const folder = await prisma.folder.findFirst({ where: { id: itemId, userId: user.id }})
    if (!folder) throw new Error("Folder not found")

    // Prevent moving folder into itself or its children (Circular dependency)
    // This requires a recursive check. For MVP, just check if targetFolderId === itemId
    if (targetFolderId === itemId) throw new Error("Cannot move folder into itself")
    
    // Proper circular check:
    if (targetFolderId) {
       let currentId: string | null = targetFolderId
       while (currentId) {
         if (currentId === itemId) throw new Error("Não é possível mover uma pasta para dentro dela mesma")
         
         const parent = await prisma.folder.findUnique({
            where: { id: currentId },
            select: { parentId: true }
         })
         
         if (!parent) break 
         currentId = parent.parentId
       }
    }

    await prisma.folder.update({
      where: { id: itemId },
      data: { parentId: targetFolderId }
    })
  }

  revalidatePath("/drive")
}
