"use server"

import { deleteItem } from "@/actions/storage"

export async function deleteFile(fileId: string) {
  await deleteItem(fileId, "file")
}

export async function deleteFolder(folderId: string) {
  await deleteItem(folderId, "folder")
}
