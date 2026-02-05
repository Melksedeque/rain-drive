import { getTrashItems } from "@/actions/storage"
import { TrashContent } from "@/components/drive/trash-content"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Lixeira | RainDrive",
  description: "Itens excluídos",
}

export default async function TrashPage() {
  const { folders, files } = await getTrashItems()

  return <TrashContent files={files} folders={folders} />
}
