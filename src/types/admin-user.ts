export interface AdminUser {
  id: string
  username: string
  fullName: string
  email: string
  roles: string[]
  departments: string[]
  position?: string
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "BLOCKED"
  locked: boolean
  twoFactorEnabled: boolean
  emailVerified: boolean
  passwordCompromised: boolean
  createdAt: string
  lastLogin?: string
}

export interface AdminUserFiltersType {
  nameOrEmail?: string
  status?: string
  role?: string
  department?: string
  position?: string
  locked?: boolean
  emailVerified?: boolean
  twoFactorEnabled?: boolean
  passwordCompromised?: boolean
  createdFrom?: string
  createdTo?: string
  lastLoginFrom?: string
  lastLoginTo?: string
  page?: number
  size?: number
  sort?: string
  direction?: "asc" | "desc"
}

export interface AdminUserPagination {
  currentPage: number
  totalPages: number
  totalElements: number
  size: number
  first?: boolean
  last?: boolean
}
