"use client"

import type React from "react"

import { useState } from "react"
import { MoreHorizontal, Eye, Download, RefreshCw, Monitor, HardDrive, MemoryStick, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Machine } from "@/types/machine"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface MachineInventoryTableProps {
  machines: Machine[]
  onForceCheckin: (machineId: string) => Promise<void>
  onExportMachine: (machine: Machine) => void
}

export function MachineInventoryTable({ machines, onForceCheckin, onExportMachine }: MachineInventoryTableProps) {
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
  const [loadingCheckin, setLoadingCheckin] = useState<string | null>(null)

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

  const getAntivirusStatusBadge = (status: Machine["antivirusStatus"]) => {
    switch (status) {
      case "updated":
        return <Badge className="bg-green-100 text-green-800 border-green-200">✅ Atualizado</Badge>
      case "outdated":
        return <Badge className="bg-red-100 text-red-800 border-red-200">⚠️ Desatualizado</Badge>
      case "disabled":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">❌ Desabilitado</Badge>
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

  const calculateDiskUsagePercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100)
  }

  const calculateMemoryUsagePercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Máquina</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Recursos</TableHead>
              <TableHead>Antivírus</TableHead>
              <TableHead>Último Check-in</TableHead>
              <TableHead>Compliance</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {machines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Monitor className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">Nenhuma máquina encontrada</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              machines.map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{machine.hostname}</div>
                      <div className="text-sm text-muted-foreground">{machine.ip}</div>
                      <div className="text-xs text-muted-foreground">{machine.model}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{machine.user}</div>
                      <div className="text-sm text-muted-foreground">{machine.location}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{machine.department}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(machine.status)}</TableCell>
                  <TableCell>
                    <div className="space-y-2 min-w-32">
                      {/* RAM */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1">
                            <MemoryStick className="h-3 w-3" />
                            RAM
                          </span>
                          <span>
                            {machine.ramUsed}GB/{machine.ramTotal}GB
                          </span>
                        </div>
                        <Progress
                          value={calculateMemoryUsagePercentage(machine.ramUsed, machine.ramTotal)}
                          className="h-1"
                        />
                      </div>
                      {/* Disco */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1">
                            <HardDrive className="h-3 w-3" />
                            Disco
                          </span>
                          <span>
                            {machine.diskUsed}GB/{machine.diskTotal}GB
                          </span>
                        </div>
                        <Progress
                          value={calculateDiskUsagePercentage(machine.diskUsed, machine.diskTotal)}
                          className="h-1"
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{machine.antivirus}</div>
                      {getAntivirusStatusBadge(machine.antivirusStatus)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{formatDate(machine.lastCheckin)}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {machine.uptime}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getComplianceBadge(machine.complianceStatus)}</TableCell>
                  <TableCell className="text-right">
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
                          <RefreshCw
                            className={`mr-2 h-4 w-4 ${loadingCheckin === machine.id ? "animate-spin" : ""}`}
                          />
                          Forçar Check-in
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
                    <div>
                      <Label className="text-sm font-medium">Memória RAM</Label>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {selectedMachine.ramUsed}GB / {selectedMachine.ramTotal}GB
                        </p>
                        <Progress
                          value={calculateMemoryUsagePercentage(selectedMachine.ramUsed, selectedMachine.ramTotal)}
                          className="h-2"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Armazenamento</Label>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {selectedMachine.diskUsed}GB / {selectedMachine.diskTotal}GB
                        </p>
                        <Progress
                          value={calculateDiskUsagePercentage(selectedMachine.diskUsed, selectedMachine.diskTotal)}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Software */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Software</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Sistema Operacional</Label>
                      <p className="text-sm text-muted-foreground">{selectedMachine.operatingSystem}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Antivírus</Label>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{selectedMachine.antivirus}</p>
                        {getAntivirusStatusBadge(selectedMachine.antivirusStatus)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Domínio</Label>
                      <p className="text-sm text-muted-foreground">{selectedMachine.domain}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Versão BIOS</Label>
                      <p className="text-sm text-muted-foreground">{selectedMachine.biosVersion}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Status e Monitoramento */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Status e Monitoramento</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Último Check-in</Label>
                      <p className="text-sm text-muted-foreground">{formatDate(selectedMachine.lastCheckin)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Uptime</Label>
                      <p className="text-sm text-muted-foreground">{selectedMachine.uptime}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Última Atualização</Label>
                      <p className="text-sm text-muted-foreground">{formatDate(selectedMachine.lastUpdate)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Compliance</Label>
                      <div className="mt-1">{getComplianceBadge(selectedMachine.complianceStatus)}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Score de Segurança</Label>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{selectedMachine.securityScore}/100</p>
                        <Progress value={selectedMachine.securityScore} className="h-2" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Atualizações Pendentes</Label>
                      <p className="text-sm text-muted-foreground">{selectedMachine.pendingUpdates}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Software Instalado */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Software Instalado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedMachine.installedSoftware.map((software, index) => (
                        <Badge key={index} variant="outline">
                          {software}
                        </Badge>
                      ))}
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
