"use client"

import { useState } from "react"
import { Table, Grid3X3, TreePine, Monitor, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { MachineInventoryFilters } from "@/components/machine-inventory-filters"
import { MachineInventoryTable } from "@/components/machine-inventory-table"
import { MachineInventoryGrid } from "@/components/machine-inventory-grid"
import { MachineInventoryTree } from "@/components/machine-inventory-tree"
import { useMachines } from "@/hooks/use-machines"
import type { MachineFilters, ViewMode } from "@/types/machine"

export default function MachineInventoryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [filters, setFilters] = useState<MachineFilters>({
    search: "",
    department: "",
    status: "",
    antivirus: "",
    user: "",
    location: "",
    manufacturer: "",
    operatingSystem: "",
    complianceStatus: "",
    tags: [],
    dateRange: {
      from: "",
      to: "",
    },
  })

  const {
    machines,
    loading,
    error,
    filterMachines,
    calculateStats,
    forceCheckin,
    exportMachine,
    departments,
    antivirusOptions,
    users,
    locations,
    manufacturers,
    operatingSystems,
  } = useMachines()

  const { toast } = useToast()

  const filteredMachines = filterMachines(filters)
  const stats = calculateStats(filteredMachines)

  const handleExportAll = () => {
    const data = filteredMachines.map((machine) => ({
      hostname: machine.hostname,
      user: machine.user,
      department: machine.department,
      cpu: machine.cpu,
      ram: `${machine.ramUsed}GB / ${machine.ramTotal}GB`,
      disk: `${machine.diskUsed}GB / ${machine.diskTotal}GB`,
      antivirus: machine.antivirus,
      ip: machine.ip,
      status: machine.status,
      lastCheckin: machine.lastCheckin,
      operatingSystem: machine.operatingSystem,
      location: machine.location,
      serialNumber: machine.serialNumber,
      model: machine.model,
      manufacturer: machine.manufacturer,
      complianceStatus: machine.complianceStatus,
      securityScore: machine.securityScore,
      uptime: machine.uptime,
      lastUpdate: machine.lastUpdate,
      installedSoftware: machine.installedSoftware.join(", "),
      tags: machine.tags.join(", "),
      notes: machine.notes,
    }))

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `machine-inventory-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Exportação concluída",
      description: `${filteredMachines.length} máquinas exportadas com sucesso`,
    })
  }

  const handleForceCheckinAll = async () => {
    const offlineMachines = filteredMachines.filter((m) => m.status === "offline")

    if (offlineMachines.length === 0) {
      toast({
        title: "Nenhuma ação necessária",
        description: "Não há máquinas offline para forçar check-in",
      })
      return
    }

    toast({
      title: "Forçando check-in...",
      description: `Iniciando check-in para ${offlineMachines.length} máquinas offline`,
    })

    // Simular processo em lote
    for (const machine of offlineMachines) {
      await forceCheckin(machine.id)
      await new Promise((resolve) => setTimeout(resolve, 100)) // Pequeno delay entre requests
    }

    toast({
      title: "Check-in em lote concluído",
      description: `Check-in forçado para ${offlineMachines.length} máquinas`,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Carregando inventário de máquinas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Monitor className="h-8 w-8 text-destructive" />
          <p className="text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventário de Máquinas</h1>
          <p className="text-muted-foreground">Gerencie e monitore todas as máquinas da rede corporativa</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportAll}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Tudo
          </Button>
          <Button variant="outline" onClick={handleForceCheckinAll}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Check-in em Lote
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Máquinas</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{machines.length} no total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
            <Badge variant="default" className="text-xs">
              🟢
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.online}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.online / stats.total) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Alerta</CardTitle>
            <Badge variant="secondary" className="text-xs">
              🟡
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.warning / stats.total) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
            <Badge variant="destructive" className="text-xs">
              🔴
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.offline}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.offline / stats.total) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Use os filtros abaixo para encontrar máquinas específicas</CardDescription>
        </CardHeader>
        <CardContent>
          <MachineInventoryFilters
            filters={filters}
            onFiltersChange={setFilters}
            departments={departments}
            antivirusOptions={antivirusOptions}
            users={users}
            locations={locations}
            manufacturers={manufacturers}
            operatingSystems={operatingSystems}
          />
        </CardContent>
      </Card>

      {/* Modos de Visualização */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Tabela
            </TabsTrigger>
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Grade
            </TabsTrigger>
            <TabsTrigger value="tree" className="flex items-center gap-2">
              <TreePine className="h-4 w-4" />
              Árvore
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Mostrando {filteredMachines.length} de {machines.length} máquinas
            </span>
          </div>
        </div>

        <Separator className="my-4" />

        <TabsContent value="table" className="space-y-4">
          <MachineInventoryTable
            machines={filteredMachines}
            onForceCheckin={forceCheckin}
            onExportMachine={exportMachine}
          />
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          <MachineInventoryGrid
            machines={filteredMachines}
            onForceCheckin={forceCheckin}
            onExportMachine={exportMachine}
          />
        </TabsContent>

        <TabsContent value="tree" className="space-y-4">
          <MachineInventoryTree
            machines={filteredMachines}
            onForceCheckin={forceCheckin}
            onExportMachine={exportMachine}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
