export interface CorporatePhone {
  id: number
  number: string
  carrier: string
  planType: string
  status: string
  companyId: number | null
  currentUserId: number | null
  whatsappBlock: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateCorporatePhoneRequest {
  number: string
  carrier: string
  planType: string
  status: string
  companyId?: number | null
  currentUserId?: number | null
  whatsappBlock: boolean
}

export interface UpdateCorporatePhoneRequest {
  id: number
  number?: string
  carrier?: string
  planType?: string
  status?: string
  companyId?: number | null
  currentUserId?: number | null
  whatsappBlock?: boolean
}

export interface CorporatePhoneFilters {
  search?: string
  carrier?: string
  planType?: string
  status?: string
  whatsappBlock?: boolean
  companyId?: number
  currentUserId?: number
}

export const CARRIERS = [
  { value: "VIVO", label: "Vivo" },
  { value: "CLARO", label: "Claro" },
  { value: "TIM", label: "TIM" },
  { value: "OI", label: "Oi" },
] as const

export const PLAN_TYPES = [
  { value: "PREPAID", label: "Pré-pago" },
  { value: "POSTPAID", label: "Pós-pago" },
] as const

export const PHONE_STATUS = [
  { value: "ACTIVE", label: "Ativo" },
  { value: "INACTIVE", label: "Inativo" },
  { value: "SUSPENDED", label: "Suspenso" },
  { value: "CANCELLED", label: "Cancelado" },
] as const

export interface CorporatePhoneFiltersType {
  search: string,
  carrier: string,
  planType: string,
  status: string,
  whatsappBlock: boolean,
  companyId: number | null,
  currentUserId: number | null,
}