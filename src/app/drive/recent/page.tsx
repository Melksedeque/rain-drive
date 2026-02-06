import { getRecentFiles } from "@/actions/storage"
import { RecentContent } from "@/components/drive/recent-content"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Recentes | RainDrive",
  description: "Seus arquivos acessados recentemente",
}

export default async function RecentPage() {
  const recentFiles = await getRecentFiles(20) // Começar com 20 itens

  return <RecentContent files={recentFiles} />
}
