export interface InternalExtension {
  id: number
  extension: string
  application: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateInternalExtensionData {
  extension: string
  application: string
}

export interface UpdateInternalExtensionData extends CreateInternalExtensionData {
  id: number
}

export interface InternalExtensionFilters {
  search?: string
  extension?: string
  application?: string
}

export const EXTENSION_APPLICATIONS = [
  "Zoiper",
  "X-Lite",
  "3CX Phone",
  "MicroSIP",
  "Linphone",
  "Softphone",
  "Outros",
] as const

export type ExtensionApplication = (typeof EXTENSION_APPLICATIONS)[number]
