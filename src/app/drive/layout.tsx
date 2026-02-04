import { Sidebar } from "@/components/drive/sidebar"
import { Topbar } from "@/components/drive/topbar"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DriveLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex h-screen bg-bg text-fg overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Topbar userEmail={session.user.email} />
        
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
            {children}
        </main>
      </div>
    </div>
  )
}
