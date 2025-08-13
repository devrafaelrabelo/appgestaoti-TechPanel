export interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: string
  createdAt: string
  updatedAt: string
}

export interface CreatePermissionRequest {
  name: string
  description: string
  resource: string
  action: string
}

export interface UpdatePermissionRequest {
  name: string
  description: string
  resource: string
  action: string
}

export interface PermissionFilters {
  search: string
  resource: string
  action: string
}

export interface PermissionStats {
  total: number
  byResource: Record<string, number>
  byAction: Record<string, number>
  mostUsedResource: string
  mostUsedAction: string
}

export const COMMON_RESOURCES = [
  "user",
  "role",
  "permission",
  "resource",
  "requestuser",
  "corporatephone",
  "internalextension",
  "resourcetype",
  "resourcestatus",
]

export const COMMON_ACTIONS = ["create", "read", "update", "delete", "list", "view", "manage", "assign", "unassign"]

export const ACTION_COLORS: Record<string, string> = {
  create: "bg-green-100 text-green-800",
  read: "bg-blue-100 text-blue-800",
  update: "bg-yellow-100 text-yellow-800",
  delete: "bg-red-100 text-red-800",
  list: "bg-purple-100 text-purple-800",
  view: "bg-indigo-100 text-indigo-800",
  manage: "bg-orange-100 text-orange-800",
  assign: "bg-teal-100 text-teal-800",
  unassign: "bg-gray-100 text-gray-800",
}
