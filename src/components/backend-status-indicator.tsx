"use client"

import { useState } from "react"
import { Wifi, WifiOff, AlertTriangle, Clock, Shield, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useBackendStatus } from "@/hooks/use-backend-status"
import { cn } from "@/lib/utils"

export function BackendStatusIndicator() {
  const { status, isChecking, checkStatus } = useBackendStatus()
  const [showDetails, setShowDetails] = useState(false)

  const getStatusIcon = () => {
    if (isChecking) {
      return <Clock className="h-4 w-4 animate-spin" />
    }

    switch (status.status) {
      case "online":
        return <Wifi className="h-4 w-4" />
      case "offline":
        return <WifiOff className="h-4 w-4" />
      case "timeout":
        return <Clock className="h-4 w-4" />
      case "cors":
        return <Shield className="h-4 w-4" />
      case "slow":
        return <Clock className="h-4 w-4" />
      case "error":
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getStatusColor = () => {
    switch (status.status) {
      case "online":
        return "bg-green-500 hover:bg-green-600"
      case "offline":
        return "bg-red-500 hover:bg-red-600"
      case "timeout":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "cors":
        return "bg-orange-500 hover:bg-orange-600"
      case "slow":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "error":
      default:
        return "bg-red-500 hover:bg-red-600"
    }
  }

  const getStatusBadgeVariant = () => "outline"

  const getStatusText = () => {
    switch (status.status) {
      case "online":
        return "Online"
      case "offline":
        return "Offline"
      case "timeout":
        return "Timeout"
      case "cors":
        return "CORS"
      case "slow":
        return "Lento"
      case "error":
      default:
        return "Erro"
    }
  }

  const getStatusBackground = () => {
    switch (status.status) {
      case "online":
        return "bg-green-500 text-white"
      case "slow":
      case "timeout":
        return "bg-yellow-500 text-black"
      case "cors":
        return "bg-orange-500 text-white"
      case "offline":
      case "error":
      default:
        return "bg-red-500 text-white"
    }
  }

  return (
    <>
      {/* Indicador fixo no canto inferior direito */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className={cn(
            "rounded-full p-2 shadow-lg border-2 transition-all duration-200",
            getStatusColor(),
            "text-white border-white/20 hover:scale-105",
          )}
          title={`Backend: ${getStatusText()} - ${status.message}`}
        >
          {getStatusIcon()}
        </Button>
      </div>

      {/* Modal de detalhes */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg">Status do Backend</CardTitle>
                <CardDescription>Conexão com o servidor Spring Boot</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status atual */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge className={cn("flex items-center gap-1 px-2 py-1 rounded-md", getStatusBackground())}>
                  {getStatusIcon()}
                  {getStatusText()}
                </Badge>
              </div>

              {/* Mensagem detalhada */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Detalhes:</span>
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">{status.message}</p>
              </div>

              {/* Informações técnicas */}
              {status.responseTime && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tempo de resposta:</span>
                  <span className="text-sm text-muted-foreground">{status.responseTime}ms</span>
                </div>
              )}

              {status.endpoint && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Endpoint:</span>
                  <p className="text-xs text-muted-foreground bg-muted p-2 rounded font-mono break-all">
                    {status.endpoint}
                  </p>
                </div>
              )}

              {/* Ações */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={checkStatus} disabled={isChecking} className="flex-1">
                  {isChecking ? "Verificando..." : "Verificar Agora"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowDetails(false)} className="flex-1">
                  Fechar
                </Button>
              </div>

              {/* Dicas baseadas no status */}
              {status.status === "offline" && (
                <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong>💡 Dica:</strong> Verifique se o Spring Boot está rodando na porta correta e se não há
                    firewall bloqueando a conexão.
                  </p>
                </div>
              )}

              {status.status === "cors" && (
                <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded border border-orange-200 dark:border-orange-800">
                  <p className="text-sm text-orange-800 dark:text-orange-200">
                    <strong>💡 Dica:</strong> Configure o CORS no Spring Boot para aceitar requisições de{" "}
                    {window.location.origin}
                  </p>
                </div>
              )}

              {status.status === "timeout" && (
                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>💡 Dica:</strong> O servidor está demorando para responder. Verifique a performance do
                    backend ou a conexão de rede.
                  </p>
                </div>
              )}
              {status.status === "slow" && (
                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>💡 Dica:</strong> O backend respondeu, mas com latência alta. Isso pode afetar o tempo de carregamento das páginas.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
