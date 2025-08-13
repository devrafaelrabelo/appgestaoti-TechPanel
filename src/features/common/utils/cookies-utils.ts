"use client"

const isBrowser = typeof window !== "undefined"

/**
 * Interface for cookie options
 */
export interface CookieOptions {
  /** Number of days until the cookie expires */
  days?: number
  /** Cookie path */
  path?: string
  /** Whether the cookie should be secure (HTTPS only) */
  secure?: boolean
  /** SameSite attribute for the cookie */
  sameSite?: "Strict" | "Lax" | "None"
  /** Whether the cookie should be HttpOnly */
  httpOnly?: boolean
}

/**
 * Interface for the cookies utility
 */
export interface CookiesUtils {
  /**
   * Get a cookie value by name
   * @param name The name of the cookie
   * @returns The cookie value or null if not found
   */
  get(name: string): string | null

  /**
   * Set a cookie with the given name and value
   * @param name The name of the cookie
   * @param value The value to store
   * @param options Cookie options (expiration, path, etc.)
   */
  set(name: string, value: string, options?: CookieOptions): void

  /**
   * Remove a cookie by name
   * @param name The name of the cookie to remove
   * @param path The path of the cookie (defaults to "/")
   */
  remove(name: string, path?: string): void

  /**
   * Get all cookies as a record object
   * @returns An object with all cookies
   */
  getAll(): Record<string, string>

  /**
   * Remove multiple cookies by name
   * @param names Array of cookie names to remove
   * @param path The path of the cookies (defaults to "/")
   */
  removeMultiple(names: string[], path?: string): void

  /**
   * Clear all cookies
   */
  clearAll(): void

  /**
   * Clear authentication-related cookies
   */
  clearAuth(): void
}

/**
 * Cookie utilities implementation
 */
export const cookies: CookiesUtils = {
  get: (name: string): string | null => {
    if (!isBrowser) return null

    try {
      const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
      return match ? decodeURIComponent(match[2]) : null
    } catch (error) {
      console.error("Error getting cookie:", error)
      return null
    }
  },

  set: (name: string, value: string, options: CookieOptions = {}): void => {
    if (!isBrowser) return

    try {
      const { days = 7, path = "/", secure = true, sameSite = "Lax", httpOnly = false } = options

      const expires = days ? `; expires=${new Date(Date.now() + days * 864e5).toUTCString()}` : ""
      const securePart = secure ? "; secure" : ""
      const sameSitePart = `; samesite=${sameSite}`
      const httpOnlyPart = httpOnly ? "; httponly" : ""

      document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=${path}${securePart}${sameSitePart}${httpOnlyPart}`
    } catch (error) {
      console.error("Error setting cookie:", error)
    }
  },

  remove: (name: string, path = "/"): void => {
    if (!isBrowser) return

    try {
      document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=Lax; secure`
    } catch (error) {
      console.error("Error removing cookie:", error)
    }
  },

  getAll: (): Record<string, string> => {
    if (!isBrowser) return {}

    try {
      const cookieString = document.cookie
      const cookies: Record<string, string> = {}

      cookieString.split(";").forEach((cookie) => {
        const [name, value] = cookie.trim().split("=")
        if (name && value) {
          cookies[name] = decodeURIComponent(value)
        }
      })

      return cookies
    } catch (error) {
      console.error("Error getting all cookies:", error)
      return {}
    }
  },

  removeMultiple: (names: string[], path = "/"): void => {
    if (!isBrowser) return

    try {
      names.forEach((name) => {
        document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=Lax; secure`
      })
    } catch (error) {
      console.error("Error removing multiple cookies:", error)
    }
  },

  clearAll: (): void => {
    if (!isBrowser) return

    try {
      const cookieList = document.cookie.split(";")

      for (let i = 0; i < cookieList.length; i++) {
        const cookie = cookieList[i]
        const eqPos = cookie.indexOf("=")
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=Lax; secure`
      }
    } catch (error) {
      console.error("Error clearing all cookies:", error)
    }
  },

  clearAuth: (): void => {
    if (!isBrowser) return

    try {
      const authCookies = ["auth_token", "refresh_token", "user_data", "auth_remember"]
      authCookies.forEach((name) => {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=Lax; secure`
      })
    } catch (error) {
      console.error("Error clearing auth cookies:", error)
    }
  },
}

// For backward compatibility, also export as default
export default cookies
