import { User } from "@/types/user"

export interface SessionValidationResult {
  isValid: boolean
  user: User | null
  error: string | null
}

export interface UseSessionValidationReturn {
  isValidating: boolean
  sessionData: SessionValidationResult | null
  validateSession: () => Promise<SessionValidationResult>
  clearSession: () => void
}