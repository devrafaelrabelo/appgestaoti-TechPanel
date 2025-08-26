export interface Function {
  id: string
  name: string
  description: string
  departmentId: string
}

export interface CreateFunctionPayload {
  name: string
  description: string
  departmentId: string
}

export interface UpdateFunctionPayload {
  name: string
  description: string
  departmentId: string
}

export interface FunctionFilters {
  search?: string
  departmentId?: string
}

export interface FunctionStats {
  total: number
  byDepartment: Record<string, number>
}
