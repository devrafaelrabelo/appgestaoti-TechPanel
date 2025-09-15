"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSessionStorage } from "@/hooks/use-session-storage"
import { getSystemFromPath, SYSTEMS_CONFIG } from "@/navigation/config"
import { useAuth } from "@/features/auth/context/auth-context"

import { SystemHeader } from "@/components/system-header"
import { SystemSidebar } from "@/components/system-sidebar"
import { SiteFooter } from "@/components/site-footer"

export default function StandardizedSystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading: authIsLoading, user } = useAuth()
  const [selectedSystemId, setSelectedSystemId] = useSessionStorage<string | null>("selectedSystem", null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useSessionStorage<boolean>("sidebarCollapsed", false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const currentSystem = getSystemFromPath(pathname)

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  useEffect(() => {
    if (!authIsLoading) {
      if (!isAuthenticated) {
        router.replace("/login")
        return
      }

      const systemFromPath = getSystemFromPath(pathname)
      if (!selectedSystemId && pathname !== "/modules") {
        if (systemFromPath.id !== "none") {
          const userHasAccess = user?.departments?.some((dep) => dep.toUpperCase() === systemFromPath.id.toUpperCase())
          if (userHasAccess) {
            setSelectedSystemId(systemFromPath.id)
          } else {
            router.replace("/modules")
          }
        } else {
          router.replace("/modules")
        }
      } else if (selectedSystemId && currentSystem.id !== selectedSystemId && currentSystem.id !== "none") {
        const userHasAccess = user?.departments?.some((dep) => dep.toUpperCase() === systemFromPath.id.toUpperCase())
        if (userHasAccess) {
          setSelectedSystemId(systemFromPath.id)
        } else {
          const fallbackPath = SYSTEMS_CONFIG[selectedSystemId as keyof typeof SYSTEMS_CONFIG]?.homePath || "/modules"
          router.replace(fallbackPath)
        }
      }
      setIsInitialLoading(false)
    }
  }, [authIsLoading, isAuthenticated, router, selectedSystemId, pathname, setSelectedSystemId, user, currentSystem.id])

  if (authIsLoading || isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg font-semibold">Carregando sistema...</p>
          <p className="text-sm text-muted-foreground">Por favor, aguarde.</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (
    currentSystem.id !== "none" &&
    !user?.departments?.some((dep) => dep.toUpperCase() === currentSystem.id.toUpperCase())
  ) {
    router.replace("/modules")
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg">Redirecionando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/50 dark:bg-[#0A0A0A]">
      {/* Header fixo no topo */}
      <SystemHeader isSidebarCollapsed={isSidebarCollapsed} onToggleSidebar={handleToggleSidebar} />

      {/* Container principal com sidebar e conteúdo */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <SystemSidebar isCollapsed={isSidebarCollapsed} onToggle={handleToggleSidebar} />

        {/* Área de conteúdo principal */}
        <div className={`flex flex-1 flex-col transition-all duration-300 ${isSidebarCollapsed ? "ml-16" : "ml-64"}`}>
          {/* Main content area */}
          <main className="flex-1 p-6">
            <div className="w-full h-full bg-card rounded-2xl shadow-md border overflow-hidden">
              <div className="p-6 sm:p-8 h-full overflow-y-hidden">
                {children}
                </div>
            </div>
          </main>

          {/* Footer dentro da área de conteúdo */}
          <div className="px-6 pb-6">
            <SiteFooter />
          </div>
        </div>
      </div>
    </div>
  )
}
