"use client"

import type React from "react"

import { useState } from "react"
import {
  MoreHorizontal,
  Eye,
  Download,
  RefreshCw,
  Monitor,
  HardDrive,
  MemoryStick,
  Shield,
  Wifi,
  Clock,
  Cpu,
  MapPin,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { Machine } from "@/types/machine"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface MachineInventoryGridProps {
  machines: Machine[]
  onForceCheckin: (machineId: string) => Promise<void>
  onExportMachine: (machine: Machine) => void
}

export function MachineInventoryGrid({ machines, onForceCheckin, onExportMachine }: MachineInventoryGridProps) {
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
  const [loadingCheckin, setLoadingCheckin] = useState<string | null>(null)

  const getStatusColor = (status: Machine["status"]) => {
    switch (status) {
      case "online":
        return "border-green-200 bg-green-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      case "offline":
        return "border-red-200 bg-red-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getStatusBadge = (status: Machine["status"]) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-100 text-green-800 border-green-200">🟢 Online</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">🟡 Alerta</Badge>
      case "offline":
        return <Badge className="bg-red-100 text-red-800 border-red-200">🔴 Offline</Badge>
      default:
        return <Badge variant="secondary">❓ Desconhecido</Badge>
    }
  }

  const getComplianceBadge = (status: Machine["complianceStatus"]) => {
    switch (status) {
      case "compliant":
        return <Badge className="bg-green-100 text-green-800 border-green-200">✅ Compliant</Badge>
      case "non-compliant":
        return <Badge className="bg-red-100 text-red-800 border-red-200">❌ Não Compliant</Badge>
      case "unknown":
        return <Badge variant="secondary">❓ Desconhecido</Badge>
      default:
        return <Badge variant="secondary">❓ Desconhecido</Badge>
    }
  }

  const handleForceCheckin = async (machineId: string) => {
    setLoadingCheckin(machineId)
    try {
      await onForceCheckin(machineId)
    } finally {
      setLoadingCheckin(null)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR })
    } catch {
      return "Data inválida"
    }
  }

  const calculateUsagePercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100)
  }

  if (machines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Monitor className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhuma máquina encontrada</h3>
        <p className="text-muted-foreground text-center">
          Ajuste os filtros para encontrar as máquinas que você está procurando.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {machines.map((machine) => (
          <Card
            key={machine.id}
            className={`relative transition-all hover:shadow-md ${getStatusColor(machine.status)}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    {machine.hostname}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Wifi className="h-3 w-3" />
                    {machine.ip}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setSelectedMachine(machine)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExportMachine(machine)}>
                      <Download className="mr-2 h-4 w-4" />
                      Exportar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleForceCheckin(machine.id)}
                      disabled={loadingCheckin === machine.id}
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${loadingCheckin === machine.id ? "animate-spin" : ""}`} />
                      Forçar Check-in
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between">
                {getStatusBadge(machine.status)}
                {getComplianceBadge(machine.complianceStatus)}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Informações do Usuário */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{machine.user}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{machine.location}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {machine.department}
                </Badge>
              </div>

              <Separator />

              {/* Hardware Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{machine.cpu}</span>
                </div>

                {/* RAM Usage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <MemoryStick className="h-3 w-3" />
                      RAM
                    </span>
                    <span>
                      {machine.ramUsed}GB/{machine.ramTotal}GB
                    </span>
                  </div>
                  <Progress value={calculateUsagePercentage(machine.ramUsed, machine.ramTotal)} className="h-2" />
                </div>

                {/* Disk Usage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <HardDrive className="h-3 w-3" />
                      Disco
                    </span>
                    <span>
                      {machine.diskUsed}GB/{machine.diskTotal}GB
                    </span>
                  </div>
                  <Progress value={calculateUsagePercentage(machine.diskUsed, machine.diskTotal)} className="h-2" />
                </div>
              </div>

              <Separator />

              {/* Security Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{machine.antivirus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Score de Segurança</span>
                  <Badge
                    variant={
                      machine.securityScore >= 80
                        ? "default"
                        : machine.securityScore >= 60
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {machine.securityScore}/100
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Last Activity */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Último check-in: {formatDate(machine.lastCheckin)}</span>
                </div>
                <div className="text-xs text-muted-foreground">Uptime: {machine.uptime}</div>
              </div>

              {/* Tags */}
              {machine.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {machine.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {machine.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{machine.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedMachine} onOpenChange={() => setSelectedMachine(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Detalhes da Máquina: {selectedMachine?.hostname}
            </DialogTitle>
            <DialogDescription>Informações completas sobre a máquina selecionada</DialogDescription>
          </DialogHeader>

          {selectedMachine && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6">
                {/* Informações Básicas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações Básicas</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Hostname</Label>
                      <p className="text-sm text-muted-foreground">{selectedMachine.hostname}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Usuário</Label>
                      <p className="text-sm text-muted-foreground">{selectedMachine.user}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Departamento</Label>
                      <p className="text-sm text-muted-foreground">{selectedMachine.department}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Localização</Label>
                      <p className="text-sm text-muted-foreground">{selectedMachine.location}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">IP</Label>
                      <p className="text-sm text-muted-foreground">{selectedMachine.ip}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <div className="mt-1">{getStatusBadge(selectedMachine.status)}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Hardware */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hardware</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Fabricante</Label>
                      <p className="text-sm text-muted-foreground">{selectedMachine.manufacturer}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Modelo</Label>
                      <p className="text-sm text-muted-foreground">{selectedMachine.model}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Número de Série</Label>
                      <p className="text-sm text-muted-foreground">{selectedMachine.serialNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">CPU</Label>
                      <p className="text-sm text-muted-foreground">{selectedMachine.cpu}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Tags e Observações */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tags e Observações</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Tags</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedMachine.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Observações</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedMachine.notes || "Nenhuma observação"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Label({ className, children, ...props }: { className?: string; children: React.ReactNode }) {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ""}`}
      {...props}
    >
      {children}
    </label>
  )
}
