export interface ResourceStatus {
  id: string
  code: string
  name: string
  description: string
  blocksAllocation: boolean
}

export interface ResourceStatusFormData {
  code: string
  name: string
  description: string
  blocksAllocation: boolean
}

export interface ResourceStatusFilters {
  search?: string
  blocksAllocation?: boolean | null
}
