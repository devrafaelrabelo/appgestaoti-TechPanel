"use client"

import { usePathname, useRouter } from "next/navigation"
import { useCallback, useMemo } from "react"
import { SYSTEMS_CONFIG, getSystemFromPath, getBreadcrumbItems, type SystemType } from "./config"

export function useNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  // Get current system based on pathname
  const currentSystem = useMemo(() => {
    return getSystemFromPath(pathname)
  }, [pathname])

  // Get breadcrumb items for current path
  const breadcrumbs = useMemo(() => {
    return getBreadcrumbItems(pathname)
  }, [pathname])

  // Check if we're in a specific system
  const isInSystem = useMemo(() => {
    return currentSystem.id !== "none"
  }, [currentSystem])

  // Check if we're on the system selection page
  const ismodules = useMemo(() => {
    return pathname === "/modules"
  }, [pathname])

  // Navigate to a specific system
  const navigateToSystem = useCallback(
    (systemId: SystemType) => {
      const system = SYSTEMS_CONFIG[systemId]
      if (system) {
        router.push(system.homePath)
      }
    },
    [router],
  )

  // Go back to system selection
  const backTomodules = useCallback(() => {
    router.push("/modules")
  }, [router])

  // Navigate within the current system
  const navigateWithinSystem = useCallback(
    (path: string) => {
      if (currentSystem.id === "none") {
        router.push(path)
      } else {
        // If path already starts with system prefix, use it directly
        if (path.startsWith(`/${currentSystem.id}`)) {
          router.push(path)
        } else {
          // Otherwise, add the system prefix
          router.push(`/${currentSystem.id}${path}`)
        }
      }
    },
    [currentSystem.id, router],
  )

  // Check if a path is active (exact match or parent of current path)
  const isActivePath = useCallback(
    (path: string) => {
      if (path === pathname) return true

      // Check if it's a parent path
      if (path !== "/" && pathname.startsWith(path + "/")) {
        return true
      }

      return false
    },
    [pathname],
  )

  return {
    currentSystem,
    isInSystem,
    ismodules,
    navigateToSystem,
    backTomodules,
    navigateWithinSystem,
    pathname,
    breadcrumbs,
    isActivePath,
    systems: SYSTEMS_CONFIG,
  }
}
