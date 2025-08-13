export interface Resource {
  id: string
  name: string
  assetTag: string | null
  serialNumber: string | null
  brand: string | null
  model: string | null
  location: string | null
  currentUser: string | null
  status: string | null
  type: string | null
  company: string | null
  createdAt?: string
  updatedAt?: string
  active?: boolean
  resourceType?: ResourceType
}

export interface ResourceType {
  id: string
  name: string
  description?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ResourceStatus {
  id: string
  name: string
  description?: string
  allowsUsage: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ResourceFilters {
  search?: string
  brand?: string
  status?: string
  type?: string
  location?: string
  currentUser?: string
  company?: string
  page?: number
  size?: number
}

export interface ResourceFormData {
  name: string
  assetTag?: string
  serialNumber?: string
  brand?: string
  model?: string
  location?: string
  currentUser?: string
  status?: string
  type?: string
  company?: string
}

export interface SpringPageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  numberOfElements: number
  first: boolean
  last: boolean
  empty: boolean
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      sorted: boolean
      empty: boolean
      unsorted: boolean
    }
    offset: number
  }
  sort: {
    sorted: boolean
    empty: boolean
    unsorted: boolean
  }
}
