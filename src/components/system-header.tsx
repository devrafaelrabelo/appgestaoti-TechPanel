"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeSelector } from "./theme-selector"
import { BackendStatusIndicator } from "./backend-status-indicator"
import { getSystemFromPath } from "@/navigation/config"
import { usePathname } from "next/navigation"
import { DynamicIcon } from "./dynamic-icon"
import { UserNav } from "./user.nav"

interface SystemHeaderProps {
  isSidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export function SystemHeader({ isSidebarCollapsed, onToggleSidebar }: SystemHeaderProps) {
  const pathname = usePathname()
  const currentSystem = getSystemFromPath(pathname)

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="h-8 w-8">
          {isSidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>

        <Link href={currentSystem.homePath} className="flex items-center gap-3 text-lg font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <DynamicIcon name={currentSystem.icon} className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline-block">{currentSystem.name}</span>
        </Link>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <BackendStatusIndicator />
        <ThemeSelector />
        <UserNav />
      </div>
    </header>
  )
}
