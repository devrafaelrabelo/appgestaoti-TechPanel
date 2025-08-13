import React from "react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, Clock, Minus } from 'lucide-react'
import type { ServiceHealth } from "@/types/health-monitor"

interface ServiceHealthDetailsProps {
  health: ServiceHealth
}

export function ServiceHealthDetails({ health }: ServiceHealthDetailsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ok":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "skipped":
        return <Minus className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok":
        return "bg-green-100 text-green-800 border-green-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      case "degraded":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "skipped":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getStatusText = (status: string) => {
    if (!status || typeof status !== 'string') return 'Desconhecido'
    
    switch (status) {
      case "ok":
        return "OK"
      case "error":
        return "Erro"
      case "degraded":
        return "Degradado"
      case "skipped":
        return "Ignorado"
      case "no proxy path configured":
        return "Sem Proxy"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  const renderHealthContent = () => {
    if (!health || !health.status) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <Badge className="bg-gray-100 text-gray-800 border-gray-200">Desconhecido</Badge>
          </div>
          <p className="text-xs text-muted-foreground">Status não disponível</p>
        </div>
      )
    }

    if (health.status === "skipped") {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {getStatusIcon(health.status)}
            <Badge className={getStatusColor(health.status)}>Ignorado</Badge>
          </div>
          {health.reason && (
            <p className="text-xs text-muted-foreground">Motivo: {health.reason}</p>
          )}
        </div>
      )
    }

    if (health.status === "no proxy path configured") {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {getStatusIcon(health.status)}
            <Badge className={getStatusColor("skipped")}>Sem Proxy</Badge>
          </div>
          <p className="text-xs text-muted-foreground">Caminho de proxy não configurado</p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {getStatusIcon(health.status)}
          <Badge className={getStatusColor(health.status)}>
            {getStatusText(health.status)}
          </Badge>
        </div>

        {health.http_status && (
          <div className="text-xs">
            <span className="text-muted-foreground">HTTP Status: </span>
            <span className={health.http_status >= 200 && health.http_status < 300 ? "text-green-600" : "text-red-600"}>
              {health.http_status}
            </span>
          </div>
        )}

        {health.url && (
          <div className="text-xs">
            <span className="text-muted-foreground">URL: </span>
            <code className="bg-muted px-1 py-0.5 rounded text-xs break-all">{health.url}</code>
          </div>
        )}

        {health.data && (
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Dados:</span>
            <div className="bg-muted p-2 rounded text-xs">
              <pre className="whitespace-pre-wrap break-words">
                {typeof health.data === "string" ? health.data : JSON.stringify(health.data, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {health.response && health.status === "error" && (
          <Alert variant="destructive" className="text-xs">
            <AlertTriangle className="h-3 w-3" />
            <AlertDescription className="text-xs">
              <strong>Resposta de Erro:</strong>
              <pre className="mt-1 whitespace-pre-wrap break-words text-xs">
                {typeof health.response === 'string' && health.response.length > 200 
                  ? `${health.response.substring(0, 200)}...` 
                  : typeof health.response === 'string' 
                    ? health.response 
                    : JSON.stringify(health.response, null, 2)}
              </pre>
            </AlertDescription>
          </Alert>
        )}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="text-xs font-medium text-muted-foreground mb-2">Status do Serviço</div>
      {renderHealthContent()}
    </div>
  )
}
