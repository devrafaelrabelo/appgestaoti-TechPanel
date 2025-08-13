"use client"

import type React from "react"

import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  Monitor,
  Users,
  Building2,
  MoreHorizontal,
  Eye,
  Download,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
import type { Machine } from "@/types/machine"
import { useMachines } from "@/hooks/use-machines"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface MachineInventoryTreeProps {
  machines: Machine[]
  onForceCheckin: (machineId: string) => Promise<void>
  onExportMachine: (machine: Machine) => void
}

export function MachineInventoryTree({ machines, onForceCheckin, onExportMachine }: MachineInventoryTreeProps) {
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set())
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
  const [loadingCheckin, setLoadingCheckin] = useState<string | null>(null)
  const { groupByDepartment } = useMachines()

  const departmentGroups = groupByDepartment(machines)

  const toggleDepartment = (department: string) => {
    const newExpanded = new Set(expandedDepartments)
    if (newExpanded.has(department)) {
      newExpanded.delete(department)
    } else {
      newExpanded.add(department)
    }
    setExpandedDepartments(newExpanded)
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
        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhuma máquina encontrada</h3>
        <p className="text-muted-foreground text-center">
          Ajuste os filtros para encontrar as máquinas que você está procurando.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {departmentGroups.map((group) => (
        <Card key={group.name}>
          <Collapsible open={expandedDepartments.has(group.name)} onOpenChange={() => toggleDepartment(group.name)}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {expandedDepartments.has(group.name) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {group.stats.total} máquinas
                        </Badge>
                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                          {group.stats.online} online
                        </Badge>
                        {group.stats.warning > 0 && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                            {group.stats.warning} alerta
                          </Badge>
                        )}
                        {group.stats.offline > 0 && (
                          <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                            {group.stats.offline} offline
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Estatísticas rápidas */}
                    <div className="text-right text-sm text-muted-foreground">
                      <div>
                        Compliance: {group.stats.compliant}/{group.stats.total}
                      </div>
                      <div>Atualizações: {group.stats.needsUpdate} pendentes</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {group.machines.map((machine) => (
                    <Card key={machine.id} className="border-l-4 border-l-muted">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            {/* Header da máquina */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Monitor className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <h4 className="font-medium">{machine.hostname}</h4>
                                  <p className="text-sm text-muted-foreground">{machine.ip}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(machine.status)}
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
                              </div>
                            </div>

                            {/* Informações do usuário */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Usuário:</span>
                                <p className="font-medium">{machine.user}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Localização:</span>
                                <p className="font-medium">{machine.location}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Modelo:</span>
                                <p className="font-medium">{machine.model}</p>
                              </div>
                            </div>

                            {/* Recursos do sistema */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* RAM */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Memória RAM</span>
                                  <span>
                                    {machine.ramUsed}GB / {machine.ramTotal}GB
                                  </span>
                                </div>
                                <Progress
                                  value={calculateUsagePercentage(machine.ramUsed, machine.ramTotal)}
                                  className="h-2"
                                />
                              </div>

                              {/* Disco */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Armazenamento</span>
                                  <span>
                                    {machine.diskUsed}GB / {machine.diskTotal}GB
                                  </span>
                                </div>
                                <Progress
                                  value={calculateUsagePercentage(machine.diskUsed, machine.diskTotal)}
                                  className="h-2"
                                />
                              </div>
                            </div>

                            {/* Informações adicionais */}
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>Último check-in: {formatDate(machine.lastCheckin)}</span>
                              <span>Uptime: {machine.uptime}</span>
                            </div>

                            {/* Tags */}
                            {machine.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {machine.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}

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
