"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "./user-nav"
import { UploadButton } from "./upload-button"
import { WeatherWidget } from "./weather-widget"
import { CreateFolderButton } from "./create-folder-button"
import { SearchBar } from "./search-bar"

export function Topbar({ userEmail }: { userEmail?: string | null }) {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm px-6 flex items-center justify-between gap-4 sticky top-0 z-40">
      
      {/* Mobile Logo could go here */}
      
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <SearchBar />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <WeatherWidget />
        <CreateFolderButton />
        <UploadButton />

        <div className="w-px h-6 bg-border mx-1" />

        <ThemeToggle />
        <UserNav email={userEmail} />
      </div>
    </header>
  )
}
