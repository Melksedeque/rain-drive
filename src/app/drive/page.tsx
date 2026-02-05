import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { DriveContent } from "@/components/drive/drive-content"

export default async function DrivePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const session = await auth()
  if (!session?.user?.email) redirect("/auth/login")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
      redirect("/auth/login")
  }

  const folders = await prisma.folder.findMany({
    where: {
      userId: user.id,
      inTrash: false,
      ...(q ? { name: { contains: q, mode: "insensitive" } } : { parentId: null })
    },
    include: {
      _count: {
        select: { files: true, children: true }
      }
    },
    orderBy: { name: "asc" }
  })

  const files = await prisma.file.findMany({
    where: {
      userId: user.id,
      inTrash: false,
      ...(q ? { name: { contains: q, mode: "insensitive" } } : { folderId: null })
    },
    orderBy: { name: "asc" }
  })

  return (
    <DriveContent folders={folders} files={files} currentFolderId={null} />
  )
}
