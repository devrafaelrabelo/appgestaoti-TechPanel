"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSessionStorage } from "@/hooks/use-session-storage"
import { useEffect, useMemo } from "react"
import { useAuth } from "@/features/auth/context/auth-context"


import { LogOut, AlertTriangle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { SYSTEMS_CONFIG, AVAILABLE_SYSTEMS } from "@/navigation/config"
import { cn } from "@/lib/utils"
import * as LucideIcons from "lucide-react"

export default function SystemSelectionPage() {
  const router = useRouter()
  const { isAuthenticated, logout, user, isLoading: authIsLoading, isInitialLoading } = useAuth()
  const { toast } = useToast()
  const [selectedSystemId, setSelectedSystemId] = useSessionStorage<string | null>("selectedSystem", null)

  // Redirecionamento se não autenticado (fallback)
  useEffect(() => {
    if (!authIsLoading && !isInitialLoading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [authIsLoading, isInitialLoading, isAuthenticated, router])

  const userAvailableSystems = useMemo(() => {
    if (!user || !user.departments || user.departments.length === 0) {
      return []
    }
    return AVAILABLE_SYSTEMS.filter((system) =>
      user.departments!.some((dep) => dep.toUpperCase() === system.id.toUpperCase()),
    )
  }, [user])

  if (authIsLoading || isInitialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary mx-auto" />
          <p className="mt-2 text-sm text-muted-foreground">Carregando informações do usuário...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Redirecionado pelo useEffect
  }

  const handleSystemSelect = (systemId: string) => {
    const system = SYSTEMS_CONFIG[systemId as keyof typeof SYSTEMS_CONFIG]
    if (system) {
      setSelectedSystemId(systemId)
      router.push(system.homePath)
    } else {
      toast({
        variant: "destructive",
        title: "Erro na seleção",
        description: "Sistema selecionado inválido.",
      })
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setSelectedSystemId(null)
      toast({
        variant: "success",
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no logout",
        description: "Ocorreu um erro ao fazer logout. Tente novamente.",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold mb-2">Bem-vindo, {user?.fullName || user?.username || "Usuário"}!</h1>

        {userAvailableSystems.length > 0 ? (
          <>
            <p className="text-muted-foreground mb-8 text-lg">Selecione o sistema que deseja acessar:</p>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {userAvailableSystems.map((system) => {
                const IconComponent = system.icon
                  ? LucideIcons[system.icon as keyof typeof LucideIcons]
                  : LucideIcons.Box
                return (
                  <Card
                    key={system.id}
                    className={cn(
                      "flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-200 ease-in-out",
                      "hover:shadow-lg hover:scale-[1.02] border-2",
                      system.bgColor,
                      system.color,
                    )}
                    onClick={() => handleSystemSelect(system.id)}
                  >
                    <CardHeader className="p-0 pb-2">
                      <IconComponent className="h-12 w-12 mb-4 mx-auto" />
                      <CardTitle className="text-xl font-semibold">{system.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 text-sm">
                      <p>{system.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </>
        ) : (
          <div className="mt-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-xl font-semibold text-muted-foreground">Nenhum sistema disponível.</p>
            <p className="text-sm text-muted-foreground">
              Você não tem acesso a nenhum sistema no momento ou seus departamentos não correspondem a sistemas
              configurados.
              <br />
              Entre em contato com o administrador se acreditar que isso é um erro.
            </p>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  )
}
