// Tipos e contratos para criação de usuário administrativo

export type LanguageCode = "pt-BR" | "en-US" | "es-ES"
export type ThemePreference = "light" | "dark" | "system"
export type InvitationStatus = "PENDING" | "SENT" | "ACCEPTED" | "EXPIRED" | "CANCELED"

export interface AddressInput {
  street: string
  number: string
  complement?: string | null
  city: string
  neighborhood?: string | null
  state: string
  country: string
  postalCode: string
}

export interface AddressForm {
  zipCode: string
  street: string
  number: string
  complement?: string
  neighborhood?: string
  city: string
  state: string
}

export interface AdminUserCreatePayload {
  firstName: string
  lastName: string
  fullName: string
  socialName?: string | null
  username: string
  email: string
  cpf?: string | null
  birthDate?: string | null // ISO: YYYY-MM-DD
  interfaceTheme?: ThemePreference
  timezone?: string
  preferredLanguage?: LanguageCode
  invitationStatus?: InvitationStatus
  avatar?: string | null
  origin?: string // ex: "admin"
  privacyPolicyVersion?: string | null
  cookieConsentStatus?: "granted" | "denied" | "unset"
  managerId?: string | null
  twoFactorEnabled?: boolean
  lastKnownLocation?: string | null
  accountSuspendedReason?: string | null
  emailVerified?: boolean

  roleIds?: string[]
  departmentIds?: string[]
  groupIds?: string[]
  functionIds?: string[]
  positionId?: string | null
  statusId?: string | null

  personalPhoneNumbers?: string[]

  address?: AddressInput

  requestedById?: string | null

  // Dados pessoais
  nome: string
  rg?: string
  telefone?: string
  celular?: string

  // Dados do usuário
  login: string
  senha: string
  confirmarSenha: string

  // Permissões e grupos
  grupoUsuario?: string
  nivelAcesso?: string
  departamento?: string
  cargo?: string

  // Status
  ativo: boolean
  bloqueado: boolean

  // Observações
  observacoes?: string

  // Opcional no front; pode ser injetado pelo hook, não exibido no formulário
  password?: string
}

export interface AdminUserCreate {
  username: string
  fullName: string
  email: string
  cpf?: string
  phone?: string
  department?: string
  position?: string
  userGroup?: string
  accessLevel?: string
  roles: string[]
  permissions: string[]
  temporaryPassword: boolean
  sendWelcomeEmail: boolean
  requirePasswordChange: boolean
  twoFactorEnabled: boolean
  active: boolean
  notes?: string
  address?: AddressForm
}

export interface CpfConsultResult {
  valid: boolean
  name?: string
  error?: string
  data?: {
    nome?: string
    cpf?: string
    dataNascimento?: string
    endereco?: {
      logradouro?: string
      numero?: string
      complemento?: string
      bairro?: string
      cidade?: string
      uf?: string
      cep?: string
    }
  }
}

export interface CpfSearchRequest {
  cpf: string
  birthDate: string // ISO YYYY-MM-DD
}

export interface CpfConsultAddress {
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  uf?: string
  cep?: string
}

export interface CpfConsultData {
  nome?: string
  cpf?: string
  dataNascimento?: string
  endereco?: CpfConsultAddress
}

export interface CpfConsultResponse {
  valid: boolean
  name?: string
  data?: CpfConsultData
  error?: string
}

export interface CreateUserResult {
  id: string
  username: string
  email: string
  fullName: string
}

export interface CreateUserResponse {
  success: boolean
  user?: {
    id: string
    username: string
    fullName: string
    email: string
    temporaryPassword?: string
  }
  error?: string
}

export interface RoleItem {
  id: string
  name: string
  description?: string
}

export interface PermissionItem {
  id: string
  name: string
  description?: string
  action?: string
  resource?: string
}
