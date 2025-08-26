export interface Department {
  id: string
  name: string
  description: string
  managerId: string | null
}

export interface CreateDepartmentPayload {
  name: string
  description: string
}

export interface UpdateDepartmentPayload {
  name: string
  description: string
  managerId?: string | null
}

export interface DepartmentFilters {
  search?: string
  managerId?: string
}

export interface DepartmentStats {
  total: number
  withManager: number
  withoutManager: number
}
