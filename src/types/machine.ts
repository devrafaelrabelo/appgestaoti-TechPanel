export interface Machine {
  id: string
  hostname: string
  user: string
  department: string
  cpu: string
  ramUsed: number
  ramTotal: number
  diskUsed: number
  diskTotal: number
  antivirus: string
  ip: string
  status: "online" | "warning" | "offline"
  lastCheckin: string
  operatingSystem: string
  location: string
  serialNumber: string
  model: string
  manufacturer: string
  uptime: string
  networkAdapter: string
  installedSoftware: string[]
  lastUpdate: string
  domain: string
  workgroup: string
  biosVersion: string
  processorArchitecture: string
  totalPhysicalMemory: string
  availablePhysicalMemory: string
  virtualMemory: string
  pageFileSize: string
  systemType: string
  timeZone: string
  bootTime: string
  loggedUsers: string[]
  runningProcesses: number
  installedUpdates: number
  pendingUpdates: number
  antivirusStatus: "updated" | "outdated" | "disabled"
  firewallStatus: "enabled" | "disabled"
  remoteDesktopEnabled: boolean
  lastBackup: string
  backupStatus: "success" | "failed" | "pending"
  diskHealth: "good" | "warning" | "critical"
  temperatureCPU: number
  temperatureGPU: number
  powerStatus: "plugged" | "battery"
  batteryLevel?: number
  networkStatus: "connected" | "disconnected" | "limited"
  printerConnections: string[]
  sharedFolders: string[]
  scheduledTasks: number
  eventLogErrors: number
  eventLogWarnings: number
  securityScore: number
  complianceStatus: "compliant" | "non-compliant" | "unknown"
  tags: string[]
  notes: string
  assignedTo: string
  purchaseDate: string
  warrantyExpiration: string
  assetTag: string
  costCenter: string
  vendor: string
  supportContract: string
  maintenanceSchedule: string
  replacementDate: string
  disposalDate?: string
  environmentalImpact: string
  energyConsumption: string
  carbonFootprint: string
}

export interface MachineFilters {
  search: string
  department: string
  status: string
  antivirus: string
  user: string
  location: string
  manufacturer: string
  operatingSystem: string
  complianceStatus: string
  tags: string[]
  dateRange: {
    from: string
    to: string
  }
}

export type ViewMode = "table" | "grid" | "tree"

export interface MachineStats {
  total: number
  online: number
  warning: number
  offline: number
  compliant: number
  nonCompliant: number
  needsUpdate: number
  diskSpaceWarning: number
  memoryWarning: number
  antivirusOutdated: number
}

export interface DepartmentGroup {
  name: string
  machines: Machine[]
  stats: MachineStats
}

export interface MachineExportData {
  hostname: string
  user: string
  department: string
  cpu: string
  ram: string
  disk: string
  antivirus: string
  ip: string
  status: string
  lastCheckin: string
  operatingSystem: string
  location: string
  serialNumber: string
  model: string
  manufacturer: string
  complianceStatus: string
  securityScore: number
  uptime: string
  lastUpdate: string
  installedSoftware: string
  tags: string
  notes: string
}
