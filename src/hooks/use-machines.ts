"use client"

import { useState, useEffect, useMemo } from "react"
import { useToast } from "@/components/ui/use-toast"
import type { Machine, MachineFilters, MachineStats, DepartmentGroup } from "@/types/machine"

// Mock data - em produção viria de uma API
const mockMachines: Machine[] = [
  {
    id: "1",
    hostname: "DESK-001-ADM",
    user: "João Silva",
    department: "Administração",
    cpu: "Intel Core i7-12700K",
    ramUsed: 8,
    ramTotal: 16,
    diskUsed: 250,
    diskTotal: 500,
    antivirus: "Windows Defender",
    ip: "192.168.1.101",
    status: "online",
    lastCheckin: "2024-01-15T10:30:00Z",
    operatingSystem: "Windows 11 Pro",
    location: "Sede - 2º Andar",
    serialNumber: "SN001234567",
    model: "OptiPlex 7090",
    manufacturer: "Dell",
    uptime: "5 dias, 12 horas",
    networkAdapter: "Intel Ethernet Connection",
    installedSoftware: ["Microsoft Office 365", "Google Chrome", "Adobe Reader", "TeamViewer"],
    lastUpdate: "2024-01-10T14:20:00Z",
    domain: "EMPRESA.LOCAL",
    workgroup: "",
    biosVersion: "1.2.3",
    processorArchitecture: "x64",
    totalPhysicalMemory: "16 GB",
    availablePhysicalMemory: "8 GB",
    virtualMemory: "32 GB",
    pageFileSize: "16 GB",
    systemType: "x64-based PC",
    timeZone: "UTC-03:00",
    bootTime: "2024-01-10T08:00:00Z",
    loggedUsers: ["joao.silva"],
    runningProcesses: 156,
    installedUpdates: 45,
    pendingUpdates: 2,
    antivirusStatus: "updated",
    firewallStatus: "enabled",
    remoteDesktopEnabled: true,
    lastBackup: "2024-01-14T22:00:00Z",
    backupStatus: "success",
    diskHealth: "good",
    temperatureCPU: 45,
    temperatureGPU: 38,
    powerStatus: "plugged",
    networkStatus: "connected",
    printerConnections: ["HP LaserJet Pro M404n"],
    sharedFolders: ["Documentos", "Projetos"],
    scheduledTasks: 12,
    eventLogErrors: 0,
    eventLogWarnings: 3,
    securityScore: 85,
    complianceStatus: "compliant",
    tags: ["VIP", "Gerência"],
    notes: "Máquina do diretor administrativo",
    assignedTo: "João Silva",
    purchaseDate: "2023-03-15",
    warrantyExpiration: "2026-03-15",
    assetTag: "ADM-001",
    costCenter: "CC-ADM-001",
    vendor: "Dell Technologies",
    supportContract: "ProSupport Plus",
    maintenanceSchedule: "Trimestral",
    replacementDate: "2027-03-15",
    environmentalImpact: "Baixo",
    energyConsumption: "65W",
    carbonFootprint: "0.5 kg CO2/dia",
  },
  {
    id: "2",
    hostname: "DESK-002-TI",
    user: "Maria Santos",
    department: "TI",
    cpu: "AMD Ryzen 7 5800X",
    ramUsed: 12,
    ramTotal: 32,
    diskUsed: 180,
    diskTotal: 1000,
    antivirus: "Kaspersky Endpoint Security",
    ip: "192.168.1.102",
    status: "warning",
    lastCheckin: "2024-01-15T10:25:00Z",
    operatingSystem: "Windows 11 Pro",
    location: "Sede - 1º Andar - TI",
    serialNumber: "SN001234568",
    model: "Precision 3660",
    manufacturer: "Dell",
    uptime: "12 dias, 8 horas",
    networkAdapter: "Realtek PCIe GbE Family Controller",
    installedSoftware: ["Visual Studio Code", "Docker Desktop", "Postman", "Git", "Node.js"],
    lastUpdate: "2024-01-08T16:45:00Z",
    domain: "EMPRESA.LOCAL",
    workgroup: "",
    biosVersion: "2.1.0",
    processorArchitecture: "x64",
    totalPhysicalMemory: "32 GB",
    availablePhysicalMemory: "20 GB",
    virtualMemory: "64 GB",
    pageFileSize: "32 GB",
    systemType: "x64-based PC",
    timeZone: "UTC-03:00",
    bootTime: "2024-01-03T09:15:00Z",
    loggedUsers: ["maria.santos"],
    runningProcesses: 203,
    installedUpdates: 52,
    pendingUpdates: 8,
    antivirusStatus: "updated",
    firewallStatus: "enabled",
    remoteDesktopEnabled: true,
    lastBackup: "2024-01-14T23:30:00Z",
    backupStatus: "success",
    diskHealth: "good",
    temperatureCPU: 52,
    temperatureGPU: 45,
    powerStatus: "plugged",
    networkStatus: "connected",
    printerConnections: ["Brother HL-L2350DW"],
    sharedFolders: ["Desenvolvimento", "Backups"],
    scheduledTasks: 18,
    eventLogErrors: 1,
    eventLogWarnings: 5,
    securityScore: 92,
    complianceStatus: "compliant",
    tags: ["Desenvolvedor", "Admin"],
    notes: "Workstation de desenvolvimento principal",
    assignedTo: "Maria Santos",
    purchaseDate: "2023-06-20",
    warrantyExpiration: "2026-06-20",
    assetTag: "TI-002",
    costCenter: "CC-TI-001",
    vendor: "Dell Technologies",
    supportContract: "ProSupport",
    maintenanceSchedule: "Semestral",
    replacementDate: "2027-06-20",
    environmentalImpact: "Médio",
    energyConsumption: "95W",
    carbonFootprint: "0.8 kg CO2/dia",
  },
  {
    id: "3",
    hostname: "DESK-003-FIN",
    user: "Carlos Oliveira",
    department: "Financeiro",
    cpu: "Intel Core i5-11400",
    ramUsed: 6,
    ramTotal: 8,
    diskUsed: 120,
    diskTotal: 256,
    antivirus: "Avast Business Antivirus",
    ip: "192.168.1.103",
    status: "offline",
    lastCheckin: "2024-01-14T16:45:00Z",
    operatingSystem: "Windows 10 Pro",
    location: "Sede - 3º Andar - Financeiro",
    serialNumber: "SN001234569",
    model: "Vostro 3681",
    manufacturer: "Dell",
    uptime: "0 dias, 0 horas",
    networkAdapter: "Intel Ethernet Connection",
    installedSoftware: ["Microsoft Excel", "SAP GUI", "Calculator Plus", "WinRAR"],
    lastUpdate: "2024-01-05T11:30:00Z",
    domain: "EMPRESA.LOCAL",
    workgroup: "",
    biosVersion: "1.8.2",
    processorArchitecture: "x64",
    totalPhysicalMemory: "8 GB",
    availablePhysicalMemory: "2 GB",
    virtualMemory: "16 GB",
    pageFileSize: "8 GB",
    systemType: "x64-based PC",
    timeZone: "UTC-03:00",
    bootTime: "2024-01-14T08:30:00Z",
    loggedUsers: [],
    runningProcesses: 0,
    installedUpdates: 38,
    pendingUpdates: 15,
    antivirusStatus: "outdated",
    firewallStatus: "enabled",
    remoteDesktopEnabled: false,
    lastBackup: "2024-01-12T20:00:00Z",
    backupStatus: "failed",
    diskHealth: "warning",
    temperatureCPU: 0,
    temperatureGPU: 0,
    powerStatus: "plugged",
    networkStatus: "disconnected",
    printerConnections: [],
    sharedFolders: [],
    scheduledTasks: 8,
    eventLogErrors: 12,
    eventLogWarnings: 25,
    securityScore: 45,
    complianceStatus: "non-compliant",
    tags: ["Crítico", "Manutenção"],
    notes: "Máquina apresentando problemas de conectividade",
    assignedTo: "Carlos Oliveira",
    purchaseDate: "2022-11-10",
    warrantyExpiration: "2025-11-10",
    assetTag: "FIN-003",
    costCenter: "CC-FIN-001",
    vendor: "Dell Technologies",
    supportContract: "Basic Support",
    maintenanceSchedule: "Anual",
    replacementDate: "2026-11-10",
    environmentalImpact: "Baixo",
    energyConsumption: "45W",
    carbonFootprint: "0.3 kg CO2/dia",
  },
  {
    id: "4",
    hostname: "DESK-004-RH",
    user: "Ana Costa",
    department: "Recursos Humanos",
    cpu: "Intel Core i3-10100",
    ramUsed: 4,
    ramTotal: 8,
    diskUsed: 85,
    diskTotal: 256,
    antivirus: "Windows Defender",
    ip: "192.168.1.104",
    status: "online",
    lastCheckin: "2024-01-15T10:28:00Z",
    operatingSystem: "Windows 11 Home",
    location: "Sede - 2º Andar - RH",
    serialNumber: "SN001234570",
    model: "Inspiron 3881",
    manufacturer: "Dell",
    uptime: "3 dias, 15 horas",
    networkAdapter: "Realtek PCIe GbE Family Controller",
    installedSoftware: ["Microsoft Office 365", "Skype for Business", "Adobe Acrobat", "Zoom"],
    lastUpdate: "2024-01-12T09:15:00Z",
    domain: "EMPRESA.LOCAL",
    workgroup: "",
    biosVersion: "1.5.1",
    processorArchitecture: "x64",
    totalPhysicalMemory: "8 GB",
    availablePhysicalMemory: "4 GB",
    virtualMemory: "16 GB",
    pageFileSize: "8 GB",
    systemType: "x64-based PC",
    timeZone: "UTC-03:00",
    bootTime: "2024-01-12T07:45:00Z",
    loggedUsers: ["ana.costa"],
    runningProcesses: 142,
    installedUpdates: 41,
    pendingUpdates: 3,
    antivirusStatus: "updated",
    firewallStatus: "enabled",
    remoteDesktopEnabled: false,
    lastBackup: "2024-01-14T21:00:00Z",
    backupStatus: "success",
    diskHealth: "good",
    temperatureCPU: 42,
    temperatureGPU: 35,
    powerStatus: "plugged",
    networkStatus: "connected",
    printerConnections: ["Canon PIXMA G3110"],
    sharedFolders: ["RH-Documentos"],
    scheduledTasks: 10,
    eventLogErrors: 0,
    eventLogWarnings: 2,
    securityScore: 78,
    complianceStatus: "compliant",
    tags: ["RH", "Padrão"],
    notes: "Máquina padrão do setor de RH",
    assignedTo: "Ana Costa",
    purchaseDate: "2023-01-25",
    warrantyExpiration: "2026-01-25",
    assetTag: "RH-004",
    costCenter: "CC-RH-001",
    vendor: "Dell Technologies",
    supportContract: "Basic Support",
    maintenanceSchedule: "Anual",
    replacementDate: "2027-01-25",
    environmentalImpact: "Baixo",
    energyConsumption: "35W",
    carbonFootprint: "0.2 kg CO2/dia",
  },
  {
    id: "5",
    hostname: "DESK-005-COM",
    user: "Pedro Ferreira",
    department: "Comercial",
    cpu: "Intel Core i7-11700",
    ramUsed: 10,
    ramTotal: 16,
    diskUsed: 320,
    diskTotal: 512,
    antivirus: "Bitdefender GravityZone",
    ip: "192.168.1.105",
    status: "warning",
    lastCheckin: "2024-01-15T10:20:00Z",
    operatingSystem: "Windows 11 Pro",
    location: "Sede - 1º Andar - Comercial",
    serialNumber: "SN001234571",
    model: "OptiPlex 7080",
    manufacturer: "Dell",
    uptime: "8 dias, 4 horas",
    networkAdapter: "Intel Ethernet Connection",
    installedSoftware: ["Salesforce Desktop", "Microsoft Teams", "WhatsApp Business", "CRM Plus"],
    lastUpdate: "2024-01-09T13:20:00Z",
    domain: "EMPRESA.LOCAL",
    workgroup: "",
    biosVersion: "2.0.1",
    processorArchitecture: "x64",
    totalPhysicalMemory: "16 GB",
    availablePhysicalMemory: "6 GB",
    virtualMemory: "32 GB",
    pageFileSize: "16 GB",
    systemType: "x64-based PC",
    timeZone: "UTC-03:00",
    bootTime: "2024-01-07T08:15:00Z",
    loggedUsers: ["pedro.ferreira"],
    runningProcesses: 178,
    installedUpdates: 47,
    pendingUpdates: 6,
    antivirusStatus: "updated",
    firewallStatus: "enabled",
    remoteDesktopEnabled: true,
    lastBackup: "2024-01-14T22:30:00Z",
    backupStatus: "success",
    diskHealth: "warning",
    temperatureCPU: 58,
    temperatureGPU: 48,
    powerStatus: "plugged",
    networkStatus: "connected",
    printerConnections: ["Epson EcoTank L3150"],
    sharedFolders: ["Comercial-Propostas", "Clientes"],
    scheduledTasks: 15,
    eventLogErrors: 2,
    eventLogWarnings: 8,
    securityScore: 82,
    complianceStatus: "compliant",
    tags: ["Vendas", "Mobile"],
    notes: "Máquina com acesso externo para vendas",
    assignedTo: "Pedro Ferreira",
    purchaseDate: "2023-04-12",
    warrantyExpiration: "2026-04-12",
    assetTag: "COM-005",
    costCenter: "CC-COM-001",
    vendor: "Dell Technologies",
    supportContract: "ProSupport",
    maintenanceSchedule: "Trimestral",
    replacementDate: "2027-04-12",
    environmentalImpact: "Médio",
    energyConsumption: "75W",
    carbonFootprint: "0.6 kg CO2/dia",
  },
]

