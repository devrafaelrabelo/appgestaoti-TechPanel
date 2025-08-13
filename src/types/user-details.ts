export interface UserDetails {
  id: string
  username: string
  fullName: string
  socialName?: string | null
  email: string
  cpf?: string | null
  birthDate?: string | null
  personalPhoneNumbers?: string[]
  currentCorporatePhones?: string[]
  currentInternalExtensions?: string[]
  roles: string[]
  departments: string[]
  permissions: string[]
  position?: string | null
  functions?: string[]
  status?: string | null
  locked: boolean
  twoFactorEnabled: boolean
  emailVerified: boolean
  firstLogin: boolean
  passwordCompromised: boolean
  preferredLanguage?: string | null
  interfaceTheme?: string | null
  timezone?: string | null
  notificationsEnabled?: boolean
  avatar?: string | null
  invitationStatus?: string | null
  origin?: string | null
  lastKnownLocation?: string | null
  accountSuspendedReason?: string | null
  cookieConsentStatus?: string | null
  createdAt: string
  updatedAt: string
  forcedLogoutAt?: string | null
  passwordLastUpdated?: string | null
  lastLogin?: string | null // not in the DTO, but supported if provided
}
