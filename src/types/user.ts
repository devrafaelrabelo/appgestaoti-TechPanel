export interface User {
  id: string
  username: string
  email: string
  roles: string[]
  avatar?: string
  [key: string]: any
}