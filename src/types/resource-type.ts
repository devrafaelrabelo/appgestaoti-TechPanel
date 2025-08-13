export interface ResourceType {
  id: string
  code: string
  name: string
  description?: string
  active: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export interface ResourceTypeFilters {
  search?: string
  active?: boolean
  code?: string
}

export interface ResourceTypeFormData {
  code: string
  name: string
  description?: string
  active: boolean
}

export interface ResourceTypeResponse {
  data: ResourceType[]
  total: number
  page: number
  limit: number
}
