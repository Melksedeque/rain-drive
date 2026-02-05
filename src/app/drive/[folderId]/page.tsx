import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { DriveContent } from "@/components/drive/drive-content"

async function getFolderHierarchy(folderId: string, acc: { label: string; href: string }[] = []) {
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    select: { id: true, name: true, parentId: true }
  })

  if (!folder) return acc

  const crumb = { label: folder.name, href: `/drive/${folder.id}` }
  
  if (folder.parentId) {
    return getFolderHierarchy(folder.parentId, [crumb, ...acc])
  }

  return [crumb, ...acc]
}

export default async function FolderPage({ params, searchParams }: { params: Promise<{ folderId: string }>, searchParams: Promise<{ q?: string }> }) {
  const { folderId } = await params
  const { q } = await searchParams
  const session = await auth()
  
  if (!session?.user?.email) redirect("/auth/login")

  // 1. Validate ownership & existence
  const currentFolder = await prisma.folder.findUnique({
    where: { id: folderId },
    include: { user: true }
  })

  if (!currentFolder || currentFolder.user.email !== session.user.email || currentFolder.inTrash) {
    notFound()
  }

  // 2. Fetch content
  const [folders, files, breadcrumbs] = await Promise.all([
    prisma.folder.findMany({
      where: {
        userId: currentFolder.userId,
        inTrash: false,
        ...(q 
            ? { name: { contains: q, mode: "insensitive" } } 
            : { parentId: folderId }
        )
      },
      orderBy: { name: 'asc' }
    }),
    prisma.file.findMany({
      where: {
        userId: currentFolder.userId,
        inTrash: false,
        ...(q 
            ? { name: { contains: q, mode: "insensitive" } } 
            : { folderId: folderId }
        )
      },
      orderBy: { name: 'asc' }
    }),
    getFolderHierarchy(folderId)
  ])

  return (
    <DriveContent 
      folders={folders} 
      files={files} 
      breadcrumbs={breadcrumbs}
      currentFolderId={folderId}
    />
  )
}
