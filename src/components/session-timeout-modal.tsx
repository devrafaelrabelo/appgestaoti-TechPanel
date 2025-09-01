"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useIdleTimeout } from "@/hooks/use-idle-timeout"
import { useAuth } from "@/features/auth/context/auth-context"


import { authService } from "@/features/auth/services/auth-service"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, Clock } from "lucide-react"

// Configurações de tempo (em milissegundos)
const IDLE_TIMEOUT = 15 * 60 * 1000 // 15 minutos de inatividade

export function SessionTimeoutModal() {
  const [open, setOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const { isAuthenticated, logout, refreshAuth } = useAuth()

  // Função para lidar com sessão expirada
  const handleSessionExpired = useCallback(async () => {
    setOpen(false)
    await logout()
  }, [logout])

  // Função para continuar sessão
  const handleContinueSession = useCallback(async () => {
    try {
      setIsRefreshing(true)

      // Usa o endpoint de validação existente para verificar/renovar a sessão
      const user = await authService.getCurrentUser()

      if (user) {
        // Sessão ainda válida, atualiza o contexto
        await refreshAuth()
        setOpen(false)
        resetIdleTimer()
      } else {
        // Sessão expirada, faz logout
        handleSessionExpired()
      }
    } catch (error) {
      console.error("Erro ao verificar sessão:", error)
      handleSessionExpired()
    } finally {
      setIsRefreshing(false)
    }
  }, [refreshAuth, handleSessionExpired])

  // Detecta inatividade
  const { isIdle, resetTimer: resetIdleTimer } = useIdleTimeout({
    timeout: IDLE_TIMEOUT,
    onIdle: () => {
      if (isAuthenticated) {
        setOpen(true)
      }
    },
  })

  // Não renderiza nada se não estiver autenticado
  if (!isAuthenticated) return null

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Sessão inativa detectada
          </DialogTitle>
          <DialogDescription>
            Você ficou inativo por um tempo. Por motivos de segurança, precisamos verificar se você ainda está presente.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
            <Clock className="h-10 w-10 text-amber-600 dark:text-amber-500" />
          </div>

          <div className="text-center">
            <p className="text-lg font-medium mb-2">Você ainda está aí?</p>
            <p className="text-sm text-muted-foreground">
              Clique em "Continuar conectado" para manter sua sessão ativa ou "Encerrar sessão" para sair com segurança.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleSessionExpired} disabled={isRefreshing} className="sm:w-full">
            Encerrar sessão
          </Button>
          <Button onClick={handleContinueSession} disabled={isRefreshing} className="sm:w-full">
            {isRefreshing ? "Verificando sessão..." : "Continuar conectado"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
