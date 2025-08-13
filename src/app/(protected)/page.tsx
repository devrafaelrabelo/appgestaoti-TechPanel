"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useSessionStorage } from "@/hooks/use-session-storage"
import { useEffect } from "react"
import { useAuth } from "@/features/auth/context/auth-context"
import { LogOut } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function modulesPage() {
  const router = useRouter()
  const { isAuthenticated, logout, user, isLoading } = useAuth()
  const { toast } = useToast()
  const [selectedSystem, setSelectedSystem] = useSessionStorage<string | null>("selectedSystem", null)

  // Redirecionamento se não autenticado (fallback)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [isLoading, isAuthenticated, router])

  // Redirecionar para o dashboard se um sistema já estiver selecionado
  useEffect(() => {
    if (selectedSystem && isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [selectedSystem, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Redirecionado pelo useEffect
  }

  const handlemodules = (system: string) => {
    setSelectedSystem(system)
    router.push("/dashboard")
  }

  const handleLogout = async () => {
    try {
      await logout()
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
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Bem-vindo, {user?.name || "Usuário"}!</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Selecione o sistema que deseja acessar:
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button className="w-full py-3 text-lg font-semibold" onClick={() => handlemodules("COMERCIAL")}>
            Sistema Comercial
          </Button>
          <Button className="w-full py-3 text-lg font-semibold" onClick={() => handlemodules("RH")}>
            Sistema RH
          </Button>
          <Button className="w-full py-3 text-lg font-semibold" onClick={() => handlemodules("TI")}>
            Sistema TI
          </Button>
        </CardContent>
        <CardFooter className="flex justify-end pt-4">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
