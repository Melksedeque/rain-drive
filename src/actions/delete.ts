"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { del } from "@vercel/blob"

export async function deleteFile(fileId: string) {
  const session = await auth()
  if (!session?.user?.email) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) throw new Error("User not found")

  const file = await prisma.file.findUnique({
    where: { id: fileId },
  })

  if (!file || file.userId !== user.id) throw new Error("File not found or access denied")

  // Delete from Blob
  try {
    if (file.storageUrl) {
      await del(file.storageUrl)
    }
  } catch (error) {
    console.error("Failed to delete blob", error)
    // Continue to delete from DB even if blob delete fails (avoid orphans in DB)
  }

  // Delete from DB
  await prisma.file.delete({
    where: { id: fileId },
  })

  revalidatePath("/drive")
}

export async function deleteFolder(folderId: string) {
  const session = await auth()
  if (!session?.user?.email) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) throw new Error("User not found")

  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    include: {
      files: true,
      children: true
    }
  })

  if (!folder || folder.userId !== user.id) throw new Error("Folder not found or access denied")

  // For MVP: Block delete if not empty
  if (folder.files.length > 0 || folder.children.length > 0) {
    throw new Error("Pasta não está vazia")
  }

  await prisma.folder.delete({
    where: { id: folderId },
  })

  revalidatePath("/drive")
}
