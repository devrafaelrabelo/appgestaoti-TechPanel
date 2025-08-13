export interface EmployeeTerminationRequest {
  id: string
  employeeId: string
  employeeName: string
  employeeCpf: string
  employeeEmail: string
  department: string
  position: string
  admissionDate: string
  requestedBy: string
  requestedByName: string
  requestedAt: string
  terminationDate: string
  terminationReason: "DISMISSAL" | "RESIGNATION" | "RETIREMENT" | "CONTRACT_END" | "OTHER"
  terminationReasonDescription: string
  commercialNotes: string
  hrApprovedBy?: string
  hrApprovedByName?: string
  hrApprovedAt?: string
  hrNotes?: string
  itExecutedBy?: string
  itExecutedByName?: string
  itExecutedAt?: string
  itNotes?: string
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED"
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  hasSystemAccess: boolean
  systemAccounts: string[]
  hasPhysicalAssets: boolean
  physicalAssets: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateTerminationRequest {
  employeeId: string
  employeeName: string
  employeeCpf: string
  employeeEmail: string
  department: string
  position: string
  admissionDate: string
  terminationDate: string
  terminationReason: EmployeeTerminationRequest["terminationReason"]
  terminationReasonDescription: string
  commercialNotes: string
  priority: EmployeeTerminationRequest["priority"]
  hasSystemAccess: boolean
  systemAccounts: string[]
  hasPhysicalAssets: boolean
  physicalAssets: string[]
}

export interface TerminationFilters {
  search: string
  status: string
  priority: string
  department: string
  terminationReason: string
  dateFrom: string
  dateTo: string
  requestedBy: string
}

export interface HRApprovalData {
  approved: boolean
  hrNotes: string
}

export interface ITExecutionData {
  itNotes: string
  accountsDeactivated: string[]
  assetsRecovered: string[]
}

export const TERMINATION_REASONS = {
  DISMISSAL: "Demissão",
  RESIGNATION: "Pedido de Demissão",
  RETIREMENT: "Aposentadoria",
  CONTRACT_END: "Fim de Contrato",
  OTHER: "Outros",
} as const

export const TERMINATION_STATUS = {
  PENDING: "Aguardando RH",
  APPROVED: "Aprovado - Aguardando TI",
  REJECTED: "Rejeitado pelo RH",
  COMPLETED: "Desligamento Concluído",
  CANCELLED: "Cancelado",
} as const

export const PRIORITY_LEVELS = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
} as const
