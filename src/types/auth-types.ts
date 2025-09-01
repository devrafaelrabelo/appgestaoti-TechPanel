export interface User {
  id: string
  username: string
  email: string
  roles: string[]
  [key: string]: any
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialLoading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>
  logout: (options?: { suppressRedirect?: boolean }) => Promise<void>
  refreshAuth: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
}