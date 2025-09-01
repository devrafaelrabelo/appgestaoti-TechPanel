"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, HomeIcon } from "lucide-react"
import { useAuth } from "@/features/auth/context/auth-context"


import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ThemeSelector } from "./theme-selector"
import { BackendStatusIndicator } from "./backend-status-indicator"

// Header genérico e simplificado, sem menus de sistema ou breadcrumbs.
export function SiteHeader() {
  const { logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        variant: "success",
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      })
      router.push("/login")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no logout",
        description: "Ocorreu um erro ao fazer logout. Tente novamente.",
      })
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link href="/modules" className="flex items-center gap-2 text-lg font-semibold">
            <HomeIcon className="h-6 w-6" />
            <span className="hidden sm:inline-block">Página Inicial</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <BackendStatusIndicator />
          <ThemeSelector />
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-6 w-6" />
            <span className="sr-only">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
