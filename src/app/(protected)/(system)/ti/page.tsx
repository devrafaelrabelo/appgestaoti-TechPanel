'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { RefreshCw, Server, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useHealthMonitor } from '@/hooks/use-health-monitor'
import { ServiceHealthDetails } from '@/components/service-health-details'
import type { Container } from '@/types/health-monitor'

export default function TIDashboardPage() {
  const { data, loading, refreshing, error, lastUpdated, refresh } = useHealthMonitor({
    autoRefresh: true,
    refreshInterval: 30000 // 30 segundos
  })

  const getContainerStatusIcon = (container: Container) => {
    if (!container.running) {
      return <XCircle className="h-4 w-4 text-red-500" />
    }
    
    if (container.service_health?.status === 'ok') {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    
    if (container.service_health?.status === 'error') {
      return <XCircle className="h-4 w-4 text-red-500" />
    }
    
    if (container.service_health?.status === 'degraded') {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
    
    return <Clock className="h-4 w-4 text-blue-500" />
  }

  const getContainerStatusColor = (container: Container) => {
    if (!container.running) {
      return "bg-red-100 text-red-800 border-red-200"
    }
    
    if (container.service_health?.status === 'ok') {
      return "bg-green-100 text-green-800 border-green-200"
    }
    
    if (container.service_health?.status === 'error') {
      return "bg-red-100 text-red-800 border-red-200"
    }
    
    if (container.service_health?.status === 'degraded') {
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
    
    return "bg-blue-100 text-blue-800 border-blue-200"
  }

  const getProblemsContainers = () => {
    if (!data?.containers) return []
    
    return data.containers.filter(container => 
      !container.running || 
      container.service_health?.status === 'error' || 
      container.service_health?.status === 'degraded'
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Containers Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Erro ao carregar dados de monitoramento:</strong>
            <br />
            {error}
            <br />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refresh}
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Nenhum dado de monitoramento disponível.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const problemsContainers = getProblemsContainers()

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Monitoramento TI</h1>
          <p className="text-muted-foreground">
            Monitoramento em tempo real dos serviços e contêineres
          </p>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-1">
              Última atualização: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
        <Button 
          onClick={refresh} 
          disabled={refreshing}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>

      {/* Problems Alert */}
      {problemsContainers.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Atenção:</strong> {problemsContainers.length} contêiner(es) com problemas detectados:
            <ul className="mt-2 list-disc list-inside">
              {problemsContainers.map(container => (
                <li key={container.name} className="text-sm">
                  <strong>{container.name}</strong> - {!container.running ? 'Parado' : container.service_health?.status}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Contêineres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.summary.online}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Offline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.summary.offline}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Com Erros HTTP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{data.summary.with_http_error}</div>
          </CardContent>
        </Card>
      </div>

      {/* Containers Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Contêineres</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.containers.map((container) => (
            <Card key={container.name} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold truncate">
                    {container.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {getContainerStatusIcon(container)}
                    <Badge className={getContainerStatusColor(container)}>
                      {container.running ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-1 mb-1">
                    <Server className="h-3 w-3" />
                    <span className="truncate">{container.image}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Uptime: {container.uptime}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-xs">
                    <span className="text-muted-foreground">Status: </span>
                    <Badge variant="outline" className="text-xs">
                      {container.status}
                    </Badge>
                  </div>
                  
                  {container.service_health && (
                    <ServiceHealthDetails health={container.service_health} />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