export function useMachines() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Simular carregamento de dados
  useEffect(() => {
    const loadMachines = async () => {
      try {
        setLoading(true)
        // Simular delay de API
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setMachines(mockMachines)
      } catch (err) {
        setError("Erro ao carregar dados das máquinas")
      } finally {
        setLoading(false)
      }
    }

    loadMachines()
  }, [])

  // Opções para filtros
  const departments = useMemo(() => {
    const depts = Array.from(new Set(machines.map((m) => m.department)))
    return depts.sort()
  }, [machines])

  const antivirusOptions = useMemo(() => {
    const av = Array.from(new Set(machines.map((m) => m.antivirus)))
    return av.sort()
  }, [machines])

  const users = useMemo(() => {
    const userList = Array.from(new Set(machines.map((m) => m.user)))
    return userList.sort()
  }, [machines])

  const locations = useMemo(() => {
    const locs = Array.from(new Set(machines.map((m) => m.location)))
    return locs.sort()
  }, [machines])

  const manufacturers = useMemo(() => {
    const mfgs = Array.from(new Set(machines.map((m) => m.manufacturer)))
    return mfgs.sort()
  }, [machines])

  const operatingSystems = useMemo(() => {
    const os = Array.from(new Set(machines.map((m) => m.operatingSystem)))
    return os.sort()
  }, [machines])

  // Função para filtrar máquinas
  const filterMachines = (filters: MachineFilters): Machine[] => {
    return machines.filter((machine) => {
      // Filtro de busca
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          machine.hostname.toLowerCase().includes(searchLower) ||
          machine.user.toLowerCase().includes(searchLower) ||
          machine.ip.includes(searchLower) ||
          machine.serialNumber.toLowerCase().includes(searchLower)

        if (!matchesSearch) return false
      }

      // Filtro por departamento
      if (filters.department && machine.department !== filters.department) {
        return false
      }

      // Filtro por status
      if (filters.status && machine.status !== filters.status) {
        return false
      }

      // Filtro por antivírus
      if (filters.antivirus && machine.antivirus !== filters.antivirus) {
        return false
      }

      // Filtro por usuário
      if (filters.user && machine.user !== filters.user) {
        return false
      }

      // Filtro por localização
      if (filters.location && machine.location !== filters.location) {
        return false
      }

      // Filtro por fabricante
      if (filters.manufacturer && machine.manufacturer !== filters.manufacturer) {
        return false
      }

      // Filtro por sistema operacional
      if (filters.operatingSystem && machine.operatingSystem !== filters.operatingSystem) {
        return false
      }

      // Filtro por status de compliance
      if (filters.complianceStatus && machine.complianceStatus !== filters.complianceStatus) {
        return false
      }

      // Filtro por tags
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some((tag) =>
          machine.tags.some((machineTag) => machineTag.toLowerCase().includes(tag.toLowerCase())),
        )
        if (!hasMatchingTag) return false
      }

      return true
    })
  }

  // Calcular estatísticas
  const calculateStats = (machineList: Machine[]): MachineStats => {
    return {
      total: machineList.length,
      online: machineList.filter((m) => m.status === "online").length,
      warning: machineList.filter((m) => m.status === "warning").length,
      offline: machineList.filter((m) => m.status === "offline").length,
      compliant: machineList.filter((m) => m.complianceStatus === "compliant").length,
      nonCompliant: machineList.filter((m) => m.complianceStatus === "non-compliant").length,
      needsUpdate: machineList.filter((m) => m.pendingUpdates > 0).length,
      diskSpaceWarning: machineList.filter((m) => m.diskUsed / m.diskTotal > 0.8).length,
      memoryWarning: machineList.filter((m) => m.ramUsed / m.ramTotal > 0.8).length,
      antivirusOutdated: machineList.filter((m) => m.antivirusStatus === "outdated").length,
    }
  }

  // Agrupar por departamento
  const groupByDepartment = (machineList: Machine[]): DepartmentGroup[] => {
    const groups = machineList.reduce(
      (acc, machine) => {
        if (!acc[machine.department]) {
          acc[machine.department] = []
        }
        acc[machine.department].push(machine)
        return acc
      },
      {} as Record<string, Machine[]>,
    )

    return Object.entries(groups)
      .map(([name, machines]) => ({
        name,
        machines,
        stats: calculateStats(machines),
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  // Forçar check-in
  const forceCheckin = async (machineId: string): Promise<void> => {
    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setMachines((prev) =>
        prev.map((machine) =>
          machine.id === machineId
            ? {
                ...machine,
                lastCheckin: new Date().toISOString(),
                status: "online" as const,
              }
            : machine,
        ),
      )

      toast({
        title: "Check-in forçado",
        description: "Check-in realizado com sucesso",
      })
    } catch (err) {
      toast({
        title: "Erro",
        description: "Falha ao forçar check-in",
        variant: "destructive",
      })
    }
  }

  // Exportar dados da máquina
  const exportMachine = (machine: Machine): void => {
    const exportData = {
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
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `machine-${machine.hostname}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Exportação concluída",
      description: `Dados da máquina ${machine.hostname} exportados`,
    })
  }

  return {
    machines,
    loading,
    error,
    filterMachines,
    calculateStats,
    groupByDepartment,
    forceCheckin,
    exportMachine,
    departments,
    antivirusOptions,
    users,
    locations,
    manufacturers,
    operatingSystems,
  }
}
